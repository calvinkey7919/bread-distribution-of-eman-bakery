-- ============================================================
-- BREAD DISTRIBUTION SYSTEM - COMPLETE DATABASE SCHEMA
-- ============================================================

-- ============================================================
-- 1. ENABLE EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 2. ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM ('Admin', 'Salesman', 'Factory', 'Accountant');
CREATE TYPE order_status AS ENUM (
  'CREATED',
  'DISPATCHED',
  'ACKNOWLEDGED',
  'VERIFIED',
  'INVOICED',
  'CLOSED'
);
CREATE TYPE delivery_status AS ENUM (
  'PENDING',
  'DISPATCHED',
  'DELIVERED',
  'FLAGGED'
);
CREATE TYPE audit_action AS ENUM (
  'LOGIN',
  'USER_CREATED',
  'USER_UPDATED',
  'USER_DEACTIVATED',
  'ORDER_CREATED',
  'ORDER_UPDATED',
  'DELIVERY_CREATED',
  'ACKNOWLEDGEMENT_CREATED',
  'VERIFICATION_CREATED',
  'INVOICE_UPLOADED',
  'ROUTE_ASSIGNED',
  'DAY_CLOSED'
);

-- ============================================================
-- 3. CORE TABLES
-- ============================================================

-- Users (extended from auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'Salesman',
  assigned_route_id UUID,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Routes
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  unit_price DECIMAL(10, 2),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Route Assignment History (for audit trail)
CREATE TABLE route_assignment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id UUID NOT NULL REFERENCES routes(id),
  user_id UUID NOT NULL REFERENCES users(id),
  assigned_by UUID NOT NULL REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  unassigned_at TIMESTAMP
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id UUID NOT NULL REFERENCES routes(id),
  salesman_id UUID NOT NULL REFERENCES users(id),
  status order_status NOT NULL DEFAULT 'CREATED',
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Items (line items for each product)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  ordered_quantity INTEGER NOT NULL CHECK (ordered_quantity > 0),
  delivered_quantity INTEGER DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(order_id, product_id)
);

-- Deliveries (dispatches from factory)
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  factory_user_id UUID NOT NULL REFERENCES users(id),
  status delivery_status NOT NULL DEFAULT 'PENDING',
  dispatched_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Delivery Items (actual quantities delivered)
CREATE TABLE delivery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  delivered_quantity INTEGER NOT NULL CHECK (delivered_quantity >= 0),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(delivery_id, product_id)
);

-- Acknowledgements (salesman confirms receipt)
CREATE TABLE acknowledgements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  salesman_id UUID NOT NULL REFERENCES users(id),
  acknowledged_at TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Verifications (accountant verifies delivery)
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  accountant_id UUID NOT NULL REFERENCES users(id),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  flag_reason TEXT,
  flagged_at TIMESTAMP,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Invoices (sales invoices uploaded by salesman)
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  salesman_id UUID NOT NULL REFERENCES users(id),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Business Days (for daily closing)
CREATE TABLE business_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_date DATE NOT NULL UNIQUE,
  closed_by UUID NOT NULL REFERENCES users(id),
  all_acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
  all_verified BOOLEAN NOT NULL DEFAULT FALSE,
  all_invoiced BOOLEAN NOT NULL DEFAULT FALSE,
  closed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action audit_action NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 4. INDEXES
-- ============================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_assigned_route ON users(assigned_route_id);
CREATE INDEX idx_orders_route ON orders(route_id);
CREATE INDEX idx_orders_salesman ON orders(salesman_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_deliveries_order ON deliveries(order_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_deliveries_factory_user ON deliveries(factory_user_id);
CREATE INDEX idx_delivery_items_delivery ON delivery_items(delivery_id);
CREATE INDEX idx_acknowledgements_order ON acknowledgements(order_id);
CREATE INDEX idx_acknowledgements_salesman ON acknowledgements(salesman_id);
CREATE INDEX idx_verifications_order ON verifications(order_id);
CREATE INDEX idx_verifications_accountant ON verifications(accountant_id);
CREATE INDEX idx_invoices_order ON invoices(order_id);
CREATE INDEX idx_invoices_salesman ON invoices(salesman_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- ============================================================
-- 5. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================

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

-- ===== USERS RLS =====
CREATE POLICY users_admin_all ON users
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'Admin'));

CREATE POLICY users_self_read ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_admin_insert ON users
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'Admin'));

-- ===== ROUTES RLS =====
CREATE POLICY routes_all_read ON routes
  FOR SELECT USING (TRUE);

CREATE POLICY routes_admin_write ON routes
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'Admin'));

-- ===== PRODUCTS RLS =====
CREATE POLICY products_all_read ON products
  FOR SELECT USING (TRUE);

CREATE POLICY products_admin_write ON products
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'Admin'));

-- ===== ROUTE ASSIGNMENT HISTORY RLS =====
CREATE POLICY route_assignment_history_all_read ON route_assignment_history
  FOR SELECT USING (TRUE);

CREATE POLICY route_assignment_history_admin_write ON route_assignment_history
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'Admin'));

-- ===== ORDERS RLS =====
CREATE POLICY orders_admin_all ON orders
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'Admin'));

CREATE POLICY orders_salesman_create ON orders
  FOR INSERT WITH CHECK (
    auth.uid() = salesman_id AND
    auth.uid() IN (SELECT id FROM users WHERE assigned_route_id = route_id)
  );

CREATE POLICY orders_salesman_read ON orders
  FOR SELECT USING (
    salesman_id = auth.uid() OR
    auth.uid() IN (SELECT id FROM users WHERE role IN ('Admin', 'Factory', 'Accountant'))
  );

-- ===== ORDER ITEMS RLS =====
CREATE POLICY order_items_all_read ON order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE salesman_id = auth.uid()) OR
    auth.uid() IN (SELECT id FROM users WHERE role IN ('Admin', 'Factory', 'Accountant'))
  );

CREATE POLICY order_items_salesman_create ON order_items
  FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE salesman_id = auth.uid())
  );

-- ===== DELIVERIES RLS =====
CREATE POLICY deliveries_admin_all ON deliveries
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'Admin'));

CREATE POLICY deliveries_factory_create ON deliveries
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'Factory'));

CREATE POLICY deliveries_all_read ON deliveries
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('Admin', 'Factory', 'Accountant')) OR
    order_id IN (SELECT id FROM orders WHERE salesman_id = auth.uid())
  );

CREATE POLICY deliveries_factory_update ON deliveries
  FOR UPDATE USING (
    factory_user_id = auth.uid() AND
    auth.uid() IN (SELECT id FROM users WHERE role = 'Factory')
  );

-- ===== DELIVERY ITEMS RLS =====
CREATE POLICY delivery_items_all_read ON delivery_items
  FOR SELECT USING (TRUE);

CREATE POLICY delivery_items_factory_write ON delivery_items
  FOR ALL USING (
    delivery_id IN (SELECT id FROM deliveries WHERE factory_user_id = auth.uid()) AND
    auth.uid() IN (SELECT id FROM users WHERE role = 'Factory')
  );

-- ===== ACKNOWLEDGEMENTS RLS =====
CREATE POLICY acknowledgements_salesman_create ON acknowledgements
  FOR INSERT WITH CHECK (
    salesman_id = auth.uid() AND
    auth.uid() IN (SELECT id FROM users WHERE role = 'Salesman')
  );

CREATE POLICY acknowledgements_all_read ON acknowledgements
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('Admin', 'Accountant', 'Factory')) OR
    salesman_id = auth.uid()
  );

-- ===== VERIFICATIONS RLS =====
CREATE POLICY verifications_accountant_all ON verifications
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('Accountant', 'Admin'))
  );

CREATE POLICY verifications_all_read ON verifications
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('Admin', 'Accountant', 'Factory')) OR
    order_id IN (SELECT id FROM orders WHERE salesman_id = auth.uid())
  );

-- ===== INVOICES RLS =====
CREATE POLICY invoices_salesman_create ON invoices
  FOR INSERT WITH CHECK (
    salesman_id = auth.uid() AND
    auth.uid() IN (SELECT id FROM users WHERE role = 'Salesman')
  );

CREATE POLICY invoices_all_read ON invoices
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('Admin', 'Accountant')) OR
    salesman_id = auth.uid()
  );

-- ===== BUSINESS DAYS RLS =====
CREATE POLICY business_days_admin_all ON business_days
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'Admin'));

CREATE POLICY business_days_all_read ON business_days
  FOR SELECT USING (TRUE);

-- ===== AUDIT LOGS RLS =====
CREATE POLICY audit_logs_admin_all ON audit_logs
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE role = 'Admin'));

CREATE POLICY audit_logs_own ON audit_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY audit_logs_insert ON audit_logs
  FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- 6. FUNCTIONS & TRIGGERS
-- ============================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER routes_updated_at BEFORE UPDATE ON routes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER deliveries_updated_at BEFORE UPDATE ON deliveries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER verifications_updated_at BEFORE UPDATE ON verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function: Audit user creation
CREATE OR REPLACE FUNCTION audit_user_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
  VALUES (auth.uid(), 'USER_CREATED', 'users', NEW.id, 
    jsonb_build_object('email', NEW.email, 'role', NEW.role));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_users_insert AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION audit_user_creation();

-- Function: Audit order creation
CREATE OR REPLACE FUNCTION audit_order_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
  VALUES (auth.uid(), 'ORDER_CREATED', 'orders', NEW.id,
    jsonb_build_object('route_id', NEW.route_id, 'status', NEW.status));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_orders_insert AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION audit_order_creation();

-- Function: Audit delivery creation
CREATE OR REPLACE FUNCTION audit_delivery_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
  VALUES (auth.uid(), 'DELIVERY_CREATED', 'deliveries', NEW.id,
    jsonb_build_object('order_id', NEW.order_id, 'status', NEW.status));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_deliveries_insert AFTER INSERT ON deliveries
  FOR EACH ROW EXECUTE FUNCTION audit_delivery_creation();

-- Function: Auto-update order status based on workflow
CREATE OR REPLACE FUNCTION sync_order_status()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'deliveries' THEN
    UPDATE orders SET status = 'DISPATCHED' WHERE id = NEW.order_id AND status = 'CREATED';
  ELSIF TG_TABLE_NAME = 'acknowledgements' THEN
    UPDATE orders SET status = 'ACKNOWLEDGED' WHERE id = NEW.order_id AND status = 'DISPATCHED';
  ELSIF TG_TABLE_NAME = 'verifications' THEN
    UPDATE orders SET status = 'VERIFIED' WHERE id = NEW.order_id AND status = 'ACKNOWLEDGED' AND NEW.is_verified = TRUE;
  ELSIF TG_TABLE_NAME = 'invoices' THEN
    UPDATE orders SET status = 'INVOICED' WHERE id = NEW.order_id AND status = 'VERIFIED';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_deliveries_status AFTER INSERT ON deliveries
  FOR EACH ROW EXECUTE FUNCTION sync_order_status();

CREATE TRIGGER sync_acknowledgements_status AFTER INSERT ON acknowledgements
  FOR EACH ROW EXECUTE FUNCTION sync_order_status();

CREATE TRIGGER sync_verifications_status AFTER INSERT ON verifications
  FOR EACH ROW EXECUTE FUNCTION sync_order_status();

CREATE TRIGGER sync_invoices_status AFTER INSERT ON invoices
  FOR EACH ROW EXECUTE FUNCTION sync_order_status();

-- ============================================================
-- 7. INITIAL DATA (WILL BE CREATED VIA APP AFTER ADMIN LOGIN)
-- ============================================================

-- Routes will be seeded after deployment
INSERT INTO routes (name, description) VALUES
  ('Route 1', 'Downtown Distribution'),
  ('Route 2', 'Suburban Distribution'),
  ('Route 3', 'Industrial Area'),
  ('Route 4', 'Commercial Hub'),
  ('Route 5', 'Market Street'),
  ('Route 6', 'Shopping District'),
  ('Route 7', 'Office Parks'),
  ('Route 8', 'Residential Area'),
  ('Route 9', 'Harbor District'),
  ('Route 10', 'Airport Area');

-- Products will be seeded after deployment
INSERT INTO products (name, description, unit_price) VALUES
  ('White Bread', 'Standard white loaf', 2.50),
  ('Whole Wheat', 'Healthy whole wheat loaf', 3.00),
  ('French Baguette', 'Crispy French baguette', 3.50),
  ('Sourdough', 'Artisan sourdough loaf', 4.00),
  ('Rolls Pack', '12 dinner rolls', 2.00),
  ('Croissants Pack', '6 butter croissants', 3.25),
  ('Bagels Pack', '6 assorted bagels', 2.75),
  ('Focaccia', 'Herb focaccia bread', 2.75),
  ('Rye Bread', 'Dark rye loaf', 3.25),
  ('Ciabatta', 'Italian ciabatta loaf', 3.75);

-- ============================================================
-- NOTE: ADMIN USER MUST BE CREATED VIA SUPABASE AUTH DASHBOARD
-- THEN INSERTED INTO users TABLE WITH ROLE = 'Admin'
-- ============================================================
