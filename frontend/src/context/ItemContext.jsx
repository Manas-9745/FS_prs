import React, { createContext, useState, useEffect } from 'react';
import { fetchLostFoundItems, createLostFoundItem } from '../data/lostFoundData';

// Create Context for sharing Lost & Found items state across components
export const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await fetchLostFoundItems();
        if (isMounted) {
          setItems(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };
    loadItems();
    return () => { isMounted = false; };
  }, []);

  const addItem = async (newItem) => {
    const createdItem = await createLostFoundItem(newItem);
    setItems((prevItems) => [createdItem, ...prevItems]);
  };

  const removeItem = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/items/${id}`, { method: 'DELETE' });
      setItems((prevItems) => prevItems.filter(item => item._id !== id && item.id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return (
    <ItemContext.Provider value={{ items, loading, error, addItem, removeItem }}>
      {children}
    </ItemContext.Provider>
  );
};

