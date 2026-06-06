const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  role: { type: String, required: true, enum: ['Admin', 'Vendor', 'SuperAdmin'] },
  passwordHash: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);
