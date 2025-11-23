import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/blob/orders";
import { createRazorpayOrder } from "@/lib/razorpay/config";
import { CheckoutFormData, CartItem } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerData, items, totalAmount, subtotal, discount, couponCode } = body as {
      customerData: CheckoutFormData;
      items: CartItem[];
      totalAmount: number;
      subtotal?: number;
      discount?: number;
      couponCode?: string;
    };

    // Validate input
    if (!customerData || !items || items.length === 0 || !totalAmount) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Create Razorpay order first
    const receipt = `ORDER-${Date.now()}`;
    const razorpayOrder = await createRazorpayOrder(totalAmount, receipt);

    // Create order in Vercel Blob
    const orderId = await createOrder(
      customerData,
      items,
      totalAmount,
      razorpayOrder.id,
      subtotal,
      discount,
      couponCode
    );

    return NextResponse.json({
      success: true,
      orderId,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

