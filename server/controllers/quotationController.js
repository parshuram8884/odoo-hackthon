const quotationService = require('../services/quotationService');

const getQuotations = async (req, res) => {
  try {
    const list = await quotationService.getQuotations(req.user.role, req.user.email);
    return res.status(200).json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const submitQuotation = async (req, res) => {
  try {
    const quote = await quotationService.submitQuotation(req.user.email, req.body);
    return res.status(201).json(quote);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Quotation status is required.' });
    }

    const quote = await quotationService.updateQuotationStatus(req.params.id, status);
    return res.status(200).json(quote);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getQuotations,
  submitQuotation,
  updateStatus
};
