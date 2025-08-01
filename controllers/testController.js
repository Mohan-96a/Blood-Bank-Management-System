/**
 * Test Controllers
 * 
 * Contains test endpoints to verify API functionality
 */

// Simple test endpoint to verify API is running
const testController = (req, res) => {
  res.status(200).send({
    message: "API is operational",
    success: true,
    server: "Blood Bank API",
    timestamp: new Date().toISOString()
  });
};

// Test endpoint for registration form data validation
const testRegisterController = (req, res) => {
  try {
    // Log the received data
    console.log("Test register API called with data:", req.body);
    
    // Send back the received data for verification
    res.status(200).send({
      message: "Registration test successful",
      success: true,
      receivedData: req.body
    });
  } catch (error) {
    console.error("Test registration error:", error);
    res.status(500).send({
      message: "Test registration failed",
      success: false,
      error: error.message
    });
  }
};

module.exports = { testController, testRegisterController };
