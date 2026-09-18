const mysql = require('mysql2/promise');
require('dotenv').config();

// A pooled connection works locally and on Vercel. Serverless functions spin up
// fresh processes often, so we keep the pool small (connectionLimit) to avoid
// exhausting the database's max-connections limit under concurrent invocations.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: process.env.VERCEL ? 2 : 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
});

module.exports = pool;
