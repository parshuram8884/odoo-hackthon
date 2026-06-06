// In-memory Database Store for VendorBridge Procurement ERP
// This acts as a mock database. It will be replaced with PostgreSQL query models.

const users = [
  { id: 'usr-1', email: 'admin@vendorbridge.com', role: 'Admin', passwordHash: '$2b$10$xyz' },
  { id: 'usr-2', email: 'vendor@vendorbridge.com', role: 'Vendor', passwordHash: '$2b$10$xyz' }
];

const rfqs = [
  {
    id: 'RFQ-001',
    title: 'Office Laptop Procurement',
    description: 'Request for 15 high-performance developer laptops with 32GB RAM, 1TB SSD.',
    items: 'Developer Laptops',
    quantity: 15,
    budget: 22500,
    deadline: '2026-06-20',
    createdDate: '2026-06-01',
    status: 'Open',
  },
  {
    id: 'RFQ-002',
    title: 'Server Rack Maintenance',
    description: 'Annual maintenance and optimization services for server racks in HQ room 4B.',
    items: 'Maintenance Contract',
    quantity: 1,
    budget: 8500,
    deadline: '2026-06-15',
    createdDate: '2026-06-03',
    status: 'Open',
  },
  {
    id: 'RFQ-003',
    title: 'Ergonomic Office Chairs',
    description: 'Procurement of 50 ergonomic chairs with lumber support for office floor 3.',
    items: 'Office Chairs',
    quantity: 50,
    budget: 15000,
    deadline: '2026-05-30',
    createdDate: '2026-05-10',
    status: 'Closed',
  },
  {
    id: 'RFQ-004',
    title: 'E-Commerce App Development',
    description: 'Development of mobile client app for our e-commerce platform using React Native.',
    items: 'Mobile App Project',
    quantity: 1,
    budget: 45000,
    deadline: '2026-07-10',
    createdDate: '2026-06-05',
    status: 'Pending',
  }
];

const quotations = [
  {
    id: 'QTN-101',
    rfqId: 'RFQ-003',
    rfqTitle: 'Ergonomic Office Chairs',
    vendorName: 'Global Furnishings Ltd.',
    vendorEmail: 'vendor@vendorbridge.com',
    price: 13500,
    leadTime: 14,
    notes: 'Premium ergonomic chairs with 5 years warranty. Free delivery and assembly included.',
    status: 'Approved',
    submittedDate: '2026-05-15',
  },
  {
    id: 'QTN-102',
    rfqId: 'RFQ-003',
    rfqTitle: 'Ergonomic Office Chairs',
    vendorName: 'Comfort Seating Inc.',
    vendorEmail: 'comfort@seats.com',
    price: 14800,
    leadTime: 10,
    notes: 'High back mesh office chairs. 3 years warranty.',
    status: 'Rejected',
    submittedDate: '2026-05-18',
  },
  {
    id: 'QTN-103',
    rfqId: 'RFQ-001',
    rfqTitle: 'Office Laptop Procurement',
    vendorName: 'Global Tech Distributors',
    vendorEmail: 'vendor@vendorbridge.com',
    price: 21750,
    leadTime: 7,
    notes: 'Latest generation CPUs. Includes 1-year on-site support contract.',
    status: 'Pending',
    submittedDate: '2026-06-04',
  }
];

const purchaseOrders = [
  {
    id: 'PO-201',
    rfqId: 'RFQ-003',
    rfqTitle: 'Ergonomic Office Chairs',
    quotationId: 'QTN-101',
    vendorName: 'Global Furnishings Ltd.',
    vendorEmail: 'vendor@vendorbridge.com',
    totalAmount: 13500,
    deliveryDate: '2026-05-29',
    status: 'Delivered',
    createdDate: '2026-05-20',
  }
];

const invoices = [
  {
    id: 'INV-301',
    poId: 'PO-201',
    rfqTitle: 'Ergonomic Office Chairs',
    vendorName: 'Global Furnishings Ltd.',
    vendorEmail: 'vendor@vendorbridge.com',
    amount: 13500,
    invoiceNumber: 'INV-2026-88',
    notes: 'Final invoice for 50 chairs delivery.',
    status: 'Paid',
    createdDate: '2026-05-30',
  }
];

module.exports = {
  users,
  rfqs,
  quotations,
  purchaseOrders,
  invoices
};
