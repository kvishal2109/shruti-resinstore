"use client";

import Link from "next/link";
import { ShoppingCart, Heart, Menu, X, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { getCartFromStorage, getCartItemCount } from "@/lib/utils/cart";
import { getWishlistFromStorage } from "@/lib/utils/cart";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateCounts = () => {
      const cart = getCartFromStorage();
      const wishlist = getWishlistFromStorage();
      setCartCount(getCartItemCount(cart));
      setWishlistCount(wishlist.length);
    };

    updateCounts();
    // Update counts when storage changes
    window.addEventListener("storage", updateCounts);
    // Custom event for same-tab updates
    window.addEventListener("cartUpdated", updateCounts);
    window.addEventListener("wishlistUpdated", updateCounts);

    return () => {
      window.removeEventListener("storage", updateCounts);
      window.removeEventListener("cartUpdated", updateCounts);
      window.removeEventListener("wishlistUpdated", updateCounts);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-purple-200/95 backdrop-blur-md shadow-lg border-b border-purple-300/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-purple-900 hover:text-purple-700 transition-colors drop-shadow-sm">
            {process.env.NEXT_PUBLIC_APP_NAME || "magi.cofresin"}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-purple-800 hover:text-purple-900 transition-colors font-medium"
            >
              Products
            </Link>
            <Link
              href="/wishlist"
              className="relative text-purple-800 hover:text-purple-900 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative text-purple-800 hover:text-purple-900 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/admin/login"
              className="text-purple-800 hover:text-purple-900 transition-colors"
              title="Admin Panel"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-purple-800 hover:text-purple-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-purple-300/50">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-purple-800 hover:text-purple-900 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-2 text-purple-800 hover:text-purple-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="w-5 h-5" />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-2 text-purple-800 hover:text-purple-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5" />
                Cart
                {cartCount > 0 && (
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full px-2 py-0.5 font-semibold shadow-md">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                href="/admin/login"
                className="flex items-center gap-2 text-purple-800 hover:text-purple-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                Admin
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

