# Vercel Billing Setup for Blob Storage Overage

## Option 1: Add Payment Method for Overage (CHEAPEST)

This allows you to pay ONLY for what you use beyond the free tier, without upgrading to Pro.

### Steps:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard

2. **Navigate to Billing Settings**
   - Click your profile picture (top-right)
   - Select "Account Settings"
   - Click "Billing" in the left sidebar

3. **Add Payment Method**
   - Click "Add Payment Method"
   - Enter your credit card details
   - Click "Save"

4. **Enable Overage Billing**
   - Scroll to "Blob Storage"
   - Make sure "Allow overage charges" is enabled
   - This will automatically charge you for usage beyond free tier

5. **Set Budget Alerts (Optional)**
   - Click "Budget Alerts"
   - Set a monthly budget (e.g., $5)
   - Get notified if you're approaching the limit

### Pricing for Overage:
- **Storage:** $0.15/GB/month
- **Bandwidth:** $0.20/GB
- **API Calls:** Included in storage pricing

### Example Costs:
- 1GB storage = **$0.15/month**
- 5GB storage = **$0.75/month**
- 10GB storage = **$1.50/month**

**Note:** With your optimizations, you'll likely stay within the FREE tier (1000 calls/month).

---

## Option 2: Upgrade to Pro Plan ($20/month)

**NOT RECOMMENDED unless you need:**
- Team collaboration
- Advanced analytics
- More preview deployments
- Password protection
- Other Pro features

### Steps:

1. Go to Vercel Dashboard → Billing
2. Click "Upgrade to Pro"
3. Enter payment details
4. Confirm subscription

**Cost:** $20/month (fixed)

---

## Option 3: Move Images to External Free Storage (100% FREE)

### Cloudinary (Recommended)

**Free Tier:**
- 25GB storage
- 25GB bandwidth/month
- Automatic optimization
- CDN included

**Setup Steps:**

1. **Sign Up**
   - Go to https://cloudinary.com
   - Create free account

2. **Get Credentials**
   - Go to Dashboard
   - Note your: Cloud name, API Key, API Secret

3. **Add to Environment Variables**
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Install SDK**
   ```bash
   npm install cloudinary
   ```

5. **Upload Images via API**
   ```javascript
   import { v2 as cloudinary } from 'cloudinary';
   
   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET
   });
   
   // Upload
   const result = await cloudinary.uploader.upload(file);
   const imageUrl = result.secure_url;
   ```

### ImgBB (Alternative)

**Free Tier:**
- Unlimited storage
- No bandwidth limits
- Simple to use

**Setup Steps:**

1. **Sign Up**
   - Go to https://imgbb.com
   - Create account

2. **Get API Key**
   - Go to https://api.imgbb.com
   - Get your API key

3. **Add to Environment**
   ```env
   IMGBB_API_KEY=your_api_key
   ```

4. **Upload Images**
   ```javascript
   const formData = new FormData();
   formData.append('image', file);
   
   const response = await fetch(
     `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
     { method: 'POST', body: formData }
   );
   
   const data = await response.json();
   const imageUrl = data.data.url;
   ```

---

## Monitoring Your Usage

### Check Blob Storage Usage:

1. Go to Vercel Dashboard
2. Click "Storage" in left sidebar
3. Click "Blob"
4. View:
   - Total storage used
   - API calls made
   - Bandwidth used
   - Cost estimate

### Set Up Alerts:

1. Go to Billing → Budget Alerts
2. Set monthly limit (e.g., $5)
3. Get email when approaching limit

---

## Recommendation

**Start with Option 1 (Overage Billing)**

After implementing the optimizations:
- You reduced API calls by ~80-85%
- You'll likely use ~500-800 calls/month
- Free tier is 1000 calls/month
- **You should stay within free limits!**

**Only add payment method as backup** in case you exceed limits slightly.

**If you want 100% free forever:** Use Option 3 (Cloudinary/ImgBB)

