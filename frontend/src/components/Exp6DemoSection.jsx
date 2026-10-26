import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ItemContext } from '../context/ItemContext';

const Exp6DemoSection = ({ onOpenAuthModal }) => {
  const {
    user,
    token,
    decodedToken,
    login,
    logout,
    testProtectedDashboard,
    testAdminRoute,
    fetchAllUsers,
  } = useContext(AuthContext);

  const { items, removeItem } = useContext(ItemContext);

  // Live test states
  const [dashboardResult, setDashboardResult] = useState(null);
  const [testingDashboard, setTestingDashboard] = useState(false);

  const [adminResult, setAdminResult] = useState(null);
  const [testingAdmin, setTestingAdmin] = useState(false);

  const [atlasUsers, setAtlasUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [atlasError, setAtlasError] = useState(null);

  const [copiedToken, setCopiedToken] = useState(false);

  // Auto fetch atlas users if admin
  useEffect(() => {
    if (user && user.role === 'admin') {
      loadAtlasUsers();
    }
  }, [user]);

  const loadAtlasUsers = async () => {
    setLoadingUsers(true);
    setAtlasError(null);
    const res = await fetchAllUsers();
    if (res.ok && res.data.users) {
      setAtlasUsers(res.data.users);
    } else {
      setAtlasError(res.data.message || 'Only Admin can access Atlas user list');
    }
    setLoadingUsers(false);
  };

  const handleTestDashboard = async () => {
    setTestingDashboard(true);
    const res = await testProtectedDashboard();
    setDashboardResult(res);
    setTestingDashboard(false);
  };

  const handleTestAdmin = async () => {
    setTestingAdmin(true);
    const res = await testAdminRoute();
    setAdminResult(res);
    setTestingAdmin(false);
  };

  const handleQuickLogin = async (roleType) => {
    if (roleType === 'user') {
      await login('pooja@gmail.com', 'password123');
    } else {
      await login('admin@gmail.com', 'admin123');
    }
    setDashboardResult(null);
    setAdminResult(null);
  };

  const copyTokenToClipboard = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-xs font-semibold tracking-wide uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Campus Security &amp; Access Control</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              JWT Authentication &amp; Role-Based Access Control
            </h1>
            <p className="mt-2 text-indigo-100 text-sm max-w-2xl leading-relaxed">
              Verify cryptographic claims, test protected endpoints for Students vs Security Officers, and inspect MongoDB Atlas user directory.
            </p>
          </div>

          {/* Quick Switch Buttons */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm p-3 rounded-xl border border-white border-opacity-20 flex flex-col gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-indigo-200">1-Click Account Switch:</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleQuickLogin('user')}
                className="flex-1 md:flex-none px-3 py-1.5 bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-bold rounded-lg shadow-sm transition"
              >
                👤 Switch to Pooja (User)
              </button>
              <button
                onClick={() => handleQuickLogin('admin')}
                className="flex-1 md:flex-none px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold rounded-lg shadow-sm transition"
              >
                🛡️ Switch to Admin (Admin)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Session Status & JWT Token Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Session Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-gray-900">Current Auth State</h2>
              {user ? (
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}>
                  ● {user.role}
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                  Logged Out
                </span>
              )}
            </div>

            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    user.role === 'admin' ? 'bg-purple-600' : 'bg-indigo-600'
                  }`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-gray-900 text-sm truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-1.5 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p><strong className="text-gray-800">Atlas ID:</strong> <span className="font-mono text-gray-600">{user.id || user._id}</span></p>
                  <p><strong className="text-gray-800">Role:</strong> <span className="font-semibold text-indigo-600 uppercase">{user.role}</span></p>
                  <p><strong className="text-gray-800">Atlas Status:</strong> <span className="text-emerald-700 font-semibold">🟢 Active in Atlas (test.users)</span></p>
                  <p><strong className="text-gray-800">Last Login:</strong> <span className="text-indigo-700 font-mono">{user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString() : 'Just now'}</span></p>
                  <p><strong className="text-gray-800">Login Count:</strong> <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold">{user.loginCount || 1}</span></p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm mb-4">No active user session. Sign in to generate a JWT token.</p>
                <button
                  onClick={onOpenAuthModal}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow"
                >
                  Sign In / Register
                </button>
              </div>
            )}
          </div>

          {user && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={logout}
                className="w-full py-2 px-3 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-lg transition"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Live JWT Token Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900">JWT Token Inspector</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Bearer Auth
              </span>
            </div>
            {token && (
              <button
                onClick={copyTokenToClipboard}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                {copiedToken ? '✓ Copied!' : '📋 Copy Token'}
              </button>
            )}
          </div>

          {token ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Encoded JWT Token String:</label>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono break-all max-h-24 overflow-y-auto border border-slate-800">
                  {token}
                </div>
              </div>

              {decodedToken && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Decoded Payload (Verified by Server):</label>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-xs font-mono grid grid-cols-2 md:grid-cols-4 gap-3 text-indigo-950">
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-sans">User ID (id):</span>
                      <span className="font-bold">{decodedToken.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-sans">Role (role):</span>
                      <span className="font-bold uppercase text-purple-700">{decodedToken.role}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-sans">Issued At (iat):</span>
                      <span>{new Date(decodedToken.iat * 1000).toLocaleTimeString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-sans">Expires At (exp):</span>
                      <span>{new Date(decodedToken.exp * 1000).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <p className="text-sm font-medium text-gray-600">No JWT token currently generated</p>
              <p className="text-xs text-gray-400 mt-1">Log in using the buttons above to view and test your JWT token.</p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Protected Routes Testing Section (From PDF Steps 14, 15, 16) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            Protected Routes &amp; Role Access Verification (PDF Test Suite)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Test the live backend endpoints protecting the application using JWT authentication and role authorization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test 1: Protected Dashboard */}
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                    GET /api/user/dashboard
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm mt-1">Protected Dashboard (User + Admin)</h3>
                </div>
                <span className="text-[11px] font-semibold text-gray-500">Middleware: protect</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Requires a valid JWT Bearer token. Accessible by both regular <strong className="text-indigo-600">users</strong> and <strong className="text-purple-600">admins</strong>.
              </p>

              <button
                onClick={handleTestDashboard}
                disabled={testingDashboard}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
              >
                {testingDashboard ? 'Testing...' : '⚡ Send GET Request with Current JWT'}
              </button>
            </div>

            {dashboardResult && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-gray-700">Live Server Response:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    dashboardResult.status === 200 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    Status: {dashboardResult.status} {dashboardResult.status === 200 ? 'OK' : 'Unauthorized'}
                  </span>
                </div>
                <pre className="bg-slate-900 text-slate-100 text-xs p-3 rounded-lg overflow-x-auto font-mono">
                  {JSON.stringify(dashboardResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Test 2: Admin Only Route */}
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                    GET /api/user/admin
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm mt-1">Admin Only Route (Role Guard)</h3>
                </div>
                <span className="text-[11px] font-semibold text-gray-500">Middleware: protect + authorize("admin")</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Role check: If user role is <strong className="text-rose-600">user</strong>, returns <code className="bg-rose-100 text-rose-800 px-1 rounded text-xs">403 Forbidden</code>. If role is <strong className="text-purple-600">admin</strong>, returns <code className="bg-emerald-100 text-emerald-800 px-1 rounded text-xs">200 OK</code>.
              </p>

              <button
                onClick={handleTestAdmin}
                disabled={testingAdmin}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
              >
                {testingAdmin ? 'Testing...' : '⚡ Test Admin Role Permission with Current JWT'}
              </button>
            </div>

            {adminResult && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-gray-700">Live Server Response:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    adminResult.status === 200
                      ? 'bg-emerald-100 text-emerald-800'
                      : adminResult.status === 403
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    Status: {adminResult.status} {adminResult.status === 200 ? 'OK' : adminResult.status === 403 ? 'Forbidden' : 'Unauthorized'}
                  </span>
                </div>
                <pre className="bg-slate-900 text-slate-100 text-xs p-3 rounded-lg overflow-x-auto font-mono">
                  {JSON.stringify(adminResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MongoDB Atlas Cloud Live Verification Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">
                MongoDB Atlas Cloud Live Records
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected to Atlas
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Registered users stored directly in the <code className="text-indigo-600 font-mono">users</code> collection on MongoDB Atlas cluster.
            </p>
          </div>

          <button
            onClick={loadAtlasUsers}
            disabled={loadingUsers}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition"
          >
            {loadingUsers ? 'Refreshing...' : '🔄 Refresh Atlas Users'}
          </button>
        </div>

        {atlasError && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg mb-4">
            {atlasError} (Sign in as <strong className="text-purple-700">Admin</strong> to view full user list from Atlas)
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                <th className="py-2.5 px-3 font-semibold">User Name</th>
                <th className="py-2.5 px-3 font-semibold">Email</th>
                <th className="py-2.5 px-3 font-semibold">Account Role</th>
                <th className="py-2.5 px-3 font-semibold">Atlas ID</th>
                <th className="py-2.5 px-3 font-semibold">Live Logins</th>
                <th className="py-2.5 px-3 font-semibold">Last Login (Atlas)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {atlasUsers.length > 0 ? (
                atlasUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-3 font-bold text-gray-900 flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${
                        u.role === 'admin' ? 'bg-purple-600' : 'bg-indigo-600'
                      }`}>
                        {u.name.charAt(0).toUpperCase()}
                      </span>
                      {u.name}
                    </td>
                    <td className="py-3 px-3 text-gray-600">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-gray-500">{u._id}</td>
                    <td className="py-3 px-3">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold text-[11px]">
                        {u.loginCount || 1}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-600 font-mono text-[11px]">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleTimeString() : 'Just registered'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    {user && user.role === 'admin'
                      ? 'Click "Refresh Atlas Users" to load records.'
                      : 'Please sign in with Admin account (admin@gmail.com) to view the Atlas user table.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Exp6DemoSection;
