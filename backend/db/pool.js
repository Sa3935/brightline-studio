const mysql = require('mysql2/promise');
require('dotenv').config();

// A pooled connection works locally and on Vercel. Serverless functions spin up
// fresh processes often, so we keep the pool small (connectionLimit) to avoid
// exhausting the database's max-connections limit under concurrent invocations.
// With no DB_HOST configured, fall back to the in-memory demo dataset.
const pool = process.env.DB_HOST
  ? mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: process.env.VERCEL ? 2 : 10,
      queueLimit: 0,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
    })
  : require('./memory');

if (!process.env.DB_HOST) console.warn('DB_HOST not set: using in-memory demo data (not persistent).');

module.exports = pool;
