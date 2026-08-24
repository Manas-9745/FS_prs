import React, { useState } from 'react';
import Modal from './Modal';

const ReportItemModal = ({ isOpen, onClose, onAddItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    location: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Lost',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddItem({
      ...formData,
      id: Date.now(), // simple unique id
    });
    onClose();
    // Reset form
    setFormData({
      name: '',
      category: 'Electronics',
      location: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Lost',
      description: ''
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report an Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="flex gap-4">
          <label className="flex-1 cursor-pointer">
            <input type="radio" name="status" value="Lost" checked={formData.status === 'Lost'} onChange={handleChange} className="peer sr-only" />
            <div className="text-center px-4 py-2 rounded-lg border border-gray-200 peer-checked:border-rose-500 peer-checked:bg-rose-50 peer-checked:text-rose-700 transition">
              I Lost Something
            </div>
          </label>
          <label className="flex-1 cursor-pointer">
            <input type="radio" name="status" value="Found" checked={formData.status === 'Found'} onChange={handleChange} className="peer sr-only" />
            <div className="text-center px-4 py-2 rounded-lg border border-gray-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 transition">
              I Found Something
            </div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-indigo-200 outline-none transition" placeholder="e.g. Blue Hydro Flask" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-indigo-200 outline-none transition">
              <option>Electronics</option>
              <option>Accessories</option>
              <option>Documents</option>
              <option>Stationery</option>
              <option>Other</option>
            </select>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
             <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-indigo-200 outline-none transition" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-indigo-200 outline-none transition" placeholder="e.g. Library 2nd Floor" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-indigo-200 outline-none transition" placeholder="Provide details (color, brand, identifying marks...)"></textarea>
        </div>

        <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors mt-2">
          Submit Report
        </button>

      </form>
    </Modal>
  );
};

export default ReportItemModal;
