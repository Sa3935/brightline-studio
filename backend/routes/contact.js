const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact - anyone can submit, logged in or not
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are required' });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }
    if (String(message).length > 5000) {
      return res.status(400).json({ error: 'Message is too long' });
    }

    await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [String(name).trim(), String(email).trim(), subject ? String(subject).trim() : null, String(message).trim()]
    );

    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error('contact submit error', err);
    return res.status(500).json({ error: 'Could not save your message. Please try again.' });
  }
});

module.exports = router;
