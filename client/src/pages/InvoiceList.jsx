import React from 'react';
import { useApp } from '../context/AppContext';
import ManagerInvoiceList from './ManagerInvoiceList';
import VendorInvoiceList from './VendorInvoiceList';

const InvoiceList = () => {
  const { user } = useApp();

  if (!user) return null;

  return user.role === 'Admin' ? <ManagerInvoiceList /> : <VendorInvoiceList />;
};

export default InvoiceList;
