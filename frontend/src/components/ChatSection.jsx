// Real-Time Campus Lost & Found Messenger (WebSockets on Port 5000)
// Bidirectional chat powered by Socket.IO with MongoDB Atlas persistence.

import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ItemContext } from '../context/ItemContext';
import { createSocket } from '../socket/socketClient';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today';
  const yest = new Date(today);
  yest.setDate(today.getDate() - 1);
  if (d.toDateString() === yest.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
function groupByDate(messages) {
  const groups = [];
  let lastDate = null;
  messages.forEach((msg) => {
    const date = formatDate(msg.createdAt);
    if (date !== lastDate) {
      groups.push({ type: 'date', label: date, key: `d-${msg._id}` });
      lastDate = date;
    }
    groups.push({ type: 'message', ...msg });
  });
  return groups;
}

// ─── ConnectionBadge ─────────────────────────────────────────────────────────
function ConnectionBadge({ status, onTestClick }) {
  const ok = status === 'connected';
  return (
    <div className="flex items-center gap-2">
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition ${
        ok ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : status === 'connecting' ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-rose-50 text-rose-700 border-rose-200'
      }`}>
        <span className="relative flex h-2 w-2">
          {ok && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${ok ? 'bg-emerald-500' : status === 'connecting' ? 'bg-amber-500' : 'bg-rose-500'}`} />
        </span>
        <span>{ok ? 'WebSocket: Port 5000 Live' : status === 'connecting' ? 'Connecting to :5000...' : 'Disconnected'}</span>
      </div>
      {ok && (
        <button onClick={onTestClick}
          className="px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Test Server (5000)
        </button>
      )}
    </div>
  );
}

// ─── MessageBubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[82%] sm:max-w-[70%] flex gap-2.5 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-black text-white ${
          isOwn ? 'bg-gradient-to-tr from-indigo-600 to-violet-600' : 'bg-gradient-to-tr from-slate-700 to-slate-900'
        }`}>
          {(msg.senderName || 'U').charAt(0).toUpperCase()}
        </div>
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="text-[11px] font-bold text-slate-700">{isOwn ? 'You' : msg.senderName}</span>
            <span className="text-[10px] text-slate-400">{formatTime(msg.createdAt)}</span>
          </div>
          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-sm'
              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm'
          }`}>
            {msg.text}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ChatSection ─────────────────────────────────────────────────────────────
const ChatSection = ({ onOpenAuthModal, initialItemId = null }) => {
  const { user, token, login } = useContext(AuthContext);
  const { items } = useContext(ItemContext);

  const [selectedItemId, setSelectedItemId] = useState(initialItemId);
  const [messages, setMessages]             = useState([]);
  const [inputText, setInputText]           = useState('');
  const [connStatus, setConnStatus]         = useState('disconnected');
  const [socketError, setSocketError]       = useState(null);
  const [sending, setSending]               = useState(false);
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  const socketRef        = useRef(null);
  const bottomRef        = useRef(null);
  const inputRef         = useRef(null);
  // ← KEY FIX: always-fresh ref so callbacks never see stale selectedItemId
  const selectedItemRef  = useRef(selectedItemId);

  // Keep the ref in sync with state
  useEffect(() => {
    selectedItemRef.current = selectedItemId;
  }, [selectedItemId]);

  // Auto-select first item when items load
  useEffect(() => {
    if (!selectedItemId && items.length > 0) {
      setSelectedItemId(items[0]._id || items[0].id);
    }
  }, [items, selectedItemId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Socket lifecycle (re-runs only when token changes) ────────────────────
  useEffect(() => {
    if (!token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnStatus('disconnected');
      setMessages([]);
      return;
    }

    setConnStatus('connecting');
    setSocketError(null);

    const socket = createSocket(token);
    socketRef.current = socket;

    // ── on connect: IMMEDIATELY join the currently selected room ─────────
    socket.on('connect', () => {
      setConnStatus('connected');
      setSocketError(null);
      const itemId = selectedItemRef.current;
      if (itemId) {
        console.log(`[Socket] Connected → joining room item:${itemId}`);
        socket.emit('joinRoom', { itemId });
      }
    });

    socket.on('disconnect', () => setConnStatus('disconnected'));

    socket.on('connect_error', (err) => {
      setConnStatus('error');
      setSocketError(err.message || 'Connection failed to ws://localhost:5000');
    });

    // Server sends persisted history after joinRoom
    socket.on('messageHistory', (history) => {
      setMessages(history || []);
    });

    // ── KEY: incoming broadcast from any user in the same room ────────────
    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => {
        // deduplicate by _id
        if (prev.some((m) => String(m._id) === String(msg._id))) return prev;
        return [...prev, msg];
      });
      setSending(false);
    });

    socket.on('error', ({ message }) => {
      setSocketError(message);
      setSending(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('messageHistory');
      socket.off('receiveMessage');
      socket.off('error');
      socket.disconnect();
      socketRef.current = null;
      setConnStatus('disconnected');
    };
  }, [token]); // intentionally depends ONLY on token

  // ── Room switching: leave old room, join new room ─────────────────────────
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !selectedItemId || connStatus !== 'connected') return;

    console.log(`[Socket] Room switch → joining item:${selectedItemId}`);
    setMessages([]);
    setSocketError(null);
    socket.emit('joinRoom', { itemId: selectedItemId });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leaveRoom', { itemId: selectedItemId });
      }
    };
  }, [selectedItemId, connStatus]);

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSend = useCallback((textOverride = null) => {
    const text = (typeof textOverride === 'string' ? textOverride : inputText).trim();
    if (!text || !socketRef.current || connStatus !== 'connected' || !selectedItemId) return;
    if (text.length > 1000) { setSocketError('Message too long (max 1000 chars)'); return; }

    setSending(true);
    setSocketError(null);
    setInputText('');

    socketRef.current.emit('sendMessage', {
      itemId: selectedItemId,
      text,
      senderName: user?.name || 'User',
    });
    inputRef.current?.focus();
  }, [inputText, connStatus, selectedItemId, user]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── Diagnostic ping ───────────────────────────────────────────────────────
  const handleTestServer = () => {
    if (!socketRef.current || connStatus !== 'connected') { alert('Not connected to Port 5000'); return; }
    const t0 = Date.now();
    socketRef.current.emit('pingServer', (res) => {
      setDiagnosticData({ ...res, latency: Date.now() - t0 });
      setShowDiagnostic(true);
    });
  };

  // ── Quick demo login ──────────────────────────────────────────────────────
  const quickLogin = async (profile) => {
    if (profile === 'student1') await login('pooja@gmail.com',    'password123');
    if (profile === 'student2') await login('aarav@college.edu',  'password123');
    if (profile === 'admin')    await login('admin@gmail.com',    'admin123');
  };

  const selectedItem = items.find((i) => (i._id || i.id) === selectedItemId);
  const grouped      = groupByDate(messages);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-grow flex flex-col">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Campus Live Messenger</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">WebSockets</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Real-time bidirectional messaging — messages appear instantly in every open tab</p>
        </div>
        <ConnectionBadge status={connStatus} onTestClick={handleTestServer} />
      </div>

      {/* Dual-tab guide banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 mb-6 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-sm">🧪</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Real-Time Dual-Tab Test</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                  Instant Sync
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Open this page in <strong>two browser tabs</strong>. Log in as <strong>Student 1</strong> in Tab 1 and <strong>Student 2</strong> in Tab 2. Select the same item room in both tabs. Send a message — it appears in the other tab <strong>instantly, no refresh needed</strong>.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">Quick Login:</span>
            {[
              { key: 'student1', label: '👤 Student 1 (Pooja)', email: 'pooja@gmail.com', color: 'indigo' },
              { key: 'student2', label: '👤 Student 2 (Aarav)', email: 'aarav@college.edu', color: 'indigo' },
              { key: 'admin',    label: '🛡️ Officer (Admin)',  email: 'admin@gmail.com',   color: 'purple' },
            ].map(({ key, label, email, color }) => (
              <button key={key} onClick={() => quickLogin(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  user?.email === email
                    ? `bg-${color}-600 text-white`
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Not signed in */}
      {!user && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto my-8">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">Sign In to Enter Live Messenger</h3>
          <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
            Pick a demo account to test real-time chat instantly.
          </p>
          <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
            <button onClick={() => quickLogin('student1')}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer">
              👤 Continue as Student 1 (Pooja)
            </button>
            <button onClick={() => quickLogin('student2')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer">
              👤 Continue as Student 2 (Aarav)
            </button>
            <button onClick={onOpenAuthModal}
              className="text-xs text-slate-500 hover:text-indigo-600 font-semibold mt-2">
              Open custom login &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Chat UI (logged in) */}
      {user && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 flex-grow">

          {/* Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* User card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white ${
                  user.role === 'admin' ? 'bg-gradient-to-tr from-purple-600 to-indigo-600' : 'bg-gradient-to-tr from-indigo-600 to-blue-500'
                }`}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'text-purple-600' : 'text-emerald-600'}`}>
                    {user.role === 'admin' ? 'Campus Officer' : 'Student'}
                  </span>
                </div>
              </div>
              <button onClick={onOpenAuthModal}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                Switch
              </button>
            </div>

            {/* Room list */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden flex-grow">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Item Chat Rooms</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Select same room in both tabs</p>
                </div>
                <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <div className="p-2.5 flex flex-col gap-1.5 overflow-y-auto" style={{ maxHeight: '380px' }}>
                {items.length === 0
                  ? <p className="text-xs text-slate-400 italic p-3 text-center">No items yet.</p>
                  : items.map((item) => {
                      const id     = item._id || item.id;
                      const active = selectedItemId === id;
                      return (
                        <button key={id} onClick={() => setSelectedItemId(id)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition flex flex-col gap-1 cursor-pointer ${
                            active
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                              : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                          }`}>
                          <div className="flex items-center justify-between w-full">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              active ? 'bg-white/20 text-white'
                                : item.status === 'Lost' ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>{item.status}</span>
                            <span className={`text-[10px] ${active ? 'text-indigo-200' : 'text-slate-400'}`}>{item.location || 'Campus'}</span>
                          </div>
                          <p className={`font-bold truncate mt-0.5 ${active ? 'text-white' : 'text-slate-900'}`}>{item.name}</p>
                        </button>
                      );
                    })
                }
              </div>
            </div>
          </div>

          {/* Chat panel */}
          <div className="lg:col-span-3 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ minHeight: '520px', maxHeight: '660px' }}>

            {/* Chat header */}
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between flex-shrink-0">
              {selectedItem ? (
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black ${
                    selectedItem.status === 'Lost' ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}>
                    {selectedItem.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">{selectedItem.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedItem.status === 'Lost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>{selectedItem.status}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {selectedItem.location} &bull; {selectedItem.category}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Select an item room from the left</p>
              )}
              <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                {messages.length} msg{messages.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto px-5 py-4 bg-slate-50/40 flex flex-col">

              {connStatus === 'connecting' && (
                <div className="flex-grow flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-slate-500 font-medium">Connecting to Port 5000...</p>
                  </div>
                </div>
              )}

              {connStatus !== 'connecting' && messages.length === 0 && (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">No messages yet</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">Be the first to start the conversation about this item.</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <button onClick={() => handleSend('Hello! Is this item still available?')}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer">
                      💬 "Is this item still available?"
                    </button>
                    <button onClick={() => handleSend('I found this item! How can I return it?')}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer">
                      📍 "I found this! How to return it?"
                    </button>
                  </div>
                </div>
              )}

              {messages.length > 0 && (
                <div className="flex flex-col justify-end flex-grow">
                  {grouped.map((entry) =>
                    entry.type === 'date' ? (
                      <div key={entry.key} className="flex items-center gap-3 my-3">
                        <div className="flex-grow h-px bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">{entry.label}</span>
                        <div className="flex-grow h-px bg-slate-200" />
                      </div>
                    ) : (
                      <MessageBubble
                        key={entry._id}
                        msg={entry}
                        isOwn={String(entry.senderId) === String(user?.id)}
                      />
                    )
                  )}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            {/* Error bar */}
            {socketError && (
              <div className="px-4 py-2 bg-rose-50 border-t border-rose-100 text-xs text-rose-700 font-semibold flex items-center justify-between">
                <span>⚠ {socketError}</span>
                <button onClick={() => setSocketError(null)} className="text-rose-400 hover:text-rose-600">✕</button>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-slate-100 bg-white p-3.5 flex-shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={selectedItem ? `Message about "${selectedItem.name}"... (Enter to send)` : 'Select an item room first...'}
                  disabled={connStatus !== 'connected' || !selectedItemId}
                  maxLength={1000}
                  className="flex-grow resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 transition leading-relaxed disabled:bg-slate-50 disabled:text-slate-400"
                  style={{ minHeight: '42px', maxHeight: '96px' }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputText.trim() || sending || connStatus !== 'connected'}
                  className="flex-shrink-0 w-11 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center shadow-md transition cursor-pointer">
                  {sending
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                  }
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 px-1">
                <span>
                  {connStatus === 'connected'
                    ? <>Press <strong>Enter</strong> to send &bull; <strong>Shift+Enter</strong> for newline</>
                    : <span className="text-amber-600 font-semibold">⚡ Waiting for WebSocket connection...</span>}
                </span>
                <span>{inputText.length}/1000</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diagnostic modal */}
      {showDiagnostic && diagnosticData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold text-lg">✓</div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">WebSocket Live on Port 5000</h3>
                  <p className="text-[11px] text-emerald-600 font-semibold">Real-Time Server Operational</p>
                </div>
              </div>
              <button onClick={() => setShowDiagnostic(false)} className="text-slate-400 hover:text-slate-600 p-1 text-xl leading-none">✕</button>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
              {[
                ['Server Port',       '5000 (ws://localhost:5000)', 'text-indigo-600 font-mono font-bold'],
                ['Socket ID',         diagnosticData.socketId,      'font-mono text-slate-800'],
                ['Transport',         diagnosticData.transport?.toUpperCase(), 'text-emerald-600 font-bold font-mono'],
                ['Ping Round-Trip',   `${diagnosticData.latency} ms`, 'font-bold font-mono'],
                ['Authenticated User',`${diagnosticData.userName} (${diagnosticData.userRole})`, 'font-bold'],
                ['Active Channel',    `item:${selectedItemId}`,     'font-mono text-slate-600'],
              ].map(([label, val, cls]) => (
                <div key={label} className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                  <span className="text-slate-500">{label}:</span>
                  <span className={cls}>{val}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">{diagnosticData.message}</div>
            <button onClick={() => setShowDiagnostic(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition">
              Close Diagnostic
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSection;
