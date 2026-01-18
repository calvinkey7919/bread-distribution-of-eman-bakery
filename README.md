# 🍞 Eman Bakery Distribution System

A comprehensive web-based bread distribution management system built with Python Flask. This application helps bakeries efficiently manage their products, inventory, customers, and deliveries.

## Features

- **Product Management**: Define and manage different types of bread products with pricing and specifications
- **Inventory Tracking**: Track production batches, quantities, expiry dates, and batch numbers
- **Customer Management**: Maintain a complete customer database with contact information and business details
- **Delivery Scheduling**: Plan, schedule, and track deliveries with real-time status updates
- **Dashboard**: Real-time statistics and overview of your distribution operations
- **User-Friendly Interface**: Clean, modern web interface with responsive design

## Technology Stack

- **Backend**: Python 3.x with Flask web framework
- **Data Storage**: JSON-based file storage (easily upgradable to database)
- **Frontend**: HTML5, CSS3 with modern responsive design
- **No Database Required**: Lightweight JSON storage for quick setup

## Installation

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bread-distribution-of-eman-bakery.git
   cd bread-distribution-of-eman-bakery
   ```

2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Access the application**
   Open your web browser and navigate to:
   ```
   http://localhost:5000
   ```

## Usage Guide

### Managing Products

1. Navigate to the **Products** page
2. Fill in the product details:
   - Product name (e.g., "Whole Wheat Bread")
   - Type (White, Wheat, Multigrain, etc.)
   - Price per unit
   - Weight (e.g., "500g", "1kg")
3. Click "Add Product" to save

### Managing Inventory

1. Go to the **Inventory** page
2. Select a product from the dropdown
3. Enter:
   - Quantity produced
   - Production date
   - Expiry date
   - Batch number for tracking
4. Click "Add to Inventory"

### Managing Customers

1. Visit the **Customers** page
2. Add customer information:
   - Name
   - Business name (optional)
   - Phone number
   - Email (optional)
   - Delivery address
3. Click "Add Customer"

### Scheduling Deliveries

1. Open the **Deliveries** page
2. Select:
   - Customer
   - Product
   - Quantity
   - Delivery date
3. Add any special notes
4. Click "Schedule Delivery"
5. Mark deliveries as complete when done

### Dashboard Overview

The dashboard displays:
- Total number of products
- Current inventory count
- Total customers
- Pending deliveries
- Completed deliveries
- Recent delivery activity

## Project Structure

```
bread-distribution-of-eman-bakery/
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── README.md              # This file
├── .gitignore            # Git ignore rules
├── templates/            # HTML templates
│   ├── base.html         # Base template with navigation
│   ├── index.html        # Dashboard
│   ├── products.html     # Product management
│   ├── inventory.html    # Inventory tracking
│   ├── customers.html    # Customer management
│   └── deliveries.html   # Delivery scheduling
└── data/                 # Data storage (created automatically)
    └── distribution_data.json
```

## Data Storage

The application uses JSON file storage in the `data/` directory. All data is automatically persisted to `distribution_data.json`. The file is created automatically on first run.

### Data Structure

```json
{
  "products": [],
  "inventory": [],
  "customers": [],
  "deliveries": []
}
```

## API Endpoints

- `GET /` - Dashboard
- `GET /products` - Product management page
- `POST /api/products` - Add new product
- `GET /inventory` - Inventory management page
- `POST /api/inventory` - Add inventory
- `GET /customers` - Customer management page
- `POST /api/customers` - Add new customer
- `GET /deliveries` - Delivery management page
- `POST /api/deliveries` - Schedule delivery
- `POST /api/deliveries/<id>/status` - Update delivery status
- `GET /api/stats` - Get statistics (JSON)

## Configuration

The application runs on `http://0.0.0.0:5000` by default. You can modify settings in `app.py`:

```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

For production deployment, set `debug=False` and consider using a production WSGI server like Gunicorn.

## Future Enhancements

Potential features for future versions:
- Database integration (PostgreSQL, MySQL)
- User authentication and authorization
- Reporting and analytics
- Export data to CSV/Excel
- Email notifications for deliveries
- Mobile application
- Multi-location support
- Invoice generation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Author

Eman Bakery Distribution System
Version 1.0.0