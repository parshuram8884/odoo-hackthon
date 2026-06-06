const invoiceService = require('../services/invoiceService');

const getInvoices = async (req, res) => {
  try {
    const list = await invoiceService.getInvoices(req.user.role, req.user.email);
    return res.status(200).json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const raiseInvoice = async (req, res) => {
  try {
    const { poId, invoiceNumber, notes } = req.body;
    if (!poId || !invoiceNumber) {
      return res.status(400).json({ message: 'PO ID and invoice number are required.' });
    }

    const invoice = await invoiceService.raiseInvoice(poId, invoiceNumber, notes);
    return res.status(201).json(invoice);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const payInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.payInvoice(req.params.id);
    return res.status(200).json(invoice);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getInvoices,
  raiseInvoice,
  payInvoice
};
