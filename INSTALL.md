# Installation Guide

## Quick Start

### For Linux/Mac Users

1. Open terminal and navigate to the project directory
2. Run the start script:
   ```bash
   ./start.sh
   ```

### For Windows Users

1. Open Command Prompt and navigate to the project directory
2. Run the start script:
   ```cmd
   start.bat
   ```

## Manual Installation

If you prefer to install manually:

### Step 1: Install Python

Download and install Python 3.7+ from [python.org](https://www.python.org/downloads/)

Verify installation:
```bash
python --version
```

### Step 2: Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate on Linux/Mac
source venv/bin/activate

# Activate on Windows
venv\Scripts\activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Run the Application

```bash
python app.py
```

### Step 5: Access the Application

Open your browser and go to:
```
http://localhost:5000
```

## Troubleshooting

### Port Already in Use

If port 5000 is already in use, modify the port in `app.py`:

```python
app.run(debug=True, host='0.0.0.0', port=8080)  # Change to any available port
```

### Module Not Found Error

Make sure you've activated the virtual environment and installed all dependencies:

```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Permission Denied (Linux/Mac)

Make the start script executable:

```bash
chmod +x start.sh
```

## System Requirements

- **Python**: 3.7 or higher
- **RAM**: Minimum 512 MB
- **Disk Space**: 100 MB
- **Browser**: Any modern web browser (Chrome, Firefox, Safari, Edge)

## Production Deployment

For production deployment, consider:

1. Using a production WSGI server like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. Setting up a reverse proxy with Nginx or Apache

3. Using a process manager like systemd or supervisor

4. Securing the application with HTTPS

5. Using a proper database instead of JSON files
