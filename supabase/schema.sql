-- =====================================================
-- BREAD DISTRIBUTION MANAGEMENT SYSTEM - DATABASE SCHEMA
-- =====================================================
-- This schema is designed for a complete production-ready
-- bread distribution business application
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('Admin', 'Salesman', 'Factory', 'Accountant');
CREATE TYPE order_status AS ENUM ('CREATED', 'DISPATCHED', 'ACKNOWLEDGED', 'VERIFIED', 'INVOICED', 'FLAGGED');
CREATE TYPE delivery_status AS ENUM ('PENDING', 'DISPATCHED', 'ACKNOWLEDGED', 'VERIFIED', 'FLAGGED');

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Routes Table
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_number INTEGER UNIQUE NOT NULL,
    route_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL,
    assigned_route_id UUID REFERENCES routes(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Route Assignment History
CREATE TABLE route_assignment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id),
    user_id UUID NOT NULL REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID NOT NULL REFERENCES users(id),
    unassigned_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    route_id UUID NOT NULL REFERENCES routes(id),
    salesman_id UUID NOT NULL REFERENCES users(id),
    status order_status DEFAULT 'CREATED',
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_locked BOOLEAN DEFAULT false
);

-- Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    ordered_quantity INTEGER NOT NULL CHECK (ordered_quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deliveries Table
CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    dispatched_by UUID NOT NULL REFERENCES users(id),
    dispatch_date DATE NOT NULL DEFAULT CURRENT_DATE,
    dispatch_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status delivery_status DEFAULT 'DISPATCHED',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery Items Table
CREATE TABLE delivery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    ordered_quantity INTEGER NOT NULL,
    delivered_quantity INTEGER NOT NULL CHECK (delivered_quantity >= 0),
    variance INTEGER GENERATED ALWAYS AS (delivered_quantity - ordered_quantity) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Acknowledgements Table
CREATE TABLE acknowledgements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id UUID NOT NULL REFERENCES deliveries(id),
    order_id UUID NOT NULL REFERENCES orders(id),
    acknowledged_by UUID NOT NULL REFERENCES users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Verifications Table
CREATE TABLE verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id UUID NOT NULL REFERENCES deliveries(id),
    order_id UUID NOT NULL REFERENCES orders(id),
    verified_by UUID NOT NULL REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_flagged BOOLEAN DEFAULT false,
    flag_reason TEXT,
    notes TEXT
);

-- Invoices Table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Business Days Table (for daily closing)
CREATE TABLE business_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_date DATE UNIQUE NOT NULL,
    closed_by UUID NOT NULL REFERENCES users(id),
    closed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_orders INTEGER DEFAULT 0,
    total_deliveries INTEGER DEFAULT 0,
    total_acknowledged INTEGER DEFAULT 0,
    total_verified INTEGER DEFAULT 0,
    total_invoiced INTEGER DEFAULT 0,
    notes TEXT
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_assigned_route ON users(assigned_route_id);
CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_orders_route ON orders(route_id);
CREATE INDEX idx_orders_salesman ON orders(salesman_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_number ON orders(order_number);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

CREATE INDEX idx_deliveries_order ON deliveries(order_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_deliveries_date ON deliveries(dispatch_date);

CREATE INDEX idx_delivery_items_delivery ON delivery_items(delivery_id);
CREATE INDEX idx_delivery_items_product ON delivery_items(product_id);

CREATE INDEX idx_acknowledgements_delivery ON acknowledgements(delivery_id);
CREATE INDEX idx_acknowledgements_order ON acknowledgements(order_id);

CREATE INDEX idx_verifications_delivery ON verifications(delivery_id);
CREATE INDEX idx_verifications_order ON verifications(order_id);

CREATE INDEX idx_invoices_order ON invoices(order_id);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

CREATE INDEX idx_route_assignment_history_route ON route_assignment_history(route_id);
CREATE INDEX idx_route_assignment_history_user ON route_assignment_history(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_assignment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE acknowledgements ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users Policies
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
    ON users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'Admin'
        )
    );

CREATE POLICY "Admins can create users"
    ON users FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'Admin'
        )
    );

CREATE POLICY "Admins can update users"
    ON users FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'Admin'
        )
    );

-- Routes Policies
CREATE POLICY "All authenticated users can view routes"
    ON routes FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage routes"
    ON routes FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'Admin'
        )
    );

-- Products Policies
CREATE POLICY "All authenticated users can view products"
    ON products FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage products"
    ON products FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'Admin'
        )
    );

-- Route Assignment History Policies
CREATE POLICY "All authenticated users can view route assignments"
    ON route_assignment_history FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage route assignments"
    ON route_assignment_history FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'Admin'
        )
    );

-- Orders Policies
CREATE POLICY "Users can view orders for their route"
    ON orders FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role = 'Admin'
        )
        OR salesman_id = auth.uid()
        OR auth.uid() IN (
            SELECT id FROM users WHERE role IN ('Factory', 'Accountant')
        )
    );

CREATE POLICY "Salesmen can create orders for their route"
    ON orders FOR INSERT
    WITH CHECK (
        salesman_id = auth.uid()
        AND route_id IN (
            SELECT assigned_route_id FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Orders can be updated by authorized users"
    ON orders FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role IN ('Admin', 'Factory', 'Accountant')
        )
        OR salesman_id = auth.uid()
    );

-- Order Items Policies
CREATE POLICY "Users can view order items"
    ON order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id
            AND (
                orders.salesman_id = auth.uid()
                OR auth.uid() IN (
                    SELECT id FROM users WHERE role IN ('Admin', 'Factory', 'Accountant')
                )
            )
        )
    );

CREATE POLICY "Salesmen can create order items"
    ON order_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id
            AND orders.salesman_id = auth.uid()
        )
    );

-- Deliveries Policies
CREATE POLICY "Authorized users can view deliveries"
    ON deliveries FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role IN ('Admin', 'Factory', 'Accountant')
        )
        OR EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = deliveries.order_id
            AND orders.salesman_id = auth.uid()
        )
    );

CREATE POLICY "Factory users can create deliveries"
    ON deliveries FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'Factory'
        )
    );

CREATE POLICY "Factory users can update deliveries"
    ON deliveries FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'Factory'
        )
    );

-- Delivery Items Policies
CREATE POLICY "Authorized users can view delivery items"
    ON delivery_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM deliveries d
            JOIN orders o ON d.order_id = o.id
            WHERE d.id = delivery_items.delivery_id
            AND (
                o.salesman_id = auth.uid()
                OR auth.uid() IN (
                    SELECT id FROM users WHERE role IN ('Admin', 'Factory', 'Accountant')
                )
            )
        )
    );

CREATE POLICY "Factory users can create delivery items"
    ON delivery_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'Factory'
        )
    );

-- Acknowledgements Policies
CREATE POLICY "Authorized users can view acknowledgements"
    ON acknowledgements FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role IN ('Admin', 'Factory', 'Accountant')
        )
        OR acknowledged_by = auth.uid()
    );

CREATE POLICY "Salesmen can create acknowledgements"
    ON acknowledgements FOR INSERT
    WITH CHECK (
        acknowledged_by = auth.uid()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'Salesman'
        )
    );

-- Verifications Policies
CREATE POLICY "Authorized users can view verifications"
    ON verifications FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role IN ('Admin', 'Factory', 'Accountant')
        )
        OR EXISTS (
            SELECT 1 FROM orders o
            JOIN deliveries d ON o.id = d.order_id
            WHERE d.id = verifications.delivery_id
            AND o.salesman_id = auth.uid()
        )
    );

CREATE POLICY "Accountants can create verifications"
    ON verifications FOR INSERT
    WITH CHECK (
        verified_by = auth.uid()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'Accountant'
        )
    );

-- Invoices Policies
CREATE POLICY "Authorized users can view invoices"
    ON invoices FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role IN ('Admin', 'Accountant')
        )
        OR uploaded_by = auth.uid()
    );

CREATE POLICY "Salesmen can upload invoices"
    ON invoices FOR INSERT
    WITH CHECK (
        uploaded_by = auth.uid()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'Salesman'
        )
    );

-- Business Days Policies
CREATE POLICY "All authenticated users can view business days"
    ON business_days FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can close business days"
    ON business_days FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'Admin'
        )
    );

-- Audit Logs Policies
CREATE POLICY "Only admins can view audit logs"
    ON audit_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'Admin'
        )
    );

CREATE POLICY "All authenticated users can create audit logs"
    ON audit_logs FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE order_number_seq START 1;

-- Trigger for auto-generating order numbers
CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.invoice_number := 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('invoice_number_seq')::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for invoice numbers
CREATE SEQUENCE invoice_number_seq START 1;

-- Trigger for auto-generating invoice numbers
CREATE TRIGGER generate_invoice_number_trigger
    BEFORE INSERT ON invoices
    FOR EACH ROW
    WHEN (NEW.invoice_number IS NULL)
    EXECUTE FUNCTION generate_invoice_number();

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert 10 Routes
INSERT INTO routes (route_number, route_name, description) VALUES
(1, 'Route 1 - Downtown', 'Central business district'),
(2, 'Route 2 - North Zone', 'Northern residential area'),
(3, 'Route 3 - South Zone', 'Southern commercial area'),
(4, 'Route 4 - East Zone', 'Eastern industrial area'),
(5, 'Route 5 - West Zone', 'Western suburban area'),
(6, 'Route 6 - Airport Road', 'Airport vicinity'),
(7, 'Route 7 - Beach Side', 'Coastal areas'),
(8, 'Route 8 - Market District', 'Main market areas'),
(9, 'Route 9 - University Area', 'Educational institutions'),
(10, 'Route 10 - Hospital Zone', 'Medical facilities area');

-- Insert Sample Products
INSERT INTO products (product_code, product_name, unit_price) VALUES
('BREAD-WHITE-L', 'White Bread Large', 2.50),
('BREAD-WHITE-S', 'White Bread Small', 1.50),
('BREAD-WHEAT-L', 'Wheat Bread Large', 3.00),
('BREAD-WHEAT-S', 'Wheat Bread Small', 2.00),
('BREAD-MULTI-L', 'Multigrain Bread Large', 3.50),
('BREAD-MULTI-S', 'Multigrain Bread Small', 2.50),
('BUNS-PLAIN', 'Plain Buns (6 pack)', 2.00),
('BUNS-SESAME', 'Sesame Buns (6 pack)', 2.25),
('ROLLS-DINNER', 'Dinner Rolls (12 pack)', 3.00),
('PASTRY-CROISSANT', 'Croissants (4 pack)', 4.00);

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- Daily Operations View
CREATE OR REPLACE VIEW v_daily_operations AS
SELECT 
    o.order_date,
    r.route_number,
    r.route_name,
    u.full_name AS salesman_name,
    o.order_number,
    o.status,
    COUNT(DISTINCT oi.product_id) AS product_count,
    SUM(oi.ordered_quantity) AS total_ordered,
    COALESCE(SUM(di.delivered_quantity), 0) AS total_delivered,
    COALESCE(SUM(di.variance), 0) AS total_variance,
    CASE WHEN a.id IS NOT NULL THEN true ELSE false END AS is_acknowledged,
    CASE WHEN v.id IS NOT NULL THEN true ELSE false END AS is_verified,
    CASE WHEN inv.id IS NOT NULL THEN true ELSE false END AS has_invoice
FROM orders o
JOIN routes r ON o.route_id = r.id
JOIN users u ON o.salesman_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN deliveries d ON o.id = d.order_id
LEFT JOIN delivery_items di ON d.id = di.delivery_id
LEFT JOIN acknowledgements a ON o.id = a.order_id
LEFT JOIN verifications v ON o.id = v.order_id
LEFT JOIN invoices inv ON o.id = inv.order_id
GROUP BY o.id, r.route_number, r.route_name, u.full_name, o.order_number, 
         o.status, o.order_date, a.id, v.id, inv.id;

-- Route Performance View
CREATE OR REPLACE VIEW v_route_performance AS
SELECT 
    r.route_number,
    r.route_name,
    u.full_name AS current_salesman,
    COUNT(DISTINCT o.id) AS total_orders,
    COUNT(DISTINCT CASE WHEN o.status = 'VERIFIED' THEN o.id END) AS verified_orders,
    COUNT(DISTINCT CASE WHEN inv.id IS NOT NULL THEN o.id END) AS invoiced_orders,
    SUM(oi.ordered_quantity * p.unit_price) AS total_order_value,
    AVG(di.variance) AS avg_variance
FROM routes r
LEFT JOIN users u ON r.id = u.assigned_route_id AND u.role = 'Salesman'
LEFT JOIN orders o ON r.id = o.route_id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
LEFT JOIN deliveries d ON o.id = d.order_id
LEFT JOIN delivery_items di ON d.id = di.delivery_id
LEFT JOIN invoices inv ON o.id = inv.order_id
GROUP BY r.id, r.route_number, r.route_name, u.full_name;

-- Product Movement View
CREATE OR REPLACE VIEW v_product_movement AS
SELECT 
    p.product_code,
    p.product_name,
    DATE(o.order_date) AS movement_date,
    SUM(oi.ordered_quantity) AS total_ordered,
    SUM(di.delivered_quantity) AS total_delivered,
    SUM(di.variance) AS total_variance
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id
LEFT JOIN deliveries d ON o.id = d.order_id
LEFT JOIN delivery_items di ON d.id = di.delivery_id AND di.product_id = p.id
GROUP BY p.id, p.product_code, p.product_name, DATE(o.order_date);

-- =====================================================
-- STORAGE BUCKET SETUP (Run after schema creation)
-- =====================================================
-- Note: Storage buckets need to be created via Supabase Dashboard or API
-- Bucket name: 'invoices'
-- Public: false
-- Allowed MIME types: application/pdf, image/jpeg, image/png
-- Max file size: 5MB

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================
-- Next Steps:
-- 1. Apply this schema to Supabase
-- 2. Create admin user in Supabase Auth
-- 3. Insert admin user record in users table
-- 4. Create storage bucket for invoices
-- 5. Deploy frontend application
-- =====================================================
