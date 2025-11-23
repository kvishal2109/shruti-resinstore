# Quick Setup Guide

Follow these steps to get your e-commerce store up and running:

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Firebase Setup

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name and continue
4. Enable Google Analytics (optional)
5. Click "Create project"

### Enable Firestore:
1. In Firebase Console, go to "Build" > "Firestore Database"
2. Click "Create database"
3. Start in **test mode** (for development)
4. Choose a location (closest to your users)
5. Click "Enable"

### Enable Storage:
1. In Firebase Console, go to "Build" > "Storage"
2. Click "Get started"
3. Start in **test mode**
4. Use the same location as Firestore
5. Click "Done"

### Get Configuration:
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click the web icon (`</>`)
4. Register app with a nickname
5. Copy the `firebaseConfig` object values

## Step 3: Razorpay Setup

1. Go to https://razorpay.com/
2. Sign up for a free account
3. Complete business verification (can use test mode)
4. Go to Settings > API Keys
5. Generate Key ID and Key Secret
6. Copy both values

**Note**: For testing, use Razorpay's test keys. For production, use live keys.

## Step 4: Resend Setup

1. Go to https://resend.com/
2. Sign up for free account
3. Go to API Keys section
4. Create a new API key
5. Copy the API key

**Note**: Free tier includes 3,000 emails/month. For production, verify your domain.

## Step 5: Create Environment File

Create `.env.local` in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=paste_your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key
OWNER_EMAIL=your-email@example.com

# App Configuration
NEXT_PUBLIC_APP_NAME=My Store
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 6: Add Sample Products

1. Go to Firebase Console > Firestore Database
2. Click "Start collection"
3. Collection ID: `products`
4. Add your first document:

**Document Fields:**
- `name` (string): "Sample Product"
- `description` (string): "This is a sample product description"
- `price` (number): 999
- `originalPrice` (number): 1499 (optional)
- `image` (string): "https://images.unsplash.com/photo-..."
- `category` (string): "Electronics"
- `inStock` (boolean): true
- `createdAt` (timestamp): Click and select "timestamp"
- `updatedAt` (timestamp): Click and select "timestamp"

**For images:**
- Upload to Firebase Storage
- Get download URL
- Use that URL in the `image` field

## Step 7: Run the Application

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Step 8: Test the Flow

1. Browse products on homepage
2. Add products to cart
3. Add products to wishlist
4. Go to cart and proceed to checkout
5. Fill in customer details
6. Test payment (use Razorpay test mode)
7. Verify emails are sent

## Common Issues

### Firebase Connection Error
- Check if all environment variables are set correctly
- Verify Firestore is enabled
- Check Firebase project ID matches

### Razorpay Not Loading
- Check if Razorpay script is loading in browser console
- Verify NEXT_PUBLIC_RAZORPAY_KEY_ID is set
- Check network tab for script loading errors

### Email Not Sending
- Verify RESEND_API_KEY is correct
- Check Resend dashboard for email logs
- Ensure OWNER_EMAIL is a valid email address

### Images Not Loading
- Check if image URLs are valid
- Verify Firebase Storage rules allow read access
- Check Next.js image domain configuration

## Production Deployment

1. Push code to GitHub
2. Go to https://vercel.com/
3. Import your repository
4. Add all environment variables
5. Update `NEXT_PUBLIC_APP_URL` to your production URL
6. Deploy!

## Next Steps

- Add more products to Firestore
- Customize the design
- Set up custom domain
- Configure Firebase Security Rules for production
- Set up Razorpay webhooks (optional)

