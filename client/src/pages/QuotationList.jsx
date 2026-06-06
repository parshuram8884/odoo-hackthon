import React from 'react';
import { useApp } from '../context/AppContext';
import ManagerQuotationList from './ManagerQuotationList';
import VendorQuotationList from './VendorQuotationList';

const QuotationList = () => {
  const { user } = useApp();

  if (!user) return null;

  return user.role === 'Admin' ? <ManagerQuotationList /> : <VendorQuotationList />;
};

export default QuotationList;
