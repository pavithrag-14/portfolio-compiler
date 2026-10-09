import express from 'express';
import { db } from '../db.js';
import { authMiddleware, optionalAuthMiddleware } from '../auth.js';
import { TARGET_ROLE_DEFINITIONS } from '../data/mcqBank.js';

const router = express.Router();

// Helper to compile clean, sanitized portfolio data object
function compilePortfolioPayload(userId, isPublicView = false) {
  const profile = db.profiles.getByUserId(userId) || {};
  const settings = db.portfolios.getByUserId(userId) || {};
  const academics = db.academics.getByUserId(userId);
  const certs = db.certifications.getByUserId(userId);
  const coding = db.codingProfiles.getByUserId(userId);
  const projects = db.projects.getByUserId(userId);
  const skills = db.skills.getByUserId(userId);
  const assessments = db.assessments.getByUserId(userId).filter(a => a.status === 'Completed');
  const interview = db.interviews.getLatestByUserId(userId);

  const targetRole = TARGET_ROLE_DEFINITIONS.find(r => r.id === profile.targetRoleId) || TARGET_ROLE_DEFINITIONS[0];

  // Sanitize academics for privacy (Section 26: Never expose raw marksheet PDF files publicly!)
  const sanitizedAcademics = {
    degree: profile.degree || 'Bachelor of Technology',
    department: profile.department || 'Computer Science and Engineering',
    college: profile.college || 'National Institute of Technology',
    graduationYear: profile.graduationYear || '2026',
    cgpa: academics?.calculatedCgpa || academics?.documentCgpa || 8.85,
    status: academics?.status || 'Academic Records Partially Verified',
    sem1Status: academics?.sem1Status || 'Uploaded & Verified',
    totalSemestersDocumented: academics?.marksheets?.length || 1,
    // On public view, omit raw internal disk file paths
    marksheetsSummary: (academics?.marksheets || []).map(m => ({
      semester: m.semester,
      semesterLabel: m.extractedData?.semester || m.semester.toUpperCase(),
      sgpa: m.extractedData?.sgpa || null,
      passStatus: m.extractedData?.passFailStatus || 'PASS',
      subjectCount: (m.extractedData?.subjects || []).length
    }))
  };

  // Certifications with explicit verification flags (Section 19)
  const sanitizedCerts = certs.map(c => ({
    id: c.id,
    title: c.title || c.name,
    name: c.name || c.title,
    issuer: c.issuer,
    certificateId: c.certificateId,
    issueDate: c.issueDate,
    credentialUrl: c.credentialUrl,
    verificationStatus: c.status,
    isVerified: c.status === 'Verified',
    verificationEvidence: c.verificationEvidence,
    skillsVerified: c.skillsVerified || []
  }));

  // Skills with verification badges
  const sanitizedSkills = skills.map(s => ({
    id: s.id,
    name: s.name,
    category: s.category,
    proficiency: s.proficiency,
    verified: !!s.verified,
    source: s.source
  }));

  const compiled = {
    fullName: profile.fullName || 'Candidate Profile',
    targetRole: targetRole.title,
    cgpa: sanitizedAcademics.cgpa,
    headline: settings?.customHeadline || profile.headline || `${targetRole.title} | Systems Engineer`,
    aboutMe: settings?.customAbout || profile.aboutMe || `Driven student and engineer pursuing high-impact engineering opportunities in ${targetRole.title}.`,
    location: profile.location || 'Bangalore, India',
    email: isPublicView ? (profile.email ? profile.email.replace(/(.{3})(.*)(@.*)/, '$1***$3') : '') : profile.email,
    phone: isPublicView ? '' : profile.phone,
    linkedInUrl: profile.linkedinUrl,
    githubUrl: profile.githubUrl,
    student: {
      fullName: profile.fullName || 'Candidate Profile',
      profilePhoto: profile.avatarUrl || null,
      headline: settings?.customHeadline || profile.headline || `${targetRole.title} | Systems Engineer`,
      aboutMe: settings?.customAbout || profile.aboutMe || `Driven student and engineer pursuing high-impact opportunities in ${targetRole.title}.`,
      location: profile.location || 'Bangalore, India',
      email: isPublicView ? (profile.email ? profile.email.replace(/(.{3})(.*)(@.*)/, '$1***$3') : '') : profile.email,
      phone: isPublicView ? '' : profile.phone,
      linkedInUrl: profile.linkedinUrl,
      githubUrl: profile.githubUrl,
      targetRole: targetRole.title
    },
    settings: {
      slug: settings.slug || 'student',
      isPublic: settings.isPublic !== undefined ? settings.isPublic : true,
      template: settings.template || 'bento',
      theme: settings.theme || 'cyber-dark',
      sectionVisibility: settings.sectionVisibility || {
        showAcademics: true,
        showCertifications: true,
        showCodingStats: true,
        showProjects: true,
        showSkills: true,
        showAssessments: true,
        showInterviewScore: true
      },
      sections: settings.sectionVisibility || {
        showAcademics: true,
        showCertifications: true,
        showCodingStats: true,
        showProjects: true,
        showSkills: true,
        showAssessments: true,
        showInterviewScore: true
      },
      publishedAt: settings.publishedAt
    },
    sections: settings.sectionVisibility || {
      showAcademics: true,
      showCertifications: true,
      showCodingStats: true,
      showProjects: true,
      showSkills: true,
      showAssessments: true,
      showInterviewScore: true
    },
    education: sanitizedAcademics,
    skills: sanitizedSkills,
    projects: projects.map(p => ({
      ...p,
      roleContribution: p.role || p.roleContribution
    })),
    certifications: sanitizedCerts,
    codingProfiles: {
      github: coding?.github,
      leetcode: coding?.leetcode
    },
    assessments: assessments.map(a => ({
      topicId: a.topicId,
      score: a.score,
      completedAt: a.completedAt,
      strengths: a.strengths
    })),
    interviewPerformance: interview ? {
      overall: interview.scores.overall,
      technical: interview.scores.technical,
      communication: interview.scores.communication,
      projectKnowledge: interview.scores.projectKnowledge,
      completedAt: interview.completedAt
    } : null
  };

  return compiled;
}

// GET /api/portfolio/settings
router.get('/settings', authMiddleware, (req, res) => {
  const settings = db.portfolios.getByUserId(req.user.id) || {};
  res.json({
    settings,
    ...settings
  });
});

// PUT /api/portfolio/settings
// Section 20: Customize template, theme, section visibility, ordering
router.put('/settings', authMiddleware, (req, res) => {
  try {
    const current = db.portfolios.getByUserId(req.user.id) || {};
    const updated = db.portfolios.save(req.user.id, {
      ...current,
      ...req.body,
      sectionVisibility: req.body.sections || req.body.sectionVisibility || current.sectionVisibility
    });
    res.json({ message: 'Portfolio settings saved.', settings: updated, ...updated });
  } catch (err) {
    console.error('Portfolio settings error:', err);
    res.status(500).json({ error: 'Failed to update portfolio settings.' });
  }
});

// POST /api/portfolio/publish
// Section 21: Publish live portfolio and update slug
router.post('/publish', authMiddleware, (req, res) => {
  try {
    const { slug, isPublic } = req.body;
    const current = db.portfolios.getByUserId(req.user.id) || {};

    const cleanSlug = (slug || current.slug || `student-${req.user.id.substring(4, 9)}`)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug taken by another user
    const existing = db.portfolios.getBySlug(cleanSlug);
    if (existing && existing.userId !== req.user.id) {
      return res.status(409).json({ error: 'This portfolio URL slug is already taken. Please pick another username or handle.' });
    }

    const updated = db.portfolios.save(req.user.id, {
      ...current,
      slug: cleanSlug,
      isPublic: isPublic !== undefined ? !!isPublic : true,
      publishedAt: new Date().toISOString()
    });

    res.json({
      message: 'Portfolio published successfully!',
      slug: cleanSlug,
      url: `/portfolio/${cleanSlug}`,
      settings: updated,
      ...updated
    });
  } catch (err) {
    console.error('Publish portfolio error:', err);
    res.status(500).json({ error: 'Failed to publish portfolio.' });
  }
});

// GET /api/portfolio/preview
// Authenticated user preview
router.get('/preview', authMiddleware, (req, res) => {
  const payload = compilePortfolioPayload(req.user.id, false);
  res.json({
    portfolio: payload,
    ...payload
  });
});

// GET /api/portfolio/public/:slug
// Public live shareable portfolio endpoint (Section 21 & 26)
router.get('/public/:slug', (req, res) => {
  const settings = db.portfolios.getBySlug(req.params.slug);
  if (!settings || !settings.isPublic) {
    return res.status(404).json({ error: 'Portfolio not found or set to private by the student.' });
  }

  const payload = compilePortfolioPayload(settings.userId, true);
  res.json({
    portfolio: payload,
    ...payload
  });
});

// GET /api/portfolio/resume
// Section 22: Structured resume compiled from verified/approved data
router.get('/resume', authMiddleware, (req, res) => {
  const payload = compilePortfolioPayload(req.user.id, false);
  res.json({
    resume: {
      contact: payload.student,
      education: payload.education,
      verifiedSkills: payload.skills.filter(s => s.verified),
      allSkills: payload.skills,
      projects: payload.projects,
      verifiedCertifications: payload.certifications.filter(c => c.isVerified),
      codingProfiles: payload.codingProfiles,
      assessmentScores: payload.assessments,
      generatedAt: new Date().toISOString()
    }
  });
});

export default router;
