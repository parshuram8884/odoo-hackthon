import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineUser,
} from 'react-icons/hi';

const VendorQuotationList = () => {
  const { user, quotations } = useApp();
  const navigate = useNavigate();

  if (!user) return null;

  // Filter quotes based on vendor email
  const displayQuotes = quotations.filter((q) => q.vendorEmail === user.email);

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-64px)]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">My Bid Quotations</h2>
          <p className="text-sm text-slate-400">
            Track the status and details of your submitted quotations.
          </p>
        </div>
        <button
          onClick={() => navigate('/quotations/submit')}
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-lg transition"
        >
          <span>+ Submit New Quotation</span>
        </button>
      </div>

      {/* Quotes List */}
      {displayQuotes.length > 0 ? (
        <div className="space-y-4">
          {displayQuotes.map((quote) => (
            <div
              key={quote.id}
              className={`bg-slate-900 border rounded-xl p-5 transition-colors duration-150 ${
                quote.status === 'Approved'
                  ? 'border-emerald-500/30 bg-emerald-955 bg-emerald-950/5'
                  : quote.status === 'Rejected'
                  ? 'border-red-500/30 bg-red-950/5'
                  : 'border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase bg-slate-955 bg-slate-950 px-2 py-0.5 rounded text-indigo-400 border border-slate-800">
                    {quote.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 inline-block ml-3">
                    {quote.rfqTitle}
                  </h3>
                  <span className="text-[10px] text-slate-500 block sm:inline sm:ml-3">
                    (RFQ Ref: {quote.rfqId})
                  </span>
                </div>

                <div>
                  <span
                    className={`text-[10px] uppercase font-extrabold px-3 py-1 rounded-full ${
                      quote.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : quote.status === 'Rejected'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {quote.status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-350">
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-2">
                    <HiOutlineUser className="w-4 h-4 text-slate-500" />
                    <span>Vendor: <strong className="text-slate-200">{quote.vendorName}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HiOutlineCurrencyDollar className="w-4 h-4 text-slate-500" />
                    <span>Bid Pricing: <strong className="text-white text-sm font-bold">${quote.price ? quote.price.toLocaleString() : 0}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HiOutlineClock className="w-4 h-4 text-slate-500" />
                    <span>Delivery Frame: <strong className="text-slate-200">{quote.leadTime} days</strong></span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Proposal Notes / Details:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    {quote.notes || 'No notes provided by vendor.'}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="border-t border-slate-800/80 mt-4 pt-3.5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 inline-flex items-center space-x-1">
                  <HiOutlineCalendar className="w-3.5 h-3.5" />
                  <span>Submitted on {quote.submittedDate}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-sm text-slate-400">No quotation proposals submitted yet.</p>
        </div>
      )}
    </div>
  );
};

export default VendorQuotationList;
