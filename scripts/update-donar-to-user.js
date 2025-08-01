/**
 * Database Migration Script
 * 
 * This script updates the "donar" role to "user" role in the database
 * Run with: node scripts/update-donar-to-user.js
 */

// Load environment variables
require('dotenv').config();

// Import mongoose
const mongoose = require('mongoose');
const userModel = require('../models/userModel');

// Connect to the database
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to database'))
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

// Function to update the role
async function updateRoles() {
  try {
    console.log('Starting role migration from "donar" to "user"...');
    
    // Find all users with role "donar"
    const donars = await userModel.find({ role: 'donar' });
    console.log(`Found ${donars.length} users with role "donar"`);
    
    // Update all users with role "donar" to "user"
    const result = await userModel.updateMany(
      { role: 'donar' },
      { $set: { role: 'user' } }
    );
    
    console.log(`Updated ${result.modifiedCount} users from role "donar" to "user"`);
    
    // Verify the update
    const remainingDonars = await userModel.countDocuments({ role: 'donar' });
    const newUsers = await userModel.countDocuments({ role: 'user' });
    
    console.log('Migration complete:');
    console.log(`- Remaining users with role "donar": ${remainingDonars}`);
    console.log(`- Users with role "user": ${newUsers}`);
    
    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error during migration:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Run the update
updateRoles(); 