import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages & Layout
import ProtectedRoute from './components/layout/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Routine from './pages/Routine';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import Map from './pages/Map';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Legacy Route Fallback for Backend OAuth Redirects */}
      <Route path="/app.html" element={<Login />} />

      {/* Protected Routes (Dashboard) */}
      <Route path="/app" element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="routine" element={<Routine />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="map" element={<Map />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
