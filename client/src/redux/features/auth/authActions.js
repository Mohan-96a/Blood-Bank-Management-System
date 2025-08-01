import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../services/API";
import { toast } from "react-toastify";
import { checkServerConnection, getNetworkErrorMessage } from "../../../utils/serverCheck";

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ role, email, password }, { rejectWithValue }) => {
    try {
      // Basic validation
      if (!email || !password) {
        return rejectWithValue("Please provide both email and password");
      }

      // Check server connection first
      const isConnected = await checkServerConnection();
      if (!isConnected) {
        return rejectWithValue("Cannot connect to server. Please check your internet connection or try refreshing the page.");
      }

      console.log('Attempting login with:', { role, email });
      const { data } = await API.post("/auth/login", { role, email, password });
      console.log('Login response:', data);
      
      if (data.success) {
        toast.success(data.message);
        localStorage.setItem("token", data.token);
        window.location.replace("/dashboard");
      } else {
        return rejectWithValue(data.message || "Login failed");
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(getNetworkErrorMessage(error));
    }
  }
);

//register
export const userRegister = createAsyncThunk(
  "auth/register",
  async (
    {
      name,
      role,
      email,
      password,
      phone,
      organisationName,
      address,
      hospitalName,
      website,
    },
    { rejectWithValue }
  ) => {
    try {
      // Basic validation
      if (!email || !password) {
        return rejectWithValue("Please provide both email and password");
      }

      // Role-specific validation
      if ((role === "user" || role === "admin") && !name) {
        return rejectWithValue("Please provide your name");
      }
      if (role === "organisation" && !organisationName) {
        return rejectWithValue("Please provide organisation name");
      }
      if (role === "hospital" && !hospitalName) {
        return rejectWithValue("Please provide hospital name");
      }

      // Check server connection first
      const isConnected = await checkServerConnection();
      if (!isConnected) {
        return rejectWithValue("Cannot connect to server. Please check your internet connection or try refreshing the page.");
      }

      console.log('Attempting registration with:', { role, email });
      
      // Log the full request body for debugging
      const requestBody = {
        name,
        role,
        email,
        password,
        phone,
        organisationName,
        address,
        hospitalName,
        website,
      };
      console.log('Registration request body:', requestBody);
      
      // Make the API request
      const { data } = await API.post("/auth/register", requestBody);
      console.log('Registration response:', data);

      if (data?.success) {
        toast.success("User Registered Successfully");
        window.location.replace("/login");
      } else {
        return rejectWithValue(data?.message || "Registration failed");
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Use utility function for error messaging
      return rejectWithValue(getNetworkErrorMessage(error));
    }
  }
);

//current user
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching current user');
      const res = await API.get("/auth/current-user");
      console.log('Current user response:', res.data);
      
      if (res.data) {
        return res?.data;
      }
      return rejectWithValue("Failed to get user data");
    } catch (error) {
      console.error('Get current user error:', error);
      return rejectWithValue(getNetworkErrorMessage(error));
    }
  }
);
