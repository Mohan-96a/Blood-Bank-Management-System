/**
 * Blood Bank Management System - Server Entry Point
 * 
 * This file sets up the Express server, connects to MongoDB,
 * configures middleware, and defines API routes for the application.
 * 
 * The server handles authentication, inventory management, analytics,
 * and administrative operations for the blood bank system.
 */

// Import external dependencies
const express = require("express");  // Web framework
const dotenv = require("dotenv");    // Environment variable management
const colors = require("colors");    // Console text styling
const morgan = require("morgan");    // HTTP request logger
const cors = require("cors");        // Cross-Origin Resource Sharing

// Import local modules
const connectDB = require("./config/db");  // Database connection function

// Load environment variables from .env file
dotenv.config();

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV !== 'production';

// Validate required environment variables
const requiredEnvVars = ['MONGO_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please check your environment configuration.');
  if (isDevelopment) {
    console.error('Make sure your .env file exists and contains all required variables.');
  } else {
    console.error('Please set these variables in your deployment platform (Render).');
  }
  process.exit(1);
}

// Initialize MongoDB connection
console.log('Attempting to connect to MongoDB...');
connectDB();

// Create Express application instance
const app = express();

// Configure middleware
app.use(express.json());             // Parse JSON request bodies
app.use(morgan("dev"));             // Log HTTP requests in development mode

// Configure CORS based on environment
if (isDevelopment) {
  // In development, allow all origins for easier testing
  app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true
  }));
  console.log("CORS: Allowing all origins (development mode)");
} else {
  // In production, use specific allowed origins
  const allowedOrigins = [
    "http://localhost:3000", 
    "http://localhost:5001", 
    "http://127.0.0.1:3000", 
    "http://127.0.0.1:5001",
    "https://bloodbankmanagementsystem1.netlify.app", // Netlify frontend URL
    process.env.FRONTEND_URL // Add production frontend URL from env
  ].filter(Boolean); // Remove undefined values

  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Log the origin for debugging
      console.log(`Request from origin: ${origin}`);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true
  }));
  console.log("CORS: Using restricted origins (production mode)");
}

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Define API routes
// Test route for checking API connectivity
app.use("/api/v1/test", require("./routes/testRoutes"));
// Authentication routes (login, register, etc.)
app.use("/api/v1/auth", require("./routes/authRoutes"));
// Blood inventory management routes
app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));
// Data analytics and reporting routes
app.use("/api/v1/analytics", require("./routes/analyticsRoutes"));
// Admin-specific routes for system management
app.use("/api/v1/admin", require("./routes/adminRoutes"));

// Add a basic health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Add a root route to handle base URL requests
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Blood Bank Management System API",
    version: "1.0.0",
    status: "Server is running",
    endpoints: {
      health: "/health",
      test: "/api/v1/test",
      auth: "/api/v1/auth",
      inventory: "/api/v1/inventory",
      analytics: "/api/v1/analytics",
      admin: "/api/v1/admin"
    },
    timestamp: new Date().toISOString(),
  });
});

// Handle 404 errors for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    requestedUrl: req.originalUrl,
    availableEndpoints: [
      "/",
      "/health",
      "/api/v1/test",
      "/api/v1/auth",
      "/api/v1/inventory", 
      "/api/v1/analytics",
      "/api/v1/admin"
    ]
  });
});

// Set server port from environment variables or use default
const PORT = process.env.PORT || 5000;

// Start the server and listen on configured port
const server = app.listen(PORT, () => {
  console.log(
    `Node Server Running In ${process.env.NODE_ENV || 'development'} Mode On Port ${PORT}`
      .bgBlue.white
  );
  console.log(`Server URL: http://localhost:${PORT}`);
  console.log('Environment variables loaded successfully');
  console.log('CORS configuration applied');
  console.log('All routes configured');
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => {
    process.exit(1);
  });
});
