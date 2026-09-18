// Demo-data store used when no MySQL host is configured (DB_HOST unset).
// Implements only the handful of queries the routes issue. Data lives in
// process memory, so on serverless hosts it resets whenever an instance is
// recycled. Use a real MySQL database for anything persistent.
const bcrypt = require('bcryptjs');

const services = [
  { id: 1, title: 'Web Development', description: 'Custom, responsive websites and web applications built with modern frameworks.', icon: 'code', sort_order: 1 },
  { id: 2, title: 'API Integration', description: 'Designing and connecting REST/GraphQL APIs to power your product.', icon: 'plug', sort_order: 2 },
  { id: 3, title: 'Database Design', description: 'Schema design, optimization, and migrations for relational databases.', icon: 'database', sort_order: 3 },
  { id: 4, title: 'Cloud Deployment', description: 'Deploying and configuring apps on cloud platforms with CI/CD.', icon: 'cloud', sort_order: 4 },
];
const users = [
  { id: 1, user_id: 'demo', password_hash: bcrypt.hashSync('demo1234', 10), display_name: 'Demo User' },
];
const contacts = [];

async function query(sql, params = []) {
  const s = sql.replace(/\s+/g, ' ').trim();
  if (s.startsWith('SELECT id, title, description, icon FROM services')) {
    return [services.map(({ id, title, description, icon }) => ({ id, title, description, icon }))];
  }
  if (s.startsWith('SELECT id FROM users WHERE user_id')) {
    return [users.filter((u) => u.user_id === params[0]).map((u) => ({ id: u.id }))];
  }
  if (s.startsWith('SELECT id, user_id, password_hash, display_name FROM users')) {
    return [users.filter((u) => u.user_id === params[0]).slice(0, 1)];
  }
  if (s.startsWith('INSERT INTO users')) {
    const row = { id: users.length + 1, user_id: params[0], password_hash: params[1], display_name: params[2] };
    users.push(row);
    return [{ insertId: row.id }];
  }
  if (s.startsWith('INSERT INTO contact_messages')) {
    contacts.push({ id: contacts.length + 1, name: params[0], email: params[1], subject: params[2], message: params[3] });
    return [{ insertId: contacts.length }];
  }
  throw new Error(`memory store: unsupported query: ${s}`);
}

module.exports = { query };
