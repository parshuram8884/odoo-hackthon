const { Rfq } = require('../models');

const getAllRfqs = async (role) => {
  let filter = {};
  if (role !== 'Admin' && role !== 'SuperAdmin') {
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

const updateRfq = async (id, data) => {
  const rfq = await Rfq.findOne({ id });
  if (!rfq) {
    throw new Error('RFQ not found.');
  }

  if (data.title !== undefined) rfq.title = data.title;
  if (data.description !== undefined) rfq.description = data.description;
  if (data.items !== undefined) rfq.items = data.items;
  if (data.quantity !== undefined) rfq.quantity = Number(data.quantity);
  if (data.budget !== undefined) rfq.budget = Number(data.budget);
  if (data.deadline !== undefined) rfq.deadline = data.deadline;
  if (data.status !== undefined) rfq.status = data.status;

  await rfq.save();
  return rfq;
};

module.exports = {
  getAllRfqs,
  createRfq,
  publishRfq,
  updateRfq
};
