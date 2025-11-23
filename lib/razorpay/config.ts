import Razorpay from "razorpay";

// Initialize Razorpay instance (server-side only)
export function getRazorpayInstance() {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("RAZORPAY_KEY_SECRET is not set");
  }

  return new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Create Razorpay order
export async function createRazorpayOrder(
  amount: number,
  receipt: string
): Promise<{ id: string; amount: number; currency: string }> {
  const razorpay = getRazorpayInstance();

  const options = {
    amount: amount * 100, // Convert to paise
    currency: "INR",
    receipt: receipt,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    return {
      id: order.id,
      amount: typeof order.amount === "number" ? order.amount : parseInt(order.amount.toString()),
      currency: order.currency,
    };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
}

// Verify payment signature
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const crypto = require("crypto");
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(orderId + "|" + paymentId)
    .digest("hex");

  return generatedSignature === signature;
}

