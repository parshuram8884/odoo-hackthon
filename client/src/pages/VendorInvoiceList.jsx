import React from 'react';
import { useApp } from '../context/AppContext';
import {
  HiOutlineCash,
  HiOutlineUser,
  HiOutlineDocumentReport,
  HiOutlineCalendar,
  HiOutlineDownload,
} from 'react-icons/hi';
import { downloadInvoicePdf } from '../utils/pdfGenerator';

const VendorInvoiceList = () => {
  const { user, invoices } = useApp();

  if (!user) return null;

  const displayInvoices = invoices.filter((i) => i.vendorEmail === user.email);

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-64px)]">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Invoices</h2>
        <p className="text-sm text-slate-400">
          Track status of your submitted invoices and billing amounts.
        </p>
      </div>

      {/* Invoice List */}
      {displayInvoices.length > 0 ? (
        <div className="space-y-4">
          {displayInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className={`bg-slate-900 border rounded-xl p-5 hover:border-slate-700 transition ${
                invoice.status === 'Paid'
                  ? 'border-emerald-500/30 bg-emerald-950/5'
                  : 'border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold uppercase bg-slate-950 px-2 py-0.5 rounded text-indigo-400 border border-slate-800">
                    {invoice.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">{invoice.rfqTitle}</h3>
                </div>
                <span
                  className={`text-[9px] uppercase font-extrabold px-2.5 py-0.5 rounded-full ${
                    invoice.status === 'Paid'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {invoice.status}
                </span>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-2">
                    <HiOutlineUser className="w-4 h-4 text-slate-500" />
                    <span>Vendor: <strong className="text-slate-200">{invoice.vendorName}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HiOutlineCash className="w-4 h-4 text-slate-500" />
                    <span>Invoice Amount: <strong className="text-white text-sm font-extrabold">${invoice.amount ? invoice.amount.toLocaleString() : 0}</strong></span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center space-x-2">
                    <HiOutlineDocumentReport className="w-4 h-4 text-slate-500" />
                    <span>Invoice Number: <strong className="text-slate-200">{invoice.invoiceNumber}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HiOutlineCalendar className="w-4 h-4 text-slate-500" />
                    <span>Submission Date: <strong className="text-slate-200">{invoice.createdDate}</strong></span>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Invoice Notes:
                  </span>
                  <p className="text-xs text-slate-400 italic bg-slate-950 p-2 rounded border border-slate-800">
                    {invoice.notes || 'No billing notes provided.'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-800/80 mt-4 pt-3.5 flex justify-end">
                <button
                  onClick={() => downloadInvoicePdf(invoice)}
                  className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md active:translate-y-px transition"
                >
                  <HiOutlineDownload className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-sm text-slate-400">No invoices raised yet.</p>
        </div>
      )}
    </div>
  );
};

export default VendorInvoiceList;
