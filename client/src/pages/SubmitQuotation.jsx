import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { HiOutlineArrowLeft, HiOutlinePaperAirplane } from 'react-icons/hi';

const SubmitQuotation = () => {
  const { user, rfqs, quotations, submitQuotation } = useApp();
  const navigate = useNavigate();

  const [rfqId, setRfqId] = useState('');
  const [price, setPrice] = useState('');
  const [leadTime, setLeadTime] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user || user.role !== 'Vendor') {
    // If not a vendor, they shouldn't access this form
    return <div className="p-6 text-red-500">Access Denied</div>;
  }

  // Get list of open RFQs that this vendor has not bid on yet
  const availableRfqs = rfqs.filter(
    (rfq) =>
      rfq.status === 'Open' &&
      !quotations.some((q) => q.rfqId === rfq.id && q.vendorEmail === user.email)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rfqId || !price || !leadTime) return;

    const targetRfq = rfqs.find((r) => r.id === rfqId);
    if (!targetRfq) return;

    submitQuotation(targetRfq.id, targetRfq.title, price, leadTime, notes);
    setSuccess(true);
    setTimeout(() => {
      navigate('/quotations');
    }, 1200);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-64px)]">
      {/* Back to list */}
      <button
        onClick={() => navigate('/quotations')}
        className="inline-flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        <span>Back to Quotations</span>
      </button>

      {/* Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-1">Submit Bidding Quotation</h2>
        <p className="text-xs text-slate-400 mb-6">
          Submit your proposal pricing, lead time, and delivery terms to the manager.
        </p>

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-lg p-4 text-center py-8">
            Quotation submitted successfully! Forwarding to manager...
          </div>
        ) : availableRfqs.length > 0 ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* RFQ Select Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Select Request for Quotation (RFQ)
              </label>
              <select
                required
                value={rfqId}
                onChange={(e) => setRfqId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2.5 px-3 text-sm outline-none text-white transition cursor-pointer"
              >
                <option value="">-- Select an active RFQ project --</option>
                {availableRfqs.map((rfq) => (
                  <option key={rfq.id} value={rfq.id}>
                    {rfq.id} - {rfq.title} (Budget: ${rfq.budget ? rfq.budget.toLocaleString() : 0})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bid price */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Your Quote Price ($ USD)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 12000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm placeholder-slate-700 outline-none text-white transition"
                />
              </div>

              {/* Lead time */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Delivery Lead Time (days)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 14"
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm placeholder-slate-700 outline-none text-white transition"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Proposal Notes & Terms
              </label>
              <textarea
                rows="4"
                placeholder="Detail warranty terms, specifications, items description, payment terms, etc..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2.5 px-3 text-sm placeholder-slate-700 outline-none text-white transition resize-none"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-3 border-t border-slate-800 pt-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('/quotations')}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold py-2.5 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center space-x-2 bg-emerald-650 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-lg text-xs transition shadow-lg shadow-emerald-600/10"
              >
                <HiOutlinePaperAirplane className="w-4 h-4 transform rotate-90" />
                <span>Submit to Manager</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-8 text-center text-slate-450 border-slate-800 py-12">
            <p className="text-sm font-semibold text-slate-400">There are no open RFQs currently available for bidding.</p>
            <p className="text-xs text-slate-500 mt-1">Please wait for the manager to publish a new Request for Quotation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitQuotation;
