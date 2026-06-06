import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HiOutlineSearch,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineFolderOpen,
  HiOutlineBadgeCheck,
} from 'react-icons/hi';

const VendorRfqList = () => {
  const { user, rfqs, submitQuotation, quotations } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Quotation Form Modal state
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [price, setPrice] = useState('');
  const [leadTime, setLeadTime] = useState('');
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!user) return null;

  // Filter RFQs with null-safety checks
  const filteredRfqs = rfqs.filter((rfq) => {
    // Vendors only see Open and Closed RFQs
    const matchesRole = rfq.status === 'Open' || rfq.status === 'Closed';
    const titleMatch = rfq.title ? rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const idMatch = rfq.id ? rfq.id.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const itemsMatch = rfq.items ? rfq.items.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    
    const matchesSearch = titleMatch || idMatch || itemsMatch;
    const matchesStatus = statusFilter === 'All' || rfq.status === statusFilter;
    
    return matchesRole && matchesSearch && matchesStatus;
  });

  const handleOpenBidModal = (rfq) => {
    setSelectedRfq(rfq);
    setPrice('');
    setLeadTime('');
    setNotes('');
    setSuccessMsg('');
  };

  const handleCloseBidModal = () => {
    setSelectedRfq(null);
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!price || !leadTime) return;

    try {
      await submitQuotation(selectedRfq.id, selectedRfq.title, price, leadTime, notes);
      setSuccessMsg('Your quotation has been submitted successfully!');
      setTimeout(() => {
        handleCloseBidModal();
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  const hasSubmittedBid = (rfqId) => {
    return quotations.some((q) => q.rfqId === rfqId && q.vendorEmail === user.email);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-64px)]">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Available RFQs</h2>
        <p className="text-sm text-slate-400">
          Browse active RFQs and submit your competitive pricing bids.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by ID, title, or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 pl-9 pr-4 text-sm outline-none text-white transition"
          />
          <HiOutlineSearch className="w-5 h-5 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
            Filter Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm outline-none text-white transition cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* RFQ List Grid */}
      {filteredRfqs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRfqs.map((rfq) => (
            <div
              key={rfq.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition duration-150 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-indigo-400">
                    {rfq.id}
                  </span>
                  <span
                    className={`text-[9px] uppercase font-extrabold px-2.5 py-0.5 rounded-full ${
                      rfq.status === 'Open'
                        ? 'bg-indigo-500/10 text-indigo-400'
                        : 'bg-slate-500/10 text-slate-400'
                    }`}
                  >
                    {rfq.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-3 truncate">{rfq.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 h-8">{rfq.description}</p>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-800 mt-4 pt-4 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <HiOutlineFolderOpen className="w-4 h-4 text-slate-500" />
                    <span>Qty: <strong className="text-slate-100">{rfq.quantity}</strong> units</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HiOutlineCurrencyDollar className="w-4 h-4 text-slate-500" />
                    <span>Budget: <strong className="text-slate-100">₹{rfq.budget ? rfq.budget.toLocaleString() : 0}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 col-span-2">
                    <HiOutlineCalendar className="w-4 h-4 text-slate-500" />
                    <span>Submission Deadline: <strong className="text-slate-100">{rfq.deadline}</strong></span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-800 mt-4 pt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-semibold">
                  Created on {rfq.createdDate}
                </span>

                {rfq.status === 'Open' ? (
                  hasSubmittedBid(rfq.id) ? (
                    <span className="inline-flex items-center space-x-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <HiOutlineBadgeCheck className="w-4 h-4" />
                      <span>Bid Submitted</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenBidModal(rfq)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md active:translate-y-px transition"
                    >
                      Submit Quotation
                    </button>
                  )
                ) : (
                  <span className="text-xs text-slate-500 font-medium">Bidding Closed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-sm text-slate-400">No Request for Quotations found matching your search.</p>
        </div>
      )}

      {/* Bid submission modal */}
      {selectedRfq && (
        <div className="fixed inset-0 z-50 bg-slate-955 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Submit Quotation</h3>
            <p className="text-xs text-slate-400 mb-4">
              Submit your bidding proposal for: <span className="text-indigo-400 font-semibold">{selectedRfq.title}</span>
            </p>

            {successMsg ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-lg p-4 text-center py-8">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleBidSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Total Bid Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 12000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm outline-none text-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Lead Time (days)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 14"
                      value={leadTime}
                      onChange={(e) => setLeadTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm outline-none text-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Proposal Details / Notes
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Describe warranty terms, material specs, or support scope..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-955 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm outline-none text-white transition resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end space-x-3 border-t border-slate-800 pt-4 mt-4">
                  <button
                    type="button"
                    onClick={handleCloseBidModal}
                    className="text-slate-400 hover:text-slate-200 text-xs font-bold py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition shadow-md"
                  >
                    Submit Bid Proposal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorRfqList;
