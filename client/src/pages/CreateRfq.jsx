import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { HiOutlineArrowLeft, HiOutlineSave } from 'react-icons/hi';

const CreateRfq = () => {
  const { createRfq } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState('');
  const [quantity, setQuantity] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');

  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !quantity || !budget || !deadline) return;

    createRfq(title, description, items, quantity, deadline, budget);
    setSuccess(true);
    setTimeout(() => {
      navigate('/rfqs');
    }, 1200);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-64px)]">
      {/* Back Link */}
      <button
        onClick={() => navigate('/rfqs')}
        className="inline-flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        <span>Back to RFQs List</span>
      </button>

      {/* Form Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-1">Create Request for Quotation</h2>
        <p className="text-xs text-slate-400 mb-6">
          Specify procurement requirements. This RFQ will initially save as a draft for your approval.
        </p>

        {success ? (
          <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold rounded-lg p-4 text-center py-8">
            RFQ created successfully! Redirecting to list...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                RFQ Title / Project Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Office Laptop Procurement"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2.5 px-3 text-sm placeholder-slate-700 outline-none text-white transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Description / Specifications
              </label>
              <textarea
                rows="4"
                placeholder="Detailed specifications, warranty requirements, assembly needs..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2.5 px-3 text-sm placeholder-slate-700 outline-none text-white transition resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item Categories */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Item Category / Short Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Developer Laptops"
                  value={items}
                  onChange={(e) => setItems(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm placeholder-slate-700 outline-none text-white transition"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Quantity Required
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 15"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm placeholder-slate-700 outline-none text-white transition"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Project Budget ($ USD)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 22500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm placeholder-slate-700 outline-none text-white transition"
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Submission Deadline
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm outline-none text-white transition cursor-pointer"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-3 border-t border-slate-850 border-slate-800 pt-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('/rfqs')}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold py-2.5 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-lg text-xs transition shadow-lg shadow-indigo-600/10"
              >
                <HiOutlineSave className="w-4 h-4" />
                <span>Save Draft RFQ</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateRfq;
