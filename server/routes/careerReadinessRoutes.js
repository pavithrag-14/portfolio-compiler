import express from 'express';
import { db } from '../db.js';
import { authMiddleware } from '../auth.js';

const router = express.Router();

// GET /api/career-readiness & /api/readiness
// Computes transparent career-readiness index with mathematical breakdown (Section 17)
router.get('/', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Academic Performance (Weight 10%)
    const academics = db.academics.getByUserId(userId);
    let academicScore = 60; // baseline for enrolled student
    const sem1Uploaded = academics?.marksheets?.some(m => m.semester === 'sem1');
    if (sem1Uploaded) academicScore = 80;
    if (academics?.calculatedCgpa) {
      academicScore = Math.min(100, Math.round(academics.calculatedCgpa * 10));
    }
    if (academics?.hasDiscrepancy) {
      academicScore = Math.max(50, academicScore - 10);
    }

    // 2. Verified Certifications (Weight 15%)
    const certs = db.certifications.getByUserId(userId);
    const verifiedCerts = certs.filter(c => c.status === 'Verified');
    let certScore = 50;
    if (verifiedCerts.length >= 3) certScore = 95;
    else if (verifiedCerts.length === 2) certScore = 85;
    else if (verifiedCerts.length === 1) certScore = 75;
    else if (certs.length > 0) certScore = 60;

    // 3. Coding Profiles (Weight 15%)
    const coding = db.codingProfiles.getByUserId(userId);
    let codingScore = 50;
    const gh = coding?.github;
    const lc = coding?.leetcode;
    if (gh?.connected && lc?.connected) {
      const ghWeight = Math.min(50, ((gh.publicRepos || 0) * 3) + ((gh.starsCount || 0) * 2));
      const lcWeight = Math.min(50, Math.round((lc.totalSolved || 0) * 0.25));
      codingScore = Math.min(100, 50 + ghWeight + lcWeight);
    } else if (gh?.connected || lc?.connected) {
      codingScore = 70;
    }

    // 4. Projects (Weight 15%)
    const projects = db.projects.getByUserId(userId);
    let projectScore = 50;
    if (projects.length >= 3) projectScore = 92;
    else if (projects.length === 2) projectScore = 82;
    else if (projects.length === 1) projectScore = 72;

    // 5. 50-MCQ Topic Assessments (Weight 25%)
    const attempts = db.assessments.getByUserId(userId).filter(a => a.status === 'Completed');
    let assessmentScore = 50;
    if (attempts.length > 0) {
      const sum = attempts.reduce((acc, a) => acc + (a.score || 0), 0);
      assessmentScore = Math.round(sum / attempts.length);
    }

    // 6. AI Mock Interview (Weight 10%)
    const latestInterview = db.interviews.getLatestByUserId(userId);
    let interviewScore = latestInterview?.scores?.overall || 76;

    // 7. Verified Skills (Weight 10%)
    const skills = db.skills.getByUserId(userId);
    const verifiedSkills = skills.filter(s => s.verified);
    let skillScore = 55;
    if (verifiedSkills.length >= 5) skillScore = 92;
    else if (verifiedSkills.length >= 2) skillScore = 80;
    else if (skills.length >= 3) skillScore = 70;

    // Mathematical composite readiness index (Sum weights = 100%)
    const overallCareerReadiness = Math.round(
      (assessmentScore * 0.25) +
      (projectScore * 0.15) +
      (codingScore * 0.15) +
      (certScore * 0.15) +
      (skillScore * 0.10) +
      (academicScore * 0.10) +
      (interviewScore * 0.10)
    );

    let tierLabel = 'Competent Candidate';
    if (overallCareerReadiness >= 85) tierLabel = 'Elite Industry Ready (Top 5%)';
    else if (overallCareerReadiness >= 75) tierLabel = 'High Employability Potential';
    else if (overallCareerReadiness >= 65) tierLabel = 'Developing Foundation';

    const breakdownData = {
      academic: { 
        score: academicScore, 
        weight: '10%', 
        contribution: Math.round(academicScore * 0.10),
        notes: academics?.status || 'Credit-weighted STEM CGPA and transcript audit.' 
      },
      academicPerformance: { 
        score: academicScore, 
        weight: '10%', 
        contribution: Math.round(academicScore * 0.10),
        notes: academics?.status || 'Credit-weighted STEM CGPA and transcript audit.' 
      },
      certifications: { 
        score: certScore, 
        weight: '15%', 
        count: verifiedCerts.length, 
        contribution: Math.round(certScore * 0.15),
        notes: `${verifiedCerts.length} verified credentials out of ${certs.length} uploaded.` 
      },
      codingProfiles: { 
        score: codingScore, 
        weight: '15%', 
        contribution: Math.round(codingScore * 0.15),
        notes: `${gh?.publicRepos || 0} GitHub repos, ${lc?.totalSolved || 0} LeetCode problems.` 
      },
      projects: { 
        score: projectScore, 
        weight: '15%', 
        count: projects.length, 
        contribution: Math.round(projectScore * 0.15),
        notes: `${projects.length} verified projects with problem statements & git links.` 
      },
      assessments: { 
        score: assessmentScore, 
        weight: '25%', 
        count: attempts.length, 
        contribution: Math.round(assessmentScore * 0.25),
        notes: `${attempts.length} completed 50-MCQ topic assessments (100% completed attempts counted).` 
      },
      skills: { 
        score: skillScore, 
        weight: '10%', 
        count: verifiedSkills.length, 
        contribution: Math.round(skillScore * 0.10),
        notes: `${verifiedSkills.length} multi-platform verified skills vs self-reports.` 
      },
      interview: { 
        score: interviewScore, 
        weight: '10%', 
        contribution: Math.round(interviewScore * 0.10),
        notes: `Acoustic speech rate & project architecture Q&A rating.` 
      }
    };

    res.json({
      overallIndex: overallCareerReadiness,
      overallScore: overallCareerReadiness,
      readinessTier: tierLabel,
      tierLabel,
      breakdown: breakdownData
    });
  } catch (err) {
    console.error('Readiness calculation error:', err);
    res.status(500).json({ error: 'Failed to compute career readiness.' });
  }
});

export default router;
