const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

// GET /api/services - public list of services for the Service page
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, description, icon FROM services ORDER BY sort_order ASC, id ASC'
    );
    res.json({ services: rows });
  } catch (err) {
    console.error('services fetch error', err);
    res.status(500).json({ error: 'Could not load services' });
  }
});

module.exports = router;
