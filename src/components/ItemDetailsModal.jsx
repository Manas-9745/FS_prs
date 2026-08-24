import React from 'react';
import Modal from './Modal';

const ItemDetailsModal = ({ isOpen, onClose, item }) => {
  if (!item) return null;
  const isFound = item.status === 'Found';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Item Details">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
           <span className={`px-3 py-1 text-sm font-semibold rounded-full ${isFound ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            {item.status}
          </span>
          <span className="text-gray-500 text-sm">{item.category}</span>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{item.name}</h3>
          <p className="text-gray-500 mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Reported on: {item.date}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Description</h4>
          <p className="text-gray-700">{item.description}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Location</h4>
          <p className="text-gray-700 flex items-center">
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {item.location}
          </p>
        </div>

        <div className="pt-4 mt-2 border-t border-gray-100">
          <button className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors">
            Contact Regarding Item
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ItemDetailsModal;
