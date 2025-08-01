/**
 * Test Routes
 * 
 * Defines API routes for testing API functionality
 */

const express = require("express");
const { testController, testRegisterController } = require("../controllers/testController");

// Router instance
const router = express.Router();

// GET test endpoint to check if API is running
router.get("/", testController);

// POST test endpoint to check registration data
router.post("/register", testRegisterController);

// Export router
module.exports = router;
