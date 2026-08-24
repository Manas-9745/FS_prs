import { useState, useEffect } from 'react';
import { fetchLostFoundItems } from '../data/lostFoundData';

// Custom Hook: useLostItems
// Encapsulates all data fetching logic for Lost & Found items
const useLostItems = () => {
  const [items, setItems] = useState([]);       // fetched items
  const [loading, setLoading] = useState(true);  // loading state
  const [error, setError] = useState(null);      // error state

  // useEffect runs when the component mounts (empty dependency array)
  useEffect(() => {
    let isMounted = true; // cleanup flag

    const loadItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLostFoundItems(); // simulate API call
        if (isMounted) {
          setItems(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Something went wrong while loading items.');
          setLoading(false);
        }
      }
    };

    loadItems();

    // Cleanup function (component lifecycle)
    return () => {
      isMounted = false;
    };
  }, []); // empty dependency array = runs once on mount

  // Function to add a new item to the list
  const addItem = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  return { items, loading, error, addItem };
};

export default useLostItems;
