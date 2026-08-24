import React, { createContext, useState } from 'react';

// Create Context
export const LostFoundContext = createContext();

// Context Provider
export const LostFoundProvider = ({ children }) => {
  // Simple mock user state (no real auth)
  const [user, setUser] = useState(null);

  // Reported items tracked via context (shared across components)
  const [reportedItems, setReportedItems] = useState([]);

  const addReportedItem = (item) => {
    setReportedItems((prev) => [item, ...prev]);
  };

  const login = (name, email) => {
    setUser({ name, email });
  };

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
