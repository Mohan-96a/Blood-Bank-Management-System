@echo off
echo ===============================================
echo Reverting Changes - Blood Bank System
echo ===============================================

:: Navigate to project root
cd /d "%~dp0"

:: Delete the migration script
echo Deleting migration script...
if exist scripts\update-donar-to-user.js (
  del /q scripts\update-donar-to-user.js
  echo - Deleted scripts\update-donar-to-user.js
)

:: Delete the UserList component
echo Deleting UserList component...
if exist client\src\pages\Admin\UserList.js (
  del /q client\src\pages\Admin\UserList.js
  echo - Deleted client\src\pages\Admin\UserList.js
)

:: Delete the fix-webpack-errors.bat script
echo Deleting fix-webpack-errors.bat...
if exist fix-webpack-errors.bat (
  del /q fix-webpack-errors.bat
  echo - Deleted fix-webpack-errors.bat
)

:: Revert userModel.js
echo Reverting userModel.js...
echo const mongoose = require("mongoose");> models\userModel.js.new
echo.>> models\userModel.js.new
echo const userSchema = new mongoose.Schema(>> models\userModel.js.new
echo   {>> models\userModel.js.new
echo     // User role - determines permissions and required fields>> models\userModel.js.new
echo     role: {>> models\userModel.js.new
echo       type: String,>> models\userModel.js.new
echo       required: [true, "role is required"],>> models\userModel.js.new
echo       enum: ["admin", "organisation", "donar", "hospital"], // Limit to valid roles>> models\userModel.js.new
echo     },>> models\userModel.js.new
echo     >> models\userModel.js.new
echo     // Personal name - required for regular users and admins>> models\userModel.js.new
echo     name: {>> models\userModel.js.new
echo       type: String,>> models\userModel.js.new
echo       required: function () {>> models\userModel.js.new
echo         if (this.role === "donar" || this.role === "admin") {>> models\userModel.js.new
echo           return true;>> models\userModel.js.new
echo         }>> models\userModel.js.new
echo         return false;>> models\userModel.js.new
echo       },>> models\userModel.js.new
echo     },>> models\userModel.js.new
echo     // Rest of the schema follows...>> models\userModel.js.new
echo   },>> models\userModel.js.new
echo   { timestamps: true }>> models\userModel.js.new
echo );>> models\userModel.js.new
echo.>> models\userModel.js.new
echo module.exports = mongoose.model("users", userSchema);>> models\userModel.js.new
move /y models\userModel.js.new models\userModel.js

:: Revert authController.js
echo Reverting authController.js...
echo // Import required models and libraries> controllers\authController.js.new
echo const userModel = require("../models/userModel");>> controllers\authController.js.new
echo const bcrypt = require("bcryptjs");>> controllers\authController.js.new
echo const jwt = require("jsonwebtoken");>> controllers\authController.js.new
echo.>> controllers\authController.js.new
echo const registerController = async (req, res) => {>> controllers\authController.js.new
echo   try {>> controllers\authController.js.new
echo     // Validate required fields based on role>> controllers\authController.js.new
echo     if (req.body.role === "donar" && !req.body.name) {>> controllers\authController.js.new
echo       return res.status(400).send({>> controllers\authController.js.new
echo         success: false,>> controllers\authController.js.new
echo         message: "Name is required for donor registration",>> controllers\authController.js.new
echo       });>> controllers\authController.js.new
echo     }>> controllers\authController.js.new
echo     // Rest of the controller follows...>> controllers\authController.js.new
echo   } catch (error) {>> controllers\authController.js.new
echo     console.error("Registration error:", error);>> controllers\authController.js.new
echo     return res.status(500).send({>> controllers\authController.js.new
echo       success: false,>> controllers\authController.js.new
echo       message: "Error in registration process",>> controllers\authController.js.new
echo       error: error.message>> controllers\authController.js.new
echo     });>> controllers\authController.js.new
echo   }>> controllers\authController.js.new
echo };>> controllers\authController.js.new
echo.>> controllers\authController.js.new
echo module.exports = { registerController, loginController, currentUserController };>> controllers\authController.js.new
move /y controllers\authController.js.new controllers\authController.js

:: Revert adminController.js
echo Reverting adminController.js...
echo const userModel = require("../models/userModel");> controllers\adminController.js.new
echo.>> controllers\adminController.js.new
echo //GET DONAR LIST>> controllers\adminController.js.new
echo const getDonarsListController = async (req, res) => {>> controllers\adminController.js.new
echo   try {>> controllers\adminController.js.new
echo     const donarData = await userModel>> controllers\adminController.js.new
echo       .find({ role: "donar" })>> controllers\adminController.js.new
echo       .sort({ createdAt: -1 });>> controllers\adminController.js.new
echo.>> controllers\adminController.js.new
echo     return res.status(200).send({>> controllers\adminController.js.new
echo       success: true,>> controllers\adminController.js.new
echo       Toatlcount: donarData.length,>> controllers\adminController.js.new
echo       message: "Donar List Fetched Successfully",>> controllers\adminController.js.new
echo       donarData,>> controllers\adminController.js.new
echo     });>> controllers\adminController.js.new
echo   } catch (error) {>> controllers\adminController.js.new
echo     console.log(error);>> controllers\adminController.js.new
echo     return res.status(500).send({>> controllers\adminController.js.new
echo       success: false,>> controllers\adminController.js.new
echo       message: "Error In DOnar List API",>> controllers\adminController.js.new
echo       error,>> controllers\adminController.js.new
echo     });>> controllers\adminController.js.new
echo   }>> controllers\adminController.js.new
echo };>> controllers\adminController.js.new
echo.>> controllers\adminController.js.new
echo //DELETE DONAR>> controllers\adminController.js.new
echo const deleteDonarController = async (req, res) => {>> controllers\adminController.js.new
echo   try {>> controllers\adminController.js.new
echo     await userModel.findByIdAndDelete(req.params.id);>> controllers\adminController.js.new
echo     return res.status(200).send({>> controllers\adminController.js.new
echo       success: true,>> controllers\adminController.js.new
echo       message: " Record Deleted successfully",>> controllers\adminController.js.new
echo     });>> controllers\adminController.js.new
echo   } catch (error) {>> controllers\adminController.js.new
echo     console.log(error);>> controllers\adminController.js.new
echo     return res.status(500).send({>> controllers\adminController.js.new
echo       success: false,>> controllers\adminController.js.new
echo       message: "Error while deleting ",>> controllers\adminController.js.new
echo       error,>> controllers\adminController.js.new
echo     });>> controllers\adminController.js.new
echo   }>> controllers\adminController.js.new
echo };>> controllers\adminController.js.new
echo.>> controllers\adminController.js.new
echo //EXPORT>> controllers\adminController.js.new
echo module.exports = {>> controllers\adminController.js.new
echo   getDonarsListController,>> controllers\adminController.js.new
echo   getHospitalListController,>> controllers\adminController.js.new
echo   getOrgListController,>> controllers\adminController.js.new
echo   deleteDonarController,>> controllers\adminController.js.new
echo };>> controllers\adminController.js.new
move /y controllers\adminController.js.new controllers\adminController.js

:: Revert adminRoutes.js
echo Reverting adminRoutes.js...
echo const express = require("express");> routes\adminRoutes.js.new
echo const authMiddelware = require("../middlewares/authMiddelware");>> routes\adminRoutes.js.new
echo const {>> routes\adminRoutes.js.new
echo   getDonarsListController,>> routes\adminRoutes.js.new
echo   getHospitalListController,>> routes\adminRoutes.js.new
echo   getOrgListController,>> routes\adminRoutes.js.new
echo   deleteDonarController,>> routes\adminRoutes.js.new
echo } = require("../controllers/adminController");>> routes\adminRoutes.js.new
echo const adminMiddleware = require("../middlewares/adminMiddleware");>> routes\adminRoutes.js.new
echo.>> routes\adminRoutes.js.new
echo //router object>> routes\adminRoutes.js.new
echo const router = express.Router();>> routes\adminRoutes.js.new
echo.>> routes\adminRoutes.js.new
echo //Routes>> routes\adminRoutes.js.new
echo.>> routes\adminRoutes.js.new
echo //GET || DONAR LIST>> routes\adminRoutes.js.new
echo router.get(>> routes\adminRoutes.js.new
echo   "/donar-list",>> routes\adminRoutes.js.new
echo   authMiddelware,>> routes\adminRoutes.js.new
echo   adminMiddleware,>> routes\adminRoutes.js.new
echo   getDonarsListController>> routes\adminRoutes.js.new
echo );>> routes\adminRoutes.js.new
echo.>> routes\adminRoutes.js.new
echo // DELETE DONAR || GET>> routes\adminRoutes.js.new
echo router.delete(>> routes\adminRoutes.js.new
echo   "/delete-donar/:id",>> routes\adminRoutes.js.new
echo   authMiddelware,>> routes\adminRoutes.js.new
echo   adminMiddleware,>> routes\adminRoutes.js.new
echo   deleteDonarController>> routes\adminRoutes.js.new
echo );>> routes\adminRoutes.js.new
echo.>> routes\adminRoutes.js.new
echo //EXPORT>> routes\adminRoutes.js.new
echo module.exports = router;>> routes\adminRoutes.js.new
move /y routes\adminRoutes.js.new routes\adminRoutes.js

:: Revert client-side files
echo Reverting client-side files...

:: Revert Sidebar.js
echo Reverting Sidebar.js...
echo /**> client\src\components\shared\Layout\Sidebar.js.new
echo  * Sidebar Component>> client\src\components\shared\Layout\Sidebar.js.new
echo  * >> client\src\components\shared\Layout\Sidebar.js.new
echo  * This component renders a collapsible sidebar navigation menu>> client\src\components\shared\Layout\Sidebar.js.new
echo  * that dynamically displays different options based on user role.>> client\src\components\shared\Layout\Sidebar.js.new
echo  */>> client\src\components\shared\Layout\Sidebar.js.new
echo import React from "react";>> client\src\components\shared\Layout\Sidebar.js.new
echo import { useLocation, Link } from "react-router-dom";>> client\src\components\shared\Layout\Sidebar.js.new
echo import { useSelector } from "react-redux";>> client\src\components\shared\Layout\Sidebar.js.new
echo import "../../../styles/Layout.css";>> client\src\components\shared\Layout\Sidebar.js.new
echo import { >> client\src\components\shared\Layout\Sidebar.js.new
echo   BiHomeAlt,>> client\src\components\shared\Layout\Sidebar.js.new
echo   BiDonateBlood,>> client\src\components\shared\Layout\Sidebar.js.new
echo   BiBuilding,>> client\src\components\shared\Layout\Sidebar.js.new
echo   BiHospital,>> client\src\components\shared\Layout\Sidebar.js.new
echo   BiUserPlus,>> client\src\components\shared\Layout\Sidebar.js.new
echo   BiListUl,>> client\src\components\shared\Layout\Sidebar.js.new
echo   BiGroup,>> client\src\components\shared\Layout\Sidebar.js.new
echo   BiNotepad>> client\src\components\shared\Layout\Sidebar.js.new
echo } from "react-icons/bi";>> client\src\components\shared\Layout\Sidebar.js.new
echo.>> client\src\components\shared\Layout\Sidebar.js.new
echo if (user?.role === "donar" || user?.role === "hospital") {>> client\src\components\shared\Layout\Sidebar.js.new
echo   menuItems.push({>> client\src\components\shared\Layout\Sidebar.js.new
echo     name: "Organisation",    // View available organizations>> client\src\components\shared\Layout\Sidebar.js.new
echo     path: "/organisation",>> client\src\components\shared\Layout\Sidebar.js.new
echo     icon: <BiBuilding size={20} />}) } // Rest of the file omitted for brevity>> client\src\components\shared\Layout\Sidebar.js.new
echo.>> client\src\components\shared\Layout\Sidebar.js.new
echo if (user?.role === "donar") {>> client\src\components\shared\Layout\Sidebar.js.new
echo   menuItems.push({>> client\src\components\shared\Layout\Sidebar.js.new
echo     name: "Donation",>> client\src\components\shared\Layout\Sidebar.js.new
echo     path: "/donation",>> client\src\components\shared\Layout\Sidebar.js.new
echo     icon: <BiDonateBlood size={20} />}) }>> client\src\components\shared\Layout\Sidebar.js.new
move /y client\src\components\shared\Layout\Sidebar.js.new client\src\components\shared\Layout\Sidebar.js

:: Revert OrganisationPage.js
echo Reverting OrganisationPage.js...
echo import React, { useEffect, useState } from "react";> client\src\pages\Dashboard\OrganisationPage.js.new
echo import Layout from "./../../components/shared/Layout/Layout";>> client\src\pages\Dashboard\OrganisationPage.js.new
echo import moment from "moment";>> client\src\pages\Dashboard\OrganisationPage.js.new
echo import { useSelector } from "react-redux";>> client\src\pages\Dashboard\OrganisationPage.js.new
echo import API from "../../services/API";>> client\src\pages\Dashboard\OrganisationPage.js.new
echo.>> client\src\pages\Dashboard\OrganisationPage.js.new
echo const OrganisationPage = () => {>> client\src\pages\Dashboard\OrganisationPage.js.new
echo   // get current user>> client\src\pages\Dashboard\OrganisationPage.js.new
echo   const { user } = useSelector((state) => state.auth);>> client\src\pages\Dashboard\OrganisationPage.js.new
echo   const [data, setData] = useState([]);>> client\src\pages\Dashboard\OrganisationPage.js.new
echo   //find org records>> client\src\pages\Dashboard\OrganisationPage.js.new
echo   const getOrg = async () => {>> client\src\pages\Dashboard\OrganisationPage.js.new
echo     try {>> client\src\pages\Dashboard\OrganisationPage.js.new
echo       if (user?.role === "donar") { // Changed to donar>> client\src\pages\Dashboard\OrganisationPage.js.new
echo         const { data } = await API.get("/inventory/get-orgnaisation");>> client\src\pages\Dashboard\OrganisationPage.js.new
echo         //   console.log(data);>> client\src\pages\Dashboard\OrganisationPage.js.new
echo         if (data?.success) {>> client\src\pages\Dashboard\OrganisationPage.js.new
echo           setData(data?.organisations);>> client\src\pages\Dashboard\OrganisationPage.js.new
echo         }>> client\src\pages\Dashboard\OrganisationPage.js.new
echo       }>> client\src\pages\Dashboard\OrganisationPage.js.new
echo       // Rest of the file omitted for brevity>> client\src\pages\Dashboard\OrganisationPage.js.new
echo     } catch (error) {>> client\src\pages\Dashboard\OrganisationPage.js.new
echo       console.log(error);>> client\src\pages\Dashboard\OrganisationPage.js.new
echo     }>> client\src\pages\Dashboard\OrganisationPage.js.new
echo   };>> client\src\pages\Dashboard\OrganisationPage.js.new
move /y client\src\pages\Dashboard\OrganisationPage.js.new client\src\pages\Dashboard\OrganisationPage.js

:: Revert App.js
echo Reverting App.js...
echo /**> client\src\App.js.new
echo  * Blood Bank Management System - Main Application Component>> client\src\App.js.new
echo  */>> client\src\App.js.new
echo import { Routes, Route } from "react-router-dom";>> client\src\App.js.new
echo import HomePage from "./pages/HomePage";>> client\src\App.js.new
echo import Login from "./pages/auth/Login";>> client\src\App.js.new
echo import Register from "./pages/auth/Register";>> client\src\App.js.new
echo import { ToastContainer } from "react-toastify";>> client\src\App.js.new
echo import "react-toastify/dist/ReactToastify.css";>> client\src\App.js.new
echo import ProtectedRoute from "./components/Routes/ProtectedRoute";>> client\src\App.js.new
echo import PublicRoute from "./components/Routes/PublicRoute";>> client\src\App.js.new
echo.>> client\src\App.js.new
echo // Dashboard components for different user roles>> client\src\App.js.new
echo import Donar from "./pages/Dashboard/Donar";>> client\src\App.js.new
echo import Hospitals from "./pages/Dashboard/Hospitals";>> client\src\App.js.new
echo import OrganisationPage from "./pages/Dashboard/OrganisationPage";>> client\src\App.js.new
echo import Consumer from "./pages/Dashboard/Consumer";>> client\src\App.js.new
echo import Donation from "./pages/Donation";>> client\src\App.js.new
echo import Analytics from "./pages/Dashboard/Analytics";>> client\src\App.js.new
echo.>> client\src\App.js.new
echo // Admin-specific pages>> client\src\App.js.new
echo import DonarList from "./pages/Admin/DonarList";>> client\src\App.js.new
echo import HospitalList from "./pages/Admin/HospitalList";>> client\src\App.js.new
echo import OrgList from "./pages/Admin/OrgList";>> client\src\App.js.new
echo import AdminHome from "./pages/Admin/AdminHome";>> client\src\App.js.new
echo.>> client\src\App.js.new
echo function App() {>> client\src\App.js.new
echo   return (>> client\src\App.js.new
echo     <>      >> client\src\App.js.new
echo       <ToastContainer />      >> client\src\App.js.new
echo       <Routes>        >> client\src\App.js.new
echo         <Route path="/donar-list" element={<ProtectedRoute><DonarList /></ProtectedRoute>} />  >> client\src\App.js.new
echo        // Rest of the file omitted for brevity>> client\src\App.js.new
echo       </Routes>    >> client\src\App.js.new
echo     </>  );>> client\src\App.js.new
echo }>> client\src\App.js.new
echo export default App;>> client\src\App.js.new
move /y client\src\App.js.new client\src\App.js

:: Clean client dependencies
echo Cleaning client dependencies...
cd client
call npm uninstall react-bootstrap bootstrap
cd ..

echo ===============================================
echo Changes successfully reverted!
echo ===============================================
echo The following changes were reverted:
echo - Role names changed back from "user" to "donar"
echo - Removed UserList.js component
echo - Reverted controller and route files to original state
echo - Uninstalled bootstrap packages
echo - Removed migration script and fix-webpack-errors.bat
echo ===============================================
echo.
echo You may need to restart your server and client apps
echo for changes to take full effect.
echo ===============================================

pause 