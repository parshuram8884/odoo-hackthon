const poService = require('../services/poService');

const getPurchaseOrders = async (req, res) => {
  try {
    const list = await poService.getPurchaseOrders(req.user.role, req.user.email);
    return res.status(200).json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPurchaseOrders
};
