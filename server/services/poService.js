const { PurchaseOrder } = require('../models');

const getPurchaseOrders = async (role, email) => {
  let filter = {};
  if (role !== 'Admin') {
    filter = { vendorEmail: email.toLowerCase() };
  }
  return await PurchaseOrder.find(filter).sort({ createdDate: -1, id: -1 });
};

module.exports = {
  getPurchaseOrders
};
