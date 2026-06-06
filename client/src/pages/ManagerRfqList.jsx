import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  HiOutlineSearch,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineFolderOpen,
  HiOutlineLightningBolt,
} from 'react-icons/hi';

const ManagerRfqList = () => {
  const { rfqs, publishRfq } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter RFQs with null-safety checks
  const filteredRfqs = rfqs.filter((rfq) => {
    const titleMatch = rfq.title ? rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const idMatch = rfq.id ? rfq.id.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const itemsMatch = rfq.items ? rfq.items.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    
    const matchesSearch = titleMatch || idMatch || itemsMatch;
    const matchesStatus = statusFilter === 'All' || rfq.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-64px)]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">RFQ Management</h2>
          <p className="text-sm text-slate-400">
            Create, edit, publish, and monitor Requests for Quotation (RFQs).
          </p>
        </div>
        <button
          onClick={() => navigate('/rfqs/create')}
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-lg transition"
        >
          <span>Create New RFQ</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by ID, title, or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-955 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 pl-9 pr-4 text-sm outline-none text-white transition"
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
            <option value="Pending">Pending</option>
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
                        : rfq.status === 'Closed'
                        ? 'bg-slate-500/10 text-slate-400'
                        : 'bg-amber-500/10 text-amber-400'
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
                    <span>Budget: <strong className="text-slate-100">${rfq.budget ? rfq.budget.toLocaleString() : 0}</strong></span>
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

                {rfq.status === 'Pending' ? (
                  <button
                    onClick={() => publishRfq(rfq.id)}
                    className="inline-flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-750 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md active:translate-y-px transition"
                  >
                    <HiOutlineLightningBolt className="w-4 h-4" />
                    <span>Publish RFQ</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 font-medium">Published</span>
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
    </div>
  );
};

export default ManagerRfqList;
