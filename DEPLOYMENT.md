# Deployment Guide - Eman Bakery Distribution System

This guide will walk you through deploying the complete bread distribution management system to production.

## Prerequisites Checklist

- [ ] Node.js 18+ installed on your machine
- [ ] Git installed
- [ ] Supabase account created (https://supabase.com)
- [ ] Netlify account created (https://netlify.com)
- [ ] GitHub account (optional, for continuous deployment)

## Step-by-Step Deployment

### Part 1: Database Setup (Supabase)

#### 1.1 Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in project details:
   - Name: `eman-bakery-distribution`
   - Database Password: Create a strong password (save it securely)
   - Region: Choose closest to your location
4. Click "Create new project"
5. Wait 2-3 minutes for project initialization

#### 1.2 Get Supabase Credentials

1. Once project is ready, go to **Project Settings** → **API**
2. Save these values (you'll need them later):
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon/public key: eyJhbGc...
   service_role key: eyJhbGc... (keep this secret!)
   ```

#### 1.3 Apply Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New query"
3. Open the file `supabase/schema.sql` from this repository
4. Copy ALL contents (it's a long file, ~700 lines)
5. Paste into SQL Editor
6. Click "Run" or press Ctrl+Enter
7. Wait for completion (should take 5-10 seconds)
8. You should see "Success. No rows returned"

#### 1.4 Verify Database Setup

1. Go to **Table Editor**
2. You should see these tables:
   - users
   - routes
   - products
   - orders
   - order_items
   - deliveries
   - delivery_items
   - acknowledgements
   - verifications
   - invoices
   - business_days
   - audit_logs
   - route_assignment_history

3. Click on `routes` table - you should see 10 routes already inserted
4. Click on `products` table - you should see 10 products

#### 1.5 Create Storage Bucket for Invoices

1. Go to **Storage** section
2. Click "Create a new bucket"
3. Bucket name: `invoices` (exactly this name)
4. Toggle "Public bucket" to **OFF** (private)
5. Click "Create bucket"

6. Click on the `invoices` bucket
7. Go to "Policies" tab
8. Click "New Policy"
9. Select "Custom" and paste this:
   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Authenticated users can upload invoices"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'invoices' 
     AND auth.role() = 'authenticated'
   );

   -- Allow authenticated users to read
   CREATE POLICY "Authenticated users can read invoices"
   ON storage.objects FOR SELECT
   USING (
     bucket_id = 'invoices'
     AND auth.role() = 'authenticated'
   );
   ```

#### 1.6 Create Admin User

1. Go to **Authentication** section
2. Click "Add user" → "Create new user"
3. Fill in:
   - Email: `admin@emanbakery.com` (or your preferred email)
   - Password: Create a strong password
   - Toggle "Auto Confirm User" to **ON**
4. Click "Create user"
5. **IMPORTANT**: Copy the User ID (UUID) - it looks like: `12345678-1234-1234-1234-123456789abc`

6. Go back to **SQL Editor**
7. Run this query (replace YOUR_USER_ID with the UUID you copied):
   ```sql
   INSERT INTO users (id, full_name, email, role, is_active)
   VALUES (
     'YOUR_USER_ID_HERE', 
     'Administrator', 
     'admin@emanbakery.com', 
     'Admin', 
     true
   );
   ```
8. You should see "Success. 1 rows affected"

### Part 2: Frontend Setup

#### 2.1 Clone Repository (if you haven't already)

```bash
git clone https://github.com/calvinkey7919/bread-distribution-of-eman-bakery.git
cd bread-distribution-of-eman-bakery
```

#### 2.2 Install Dependencies

```bash
npm install
```

#### 2.3 Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...
   NEXT_PUBLIC_APP_NAME="Eman Bakery Distribution System"
   ```

#### 2.4 Test Locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser

You should see the login page. Try logging in with:
- Email: `admin@emanbakery.com`
- Password: (the password you set in step 1.6)

If login works and you see the Admin Dashboard, you're ready to deploy!

### Part 3: Deploy to Netlify

#### Option A: Deploy via Netlify CLI (Recommended)

1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```
   (This will open a browser window to authorize)

3. Build the application:
   ```bash
   npm run build
   ```

4. Deploy to Netlify:
   ```bash
   netlify deploy --prod
   ```

5. Follow the prompts:
   - Create & configure a new site? **Yes**
   - Team: Select your team
   - Site name: `eman-bakery-distribution` (or your preference)
   - Publish directory: `.next`

6. After deployment completes, you'll get a URL like:
   `https://eman-bakery-distribution.netlify.app`

7. **Add Environment Variables to Netlify**:
   ```bash
   netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://xxxxx.supabase.co"
   netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGc..."
   netlify env:set SUPABASE_SERVICE_ROLE_KEY "eyJhbGc..."
   netlify env:set NEXT_PUBLIC_APP_NAME "Eman Bakery Distribution System"
   ```

8. Redeploy to apply environment variables:
   ```bash
   netlify deploy --prod
   ```

#### Option B: Deploy via Netlify Dashboard

1. Build the application:
   ```bash
   npm run build
   ```

2. Go to https://app.netlify.com
3. Click "Add new site" → "Deploy manually"
4. Drag and drop the `.next` folder
5. Wait for deployment
6. Go to **Site settings** → **Environment variables**
7. Add all variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_NAME`
8. Trigger a new deployment from **Deploys** tab

#### Option C: Deploy via GitHub (Continuous Deployment)

1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Go to https://app.netlify.com
3. Click "Add new site" → "Import an existing project"
4. Choose "GitHub" and authorize
5. Select your repository: `bread-distribution-of-eman-bakery`
6. Configure build settings:
   - Base directory: (leave empty)
   - Build command: `npm run build`
   - Publish directory: `.next`
7. Click "Add environment variables"
8. Add all variables from `.env.local`
9. Click "Deploy site"

### Part 4: Post-Deployment Setup

#### 4.1 Test Production Deployment

1. Visit your Netlify URL
2. You should see the login page
3. Login with admin credentials
4. Verify you can access the admin dashboard

#### 4.2 Create Additional Users

Since user creation requires admin privileges and proper auth setup, you have two options:

**Option 1: Via Supabase Dashboard**

For each user:
1. Go to Supabase → Authentication → Add user
2. Create user with email and password
3. Copy the User ID
4. Go to SQL Editor and run:
   ```sql
   INSERT INTO users (id, full_name, email, role, assigned_route_id, is_active)
   VALUES (
     'USER_ID_HERE',
     'Full Name',
     'email@example.com',
     'Salesman',  -- or 'Factory', 'Accountant'
     'ROUTE_ID_HERE',  -- Get from routes table, NULL for non-salesmen
     true
   );
   ```

**Option 2: Create API Endpoint** (Advanced)

Implement a server action in Next.js to create users programmatically using the service role key.

#### 4.3 Configure Custom Domain (Optional)

1. In Netlify Dashboard, go to **Domain settings**
2. Click "Add custom domain"
3. Enter your domain (e.g., `distribution.emanbakery.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

### Part 5: Operational Checklist

Before going live, ensure:

- [ ] Admin user can log in
- [ ] All 10 routes are visible in admin dashboard
- [ ] Products are loaded (10 default products)
- [ ] At least one salesman user is created and assigned to a route
- [ ] At least one factory user is created
- [ ] At least one accountant user is created
- [ ] Test the complete workflow:
  - [ ] Salesman creates an order
  - [ ] Factory dispatches the order
  - [ ] Salesman acknowledges delivery
  - [ ] Accountant verifies delivery
  - [ ] Salesman uploads invoice
- [ ] Invoice storage bucket is working
- [ ] Mobile responsive design works on phones/tablets
- [ ] All role-based permissions are enforced

## Troubleshooting

### Issue: Can't log in

**Solution**: 
1. Verify environment variables are set in Netlify
2. Check Supabase user exists in both Authentication and users table
3. Check browser console for errors

### Issue: Database errors

**Solution**:
1. Verify schema was applied completely
2. Check RLS policies are active
3. Review Supabase logs in Dashboard

### Issue: "Not authorized" errors

**Solution**:
1. Verify user role is set correctly in users table
2. Check RLS policies match the schema
3. Ensure user is active (`is_active = true`)

### Issue: Build fails on Netlify

**Solution**:
1. Check Node.js version (should be 18+)
2. Verify all dependencies are in package.json
3. Check build logs for specific errors
4. Ensure environment variables are set

### Issue: Images/Files not uploading

**Solution**:
1. Verify `invoices` storage bucket exists
2. Check storage policies are applied
3. Verify file size limits
4. Check bucket is set to private

## Maintenance

### Regular Tasks

**Daily**:
- Monitor application for errors in Netlify logs
- Check Supabase usage in Dashboard

**Weekly**:
- Review audit logs for unusual activity
- Verify backups are running (Supabase auto-backups)

**Monthly**:
- Update dependencies: `npm update`
- Review and optimize database indexes
- Check storage usage

### Backup Strategy

Supabase provides automatic daily backups. To manually backup:

1. Go to Supabase Dashboard → Database → Backups
2. Click "Start a backup"
3. Download when complete

## Support Contacts

- **Supabase Support**: https://supabase.com/support
- **Netlify Support**: https://www.netlify.com/support/
- **Application Issues**: Check GitHub issues or contact system administrator

---

**Congratulations! Your bread distribution management system is now live! 🎉**
