@echo off
echo Starting Smansys with MongoDB Atlas...
echo.
echo 1. Make sure you've updated your .env file with your MongoDB Atlas connection string
echo 2. Replace the placeholder <username> and <password> with your actual MongoDB Atlas credentials
echo.
pause
cd frontend
start cmd /k "npm run dev"
cd ../backend
start cmd /k "npm run dev:full"
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5001
echo.
