const { Rfq, Quotation, PurchaseOrder, Invoice, User } = require('../models');

const getAnalytics = async (req, res) => {
  try {
    // 1. Fetch all datasets in parallel
    const [rfqs, quotations, purchaseOrders, invoices, users] = await Promise.all([
      Rfq.find({}),
      Quotation.find({}),
      PurchaseOrder.find({}),
      Invoice.find({}),
      User.find({}, { passwordHash: 0 }) // Exclude password hashes
    ]);

    // 2. Aggregate RFQ Stats
    const rfqStats = {
      total: rfqs.length,
      pending: rfqs.filter(r => r.status === 'Pending').length,
      open: rfqs.filter(r => r.status === 'Open').length,
      closed: rfqs.filter(r => r.status === 'Closed').length,
      totalBudget: rfqs.reduce((sum, r) => sum + (r.budget || 0), 0)
    };

    // 3. Aggregate Quotation Stats
    const quotationStats = {
      total: quotations.length,
      pending: quotations.filter(q => q.status === 'Pending').length,
      approved: quotations.filter(q => q.status === 'Approved').length,
      rejected: quotations.filter(q => q.status === 'Rejected').length
    };

    // 4. Aggregate Purchase Order Stats
    const poStats = {
      total: purchaseOrders.length,
      issued: purchaseOrders.filter(p => p.status === 'Issued').length,
      delivered: purchaseOrders.filter(p => p.status === 'Delivered').length,
      invoiced: purchaseOrders.filter(p => p.status === 'Invoiced').length,
      completed: purchaseOrders.filter(p => p.status === 'Completed').length,
      totalAmount: purchaseOrders.reduce((sum, p) => sum + (p.totalAmount || 0), 0)
    };

    // 5. Aggregate Invoice Stats
    const invoiceStats = {
      total: invoices.length,
      pending: invoices.filter(i => i.status === 'Pending').length,
      paid: invoices.filter(i => i.status === 'Paid').length,
      totalAmount: invoices.reduce((sum, i) => sum + (i.amount || 0), 0),
      totalPaid: invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + (i.amount || 0), 0),
      totalPending: invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + (i.amount || 0), 0)
    };

    // 6. Aggregate User Stats
    const userStats = {
      total: users.length,
      admins: users.filter(u => u.role === 'Admin').length,
      vendors: users.filter(u => u.role === 'Vendor').length,
      superAdmins: users.filter(u => u.role === 'SuperAdmin').length + 1 // +1 for the virtual logged-in superadmin
    };

    // 7. Combine datasets to form chronological activity log
    const activities = [];
    
    rfqs.forEach(rfq => {
      activities.push({
        type: 'RFQ',
        action: 'RFQ Created',
        id: rfq.id,
        title: rfq.title,
        date: rfq.createdDate,
        status: rfq.status,
        details: `Budget: ₹${(rfq.budget || 0).toLocaleString()} | Qty: ${rfq.quantity}`
      });
    });

    quotations.forEach(q => {
      activities.push({
        type: 'Quotation',
        action: 'Bid Submitted',
        id: q.id,
        title: q.rfqTitle,
        date: q.submittedDate,
        status: q.status,
        details: `Vendor: ${q.vendorName} | Price: ₹${(q.price || 0).toLocaleString()}`
      });
    });

    purchaseOrders.forEach(po => {
      activities.push({
        type: 'PurchaseOrder',
        action: 'PO Issued',
        id: po.id,
        title: po.rfqTitle,
        date: po.createdDate,
        status: po.status,
        details: `To: ${po.vendorName} | Total: ₹${(po.totalAmount || 0).toLocaleString()}`
      });
    });

    invoices.forEach(inv => {
      activities.push({
        type: 'Invoice',
        action: 'Invoice Raised',
        id: inv.id,
        title: inv.rfqTitle,
        date: inv.createdDate,
        status: inv.status,
        details: `Vendor: ${inv.vendorName} | Amount: ₹${(inv.amount || 0).toLocaleString()}`
      });
    });

    // Sort activities by date descending, then ID descending
    activities.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

    return res.status(200).json({
      rfqStats,
      quotationStats,
      poStats,
      invoiceStats,
      userStats,
      recentActivity: activities.slice(0, 55),
      rawLists: {
        rfqs,
        quotations,
        purchaseOrders,
        invoices,
        users
      }
    });
  } catch (error) {
    console.error('Error fetching superadmin analytics:', error);
    return res.status(500).json({ message: 'Internal server error fetching analytics.' });
  }
};

module.exports = {
  getAnalytics
};
