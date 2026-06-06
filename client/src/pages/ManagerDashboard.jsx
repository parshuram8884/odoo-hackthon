import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  HiOutlineClipboardList,
  HiOutlineTrendingUp,
  HiOutlineDocumentText,
  HiOutlineCash,
  HiOutlinePlusCircle,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
} from 'react-icons/hi';

const ManagerDashboard = () => {
  const { rfqs, quotations, purchaseOrders } = useApp();
  const navigate = useNavigate();

  // Statistics calculations
  const totalRFQs = rfqs.length;
  const openRFQs = rfqs.filter((r) => r.status === 'Open').length;
  const pendingQuotes = quotations.filter((q) => q.status === 'Pending').length;
  const activePOs = purchaseOrders.filter((p) => p.status === 'Issued' || p.status === 'Invoiced').length;
  const totalBudget = rfqs.reduce((acc, r) => acc + r.budget, 0);

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-64px)]">
      {/* Title / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Manager Dashboard
          </h2>
          <p className="text-sm text-slate-400">
            Welcome back! Here is a summary of the VendorBridge procurement operations.
          </p>
        </div>

        <div>
          <button
            onClick={() => navigate('/rfqs/create')}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-600/10 active:translate-y-px transition"
          >
            <HiOutlinePlusCircle className="w-5 h-5" />
            <span>Create RFQ</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total RFQs Created
            </span>
            <span className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <HiOutlineClipboardList className="w-6 h-6" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">{totalRFQs}</span>
            <span className="text-xs text-slate-500 block mt-1">{openRFQs} Active & Open</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Received Quotes
            </span>
            <span className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <HiOutlineTrendingUp className="w-6 h-6" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">{quotations.length}</span>
            <span className="text-xs text-amber-500 block mt-1">{pendingQuotes} Pending Approval</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active POs
            </span>
            <span className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <HiOutlineDocumentText className="w-6 h-6" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">{activePOs}</span>
            <span className="text-xs text-slate-500 block mt-1">Pending delivery / invoice</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Allocated Budget
            </span>
            <span className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <HiOutlineCash className="w-6 h-6" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-white">
              ${totalBudget.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 block mt-1">Across all project RFQs</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent RFQs Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-100">Recent Requests for Quotation</h3>
            <button
              onClick={() => navigate('/rfqs')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center space-x-1"
            >
              <span>View All</span>
              <HiOutlineArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {rfqs.slice(0, 3).map((rfq) => (
              <div key={rfq.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">{rfq.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Budget: <span className="text-slate-300 font-medium">${rfq.budget ? rfq.budget.toLocaleString() : 0}</span> &bull; Deadline: <span className="text-slate-300 font-medium">{rfq.deadline}</span>
                  </p>
                </div>
                <span
                  className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full tracking-wider ${
                    rfq.status === 'Open'
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : rfq.status === 'Closed'
                      ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {rfq.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bidding Summary Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-100">Awaiting Approvals</h3>
            <button
              onClick={() => navigate('/quotations')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center space-x-1"
            >
              <span>View All</span>
              <HiOutlineArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {quotations.filter((q) => q.status === 'Pending').length > 0 ? (
              quotations
                .filter((q) => q.status === 'Pending')
                .slice(0, 3)
                .map((q) => (
                  <div key={q.id} className="p-3 bg-slate-955 bg-slate-950 rounded-lg border border-slate-800 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-300 truncate max-w-[160px]">{q.rfqTitle}</h4>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{q.vendorName}</span>
                      </div>
                      <span className="text-xs font-extrabold text-indigo-400">${q.price ? q.price.toLocaleString() : 0}</span>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-6">
                <HiOutlineCheckCircle className="w-10 h-10 text-slate-650 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">No pending quotations to approve.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
