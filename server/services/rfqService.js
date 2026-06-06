const { Rfq } = require('../models');

const getAllRfqs = async (role) => {
  let filter = {};
  if (role !== 'Admin') {
    filter = { status: { $in: ['Open', 'Closed'] } };
  }
  
  return await Rfq.find(filter).sort({ createdDate: -1, id: -1 });
};

const createRfq = async (data) => {
  const { title, description, items, quantity, budget, deadline } = data;

  const count = await Rfq.countDocuments();
  const nextId = `RFQ-00${count + 1}`;
  const createdDate = new Date().toISOString().split('T')[0];

  const newRfq = new Rfq({
    id: nextId,
    title,
    description,
    items,
    quantity: Number(quantity),
    budget: Number(budget),
    deadline,
    createdDate,
    status: 'Pending'
  });

  await newRfq.save();
  return newRfq;
};

const publishRfq = async (id) => {
  const rfq = await Rfq.findOne({ id });
  if (!rfq) {
    throw new Error('RFQ not found.');
  }

  rfq.status = 'Open';
  await rfq.save();
  return rfq;
};

module.exports = {
  getAllRfqs,
  createRfq,
  publishRfq
};
