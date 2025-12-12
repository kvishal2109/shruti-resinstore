// OTP storage (in-memory for simplicity, can be replaced with Redis in production)
const otpStore = new Map<string, { otp: string; expiresAt: number; phone: string }>();

const OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes
const OTP_LENGTH = 6;

// Generate a random 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP for a phone number
export function storeOTP(phone: string, otp: string): void {
  const expiresAt = Date.now() + OTP_EXPIRY_TIME;
  otpStore.set(phone, { otp, expiresAt, phone });
  
  // Clean up expired OTPs
  cleanupExpiredOTPs();
}

// Verify OTP for a phone number
export function verifyOTP(phone: string, otp: string): boolean {
  console.log("[OTP] Verifying OTP for phone:", phone);
  console.log("[OTP] Store keys:", Array.from(otpStore.keys()));
  
  const stored = otpStore.get(phone);
  
  if (!stored) {
    console.log("[OTP] No OTP found for phone:", phone);
    return false;
  }
  
  console.log("[OTP] Found stored OTP, expires at:", new Date(stored.expiresAt).toISOString());
  console.log("[OTP] Current time:", new Date().toISOString());
  console.log("[OTP] Stored OTP:", stored.otp, "Provided OTP:", otp);
  
  if (Date.now() > stored.expiresAt) {
    console.log("[OTP] OTP expired");
    otpStore.delete(phone);
    return false;
  }
  
  if (stored.otp !== otp) {
    console.log("[OTP] OTP mismatch");
    return false;
  }
  
  // OTP verified, remove it
  console.log("[OTP] OTP verified successfully");
  otpStore.delete(phone);
  return true;
}

// Clean up expired OTPs
function cleanupExpiredOTPs(): void {
  const now = Date.now();
  for (const [phone, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(phone);
    }
  }
}

// Get remaining time for OTP (in seconds)
export function getOTPRemainingTime(phone: string): number {
  const stored = otpStore.get(phone);
  if (!stored) {
    return 0;
  }
  
  const remaining = Math.max(0, Math.floor((stored.expiresAt - Date.now()) / 1000));
  return remaining;
}

// Send OTP via SMS using Twilio
export async function sendOTPviaSMS(phone: string, otp: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  
  // If Twilio is not configured, log OTP for development
  if (!accountSid || !authToken || !fromNumber) {
    console.log(`[SMS - Development Mode] OTP for ${phone}: ${otp}`);
    console.log("To enable SMS sending, configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in your environment variables.");
    return; // Don't throw error, just log for development
  }
  
  try {
    // Dynamically import Twilio to avoid issues if not installed
    const twilio = await import('twilio');
    const client = twilio.default(accountSid, authToken);
    
    const message = await client.messages.create({
      body: `Your admin password reset OTP for magi.cofresin is: ${otp}. Valid for 10 minutes. Do not share this code.`,
      from: fromNumber,
      to: phone
    });
    
    console.log(`[SMS] OTP sent successfully to ${phone}. Message SID: ${message.sid}`);
  } catch (error: any) {
    console.error(`[SMS] Error sending OTP to ${phone}:`, error);
    // Log OTP for development/debugging even if SMS fails
    console.log(`[SMS - Fallback] OTP for ${phone}: ${otp}`);
    throw new Error(`Failed to send SMS: ${error.message || 'Unknown error'}`);
  }
}

