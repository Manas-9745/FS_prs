import { useState, useEffect, useCallback } from 'react';
import lostFoundData, { fetchLostFoundItems } from '../data/lostFoundData';

// Custom Hook: useLostItems
// Encapsulates all data fetching logic for Lost & Found items
const useLostItems = () => {
  const [items, setItems] = useState([]);       // fetched items (useState)
  const [loading, setLoading] = useState(true);  // loading state (useState)
  const [error, setError] = useState(null);      // error state (useState)

  // Function to fetch data (can be triggered on mount or by user click)
  const loadItems = useCallback(async (simulateError = false) => {
    try {
      setLoading(true);
      setError(null);
      
      if (simulateError) {
        // Simulate an API network error
        await new Promise((_, reject) => setTimeout(() => reject(new Error("Simulated 500 Network Error: Server unreachable")), 1200));
      } else {
        const data = await fetchLostFoundItems(); // simulate API call with 1.5s delay
        setItems(data);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Something went wrong while loading items.');
      setLoading(false);
    }
  }, []);

  // useEffect runs on component mount
  useEffect(() => {
    loadItems();
  }, [loadItems]); // runs once when loadItems is defined

  // Function to add a new item to the list
  const addItem = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  // Function to trigger refetch
  const refetch = () => {
    loadItems(false);
  };

  // Function to trigger simulated error state
  const triggerError = () => {
    loadItems(true);
  };

  return { items, loading, error, addItem, refetch, triggerError };
};

export default useLostItems;
