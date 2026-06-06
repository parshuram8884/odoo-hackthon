const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { User, Rfq, Quotation, PurchaseOrder, Invoice } = require('../models');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vendor_bridge';

const initDb = async () => {
  try {
    console.log('Connecting to MongoDB database...');
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connection successful!');

    // Seed default Users if empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const demoHash = await bcrypt.hash('••••••••', 10);
      await User.insertMany([
        { id: 'usr-1', email: 'admin@vendorbridge.com', role: 'Admin', passwordHash: demoHash },
        { id: 'usr-2', email: 'manager@vendorbridge.com', role: 'Admin', passwordHash: demoHash },
        { id: 'usr-3', email: 'vendor@vendorbridge.com', role: 'Vendor', passwordHash: demoHash }
      ]);
      console.log('Seeded initial users.');
    }
  } catch (error) {
    console.error('Database connection failed to initialize:', error);
    throw error;
  }
};

module.exports = {
  initDb
};
