"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { formatCurrency, calculateDiscount } from "@/lib/utils/format";
import {
  addToCart,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "@/lib/utils/cart";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    setInWishlist(isInWishlist(product.id));
  }, [product.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success("Added to cart!");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product.id);
      toast.success("Added to wishlist!");
    }
    setInWishlist(!inWishlist);
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-400 hover:scale-105 transform"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200/30 to-transparent rounded-bl-full z-0"></div>
        <div className="relative w-full h-full z-10">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {discount}% OFF
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded font-semibold">
              Out of Stock
            </span>
          </div>
        )}
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              inWishlist ? "fill-pink-500 text-pink-500 scale-110" : "text-gray-600 hover:text-pink-400"
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWishlistToggle}
              className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl hover:scale-110"
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-5 h-5 transition-all ${
                  inWishlist ? "fill-white" : ""
                }`}
              />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-110"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

