import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { login, register, loading, authError } = useContext(AuthContext);
  const [tab, setTab] = useState(defaultTab); // 'login' or 'register'
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('user');

  const [localMessage, setLocalMessage] = useState(null);

  if (!isOpen) return null;

  const handleQuickFill = (type) => {
    if (type === 'student1') {
      if (tab === 'login') {
        setLoginEmail('pooja@gmail.com');
        setLoginPassword('password123');
      } else {
        setRegName('Pooja Patel');
        setRegEmail('pooja@gmail.com');
        setRegPassword('password123');
        setRegRole('user');
      }
    } else if (type === 'student2') {
      if (tab === 'login') {
        setLoginEmail('aarav@college.edu');
        setLoginPassword('password123');
      } else {
        setRegName('Aarav Sharma');
        setRegEmail('aarav@college.edu');
        setRegPassword('password123');
        setRegRole('user');
      }
    } else if (type === 'admin') {
      if (tab === 'login') {
        setLoginEmail('admin@gmail.com');
        setLoginPassword('admin123');
      } else {
        setRegName('Campus Security Officer');
        setRegEmail('admin@gmail.com');
        setRegPassword('admin123');
        setRegRole('admin');
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalMessage(null);
    const result = await login(loginEmail, loginPassword);
    if (result.success) {
      setLocalMessage({ type: 'success', text: `Welcome back, ${result.data.user.name}!` });
      setTimeout(() => {
        onClose();
        setLocalMessage(null);
      }, 600);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLocalMessage(null);
    const result = await register(regName, regEmail, regPassword, regRole);
    if (result.success) {
      setLocalMessage({
        type: 'success',
        text: `Account created for ${regName} (${regRole})! Signing in...`,
      });
      await login(regEmail, regPassword);
      setTimeout(() => {
        onClose();
        setLocalMessage(null);
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-2 shadow-xs">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {tab === 'login' ? 'Sign In to FoundIt' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Secure JWT Authentication with MongoDB Atlas</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 mb-4">
          <button
            onClick={() => { setTab('login'); setLocalMessage(null); }}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition ${
              tab === 'login'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setLocalMessage(null); }}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition ${
              tab === 'register'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Register New Account
          </button>
        </div>

        {/* Quick Demo Pre-fill helpers */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-4 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Quick Demo Profiles:</span>
            <span className="text-[10px] text-slate-400">Click to autofill</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill('student1')}
              className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-indigo-400 hover:text-indigo-600 font-semibold text-[11px] transition shadow-xs text-center"
            >
              👤 Student 1
              <span className="block text-[9px] text-slate-400 font-normal">Pooja</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('student2')}
              className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-indigo-400 hover:text-indigo-600 font-semibold text-[11px] transition shadow-xs text-center"
            >
              👤 Student 2
              <span className="block text-[9px] text-slate-400 font-normal">Aarav</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-indigo-400 hover:text-indigo-600 font-semibold text-[11px] transition shadow-xs text-center"
            >
              🛡️ Officer
              <span className="block text-[9px] text-slate-400 font-normal">Security Desk</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {localMessage && (
          <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">
            {localMessage.text}
          </div>
        )}
        {authError && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            {authError}
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@college.edu"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-md shadow-indigo-200 transition flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Campus Email</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="aarav@college.edu"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition ${
                  regRole === 'user' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-200 text-slate-600'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={regRole === 'user'}
                    onChange={() => setRegRole('user')}
                    className="text-indigo-600"
                  />
                  <span>Campus Student</span>
                </label>
                <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition ${
                  regRole === 'admin' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-200 text-slate-600'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={regRole === 'admin'}
                    onChange={() => setRegRole('admin')}
                    className="text-indigo-600"
                  />
                  <span>Security Officer</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-md shadow-indigo-200 transition flex items-center justify-center mt-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
