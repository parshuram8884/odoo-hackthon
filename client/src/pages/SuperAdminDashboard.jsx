import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  HiOutlineClipboardList,
  HiOutlineTrendingUp,
  HiOutlineDocumentText,
  HiOutlineCash,
  HiOutlineUsers,
  HiOutlineSearch,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineXCircle,
} from 'react-icons/hi';

const SuperAdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | timeline | database
  const [dbSubTab, setDbSubTab] = useState('rfqs'); // rfqs | quotations | pos | invoices | users
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/superadmin/analytics');
      setData(response.data);
    } catch (err) {
      console.error('Failed to load SuperAdmin analytics:', err);
      setError('Failed to load system analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(() => {
      api.get('/superadmin/analytics')
        .then(response => {
          setData(response.data);
        })
        .catch(err => {
          console.error('Failed to auto-refresh SuperAdmin analytics:', err);
        });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-sm text-slate-400 font-semibold animate-pulse">Loading system statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100">
        <HiOutlineXCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Error Loading Dashboard</h3>
        <p className="text-sm text-slate-450 mb-6 text-center max-w-md">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer"
        >
          <HiOutlineRefresh className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const { rfqStats, quotationStats, poStats, invoiceStats, userStats, recentActivity, rawLists } = data;

  // Formatting helper
  const formatCurrency = (val) => `₹${(val || 0).toLocaleString()}`;

  // Filter logs or database lists
  const getFilteredList = () => {
    if (!rawLists) return [];
    const query = searchQuery.toLowerCase().trim();

    switch (dbSubTab) {
      case 'rfqs':
        return rawLists.rfqs.filter(
          (r) =>
            r.id.toLowerCase().includes(query) ||
            r.title.toLowerCase().includes(query) ||
            (r.description && r.description.toLowerCase().includes(query)) ||
            r.status.toLowerCase().includes(query)
        );
      case 'quotations':
        return rawLists.quotations.filter(
          (q) =>
            q.id.toLowerCase().includes(query) ||
            q.rfqTitle.toLowerCase().includes(query) ||
            q.vendorName.toLowerCase().includes(query) ||
            q.vendorEmail.toLowerCase().includes(query) ||
            q.status.toLowerCase().includes(query)
        );
      case 'pos':
        return rawLists.purchaseOrders.filter(
          (p) =>
            p.id.toLowerCase().includes(query) ||
            p.rfqTitle.toLowerCase().includes(query) ||
            p.vendorName.toLowerCase().includes(query) ||
            p.vendorEmail.toLowerCase().includes(query) ||
            p.status.toLowerCase().includes(query)
        );
      case 'invoices':
        return rawLists.invoices.filter(
          (i) =>
            i.id.toLowerCase().includes(query) ||
            i.invoiceNumber.toLowerCase().includes(query) ||
            i.rfqTitle.toLowerCase().includes(query) ||
            i.vendorName.toLowerCase().includes(query) ||
            i.vendorEmail.toLowerCase().includes(query) ||
            i.status.toLowerCase().includes(query)
        );
      case 'users':
        return rawLists.users.filter(
          (u) =>
            u.id.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            u.role.toLowerCase().includes(query)
        );
      default:
        return [];
    }
  };

  const getFilteredActivities = () => {
    if (!recentActivity) return [];
    const query = searchQuery.toLowerCase().trim();
    if (!query) return recentActivity;

    return recentActivity.filter(
      (act) =>
        act.id.toLowerCase().includes(query) ||
        act.title.toLowerCase().includes(query) ||
        act.type.toLowerCase().includes(query) ||
        act.action.toLowerCase().includes(query) ||
        act.details.toLowerCase().includes(query)
    );
  };

  const filteredDbList = getFilteredList();
  const filteredActivities = getFilteredActivities();

  // Financial percentages
  const paidPct = invoiceStats.totalAmount > 0 ? (invoiceStats.totalPaid / invoiceStats.totalAmount) * 100 : 0;
  const pendingPct = invoiceStats.totalAmount > 0 ? (invoiceStats.totalPending / invoiceStats.totalAmount) * 100 : 0;

  // Quote approval percentages
  const approvalRate = quotationStats.total > 0 ? (quotationStats.approved / quotationStats.total) * 100 : 0;

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-64px)]">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 mb-1">
            <HiOutlineShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Super Administrator Terminal</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            System Analytics & Diagnostics
          </h2>
          <p className="text-sm text-slate-400">
            Real-time procurement audits, financial breakdowns, and full database history.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAnalytics}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer"
          >
            <HiOutlineRefresh className="w-4 h-4" />
            <span>Sync Data</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => {
            setActiveTab('analytics');
            setSearchQuery('');
          }}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'analytics'
              ? 'border-indigo-500 text-white bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Analytics & Insights
        </button>
        <button
          onClick={() => {
            setActiveTab('timeline');
            setSearchQuery('');
          }}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'timeline'
              ? 'border-indigo-500 text-white bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Chronological Activity Logs
        </button>
        <button
          onClick={() => {
            setActiveTab('database');
            setSearchQuery('');
          }}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'database'
              ? 'border-indigo-500 text-white bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Database Table Records
        </button>
      </div>

      {/* TAB 1: ANALYTICS & INSIGHTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Cards */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/40 transition duration-200 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total RFQs</span>
                <span className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <HiOutlineClipboardList className="w-5 h-5" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-extrabold text-white">{rfqStats.total}</span>
                <div className="text-[11px] text-slate-500 mt-1 space-x-1.5">
                  <span className="text-emerald-400">{rfqStats.open} Open</span>
                  <span>&bull;</span>
                  <span>{rfqStats.closed} Closed</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/40 transition duration-200 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bids / Quotes</span>
                <span className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                  <HiOutlineTrendingUp className="w-5 h-5" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-extrabold text-white">{quotationStats.total}</span>
                <div className="text-[11px] text-slate-500 mt-1 space-x-1.5">
                  <span className="text-amber-400">{quotationStats.pending} Pending</span>
                  <span>&bull;</span>
                  <span className="text-emerald-400">{quotationStats.approved} Approved</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/40 transition duration-200 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Purchase Orders</span>
                <span className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <HiOutlineDocumentText className="w-5 h-5" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-extrabold text-white">{poStats.total}</span>
                <div className="text-[11px] text-slate-400 mt-1 font-semibold truncate">
                  Value: {formatCurrency(poStats.totalAmount)}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/40 transition duration-200 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Raised Invoices</span>
                <span className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
                  <HiOutlineCash className="w-5 h-5" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-extrabold text-white">{invoiceStats.total}</span>
                <div className="text-[11px] text-slate-400 mt-1 font-semibold truncate">
                  Value: {formatCurrency(invoiceStats.totalAmount)}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/40 transition duration-200 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Users</span>
                <span className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                  <HiOutlineUsers className="w-5 h-5" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-extrabold text-white">{userStats.total}</span>
                <div className="text-[11px] text-slate-500 mt-1 space-x-1.5">
                  <span className="text-indigo-400">{userStats.admins} Admins</span>
                  <span>&bull;</span>
                  <span className="text-emerald-400">{userStats.vendors} Vendors</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Progress Graphs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Audits & Settlements */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-base font-bold text-white mb-4">Financial Settlements Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Total Invoice Liabilities</span>
                  <span className="font-bold text-white">{formatCurrency(invoiceStats.totalAmount)}</span>
                </div>
                
                {/* Progress bars */}
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${paidPct}%` }}
                    title={`Paid: ${paidPct.toFixed(1)}%`}
                  ></div>
                  <div
                    className="h-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${pendingPct}%` }}
                    title={`Pending: ${pendingPct.toFixed(1)}%`}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                      <span className="text-xs text-slate-400">Paid Invoices</span>
                    </div>
                    <div className="mt-1">
                      <div className="text-base font-extrabold text-white">{formatCurrency(invoiceStats.totalPaid)}</div>
                      <div className="text-[10px] text-slate-500">{paidPct.toFixed(1)}% of total</div>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
                      <span className="text-xs text-slate-400">Pending Approvals</span>
                    </div>
                    <div className="mt-1">
                      <div className="text-base font-extrabold text-white">{formatCurrency(invoiceStats.totalPending)}</div>
                      <div className="text-[10px] text-slate-500">{pendingPct.toFixed(1)}% of total</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bidding Funnel Analysis */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-base font-bold text-white mb-4">RFQ Funnel & Quotation Approval Rates</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Quotation Approval Rate</span>
                    <span className="font-bold text-indigo-400">{approvalRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${approvalRate}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 text-center">
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Pending Bids</div>
                    <div className="text-lg font-extrabold text-white mt-1">{quotationStats.pending}</div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 text-center">
                    <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Approved Bids</div>
                    <div className="text-lg font-extrabold text-white mt-1">{quotationStats.approved}</div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-2.5 text-center">
                    <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Rejected Bids</div>
                    <div className="text-lg font-extrabold text-white mt-1">{quotationStats.rejected}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-850 border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Allocated RFQ Budgets:</span>
                  <span className="font-extrabold text-white bg-slate-950 px-2.5 py-1 rounded border border-slate-850 border-slate-850 border-slate-800">
                    {formatCurrency(rfqStats.totalBudget)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Peek of Activity Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-100">Recent Activity Stream</h3>
              <button
                onClick={() => setActiveTab('timeline')}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
              >
                View full logs &rarr;
              </button>
            </div>

            <div className="relative border-l border-slate-800 pl-4 space-y-4 py-2">
              {recentActivity.slice(0, 5).map((act, i) => (
                <div key={`${act.id}-${i}`} className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                    <div className={`w-1 h-1 rounded-full ${
                      act.type === 'RFQ' ? 'bg-indigo-400' :
                      act.type === 'Quotation' ? 'bg-amber-400' :
                      act.type === 'PurchaseOrder' ? 'bg-emerald-400' : 'bg-teal-400'
                    }`}></div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div>
                      <span className={`font-bold mr-2 text-[10px] tracking-wide uppercase px-1.5 py-0.5 rounded ${
                        act.type === 'RFQ' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                        act.type === 'Quotation' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        act.type === 'PurchaseOrder' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                      }`}>
                        {act.type}
                      </span>
                      <span className="text-slate-300 font-bold">{act.action}</span>
                      <span className="text-slate-500 mx-1.5">&bull;</span>
                      <span className="text-slate-400">{act.id} ({act.title})</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">{act.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 ml-14 font-medium italic">{act.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHRONOLOGICAL ACTIVITY LOGS */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <HiOutlineSearch className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit trail..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-slate-650 outline-none transition"
              />
            </div>
            <div className="text-xs text-slate-400 font-semibold shrink-0">
              Showing {filteredActivities.length} logs of {recentActivity.length} total events.
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            {filteredActivities.length > 0 ? (
              <div className="divide-y divide-slate-800">
                {filteredActivities.map((act, i) => (
                  <div key={`${act.id}-${i}`} className="py-4.5 py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide ${
                          act.type === 'RFQ' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          act.type === 'Quotation' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          act.type === 'PurchaseOrder' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        }`}>
                          {act.type}
                        </span>
                        <span className="text-white font-semibold">{act.action}</span>
                        <span className="text-slate-600 font-semibold">&mdash;</span>
                        <span className="text-slate-350">{act.id}</span>
                        <span className="text-slate-500 text-xs">({act.title})</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-bold">
                        <HiOutlineClock className="w-3.5 h-3.5" />
                        <span>{act.date}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-1.5">
                      <p className="text-xs text-slate-400 font-medium ml-0 pl-0 italic">{act.details}</p>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        act.status === 'Open' || act.status === 'Approved' || act.status === 'Paid' || act.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                        act.status === 'Pending' || act.status === 'Issued' || act.status === 'Invoiced' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-slate-700/20 text-slate-400'
                      }`}>
                        {act.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <HiOutlineSearch className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                <p className="text-sm">No activity logs match your search.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DATABASE TABLE RECORDS */}
      {activeTab === 'database' && (
        <div className="space-y-4">
          {/* Sub tabs selector */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'rfqs', label: `RFQs (${rawLists.rfqs.length})` },
              { id: 'quotations', label: `Quotations (${rawLists.quotations.length})` },
              { id: 'pos', label: `Purchase Orders (${rawLists.purchaseOrders.length})` },
              { id: 'invoices', label: `Invoices (${rawLists.invoices.length})` },
              { id: 'users', label: `System Users (${rawLists.users.length})` },
            ].map((subTab) => (
              <button
                key={subTab.id}
                onClick={() => {
                  setDbSubTab(subTab.id);
                  setSearchQuery('');
                }}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition border cursor-pointer ${
                  dbSubTab === subTab.id
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {subTab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <HiOutlineSearch className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${dbSubTab.toUpperCase()} records...`}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-slate-600 outline-none transition"
              />
            </div>
            <div className="text-xs text-slate-400 font-semibold">
              Found {filteredDbList.length} database records.
            </div>
          </div>

          {/* Tables */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            {filteredDbList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  {/* Table headers */}
                  {dbSubTab === 'rfqs' && (
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-850 border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="p-4">RFQ ID</th>
                        <th className="p-4">Title</th>
                        <th className="p-4">Budget</th>
                        <th className="p-4">Quantity</th>
                        <th className="p-4">Deadline</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                  )}
                  {dbSubTab === 'quotations' && (
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-850 border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="p-4">Quote ID</th>
                        <th className="p-4">RFQ Title</th>
                        <th className="p-4">Vendor</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Lead Time</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                  )}
                  {dbSubTab === 'pos' && (
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-850 border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="p-4">PO ID</th>
                        <th className="p-4">RFQ Title</th>
                        <th className="p-4">Vendor Name</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Delivery Date</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                  )}
                  {dbSubTab === 'invoices' && (
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-850 border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="p-4">Invoice ID</th>
                        <th className="p-4">Number</th>
                        <th className="p-4">Vendor Name</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Created Date</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                  )}
                  {dbSubTab === 'users' && (
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-850 border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="p-4">User ID</th>
                        <th className="p-4">Email Address</th>
                        <th className="p-4">System Role</th>
                      </tr>
                    </thead>
                  )}

                  {/* Table body */}
                  <tbody className="divide-y divide-slate-800/60">
                    {dbSubTab === 'rfqs' &&
                      filteredDbList.map((rfq) => (
                        <tr key={rfq.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-4 font-bold text-white">{rfq.id}</td>
                          <td className="p-4 text-slate-300 font-semibold">{rfq.title}</td>
                          <td className="p-4 text-slate-400 font-bold">{formatCurrency(rfq.budget)}</td>
                          <td className="p-4 text-slate-400 font-semibold">{rfq.quantity}</td>
                          <td className="p-4 text-slate-400 font-semibold">{rfq.deadline}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                              rfq.status === 'Open' ? 'bg-indigo-500/10 text-indigo-400' :
                              rfq.status === 'Closed' ? 'bg-slate-700/20 text-slate-400' :
                              'bg-amber-500/10 text-amber-400'
                            }`}>
                              {rfq.status}
                            </span>
                          </td>
                        </tr>
                      ))}

                    {dbSubTab === 'quotations' &&
                      filteredDbList.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-4 font-bold text-white">{q.id}</td>
                          <td className="p-4 text-slate-300 font-semibold">{q.rfqTitle}</td>
                          <td className="p-4">
                            <div className="font-bold text-slate-300">{q.vendorName}</div>
                            <div className="text-[10px] text-slate-500">{q.vendorEmail}</div>
                          </td>
                          <td className="p-4 text-white font-bold">{formatCurrency(q.price)}</td>
                          <td className="p-4 text-slate-400 font-semibold">{q.leadTime} days</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                              q.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                              q.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' :
                              'bg-amber-500/10 text-amber-400'
                            }`}>
                              {q.status}
                            </span>
                          </td>
                        </tr>
                      ))}

                    {dbSubTab === 'pos' &&
                      filteredDbList.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-4 font-bold text-white">{p.id}</td>
                          <td className="p-4 text-slate-300 font-semibold">{p.rfqTitle}</td>
                          <td className="p-4">
                            <div className="font-bold text-slate-300">{p.vendorName}</div>
                            <div className="text-[10px] text-slate-500">{p.vendorEmail}</div>
                          </td>
                          <td className="p-4 text-white font-bold">{formatCurrency(p.totalAmount)}</td>
                          <td className="p-4 text-slate-400 font-semibold">{p.deliveryDate}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                              p.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                              p.status === 'Issued' || p.status === 'Invoiced' ? 'bg-amber-500/10 text-amber-400' :
                              'bg-slate-700/20 text-slate-400'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}

                    {dbSubTab === 'invoices' &&
                      filteredDbList.map((i) => (
                        <tr key={i.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-4 font-bold text-white">{i.id}</td>
                          <td className="p-4 text-slate-300 font-semibold">{i.invoiceNumber}</td>
                          <td className="p-4">
                            <div className="font-bold text-slate-300">{i.vendorName}</div>
                            <div className="text-[10px] text-slate-500">{i.vendorEmail}</div>
                          </td>
                          <td className="p-4 text-white font-bold">{formatCurrency(i.amount)}</td>
                          <td className="p-4 text-slate-400 font-semibold">{i.createdDate}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                              i.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' :
                              'bg-amber-500/10 text-amber-400'
                            }`}>
                              {i.status}
                            </span>
                          </td>
                        </tr>
                      ))}

                    {dbSubTab === 'users' &&
                      filteredDbList.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-850 hover:bg-slate-800/40 transition">
                          <td className="p-4 font-bold text-white">{u.id}</td>
                          <td className="p-4 text-slate-300 font-bold">{u.email}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                              u.role === 'SuperAdmin' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' :
                              u.role === 'Admin' ? 'bg-indigo-500/10 text-indigo-400' :
                              'bg-emerald-500/10 text-emerald-400'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 bg-slate-900">
                <HiOutlineSearch className="w-12 h-12 mx-auto mb-2 text-slate-650" />
                <p className="text-sm">No records match your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
