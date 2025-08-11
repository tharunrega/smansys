@echo off
echo Starting Smansys Demo...
echo.
cd frontend
start cmd /k "npm run dev"
cd ../backend
start cmd /k "npm run dev"
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5001
echo.
echo Demo accounts:
echo - Admin:   admin@example.com / password
echo - Manager: manager@example.com / password
echo - User:    user@example.com / password
