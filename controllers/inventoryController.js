/**
 * Inventory Controller
 * 
 * This file contains controller functions for managing blood inventory operations
 * including creating inventory records, retrieving records, and managing relationships
 * between donors, hospitals, and organizations.
 */

const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");  // Blood inventory model
const userModel = require("../models/userModel");            // User model for relationships

/**
 * Create Inventory Controller
 * 
 * Handles the creation of new blood inventory records (donations or usage).
 * For outgoing inventory, validates blood availability before allowing transaction.
 * 
 * @param {Object} req - Express request object with inventory data
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success/error message
 */
const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User Not Found");
    }
    
    // Role validation - commented out in original code
    // if (inventoryType === "in" && user.role !== "donar") {
    //   throw new Error("Not a donar account");
    // }
    // if (inventoryType === "out" && user.role !== "hospital") {
    //   throw new Error("Not a hospital");
    // }

    // Special handling for blood outflow (consumption)
    if (req.body.inventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.userId);
      
      // Calculate total blood inflow for the requested blood group
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;
      
      // Calculate total blood outflow for the requested blood group
      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      // Calculate available blood quantity
      const availableQuanityOfBloodGroup = totalIn - totalOut;
      
      // Validate requested quantity is available
      if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      
      // Set hospital reference
      req.body.hospital = user?._id;
    } else {
      // For blood inflow (donation), set donor reference
      req.body.donar = user?._id;
    }

    // Create and save the inventory record
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    
    return res.status(201).send({
      success: true,
      message: "New Blood Record Added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Create Inventory API",
      error,
    });
  }
};

/**
 * Get All Inventory Controller
 * 
 * Retrieves all blood inventory records for an organization with 
 * populated donor and hospital details, sorted by most recent.
 * 
 * @param {Object} req - Express request object with userId for organization
 * @param {Object} res - Express response object
 * @returns {Object} - Response with inventory records
 */
const getInventoryController = async (req, res) => {
  try {
    // Find inventory records for the organization
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .populate("donar")      // Include donor details
      .populate("hospital")   // Include hospital details
      .sort({ createdAt: -1 });  // Most recent first
    
    return res.status(200).send({
      success: true,
      message: "Get all records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get All Inventory",
      error,
    });
  }
};

/**
 * Get Hospital Inventory Controller
 * 
 * Retrieves blood records for hospitals based on filters with
 * populated details of related entities.
 * 
 * @param {Object} req - Express request object with filters
 * @param {Object} res - Express response object
 * @returns {Object} - Response with filtered inventory records
 */
const getInventoryHospitalController = async (req, res) => {
  try {
    // Find inventory records based on provided filters
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donar")       // Include donor details
      .populate("hospital")    // Include hospital details
      .populate("organisation") // Include organization details
      .sort({ createdAt: -1 });  // Most recent first
    
    return res.status(200).send({
      success: true,
      message: "Get hospital consumer records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get consumer Inventory",
      error,
    });
  }
};

/**
 * Get Recent Inventory Controller
 * 
 * Retrieves the 3 most recent blood inventory records for an organization.
 * Used for dashboard displays and quick summaries.
 * 
 * @param {Object} req - Express request object with userId for organization
 * @param {Object} res - Express response object
 * @returns {Object} - Response with recent inventory records
 */
const getRecentInventoryController = async (req, res) => {
  try {
    // Find the 3 most recent inventory records
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .limit(3)  // Only return 3 records
      .sort({ createdAt: -1 });  // Most recent first
    
    return res.status(200).send({
      success: true,
      message: "Recent Inventory Data",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Recent Inventory API",
      error,
    });
  }
};

/**
 * Get Donors Controller
 * 
 * Retrieves all unique donors who have contributed to an organization.
 * Uses MongoDB's distinct operation for efficiency.
 * 
 * @param {Object} req - Express request object with userId for organization
 * @param {Object} res - Express response object
 * @returns {Object} - Response with donor records
 */
const getDonarsController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    
    // Find unique donor IDs from inventory records
    const donorId = await inventoryModel.distinct("donar", {
      organisation,
    });
    
    // Retrieve full donor details for the IDs
    const donars = await userModel.find({ _id: { $in: donorId } });

    return res.status(200).send({
      success: true,
      message: "Donor Records Fetched Successfully",
      donars,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Donor records",
      error,
    });
  }
};

/**
 * Get Hospitals Controller
 * 
 * Retrieves all unique hospitals that have received blood from an organization.
 * Uses MongoDB's distinct operation for efficiency.
 * 
 * @param {Object} req - Express request object with userId for organization
 * @param {Object} res - Express response object
 * @returns {Object} - Response with hospital records
 */
const getHospitalController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    
    // Find unique hospital IDs from inventory records
    const hospitalId = await inventoryModel.distinct("hospital", {
      organisation,
    });
    
    // Retrieve full hospital details for the IDs
    const hospitals = await userModel.find({
      _id: { $in: hospitalId },
    });

    return res.status(200).send({
      success: true,
      message: "Hospitals Data Fetched Successfully",
      hospitals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In get Hospital API",
      error,
    });
  }
};

/**
 * Get Organizations for Donor Controller
 * 
 * Retrieves all organizations that a donor has contributed blood to.
 * Helps donors track which organizations they've interacted with.
 * 
 * @param {Object} req - Express request object with userId for donor
 * @param {Object} res - Express response object
 * @returns {Object} - Response with organization records
 */
const getOrgnaisationController = async (req, res) => {
  try {
    const donar = req.body.userId;
    
    // Find unique organization IDs from inventory records
    const orgId = await inventoryModel.distinct("organisation", { donar });
    
    // Retrieve full organization details
    const organisations = await userModel.find({
      _id: { $in: orgId },
    });
    
    return res.status(200).send({
      success: true,
      message: "Org Data Fetched Successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In ORG API",
      error,
    });
  }
};

/**
 * Get Organizations for Hospital Controller
 * 
 * Retrieves all organizations that a hospital has received blood from.
 * Helps hospitals track their blood suppliers.
 * 
 * @param {Object} req - Express request object with userId for hospital
 * @param {Object} res - Express response object
 * @returns {Object} - Response with organization records
 */
const getOrgnaisationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;
    
    // Find unique organization IDs from inventory records
    const orgId = await inventoryModel.distinct("organisation", { hospital });
    
    // Retrieve full organization details
    const organisations = await userModel.find({
      _id: { $in: orgId },
    });
    
    return res.status(200).send({
      success: true,
      message: "Hospital Org Data Fetched Successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Hospital ORG API",
      error,
    });
  }
};

/**
 * Export Controller Functions
 * 
 * Export all inventory-related controller functions for use in routes.
 */
module.exports = {
  createInventoryController,        // Create new inventory record
  getInventoryController,           // Get all inventory for an organization
  getDonarsController,              // Get all donors for an organization
  getHospitalController,            // Get all hospitals for an organization
  getOrgnaisationController,        // Get organizations for a donor
  getOrgnaisationForHospitalController, // Get organizations for a hospital
  getInventoryHospitalController,   // Get inventory for a hospital
  getRecentInventoryController,     // Get recent inventory records
};
