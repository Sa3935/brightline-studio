const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const USER_ID_RE = /^[a-zA-Z0-9_.-]{3,64}$/;

function signToken(user) {
  return jwt.sign(
    { sub: user.id, userId: user.user_id, displayName: user.display_name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );
}

// POST /api/auth/register
// Not part of the original page list, but included so the users table can be
// populated without touching the database by hand. The Login page has a small
// "create an account" toggle that calls this endpoint.
router.post('/register', async (req, res) => {
  try {
    const { userId, password, displayName } = req.body || {};

    if (!userId || !password) {
      return res.status(400).json({ error: 'userId and password are required' });
    }
    if (!USER_ID_RE.test(userId)) {
      return res.status(400).json({ error: 'userId must be 3-64 characters: letters, numbers, ., _, -' });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE user_id = ?', [userId]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'That user ID is already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      'INSERT INTO users (user_id, password_hash, display_name) VALUES (?, ?, ?)',
      [userId, passwordHash, displayName || null]
    );

    const user = { id: result.insertId, user_id: userId, display_name: displayName || null };
    const token = signToken(user);
    return res.status(201).json({
      token,
      user: { userId: user.user_id, displayName: user.display_name },
    });
  } catch (err) {
    console.error('register error', err);
    return res.status(500).json({ error: 'Could not create account' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body || {};
    if (!userId || !password) {
      return res.status(400).json({ error: 'userId and password are required' });
    }

    const [rows] = await pool.query(
      'SELECT id, user_id, password_hash, display_name FROM users WHERE user_id = ? LIMIT 1',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid user ID or password' });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid user ID or password' });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: { userId: user.user_id, displayName: user.display_name },
    });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me - lets the frontend verify a stored token on page load
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { userId: req.user.userId, displayName: req.user.displayName } });
});

module.exports = router;
