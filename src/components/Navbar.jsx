import React, { useContext } from 'react';
import { ItemContext } from '../context/ItemContext';

const Navbar = ({ currentPage, setCurrentPage }) => {
  // useContext() - consumes shared items array from ItemContext
  const { items } = useContext(ItemContext);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
            <span className="text-2xl font-bold text-indigo-600">FoundIt</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${currentPage === 'home' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${currentPage === 'dashboard' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Dashboard
            </button>

            {/* useContext Badge: displays shared item count from ItemContext */}
            <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Total Items: {items.length}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
