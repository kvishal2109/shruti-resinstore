# Quick Start Guide

## Minimum Setup (5 Minutes)

### 1. Firebase Setup (3 minutes)

1. Go to https://console.firebase.google.com/
2. Create new project → Name it → Continue → Create
3. Enable **Firestore Database** → Start in test mode → Enable
4. **Storage is optional** - You can skip it and use free image URLs (Unsplash/Pexels)
   - OR enable Storage if you want (requires Blaze plan, but has free tier)
5. Get config: Project Settings → Your apps → Web icon → Register → Copy config

### 2. Environment Variables (1 minute)

Create `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=paste_from_firebase
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=paste_from_firebase
NEXT_PUBLIC_FIREBASE_PROJECT_ID=paste_from_firebase
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=paste_from_firebase
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=paste_from_firebase
NEXT_PUBLIC_FIREBASE_APP_ID=paste_from_firebase

NEXT_PUBLIC_APP_NAME=My Store
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Add One Product (1 minute)

1. Firebase Console → Firestore Database
2. Start collection → ID: `products` → Next
3. Add fields:
   - `name` (string): "Test Product"
   - `description` (string): "Test description"
   - `price` (number): 999
   - `image` (string): "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
     *(Get free images from unsplash.com - right-click image → Copy image address)*
   - `category` (string): "Electronics"
   - `inStock` (boolean): true
   - `createdAt` (timestamp): Click timestamp
   - `updatedAt` (timestamp): Click timestamp
4. Save

### 4. Run App

```bash
npm install
npm run dev
```

Open http://localhost:3000

✅ Done! You can now browse products, add to cart, and use wishlist.

---

## What You Can Do Now

- ✅ Browse products
- ✅ Search and filter
- ✅ Add to cart
- ✅ Wishlist items
- ✅ View product details
- ✅ Fill checkout form

## What's Missing (Needs Owner Approval)

- ❌ Payment processing
- ❌ Email notifications
- ❌ Complete order creation

These will be added when you get owner's consent and API keys.

