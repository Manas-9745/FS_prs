import React, { useContext } from 'react';
import { LostFoundContext } from '../context/LostFoundContext';

const Navbar = ({ currentPage, setCurrentPage }) => {
  // useContext() - consuming user state from Context
  const { user, logout } = useContext(LostFoundContext);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
            <span className="text-2xl font-bold text-primary">FoundIt</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${currentPage === 'home' ? 'text-primary bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${currentPage === 'dashboard' ? 'text-primary bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              Dashboard
            </button>

            {/* Conditional Rendering: Show user name or Login button */}
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 font-medium">Welcome, {user.name}</span>
                <button 
                  onClick={() => { logout(); setCurrentPage('home'); }}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setCurrentPage('login')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${currentPage === 'login' ? 'bg-primary text-white shadow-md' : 'bg-primary text-white shadow hover:bg-primary-hover'}`}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
