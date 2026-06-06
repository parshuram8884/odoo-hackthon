const app = require('./app');
const { initDb } = require('./db/index');
require('dotenv').config();

const port = process.env.PORT || 5000;

// Initialize database schemas and start listening
initDb().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((err) => {
  console.error('Database connection failed to initialize:', err);
  // Start server anyway as fallback
  app.listen(port, () => {
    console.log(`Server is running on port ${port} (database offline)`);
  });
});