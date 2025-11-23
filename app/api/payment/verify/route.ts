import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay/config";
import {
  updateOrderPaymentStatus,
  getOrderById,
} from "@/lib/blob/orders";
import {
  sendOrderConfirmationToCustomer,
  sendOrderNotificationToOwner,
} from "@/lib/email/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body;

    // Validate input
    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Invalid payment data" },
        { status: 400 }
      );
    }

    // Verify payment signature
    const isValid = verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      await updateOrderPaymentStatus(orderId, "failed");
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Update order payment status
    await updateOrderPaymentStatus(orderId, "paid", razorpayPaymentId);

    // Get order details for email
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Send confirmation emails
    try {
      await sendOrderConfirmationToCustomer(order.customer.email, order.orderNumber, {
        items: order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price * item.quantity,
        })),
        totalAmount: order.totalAmount,
        customerName: order.customer.name || "Customer",
        address: `${order.customer.address.street}, ${order.customer.address.city}, ${order.customer.address.state} ${order.customer.address.pincode}`,
      });

      await sendOrderNotificationToOwner(order.orderNumber, {
        items: order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price * item.quantity,
        })),
        totalAmount: order.totalAmount,
        customerName: order.customer.name || "Customer",
        customerPhone: order.customer.phone,
        customerEmail: order.customer.email,
        address: `${order.customer.address.street}, ${order.customer.address.city}, ${order.customer.address.state} ${order.customer.address.pincode}`,
      });
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      // Don't fail the payment if email fails
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}

