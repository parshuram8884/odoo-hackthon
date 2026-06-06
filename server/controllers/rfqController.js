const rfqService = require('../services/rfqService');

const getRfqs = async (req, res) => {
  try {
    const list = await rfqService.getAllRfqs(req.user.role);
    return res.status(200).json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createRfq = async (req, res) => {
  try {
    const rfq = await rfqService.createRfq(req.body);
    return res.status(201).json(rfq);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const publishRfq = async (req, res) => {
  try {
    const rfq = await rfqService.publishRfq(req.params.id);
    return res.status(200).json(rfq);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getRfqs,
  createRfq,
  publishRfq
};
