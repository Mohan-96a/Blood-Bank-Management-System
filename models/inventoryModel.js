/**
 * Inventory Model Schema
 * 
 * This file defines the MongoDB schema and model for blood inventory transactions.
 * It tracks blood donations (in) and usage (out) with relationships to donors,
 * hospitals, and organizations.
 */

const mongoose = require("mongoose");

/**
 * Inventory Schema Definition
 * 
 * Defines the structure of blood inventory transactions including:
 * - Transaction type (in = donation, out = usage)
 * - Blood details (group, quantity)
 * - Related entities (organization, donor, hospital)
 */
const inventorySchema = new mongoose.Schema(
  {
    // Transaction type - whether blood is coming in (donation) or going out (consumption)
    inventoryType: {
      type: String,
      required: [true, "inventory type require"],
      enum: ["in", "out"],  // Limited to donation or consumption
    },
    
    // Blood group type
    bloodGroup: {
      type: String,
      required: [true, "blood group is require"],
      enum: ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"],  // Valid blood types
    },
    
    // Amount of blood in units
    quantity: {
      type: Number,
      require: [true, "blood quantity is require"],
    },
    
    // Email of the donor or hospital contact
    email: {
      type: String,
      required: [true, "Email is Required"],
    },
    
    // Reference to the organization managing this blood inventory
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",  // References the users collection
      required: [true, "organisation is require"],
    },
    
    // Reference to the hospital receiving blood - only required for 'out' transactions
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",  // References the users collection
      required: function () {
        return this.inventoryType === "out";  // Only required when blood is going out
      },
    },
    
    // Reference to the donor giving blood - only required for 'in' transactions
    donar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",  // References the users collection
      required: function () {
        return this.inventoryType === "in";  // Only required when blood is coming in
      },
    },
  },
  { timestamps: true }  // Automatically add createdAt and updatedAt timestamps
);

// Export the model with collection name 'Inventory'
module.exports = mongoose.model("Inventory", inventorySchema);
