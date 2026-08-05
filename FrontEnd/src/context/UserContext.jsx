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

      let savedGuestProfile = null;
      try {
        const stored = localStorage.getItem('auratracker_guest_profile');
        if (stored) savedGuestProfile = JSON.parse(stored);
      } catch (e) {}

      if (token === 'dev-mock-token') {
        // Bypass for UI Development
        setUser(savedGuestProfile || { name: 'Guest Explorer', username: 'guest', email: 'guest@auratracker.app' });
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
          if (savedGuestProfile) setUser(savedGuestProfile);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        // Fallback for UI development if backend is not running
        if (process.env.NODE_ENV === 'development' || !token) {
          console.log("Mocking user for UI development");
          setUser(savedGuestProfile || { name: 'Dev User', username: 'developer', email: 'dev@auratracker.app' });
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

  const loginWithCredentials = async (username, password, appState) => {
    try {
      const response = await api.post('/login', { username, password });
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        // Sync local guest state to new backend account
        await api.post('/sync', { state: appState || {} });
        
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
    // If guest user or no token, update local user state directly
    const isGuest = !localStorage.getItem('token') || user?.username?.toLowerCase() === 'guest';
    if (isGuest) {
      setUser((prev) => {
        const updatedUser = {
          ...(prev || {}),
          ...updates,
          academicProfile: {
            ...(prev?.academicProfile || {}),
            ...(updates.academicProfile || {})
          }
        };
        try {
          localStorage.setItem('auratracker_guest_profile', JSON.stringify(updatedUser));
        } catch (e) {
          console.error("Failed to save guest profile to localStorage", e);
        }
        return updatedUser;
      });
      return { success: true, message: 'Profile updated successfully' };
    }

    try {
      const response = await api.post('/profile', updates);
      if (response.data.success) {
        setUser((prev) => ({
          ...prev,
          ...updates,
          ...(response.data.user || {}),
          academicProfile: {
            ...(prev?.academicProfile || {}),
            ...(updates.academicProfile || {}),
            ...(response.data.user?.academicProfile || {})
          }
        }));
        return { success: true, message: response.data.message || 'Profile updated successfully' };
      }
      return { success: false, message: response.data.message || 'Failed to update profile' };
    } catch (error) {
      console.error("Error updating profile:", error);
      // Fallback for offline/guest updates
      setUser((prev) => ({
        ...(prev || {}),
        ...updates,
        academicProfile: {
          ...(prev?.academicProfile || {}),
          ...(updates.academicProfile || {})
        }
      }));
      return { success: true, message: 'Profile updated locally' };
    }
  };

  const registerWithCredentials = async (username, email, password, name) => {
    try {
      const response = await api.post('/register', {
        username,
        email,
        password,
        name: name || username
      });
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        setUser(response.data.user);
        window.location.href = '/app';
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Registration failed' };
    } catch (error) {
      console.error("Error during registration:", error);
      return { success: false, message: error.response?.data?.message || 'Server error during registration' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, isAuthenticated, login, loginWithCredentials, registerWithCredentials, convertGuestAccount, updateProfile, logout }}>
      {children}
    </UserContext.Provider>
  );
};
