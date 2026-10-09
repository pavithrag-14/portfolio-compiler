import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import certRoutes from './routes/certRoutes.js';
import codingRoutes from './routes/codingRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import careerReadinessRoutes from './routes/careerReadinessRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';

import { db } from './db.js';
import { authMiddleware, optionalAuthMiddleware } from './auth.js';
import { TARGET_ROLE_DEFINITIONS } from './data/mcqBank.js';
import { calculateProfileCompletion } from './routes/profileRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/academics', academicRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/certifications', certRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/career-readiness', careerReadinessRoutes);
app.use('/api/readiness', careerReadinessRoutes);
app.use('/api/portfolio', portfolioRoutes);

app.get('/api/dashboard/summary', optionalAuthMiddleware, (req, res) => {
  try {
    const userId = req.user?.id || 'usr_neshat_demo';
    const profile = db.profiles.getByUserId(userId) || {};
    const academics = db.academics.getByUserId(userId);
    const certs = db.certifications.getByUserId(userId);
    const coding = db.codingProfiles.getByUserId(userId);
    const projects = db.projects.getByUserId(userId);
    const skills = db.skills.getByUserId(userId);
    const assessments = db.assessments.getByUserId(userId);
    const completedAssessments = assessments.filter(a => a.status === 'Completed');
    const latestInterview = db.interviews.getLatestByUserId(userId);
    const portfolio = db.portfolios.getByUserId(userId);

    const targetRoleId = profile.targetRoleId || 'fullstack-developer';
    const targetRole = TARGET_ROLE_DEFINITIONS.find(r => r.id === targetRoleId) || TARGET_ROLE_DEFINITIONS[0];

    const profileCompletion = calculateProfileCompletion(userId);

    // Calculate skill match
    let totalTargetWeight = 0;
    let matchedWeight = 0;
    targetRole.requiredSkills.forEach(reqSkill => {
      totalTargetWeight += reqSkill.weight;
      const match = skills.find(s => s.name.toLowerCase().includes(reqSkill.name.toLowerCase()) || reqSkill.name.toLowerCase().includes(s.name.toLowerCase()));
      if (match) {
        matchedWeight += reqSkill.weight * (match.proficiency / 100);
      }
    });
    const skillMatchPercentage = totalTargetWeight > 0 ? Math.round((matchedWeight / totalTargetWeight) * 100) : 50;

    // Career readiness quick calculation
    const overallCareerReadiness = Math.min(100, Math.round(
      (profileCompletion * 0.2) +
      (skillMatchPercentage * 0.3) +
      (Math.min(100, projects.length * 30) * 0.2) +
      (latestInterview ? latestInterview.scores.overall * 0.15 : 60 * 0.15) +
      (completedAssessments.length > 0 ? (completedAssessments.reduce((acc, a) => acc + a.score, 0) / completedAssessments.length) * 0.15 : 55 * 0.15)
    ));

    const verifiedCertsCount = certs.filter(c => c.status === 'Verified').length;
    const sem1Uploaded = academics?.marksheets?.some(m => m.semester === 'sem1');
    const cgpaVal = academics?.calculatedCgpa || academics?.documentCgpa || 0;
    const academicStatusVal = academics?.status || (sem1Uploaded ? 'Academic Records Partially Verified' : 'Pending Verification');
    const totalTopicsCount = (targetRole.topics || []).length || 3;

    res.json({
      // Flattened properties for direct UI consumption & test suites
      studentName: profile.fullName || 'Student Candidate',
      email: profile.email || req.user?.email || 'neshat@example.com',
      targetRole: targetRole.title,
      targetRoleId: targetRole.id,
      profileCompletion,
      academicVerification: academicStatusVal,
      totalSemestersUploaded: academics?.marksheets?.length || 0,
      cgpa: cgpaVal,
      calculatedCgpa: academics?.calculatedCgpa || cgpaVal,
      cgpaDiscrepancy: !!academics?.hasDiscrepancy,
      certificationCount: certs.length,
      verifiedCertCount: verifiedCertsCount,
      githubConnected: !!coding?.github?.connected,
      githubStats: coding?.github || {},
      leetcodeConnected: !!coding?.leetcode?.connected,
      leetcodeStats: coding?.leetcode || {},
      projectCount: projects.length,
      projectsCount: projects.length,
      skills,
      skillsCount: skills.length,
      skillMatchPercentage,
      assessmentStatus: `${completedAssessments.length}/${totalTopicsCount} Completed`,
      interviewCompleted: !!latestInterview,
      interviewScore: latestInterview?.scores?.overall || 0,
      careerReadinessScore: overallCareerReadiness,
      portfolioStatus: portfolio?.publishedAt ? 'Published' : 'Draft Ready',
      portfolioSlug: portfolio?.slug || 'student',
      portfolioUrl: portfolio?.slug ? `/portfolio/${portfolio.slug}` : '',

      // Structured section objects for Section 3 & 31
      academic: {
        status: academicStatusVal,
        sem1Verified: sem1Uploaded,
        additionalRecordsCount: Math.max(0, (academics?.marksheets?.length || 0) - 1),
        cgpa: cgpaVal,
        hasDiscrepancy: !!academics?.hasDiscrepancy
      },
      certifications: {
        totalUploaded: certs.length,
        verifiedCount: verifiedCertsCount,
        pendingCount: certs.filter(c => c.status === 'Pending Verification').length
      },
      codingProfiles: {
        githubConnected: !!coding?.github?.connected,
        githubUsername: coding?.github?.username || '',
        leetcodeConnected: !!coding?.leetcode?.connected,
        leetcodeSolved: coding?.leetcode?.totalSolved || 0
      },
      assessments: {
        completedCount: completedAssessments.length,
        totalTopics: totalTopicsCount,
        topicScores: completedAssessments.map(a => ({ topicId: a.topicId, score: a.score }))
      },
      mockInterview: {
        status: latestInterview ? 'Completed' : 'Not Taken',
        score: latestInterview ? latestInterview.scores.overall : null
      },
      portfolio: {
        status: portfolio?.publishedAt ? 'Published' : 'Draft Ready',
        slug: portfolio?.slug || '',
        isPublic: !!portfolio?.isPublic,
        url: portfolio?.slug ? `/portfolio/${portfolio.slug}` : ''
      }
    });
  } catch (err) {
    console.error('Dashboard summary error:', err);
    res.status(500).json({ error: 'Failed to compile dashboard summary.' });
  }
});

// Central Error Handler (Section 27)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`[Portfolio Compiler Backend] Running on http://127.0.0.1:${PORT}`);
});
