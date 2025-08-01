const express = require("express");
const authMiddelware = require("../middlewares/authMiddelware");
const {
  getUsersListController,
  getHospitalListController,
  getOrgListController,
  deleteUserController,
} = require("../controllers/adminController");
const adminMiddleware = require("../middlewares/adminMiddleware");

//router object
const router = express.Router();

//Routes

//GET || USER LIST
router.get(
  "/user-list",
  authMiddelware,
  adminMiddleware,
  getUsersListController
);
//GET || HOSPITAL LIST
router.get(
  "/hospital-list",
  authMiddelware,
  adminMiddleware,
  getHospitalListController
);
//GET || ORG LIST
router.get("/org-list", authMiddelware, adminMiddleware, getOrgListController);
// ==========================

// DELETE USER || DELETE
router.delete(
  "/delete-user/:id",
  authMiddelware,
  adminMiddleware,
  deleteUserController
);

//EXPORT
module.exports = router;
