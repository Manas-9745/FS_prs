import React, { useState, useContext } from 'react';
import Modal from './Modal';
import { LostFoundContext } from '../context/LostFoundContext';

const ReportItemModal = ({ isOpen, onClose, onAddItem }) => {
  // useContext() - to also add item to context's reported items
  const { addReportedItem } = useContext(LostFoundContext);

  // useState() - Controlled Form: every input is controlled by state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    location: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Lost',
    description: ''
  });

  // useState() - Form validation error message
  const [validationError, setValidationError] = useState('');

  // Event Handler: updates form state on every keystroke
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError(''); // clear error on typing
  };

  // Form Submission with validation
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default browser submission

    // Form Validation: check all required fields
    if (!formData.name || !formData.category || !formData.location || !formData.date || !formData.status || !formData.description) {
      setValidationError('Please fill all required fields.');
      return;
    }

    const newItem = {
      ...formData,
      id: Date.now(), // simple unique id
    };

    // Add to dashboard items (via prop)
    onAddItem(newItem);

    // Add to context reported items (shared state)
    addReportedItem(newItem);

    // Clear form and close modal
    setFormData({
      name: '',
      category: 'Electronics',
      location: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Lost',
      description: ''
    });
    setValidationError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report an Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Conditional Rendering: Validation Error */}
        {validationError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {validationError}
          </div>
        )}

        {/* Status Radio Buttons */}
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

        {/* Controlled Input: Item Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" placeholder="e.g. Blue Hydro Flask" />
        </div>

        {/* Controlled Inputs: Category & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition">
              <option>Electronics</option>
              <option>Accessories</option>
              <option>Documents</option>
              <option>Personal</option>
              <option>Stationery</option>
              <option>Other</option>
            </select>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
             <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" />
          </div>
        </div>

        {/* Controlled Input: Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" placeholder="e.g. Library 2nd Floor" />
        </div>

        {/* Controlled Input: Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" placeholder="Provide details (color, brand, identifying marks...)"></textarea>
        </div>

        <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors mt-2">
          Submit Report
        </button>

      </form>
    </Modal>
  );
};

export default ReportItemModal;
