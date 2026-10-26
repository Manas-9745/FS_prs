import React, { useContext } from 'react';
import { ItemContext } from '../context/ItemContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ currentPage, setCurrentPage, onOpenAuthModal }) => {
  const { items } = useContext(ItemContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            {/* Brand Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => setCurrentPage('home')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                F
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 bg-clip-text text-transparent tracking-tight">
                  FoundIt
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                  Campus Registry
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:flex items-center space-x-1">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                  currentPage === 'home' 
                    ? 'text-indigo-600 bg-indigo-50/80' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </button>

              <button 
                onClick={() => setCurrentPage('dashboard')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                  currentPage === 'dashboard' 
                    ? 'text-indigo-600 bg-indigo-50/80' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Browse Directory
              </button>

              <button 
                onClick={() => setCurrentPage('chat')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                  currentPage === 'chat' 
                    ? 'text-indigo-600 bg-indigo-50/80 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Chat
              </button>

              <button 
                onClick={() => setCurrentPage('exp6')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentPage === 'exp6' 
                    ? 'text-indigo-600 bg-indigo-50/80' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Access &amp; Roles
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Total Items Pill */}
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              {items.length} Active Items
            </span>

            {/* User Session Info or Sign In Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage('exp6')}
                  className="flex items-center gap-2.5 p-1.5 px-2.5 rounded-xl hover:bg-slate-50 border border-slate-200/80 transition"
                  title="View Account Details & Roles"
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-xs ${
                    user.role === 'admin' 
                      ? 'bg-gradient-to-tr from-purple-600 to-indigo-600' 
                      : 'bg-gradient-to-tr from-indigo-600 to-blue-500'
                  }`}>
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="text-left hidden lg:block pr-1">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'admin' ? 'text-purple-600' : 'text-emerald-600'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </button>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Sign Out"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm shadow-indigo-200 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In / Demo
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
