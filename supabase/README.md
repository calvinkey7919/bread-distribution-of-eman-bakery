# Supabase Database Setup Guide

## Overview
This directory contains the complete database schema for the Bread Distribution Management System.

## Files
- `schema.sql` - Complete database schema with tables, RLS policies, functions, and views
- `seed-admin.sql` - SQL script to create the initial admin user (run after providing credentials)

## Setup Instructions

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Save your project credentials:
   - Project URL (e.g., https://xxxxxxxxxxxxx.supabase.co)
   - Anon/Public Key
   - Service Role Key (keep secure, admin only)

### Step 2: Apply Schema
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy contents of `schema.sql`
4. Run the SQL script
5. Verify all tables, functions, and views are created

### Step 3: Create Storage Bucket for Invoices
1. Go to Storage section in Supabase Dashboard
2. Create new bucket named: `invoices`
3. Set to Private (not public)
4. Configure bucket policies:
   ```sql
   -- Allow authenticated users to upload invoices
   CREATE POLICY "Authenticated users can upload invoices"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'invoices' 
     AND auth.role() = 'authenticated'
   );

   -- Allow users to read their own uploaded invoices
   CREATE POLICY "Users can read invoices"
   ON storage.objects FOR SELECT
   USING (
     bucket_id = 'invoices'
     AND auth.role() = 'authenticated'
   );
   ```

### Step 4: Create Admin User
1. Go to Authentication section
2. Create a new user:
   - Email: admin@emanbakery.com (or your preferred email)
   - Password: (set a secure password)
   - Auto Confirm User: Yes
3. Copy the User ID (UUID)

### Step 5: Insert Admin Record in Database
1. Go to SQL Editor
2. Run the following (replace USER_ID with the actual UUID from Step 4):
   ```sql
   INSERT INTO users (id, full_name, email, role, is_active)
   VALUES (
     'USER_ID_FROM_AUTH', 
     'Administrator', 
     'admin@emanbakery.com', 
     'Admin', 
     true
   );
   ```

### Step 6: Configure Environment Variables
Update your `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Schema Overview

### Core Tables
- **users** - User accounts with roles (Admin, Salesman, Factory, Accountant)
- **routes** - 10 delivery routes
- **products** - Bread and bakery products
- **orders** - Customer orders created by salesmen
- **order_items** - Products in each order
- **deliveries** - Delivery dispatches from factory
- **delivery_items** - Actual delivered quantities
- **acknowledgements** - Salesman acknowledgements of deliveries
- **verifications** - Accountant verifications
- **invoices** - Sales invoice uploads
- **business_days** - Daily closing records
- **audit_logs** - Complete audit trail
- **route_assignment_history** - Track route assignments

### Security Features
- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Audit logging for all critical actions
- Encrypted file storage for invoices

### Views for Reporting
- `v_daily_operations` - Daily operations summary
- `v_route_performance` - Route performance metrics
- `v_product_movement` - Product movement tracking

## Next Steps
After completing the database setup, proceed to configure the frontend application with your Supabase credentials.
