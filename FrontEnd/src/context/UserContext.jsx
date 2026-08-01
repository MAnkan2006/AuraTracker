import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      if (token === 'dev-mock-token') {
        // Bypass for UI Development
        setUser({ name: 'Guest Explorer', username: 'guest', email: 'guest@auratracker.app' });
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/profile');
        if (response.data.success) {
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        // Fallback for UI development if backend is not running
        if (process.env.NODE_ENV === 'development') {
          console.log("Mocking user for UI development");
          setUser({ name: 'Dev User', username: 'developer', email: 'dev@auratracker.app' });
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    // Ideally refetch user profile here
    window.location.href = '/app';
  };

  const loginWithCredentials = async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        // Sync local guest state to new backend account
        await api.post('/sync', { state: {} }); // Basic sync ping
        
        window.location.href = '/app';
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Login failed' };
    } catch (error) {
      console.error("Error during manual login:", error);
      return { success: false, message: error.response?.data?.message || 'Server error during login' };
    }
  };

  const convertGuestAccount = async (credentials, appState) => {
    try {
      const response = await api.post('/register', credentials);
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        setUser(response.data.user);
        
        // Sync local guest state to new backend account
        await api.post('/sync', { state: appState });
        
        // Remove legacy guest localStorage key only after successful cloud sync
        localStorage.removeItem('auratracker_user_Guest_data');

        return { success: true };
      }
      return { success: false, message: response.data.message || 'Registration failed' };
    } catch (error) {
      console.error("Error converting guest:", error);
      return { success: false, message: error.response?.data?.message || 'Server error during conversion' };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await api.post('/profile', updates);
      if (response.data.success) {
        setUser((prev) => ({
          ...prev,
          ...updates,
          ...(response.data.user || {})
        }));
        return { success: true, message: response.data.message || 'Profile updated successfully' };
      }
      return { success: false, message: response.data.message || 'Failed to update profile' };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, message: error.response?.data?.message || 'Server error while updating profile' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, isAuthenticated, login, loginWithCredentials, convertGuestAccount, updateProfile, logout }}>
      {children}
    </UserContext.Provider>
  );
};
