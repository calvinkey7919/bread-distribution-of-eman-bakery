# Getting Started - Bread Distribution System

Welcome! This guide will get you up and running in minutes.

## Prerequisites

- **Node.js** 18+ or 20+ ([download](https://nodejs.org))
- **npm** 8+ (comes with Node)
- **Supabase Account** (free at [supabase.com](https://supabase.com))
- **GitHub Account** (for Netlify deployment)

## Step 1: Install Dependencies

```bash
cd bread-distribution-system
npm install
```

## Step 2: Create Supabase Project

### 2a. Go to Supabase

1. Visit [supabase.com](https://supabase.com)
2. Click "Sign Up" or "Sign In"
3. Create new organization
4. Create new project
5. **Choose password** for postgres user
6. **Choose region** (keep default or select closest)
7. Wait 2-3 minutes for provisioning

### 2b. Get Your Credentials

1. Go to **Project Settings** → **API**
2. Copy **Project URL** (looks like: `https://xxx.supabase.co`)
3. Copy **anon public key** (under "Project API keys")
4. Keep these safe!

## Step 3: Setup Environment

```bash
# Copy template
cp .env.example .env.local

# Edit with your editor (VS Code, nano, etc.)
nano .env.local
```

Add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Save and close.

## Step 4: Apply Database Schema

### 4a. Open Supabase SQL Editor

1. Go to your Supabase project
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**

### 4b. Run Schema

1. Open the file `schema.sql` from your project root
2. Copy **entire contents**
3. Paste into Supabase SQL Editor
4. Click **Run** button
5. Wait for completion (1-2 minutes)

**Expected output**: "Query completed successfully"

### 4c. Verify Tables

1. Go to **Table Editor** (left sidebar)
2. Confirm these tables exist:
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

## Step 5: Create Admin User

### 5a. Create Auth User

1. Go to **Authentication** → **Users** (left sidebar)
2. Click **Add user manually**
3. Enter:
   - **Email**: `admin@bakery.local`
   - **Password**: (create strong password, save it!)
   - Check ✓ "Auto confirm user email"
4. Click **Create user**

### 5b. Grant Admin Role

1. Go to **SQL Editor**
2. Click **New Query**
3. Paste this:

```sql
INSERT INTO users (id, email, full_name, role, is_active)
SELECT id, email, email as full_name, 'Admin', true
FROM auth.users
WHERE email = 'admin@bakery.local'
ON CONFLICT (id) DO NOTHING;
```

4. Click **Run**

## Step 6: Run Development Server

```bash
npm run dev
```

Expected output:
```
> Local:        http://localhost:3000
> Environments: .env.local
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 7: Login

1. Click **Login** button
2. Enter:
   - **Email**: `admin@bakery.local`
   - **Password**: (from Step 5a)
3. Click **Login**
4. You should see the Admin Dashboard!

## Step 8: Create Test Data

### Create a Test User

1. Go to **User Management**
2. Click **New User**
3. Fill form:
   - **Full Name**: "John Smith"
   - **Email**: "john@bakery.local"
   - **Temporary Password**: "TempPass123!"
   - **Role**: "Salesman"
   - **Assigned Route**: "Route 1"
4. Click **Save**

### Create a Test Order (Optional)

1. Logout and login with the salesman account
2. Go to **Create Order**
3. Products are pre-loaded (10 bread products)
4. Select product "White Bread", quantity: 10
5. Click **Create Order**
6. Order created!

## Step 9: Deploy to Netlify

### Option A: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/your-username/bread-distribution.git
   git branch -M main
   git push -u origin main
   ```

2. **Go to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Sign up/login with GitHub
   - Click "New site from Git"
   - Select your repository
   - Build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `.next`
   - Click "Deploy site"

3. **Add Environment Variables**
   - Go to Site settings → Environment
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Redeploy

### Option B: Drag & Drop

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Create deployment zip**
   ```bash
   # On macOS/Linux:
   zip -r bread-app.zip . \
     -x "node_modules/*" ".next/*" ".git/*" "*.env*"
   
   # On Windows (use 7-Zip or built-in):
   # Right-click folder → Send to → Compressed folder
   ```

3. **Deploy**
   - Go to [netlify.com/drop](https://netlify.com/drop)
   - Drag `bread-app.zip` to upload
   - Wait for build completion
   - Add environment variables in site settings
   - ✅ Done!

## Testing the System

### Complete Workflow Test

1. **Create Order** (as Salesman)
   - Dashboard → Create Order → Add products → Submit

2. **Dispatch** (as Factory)
   - Dashboard → Dispatch → Confirm quantities

3. **Acknowledge** (as Salesman)
   - Dashboard → Acknowledge → Confirm

4. **Verify** (as Accountant)
   - Dashboard → Verify → Approve or Flag

5. **Invoice** (as Salesman)
   - Dashboard → Invoices → Upload PDF

## Troubleshooting

### "Port 3000 already in use"
```bash
# Use different port
npm run dev -- -p 3001
```

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Can't connect to Supabase"
- Verify `.env.local` has correct credentials
- Check Supabase project is running (not paused)
- Verify network/firewall allows connections

### "RLS Policy Violation"
- Ensure admin user was created in users table
- Verify RLS policies applied correctly
- Check user role matches expected role

### "Orders not showing"
- Verify assigned route matches
- Check order_date is today
- Review audit logs in Supabase

## Production Checklist

Before going live:

- [ ] Test login with all roles
- [ ] Test complete order workflow
- [ ] Set up backups (Supabase)
- [ ] Configure error tracking
- [ ] Set up monitoring
- [ ] Enable 2FA for admin
- [ ] Update admin password
- [ ] Configure email alerts
- [ ] Test on mobile devices
- [ ] Train staff on features

## Customization

### Add Your Bakery Name

Edit `src/components/layout/Sidebar.tsx`:
```typescript
<h1 className="text-2xl font-bold text-amber-900">Your Bakery Name</h1>
```

### Change Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: "#YourHexColor",
  secondary: "#YourHexColor",
}
```

### Add Products

In Supabase **SQL Editor**:
```sql
INSERT INTO products (name, description, unit_price)
VALUES ('Your Product', 'Description', 2.50);
```

### Add Routes

In app, go to **Routes** → **New Route** → Add name and description

## Support Resources

- **Supabase Help**: [supabase.com/support](https://supabase.com/support)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **This Project**: See `DEPLOYMENT.md` and `schema.sql`

## What's Included

✅ 13 database tables with RLS policies
✅ User management system
✅ Order management workflow
✅ Delivery dispatch system
✅ Verification system
✅ Invoice management
✅ Comprehensive audit logging
✅ Mobile-responsive UI
✅ Netlify-ready deployment
✅ Production security features

## Next Steps

1. ✅ Complete Steps 1-7 above
2. ✅ Test login and create users
3. ✅ Test order workflow
4. ✅ Deploy to Netlify
5. ✅ Train team
6. ✅ Go live!

---

**You're all set!** 🎉

Any questions? Check `DEPLOYMENT.md` or the README.

Happy distributing! 🍞
