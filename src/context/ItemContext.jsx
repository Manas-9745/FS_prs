import React, { createContext, useState } from 'react';
import { initialItems } from '../data/initialItems';

// Create Context for sharing Lost & Found items state across components
export const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState(initialItems);

  const addItem = (newItem) => {
    setItems((prevItems) => [newItem, ...prevItems]);
  };

  return (
    <ItemContext.Provider value={{ items, addItem }}>
      {children}
    </ItemContext.Provider>
  );
};
