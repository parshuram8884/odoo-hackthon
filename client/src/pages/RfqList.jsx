import React from 'react';
import { useApp } from '../context/AppContext';
import ManagerRfqList from './ManagerRfqList';
import VendorRfqList from './VendorRfqList';

const RfqList = () => {
  const { user } = useApp();

  if (!user) return null;

  return (user.role === 'Admin' || user.role === 'SuperAdmin') ? <ManagerRfqList /> : <VendorRfqList />;
};

export default RfqList;
