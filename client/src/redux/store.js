/**
 * Redux Store Configuration
 * 
 * This file configures the global Redux store for state management
 * in the blood bank application. It combines all the feature reducers
 * into a single store that can be accessed throughout the application.
 */

import { configureStore } from "@reduxjs/toolkit";  // Redux Toolkit store setup
import authSlice from "./features/auth/authSlice";  // Authentication state slice

/**
 * Redux Store
 * 
 * The central state container that holds the application's state tree.
 * Currently includes the following slices:
 * - auth: Manages user authentication state
 */
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,  // Authentication reducer handling login/register/user state
  },
});

export default store;
