import React from 'react';
import { useApp } from '../context/AppContext';
import ManagerPoList from './ManagerPoList';
import VendorPoList from './VendorPoList';

const PurchaseOrderList = () => {
  const { user } = useApp();

  if (!user) return null;

  return user.role === 'Admin' ? <ManagerPoList /> : <VendorPoList />;
};

export default PurchaseOrderList;
