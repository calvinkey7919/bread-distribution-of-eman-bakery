#!/bin/bash

# Bread Distribution System - Post-install setup
# This script checks dependencies and provides setup guidance

echo "🍞 Bread Distribution System - Setup Check"
echo "=========================================="

# Check Node version
node_version=$(node -v)
echo "✅ Node.js version: $node_version"

# Check npm
npm_version=$(npm -v)
echo "✅ npm version: $npm_version"

# Check for .env.local
if [ -f .env.local ]; then
    echo "✅ .env.local exists"
else
    echo "⚠️  .env.local not found"
    echo "   Run: cp .env.example .env.local"
    echo "   Then edit with your Supabase credentials"
fi

# Check for schema.sql
if [ -f schema.sql ]; then
    echo "✅ schema.sql present"
else
    echo "⚠️  schema.sql not found"
fi

echo ""
echo "📚 Next Steps:"
echo "1. Copy environment template: cp .env.example .env.local"
echo "2. Add your Supabase URL and key to .env.local"
echo "3. Apply schema.sql in Supabase SQL Editor"
echo "4. Create admin user in Supabase Auth"
echo "5. Run: npm run dev"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
