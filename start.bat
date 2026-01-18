@echo off
REM Start script for Eman Bakery Distribution System (Windows)

echo Starting Eman Bakery Distribution System...
echo ==========================================

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -q -r requirements.txt

REM Create data directory if it doesn't exist
if not exist "data\" mkdir data

REM Set Flask debug mode for development
set FLASK_DEBUG=true

REM Start the application
echo Starting Flask application...
echo Access the application at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo ==========================================
python app.py
