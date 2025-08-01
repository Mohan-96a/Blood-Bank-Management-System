@echo off
echo ===============================================
echo Blood Bank Management System - Startup Script
echo ===============================================

:: Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
  echo ERROR: Node.js is not installed or not in your PATH
  echo Please install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

:: Kill any existing processes on the required ports
echo Checking for processes on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
  echo Terminating process with PID: %%a
  taskkill /F /PID %%a >nul 2>&1
)

:: Kill any existing processes on client port
echo Checking for processes on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
  echo Terminating process with PID: %%a
  taskkill /F /PID %%a >nul 2>&1
)

:: First, make sure all dependencies are installed
echo Installing server dependencies...
call npm install

echo Installing client dependencies...
cd client
call npm install
call npm install react-icons@4.12.0 --save
call npm install react-bootstrap@2.7.4 bootstrap@5.3.0 --save
cd ..

:: Start the server
echo Starting the server...
start cmd /k "npm run server"

:: Wait a few seconds for the server to start
echo Waiting for server to start...
timeout /t 5 /nobreak > nul

:: Test if server is running
echo Testing server connection...
curl -s -o nul -w "%%{http_code}" http://localhost:5000/health > temp.txt
set /p status=<temp.txt
del temp.txt

if "%status%" == "200" (
  echo Server is running successfully on port 5000!
) else (
  echo WARNING: Server might not be running correctly.
  echo Please check the server window for errors.
  echo.
  echo Press any key to continue anyway or Ctrl+C to abort...
  pause > nul
)

:: Start the client
echo Starting the client...
cd client
start cmd /k "npm start"

echo ===============================================
echo Blood Bank System started!
echo ===============================================
echo Server: http://localhost:5000
echo Client: http://localhost:3000
echo ===============================================
echo If you encounter "Network Error" during login/registration:
echo 1. Make sure the server window shows no errors
echo 2. Try opening http://localhost:5000/health in your browser
echo    to verify server connectivity
echo 3. If all else fails, try restarting your computer
echo    to free up any blocked ports
echo ===============================================

pause 