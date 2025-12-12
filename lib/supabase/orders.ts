import { Order } from "@/types";
import { getSupabaseAdmin } from "./client";

/**
 * Get all orders from Supabase
 */
export async function getAllOrders(): Promise<Order[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching orders from Supabase:", error);
      return [];
    }

    if (!data) {
      return [];
    }

    // Convert database format to Order format
    return data.map((row: any) => ({
      id: row.id,
      orderNumber: row.order_number,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      customerEmail: row.customer_email || undefined,
      customerAddress: row.customer_address,
      items: row.items,
      totalAmount: parseFloat(row.total_amount),
      status: row.status || 'pending',
      paymentMethod: row.payment_method || undefined,
      paymentStatus: row.payment_status || 'pending',
      notes: row.notes || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  } catch (error) {
    console.error("Error fetching orders from Supabase:", error);
    return [];
  }
}

/**
 * Get order by ID
 */
export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      orderNumber: data.order_number,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      customerEmail: data.customer_email || undefined,
      customerAddress: data.customer_address,
      items: data.items,
      totalAmount: parseFloat(data.total_amount),
      status: data.status || 'pending',
      paymentMethod: data.payment_method || undefined,
      paymentStatus: data.payment_status || 'pending',
      notes: data.notes || undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return null;
  }
}

/**
 * Create a new order
 */
export async function createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    const supabase = getSupabaseAdmin();
    const orderId = `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const { error } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        order_number: orderData.orderNumber,
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_email: orderData.customerEmail || null,
        customer_address: orderData.customerAddress,
        items: orderData.items,
        total_amount: orderData.totalAmount,
        status: orderData.status || 'pending',
        payment_method: orderData.paymentMethod || null,
        payment_status: orderData.paymentStatus || 'pending',
        notes: orderData.notes || null,
      });

    if (error) {
      throw error;
    }

    return orderId;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

/**
 * Update order
 */
export async function updateOrder(
  orderId: string,
  updates: Partial<Omit<Order, "id" | "createdAt">>
): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.orderNumber !== undefined) updateData.order_number = updates.orderNumber;
    if (updates.customerName !== undefined) updateData.customer_name = updates.customerName;
    if (updates.customerPhone !== undefined) updateData.customer_phone = updates.customerPhone;
    if (updates.customerEmail !== undefined) updateData.customer_email = updates.customerEmail;
    if (updates.customerAddress !== undefined) updateData.customer_address = updates.customerAddress;
    if (updates.items !== undefined) updateData.items = updates.items;
    if (updates.totalAmount !== undefined) updateData.total_amount = updates.totalAmount;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.paymentMethod !== undefined) updateData.payment_method = updates.paymentMethod;
    if (updates.paymentStatus !== undefined) updateData.payment_status = updates.paymentStatus;
    if (updates.notes !== undefined) updateData.notes = updates.notes;

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}

/**
 * Delete order
 */
export async function deleteOrder(orderId: string): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}

