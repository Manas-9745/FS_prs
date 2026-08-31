import React, { useState, useContext } from 'react';
import Modal from './Modal';
import { ItemContext } from '../context/ItemContext';

const ReportItemModal = ({ isOpen, onClose }) => {
  // useContext() - consumes addItem function from ItemContext when submitting form!
  const { addItem } = useContext(ItemContext);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    location: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Lost',
    description: ''
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.location.trim() || !formData.description.trim()) {
      setValidationError('Please fill in all required fields.');
      return;
    }

    const newItem = {
      id: Date.now(),
      ...formData
    };

    // useContext addItem execution!
    addItem(newItem);
    
    setFormData({
      name: '',
      category: 'Electronics',
      location: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Lost',
      description: ''
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report a Lost or Found Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Black Leather Wallet"
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none transition text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none transition text-sm"
            >
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none transition text-sm"
            >
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Documents">Documents</option>
              <option value="Personal">Personal</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Library 2nd Floor, Room 301"
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none transition text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide key details, distinct marks, color, brand..."
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none transition text-sm"
          ></textarea>
        </div>

        {validationError && (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-200">
            {validationError}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow transition"
          >
            Submit Report
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReportItemModal;
