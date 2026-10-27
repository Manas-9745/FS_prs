import React, { createContext, useState, useEffect } from 'react';
import { BACKEND_URL } from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('foundit_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('foundit_token') || null;
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('foundit_token', token);
    } else {
      localStorage.removeItem('foundit_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('foundit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('foundit_user');
    }
  }, [user]);

  // Decode JWT payload helper
  const decodeJwt = (jwtToken) => {
    if (!jwtToken) return null;
    try {
      const parts = jwtToken.split('.');
      if (parts.length < 2) return null;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return null;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      setToken(data.token);
      setUser(data.user);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setAuthError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password, role = 'user') => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setAuthError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('foundit_user');
    localStorage.removeItem('foundit_token');
  };

  // Test Protected Routes (Exp 6 verification)
  const testProtectedDashboard = async (customToken = null) => {
    const activeToken = customToken !== null ? customToken : token;
    try {
      const res = await fetch(`${BACKEND_URL}/api/user/dashboard`, {
        method: 'GET',
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
      });
      const data = await res.json();
      return { status: res.status, ok: res.ok, data };
    } catch (err) {
      return { status: 500, ok: false, data: { message: err.message } };
    }
  };

  const testAdminRoute = async (customToken = null) => {
    const activeToken = customToken !== null ? customToken : token;
    try {
      const res = await fetch(`${BACKEND_URL}/api/user/admin`, {
        method: 'GET',
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
      });
      const data = await res.json();
      return { status: res.status, ok: res.ok, data };
    } catch (err) {
      return { status: 500, ok: false, data: { message: err.message } };
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/user/all`, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      return { status: res.status, ok: res.ok, data };
    } catch (err) {
      return { status: 500, ok: false, data: { message: err.message } };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        decodedToken: decodeJwt(token),
        login,
        register,
        logout,
        testProtectedDashboard,
        testAdminRoute,
        fetchAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
