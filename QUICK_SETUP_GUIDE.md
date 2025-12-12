# Quick Setup Guide: Supabase + Cloudinary (Recommended)

## Why This Combination?

✅ **Fastest for users** - PostgreSQL + CDN  
✅ **Easiest for admins** - Beautiful dashboard  
✅ **100% free** - Generous limits  
✅ **Future-proof** - Professional infrastructure  

---

## Step 1: Setup Supabase (5 minutes)

### 1.1 Create Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (free)
4. Create new project
5. Choose a region close to you
6. Wait 2 minutes for setup

### 1.2 Get Your Credentials
1. Go to Settings → API
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon Key**: `eyJhbGc...` (public key)
   - **Service Role Key**: `eyJhbGc...` (keep secret!)

### 1.3 Create Database Tables
1. Go to SQL Editor
2. Click "New Query"
3. Paste this SQL:

```sql
-- Products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount DECIMAL(5,2),
  image TEXT,
  images TEXT[],
  category TEXT NOT NULL,
  subcategory TEXT,
  in_stock BOOLEAN DEFAULT true,
  stock INTEGER,
  catalog_id TEXT,
  catalog_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories metadata
CREATE TABLE categories_metadata (
  id SERIAL PRIMARY KEY,
  category_name TEXT UNIQUE NOT NULL,
  subcategory_name TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin password
CREATE TABLE admin_auth (
  id SERIAL PRIMARY KEY,
  password_hash TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

4. Click "Run" (or press Ctrl+Enter)
5. ✅ Tables created!

---

## Step 2: Setup Cloudinary (5 minutes)

### 2.1 Create Account
1. Go to https://cloudinary.com
2. Click "Sign Up" (free)
3. Fill in details
4. Verify email

### 2.2 Get Your Credentials
1. Go to Dashboard
2. Copy:
   - **Cloud Name**: `xxxxx`
   - **API Key**: `123456789`
   - **API Secret**: `xxxxxxxxxxxxx`

---

## Step 3: Install Dependencies (2 minutes)

```bash
npm install @supabase/supabase-js cloudinary
```

---

## Step 4: Add Environment Variables (2 minutes)

Add to `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=xxxxxxxxxxxxx
```

**Also add to Vercel Environment Variables:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all 6 variables above
3. Redeploy

---

## Step 5: Update Your Code (Already Done!)

I've already created the migration code:
- ✅ `lib/supabase/client.ts` - Supabase client
- ✅ `lib/supabase/products.ts` - Product functions
- ✅ `lib/supabase/orders.ts` - Order functions
- ✅ `lib/cloudinary/client.ts` - Image upload functions

**Next Steps:**
1. Update API routes to use new storage (I'll do this)
2. Update admin upload route to use Cloudinary
3. Run migration script to move existing data

---

## Step 6: Test It Works

1. Start dev server: `npm run dev`
2. Go to admin panel
3. Try creating a product
4. Upload an image
5. ✅ Should work!

---

## Admin Dashboard Features

### Supabase Dashboard:
- **Table Editor** - View/edit products like Excel
- **SQL Editor** - Run custom queries
- **Database Browser** - See all your data
- **Real-time** - See changes instantly

### Cloudinary Dashboard:
- **Media Library** - Browse all images
- **Upload** - Drag & drop images
- **Transform** - Edit images online
- **Analytics** - Track usage

---

## Free Tier Limits

### Supabase:
- ✅ **500MB database** - Enough for 10,000+ products
- ✅ **Unlimited API calls** - No rate limits
- ✅ **2GB bandwidth** - Plenty for small-medium stores

### Cloudinary:
- ✅ **25GB storage** - Thousands of images
- ✅ **25GB bandwidth/month** - Millions of views
- ✅ **Auto optimization** - Saves bandwidth

**Total Cost: $0/month** (within free tiers)

---

## Migration from Vercel Blob

I'll create a migration script to:
1. Export all products from Vercel Blob
2. Import to Supabase
3. Copy images to Cloudinary (optional)
4. Verify data integrity

**Want me to create the migration script?**

---

## Support

- **Supabase Docs:** https://supabase.com/docs
- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Community:** Both have active Discord/Slack communities

---

## Why This is Best

### For Your Users:
- ⚡ **Fastest** - PostgreSQL + CDN
- 🛡️ **Most reliable** - 99.9% uptime
- 🎨 **Best images** - Auto-optimized

### For You (Admin):
- 📊 **Best dashboard** - Visual data management
- 🔍 **Easy queries** - SQL editor
- 📈 **Scalable** - Grows with your business
- 💰 **Free forever** - Within generous limits

**Ready to migrate? Let me know and I'll update all the API routes!**

