# Deploy to Vercel - Step by Step Guide

## Quick Deployment (5 minutes)

### Option 1: Deploy via Vercel Website (Easiest - Recommended)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Click "Sign Up" or "Log In"
   - **Use "Continue with GitHub"** (easiest since your code is already on GitHub)

2. **Import Your Repository**
   - After logging in, click **"Add New..."** → **"Project"**
   - Find your repository: `kvishal2109/resin-store`
   - Click **"Import"**

3. **Configure Project**
   - **Framework Preset**: Should auto-detect "Next.js" ✅
   - **Root Directory**: Leave as `./` (default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - Click **"Deploy"** (don't add environment variables yet)

4. **Wait for First Deployment**
   - Vercel will build and deploy your app
   - This will fail initially (missing environment variables) - that's OK!

5. **Set Up Vercel Blob Storage**
   - Go to your project dashboard on Vercel
   - Click **"Storage"** tab
   - Click **"Create Database"**
   - Select **"Blob"**
   - Choose a region (e.g., `bom1` for India, `iad1` for US)
   - Click **"Create"**
   - Copy the **`BLOB_READ_WRITE_TOKEN`** (starts with `vercel_blob_`)

6. **Add Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Add these variables (click "Add" for each):

   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxxxxxxxxxx
   ```
   (Paste the token you copied from step 5)

   Optional (but recommended):
   ```
   ADMIN_PASSWORD=your_secure_password_here
   ADMIN_PHONE=+917355413604
   NEXT_PUBLIC_APP_NAME=magi.cofresin
   NEXT_PUBLIC_UPI_ID=shrutikumari21370@okaxis
   ```

   For email notifications (optional):
   ```
   RESEND_API_KEY=your_resend_api_key
   OWNER_EMAIL=your_email@example.com
   ```

   For SMS OTP (optional):
   ```
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

7. **Redeploy**
   - Go to **Deployments** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**
   - Or push a new commit to trigger auto-deployment

8. **Done! 🎉**
   - Your app will be live at: `https://your-project-name.vercel.app`
   - You can add a custom domain later in Settings → Domains

---

### Option 2: Deploy via Vercel CLI (Command Line)

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - It will ask to link to existing project or create new one
   - Choose your preferences

4. **Add Environment Variables**:
   ```bash
   vercel env add BLOB_READ_WRITE_TOKEN
   # Paste your token when prompted
   ```

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

---

## After Deployment

### Automatic Deployments
- Every time you push to GitHub, Vercel will automatically deploy
- You can see deployments in the Vercel dashboard
- Each deployment gets a unique URL for preview

### Making Changes
1. Make changes locally
2. Commit: `git add . && git commit -m "your message"`
3. Push: `git push origin master`
4. Vercel automatically deploys! 🚀

### Update Environment Variables
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add/Edit variables
- Redeploy to apply changes

---

## Required vs Optional Environment Variables

### ✅ Required
- `BLOB_READ_WRITE_TOKEN` - **MUST HAVE** for app to work

### ⚙️ Optional (has defaults)
- `ADMIN_PASSWORD` - Defaults to "admin123"
- `ADMIN_PHONE` - Defaults to "+917355413604"
- `NEXT_PUBLIC_APP_NAME` - Defaults to "magi.cofresin"
- `NEXT_PUBLIC_UPI_ID` - Defaults to "shrutikumari21370@okaxis"

### 📧 Optional (for email features)
- `RESEND_API_KEY` - For sending order emails
- `OWNER_EMAIL` - Owner email for notifications

### 📱 Optional (for SMS OTP)
- `TWILIO_ACCOUNT_SID` - For admin password reset OTP
- `TWILIO_AUTH_TOKEN` - For admin password reset OTP
- `TWILIO_PHONE_NUMBER` - Twilio phone number

---

## Troubleshooting

### Build Fails
- Check the build logs in Vercel dashboard
- Make sure all dependencies are in `package.json`
- Check for TypeScript errors

### App Works But No Data
- Verify `BLOB_READ_WRITE_TOKEN` is set correctly
- Check Vercel Storage dashboard to see if blob exists
- First deployment will create empty blob files

### Images Not Loading
- Check if images are uploaded to Vercel Blob
- Verify blob storage is set up correctly
- Check browser console for errors

---

## Free Tier Limits

✅ **Vercel Free Tier Includes:**
- Unlimited deployments
- 100GB bandwidth/month
- Automatic SSL certificates
- Custom domains
- Preview deployments for every commit
- 1GB Vercel Blob storage (free)

Perfect for small to medium stores! 🎉

