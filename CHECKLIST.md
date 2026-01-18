# 🚀 Deployment Checklist

Use this checklist to ensure proper deployment of the Eman Bakery Distribution Management System.

## Pre-Deployment Setup

### ☑️ Supabase Setup
- [ ] Create Supabase account at https://supabase.com
- [ ] Create new project named "eman-bakery-distribution"
- [ ] Save project credentials (URL and API keys)
- [ ] Open SQL Editor in Supabase Dashboard
- [ ] Copy entire contents of `supabase/schema.sql`
- [ ] Run SQL script (should take 5-10 seconds)
- [ ] Verify 13 tables are created in Table Editor
- [ ] Verify 10 routes exist in `routes` table
- [ ] Verify 10 products exist in `products` table

### ☑️ Storage Setup
- [ ] Go to Storage section in Supabase
- [ ] Create bucket named `invoices` (exact name)
- [ ] Set bucket to Private (not public)
- [ ] Apply storage policies from `supabase/README.md`

### ☑️ Admin User Creation
- [ ] Go to Authentication section in Supabase
- [ ] Click "Add user" → "Create new user"
- [ ] Email: admin@emanbakery.com (or your choice)
- [ ] Set strong password
- [ ] Enable "Auto Confirm User"
- [ ] Copy the User ID (UUID)
- [ ] Go to SQL Editor
- [ ] Run INSERT query to add admin to users table (see DEPLOYMENT.md)
- [ ] Verify admin appears in users table

### ☑️ Local Testing
- [ ] Clone repository to local machine
- [ ] Run `npm install`
- [ ] Create `.env.local` from `.env.example`
- [ ] Add real Supabase credentials to `.env.local`
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Test login with admin credentials
- [ ] Verify admin dashboard loads
- [ ] Test navigation between pages

## Deployment to Netlify

### ☑️ Build Test
- [ ] Run `npm run build` locally
- [ ] Verify build completes successfully
- [ ] Check for any TypeScript errors
- [ ] Check for any build warnings

### ☑️ Netlify Account Setup
- [ ] Create Netlify account at https://netlify.com
- [ ] Install Netlify CLI: `npm install -g netlify-cli`
- [ ] Login to Netlify: `netlify login`

### ☑️ Deploy Application
- [ ] Run `npm run build`
- [ ] Run `netlify deploy --prod`
- [ ] Follow prompts to create new site
- [ ] Name site: `eman-bakery-distribution`
- [ ] Wait for deployment to complete
- [ ] Save the deployment URL

### ☑️ Environment Variables (Netlify)
- [ ] Go to Netlify site settings
- [ ] Navigate to Environment Variables
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Add `NEXT_PUBLIC_APP_NAME`
- [ ] Trigger new deployment

### ☑️ Production Testing
- [ ] Visit deployed URL
- [ ] Test login page loads
- [ ] Login with admin credentials
- [ ] Verify dashboard loads correctly
- [ ] Check mobile responsiveness
- [ ] Test on different devices

## Post-Deployment Setup

### ☑️ Create Additional Users

#### Factory User
- [ ] Go to Supabase → Authentication
- [ ] Create user with email and password
- [ ] Copy User ID
- [ ] Insert into users table with role='Factory'

#### Accountant User
- [ ] Create user in Supabase Auth
- [ ] Copy User ID
- [ ] Insert into users table with role='Accountant'

#### Salesman Users (for each route)
- [ ] Create salesman user in Supabase Auth
- [ ] Copy User ID
- [ ] Get route ID from routes table
- [ ] Insert into users table with role='Salesman' and assigned_route_id
- [ ] Repeat for each route that needs a salesman

### ☑️ Test Complete Workflow

#### As Salesman
- [ ] Login with salesman credentials
- [ ] Verify assigned route is displayed
- [ ] Check dashboard loads correctly
- [ ] Verify cannot create order (needs implementation)

#### As Factory
- [ ] Login with factory credentials
- [ ] Verify pending orders section
- [ ] Check dashboard functionality

#### As Accountant
- [ ] Login with accountant credentials
- [ ] Verify pending verifications section
- [ ] Check dashboard functionality

#### As Admin
- [ ] Login with admin credentials
- [ ] Verify all 10 route cards display
- [ ] Check user management page
- [ ] Verify all users are listed
- [ ] Check route status indicators

### ☑️ Security Verification
- [ ] Verify RLS policies are active (check Supabase)
- [ ] Test that salesmen can't access admin pages
- [ ] Test that factory users can't access salesman pages
- [ ] Verify logout works from all roles
- [ ] Check that unauthenticated users redirect to login

### ☑️ Performance Check
- [ ] Run Lighthouse audit on deployed site
- [ ] Check page load times
- [ ] Verify images load correctly
- [ ] Test navigation responsiveness

## Optional: Custom Domain

### ☑️ Domain Configuration
- [ ] Purchase domain (e.g., distribution.emanbakery.com)
- [ ] Go to Netlify → Domain settings
- [ ] Click "Add custom domain"
- [ ] Follow DNS configuration instructions
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Enable HTTPS (automatic via Netlify)

## Documentation Handoff

### ☑️ Share with Team
- [ ] Share README.md with all users
- [ ] Share DEPLOYMENT.md with technical staff
- [ ] Share login credentials securely
- [ ] Document any custom configurations
- [ ] Provide Supabase dashboard access to admin

## Ongoing Maintenance

### ☑️ Daily Tasks
- [ ] Monitor application for errors
- [ ] Check Netlify deployment logs
- [ ] Review Supabase usage metrics

### ☑️ Weekly Tasks
- [ ] Review audit logs for unusual activity
- [ ] Check database backups (automatic in Supabase)
- [ ] Monitor storage usage

### ☑️ Monthly Tasks
- [ ] Update dependencies: `npm update`
- [ ] Review and optimize database queries
- [ ] Check for security updates

## Troubleshooting

### ☑️ Common Issues

#### Login not working
- [ ] Verify environment variables are set in Netlify
- [ ] Check Supabase project is active
- [ ] Verify user exists in both auth.users and users table
- [ ] Check browser console for errors

#### Dashboard not loading
- [ ] Check RLS policies are enabled
- [ ] Verify user has correct role in users table
- [ ] Check Supabase logs for errors
- [ ] Clear browser cache and cookies

#### "Not authorized" errors
- [ ] Verify RLS policies match schema
- [ ] Check user role is set correctly
- [ ] Ensure user is active (is_active = true)

## Success Criteria

✅ **Deployment is successful when:**
- [ ] All users can login with their credentials
- [ ] All 4 role dashboards load correctly
- [ ] Route cards display on admin dashboard
- [ ] Mobile view works on phones and tablets
- [ ] No console errors on any page
- [ ] Application is accessible from anywhere
- [ ] HTTPS is enabled (green lock icon)
- [ ] Database queries return expected data

## Next Steps After Deployment

1. **Implement Server Actions**
   - See FEATURES.md for detailed implementation guides
   - Start with order creation (highest priority)
   - Follow with delivery dispatch
   - Then acknowledgement and verification
   - Finally invoice upload and reports

2. **Train Users**
   - Conduct training sessions for each role
   - Provide user guides
   - Set up support channels

3. **Monitor & Optimize**
   - Watch for user feedback
   - Optimize slow queries
   - Add features based on needs

---

**Congratulations! You've successfully deployed the Eman Bakery Distribution Management System! 🎉**

For support, refer to DEPLOYMENT.md and PROJECT_SUMMARY.md
