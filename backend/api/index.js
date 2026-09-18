// Vercel serverless entry point. Vercel treats every file under /api as its
// own function; exporting the Express app lets it handle all /api/* routes
// through this single function (see ../vercel.json for the rewrite rule).
const app = require('../app');

module.exports = app;
