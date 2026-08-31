import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = ({ currentPage, setCurrentPage }) => {
  // useContext() - consumes global ThemeContext for Light/Dark theme switching
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className={`shadow-sm sticky top-0 z-40 transition-colors ${theme === 'dark' ? 'bg-gray-900 text-white border-b border-gray-800' : 'bg-white text-gray-900 border-b border-gray-100'}`}>
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

            {/* useContext Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow hover:bg-indigo-700 transition flex items-center space-x-1"
            >
              <span>{theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
