@echo off
echo Cleaning up npm dependencies to resolve installation issues...

echo Cleaning root project dependencies...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo Cleaning client dependencies...
cd client
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo Reinstalling all dependencies...
cd ..
npm install
cd client
npm install

echo All dependencies have been cleaned and reinstalled.
echo.
echo To run the application:
echo 1. Start the server: npm start (in the root directory)
echo 2. Start the client: cd client && npm start
echo.
echo Or use: npm run dev (in the root directory) to start both

pause 