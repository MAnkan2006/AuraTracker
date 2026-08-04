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
    clockStyle: localStorage.getItem('aura_clock_style') || 'stacked',
    routineView: 'daily',
    activeRoutineDay: 1,
    readNotifIds: [],
  });
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
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
    } else {
      // For unauthenticated / guest users, read legacy guest data if present in localStorage.
      // NOTE: We do NOT remove `auratracker_user_Guest_data` here automatically to prevent data loss.
      // It is safely retained until `convertGuestAccount` successfully syncs the state to the backend.
      try {
        const legacyGuestDataStr = localStorage.getItem('auratracker_user_Guest_data');
        if (legacyGuestDataStr) {
          const parsed = JSON.parse(legacyGuestDataStr);
          if (parsed && typeof parsed === 'object') {
            setAppState((prev) => ({
              ...prev,
              todos: Array.isArray(parsed.todos) ? parsed.todos : prev.todos,
              attendance: (parsed.attendance && typeof parsed.attendance === 'object') ? parsed.attendance : prev.attendance,
              routine: Array.isArray(parsed.routine) ? parsed.routine : prev.routine,
              selectedTheme: parsed.selectedTheme || prev.selectedTheme,
              selectedFont: parsed.selectedFont || prev.selectedFont,
              clockStyle: parsed.clockStyle || localStorage.getItem('aura_clock_style') || prev.clockStyle,
              routineView: parsed.routineView || prev.routineView,
              activeRoutineDay: parsed.activeRoutineDay !== undefined ? parsed.activeRoutineDay : prev.activeRoutineDay,
              readNotifIds: Array.isArray(parsed.readNotifIds) ? parsed.readNotifIds : prev.readNotifIds,
            }));
          }
        }
      } catch (err) {
        console.error("Error parsing legacy guest data from localStorage:", err);
      } finally {
        setLoadingState(false);
      }
    }
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
