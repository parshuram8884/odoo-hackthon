import React from 'react';
import { useApp } from '../context/AppContext';
import ManagerDashboard from './ManagerDashboard';
import VendorDashboard from './VendorDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';

const Dashboard = () => {
  const { user } = useApp();

  if (!user) return null;

  if (user.role === 'SuperAdmin') {
    return <SuperAdminDashboard />;
  }

  if (user.role === 'Admin') {
    return <ManagerDashboard />;
  }

  return <VendorDashboard />;
};

export default Dashboard;
