import React, { createContext, useState } from 'react';

// Create the Context
export const LostFoundContext = createContext();

// Context Provider Component
export const LostFoundProvider = ({ children }) => {
  // Simple mock user state (no real auth)
  const [user, setUser] = useState(null);

  // Reported items tracked via context (shared across components)
  const [reportedItems, setReportedItems] = useState([]);

  // Add a new reported item
  const addReportedItem = (item) => {
    setReportedItems((prev) => [item, ...prev]);
  };

  // Login sets a mock user
  const login = (name, email) => {
    setUser({ name, email });
  };

  // Logout clears the user
  const logout = () => {
    setUser(null);
  };

  return (
    <LostFoundContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        reportedItems,
        addReportedItem,
      }}
    >
      {children}
    </LostFoundContext.Provider>
  );
};
