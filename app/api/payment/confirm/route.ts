import { NextRequest, NextResponse } from "next/server";
import { updateOrderPaymentStatus, getOrderById } from "@/lib/blob/orders";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const orderId = formData.get("orderId") as string;
    const utrNumber = formData.get("utrNumber") as string | null;
    const paymentProof = formData.get("paymentProof") as File | null;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    if (!utrNumber || !utrNumber.trim()) {
      return NextResponse.json(
        { error: "UTR number is required" },
        { status: 400 }
      );
    }

    // Get order to verify it exists
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if payment already submitted
    if (order.paymentStatus === "pending_verification" || order.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "Payment details already submitted for this order" },
        { status: 400 }
      );
    }

    // Upload payment proof if provided
    let paymentProofUrl: string | undefined;
    if (paymentProof) {
      try {
        const blob = await put(
          `payment-proofs/${orderId}-${Date.now()}-${paymentProof.name}`,
          paymentProof,
          {
            access: "public",
            contentType: paymentProof.type,
          }
        );
        paymentProofUrl = blob.url;
      } catch (error) {
        console.error("Error uploading payment proof:", error);
        // Continue even if upload fails
      }
    }

    // Update order with payment details
    // We'll need to extend the updateOrderPaymentStatus function to handle these fields
    // For now, update status to pending_verification
    await updateOrderPaymentStatus(orderId, "pending_verification", utrNumber);

    // Update additional payment fields
    // We need to modify the orders blob directly to add UTR and proof URL
    const { getOrdersBlob, saveOrdersBlob } = await import("@/lib/blob/storage");
    const orders = await getOrdersBlob();
    const orderIndex = orders.findIndex((o: any) => o.id === orderId);
    
    if (orderIndex !== -1) {
      orders[orderIndex].utrNumber = utrNumber.trim();
      if (paymentProofUrl) {
        orders[orderIndex].paymentProofUrl = paymentProofUrl;
      }
      orders[orderIndex].paymentSubmittedAt = new Date();
      orders[orderIndex].updatedAt = new Date();
      
      await saveOrdersBlob(orders);
    }

    return NextResponse.json({
      success: true,
      message: "Payment details submitted successfully",
      orderId,
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { error: "Failed to submit payment details" },
      { status: 500 }
    );
  }
}

