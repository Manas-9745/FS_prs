import React, { useState, useMemo, useContext } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import ItemCard from './components/ItemCard';
import ItemDetailsModal from './components/ItemDetailsModal';
import ReportItemModal from './components/ReportItemModal';
import { LostFoundProvider, LostFoundContext } from './context/LostFoundContext';
import useLostItems from './hooks/useLostItems';

function MainApp() {
  // 1. useState() for navigation & modal states
  const [currentPage, setCurrentPage] = useState('home');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // 2. Custom Hook: useLostItems() - encapsulates data fetching, loading & error states
  const { items, loading, error, addItem } = useLostItems();

  // 3. useContext() - consuming user authentication state and login function
  const { user, login } = useContext(LostFoundContext);

  // 4. useState() for search and status filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // All, Lost, Found

  // 5. useState() for Controlled Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Handle adding new items (updates custom hook state & switches to dashboard)
  const handleAddItem = (newItem) => {
    addItem(newItem);
    if (currentPage !== 'dashboard') {
      setCurrentPage('dashboard');
    }
  };

  // Filter items based on live search & status
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, filterStatus]);

  // Handle Login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const studentName = loginEmail.split('@')[0] || "Student";
    login(studentName, loginEmail); // Save user in Context
    setCurrentPage('dashboard');
  };

  // --- 1. HOME VIEW ---
  const renderHome = () => (
    <>
      <HeroSection setCurrentPage={setCurrentPage} setShowReportModal={setShowReportModal} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Reported</h2>
        
        {/* Conditional Rendering on Home: Loading / Data */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading recently reported items...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.slice(0, 3).map(item => (
              <ItemCard key={item.id} item={item} onClick={setSelectedItem} />
            ))}
          </div>
        )}
      </div>
    </>
  );

  // --- 2. DASHBOARD VIEW ---
  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {user && <p className="text-sm text-gray-500 mt-1">Logged in as: <span className="font-semibold text-primary">{user.email}</span></p>}
        </div>
        <button 
          onClick={() => setShowReportModal(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium shadow transition"
        >
          + Report Item
        </button>
      </div>

      {/* Item Stat Counters */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{loading ? '...' : items.length}</p>
          <p className="text-sm text-gray-500">Total Items</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-rose-600">{loading ? '...' : items.filter(i => i.status === 'Lost').length}</p>
          <p className="text-sm text-gray-500">Lost</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{loading ? '...' : items.filter(i => i.status === 'Found').length}</p>
          <p className="text-sm text-gray-500">Found</p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            placeholder="Search items, descriptions, or locations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-primary outline-none transition"
          />
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
          {['All', 'Lost', 'Found'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition ${filterStatus === status ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional Rendering: Loading State */}
      {loading && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-3"></div>
          <p className="text-lg font-medium text-gray-700">Loading Lost & Found items...</p>
          <p className="text-sm text-gray-400">Simulating asynchronous data fetching</p>
        </div>
      )}

      {/* Conditional Rendering: Error State */}
      {error && !loading && (
        <div className="text-center py-20 bg-red-50 rounded-xl border border-red-200 p-8">
          <p className="text-lg font-medium text-red-700">Something went wrong while loading items.</p>
          <p className="text-sm text-red-500 mt-1">{error}</p>
        </div>
      )}

      {/* Conditional Rendering: No Data State */}
      {!loading && !error && filteredItems.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 className="text-lg font-medium text-gray-900">No Lost & Found items available.</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search query or filter selection.</p>
        </div>
      )}

      {/* Conditional Rendering: Data Available (Cards Grid) */}
      {!loading && !error && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} onClick={setSelectedItem} />
          ))}
        </div>
      )}
    </div>
  );

  // --- 3. LOGIN VIEW (Controlled Form) ---
  const renderLogin = () => (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Student Login</h2>
          <p className="text-gray-500 mt-2">Sign in to manage your items</p>
        </div>
        <form className="space-y-6" onSubmit={handleLoginSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              required 
              type="email" 
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-indigo-200 outline-none transition" 
              placeholder="student@university.edu" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              required 
              type="password" 
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-indigo-200 outline-none transition" 
              placeholder="••••••••" 
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm font-medium text-primary hover:text-primary-hover">Forgot password?</a>
          </div>
          <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover transition">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {currentPage === 'home' && renderHome()}
      {currentPage === 'dashboard' && renderDashboard()}
      {currentPage === 'login' && renderLogin()}

      <Footer />

      <ReportItemModal 
        isOpen={showReportModal} 
        onClose={() => setShowReportModal(false)} 
        onAddItem={handleAddItem} 
      />
      
      <ItemDetailsModal 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        item={selectedItem} 
      />
    </div>
  );
}

// Wrap MainApp inside LostFoundProvider for application-wide Context
function App() {
  return (
    <LostFoundProvider>
      <MainApp />
    </LostFoundProvider>
  );
}

export default App;
