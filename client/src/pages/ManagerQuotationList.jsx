import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlinePencil,
} from 'react-icons/hi';

const ManagerQuotationList = () => {
  const { user, quotations, updateQuotationStatus, updateQuotation } = useApp();

  // Edit Quotation Modal State
  const [editingQuote, setEditingQuote] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editLeadTime, setEditLeadTime] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('');



  const handleCloseEditModal = () => {
    setEditingQuote(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editPrice || !editLeadTime) return;

    try {
      await updateQuotation(editingQuote.id, {
        price: Number(editPrice),
        leadTime: Number(editLeadTime),
        notes: editNotes,
        status: editStatus,
      });
      handleCloseEditModal();
    } catch (err) {
      console.error('Failed to update Quotation:', err);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-64px)]">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Received Quotations</h2>
        <p className="text-sm text-slate-400">
          Review vendor bidding submissions, compare prices, and approve contracts to generate Purchase Orders.
        </p>
      </div>

      {/* Quotes List */}
      {quotations.length > 0 ? (
        <div className="space-y-4">
          {quotations.map((quote) => (
            <div
              key={quote.id}
              className={`bg-slate-900 border rounded-xl p-5 transition-colors duration-150 ${quote.status === 'Approved'
                ? 'border-emerald-500/30 bg-emerald-955 bg-emerald-950/5'
                : quote.status === 'Rejected'
                  ? 'border-red-500/30 bg-red-955 bg-red-950/5'
                  : 'border-slate-800'
                }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase bg-slate-950 px-2 py-0.5 rounded text-indigo-400 border border-slate-800">
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
                    className={`text-[10px] uppercase font-extrabold px-3 py-1 rounded-full ${quote.status === 'Approved'
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
                    <span>Bid Pricing: <strong className="text-white text-sm font-bold">₹{quote.price ? quote.price.toLocaleString() : 0}</strong></span>
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

              {/* Footer Actions */}
              <div className="border-t border-slate-800/80 mt-4 pt-3.5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 inline-flex items-center space-x-1">
                  <HiOutlineCalendar className="w-3.5 h-3.5" />
                  <span>Submitted on {quote.submittedDate}</span>
                </span>

                {quote.status === 'Pending' && (
                  <div className="flex space-x-2">

                    <button
                      onClick={() => updateQuotationStatus(quote.id, 'Rejected')}
                      className="inline-flex items-center space-x-1 border border-red-500/30 bg-red-500/5 hover:bg-red-500 hover:text-white hover:border-red-500 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition duration-150 cursor-pointer"
                    >
                      <HiOutlineX className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => updateQuotationStatus(quote.id, 'Approved')}
                      className="inline-flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md active:translate-y-px transition duration-150 cursor-pointer"
                    >
                      <HiOutlineCheck className="w-4 h-4" />
                      <span>Approve & Issue PO</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-sm text-slate-400">No quotation proposals received yet.</p>
        </div>
      )}

      {/* Edit Quotation Modal overlay */}
      {editingQuote && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Edit Bid Quotation</h3>
            <p className="text-xs text-slate-400 mb-4">
              Modify details for Quotation ID: <span className="text-indigo-400 font-semibold">{editingQuote.id}</span>
            </p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Bid Pricing (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm text-white outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Lead Time (days)
                  </label>
                  <input
                    type="number"
                    required
                    value={editLeadTime}
                    onChange={(e) => setEditLeadTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm text-white outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Quotation Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm text-white outline-none transition cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Proposal Notes / Details
                </label>
                <textarea
                  rows="3"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm text-white outline-none transition resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 border-t border-slate-800 pt-4 mt-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="text-slate-400 hover:text-slate-200 text-xs font-bold py-2 px-4 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-2 px-4 rounded-lg text-xs transition shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerQuotationList;
