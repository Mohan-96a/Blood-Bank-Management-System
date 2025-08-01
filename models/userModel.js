/**
 * User Model Schema
 * 
 * This file defines the MongoDB schema and model for users in the blood bank system.
 * The schema supports different user types (roles) including admin, organization,
 * donor, and hospital, each with specific required fields.
 */

const mongoose = require("mongoose");

/**
 * User Schema Definition
 * 
 * Defines the structure of user documents in the database with
 * role-specific validation logic for required fields.
 */
const userSchema = new mongoose.Schema(
  {
    // User role - determines permissions and required fields
    role: {
      type: String,
      required: [true, "role is required"],
      enum: ["admin", "organisation", "donar", "hospital"], // Limit to valid roles
    },
    
    // Personal name - required for regular users and admins
    name: {
      type: String,
      required: function () {
        if (this.role === "donar" || this.role === "admin") {
          return true;
        }
        return false;
      },
    },
    
    // Organization name - required only for organization users
    organisationName: {
      type: String,
      required: function () {
        if (this.role === "organisation") {
          return true;
        }
        return false;
      },
    },
    
    // Hospital name - required only for hospital users
    hospitalName: {
      type: String,
      required: function () {
        if (this.role === "hospital") {
          return true;
        }
        return false;
      },
    },
    
    // Email - required for all users, must be unique
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    
    // Password - required for all users
    password: {
      type: String,
      required: [true, "password is required"],
    },
    
    // Website - optional field for organizations/hospitals
    website: {
      type: String,
    },
    
    // Address - required for all users
    address: {
      type: String,
      required: [true, "address is required"],
    },
    
    // Phone number - required for all users
    phone: {
      type: String,
      required: [true, "phone number is required"],
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Export the model with collection name 'users'
module.exports = mongoose.model("users", userSchema);
