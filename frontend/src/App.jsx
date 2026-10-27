import React, { useState, useEffect, useMemo, useContext } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ItemCard from './components/ItemCard';
import Footer from './components/Footer';
import ReportItemModal from './components/ReportItemModal';
import ItemDetailsModal from './components/ItemDetailsModal';
import AuthModal from './components/AuthModal';
import Exp6DemoSection from './components/Exp6DemoSection';
import ChatSection from './components/ChatSection';
import DockerInfoModal from './components/DockerInfoModal';
import { ItemContext, ItemProvider } from './context/ItemContext';
import { AuthContext, AuthProvider } from './context/AuthContext';

function MainApp() {
  // 1. USECONTEXT: Consuming shared items array, loading and error from ItemContext
  const { items, loading, error, removeItem } = useContext(ItemContext);
  // Auth state from AuthContext
  const { user, token } = useContext(AuthContext);

  // Active View & Modal state
  const [currentPage, setCurrentPage] = useState('home');
  const [activeChatItemId, setActiveChatItemId] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDockerModal, setShowDockerModal] = useState(false);
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Search Filtering logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, filterStatus]);

  // USEEFFECT: Updates browser title
  useEffect(() => {
    if (currentPage === 'chat') {
      document.title = "FoundIt | Live Item Messenger";
    } else if (currentPage === 'exp6') {
      document.title = "FoundIt | Access Control & Security";
    } else if (loading) {
      document.title = "FoundIt | Loading Campus Items...";
    } else {
      document.title = `FoundIt | ${filteredItems.length} Campus Items Listed`;
    }
  }, [filteredItems, loading, currentPage]);

  // --- HOME VIEW ---
  const renderHome = () => (
    <>
      <HeroSection setCurrentPage={setCurrentPage} setShowReportModal={setShowReportModal} />

      {/* Platform Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Feature 1: Real-Time Messenger */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-sm border border-slate-800 flex flex-col justify-between group hover:border-slate-700 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Live Messenger</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct messaging between finders and owners with real-time WebSocket delivery.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('chat')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Open Live Chat &rarr;
            </button>
          </div>

          {/* Feature 2: Role-Based Access */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between group hover:border-slate-300 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  JWT Guard
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Authentication &amp; Roles</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Role-based access differentiating verified users from campus administrators.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('exp6')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Access Console &rarr;
            </button>
          </div>

          {/* Feature 3: Verified Registry */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between group hover:border-slate-300 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                  Directory
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Item Directory</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Search, filter, and report lost or found items across campus departments.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Browse Items &rarr;
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recently Reported Items</h2>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="text-indigo-600 hover:underline text-sm font-semibold"
          >
            View All ({items.length}) &rarr;
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
            <p className="text-gray-600 font-medium">Loading items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.slice(0, 3).map(item => (
              <ItemCard key={item._id || item.id} item={item} onClick={setSelectedItem} />
            ))}
          </div>
        )}
      </div>
    </>
  );

  // --- DASHBOARD VIEW ---
  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Lost &amp; Found Dashboard</h1>
            {user && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                user.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
              }`}>
                {user.role} mode
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Campus Lost and Found Directory</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowReportModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow transition text-sm"
          >
            + Add Item
          </button>
        </div>
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
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none transition"
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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
          <p className="text-lg font-medium text-gray-700">Loading Lost &amp; Found items...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-20 bg-red-50 rounded-xl border border-red-200 p-8">
          <p className="text-lg font-medium text-red-700">Something went wrong while loading items.</p>
          <p className="text-sm text-red-500 mt-1">{error}</p>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && filteredItems.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 className="text-lg font-medium text-gray-900">No matching items found.</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search query or filter selection.</p>
        </div>
      )}

      {/* Items Cards Grid */}
      {!loading && !error && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item._id || item.id} item={item} onClick={setSelectedItem} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        onOpenAuthModal={() => setShowAuthModal(true)}
      />
      
      {currentPage === 'home' && renderHome()}
      {currentPage === 'dashboard' && renderDashboard()}
      {currentPage === 'exp6' && <Exp6DemoSection onOpenAuthModal={() => setShowAuthModal(true)} />}
      {currentPage === 'chat' && (
        <ChatSection 
          onOpenAuthModal={() => setShowAuthModal(true)} 
          initialItemId={activeChatItemId}
        />
      )}
      <DockerInfoModal isOpen={showDockerModal} onClose={() => setShowDockerModal(false)} />

      <Footer />

      <ReportItemModal 
        isOpen={showReportModal} 
        onClose={() => setShowReportModal(false)} 
      />
      
      <ItemDetailsModal 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        item={selectedItem} 
        onStartChat={(itemId) => {
          setActiveChatItemId(itemId);
          setCurrentPage('chat');
        }}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

// Wrap MainApp inside AuthProvider and ItemProvider
function App() {
  return (
    <AuthProvider>
      <ItemProvider>
        <MainApp />
      </ItemProvider>
    </AuthProvider>
  );
}

export default App;
