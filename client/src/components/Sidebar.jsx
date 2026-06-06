import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  HiOutlineChartBar,
  HiOutlineDocumentText,
  HiOutlineClipboardList,
  HiOutlineCash,
  HiOutlineLogout,
  HiOutlineTrendingUp,
} from 'react-icons/hi';

const Sidebar = () => {
  const { user, logout } = useApp();

  if (!user) return null;

  const links = [
    {
      to: '/',
      label: 'Dashboard',
      icon: <HiOutlineChartBar className="w-5 h-5" />,
    },
    {
      to: '/rfqs',
      label: 'RFQs',
      icon: <HiOutlineClipboardList className="w-5 h-5" />,
    },
    {
      to: '/quotations',
      label: 'Quotations',
      icon: <HiOutlineTrendingUp className="w-5 h-5" />,
    },
    {
      to: '/purchase-orders',
      label: 'Purchase Orders',
      icon: <HiOutlineDocumentText className="w-5 h-5" />,
    },
    {
      to: '/invoices',
      label: 'Invoices',
      icon: <HiOutlineCash className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col min-h-screen">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
          VendorBridge
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'hover:bg-slate-800 hover:text-slate-100'
              }`
            }
            end={link.to === '/'}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info / Logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-200 truncate">
              {user.email.split('@')[0]}
            </p>
            <p className="text-xs text-indigo-400 font-medium capitalize">
              {user.role} View
            </p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Log Out"
          >
            <HiOutlineLogout className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
