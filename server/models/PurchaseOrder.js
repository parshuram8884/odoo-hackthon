const mongoose = require('mongoose');

const PurchaseOrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  rfqId: { type: String, required: true },
  rfqTitle: { type: String, required: true },
  quotationId: { type: String, required: true },
  vendorName: { type: String, required: true },
  vendorEmail: { type: String, required: true, lowercase: true, index: true },
  totalAmount: { type: Number, required: true },
  deliveryDate: { type: String, required: true }, // YYYY-MM-DD
  status: { type: String, required: true, enum: ['Issued', 'Delivered', 'Invoiced', 'Completed'], default: 'Issued' },
  createdDate: { type: String, required: true, index: true } // YYYY-MM-DD
});

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
