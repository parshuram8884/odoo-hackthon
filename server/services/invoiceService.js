const { Invoice, PurchaseOrder } = require('../models');

const getInvoices = async (role, email) => {
  let filter = {};
  if (role !== 'Admin' && role !== 'SuperAdmin') {
    filter = { vendorEmail: email.toLowerCase() };
  }
  return await Invoice.find(filter).sort({ createdDate: -1, id: -1 });
};

const raiseInvoice = async (poId, invoiceNumber, notes) => {
  const po = await PurchaseOrder.findOne({ id: poId });
  if (!po) {
    throw new Error('Purchase Order not found.');
  }

  const invoiceCount = await Invoice.countDocuments();
  const nextId = `INV-${invoiceCount + 301}`;
  const createdDate = new Date().toISOString().split('T')[0];

  const newInvoice = new Invoice({
    id: nextId,
    poId,
    rfqTitle: po.rfqTitle,
    vendorName: po.vendorName,
    vendorEmail: po.vendorEmail,
    amount: po.totalAmount,
    invoiceNumber,
    notes,
    status: 'Pending',
    createdDate
  });

  await newInvoice.save();

  // Update PO status
  po.status = 'Invoiced';
  await po.save();

  return newInvoice;
};

const payInvoice = async (id) => {
  const invoice = await Invoice.findOne({ id });
  if (!invoice) {
    throw new Error('Invoice not found.');
  }

  invoice.status = 'Paid';
  await invoice.save();

  // Update PO status to Completed
  await PurchaseOrder.updateOne({ id: invoice.poId }, { status: 'Completed' });

  return invoice;
};

module.exports = {
  getInvoices,
  raiseInvoice,
  payInvoice
};
