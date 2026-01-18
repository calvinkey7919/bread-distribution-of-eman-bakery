# Eman Bakery Distribution Management System

A complete, production-ready business application for managing bread distribution operations, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### Authentication & User Management
- ✅ Role-based access control (Admin, Salesman, Factory, Accountant)
- ✅ Secure authentication with Supabase Auth
- ✅ User creation and management interface
- ✅ Route assignment for salesmen
- ✅ Comprehensive audit logging

### Core Functionality
- ✅ **Admin Dashboard**: Overview of all 10 routes with real-time status
- ✅ **Salesman Portal**: Order creation, delivery acknowledgement, invoice upload
- ✅ **Factory Portal**: Order dispatch with quantity tracking
- ✅ **Accountant Portal**: Delivery verification and flagging
- ✅ Route management with assignment history
- ✅ Product management
- ✅ Daily closing and record locking

### Mobile-First Design
- ✅ Responsive design for all screen sizes
- ✅ Bottom navigation on mobile devices
- ✅ Card-based dashboards
- ✅ Native app-like experience

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Netlify account for deployment (free tier works)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/calvinkey7919/bread-distribution-of-eman-bakery.git
cd bread-distribution-of-eman-bakery
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create Supabase Project
1. Go to https://supabase.com and sign in
2. Create a new project
3. Wait for the project to be ready
4. Save your project credentials

#### Apply Database Schema
1. Open Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Paste and run the SQL script
4. Verify all tables, functions, and views are created

#### Create Storage Bucket
1. Go to Storage section
2. Create a new bucket named `invoices`
3. Set bucket to Private
4. Apply storage policies (see `supabase/README.md`)

#### Create Admin User
1. Go to Authentication section
2. Add new user:
   - Email: `admin@emanbakery.com` (or your preferred email)
   - Password: Set a secure password
   - Auto Confirm User: Yes
3. Copy the User ID (UUID)
4. In SQL Editor, run:
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

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_NAME="Eman Bakery Distribution System"
```

Get these values from:
- Supabase Dashboard → Project Settings → API

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Login with your admin credentials!

## 🌐 Deployment to Netlify

### Option 1: Drag and Drop (Easiest)

1. Build the production version:
   ```bash
   npm run build
   ```

2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

3. Deploy:
   ```bash
   netlify deploy --prod
   ```

4. Follow prompts and select the `.next` folder when asked

5. Add environment variables in Netlify Dashboard:
   - Go to Site Settings → Environment Variables
   - Add all variables from `.env.local`

### Option 2: GitHub Integration

1. Push code to GitHub
2. Go to Netlify Dashboard
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables
7. Deploy!

## 📱 User Roles & Capabilities

### Admin
- View dashboard with all routes
- Manage users (create, edit, deactivate)
- Assign salesmen to routes
- View reports and analytics
- Close business days
- Access audit logs

### Salesman
- Create orders for assigned route
- View order history
- Acknowledge deliveries
- Upload sales invoices
- Cannot create new orders until deliveries are acknowledged

### Factory
- View pending orders
- Dispatch deliveries with actual quantities
- Track ordered vs delivered quantities
- View dispatch history

### Accountant
- Verify acknowledged deliveries
- Flag issues with deliveries
- View verification history

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema with:
- 13 core tables
- Row Level Security (RLS) policies on all tables
- Automated triggers for timestamps and number generation
- Views for reporting
- Complete audit trail

See `supabase/schema.sql` for full details.

## 🔒 Security Features

- ✅ Row Level Security (RLS) enforced on all tables
- ✅ Role-based access control
- ✅ Secure authentication with Supabase
- ✅ Audit logging for all critical actions
- ✅ Encrypted file storage
- ✅ Server-side validation
- ✅ No client-side trust

## 📊 Reports Available

- Daily Operations Report
- Route Performance
- Salesman Performance
- Product Movement
- Shortage/Excess Analysis
- Route Assignment History

## 🛣️ Application Routes

```
/                           → Redirects to login
/auth/login                 → Login page
/admin                      → Admin dashboard
/admin/users                → User management
/admin/routes               → Route management
/admin/reports              → Reports
/admin/closing              → Daily closing
/salesman                   → Salesman dashboard
/salesman/orders/create     → Create order
/salesman/acknowledgements  → Acknowledge deliveries
/salesman/invoices          → Upload invoices
/factory                    → Factory dashboard
/factory/orders             → Pending orders
/accountant                 → Accountant dashboard
/accountant/verify          → Verify deliveries
```

## 🔧 Development

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin pages
│   ├── salesman/          # Salesman pages
│   ├── factory/           # Factory pages
│   ├── accountant/        # Accountant pages
│   └── auth/              # Authentication pages
├── components/            # React components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                  # Utility libraries
├── utils/                # Helper functions
├── supabase/             # Database schema and setup
└── public/               # Static assets
```

### Tech Stack
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Deployment**: Netlify
- **Authentication**: Supabase Auth with RLS

## 📝 License

This project is proprietary software for Eman Bakery.

## 🤝 Support

For support or questions:
- Check the `supabase/README.md` for database setup help
- Review application logs in Supabase Dashboard
- Contact your system administrator

## 🎯 Next Steps After Deployment

1. Create additional users for salesmen, factory, and accountant roles
2. Assign salesmen to routes
3. Configure products as needed
4. Start daily operations:
   - Salesmen create orders
   - Factory dispatches deliveries
   - Salesmen acknowledge receipts
   - Accountants verify deliveries
   - Salesmen upload invoices
   - Admin closes business day

## ✨ Production Ready

This application is designed for immediate production use with:
- Complete authentication and authorization
- Comprehensive data validation
- Audit logging
- Mobile-responsive design
- Role-based workflows
- Real-time updates
- Secure file storage
- Daily closing mechanisms

---

Built with ❤️ for Eman Bakery
