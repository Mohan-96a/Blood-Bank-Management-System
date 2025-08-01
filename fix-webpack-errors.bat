@echo off
echo ===============================================
echo Fixing Webpack Errors - Blood Bank System
echo ===============================================

:: Navigate to client directory
cd client

:: Clean npm cache
echo Cleaning npm cache...
call npm cache clean --force

:: Install required dependencies
echo Installing missing dependencies...
call npm install react-bootstrap bootstrap --save

:: Verify imports in client code
echo Fixed the Spinner imports in Form component
echo Fixed the BiHospital icon in Sidebar.js (replaced with FaHospital from react-icons/fa)

:: Role consistency fixes
echo Fixed role inconsistency issues:
echo - Updated references from "donar" to "user" in the codebase
echo - Created new migration script scripts/update-donar-to-user.js
echo - Updated UserList component to match new naming convention
echo - Updated API routes and controllers to match new role names

:: Start the application
echo ===============================================
echo Fixed webpack errors. Starting the application...
echo ===============================================
call npm start

pause 