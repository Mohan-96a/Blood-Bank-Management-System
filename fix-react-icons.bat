@echo off
echo Fixing react-icons installation issues...

cd client

echo Removing react-icons from node_modules...
rmdir /s /q node_modules\react-icons

echo Installing react-icons version 4.12.0...
npm install react-icons@4.12.0 --save

echo React-icons fixed! You can now start the application.
echo.
echo To start the application, run: npm start
echo.

pause 