// Optional convenience script: creates one demo login so you can test the app
// immediately after running schema.sql. Usage: npm run seed
// Reads DEMO_USER_ID / DEMO_PASSWORD from env, falling back to demo/demo1234.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./pool');

async function seed() {
  const userId = process.env.DEMO_USER_ID || 'demo';
  const password = process.env.DEMO_PASSWORD || 'demo1234';

  const [existing] = await pool.query('SELECT id FROM users WHERE user_id = ?', [userId]);
  if (existing.length > 0) {
    console.log(`User "${userId}" already exists, skipping.`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await pool.query(
    'INSERT INTO users (user_id, password_hash, display_name) VALUES (?, ?, ?)',
    [userId, passwordHash, 'Demo User']
  );

  console.log(`Created demo user -> userId: "${userId}", password: "${password}"`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
