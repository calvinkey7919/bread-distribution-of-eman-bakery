# Bread Distribution System - Environment Setup

## Supabase Configuration

Add these environment variables to `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: For Netlify deployment
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Netlify Configuration

This project is configured for Netlify deployment with drag-and-drop support.

### Deploy on Netlify

1. Push this repository to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Set build command: `npm run build`
6. Set publish directory: `.next`
7. Add environment variables in Netlify UI
8. Deploy!

### Or: Drag & Drop Deployment

1. Run: `npm run build && npm run export` (for static export)
2. Drag `.next` folder to Netlify
3. Add environment variables after upload

## Database Setup

### 1. Create Supabase Project

- Go to [supabase.com](https://supabase.com)
- Create a new project
- Wait for provisioning

### 2. Apply Schema

- In Supabase dashboard, go to SQL Editor
- Create new query
- Copy entire contents of `schema.sql` from root
- Run the query
- Wait for completion

### 3. Verify Tables

Tables created:
- `users`
- `routes`
- `products`
- `orders`
- `order_items`
- `deliveries`
- `delivery_items`
- `acknowledgements`
- `verifications`
- `invoices`
- `business_days`
- `audit_logs`
- `route_assignment_history`

## Initial Admin Setup

### 1. Create Admin User

In Supabase dashboard:
1. Go to "Authentication" → "Users"
2. Click "Add user"
3. Email: `admin@bakery.local`
4. Password: (your choice, share securely)
5. Confirm

### 2. Grant Admin Role

In Supabase SQL Editor, run:

```sql
INSERT INTO users (id, email, full_name, role, is_active)
SELECT id, email, email as full_name, 'Admin', true
FROM auth.users
WHERE email = 'admin@bakery.local'
ON CONFLICT (id) DO NOTHING;
```

### 3. Login

- Go to deployed app
- Login with `admin@bakery.local`
- You can now create additional users from the admin panel

## Features Implemented

### Admin Dashboard
- User management (create, edit, deactivate)
- Route management
- Product management
- Daily closing
- Reports and analytics

### Salesman Features
- Order creation (multi-product)
- Order tracking
- Delivery acknowledgement
- Invoice upload
- Personal dashboard

### Factory Features
- Order dispatch
- Delivery quantity input
- Order status tracking

### Accountant Features
- Delivery verification
- Issue flagging
- Reports
- Audit logs

### Security
- Row-Level Security (RLS) on all tables
- Role-based access control
- Audit logging for all actions
- Password-protected authentication

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:3000

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   └── login/
│   ├── dashboard/
│   │   ├── users/
│   │   ├── routes/
│   │   ├── orders/
│   │   ├── dispatch/
│   │   ├── verify/
│   │   ├── invoices/
│   │   └── reports/
│   └── layout.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── BottomNav.tsx
│   └── modals/
├── lib/
│   ├── supabase.ts
│   └── store.ts
└── providers/
    └── SessionProvider.tsx
```

## API Routes Used

All data flows through Supabase PostgreSQL with RLS policies.

### Key Tables

**users**
- Authentication + user metadata
- Roles: Admin, Salesman, Factory, Accountant

**orders**
- Created by salesman
- Status: CREATED → DISPATCHED → ACKNOWLEDGED → VERIFIED → INVOICED → CLOSED

**deliveries**
- Created by factory
- Tracks ordered vs delivered quantities

**verifications**
- Accountant confirms delivery accuracy

**invoices**
- Salesman uploads sales invoice

## Support & Troubleshooting

### Common Issues

1. **"SUPABASE_URL missing"**
   - Add `.env.local` with Supabase credentials
   - Restart dev server

2. **"RLS Policy violation"**
   - Check user role in database
   - Verify RLS policies applied correctly

3. **"Orders not showing"**
   - Check `order_date` filter
   - Verify salesman assignment
   - Check RLS policies

## Next Steps

1. Set up Supabase project
2. Apply schema.sql
3. Create admin user
4. Deploy to Netlify
5. Create test users
6. Begin operations!

---

**System Ready for Production** ✓
