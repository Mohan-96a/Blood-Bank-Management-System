@echo off
echo Starting Blood Bank MERN Stack Project...

:: Check for running server on port 5000
netstat -an | findstr /C:"127.0.0.1:5000" /C:"0.0.0.0:5000" > nul
if %errorlevel% equ 0 (
  echo Server is already running on port 5000
) else (
  echo Starting server...
  start cmd /k "node server.js"
  echo Waiting for server to start...
  timeout /t 5 /nobreak > nul
)

:: Check server health
echo Checking server health...
curl http://localhost:5000/health
if %errorlevel% neq 0 (
  echo Server health check failed. Please check server logs.
  echo Continuing anyway...
)

:: Install react-icons
echo Ensuring react-icons is installed...
cd client
call npm install react-icons@4.12.0 --save

:: Start client
echo Starting client...
start cmd /k "npm start"

echo Both server and client should now be running.
echo Server: http://localhost:5000
echo Client: http://localhost:5001

pause 