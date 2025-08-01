@echo off
echo Resetting and restarting Blood Bank Client Application...

cd client

echo Removing node_modules and package-lock.json...
rmdir /s /q node_modules
del package-lock.json

echo Reinstalling all dependencies...
npm install

echo Installing react-icons specifically...
npm install react-icons@4.12.0 --save

echo Starting application...
npm start

pause 