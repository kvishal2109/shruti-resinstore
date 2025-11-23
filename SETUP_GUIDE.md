# Setup Guide (Without Payment & Email)

This guide will help you set up the e-commerce store with Firebase. Payment (Razorpay) and Email (Resend) configuration can be added later when you have owner's consent.

## Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "My Store")
4. Click **"Continue"**
5. **Disable** Google Analytics (optional, you can enable later)
6. Click **"Create project"**
7. Wait for project creation (30-60 seconds)
8. Click **"Continue"**

### 1.2 Enable Firestore Database

1. In Firebase Console, click **"Build"** in the left sidebar
2. Click **"Firestore Database"**
3. Click **"Create database"**
4. Select **"Start in test mode"** (for development)
   - ⚠️ **Important**: For production, you'll need to set up security rules later
5. Choose a **location** (select closest to your users, e.g., `asia-south1` for India)
6. Click **"Enable"**
7. Wait for database creation (30-60 seconds)

### 1.3 Enable Firebase Storage (Optional)

⚠️ **Important**: Firebase Storage requires upgrading to the **Blaze plan** (pay-as-you-go). However, it has a generous **free tier**:
- 5GB storage free
- 1GB/day downloads free
- No credit card required for free tier usage

**Option A: Enable Storage (Recommended for production)**
1. In Firebase Console, click **"Build"** in the left sidebar
2. Click **"Storage"**
3. Click **"Get started"**
4. You'll see "Upgrade project" button
5. Click **"Upgrade project"**
6. Select **Blaze plan** (pay-as-you-go)
7. **No credit card required** if you stay within free tier limits
8. Complete the upgrade process
9. Click **"Next"** (use default security rules for now)
10. Choose the **same location** as Firestore
11. Click **"Done"**

**Option B: Skip Storage (Use external images)**
- You can skip Storage setup for now
- Use free image URLs from Unsplash, Pexels, etc.
- Paste image URLs directly in Firestore `image` field
- No Storage setup needed!
- You can always enable Storage later if needed

### 1.4 Get Firebase Configuration

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **web icon** (`</>`)
5. Register your app:
   - Enter app nickname: "Web App" (or any name)
   - **Don't** check "Also set up Firebase Hosting"
   - Click **"Register app"**
6. You'll see your `firebaseConfig` object. Copy these values:
   ```javascript
   apiKey: "AIza...",
   authDomain: "your-project.firebaseapp.com",
   projectId: "your-project-id",
   storageBucket: "your-project.appspot.com",
   messagingSenderId: "123456789",
   appId: "1:123456789:web:abc123"
   ```

## Step 2: Configure Environment Variables

1. In your project root, create a file named `.env.local`
2. Copy the content from `.env.local.example` and fill in your Firebase values:

```env
# Firebase Configuration (REQUIRED)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Razorpay Configuration (SKIP FOR NOW - Add later)
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Resend Email Configuration (SKIP FOR NOW - Add later)
RESEND_API_KEY=
OWNER_EMAIL=

# App Configuration (REQUIRED)
NEXT_PUBLIC_APP_NAME=Your Store Name
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Replace the Firebase values with your actual values from Step 1.4
4. Set `NEXT_PUBLIC_APP_NAME` to your store name
5. Leave payment and email fields empty for now

## Step 3: Add Sample Products to Firestore

### 3.1 Access Firestore Database

1. In Firebase Console, click **"Build"** > **"Firestore Database"**
2. Click **"Start collection"** (if you see this button)
   OR
   Click the **"+"** button next to "Data" tab

### 3.2 Create Products Collection

1. **Collection ID**: Enter `products` (exactly this name, lowercase)
2. Click **"Next"**

### 3.3 Add Your First Product

Fill in the document fields:

| Field Name | Type | Value | Required |
|------------|------|-------|----------|
| `name` | string | "Sample Product" | ✅ Yes |
| `description` | string | "This is a sample product description" | ✅ Yes |
| `price` | number | 999 | ✅ Yes |
| `originalPrice` | number | 1499 | ❌ Optional |
| `image` | string | "https://images.unsplash.com/photo-..." | ✅ Yes |
| `category` | string | "Electronics" | ✅ Yes |
| `inStock` | boolean | true | ✅ Yes |
| `stock` | number | 50 | ❌ Optional |
| `createdAt` | timestamp | Click "timestamp" button | ✅ Yes |
| `updatedAt` | timestamp | Click "timestamp" button | ✅ Yes |

**How to add fields:**
- Click **"Add field"** for each field
- Enter field name
- Select field type (string, number, boolean, timestamp)
- Enter value
- Click **"Save"**

**For images:**
- Option 1: Use free images from [Unsplash](https://unsplash.com/)
  - Search for product images
  - Right-click image > "Copy image address"
  - Paste URL in `image` field
- Option 2: Upload to Firebase Storage (see Step 4)

### 3.4 Add More Products

1. Click **"Add document"** in the products collection
2. Repeat Step 3.3 for each product
3. Use different categories: "Electronics", "Clothing", "Home", "Books", etc.

## Step 4: Get Product Images

You have two options for product images:

### Option A: Use Free Image URLs (Easiest - No Storage Needed)

1. Go to [Unsplash](https://unsplash.com/) or [Pexels](https://www.pexels.com/)
2. Search for product images (e.g., "headphones", "t-shirt", "water bottle")
3. Click on an image you like
4. Right-click the image → **"Copy image address"** (or use the download/share button)
5. Copy the image URL
6. Paste this URL directly in your product's `image` field in Firestore

**Example URLs:**
- `https://images.unsplash.com/photo-1505740420928-5e560c06d30e`
- `https://images.pexels.com/photos/123456/pexels-photo-123456.jpeg`

✅ **This method requires NO Firebase Storage setup!**

### Option B: Upload to Firebase Storage (If You Enabled Storage)

1. In Firebase Console, click **"Build"** > **"Storage"**
2. Click **"Upload file"**
3. Select your product image
4. Wait for upload to complete
5. Click on the uploaded file
6. Copy the **"Download URL"**
7. Use this URL in your product's `image` field in Firestore

**Note**: This requires Blaze plan (but free tier is generous)

## Step 5: Install Dependencies & Run the App

### 5.1 Install Dependencies

```bash
npm install
```

### 5.2 Run Development Server

```bash
npm run dev
```

### 5.3 Open in Browser

Open [http://localhost:3000](http://localhost:3000)

You should see:
- Your store name in the header
- Product catalog (if you added products)
- Empty cart and wishlist icons

## Step 6: Test the Application

### 6.1 Test Product Catalog

1. Browse products on homepage
2. Use category filters
3. Search for products
4. Click on a product to see details

### 6.2 Test Cart Functionality

1. Click "Add to Cart" on any product
2. See cart count update in header
3. Go to Cart page (`/cart`)
4. Update quantities
5. Remove items

### 6.3 Test Wishlist

1. Click heart icon on products
2. See wishlist count update
3. Go to Wishlist page (`/wishlist`)
4. Add items from wishlist to cart

### 6.4 Test Checkout (Without Payment)

1. Add items to cart
2. Go to checkout (`/checkout`)
3. Fill in customer details
4. Try to proceed to payment
   - ⚠️ **Note**: Payment will fail until Razorpay is configured
   - This is expected behavior

## What Works Now

✅ Product catalog with search and filters  
✅ Shopping cart (add, remove, update quantities)  
✅ Wishlist functionality  
✅ Product detail pages  
✅ Checkout form (collects customer info)  
✅ Responsive design (mobile & desktop)  
✅ All UI/UX features  

## What Needs Owner's Consent

❌ Payment processing (Razorpay)  
❌ Email notifications (Resend)  
❌ Order creation (needs payment to complete)  

## Next Steps (After Owner's Consent)

### When Ready for Payment:

1. Create Razorpay account
2. Get API keys
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

### When Ready for Email:

1. Create Resend account
2. Get API key
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=your_api_key
   OWNER_EMAIL=owner@example.com
   ```

## Troubleshooting

### Products Not Showing

- Check if Firestore collection is named exactly `products` (lowercase)
- Verify all required fields are present
- Check browser console for errors
- Ensure Firebase config in `.env.local` is correct

### Firebase Connection Error

- Verify all Firebase environment variables are set
- Check if Firestore is enabled
- Ensure you're using the correct project ID

### Images Not Loading

- Verify image URLs are valid
- Check if images are publicly accessible
- For Firebase Storage, ensure files are public

### Cart/Wishlist Not Persisting

- This is normal - they use localStorage
- Data persists across page refreshes
- Data is cleared when browser cache is cleared

## Security Note

⚠️ **Important**: The Firestore database is currently in "test mode" which allows read/write access to anyone. Before going to production:

1. Set up proper Firestore Security Rules
2. Restrict access to authenticated users (if needed)
3. Or set up rules that only allow specific operations

For now, test mode is fine for development.

## Need Help?

- Check browser console for errors
- Verify all environment variables are set
- Ensure Firebase services are enabled
- Check that product data structure matches the expected format

