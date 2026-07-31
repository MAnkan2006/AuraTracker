import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import api from '../services/api';
import { UserContext } from './UserContext';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { isAuthenticated, user } = useContext(UserContext);
  const syncTimeoutRef = useRef(null);
  const [appState, setAppState] = useState({
    todos: [],
    attendance: {},
    routine: [],
    selectedTheme: 'classic-obsidian',
    selectedFont: 'font-modern',
    routineView: 'daily',
    activeRoutineDay: 1,
  });
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAppState = async () => {
      try {
        const response = await api.get('/sync');
        if (response.data.success && response.data.state) {
          setAppState(response.data.state);
        }
      } catch (error) {
        console.error("Error fetching app state:", error);
      } finally {
        setLoadingState(false);
      }
    };

    fetchAppState();
  }, [isAuthenticated]);

  const updateAppState = (newState) => {
    setAppState((prev) => {
      const updatedState = { ...prev, ...newState };
      
      // Debounced backend sync
      if (isAuthenticated && user?.username?.toLowerCase() !== 'guest') {
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }
        syncTimeoutRef.current = setTimeout(() => {
          api.post('/sync', { state: updatedState }).catch(err => console.error("Sync error:", err));
        }, 2000);
      }
      
      return updatedState;
    });
  };

  return (
    <AppContext.Provider value={{ appState, updateAppState, loadingState }}>
      {children}
    </AppContext.Provider>
  );
};
