import { collection, addDoc, doc, getDoc, getDocs, query, orderBy, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "./config";
import { Order, CheckoutFormData, CartItem } from "@/types";

const ORDERS_COLLECTION = "orders";

// Create a new order
export async function createOrder(
  customerData: CheckoutFormData,
  items: CartItem[],
  totalAmount: number,
  razorpayOrderId?: string,
  subtotal?: number,
  discount?: number,
  couponCode?: string
): Promise<string> {
  try {
    if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      throw new Error("Firebase not initialized");
    }
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const orderData = {
      orderNumber,
      customer: {
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email,
        address: {
          street: customerData.street,
          city: customerData.city,
          state: customerData.state,
          pincode: customerData.pincode,
        },
      },
      items: items.map((item) => ({
        productId: item.productId,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
        },
        quantity: item.quantity,
      })),
      subtotal: subtotal || totalAmount,
      discount: discount || 0,
      couponCode: couponCode || null,
      totalAmount,
      paymentStatus: "pending" as const,
      orderStatus: "pending" as const,
      razorpayOrderId: razorpayOrderId || null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      throw new Error("Firebase not initialized");
    }
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      return null;
    }
    
    const data = orderSnap.data();
    return {
      id: orderSnap.id,
      ...data,
      subtotal: data.subtotal || data.totalAmount || 0,
      discount: data.discount || 0,
      couponCode: data.couponCode || undefined,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
}

// Update order payment status
export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: "pending" | "paid" | "failed",
  paymentId?: string
): Promise<void> {
  try {
    if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      throw new Error("Firebase not initialized");
    }
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      paymentStatus,
      paymentId: paymentId || null,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating order payment status:", error);
    throw error;
  }
}

// Admin functions - Get all orders
export async function getAllOrders(): Promise<Order[]> {
  try {
    if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      throw new Error("Firebase not initialized");
    }
    
    const ordersRef = collection(db, ORDERS_COLLECTION);
    
    // Try to get orders with orderBy, but handle case where createdAt might not exist
    let snapshot;
    try {
      const q = query(ordersRef, orderBy("createdAt", "desc"));
      snapshot = await getDocs(q);
    } catch (error: any) {
      // If orderBy fails (e.g., no index or no createdAt field), just get all documents
      console.warn("Could not order by createdAt, fetching all orders:", error.message);
      snapshot = await getDocs(ordersRef);
    }
    
    const orders = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        subtotal: data.subtotal || data.totalAmount || 0,
        discount: data.discount || 0,
        couponCode: data.couponCode || undefined,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Order;
    });
    
    // Sort manually if orderBy failed
    orders.sort((a, b) => {
      const aTime = a.createdAt.getTime();
      const bTime = b.createdAt.getTime();
      return bTime - aTime; // Descending order
    });
    
    return orders;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
}

// Admin functions - Update order status
export async function updateOrderStatus(
  orderId: string,
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
): Promise<void> {
  try {
    if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      throw new Error("Firebase not initialized");
    }
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      orderStatus,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}
