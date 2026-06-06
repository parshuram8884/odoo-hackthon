import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      setErrorMsg('');
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg(error.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  const autofillAdmin = () => {
    setEmail('admin@vendorbridge.com');
    setPassword('••••••••');
  };

  const autofillVendor = () => {
    setEmail('vendor@vendorbridge.com');
    setPassword('••••••••');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      {/* Background blobs for premium glassmorphism feel */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white font-extrabold text-2xl shadow-lg shadow-indigo-500/20 mb-4">
            VB
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            VendorBridge ERP System
          </h2>
          <p className="text-sm text-slate-400 mt-1.5">
            Log in to manage procurements and quotations
          </p>
        </div>

        {/* Demo Quick login buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={autofillAdmin}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-indigo-500 hover:bg-slate-750 transition text-left group"
          >
            <span className="text-xs font-semibold text-slate-300 group-hover:text-indigo-400">
              Registered as Manager
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Quick Login</span>
          </button>

          <button
            onClick={autofillVendor}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500 hover:bg-slate-750 transition text-left group"
          >
            <span className="text-xs font-semibold text-slate-300 group-hover:text-emerald-400">
              Registered Vendor
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Quick Login</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center">
              {errorMsg}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. procurement@vendorbridge.com"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg py-2 px-3 text-sm placeholder-slate-600 outline-none text-white transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg py-2 px-3 text-sm placeholder-slate-600 outline-none text-white transition"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-750 text-white font-bold py-2.5 px-4 rounded-lg text-sm shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:translate-y-px transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
