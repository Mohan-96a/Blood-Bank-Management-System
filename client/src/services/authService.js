/**
 * Authentication Service
 * 
 * This file contains helper functions for handling authentication-related
 * actions like login and registration. It provides validation logic and
 * dispatches Redux actions for auth operations.
 */

import { userLogin, userRegister } from "../redux/features/auth/authActions";  // Auth actions
import store from "../redux/store";                  // Redux store for dispatching
import { toast } from "react-toastify";              // Notification system
import { checkServerConnection } from "../utils/serverCheck"; // Server connectivity checker

/**
 * Handle User Login
 * 
 * Processes login with validation and dispatches login action.
 * Returns a promise that resolves with the response.
 * 
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @param {string} credentials.role - User role (admin, organisation, user, hospital)
 * @param {Function} dispatch - Redux dispatch function (optional)
 * @returns {Promise<Object>} Response with success status and message
 */
export const handleLogin = async (credentials, dispatch = null) => {
  try {
    // Validate required fields
    const { email, password, role } = credentials;
    if (!role || !email || !password) {
      toast.error("Please provide all fields");
      return { success: false, message: "Please provide all fields" };
    }

    // Check server connectivity
    const isConnected = await checkServerConnection();
    if (!isConnected) {
      const errorMsg = "Cannot connect to server. Please check your internet connection or try refreshing the page.";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }
    
    // Use the provided dispatch or the store dispatch
    const dispatchFn = dispatch || store.dispatch;
    
    // Dispatch login action
    await dispatchFn(userLogin(credentials));
    
    // Return success if no errors were thrown
    return { success: true, message: "Login successful!" };
    
  } catch (error) {
    const errorMsg = error.message || "An error occurred during login";
    toast.error(errorMsg);
    return { success: false, message: errorMsg };
  }
};

/**
 * Handle User Registration
 * 
 * Processes registration with validation and dispatches register action.
 * Returns a promise that resolves with the response.
 * 
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Response with success status and message
 */
export const handleRegister = async (userData) => {
  try {
    // Validate required fields
    const { email, password, role } = userData;
    if (!role || !email || !password) {
      toast.error("Please provide all required fields");
      return { success: false, message: "Please provide all required fields" };
    }

    // Role-specific validation
    if ((role === "user" || role === "admin") && !userData.name) {
      toast.error("Please provide your name");
      return { success: false, message: "Please provide your name" };
    }
    if (role === "organisation" && !userData.organisationName) {
      toast.error("Please provide organisation name");
      return { success: false, message: "Please provide organisation name" };
    }
    if (role === "hospital" && !userData.hospitalName) {
      toast.error("Please provide hospital name");
      return { success: false, message: "Please provide hospital name" };
    }

    // Check server connectivity
    const isConnected = await checkServerConnection();
    if (!isConnected) {
      const errorMsg = "Cannot connect to server. Please check your internet connection or try refreshing the page.";
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }
    
    // Dispatch register action
    await store.dispatch(userRegister(userData));
    
    // Return success if no errors were thrown
    return { success: true, message: "Registration successful! You can now login." };
    
  } catch (error) {
    const errorMsg = error.message || "An error occurred during registration";
    toast.error(errorMsg);
    return { success: false, message: errorMsg };
  }
};
