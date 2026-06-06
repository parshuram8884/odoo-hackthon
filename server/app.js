const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Mount
app.use('/api', apiRoutes);

// Base route health check
app.get('/', (req, res) => {
  res.json({ message: 'VendorBridge Procurement ERP API is active' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;