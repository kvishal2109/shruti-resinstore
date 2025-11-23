"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartItem, CheckoutFormData } from "@/types";
import {
  getCartFromStorage,
  getCartTotal,
  clearCart,
} from "@/lib/utils/cart";
import { formatCurrency } from "@/lib/utils/format";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { validateCoupon } from "@/lib/data/coupons";
import { Tag, X } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const cartData = getCartFromStorage();
    if (cartData.length === 0) {
      router.push("/cart");
      return;
    }
    setCart(cartData);
    const subtotalAmount = getCartTotal(cartData);
    setSubtotal(subtotalAmount);
    setTotal(subtotalAmount - discount);
  }, [router, discount]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    const result = validateCoupon(couponCode, subtotal);
    
    if (result.valid && result.discountAmount) {
      setDiscount(result.discountAmount);
      setAppliedCoupon(couponCode.toUpperCase());
      setTotal(subtotal - result.discountAmount);
      toast.success(`Coupon applied! You saved ₹${result.discountAmount}`);
    } else {
      toast.error(result.error || "Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode("");
    setTotal(subtotal);
    toast.success("Coupon removed");
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!formData.street.trim()) {
      toast.error("Please enter your street address");
      return false;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter your city");
      return false;
    }
    if (!formData.state.trim()) {
      toast.error("Please enter your state");
      return false;
    }
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create order and get payment details
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerData: formData,
          items: cart,
          totalAmount: total,
          subtotal: subtotal,
          discount: discount,
          couponCode: appliedCoupon,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const { orderId, razorpayOrder } = await response.json();

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: process.env.NEXT_PUBLIC_APP_NAME || "magi.cofresin",
        description: `Order ${orderId}`,
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              razorpayOrderId: razorpayOrder.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          if (verifyResponse.ok) {
            clearCart();
            toast.success("Order placed successfully!");
            router.push(`/order-success?orderId=${orderId}`);
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#667eea",
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
          },
        },
      };

      // Check if Razorpay is loaded
      if (typeof (window as any).Razorpay === "undefined") {
        toast.error("Payment gateway is loading. Please wait a moment and try again.");
        setLoading(false);
        return;
      }

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        toast.error("Payment failed. Please try again.");
        console.error("Payment failed:", response);
      });
      razorpay.open();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6 border border-purple-100">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm focus:shadow-md transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  maxLength={10}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm focus:shadow-md transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm focus:shadow-md transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <textarea
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm focus:shadow-md transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm focus:shadow-md transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm focus:shadow-md transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  maxLength={6}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm focus:shadow-md transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20 border border-purple-100">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.productId} className="flex gap-3 py-2 border-b">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} × {formatCurrency(item.product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="border-t pt-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Have a coupon code?</h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">
                      {appliedCoupon} Applied
                    </span>
                    <span className="text-xs text-green-600">
                      -{formatCurrency(discount)}
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1 hover:bg-green-100 rounded transition-colors"
                    aria-label="Remove coupon"
                  >
                    <X className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm shadow-sm"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-sm shadow-md hover:shadow-lg"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon})</span>
                  <span className="font-semibold">-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

