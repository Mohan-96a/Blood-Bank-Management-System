/**
 * Authentication Controller
 * 
 * This file contains controller functions for user authentication including
 * registration, login, and current user verification.
 */

// Import required models and libraries
const userModel = require("../models/userModel");   // User database model
const bcrypt = require("bcryptjs");                // Password hashing library
const jwt = require("jsonwebtoken");               // JWT token generation library

/**
 * User Registration Controller
 * 
 * Handles new user registration with password hashing.
 * Validates that email is not already in use before creating a new user.
 * 
 * @param {Object} req - Express request object with user data in body
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success/error message and user data
 */
const registerController = async (req, res) => {
  try {
    console.log("Register API called with data:", req.body);
    
    // Validate required fields based on role
    if (!req.body.email || !req.body.password || !req.body.role) {
      return res.status(400).send({
        success: false,
        message: "Email, password and role are required fields",
      });
    }
    
    if (req.body.role === "donar" && !req.body.name) {
      return res.status(400).send({
        success: false,
        message: "Name is required for donor registration",
      });
    }
    
    if (req.body.role === "organisation" && !req.body.organisationName) {
      return res.status(400).send({
        success: false,
        message: "Organisation name is required for organisation registration",
      });
    }
    
    if (req.body.role === "hospital" && !req.body.hospitalName) {
      return res.status(400).send({
        success: false,
        message: "Hospital name is required for hospital registration",
      });
    }
    
    if (!req.body.address || !req.body.phone) {
      return res.status(400).send({
        success: false,
        message: "Address and phone number are required fields",
      });
    }
    
    // Check if user with the same email already exists
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    
    // Return error if user already exists
    if (exisitingUser) {
      return res.status(409).send({
        success: false,
        message: "User with this email already exists",
      });
    }
    
    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    
    // Create and save new user with request data
    const user = new userModel(req.body);
    
    try {
      await user.save();
      console.log("User registered successfully:", user._id);
      
      // Return success response with user data
      return res.status(201).send({
        success: true,
        message: "User Registered Successfully",
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (saveError) {
      console.error("Error saving user:", saveError);
      
      // Handle mongoose validation errors
      if (saveError.name === 'ValidationError') {
        const errorMessages = Object.values(saveError.errors).map(err => err.message);
        return res.status(400).send({
          success: false,
          message: "Validation Error",
          errors: errorMessages
        });
      }
      
      throw saveError; // Rethrow for the main catch block
    }
  } catch (error) {
    console.error("Registration error:", error);
    // Return error response if registration fails
    return res.status(500).send({
      success: false,
      message: "Error in registration process",
      error: error.message
    });
  }
};

/**
 * User Login Controller
 * 
 * Authenticates user by email and password, validates role,
 * and generates JWT token for authenticated sessions.
 * 
 * @param {Object} req - Express request object with login credentials
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success/error message, token and user data
 */
const loginController = async (req, res) => {
  try {
    // Find user by email
    const user = await userModel.findOne({ email: req.body.email });
    
    // Return error if user not found
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    
    // Verify that user role matches requested role
    if (user.role !== req.body.role) {
      return res.status(500).send({
        success: false,
        message: "Role doesn't match",
      });
    }
    
    // Compare provided password with stored hash
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    
    // Return error if password doesn't match
    if (!comparePassword) {
      return res.status(500).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    
    // Generate JWT token with user ID
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // Token expires in 1 day
    });
    
    // Return success response with token and user data
    return res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    // Return error response if login fails
    res.status(500).send({
      success: false,
      message: "Error In Login API",
      error,
    });
  }
};

/**
 * Current User Controller
 * 
 * Retrieves the currently authenticated user's data based on
 * the user ID from the JWT token.
 * 
 * @param {Object} req - Express request object with userId from auth middleware
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success/error message and user data
 */
const currentUserController = async (req, res) => {
  try {
    // Find user by ID from request (set by auth middleware)
    const user = await userModel.findOne({ _id: req.body.userId });
    
    // Return success response with user data
    return res.status(200).send({
      success: true,
      message: "User Fetched Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    // Return error response if fetching user fails
    return res.status(500).send({
      success: false,
      message: "Unable to get current user",
      error,
    });
  }
};

// Export controller functions
module.exports = { registerController, loginController, currentUserController };
