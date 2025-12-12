# E-Commerce Store

A modern, full-stack e-commerce application built with Next.js 14, Vercel Blob Storage, and static QR code payments. Features include product catalog, shopping cart, wishlist, UPI payments via static QR code, and email notifications.

## Features

- 🛍️ **Product Catalog** - Browse products with categories and search
- 🛒 **Shopping Cart** - Add/remove items, update quantities
- ❤️ **Wishlist** - Save favorite products
- 💳 **UPI Payment** - Static QR code payment with manual verification
- 📧 **Email Notifications** - Order confirmations to customer and owner
- 📱 **SMS OTP** - Phone-based OTP for admin password reset
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- 🚀 **Zero Cost Deployment** - Free hosting on Vercel

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Storage**: Vercel Blob Storage (for products, orders, and images)
- **Payment**: Static QR Code (UPI)
- **Email**: Resend
- **SMS**: Twilio (for admin password reset)
- **Hosting**: Vercel (free tier)

## Prerequisites

- Node.js 18+ and npm
- Vercel account (free tier)
- UPI ID and QR code image (for static payment)
- Resend account (free tier)

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Vercel Blob Storage Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to **Storage** → **Create Database** → Select **Blob**
3. Choose a region (e.g., `bom1` for India, `iad1` for US)
4. Copy the `BLOB_READ_WRITE_TOKEN`

### 3. Payment Setup (Static QR Code)

1. Generate a static UPI QR code from your bank or UPI app
2. Upload the QR code image to `public/QR/QR.jpg`
3. Set your UPI ID (currently hardcoded as `shrutikumari21370@okaxis` in payment page)
4. The QR code will be displayed on the payment page for customers to scan

### 4. Resend Setup

1. Go to [Resend](https://resend.com/)
2. Sign up for free account
3. Create an API key
4. Verify your domain (or use their test domain)

### 5. Twilio SMS Setup (for Admin Password Reset)

1. Go to [Twilio](https://www.twilio.com/)
2. Sign up for a free account (includes trial credits)
3. Get your Account SID and Auth Token from the dashboard
4. Get a phone number (Twilio provides a trial number, or purchase one)
5. Add the credentials to your environment variables

**Note:** In development mode, if Twilio is not configured, OTPs will be logged to the console instead of being sent via SMS.

### 6. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxxxxxxxxxx

# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key
OWNER_EMAIL=owner@example.com

# Twilio SMS Configuration (for Admin Password Reset)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Admin Configuration
ADMIN_PHONE=+917209732310
ADMIN_PASSWORD=your_admin_password

# App Configuration
NEXT_PUBLIC_APP_NAME=Your Store Name
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 7. Admin Panel Setup (Vercel Blob)

No Firebase or Firestore is required. The entire admin experience reads and writes
directly to Vercel Blob storage. To get it running:

1. Follow `VERCEL_BLOB_SETUP.md` to provision a Blob store and add
   `BLOB_READ_WRITE_TOKEN` to `.env.local` (and Vercel env vars when deploying).
2. (Optional) Override the default admin password (`admin123`) by setting
   `ADMIN_PASSWORD` in `.env.local`.
3. Start the dev server and visit `/admin`. Log in with the password above to
   add products, upload images, manage inventory, and edit orders—everything is
   persisted to `store-data/products.json`, `store-data/orders.json`, and the
   `store-data/products/` image folder in Blob storage.

If the blob files do not exist yet, the admin APIs will create them automatically
the first time you save data. Hardcoded demo products are served as a fallback
until your own data is written.

### 8. Run Development Server

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
│   ├── blob/            # Vercel Blob storage utilities
│   ├── email/           # Email service
│   ├── admin/           # Admin authentication
│   └── utils/           # Helper functions
├── types/               # TypeScript types
└── public/              # Static assets
```

## Adding Products

Products are managed through the admin panel:

1. Start the development server: `npm run dev`
2. Go to `/admin` and login (password: `admin123`)
3. Click "Add Product" to create new products
4. Upload product images directly from the admin panel (stored in Vercel Blob)
5. All products are automatically saved to Vercel Blob Storage

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
- Static QR code payment
- UPI payment support
- Manual payment verification
- Order confirmation after verification

### Email Notifications
- Customer receives order confirmation
- Owner receives new order notification
- Beautiful HTML email templates

## Cost Breakdown

All services used are on free tiers:
- **Vercel**: Free (hobby plan)
- **Vercel Blob Storage**: Free (1GB storage)
- **Payment**: Static QR code (no transaction fees)
- **Resend**: Free (3,000 emails/month)

## Support

For issues or questions, please check the documentation or create an issue in the repository.

## License

MIT License
