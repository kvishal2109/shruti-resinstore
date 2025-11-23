# Vercel Blob Storage Setup Guide

## Overview

This application now uses **Vercel Blob Storage** for all data persistence:
- ✅ Products stored in Vercel Blob (JSON file)
- ✅ Orders stored in Vercel Blob (JSON file)
- ✅ Images uploaded to Vercel Blob (client-side uploads)

## Benefits

- **1GB free storage** (perfect for small to medium stores)
- **No per-file size limit** for client-side uploads
- **CDN delivery** for fast image loading
- **No database required** - everything in blob storage
- **Works on Vercel** - seamless integration

## Setup Instructions

### 1. Get Vercel Blob Token

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (or create one)
3. Go to **Settings** → **Storage**
4. Click **Create Database** → Select **Blob**
5. Copy the **BLOB_READ_WRITE_TOKEN**

### 2. Add Environment Variable

Add to your `.env.local` file:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxxxxxxxxxx
```

**For Vercel Deployment:**
- Go to your project **Settings** → **Environment Variables**
- Add `BLOB_READ_WRITE_TOKEN` with your token value
- Deploy again

### 3. Local Development

The token is automatically used by `@vercel/blob` package when:
- Running locally with `.env.local`
- Deployed on Vercel (automatically detected)

## How It Works

### Products & Orders Storage

- Products: Stored as `store-data/products.json` in Vercel Blob
- Orders: Stored as `store-data/orders.json` in Vercel Blob
- Both are public JSON files accessible via CDN
- Automatically falls back to hardcoded products if blob is empty

### Image Uploads

- Images are uploaded **client-side** directly to Vercel Blob
- No 4.5MB limit (server-side uploads have this limit)
- Images stored in `store-data/products/` folder
- All images are public and served via CDN

## Storage Structure

```
store-data/
  ├── products.json          # All products data
  ├── orders.json            # All orders data
  └── products/              # Product images
      ├── 1234567890-abc.jpg
      ├── 1234567891-def.png
      └── ...
```

## Migration from Firebase

If you had data in Firebase:
1. Export your products from Firebase
2. Use the admin panel to add products (they'll be saved to Vercel Blob)
3. Old orders will remain in Firebase (new orders go to Vercel Blob)

## Limits

- **Free Tier**: 1GB storage
- **Pricing**: $0.15/GB/month after free tier
- **Bandwidth**: Included in Vercel plan
- **No per-file limit** for client-side uploads

## Troubleshooting

### "BLOB_READ_WRITE_TOKEN is not set"

- Make sure you've added the token to `.env.local` (local) or Vercel environment variables (deployment)
- Restart your dev server after adding the token

### "Failed to fetch products"

- Check if the blob exists (first run will create it)
- Verify your token has read/write permissions
- Check Vercel dashboard for any errors

### Images not uploading

- Verify `BLOB_READ_WRITE_TOKEN` is set
- Check browser console for errors
- Ensure you're using the admin panel (requires authentication)

## Next Steps

1. ✅ Add `BLOB_READ_WRITE_TOKEN` to environment variables
2. ✅ Deploy to Vercel (or test locally)
3. ✅ Use admin panel to add products
4. ✅ Upload product images
5. ✅ Test order creation

Your application is now **completely database-free** and uses Vercel Blob for all storage! 🎉

