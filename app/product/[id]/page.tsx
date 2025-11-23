"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/types";
import { getProductById } from "@/lib/blob/products";
import { formatCurrency, calculateDiscount } from "@/lib/utils/format";
import {
  addToCart,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "@/lib/utils/cart";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productData = await getProductById(productId);
        if (!productData) {
          router.push("/");
          return;
        }
        setProduct(productData);
        setInWishlist(isInWishlist(productId));
      } catch (error) {
        console.error("Error fetching product:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`Added ${quantity} item(s) to cart!`);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleWishlistToggle = () => {
    if (!product) return;
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return null;
  }

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl overflow-hidden border border-purple-100 shadow-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Product Info - No name, just description */}
        <div className="space-y-6">
          <div>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">{product.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
                <span className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold border border-amber-200">
                  Save {formatCurrency(product.originalPrice - product.price)}
                </span>
              </>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Category:</span> {product.category}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Availability:</span>{" "}
              {product.inStock ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>
            {product.stock && (
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Stock:</span> {product.stock}{" "}
                units
              </p>
            )}
          </div>

          {/* Quantity Selector */}
          {product.inStock && (
            <div className="flex items-center gap-4">
              <label className="font-semibold">Quantity:</label>
              <div className="flex items-center gap-2 border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <span className="w-4 h-4 flex items-center justify-center">-</span>
                </button>
                <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <span className="w-4 h-4 flex items-center justify-center">+</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-3 rounded-lg border-2 transition-all ${
                inWishlist
                  ? "border-pink-500 bg-pink-50 text-pink-600 shadow-md"
                  : "border-purple-200 hover:border-pink-400 text-gray-600 hover:text-pink-500 hover:bg-pink-50"
              }`}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-6 h-6 ${inWishlist ? "fill-current" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

