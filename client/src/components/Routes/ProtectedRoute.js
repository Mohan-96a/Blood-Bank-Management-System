/**
 * Protected Route Component
 * 
 * This component provides authentication protection for routes that
 * require a logged-in user. It verifies the user's authentication status
 * and redirects to the login page if not authenticated.
 */

import React, { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";          // For dispatching Redux actions
import API from "../../services/API";               // API service for backend calls
import { getCurrentUser } from "../../redux/features/auth/authActions";  // Auth action
import { Navigate } from "react-router-dom";        // For redirection
import { toast } from "react-toastify";             // For error notifications
import Spinner from "../shared/Spinner";            // Loading spinner

/**
 * ProtectedRoute Component
 * 
 * Wraps protected routes to ensure user authentication.
 * Fetches and validates current user data from the backend.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {JSX.Element} Protected content or redirect to login
 */
const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  /**
   * Fetch current user data from the backend
   * Updates Redux state with user information or clears localStorage on failure
   */
  const getUser = useCallback(async () => {
    try {
      // Get current user data from API
      const { data } = await API.get("/auth/current-user");
      if (data?.success) {
        // Update Redux state with user data
        dispatch(getCurrentUser(data));
        setIsLoading(false);
      } else {
        throw new Error(data?.message || "Failed to get user data");
      }
    } catch (error) {
      // Clear authentication data on failure
      localStorage.clear();
      setHasToken(false);
      setIsLoading(false);
      // Only show error if it's not a network error (which is expected on first load)
      if (error.code !== "ERR_NETWORK" && error.response?.status !== 401) {
        toast.error(error.message || "Authentication failed");
      }
    }
  }, [dispatch]);

  // Check for token and fetch user data when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
    
    if (token) {
      // Only try to fetch user data if we have a token
      getUser();
    } else {
      // No token, no need to fetch user data
      setIsLoading(false);
    }
  }, [getUser]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <Spinner />;
  }

  // Check if user is authenticated by looking for token
  if (hasToken) {
    // Render protected content if authenticated
    return children;
  } else {
    // Redirect to landing page if not authenticated
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
