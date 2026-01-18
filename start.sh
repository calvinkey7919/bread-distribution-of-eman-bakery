#!/bin/bash

# Start script for Eman Bakery Distribution System

echo "Starting Eman Bakery Distribution System..."
echo "=========================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -q -r requirements.txt

# Create data directory if it doesn't exist
mkdir -p data

# Start the application
echo "Starting Flask application..."
echo "Access the application at: http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo "=========================================="
python app.py
