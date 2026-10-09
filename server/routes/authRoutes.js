import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { generateToken, authMiddleware } from '../auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existing = db.users.findByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = db.users.create({ email: cleanEmail, passwordHash });
    
    // Initialize student profile
    const profile = db.profiles.upsert(user.id, {
      fullName: (fullName || '').trim(),
      email: cleanEmail
    });

    // Initialize portfolio slug from name or email
    const baseSlug = (fullName || cleanEmail.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    db.portfolios.save(user.id, { slug: `${baseSlug || 'student'}-${user.id.substring(4, 8)}` });

    const token = generateToken(user);
    res.status(201).json({
      message: 'Account registered successfully.',
      token,
      user: { id: user.id, email: user.email },
      profile
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.users.findByEmail(cleanEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const profile = db.profiles.getByUserId(user.id);
    const token = generateToken(user);

    res.json({
      message: 'Logged in successfully.',
      token,
      user: { id: user.id, email: user.email },
      profile
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.users.findByEmail(cleanEmail);
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address.' });
    }

    const passToSet = newPassword && newPassword.length >= 6 ? newPassword : 'password123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passToSet, salt);
    db.users.updatePassword(user.id, passwordHash);

    res.json({ message: `Password has been reset to '${passToSet}'. You can now log in.` });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ error: 'Internal server error resetting password.' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  const profile = db.profiles.getByUserId(req.user.id);
  res.json({
    user: { id: req.user.id, email: req.user.email },
    profile
  });
});

export default router;
