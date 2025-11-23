"use client";

import { useState, useEffect } from "react";
import { CartItem } from "@/types";
import {
  getCartFromStorage,
  updateCartItemQuantity,
  removeFromCart,
  getCartTotal,
  clearCart,
} from "@/lib/utils/cart";
import { formatCurrency } from "@/lib/utils/format";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      const cartData = getCartFromStorage();
      setCart(cartData);
      setTotal(getCartTotal(cartData));
    };

    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    window.addEventListener("storage", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
      window.removeEventListener("storage", updateCart);
    };
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const updatedCart = updateCartItemQuantity(productId, newQuantity);
    setCart(updatedCart);
    setTotal(getCartTotal(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleRemoveItem = (productId: string) => {
    const updatedCart = removeFromCart(productId);
    setCart(updatedCart);
    setTotal(getCartTotal(updatedCart));
    toast.success("Item removed from cart");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">Add some products to get started!</p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col sm:flex-row gap-4 border border-purple-100 hover:border-purple-300 transition-all"
            >
              {/* Product Image */}
              <div className="relative w-full sm:w-24 h-48 sm:h-24 flex-shrink-0">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded"
                  sizes="(max-width: 640px) 100vw, 96px"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">
                  {item.product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {item.product.description}
                </p>
                <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  {formatCurrency(item.product.price)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border rounded-lg">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity - 1)
                      }
                      className="p-2 hover:bg-gray-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity + 1)
                      }
                      className="p-2 hover:bg-gray-100 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="text-lg font-bold">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20 border border-purple-100">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">{formatCurrency(total)}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Apply coupon code at checkout
              </p>
            </div>
            <Link
              href="/checkout"
              className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

