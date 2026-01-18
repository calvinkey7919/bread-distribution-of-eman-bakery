# User Guide

## Getting Started

Welcome to Eman Bakery Distribution System! This guide will help you get started with managing your bread distribution operations.

## Dashboard

The dashboard provides an overview of your operations:
- **Total Products**: Number of bread products you offer
- **Total Inventory**: Current inventory count across all products
- **Total Customers**: Number of registered customers
- **Pending Deliveries**: Deliveries scheduled but not yet completed
- **Completed Deliveries**: Successfully delivered orders

## Managing Products

### Adding a Product

1. Click **Products** in the navigation menu
2. Fill in the product details:
   - **Product Name**: Enter a descriptive name (e.g., "Whole Wheat Bread")
   - **Type**: Select from available bread types
   - **Price**: Enter the price per unit
   - **Weight**: Specify the weight (e.g., "500g", "1kg")
3. Click **Add Product**

### Product Types

- **White**: Classic white bread
- **Wheat**: Whole wheat bread
- **Multigrain**: Multiple grain varieties
- **Sourdough**: Sourdough bread
- **Baguette**: French-style baguette
- **Rolls**: Bread rolls
- **Specialty**: Specialty or custom breads

## Managing Inventory

### Adding Inventory

1. Navigate to **Inventory**
2. Select a product from the dropdown
3. Enter the details:
   - **Quantity**: Number of units produced
   - **Production Date**: When the batch was produced
   - **Expiry Date**: When the batch expires
   - **Batch Number**: Unique identifier for tracking (e.g., "BATCH-20240118-001")
4. Click **Add to Inventory**

### Inventory Tracking

The inventory table shows:
- Product name
- Available quantity
- Batch number for traceability
- Production and expiry dates
- When the inventory was added

## Managing Customers

### Adding a Customer

1. Go to **Customers**
2. Fill in customer information:
   - **Customer Name**: Full name of the contact person
   - **Business Name**: (Optional) Name of the business
   - **Phone**: Contact phone number
   - **Email**: (Optional) Email address
   - **Address**: Complete delivery address
3. Click **Add Customer**

### Customer Information

Store important details about each customer:
- Contact information for communication
- Business name for invoicing
- Delivery address for routing
- Registration date for record keeping

## Managing Deliveries

### Scheduling a Delivery

1. Click **Deliveries**
2. Fill in delivery details:
   - **Customer**: Select from your customer list
   - **Product**: Choose which bread product to deliver
   - **Quantity**: Number of units to deliver
   - **Delivery Date**: When the delivery is scheduled
   - **Notes**: (Optional) Special instructions or notes
3. Click **Schedule Delivery**

### Delivery Status

Deliveries have two statuses:
- **Pending**: Scheduled but not yet delivered
- **Completed**: Successfully delivered

### Completing a Delivery

1. Find the delivery in the table
2. Click the **Complete** button
3. The status will update to "Completed"

## Best Practices

### Inventory Management

- Add inventory as soon as bread is produced
- Use consistent batch numbering (e.g., BATCH-YYYYMMDD-XXX)
- Monitor expiry dates to minimize waste
- Update inventory when deliveries are made

### Delivery Scheduling

- Schedule deliveries in advance
- Include delivery time preferences in notes
- Mark deliveries as complete promptly
- Review pending deliveries daily

### Customer Management

- Keep customer information up to date
- Include business names for commercial customers
- Store accurate delivery addresses
- Maintain current contact information

## Tips

1. **Regular Updates**: Check the dashboard daily for an overview
2. **Batch Tracking**: Use systematic batch numbers for quality control
3. **Planning**: Review pending deliveries each morning
4. **Communication**: Use the notes field for special instructions
5. **Organization**: Keep customer and product lists organized

## Data Backup

Your data is stored in `data/distribution_data.json`. Back this file up regularly to prevent data loss.

## Getting Help

If you encounter any issues or have questions:
1. Check the README.md for general information
2. Review the INSTALL.md for setup issues
3. Open an issue on GitHub for bug reports or feature requests
