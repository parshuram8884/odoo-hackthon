import React from 'react';
import { useApp } from '../context/AppContext';
import {
  HiOutlineDocumentText,
  HiOutlineUser,
  HiOutlineCash,
  HiOutlineCalendar,
} from 'react-icons/hi';

const ManagerPoList = () => {
  const { purchaseOrders } = useApp();

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-64px)]">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Purchase Orders</h2>
        <p className="text-sm text-slate-400">
          Track generated Purchase Orders (PO), delivery schedules, and invoicing statuses.
        </p>
      </div>

      {/* PO List */}
      {purchaseOrders.length > 0 ? (
        <div className="space-y-4">
          {purchaseOrders.map((po) => (
            <div
              key={po.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold uppercase bg-slate-955 bg-slate-950 px-2 py-0.5 rounded text-indigo-400 border border-slate-800">
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
                    <span>PO Total Amount: <strong className="text-white font-bold">₹{po.totalAmount ? po.totalAmount.toLocaleString() : 0}</strong></span>
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
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-sm text-slate-400">No Purchase Orders issued yet.</p>
        </div>
      )}
    </div>
  );
};

export default ManagerPoList;
