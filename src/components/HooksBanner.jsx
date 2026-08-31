import React, { useContext } from 'react';
import { LostFoundContext } from '../context/LostFoundContext';

const HooksBanner = ({ itemCount, loading }) => {
  const { user } = useContext(LostFoundContext);

  return (
    <div className="bg-indigo-900 text-white rounded-2xl p-6 mb-8 shadow-lg border border-indigo-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-indigo-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500 text-white uppercase tracking-wide">
              Experiment 2
            </span>
            <h2 className="text-xl font-bold text-white">React Hooks Architecture</h2>
          </div>
          <p className="text-indigo-200 text-sm mt-1">
            Demonstrating <code className="text-yellow-300 font-mono">useEffect()</code>, <code className="text-yellow-300 font-mono">useContext()</code>, and <code className="text-yellow-300 font-mono">useLostItems()</code> Custom Hook
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-950/60 px-4 py-2 rounded-xl border border-indigo-800 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Status: Logged in as <strong className="text-emerald-300">{user ? user.name : 'Guest User'}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. useEffect Card */}
        <div className="bg-indigo-950/70 p-4 rounded-xl border border-indigo-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono font-bold text-yellow-300 text-sm">1. useEffect()</span>
            <span className="text-[11px] px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded font-mono">Side Effects</span>
          </div>
          <p className="text-xs text-indigo-200 mb-2">
            Performs action on mount/updates: Async API loading simulation & document title updates.
          </p>
          <div className="text-[11px] font-mono text-indigo-300 bg-indigo-900/60 p-2 rounded">
            Title: "FoundIt | {loading ? 'Loading...' : `${itemCount} Items`}"
          </div>
        </div>

        {/* 2. useContext Card */}
        <div className="bg-indigo-950/70 p-4 rounded-xl border border-indigo-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono font-bold text-cyan-300 text-sm">2. useContext()</span>
            <span className="text-[11px] px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded font-mono">Shared Data</span>
          </div>
          <p className="text-xs text-indigo-200 mb-2">
            Shares user authentication & global state across Navbar, Hero, and Modals without prop drilling.
          </p>
          <div className="text-[11px] font-mono text-indigo-300 bg-indigo-900/60 p-2 rounded">
            Context User: {user ? `user.name = "${user.name}"` : 'null (Logged Out)'}
          </div>
        </div>

        {/* 3. Custom Hook Card */}
        <div className="bg-indigo-950/70 p-4 rounded-xl border border-indigo-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono font-bold text-emerald-300 text-sm">3. Custom Hook</span>
            <span className="text-[11px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono">Reused Logic</span>
          </div>
          <p className="text-xs text-indigo-200 mb-2">
            <code className="text-emerald-300 font-mono">useLostItems()</code> encapsulates state, loading spinner, error handling & item insertion logic.
          </p>
          <div className="text-[11px] font-mono text-indigo-300 bg-indigo-900/60 p-2 rounded">
            Hook Return: {`{ items: ${itemCount}, loading: ${loading} }`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HooksBanner;
