# Twilio SMS Setup Guide

## Step 1: Create Twilio Account

1. Go to [https://www.twilio.com/](https://www.twilio.com/)
2. Click "Sign up" and create a free account
3. Verify your email and phone number

## Step 2: Get Your Credentials

1. After logging in, you'll see your **Account SID** and **Auth Token** on the dashboard
2. Copy both values (keep them secure!)

## Step 3: Get a Phone Number

1. In Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. For trial accounts, you can use the free trial number provided
3. Copy the phone number (format: +1234567890)

## Step 4: Add to Environment Variables

Add these lines to your `.env.local` file:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
ADMIN_PHONE=+917355413604
```

**Important:** 
- Replace the values with your actual Twilio credentials
- The `TWILIO_PHONE_NUMBER` is the number Twilio will send FROM
- The `ADMIN_PHONE` is your number that will receive OTPs

## Step 5: Restart Your Server

After adding the environment variables:

```bash
# Stop your current server (Ctrl+C)
# Then restart it
npm run dev
```

## Step 6: Test

1. Go to `/admin/forgot-password`
2. Enter your phone number: `+917355413604`
3. Click "Send OTP"
4. You should receive an SMS with the 6-digit OTP

## Troubleshooting

### OTP not received?
1. Check your terminal console - OTP will be logged there if Twilio isn't configured
2. Verify all environment variables are set correctly
3. Check Twilio console for error messages
4. Make sure your Twilio account has credits (trial accounts have free credits)
5. Verify the phone number format includes country code (+91 for India)

### Twilio Trial Limitations
- Trial accounts can only send SMS to verified phone numbers
- Go to Twilio Console → Phone Numbers → Verified Caller IDs
- Add and verify your phone number (+917355413604)

### Still having issues?
Check the server console logs for detailed error messages.

