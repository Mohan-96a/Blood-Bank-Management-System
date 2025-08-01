/**
 * Public Route Component
 * 
 * This component handles routes that should only be accessible to non-authenticated users,
 * such as login and registration pages. It prevents authenticated users from
 * accessing these routes by redirecting them to the dashboard.
 */

import React from "react";
import { Navigate } from "react-router-dom";  // For redirecting users
import { toast } from "react-toastify";       // For notifications

/**
 * PublicRoute Component
 * 
 * Wraps public routes (login, register) to prevent authenticated users
 * from accessing them. Checks for authentication token and redirects
 * to dashboard if already logged in.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if not authenticated
 * @returns {JSX.Element} Public content or redirect to dashboard
 */
const PublicRoute = ({ children }) => {
  // Check if user has an authentication token
  const token = localStorage.getItem("token");
  
  // If token exists, user is already authenticated
  if (token) {
    // Notify user they're already logged in
    toast.info("You are already logged in");
    // Redirect to dashboard
    return <Navigate to="/" />;
  }
  
  // Render public content if not authenticated
  return children;
};

export default PublicRoute;
