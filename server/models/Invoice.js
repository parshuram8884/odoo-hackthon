const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  poId: { type: String, required: true },
  rfqTitle: { type: String, required: true },
  vendorName: { type: String, required: true },
  vendorEmail: { type: String, required: true, lowercase: true, index: true },
  amount: { type: Number, required: true },
  invoiceNumber: { type: String, required: true },
  notes: { type: String },
  status: { type: String, required: true, enum: ['Pending', 'Paid'], default: 'Pending' },
  createdDate: { type: String, required: true, index: true } // YYYY-MM-DD
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
