// Local/traditional-host entry point (not used on Vercel, see api/index.js).
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
