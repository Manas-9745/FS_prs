// Mock data for Lost & Found items
const lostFoundData = [
  {
    id: 1,
    name: "Black Wallet",
    category: "Personal",
    location: "Library",
    date: "2026-08-24",
    status: "Lost",
    description: "Black leather wallet with student ID and some cash. Last seen near the reading area on the 2nd floor."
  },
  {
    id: 2,
    name: "Blue Water Bottle",
    category: "Accessories",
    location: "Classroom 301",
    date: "2026-08-23",
    status: "Found",
    description: "Blue 32oz Hydro Flask with several stickers on it. Found on the desk after the morning lecture."
  },
  {
    id: 3,
    name: "Student ID Card",
    category: "Documents",
    location: "Cafeteria",
    date: "2026-08-22",
    status: "Found",
    description: "Student ID belonging to a CS department student. Turned in to the cashier at the main cafeteria."
  },
  {
    id: 4,
    name: "Apple AirPods Pro",
    category: "Electronics",
    location: "Science Building Room 201",
    date: "2026-08-21",
    status: "Lost",
    description: "White AirPods Pro in a case with a small scratch on the front. Was studying near the computers."
  },
  {
    id: 5,
    name: "North Face Backpack",
    category: "Accessories",
    location: "Student Union",
    date: "2026-08-20",
    status: "Lost",
    description: "Black North Face backpack containing notebooks and a graphing calculator. Left on a couch."
  },
  {
    id: 6,
    name: "Silver Keys on Lanyard",
    category: "Other",
    location: "Parking Lot B",
    date: "2026-08-19",
    status: "Found",
    description: "Set of 4 keys on a red campus lanyard. Found near the sophomore parking area."
  },
  {
    id: 7,
    name: "MacBook Charger",
    category: "Electronics",
    location: "Library 3rd Floor",
    date: "2026-08-18",
    status: "Lost",
    description: "Apple 61W USB-C Power Adapter. Needed urgently for assignments!"
  },
  {
    id: 8,
    name: "Prescription Glasses",
    category: "Personal",
    location: "Gymnasium",
    date: "2026-08-17",
    status: "Found",
    description: "Black frame prescription glasses found near the basketball courts in a brown case."
  }
];

// Fetch items from the backend API, fallback to mock data on error
export const fetchLostFoundItems = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/items');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not fetch from backend, using mock data:", error);
    return lostFoundData;
  }
};

export const createLostFoundItem = async (itemData) => {
  try {
    const response = await fetch('http://localhost:5000/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(itemData)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating item on backend:", error);
    // Return mock data for frontend optimism if backend fails
    return { ...itemData, _id: Date.now().toString() };
  }
};

export default lostFoundData;
