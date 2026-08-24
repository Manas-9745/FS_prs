import React from 'react';

const ItemCard = ({ item, onClick }) => {
  const isFound = item.status === 'Found';
  
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
      onClick={() => onClick(item)}
    >
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${isFound ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            {item.status}
          </span>
          <span className="text-xs text-gray-500">{item.date}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mt-auto">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {item.location}
        </div>
      </div>
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-primary text-sm font-medium hover:text-primary-hover transition-colors text-center">
        View Details
      </div>
    </div>
  );
};

export default ItemCard;
