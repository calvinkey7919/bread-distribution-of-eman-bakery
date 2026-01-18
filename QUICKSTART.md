# Quick Start Guide

Get Eman Bakery Distribution System up and running in 5 minutes!

## Prerequisites

- Python 3.7 or higher installed
- A web browser

## Installation (3 steps)

### Option 1: Automated (Recommended)

**Linux/Mac:**
```bash
./start.sh
```

**Windows:**
```cmd
start.bat
```

### Option 2: Manual

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application**
   ```bash
   python app.py
   ```

3. **Open your browser**
   ```
   http://localhost:5000
   ```

## First Steps

Once the application is running:

1. **Add a Product** → Go to Products → Fill in the form → Click "Add Product"
2. **Add Inventory** → Go to Inventory → Select product and quantity → Click "Add to Inventory"
3. **Add a Customer** → Go to Customers → Enter details → Click "Add Customer"
4. **Schedule Delivery** → Go to Deliveries → Choose customer, product, and date → Click "Schedule Delivery"
5. **View Dashboard** → Click "Dashboard" to see your statistics

## Sample Data

The system comes with sample data pre-loaded:
- 3 bread products
- 2 inventory batches
- 2 customers
- 2 pending deliveries

You can view this data immediately or start fresh by deleting `data/distribution_data.json`.

## What's Next?

- Read the **USER_GUIDE.md** for detailed instructions
- Check the **README.md** for complete documentation
- Review **INSTALL.md** for troubleshooting

## Getting Help

- **Installation Issues**: See INSTALL.md
- **Usage Questions**: See USER_GUIDE.md
- **Technical Details**: See README.md

## Stop the Application

Press `Ctrl+C` in the terminal where the application is running.

---

**That's it!** You're ready to manage your bread distribution operations! 🍞
