const { Quotation, Rfq, PurchaseOrder } = require('../models');

const getQuotations = async (role, email) => {
  let filter = {};
  if (role !== 'Admin') {
    filter = { vendorEmail: email.toLowerCase() };
  }
  return await Quotation.find(filter).sort({ submittedDate: -1, id: -1 });
};

const submitQuotation = async (email, data) => {
  const { rfqId, price, leadTime, notes } = data;

  const rfq = await Rfq.findOne({ id: rfqId });
  if (!rfq) {
    throw new Error('Associated RFQ not found.');
  }

  const hasBid = await Quotation.findOne({ rfqId, vendorEmail: email.toLowerCase() });
  if (hasBid) {
    throw new Error('You have already submitted a bid for this RFQ.');
  }

  const count = await Quotation.countDocuments();
  const nextId = `QTN-${count + 101}`;
  const vendorName = email.toLowerCase() === 'vendor@vendorbridge.com' ? 'Global Furnishings Ltd.' : 'External Vendor LLC';
  const submittedDate = new Date().toISOString().split('T')[0];

  const newQuote = new Quotation({
    id: nextId,
    rfqId,
    rfqTitle: rfq.title,
    vendorName,
    vendorEmail: email.toLowerCase(),
    price: Number(price),
    leadTime: Number(leadTime),
    notes,
    status: 'Pending',
    submittedDate
  });

  await newQuote.save();
  return newQuote;
};

const updateQuotationStatus = async (id, status) => {
  const quote = await Quotation.findOne({ id });
  if (!quote) {
    throw new Error('Quotation not found.');
  }

  quote.status = status;
  await quote.save();

  if (status === 'Approved') {
    const poCount = await PurchaseOrder.countDocuments();
    const nextPoId = `PO-${poCount + 201}`;
    const deliveryDate = new Date(Date.now() + quote.leadTime * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const createdDate = new Date().toISOString().split('T')[0];

    const newPO = new PurchaseOrder({
      id: nextPoId,
      rfqId: quote.rfqId,
      rfqTitle: quote.rfqTitle,
      quotationId: quote.id,
      vendorName: quote.vendorName,
      vendorEmail: quote.vendorEmail,
      totalAmount: quote.price,
      deliveryDate,
      status: 'Issued',
      createdDate
    });

    await newPO.save();

    // Close corresponding RFQ
    await Rfq.updateOne({ id: quote.rfqId }, { status: 'Closed' });
  }

  return quote;
};

module.exports = {
  getQuotations,
  submitQuotation,
  updateQuotationStatus
};
