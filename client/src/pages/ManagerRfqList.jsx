import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  HiOutlineSearch,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineFolderOpen,
  HiOutlineLightningBolt,
  HiOutlinePencil,
} from 'react-icons/hi';

const ManagerRfqList = () => {
  const { user, rfqs, publishRfq, updateRfq } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Edit RFQ Modal State
  const [editingRfq, setEditingRfq] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editItems, setEditItems] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const handleOpenEditModal = (rfq) => {
    setEditingRfq(rfq);
    setEditTitle(rfq.title || '');
    setEditDescription(rfq.description || '');
    setEditItems(rfq.items || '');
    setEditQuantity(rfq.quantity || 0);
    setEditBudget(rfq.budget || 0);
    setEditDeadline(rfq.deadline || '');
    setEditStatus(rfq.status || 'Pending');
  };

  const handleCloseEditModal = () => {
    setEditingRfq(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle || !editQuantity || !editBudget || !editDeadline) return;

    try {
      await updateRfq(editingRfq.id, {
        title: editTitle,
        description: editDescription,
        items: editItems,
        quantity: Number(editQuantity),
        budget: Number(editBudget),
        deadline: editDeadline,
        status: editStatus,
      });
      handleCloseEditModal();
    } catch (err) {
      console.error('Failed to save changes to RFQ:', err);
    }
  };

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
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-lg transition cursor-pointer"
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
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2.5 pl-9 pr-4 text-sm outline-none text-white transition"
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

                <div className="flex items-center space-x-2">
                  {user?.role !== 'SuperAdmin' && rfq.status !== 'Closed' && (
                    <button
                      onClick={() => handleOpenEditModal(rfq)}
                      className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow active:translate-y-px transition cursor-pointer"
                    >
                      <HiOutlinePencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}

                  {rfq.status === 'Pending' ? (
                    <button
                      onClick={() => publishRfq(rfq.id)}
                      className="inline-flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-750 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md active:translate-y-px transition cursor-pointer"
                    >
                      <HiOutlineLightningBolt className="w-4 h-4" />
                      <span>Publish</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 font-bold tracking-wide uppercase px-2 py-1 bg-slate-950/40 rounded">Published</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-sm text-slate-400">No Request for Quotations found matching your search.</p>
        </div>
      )}

      {/* Edit RFQ Modal overlay */}
      {editingRfq && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Edit Request for Quotation</h3>
            <p className="text-xs text-slate-400 mb-4">
              Modify details for RFQ ID: <span className="text-indigo-400 font-semibold">{editingRfq.id}</span>
            </p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  RFQ Title / Project Name
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm text-white outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Description / Specifications
                </label>
                <textarea
                  rows="3"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm text-white outline-none transition resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Item Category
                  </label>
                  <input
                    type="text"
                    required
                    value={editItems}
                    onChange={(e) => setEditItems(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm text-white outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Quantity Required
                  </label>
                  <input
                    type="number"
                    required
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm text-white outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Project Budget (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm text-white outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    RFQ Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm text-white outline-none transition cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Submission Deadline
                </label>
                <input
                  type="date"
                  required
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm text-white outline-none transition cursor-pointer"
                />
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

export default ManagerRfqList;
