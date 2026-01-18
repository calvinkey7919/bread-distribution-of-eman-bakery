from flask import Flask, render_template, request, jsonify, redirect, url_for
from datetime import datetime
import json
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'eman-bakery-secret-key'

DATA_FILE = 'data/distribution_data.json'

def load_data():
    """Load distribution data from JSON file"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {
        'inventory': [],
        'customers': [],
        'deliveries': [],
        'products': []
    }

def save_data(data):
    """Save distribution data to JSON file"""
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def index():
    """Dashboard showing overview of the distribution system"""
    data = load_data()
    stats = {
        'total_products': len(data['products']),
        'total_inventory': sum(item['quantity'] for item in data['inventory']),
        'total_customers': len(data['customers']),
        'pending_deliveries': len([d for d in data['deliveries'] if d['status'] == 'pending']),
        'completed_deliveries': len([d for d in data['deliveries'] if d['status'] == 'completed'])
    }
    return render_template('index.html', stats=stats, data=data)

@app.route('/products')
def products():
    """Manage bread products"""
    data = load_data()
    return render_template('products.html', products=data['products'])

@app.route('/api/products', methods=['POST'])
def add_product():
    """Add a new bread product"""
    data = load_data()
    product = {
        'id': len(data['products']) + 1,
        'name': request.form['name'],
        'type': request.form['type'],
        'price': float(request.form['price']),
        'weight': request.form['weight'],
        'created_at': datetime.now().isoformat()
    }
    data['products'].append(product)
    save_data(data)
    return redirect(url_for('products'))

@app.route('/inventory')
def inventory():
    """Manage bread inventory"""
    data = load_data()
    return render_template('inventory.html', inventory=data['inventory'], products=data['products'])

@app.route('/api/inventory', methods=['POST'])
def add_inventory():
    """Add inventory for a product"""
    data = load_data()
    inventory_item = {
        'id': len(data['inventory']) + 1,
        'product_id': int(request.form['product_id']),
        'quantity': int(request.form['quantity']),
        'production_date': request.form['production_date'],
        'expiry_date': request.form['expiry_date'],
        'batch_number': request.form['batch_number'],
        'added_at': datetime.now().isoformat()
    }
    data['inventory'].append(inventory_item)
    save_data(data)
    return redirect(url_for('inventory'))

@app.route('/customers')
def customers():
    """Manage customers"""
    data = load_data()
    return render_template('customers.html', customers=data['customers'])

@app.route('/api/customers', methods=['POST'])
def add_customer():
    """Add a new customer"""
    data = load_data()
    customer = {
        'id': len(data['customers']) + 1,
        'name': request.form['name'],
        'business_name': request.form.get('business_name', ''),
        'phone': request.form['phone'],
        'address': request.form['address'],
        'email': request.form.get('email', ''),
        'created_at': datetime.now().isoformat()
    }
    data['customers'].append(customer)
    save_data(data)
    return redirect(url_for('customers'))

@app.route('/deliveries')
def deliveries():
    """Manage deliveries"""
    data = load_data()
    return render_template('deliveries.html', deliveries=data['deliveries'], 
                         customers=data['customers'], products=data['products'])

@app.route('/api/deliveries', methods=['POST'])
def add_delivery():
    """Add a new delivery"""
    data = load_data()
    delivery = {
        'id': len(data['deliveries']) + 1,
        'customer_id': int(request.form['customer_id']),
        'product_id': int(request.form['product_id']),
        'quantity': int(request.form['quantity']),
        'delivery_date': request.form['delivery_date'],
        'status': 'pending',
        'notes': request.form.get('notes', ''),
        'created_at': datetime.now().isoformat()
    }
    data['deliveries'].append(delivery)
    save_data(data)
    return redirect(url_for('deliveries'))

@app.route('/api/deliveries/<int:delivery_id>/status', methods=['POST'])
def update_delivery_status(delivery_id):
    """Update delivery status"""
    data = load_data()
    for delivery in data['deliveries']:
        if delivery['id'] == delivery_id:
            delivery['status'] = request.form['status']
            delivery['updated_at'] = datetime.now().isoformat()
            break
    save_data(data)
    return redirect(url_for('deliveries'))

@app.route('/api/stats')
def get_stats():
    """Get statistics for dashboard"""
    data = load_data()
    stats = {
        'total_products': len(data['products']),
        'total_inventory': sum(item['quantity'] for item in data['inventory']),
        'total_customers': len(data['customers']),
        'pending_deliveries': len([d for d in data['deliveries'] if d['status'] == 'pending']),
        'completed_deliveries': len([d for d in data['deliveries'] if d['status'] == 'completed'])
    }
    return jsonify(stats)

if __name__ == '__main__':
    import os
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)
