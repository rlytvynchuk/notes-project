import { useState, useEffect, useCallback } from 'react';

/**
 * A React hook for persisting state in localStorage
 * @param {string} key - The localStorage key to use
 * @param {any} initialValue - The initial value (or function that returns initial value)
 * @returns {[any, function, function]} 
 *          [storedValue, setValue, removeValue]
 */
function useLocalStorage(key, initialValue) {
  
  // Get from localStorage then parse stored json or return initialValue
  const readValue = useCallback(() => {
    // Prevent build errors on server-side rendering
    if (typeof window === 'undefined') {
      return initialValue instanceof Function ? initialValue() : initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      
      // Parse stored json or if none return initialValue
      if (item) {
        return JSON.parse(item);
      }
      
      // If initialValue is a function, call it
      const valueToStore = initialValue instanceof Function ?
				initialValue() : initialValue;
      
      // Store initial value if not already present
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      return valueToStore;
      
    } catch (error) {
      // If error, return initialValue
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  }, [initialValue, key]);

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
      
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove the value from localStorage
  const removeValue = useCallback(() => {
    try {
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      
      // Reset to initial value
      const initialValueToStore = initialValue instanceof Function 
        ? initialValue() 
        : initialValue;
      setStoredValue(initialValueToStore);
      
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to this localStorage key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.warn(`Error parsing storage change for key "${key}":`, error);
        }
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  // Optional: Listen for custom events for same-window updates
  useEffect(() => {
    const handleCustomEvent = (e) => {
      if (e.detail?.key === key && e.detail?.newValue !== undefined) {
        setStoredValue(e.detail.newValue);
      }
    };

    window.addEventListener('local-storage-update', handleCustomEvent);
    
    return () => {
      window.removeEventListener('local-storage-update', handleCustomEvent);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// Helper function to dispatch custom events (optional)
export const dispatchLocalStorageEvent = (key, newValue) => {
  const event = new CustomEvent('local-storage-update', {
    detail: { key, newValue }
  });
  window.dispatchEvent(event);
};

export default useLocalStorage;