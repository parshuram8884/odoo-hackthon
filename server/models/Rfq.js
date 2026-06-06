const mongoose = require('mongoose');

const RfqSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  items: { type: String },
  quantity: { type: Number, required: true },
  budget: { type: Number, required: true },
  deadline: { type: String, required: true }, // YYYY-MM-DD
  createdDate: { type: String, required: true, index: true }, // YYYY-MM-DD
  status: { type: String, required: true, enum: ['Pending', 'Open', 'Closed'], default: 'Pending', index: true }
});

module.exports = mongoose.model('Rfq', RfqSchema);
