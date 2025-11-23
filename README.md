# E-Commerce Store

A modern, full-stack e-commerce application built with Next.js 14, Firebase, and Razorpay. Features include product catalog, shopping cart, wishlist, UPI payments, and email notifications.

## Features

- 🛍️ **Product Catalog** - Browse products with categories and search
- 🛒 **Shopping Cart** - Add/remove items, update quantities
- ❤️ **Wishlist** - Save favorite products
- 💳 **UPI Payment** - Secure payment via Razorpay with QR code support
- 📧 **Email Notifications** - Order confirmations to customer and owner
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- 🚀 **Zero Cost Deployment** - Free hosting on Vercel

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage (for product images)
- **Payment**: Razorpay
- **Email**: Resend
- **Hosting**: Vercel (free tier)

## Prerequisites

- Node.js 18+ and npm
- Firebase account (free tier)
- Razorpay account (free setup)
- Resend account (free tier)

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database (start in test mode)
4. Enable Firebase Storage
5. Go to Project Settings > General > Your apps
6. Add a web app and copy the configuration

### 3. Razorpay Setup

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Create an account (free)
3. Get your Key ID and Key Secret from Settings > API Keys
4. Enable UPI payment method

### 4. Resend Setup

1. Go to [Resend](https://resend.com/)
2. Sign up for free account
3. Create an API key
4. Verify your domain (or use their test domain)

### 5. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key
OWNER_EMAIL=owner@example.com

# App Configuration
NEXT_PUBLIC_APP_NAME=Your Store Name
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Firebase Firestore Setup

Create the following collections in Firestore:

#### Products Collection
Structure:
```json
{
  "name": "string",
  "description": "string",
  "price": number,
  "originalPrice": number (optional),
  "discount": number (optional),
  "image": "string (URL)",
  "images": ["string"] (optional),
  "category": "string",
  "inStock": boolean,
  "stock": number (optional),
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

#### Orders Collection
Will be created automatically when orders are placed.

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel (Free)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Add all environment variables in Vercel dashboard
5. Deploy!

### Update Environment Variables

After deployment, update `NEXT_PUBLIC_APP_URL` in Vercel environment variables to your production URL.

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── orders/       # Order management
│   │   ├── payment/      # Payment verification
│   │   └── products/     # Product API
│   ├── cart/             # Shopping cart page
│   ├── checkout/         # Checkout page
│   ├── wishlist/         # Wishlist page
│   ├── order-success/    # Order confirmation page
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   └── LoadingSpinner.tsx
├── lib/
│   ├── firebase/        # Firebase utilities
│   ├── razorpay/        # Razorpay integration
│   ├── email/           # Email service
│   └── utils/           # Helper functions
├── types/               # TypeScript types
└── public/              # Static assets
```

## Adding Products

Currently, products need to be added manually to Firebase Firestore. In the future, an admin panel will be added for easy product management.

To add a product:
1. Go to Firebase Console > Firestore
2. Click on "products" collection
3. Click "Add document"
4. Fill in the required fields
5. Upload product images to Firebase Storage and use the download URL

## Features in Detail

### Shopping Cart
- Items stored in localStorage
- Persistent across sessions
- Real-time quantity updates
- Automatic total calculation

### Wishlist
- Save products for later
- Stored in localStorage
- Quick add to cart from wishlist

### Checkout
- No login required
- Collects: name, phone, email, address
- Form validation
- Secure payment processing

### Payment
- Razorpay integration
- UPI QR code support
- Payment verification
- Automatic order confirmation

### Email Notifications
- Customer receives order confirmation
- Owner receives new order notification
- Beautiful HTML email templates

## Cost Breakdown

All services used are on free tiers:
- **Vercel**: Free (hobby plan)
- **Firebase Firestore**: Free (50K reads/day)
- **Firebase Storage**: Free (5GB)
- **Razorpay**: Free setup (2% transaction fee only)
- **Resend**: Free (3,000 emails/month)

## Support

For issues or questions, please check the documentation or create an issue in the repository.

## License

MIT License
