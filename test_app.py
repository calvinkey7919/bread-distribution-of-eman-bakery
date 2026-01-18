"""
Eman Bakery Distribution System - Test Suite

This file contains basic tests for the application.
Run with: python -m pytest test_app.py
"""

import pytest
import json
import os
from app import app, load_data, save_data

@pytest.fixture
def client():
    """Create a test client"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def sample_data():
    """Sample data for testing"""
    return {
        'products': [
            {
                'id': 1,
                'name': 'Test Bread',
                'type': 'white',
                'price': 2.99,
                'weight': '500g',
                'created_at': '2024-01-01T00:00:00'
            }
        ],
        'inventory': [],
        'customers': [],
        'deliveries': []
    }

def test_index_route(client):
    """Test the main dashboard route"""
    response = client.get('/')
    assert response.status_code == 200
    assert b'Eman Bakery Distribution System' in response.data

def test_products_route(client):
    """Test the products page"""
    response = client.get('/products')
    assert response.status_code == 200
    assert b'Product' in response.data

def test_inventory_route(client):
    """Test the inventory page"""
    response = client.get('/inventory')
    assert response.status_code == 200
    assert b'Inventory' in response.data

def test_customers_route(client):
    """Test the customers page"""
    response = client.get('/customers')
    assert response.status_code == 200
    assert b'Customer' in response.data

def test_deliveries_route(client):
    """Test the deliveries page"""
    response = client.get('/deliveries')
    assert response.status_code == 200
    assert b'Deliver' in response.data

def test_api_stats(client):
    """Test the stats API endpoint"""
    response = client.get('/api/stats')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'total_products' in data
    assert 'total_inventory' in data
    assert 'total_customers' in data

def test_add_product(client):
    """Test adding a new product"""
    response = client.post('/api/products', data={
        'name': 'Test Bread',
        'type': 'white',
        'price': '2.99',
        'weight': '500g'
    }, follow_redirects=True)
    assert response.status_code == 200

def test_add_customer(client):
    """Test adding a new customer"""
    response = client.post('/api/customers', data={
        'name': 'Test Customer',
        'business_name': 'Test Business',
        'phone': '+1234567890',
        'address': '123 Test St',
        'email': 'test@example.com'
    }, follow_redirects=True)
    assert response.status_code == 200

def test_data_persistence(sample_data, tmp_path):
    """Test data saving and loading"""
    test_file = tmp_path / "test_data.json"
    
    # Save data
    with open(test_file, 'w') as f:
        json.dump(sample_data, f)
    
    # Load data
    with open(test_file, 'r') as f:
        loaded_data = json.load(f)
    
    assert loaded_data == sample_data
    assert len(loaded_data['products']) == 1
    assert loaded_data['products'][0]['name'] == 'Test Bread'

if __name__ == '__main__':
    pytest.main([__file__, '-v'])
