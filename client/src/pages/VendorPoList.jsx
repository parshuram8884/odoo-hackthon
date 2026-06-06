import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HiOutlineDocumentText,
  HiOutlineUser,
  HiOutlineCash,
  HiOutlineCalendar,
  HiOutlinePlusCircle,
} from 'react-icons/hi';

const VendorPoList = () => {
  const { user, purchaseOrders, raiseInvoice } = useApp();

  const [selectedPo, setSelectedPo] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!user) return null;

  // Filter POs based on vendor email
  const displayPOs = purchaseOrders.filter((p) => p.vendorEmail === user.email);

  const handleOpenInvoiceModal = (po) => {
    setSelectedPo(po);
    setInvoiceNumber(`INV-2026-${Math.floor(100 + Math.random() * 900)}`);
    setNotes('');
    setSuccessMsg('');
  };

  const handleCloseInvoiceModal = () => {
    setSelectedPo(null);
  };

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();
    if (!invoiceNumber) return;

    try {
      await raiseInvoice(selectedPo.id, invoiceNumber, notes);
      setSuccessMsg('Invoice raised successfully!');
      setTimeout(() => {
        handleCloseInvoiceModal();
      }, 1200);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-64px)]">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Purchase Orders</h2>
        <p className="text-sm text-slate-400">
          View purchase contracts issued to you and submit invoices for payment.
        </p>
      </div>

      {/* PO List */}
      {displayPOs.length > 0 ? (
        <div className="space-y-4">
          {displayPOs.map((po) => (
            <div
              key={po.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold uppercase bg-slate-950 px-2 py-0.5 rounded text-indigo-400 border border-slate-800">
                    {po.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">{po.rfqTitle}</h3>
                </div>
                <span
                  className={`text-[9px] uppercase font-extrabold px-2.5 py-0.5 rounded-full ${
                    po.status === 'Completed' || po.status === 'Delivered'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : po.status === 'Invoiced'
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'bg-indigo-500/10 text-indigo-400'
                  }`}
                >
                  {po.status}
                </span>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-350">
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-2">
                    <HiOutlineUser className="w-4 h-4 text-slate-500" />
                    <span>Vendor: <strong className="text-slate-200">{po.vendorName}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HiOutlineCash className="w-4 h-4 text-slate-500" />
                    <span>PO Total Amount: <strong className="text-white font-bold">${po.totalAmount ? po.totalAmount.toLocaleString() : 0}</strong></span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center space-x-2">
                    <HiOutlineCalendar className="w-4 h-4 text-slate-500" />
                    <span>Expected Delivery: <strong className="text-slate-200">{po.deliveryDate}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HiOutlineDocumentText className="w-4 h-4 text-slate-500" />
                    <span>Issued Date: <strong className="text-slate-200">{po.createdDate}</strong></span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              {(po.status === 'Issued' || po.status === 'Delivered') && (
                <div className="border-t border-slate-800/80 mt-4 pt-3.5 flex justify-end">
                  <button
                    onClick={() => handleOpenInvoiceModal(po)}
                    className="inline-flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md active:translate-y-px transition"
                  >
                    <HiOutlinePlusCircle className="w-4 h-4" />
                    <span>Raise Invoice</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-sm text-slate-400">No Purchase Orders issued to you yet.</p>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedPo && (
        <div className="fixed inset-0 z-50 bg-slate-955 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Raise Invoice</h3>
            <p className="text-xs text-slate-400 mb-4">
              Submit invoice details for PO Ref: <span className="text-indigo-400 font-semibold">{selectedPo.id}</span>
            </p>

            {successMsg ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-lg p-4 text-center py-8">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleInvoiceSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. INV-2026-001"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm outline-none text-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Billing Amount ($)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={`$${selectedPo.totalAmount ? selectedPo.totalAmount.toLocaleString() : 0}`}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-500 cursor-not-allowed font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Invoice Notes / Payment Details
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Enter wire transfer details or reference notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-955 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm outline-none text-white transition resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end space-x-3 border-t border-slate-800 pt-4 mt-4">
                  <button
                    type="button"
                    onClick={handleCloseInvoiceModal}
                    className="text-slate-400 hover:text-slate-200 text-xs font-bold py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition shadow-md"
                  >
                    Submit Invoice
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

export default VendorPoList;
