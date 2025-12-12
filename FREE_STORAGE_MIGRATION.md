# Complete Free Storage Migration Guide

This guide shows you how to replace Vercel Blob Storage with **100% free alternatives**.

## Current Storage Usage

**Vercel Blob Storage is used for:**
1. **JSON Data:**
   - Products (`products.json`)
   - Orders (`orders.json`)
   - Categories metadata (`categories-metadata.json`)
   - Admin password (`admin-password.json`)

2. **Images:**
   - Product images
   - Category images

---

## 🎯 Recommended Solution: Supabase + Cloudinary

### Why This Combination?
- **Supabase:** Free PostgreSQL database (500MB, unlimited API calls)
- **Cloudinary:** 25GB free image storage with CDN
- **Total Cost:** $0 forever (within free tiers)

---

## Option 1: Supabase (Database) + Cloudinary (Images) ⭐ RECOMMENDED

### Part A: Setup Supabase (Free Database)

#### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (free)
4. Create a new project
5. Note your:
   - Project URL: `https://xxxxx.supabase.co`
   - Anon Key: `eyJhbGc...`
   - Service Role Key: `eyJhbGc...` (keep secret!)

#### Step 2: Create Database Tables

Go to Supabase Dashboard → SQL Editor and run:

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

-- Categories metadata table
CREATE TABLE categories_metadata (
  id SERIAL PRIMARY KEY,
  category_name TEXT UNIQUE NOT NULL,
  subcategory_name TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin password table
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

#### Step 3: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

#### Step 4: Add Environment Variables

Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Server-side only
```

---

### Part B: Setup Cloudinary (Free Image Storage)

#### Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com
2. Sign up (free)
3. Go to Dashboard
4. Note your:
   - Cloud Name: `xxxxx`
   - API Key: `123456789`
   - API Secret: `xxxxxxxxxxxxx`

#### Step 2: Install Cloudinary SDK

```bash
npm install cloudinary
```

#### Step 3: Add Environment Variables

Add to `.env.local`:
```env
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=xxxxxxxxxxxxx
```

---

## Option 2: Firebase (Database + Storage) - Alternative

### Why Firebase?
- **Firestore:** Free NoSQL database (1GB storage, 50K reads/day)
- **Firebase Storage:** 5GB free image storage
- **Total Cost:** $0 (within free tier)

### Setup Steps:

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com
   - Create project
   - Enable Firestore Database
   - Enable Storage

2. **Install Firebase SDK**
   ```bash
   npm install firebase
   ```

3. **Add Environment Variables**
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxx.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxx.appspot.com
   FIREBASE_ADMIN_SDK_KEY=xxxxx
   ```

---

## Option 3: JSONBin.io (JSON Only) + ImgBB (Images)

### JSONBin.io (Free JSON Storage)
- **Free Tier:** 10MB storage, 10K requests/month
- **Perfect for:** Small JSON files
- **Setup:** https://jsonbin.io

### ImgBB (Unlimited Free Images)
- **Free Tier:** Unlimited storage, unlimited bandwidth
- **Perfect for:** Image hosting
- **Setup:** https://imgbb.com

---

## Migration Code Examples

I'll create migration scripts and updated storage functions for you. Which option do you prefer?

1. **Supabase + Cloudinary** (Recommended - most robust)
2. **Firebase** (Alternative - simpler setup)
3. **JSONBin + ImgBB** (Simplest - but limited)

Let me know and I'll create the complete migration code!

---

## Free Tier Limits Comparison

| Service | Free Tier | Best For |
|---------|-----------|----------|
| **Supabase** | 500MB DB, unlimited API | JSON data (products, orders) |
| **Cloudinary** | 25GB storage, 25GB bandwidth | Images |
| **Firebase** | 1GB DB, 5GB storage | All-in-one solution |
| **JSONBin** | 10MB, 10K requests | Small JSON files |
| **ImgBB** | Unlimited | Images only |

---

## Recommendation

**Use Supabase + Cloudinary** because:
- ✅ Most generous free tiers
- ✅ Better performance (PostgreSQL)
- ✅ Easy to scale later
- ✅ Professional-grade infrastructure
- ✅ Great documentation

Would you like me to implement the Supabase + Cloudinary migration?

