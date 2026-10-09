import express from 'express';
import { db } from '../db.js';
import { authMiddleware } from '../auth.js';
import { TARGET_ROLE_DEFINITIONS } from '../data/mcqBank.js';

const router = express.Router();

// Helper to determine skill category
function categorizeSkill(skillName) {
  const lower = skillName.toLowerCase();
  if (/python|javascript|typescript|c\+\+|java|c#|golang|rust|ruby|php|kotlin|swift/i.test(lower)) return 'Programming';
  if (/react|vue|angular|html|css|tailwind|node|express|next\.js|frontend|backend|fullstack/i.test(lower)) return 'Web Development';
  if (/ui|ux|figma|wirefram|prototyp|usability|design system|user research|interaction/i.test(lower)) return 'UI/UX';
  if (/data science|pandas|numpy|matplotlib|statistics|data analytics|powerbi|tableau/i.test(lower)) return 'Data Science';
  if (/machine learning|deep learning|ai|neural|pytorch|tensorflow|scikit|nlp|cv|llm/i.test(lower)) return 'AI/ML';
  if (/sql|mysql|postgresql|mongodb|database|redis|prisma|orm/i.test(lower)) return 'Database';
  if (/aws|azure|gcp|cloud|serverless|lambda|s3/i.test(lower)) return 'Cloud';
  if (/docker|kubernetes|ci\/cd|devops|terraform|jenkins|github actions/i.test(lower)) return 'DevOps';
  if (/git|github|linux|vscode|postman|bash|terminal/i.test(lower)) return 'Tools';
  if (/communication|leadership|problem solving|teamwork|presentation|agile/i.test(lower)) return 'Soft Skills';
  return 'Other';
}

// GET /api/skills
router.get('/', authMiddleware, (req, res) => {
  const skills = db.skills.getByUserId(req.user.id);
  res.json({
    skills,
    totalCount: skills.length
  });
});

// POST /api/skills
router.post('/', authMiddleware, (req, res) => {
  try {
    const { name, category, proficiency } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Skill name is required.' });
    }

    const cleanName = name.trim();
    const created = db.skills.add(req.user.id, {
      name: cleanName,
      category: category || categorizeSkill(cleanName),
      proficiency: Number(proficiency) || 80,
      source: 'manual',
      verified: false
    });

    const allSkills = db.skills.getByUserId(req.user.id);

    res.status(201).json({
      message: 'Skill added.',
      skill: created,
      skills: allSkills
    });
  } catch (err) {
    console.error('Skill add error:', err);
    res.status(500).json({ error: 'Failed to add skill.' });
  }
});

// POST /api/skills/infer
// Section 10: Infer skills from Projects, GitHub, Certifications, Academic records, Assessment performance
router.post('/infer', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id;
    const existingSkills = db.skills.getByUserId(userId);
    const existingNames = new Set(existingSkills.map(s => s.name.toLowerCase()));

    const newSkillsToAdd = [];

    // 1. Infer from Projects
    const projects = db.projects.getByUserId(userId);
    projects.forEach(p => {
      (p.technologies || []).forEach(tech => {
        if (!existingNames.has(tech.toLowerCase())) {
          existingNames.add(tech.toLowerCase());
          newSkillsToAdd.push({
            name: tech,
            category: categorizeSkill(tech),
            proficiency: 82,
            source: 'Project Tech Stack',
            verified: false
          });
        }
      });
    });

    // 2. Infer from GitHub Profiles
    const coding = db.codingProfiles.getByUserId(userId);
    if (coding?.github?.connected) {
      (coding.github.topLanguages || []).forEach(l => {
        const langName = typeof l === 'string' ? l : l.language;
        if (langName && !existingNames.has(langName.toLowerCase())) {
          existingNames.add(langName.toLowerCase());
          newSkillsToAdd.push({
            name: langName,
            category: categorizeSkill(langName),
            proficiency: 85,
            source: 'GitHub Repository Analysis',
            verified: true
          });
        }
      });
    }

    // 3. Infer from Verified Certifications
    const certs = db.certifications.getByUserId(userId);
    certs.forEach(c => {
      (c.skillsVerified || []).forEach(s => {
        if (!existingNames.has(s.toLowerCase())) {
          existingNames.add(s.toLowerCase());
          newSkillsToAdd.push({
            name: s,
            category: categorizeSkill(s),
            proficiency: 88,
            source: 'Verified Certificate',
            verified: c.status === 'Verified'
          });
        }
      });
    });

    // 4. Infer from Academic Records (passed subjects)
    const academics = db.academics.getByUserId(userId);
    (academics?.marksheets || []).forEach(m => {
      (m.extractedData?.subjects || []).forEach(sub => {
        if (sub.grade !== 'F' && sub.status !== 'FAIL') {
          let candidate = null;
          if (sub.name.includes('Data Structures')) candidate = 'Data Structures';
          else if (sub.name.includes('Algorithms')) candidate = 'Algorithms';
          else if (sub.name.includes('Database')) candidate = 'Database Systems';
          else if (sub.name.includes('Operating Systems')) candidate = 'Operating Systems';
          else if (sub.name.includes('Computer Networks')) candidate = 'Computer Networks';
          else if (sub.name.includes('Full Stack') || sub.name.includes('Web')) candidate = 'Web Development';
          else if (sub.name.includes('Machine Learning')) candidate = 'Machine Learning';

          if (candidate && !existingNames.has(candidate.toLowerCase())) {
            existingNames.add(candidate.toLowerCase());
            newSkillsToAdd.push({
              name: candidate,
              category: categorizeSkill(candidate),
              proficiency: Math.min(100, Math.round((sub.gradePoint || 9) * 10)),
              source: 'Academic Transcript',
              verified: true
            });
          }
        }
      });
    });

    // 5. Infer from Completed 50-MCQ Assessments
    const assessments = db.assessments.getByUserId(userId).filter(a => a.status === 'Completed');
    assessments.forEach(a => {
      const topicName = a.topicName || a.topicId;
      if (!existingNames.has(topicName.toLowerCase())) {
        existingNames.add(topicName.toLowerCase());
        newSkillsToAdd.push({
          name: topicName,
          category: categorizeSkill(topicName),
          proficiency: a.score,
          source: '50-MCQ Assessment',
          verified: true
        });
      }
    });

    // Save newly inferred skills into database
    newSkillsToAdd.forEach(s => {
      db.skills.add(userId, s);
    });

    const updatedSkills = db.skills.getByUserId(userId);

    res.json({
      message: `Inferred ${newSkillsToAdd.length} technical skills across your projects, GitHub repositories, and transcripts.`,
      inferredCount: newSkillsToAdd.length,
      skills: updatedSkills
    });
  } catch (err) {
    console.error('Skill inference error:', err);
    res.status(500).json({ error: 'Failed to infer skills from candidate artifacts.' });
  }
});

// DELETE /api/skills/:id
router.delete('/:id', authMiddleware, (req, res) => {
  db.skills.delete(req.params.id);
  const updatedSkills = db.skills.getByUserId(req.user.id);
  res.json({ message: 'Skill deleted.', skills: updatedSkills });
});

// GET /api/skills/gap-analysis
// Section 13: Compare Student's current skills vs Target Role Requirements
router.get('/gap-analysis', authMiddleware, (req, res) => {
  try {
    const profile = db.profiles.getByUserId(req.user.id) || {};
    const queryRoleId = req.query.roleId;
    const targetRoleId = queryRoleId || profile?.targetRoleId || 'fullstack-developer';
    const targetRole = TARGET_ROLE_DEFINITIONS.find(r => r.id === targetRoleId) || TARGET_ROLE_DEFINITIONS[0];

    const studentSkills = db.skills.getByUserId(req.user.id);
    const completedAssessments = db.assessments.getByUserId(req.user.id).filter(a => a.status === 'Completed');
    const verifiedCerts = db.certifications.getByUserId(req.user.id).filter(c => c.status === 'Verified');

    const strongSkills = [];
    const moderateSkills = [];
    const weakSkills = [];
    const missingSkills = [];

    let totalWeightMatched = 0;
    let totalPossibleWeight = 0;

    targetRole.requiredSkills.forEach(reqSkill => {
      totalPossibleWeight += reqSkill.weight;

      // Find matching student skill
      const match = studentSkills.find(s => 
        s.name.toLowerCase().includes(reqSkill.name.toLowerCase()) || 
        reqSkill.name.toLowerCase().includes(s.name.toLowerCase())
      );

      // Check verified evidence sources (Section 13 & 15: Do not treat unverified claims as equivalent to verified evidence)
      const hasAssessmentEvidence = completedAssessments.some(a => 
        a.topicId.toLowerCase().includes(reqSkill.name.toLowerCase().substring(0, 4)) ||
        (reqSkill.name.toLowerCase().includes('python') && a.topicId === 'python') ||
        (reqSkill.name.toLowerCase().includes('data structures') && a.topicId === 'dsa') ||
        (reqSkill.name.toLowerCase().includes('sql') && a.topicId === 'sql') ||
        (reqSkill.name.toLowerCase().includes('machine learning') && a.topicId === 'ml') ||
        (reqSkill.name.toLowerCase().includes('figma') && a.topicId === 'ui-ux') ||
        (reqSkill.name.toLowerCase().includes('design') && a.topicId === 'ui-ux') ||
        (reqSkill.name.toLowerCase().includes('react') && a.topicId === 'web-dev') ||
        (reqSkill.name.toLowerCase().includes('docker') && a.topicId === 'cloud-devops')
      );

      const hasCertEvidence = verifiedCerts.some(c => 
        (c.skillsVerified || []).some(sv => sv.toLowerCase().includes(reqSkill.name.toLowerCase()))
      );

      const isVerified = (match && match.verified) || hasAssessmentEvidence || hasCertEvidence;

      if (!match) {
        missingSkills.push({
          name: reqSkill.name,
          category: reqSkill.category,
          priority: reqSkill.priority,
          requiredProficiency: reqSkill.weight,
          reason: `Core competency required for ${targetRole.title}.`
        });
      } else {
        const effectiveProficiency = isVerified 
          ? Math.min(100, match.proficiency + 5) 
          : match.proficiency;

        const skillReport = {
          name: reqSkill.name,
          studentProficiency: effectiveProficiency,
          targetBenchmark: reqSkill.weight,
          category: reqSkill.category,
          verified: isVerified,
          evidenceType: hasAssessmentEvidence ? '50-MCQ Topic Assessment' : hasCertEvidence ? 'Verified Certificate' : 'Self-Reported / Project'
        };

        if (effectiveProficiency >= 80) {
          strongSkills.push(skillReport);
          totalWeightMatched += reqSkill.weight * (effectiveProficiency / 100);
        } else if (effectiveProficiency >= 60) {
          moderateSkills.push(skillReport);
          totalWeightMatched += reqSkill.weight * (effectiveProficiency / 100);
        } else {
          weakSkills.push(skillReport);
          totalWeightMatched += reqSkill.weight * (effectiveProficiency / 100);
        }
      }
    });

    const skillMatchPercentage = totalPossibleWeight > 0 
      ? Math.round((totalWeightMatched / totalPossibleWeight) * 100) 
      : 50;

    // Recommended learning priorities ranked by missing critical and weak skills
    const recommendations = [
      ...missingSkills.filter(s => s.priority === 'Critical').map(s => ({ skill: s.name, reason: 'Critical Missing Competency', urgency: 'Immediate' })),
      ...weakSkills.map(s => ({ skill: s.name, reason: 'Proficiency below industry benchmark', urgency: 'High' })),
      ...missingSkills.filter(s => s.priority !== 'Critical').map(s => ({ skill: s.name, reason: 'Recommended for competitive edge', urgency: 'Medium' }))
    ];

    res.json({
      roleTitle: targetRole.title,
      targetRole: targetRole.title,
      overallMatch: skillMatchPercentage,
      skillMatchPercentage,
      strongSkills,
      moderateSkills,
      weakSkills,
      missingSkills,
      recommendations,
      radarData: targetRole.requiredSkills.map(reqSkill => {
        const found = studentSkills.find(s => s.name.toLowerCase().includes(reqSkill.name.toLowerCase()) || reqSkill.name.toLowerCase().includes(s.name.toLowerCase()));
        return {
          skill: reqSkill.name,
          current: found ? found.proficiency : 20,
          target: reqSkill.weight
        };
      })
    });
  } catch (err) {
    console.error('Skill gap analysis error:', err);
    res.status(500).json({ error: 'Failed to compute skill gap analysis.' });
  }
});

export default router;
