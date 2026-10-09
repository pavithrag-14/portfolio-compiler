import express from 'express';
import { db } from '../db.js';
import { authMiddleware } from '../auth.js';

const router = express.Router();

export function calculateProfileCompletion(userId) {
  const profile = db.profiles.getByUserId(userId);
  const academics = db.academics.getByUserId(userId);
  const targetRole = profile?.targetRoleId;

  if (!profile) return 0;

  // Mandatory core components (Total 100 points)
  let score = 0;
  
  // 1. Basic Profile Info (35 points)
  if (profile.fullName && profile.fullName.trim().length > 0) score += 10;
  if (profile.college && profile.college.trim().length > 0) score += 7;
  if (profile.degree && profile.degree.trim().length > 0) score += 6;
  if (profile.department && profile.department.trim().length > 0) score += 6;
  if (profile.headline && profile.headline.trim().length > 0) score += 6;

  // 2. Mandatory Semester 1 Marksheet (30 points)
  // (Section 4 & 29: Sem 1 is the ONLY mandatory marksheet. Semesters 2-8 are optional and do not penalize!)
  const hasSem1 = academics?.marksheets?.some(m => m.semester === 'sem1');
  if (hasSem1) score += 30;

  // 3. Target Role Selection (15 points)
  if (targetRole && targetRole.trim().length > 0) score += 15;

  // 4. Skills Added (10 points)
  const skills = db.skills.getByUserId(userId);
  if (skills.length >= 3) score += 10;
  else if (skills.length > 0) score += 5;

  // 5. Projects or GitHub (10 points)
  const projects = db.projects.getByUserId(userId);
  const coding = db.codingProfiles.getByUserId(userId);
  if (projects.length > 0 || coding?.github?.connected) score += 10;

  return Math.min(100, Math.round(score));
}

// GET /api/profile
router.get('/', authMiddleware, (req, res) => {
  const profile = db.profiles.getByUserId(req.user.id);
  const completionPercentage = calculateProfileCompletion(req.user.id);
  res.json({
    profile,
    completionPercentage
  });
});

// PUT /api/profile
router.put('/', authMiddleware, (req, res) => {
  try {
    const updated = db.profiles.upsert(req.user.id, req.body);
    const completionPercentage = calculateProfileCompletion(req.user.id);
    res.json({
      message: 'Profile updated successfully.',
      profile: updated,
      completionPercentage
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

export default router;
