import React from 'react';
import { useApp } from '../context/AppContext';
import { HiOutlineUserCircle, HiOutlineSwitchHorizontal, HiOutlineLogout } from 'react-icons/hi';

const Header = () => {
  const { user, login, logout } = useApp();

  if (!user) return null;

  const handleRoleSwitch = () => {
    if (user.role === 'Admin') {
      login('vendor@vendorbridge.com', 'Vendor');
    } else {
      login('admin@vendorbridge.com', 'Admin');
    }
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between text-slate-200">
      <div>
        <h1 className="text-lg font-semibold tracking-wide text-slate-100">
          Procurement Management System
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Role Toggle Tooltip/Button */}
        
        {user.role === 'SuperAdmin' && (
          <button
            onClick={logout}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer"
            title="Log Out"
          >
            <HiOutlineLogout className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        )}

        <div className="h-6 w-px bg-slate-800"></div>

        {/* User Info */}
        <div className="flex items-center space-x-3">
          <HiOutlineUserCircle className="w-8 h-8 text-indigo-400" />
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold leading-tight">{user.email}</p>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {user.role} Account
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
