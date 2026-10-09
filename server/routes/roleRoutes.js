import express from 'express';
import { db } from '../db.js';
import { authMiddleware } from '../auth.js';
import { TARGET_ROLE_DEFINITIONS } from '../data/mcqBank.js';

const router = express.Router();

// GET /api/roles
router.get('/', (req, res) => {
  // If request has auth header, resolve current role
  let currentRole = TARGET_ROLE_DEFINITIONS[0];
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Decode or fallback
    }
  } catch (e) {}

  res.json({
    roles: TARGET_ROLE_DEFINITIONS,
    currentRole
  });
});

const handleSelectRole = (req, res) => {
  try {
    const { roleId, customTitle } = req.body;
    let role = TARGET_ROLE_DEFINITIONS.find(r => r.id === roleId);

    if (!role) {
      // Check for partial match or default to custom
      role = TARGET_ROLE_DEFINITIONS.find(r => r.id === 'custom-role') || TARGET_ROLE_DEFINITIONS[0];
    }

    if (roleId === 'custom-role' && customTitle) {
      role = {
        ...role,
        title: customTitle.trim()
      };
    }

    const updatedProfile = db.profiles.upsert(req.user.id, {
      targetRoleId: role.id,
      headline: `${role.title} Candidate`
    });

    res.json({
      message: `Target role updated to '${role.title}'.`,
      selectedRole: role,
      currentRole: role,
      targetRole: role,
      profile: updatedProfile
    });
  } catch (err) {
    console.error('Role select error:', err);
    res.status(500).json({ error: 'Failed to select target role.' });
  }
};

router.post('/select', authMiddleware, handleSelectRole);
router.put('/select', authMiddleware, handleSelectRole);

export default router;
