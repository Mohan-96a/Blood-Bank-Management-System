/**
 * Blood Bank Management System - Main Application Component
 * 
 * This is the root component of the React application that defines
 * all routes and their corresponding components. It handles navigation
 * between different pages based on user roles and authentication status.
 */

import { Routes, Route } from "react-router-dom";  // React Router components for navigation
import LandingPage from "./pages/LandingPage";     // Public landing page
import HomePage from "./pages/HomePage";           // Home/Dashboard page
import Login from "./pages/auth/Login";            // User login page
import Register from "./pages/auth/Register";      // User registration page
import { ToastContainer } from "react-toastify";   // Notification component
import "react-toastify/dist/ReactToastify.css";    // Notification styles
import ProtectedRoute from "./components/Routes/ProtectedRoute";  // Auth guard for private routes
import PublicRoute from "./components/Routes/PublicRoute";        // Auth guard for public routes

// Dashboard components for different user roles
import Donar from "./pages/Dashboard/Donar";                // Donor management page
import Hospitals from "./pages/Dashboard/Hospitals";        // Hospital management page
import OrganisationPage from "./pages/Dashboard/OrganisationPage";  // Organization management
import Consumer from "./pages/Dashboard/Consumer";          // Blood consumer/usage tracking
import Donation from "./pages/Donation";                    // Blood donation recording
import Analytics from "./pages/Dashboard/Analytics";        // Analytics dashboard

// Admin-specific pages
import UserList from "./pages/Admin/UserList";             // Admin user list view
import HospitalList from "./pages/Admin/HospitalList";     // Admin hospital list view
import OrgList from "./pages/Admin/OrgList";               // Admin organization list view
import AdminHome from "./pages/Admin/AdminHome";           // Admin dashboard

/**
 * App Component
 * 
 * Defines the routing structure of the application with protected
 * and public routes based on user authentication status.
 */
function App() {
  return (
    <>
      {/* Global toast notification container */}
      <ToastContainer />
      
      {/* Application routes */}
      <Routes>
        {/* Admin Routes - Only accessible to admin users */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-list"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital-list"
          element={
            <ProtectedRoute>
              <HospitalList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/org-list"
          element={
            <ProtectedRoute>
              <OrgList />
            </ProtectedRoute>
          }
        />

        {/* Hospital management route - For organization users */}
        <Route
          path="/hospital"
          element={
            <ProtectedRoute>
              <Hospitals />
            </ProtectedRoute>
          }
        />
        
        {/* Analytics dashboard route */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        
        {/* Blood consumer/usage tracking - For hospital users */}
        <Route
          path="/consumer"
          element={
            <ProtectedRoute>
              <Consumer />
            </ProtectedRoute>
          }
        />
        
        {/* Blood donation recording - For donor users */}
        <Route
          path="/donation"
          element={
            <ProtectedRoute>
              <Donation />
            </ProtectedRoute>
          }
        />
        
        {/* Organization management - For donor/hospital users */}
        <Route
          path="/organisation"
          element={
            <ProtectedRoute>
              <OrganisationPage />
            </ProtectedRoute>
          }
        />
        
        {/* Donor management - For organization users */}
        <Route
          path="/donar"
          element={
            <ProtectedRoute>
              <Donar />
            </ProtectedRoute>
          }
        />
        
        {/* Public Landing Page - Default route for non-authenticated users */}
        <Route
          path="/"
          element={<LandingPage />}
        />
        
        {/* Dashboard - Authenticated route for logged-in users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        
        {/* Public Routes - Accessible without authentication */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
