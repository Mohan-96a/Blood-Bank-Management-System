/**
 * Authentication Slice
 * 
 * This Redux slice manages the authentication state of the application
 * including user data, auth token, loading states, and error messages.
 * It handles login, registration, and current user fetch operations.
 */

import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUser, userLogin, userRegister } from "./authActions";

// Retrieve authentication token from localStorage if available
const token = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : null;

/**
 * Initial authentication state
 * 
 * @property {boolean} loading - Indicates if an auth operation is in progress
 * @property {Object|null} user - Current user data or null if not authenticated
 * @property {string|null} token - JWT authentication token
 * @property {string|null} error - Error message if auth operation failed
 */
const initialState = {
  loading: false,
  user: null,
  token,
  error: null,
};

/**
 * Authentication Slice Definition
 * 
 * Defines reducers and extra reducers for handling auth actions
 */
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},  // No standard reducers, using extraReducers for async actions
  extraReducers: (builder) => {
    // Login action handlers
    builder.addCase(userLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(userLogin.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload.user;
      state.token = payload.token;
    });
    builder.addCase(userLogin.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Registration action handlers
    builder.addCase(userRegister.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(userRegister.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload.user;
    });
    builder.addCase(userRegister.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // Current user fetch action handlers
    builder.addCase(getCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload.user;
    });
    builder.addCase(getCurrentUser.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export default authSlice;
