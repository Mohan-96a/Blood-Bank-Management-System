/**
 * Authentication Routes
 * 
 * This file defines API routes for user authentication functionality including
 * registration, login, and current user verification.
 * 
 * All routes here are prefixed with /api/v1/auth in the main server.js file.
 */

const express = require("express");
// Import authentication controller functions
const {
  registerController,
  loginController,
  currentUserController,
} = require("../controllers/authController");
// Import authentication middleware for protected routes
const authMiddelware = require("../middlewares/authMiddelware");

// Create Express router instance
const router = express.Router();

/**
 * User Registration Route
 * 
 * @route POST /api/v1/auth/register
 * @description Register new user with role-based validation
 * @access Public
 */
router.post("/register", registerController);

/**
 * User Login Route
 * 
 * @route POST /api/v1/auth/login
 * @description Authenticate user and generate JWT token
 * @access Public
 */
router.post("/login", loginController);

/**
 * Current User Route
 * 
 * @route GET /api/v1/auth/current-user
 * @description Get the currently logged in user's information
 * @access Private (requires valid JWT token)
 */
router.get("/current-user", authMiddelware, currentUserController);

// Export the router
module.exports = router;
