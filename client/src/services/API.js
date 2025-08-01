/**
 * API Service Configuration
 * 
 * This file configures and exports an Axios instance for making HTTP requests
 * to the backend API. It includes interceptors for handling authentication
 * and error logging.
 */

import axios from "axios";  // HTTP client library
import { toast } from "react-toastify";
import { checkServerConnection, getNetworkErrorMessage } from "../utils/serverCheck";

// Debug the API URL being used
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';
console.log('Using API Base URL:', BASE_URL);

// Test connection before setting up API
export const testConnection = async () => {
  try {
    const isConnected = await checkServerConnection();
    console.log("Server connection test:", isConnected ? "Success" : "Failed");
    return isConnected;
  } catch (error) {
    console.error("Error during connection test:", error);
    return false;
  }
};

/**
 * Axios Instance
 * 
 * Preconfigured Axios instance with base URL and default headers.
 * Used throughout the application for consistent API communication.
 */
const API = axios.create({ 
  baseURL: BASE_URL,  // Hardcoded base URL to avoid env issues
  headers: {
    'Content-Type': 'application/json'     // Default content type for requests
  },
  withCredentials: false,  // Disable credentials to avoid CORS issues
  timeout: 10000  // Add a timeout to prevent hanging requests
});

/**
 * Request Interceptor
 * 
 * Intercepts outgoing requests to add authentication token if available.
 * This ensures all authenticated requests include the JWT token.
 */
API.interceptors.request.use(
  function (config) {
    // Add auth token to header if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    console.log('API Request:', config.method, config.url);
    return config;
  },
  function (error) {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * Intercepts incoming responses to handle errors consistently.
 * Logs error details for debugging purposes.
 */
API.interceptors.response.use(
  function (response) {
    console.log('API Response:', response.status);
    return response;  // Pass through successful responses
  },
  function (error) {
    // Handle network errors
    console.error("API Response Error:", error?.response?.data || error.message || error);
    
    // Don't show toast for 401 errors (authentication failures) as they're handled by components
    if (error.response?.status === 401) {
      console.log('Authentication error - handled by component');
      return Promise.reject(error);
    }
    
    // Don't show toast for network errors on initial page load
    if (error.code === "ERR_NETWORK") {
      // Only show network error toast if it's not the initial page load
      const isInitialLoad = !localStorage.getItem("token");
      if (!isInitialLoad) {
        toast.error(getNetworkErrorMessage(error));
      }
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    }
    
    return Promise.reject(error);
  }
);

export default API;
