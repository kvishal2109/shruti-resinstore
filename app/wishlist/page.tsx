"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import {
  getWishlistFromStorage,
  removeFromWishlist,
} from "@/lib/utils/cart";
import { getAllProducts } from "@/lib/blob/products";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateWishlist = () => {
      const ids = getWishlistFromStorage();
      setWishlistIds(ids);
    };

    updateWishlist();
    window.addEventListener("wishlistUpdated", updateWishlist);
    window.addEventListener("storage", updateWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", updateWishlist);
      window.removeEventListener("storage", updateWishlist);
    };
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const allProducts = await getAllProducts();
        const wishlistProducts = allProducts.filter((p) =>
          wishlistIds.includes(p.id)
        );
        setProducts(wishlistProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    if (wishlistIds.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [wishlistIds]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (wishlistIds.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Start adding products you love!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

