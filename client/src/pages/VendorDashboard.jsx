import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  HiOutlineClipboardList,
  HiOutlineTrendingUp,
  HiOutlineDocumentText,
  HiOutlineCash,
  HiOutlineArrowRight,
} from 'react-icons/hi';

const VendorDashboard = () => {
  const { user, rfqs, quotations, purchaseOrders, invoices } = useApp();
  const navigate = useNavigate();

  if (!user) return null;

  // Vendor statistics
  const openRFQs = rfqs.filter((r) => r.status === 'Open').length;
  const vendorQuotes = quotations.filter((q) => q.vendorEmail === user.email);
  const vendorQuotesCount = vendorQuotes.length;
  const vendorPendingQuotes = vendorQuotes.filter((q) => q.status === 'Pending').length;
  const vendorApprovedPOs = purchaseOrders.filter((p) => p.vendorEmail === user.email);
  const vendorEarnings = invoices
    .filter((i) => i.vendorEmail === user.email && i.status === 'Paid')
    .reduce((acc, i) => acc + i.amount, 0);

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-64px)]">
      {/* Title / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Vendor Dashboard
          </h2>
          <p className="text-sm text-slate-400">
            Welcome! Manage your active bids, monitor purchase orders, and submit invoices.
          </p>
        </div>

        <div>
          <button
            onClick={() => navigate('/rfqs')}
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-emerald-600/10 active:translate-y-px transition"
          >
            <HiOutlineClipboardList className="w-5 h-5" />
            <span>Browse Open RFQs</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 (Vendor) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Open RFQs
            </span>
            <span className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <HiOutlineClipboardList className="w-6 h-6" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">{openRFQs}</span>
            <span className="text-xs text-slate-500 block mt-1">Available for bidding</span>
          </div>
        </div>

        {/* KPI 2 (Vendor) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              My Submitted Bids
            </span>
            <span className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <HiOutlineTrendingUp className="w-6 h-6" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">{vendorQuotesCount}</span>
            <span className="text-xs text-slate-500 block mt-1">{vendorPendingQuotes} Awaiting decision</span>
          </div>
        </div>

        {/* KPI 3 (Vendor) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              My Orders (POs)
            </span>
            <span className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <HiOutlineDocumentText className="w-6 h-6" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">{vendorApprovedPOs.length}</span>
            <span className="text-xs text-slate-500 block mt-1">Approved contracts</span>
          </div>
        </div>

        {/* KPI 4 (Vendor) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Earnings (Paid)
            </span>
            <span className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <HiOutlineCash className="w-6 h-6" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-white">
              ${vendorEarnings.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 block mt-1">From processed invoices</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Open RFQs Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-100">Recent Open RFQs</h3>
            <button
              onClick={() => navigate('/rfqs')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center space-x-1"
            >
              <span>View All</span>
              <HiOutlineArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {rfqs
              .filter((r) => r.status === 'Open')
              .slice(0, 3)
              .map((rfq) => (
                <div key={rfq.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{rfq.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Budget: <span className="text-slate-300 font-medium">${rfq.budget ? rfq.budget.toLocaleString() : 0}</span> &bull; Deadline: <span className="text-slate-300 font-medium">{rfq.deadline}</span>
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {rfq.status}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Bidding Summary Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-100">My Bids Status</h3>
            <button
              onClick={() => navigate('/quotations')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center space-x-1"
            >
              <span>View All</span>
              <HiOutlineArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {vendorQuotes.slice(0, 3).map((q) => (
              <div key={q.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 truncate max-w-[160px]">{q.rfqTitle}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">${q.price ? q.price.toLocaleString() : 0}</span>
                </div>
                <span
                  className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                    q.status === 'Approved'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : q.status === 'Rejected'
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}
                >
                  {q.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
