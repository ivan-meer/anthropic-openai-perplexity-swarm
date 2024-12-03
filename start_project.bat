@echo off
start cmd /k "python app.py"
cd frontend
start cmd /k "npm start"
