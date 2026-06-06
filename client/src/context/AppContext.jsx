import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Authentication state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vb_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [rfqs, setRfqs] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!user) {
      setRfqs([]);
      setQuotations([]);
      setPurchaseOrders([]);
      setInvoices([]);
      return;
    }
    setLoading(true);
    try {
      const [rfqRes, quoteRes, poRes, invRes] = await Promise.all([
        api.get('/rfqs'),
        api.get('/quotations'),
        api.get('/purchase-orders'),
        api.get('/invoices')
      ]);
      setRfqs(rfqRes.data);
      setQuotations(quoteRes.data);
      setPurchaseOrders(poRes.data);
      setInvoices(invRes.data);
    } catch (error) {
      console.error('Error fetching data from API:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Auth Operations
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const loggedUser = res.data;
    setUser(loggedUser);
    localStorage.setItem('vb_user', JSON.stringify(loggedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vb_user');
  };

  // RFQ Operations
  const createRfq = async (title, description, items, quantity, deadline, budget) => {
    try {
      const res = await api.post('/rfqs', {
        title,
        description,
        items,
        quantity: Number(quantity),
        budget: Number(budget),
        deadline
      });
      setRfqs((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error('Failed to create RFQ:', error);
      alert(error.response?.data?.message || 'Failed to create RFQ. Please try again.');
      throw error;
    }
  };

  const publishRfq = async (rfqId) => {
    try {
      const res = await api.put(`/rfqs/${rfqId}/publish`);
      setRfqs((prev) =>
        prev.map((rfq) => (rfq.id === rfqId ? res.data : rfq))
      );
    } catch (error) {
      console.error('Failed to publish RFQ:', error);
      alert(error.response?.data?.message || 'Failed to publish RFQ. Please try again.');
      throw error;
    }
  };

  // Quotation Operations
  const submitQuotation = async (rfqId, rfqTitle, price, leadTime, notes) => {
    try {
      const res = await api.post('/quotations', {
        rfqId,
        rfqTitle,
        price: Number(price),
        leadTime: Number(leadTime),
        notes
      });
      setQuotations((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error('Failed to submit Quotation:', error);
      alert(error.response?.data?.message || 'Failed to submit quotation. Please try again.');
      throw error;
    }
  };

  const updateQuotationStatus = async (quoteId, status) => {
    try {
      const res = await api.put(`/quotations/${quoteId}/status`, { status });
      setQuotations((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, status } : q))
      );
      
      // If approved, PO is created and RFQ is closed on backend. Sync lists:
      if (status === 'Approved') {
        const [poRes, rfqRes] = await Promise.all([
          api.get('/purchase-orders'),
          api.get('/rfqs')
        ]);
        setPurchaseOrders(poRes.data);
        setRfqs(rfqRes.data);
      }
    } catch (error) {
      console.error('Failed to update Quotation status:', error);
      alert(error.response?.data?.message || 'Failed to update quotation status. Please try again.');
      throw error;
    }
  };

  // Invoice Operations
  const raiseInvoice = async (poId, invoiceNumber, notes) => {
    try {
      const res = await api.post('/invoices', {
        poId,
        invoiceNumber,
        notes
      });
      setInvoices((prev) => [res.data, ...prev]);
      
      // Update PO status to Invoiced in state
      setPurchaseOrders((prev) =>
        prev.map((p) => (p.id === poId ? { ...p, status: 'Invoiced' } : p))
      );
    } catch (error) {
      console.error('Failed to raise Invoice:', error);
      alert(error.response?.data?.message || 'Failed to raise invoice. Please try again.');
      throw error;
    }
  };

  const payInvoice = async (invoiceId) => {
    try {
      const res = await api.put(`/invoices/${invoiceId}/pay`);
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === invoiceId ? res.data : inv))
      );
      
      // Sync PO status
      const inv = invoices.find((i) => i.id === invoiceId);
      if (inv) {
        setPurchaseOrders((prev) =>
          prev.map((p) => (p.id === inv.poId ? { ...p, status: 'Completed' } : p))
        );
      }
    } catch (error) {
      console.error('Failed to pay Invoice:', error);
      alert(error.response?.data?.message || 'Failed to process invoice payment. Please try again.');
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        rfqs,
        createRfq,
        publishRfq,
        quotations,
        submitQuotation,
        updateQuotationStatus,
        purchaseOrders,
        raiseInvoice,
        invoices,
        payInvoice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
