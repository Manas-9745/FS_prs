import React, { useState, useMemo, useContext, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import ItemCard from './components/ItemCard';
import ItemDetailsModal from './components/ItemDetailsModal';
import ReportItemModal from './components/ReportItemModal';
import Modal from './components/Modal';
import { LostFoundProvider, LostFoundContext } from './context/LostFoundContext';
import useLostItems from './hooks/useLostItems';

function MainApp() {
  // 1. useState() for navigation & modal states
  const [currentPage, setCurrentPage] = useState('home');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showVivaModal, setShowVivaModal] = useState(false);

  // 2. Custom Hook: useLostItems() - encapsulates data fetching, loading, error, refetch & addItem
  const { items, loading, error, addItem, refetch, triggerError } = useLostItems();

  // Toast notification state for UI popups
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (title, hookName, desc) => {
    setToastMessage({ title, hookName, desc });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Show toast when custom hook finishes data fetching
  useEffect(() => {
    if (!loading && !error && items.length > 0) {
      showToast(`Loaded ${items.length} items from mock data source`, 'useEffect() + useLostItems()', 'Asynchronous data fetching completed successfully.');
    }
  }, [loading, error, items.length]);

  // 3. useContext() - consuming user authentication state and login function
  const { user, login, logout } = useContext(LostFoundContext);

  // 4. useState() for search and status filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // All, Lost, Found

  // 5. useState() for Controlled Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Handle adding new items (updates custom hook state & switches to dashboard)
  const handleAddItem = (newItem) => {
    addItem(newItem);
    showToast(`Added: "${newItem.name}"`, 'useState() + addItem() in Custom Hook', 'New item prepended to state and rendered immediately.');
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
    showToast(`Logged in as "${studentName}"`, 'useContext(LostFoundContext)', 'Global Context user state updated across all components.');
    setCurrentPage('dashboard');
  };

  // Quick Switch User (Demonstrates Context API live)
  const handleQuickContextSwitch = (role) => {
    if (role === 'guest') {
      logout();
      showToast('Switched to Guest', 'useContext() logout()', 'Global user context reset to null.');
    } else if (role === 'student') {
      login('Manas (Student)', 'manas@college.edu');
      showToast('Switched to Student', 'useContext() login()', 'Context updated: Welcome, Manas in Navbar.');
    } else if (role === 'admin') {
      login('Campus Admin', 'admin@campus.edu');
      showToast('Switched to Admin', 'useContext() login()', 'Context updated: Welcome, Campus Admin.');
    }
  };

  // Add a sample random item (Demonstrates Custom Hook instant state change)
  const handleQuickAddSample = () => {
    const categories = ['Electronics', 'Accessories', 'Documents', 'Personal'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const sampleItem = {
      id: Date.now(),
      name: `Sample Demo Item #${Math.floor(Math.random() * 1000)}`,
      category: randomCategory,
      location: 'Main Auditorium',
      date: new Date().toISOString().split('T')[0],
      status: Math.random() > 0.5 ? 'Lost' : 'Found',
      description: 'Quick sample item generated via useLostItems() addItem() hook test button.'
    };
    handleAddItem(sampleItem);
  };

  // --- 1. HOME VIEW ---
  const renderHome = () => (
    <>
      <HeroSection setCurrentPage={setCurrentPage} setShowReportModal={setShowReportModal} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recently Reported</h2>
          <span className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-mono border border-indigo-200">
            Hook: useLostItems()
          </span>
        </div>
        
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
      
      {/* 🌟 EXPERIMENT 2 INTERACTIVE HOOKS CONTROL PANEL */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 mb-8 text-white shadow-xl border border-indigo-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-indigo-800/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500 text-white font-bold text-xs px-2.5 py-1 rounded-md tracking-wide">
                EXPERIMENT 2 VIVA DEMO PANEL
              </span>
              <span className="text-emerald-400 text-xs font-mono font-semibold animate-pulse">● Live Hooks Active</span>
            </div>
            <h2 className="text-lg font-bold text-gray-100 mt-1">Interactive React Hooks Tester</h2>
            <p className="text-xs text-indigo-200">Click any button below to trigger and test the required Experiment 2 concepts in real time!</p>
          </div>
          <button 
            onClick={() => setShowVivaModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-lg font-semibold shadow transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>📖 Open Viva Questions & Code Guide</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {/* Test Button 1: useEffect & Refetch */}
          <div className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition">
            <p className="text-xs font-mono text-indigo-300 font-bold mb-1">1. useEffect() Data Fetch</p>
            <button
              onClick={() => {
                refetch();
                showToast('Re-triggering useEffect()', 'Custom Hook: useLostItems.refetch()', 'Simulating asynchronous 1.5s API call with Loading Spinner.');
              }}
              disabled={loading}
              className="w-full bg-indigo-500/80 hover:bg-indigo-500 text-white text-xs py-2 px-3 rounded-lg font-medium transition flex items-center justify-center gap-1.5"
            >
              <span>🔄 Refetch Data (1.5s delay)</span>
            </button>
          </div>

          {/* Test Button 2: Error State */}
          <div className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition">
            <p className="text-xs font-mono text-rose-300 font-bold mb-1">2. Error Conditional Render</p>
            <button
              onClick={() => {
                triggerError();
                showToast('Triggered Simulated Error', 'Conditional Rendering: error state', 'Displaying red error fallback UI with Retry action.');
              }}
              disabled={loading}
              className="w-full bg-rose-600/80 hover:bg-rose-600 text-white text-xs py-2 px-3 rounded-lg font-medium transition flex items-center justify-center gap-1.5"
            >
              <span>⚠️ Simulate Network Error</span>
            </button>
          </div>

          {/* Test Button 3: Custom Hook Add Item */}
          <div className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition">
            <p className="text-xs font-mono text-emerald-300 font-bold mb-1">3. Custom Hook addItem()</p>
            <button
              onClick={handleQuickAddSample}
              className="w-full bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs py-2 px-3 rounded-lg font-medium transition flex items-center justify-center gap-1.5"
            >
              <span>➕ Add Random Item (Hook)</span>
            </button>
          </div>

          {/* Test Button 4: Context API Quick Switch */}
          <div className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition">
            <p className="text-xs font-mono text-amber-300 font-bold mb-1">4. useContext() User Switch</p>
            <div className="flex gap-1.5">
              <button
                onClick={() => handleQuickContextSwitch('student')}
                className="flex-1 bg-amber-600/80 hover:bg-amber-600 text-white text-[11px] py-1.5 rounded font-medium transition"
              >
                Student
              </button>
              <button
                onClick={() => handleQuickContextSwitch('admin')}
                className="flex-1 bg-purple-600/80 hover:bg-purple-600 text-white text-[11px] py-1.5 rounded font-medium transition"
              >
                Admin
              </button>
              <button
                onClick={() => handleQuickContextSwitch('guest')}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-[11px] py-1.5 rounded font-medium transition"
              >
                Guest
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header with Report button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-1 rounded-md font-mono font-semibold border border-purple-200">
              ⚡ Hook: useLostItems()
            </span>
          </div>
          {user ? (
            <p className="text-sm text-gray-600 mt-1">
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded font-mono mr-1">useContext</span>
              Logged in as: <span className="font-semibold text-primary">{user.name} ({user.email})</span>
            </p>
          ) : (
            <p className="text-sm text-gray-500 mt-1">Guest Mode • Use the Demo Panel above to test Context API</p>
          )}
        </div>
        <button 
          onClick={() => setShowReportModal(true)}
          className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition flex items-center gap-2"
        >
          <span>+ Report Item</span>
          <span className="text-xs bg-indigo-700/60 px-2 py-0.5 rounded font-mono">Controlled Form</span>
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

      {/* Search & Filter Controls with Hook Indicators */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            placeholder="Search items, descriptions, or locations... (useState live search)" 
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
        <div className="text-center py-20 bg-white rounded-xl border border-indigo-100 p-8 shadow-sm">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-xl font-bold text-gray-800">Loading Lost & Found items...</p>
          <p className="text-sm text-indigo-600 font-mono mt-1">Simulating asynchronous data fetching via useEffect() + useLostItems()</p>
        </div>
      )}

      {/* Conditional Rendering: Error State */}
      {error && !loading && (
        <div className="text-center py-16 bg-red-50 rounded-xl border border-red-200 p-8">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-xl font-bold text-red-800">Something went wrong while loading items.</p>
          <p className="text-sm text-red-600 font-mono mt-1 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition"
          >
            🔄 Retry Data Fetching
          </button>
        </div>
      )}

      {/* Conditional Rendering: No Data State */}
      {!loading && !error && filteredItems.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 className="text-lg font-medium text-gray-900">No Lost & Found items available.</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search query or filter selection.</p>
          <span className="inline-block mt-3 text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded font-mono border border-amber-200">
            Conditional Rendering: filteredItems.length === 0
          </span>
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
        <div className="text-center mb-6">
          <span className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-mono font-semibold">
            Context API + Controlled Form
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">Student Login</h2>
          <p className="text-gray-500 mt-1">Demonstrates useContext() for authentication</p>
        </div>
        <form className="space-y-6" onSubmit={handleLoginSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Controlled Input)</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Password (Controlled Input)</label>
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
            Sign In & Update Context
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Top Banner indicating Experiment 2 active */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 text-white text-xs py-2 px-4 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-400 text-gray-900 font-bold px-2 py-0.5 rounded text-[11px]">EXP 2 ACTIVE</span>
          <span className="font-semibold">React Hooks, Data Fetching & Context API</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-indigo-200">
          <span>useState ✓</span>
          <span>useEffect ✓</span>
          <span>useContext ✓</span>
          <span>useLostItems() ✓</span>
        </div>
      </div>

      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {currentPage === 'home' && renderHome()}
      {currentPage === 'dashboard' && renderDashboard()}
      {currentPage === 'login' && renderLogin()}

      <Footer />

      {/* Floating Hook Toast Notification with detailed description */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-gray-900 text-white px-5 py-4 rounded-xl shadow-2xl border border-indigo-500 flex items-start gap-3 max-w-md">
          <span className="text-2xl mt-0.5">⚡</span>
          <div>
            <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">{toastMessage.hookName}</div>
            <div className="text-sm font-bold text-gray-100 mt-0.5">{toastMessage.title}</div>
            {toastMessage.desc && <div className="text-xs text-gray-400 mt-1">{toastMessage.desc}</div>}
          </div>
        </div>
      )}

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

      {/* Viva Concept Inspector Modal */}
      <Modal isOpen={showVivaModal} onClose={() => setShowVivaModal(false)} title="🎓 Experiment 2 Viva Guide & Concepts">
        <div className="space-y-4 text-sm text-gray-700 max-h-[70vh] overflow-y-auto pr-1">
          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
            <h4 className="font-bold text-indigo-900">1. useState()</h4>
            <p className="text-xs text-gray-600 mt-1">Used in <code className="font-mono text-indigo-600">App.jsx</code> and <code className="font-mono text-indigo-600">useLostItems.js</code> for search text, category filter, modal state, items array, and controlled forms.</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
            <h4 className="font-bold text-purple-900">2. useEffect() & Data Fetching</h4>
            <p className="text-xs text-gray-600 mt-1">Runs on mount inside <code className="font-mono text-purple-600">useLostItems()</code> with dependency array <code className="font-mono text-purple-600">[]</code> to fetch data with 1.5s simulated network delay.</p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
            <h4 className="font-bold text-emerald-900">3. useContext() & Context API</h4>
            <p className="text-xs text-gray-600 mt-1">Global state in <code className="font-mono text-emerald-600">LostFoundContext.jsx</code> to share user authentication (`user`, `login`, `logout`) with Navbar and Dashboard without prop drilling.</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
            <h4 className="font-bold text-amber-900">4. Reusable Custom Hook `useLostItems()`</h4>
            <p className="text-xs text-gray-600 mt-1">Encapsulates all fetching, loading, error, and item state management in <code className="font-mono text-amber-600">src/hooks/useLostItems.js</code>.</p>
          </div>
          <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
            <h4 className="font-bold text-rose-900">5. Controlled Forms & Validation</h4>
            <p className="text-xs text-gray-600 mt-1">Report form fields are controlled with <code className="font-mono text-rose-600">value</code> and <code className="font-mono text-rose-600">onChange</code>. Validates required fields before submitting.</p>
          </div>
        </div>
      </Modal>
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
