const mongoose = require('mongoose');

const QuotationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  rfqId: { type: String, required: true, index: true },
  rfqTitle: { type: String, required: true },
  vendorName: { type: String, required: true },
  vendorEmail: { type: String, required: true, lowercase: true, index: true },
  price: { type: Number, required: true },
  leadTime: { type: Number, required: true },
  notes: { type: String },
  status: { type: String, required: true, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  submittedDate: { type: String, required: true, index: true } // YYYY-MM-DD
});

module.exports = mongoose.model('Quotation', QuotationSchema);
