import { useState, useEffect, useCallback } from 'react';
import lostFoundData, { fetchLostFoundItems } from '../data/lostFoundData';

// Custom Hook: useLostItems()
// Encapsulates data fetching, loading, error states, refetching, and state updates
const useLostItems = () => {
  const [items, setItems] = useState([]);       // fetched items (useState)
  const [loading, setLoading] = useState(true);  // loading state (useState)
  const [error, setError] = useState(null);      // error state (useState)

  const loadItems = useCallback(async (simulateError = false) => {
    try {
      setLoading(true);
      setError(null);
      
      if (simulateError) {
        // Simulate an API network error
        await new Promise((_, reject) => setTimeout(() => reject(new Error("Simulated 500 Network Error: Server unreachable")), 1000));
      } else {
        const data = await fetchLostFoundItems(); // mock data fetch with 1.5s delay
        setItems(data);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Something went wrong while loading items.');
      setLoading(false);
    }
  }, []);

  // useEffect runs on component mount (empty dependency array)
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const addItem = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const refetch = () => {
    loadItems(false);
  };

  const triggerError = () => {
    loadItems(true);
  };

  return { items, loading, error, addItem, refetch, triggerError };
};

export default useLostItems;
