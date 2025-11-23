"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getAllProducts } from "@/lib/blob/products";
import { Product } from "@/types";
import { ArrowLeft, Plus, Minus, ShoppingCart, Heart } from "lucide-react";
import { addToCart, addToWishlist, removeFromWishlist, isInWishlist } from "@/lib/utils/cart";
import { formatCurrency } from "@/lib/utils/format";
import { toast } from "react-hot-toast";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function SubcategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.category as string;
  const subcategorySlug = params.subcategory as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchProducts() {
      try {
        const allProducts = await getAllProducts();
        
        // Map slug to category name
        const categoryMap: { [key: string]: string } = {
          "home-decor": "Home Decor",
          "furniture": "Furniture",
          "wedding": "Wedding",
          "jewellery": "Jewellery",
        };

        // Map subcategory slug to name
        const subcategoryNameMap: { [key: string]: string } = {
          // Home Decor
          "signature-clock": "Signature Clock",
          "lamps": "Lamps",
          "geode-art": "Geode Art",
          "name-plates": "Name Plates",
          "mantra-frames": "Mantra Frames",
          "spiritual-wall-hangings": "Spiritual Wall Hangings",
          "lotus-pond-wall-hangings": "Lotus Pond Wall Hangings",
          "nature-sceneries-wall-hangings": "Nature/Sceneries Wall Hangings",
          // Furniture
          "gulab-tables": "Gulab Tables",
          "flowers-tables": "Flowers Tables",
          "wine-bottle-tables": "Wine Bottle Tables",
          "designer-tables": "Designer Tables",
          "geode-tables": "Geode Tables",
          "irregular-shaped-tables": "Irregular Shaped Tables",
          "ocean-theme-tables": "Ocean Theme Tables",
          "chess-tables": "Chess Tables",
          // Wedding
          "platters": "Platters",
          "cards-favours": "Cards & Favours",
          "keepsakes": "Keepsakes",
          "frames": "Frames",
          "decor-items": "Decor Items",
          "accessories": "Accessories",
          "presentation-items": "Presentation Items",
          // Jewellery
          "earrings": "Earrings",
          "pendants": "Pendants",
          "rings": "Rings",
          "bracelets-bangles": "Bracelets & Bangles",
          "anklets": "Anklets",
          "floral-jewellery": "Floral Jewellery",
        };

        const categoryName = categoryMap[categorySlug];
        const subcategoryName = subcategoryNameMap[subcategorySlug];

        const filtered = allProducts.filter(
          (p) => p.category === categoryName && p.subcategory === subcategoryName
        );

        setProducts(filtered);
        
        // Load wishlist
        const wishlist = new Set<string>();
        filtered.forEach((p) => {
          if (isInWishlist(p.id)) {
            wishlist.add(p.id);
          }
        });
        setWishlistItems(wishlist);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    if (categorySlug && subcategorySlug) {
      fetchProducts();
    }
  }, [categorySlug, subcategorySlug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const categoryMap: { [key: string]: string } = {
    "home-decor": "Home Decor",
    "furniture": "Furniture",
    "wedding": "Wedding",
    "jewellery": "Jewellery",
  };

  const subcategoryNameMap: { [key: string]: string } = {
    "signature-clock": "Signature Clock",
    "lamps": "Lamps",
    "geode-art": "Geode Art",
    "name-plates": "Name Plates",
    "mantra-frames": "Mantra Frames",
    "spiritual-wall-hangings": "Spiritual Wall Hangings",
    "lotus-pond-wall-hangings": "Lotus Pond Wall Hangings",
    "nature-sceneries-wall-hangings": "Nature/Sceneries Wall Hangings",
    "gulab-tables": "Gulab Tables",
    "flowers-tables": "Flowers Tables",
    "wine-bottle-tables": "Wine Bottle Tables",
    "designer-tables": "Designer Tables",
    "geode-tables": "Geode Tables",
    "irregular-shaped-tables": "Irregular Shaped Tables",
    "ocean-theme-tables": "Ocean Theme Tables",
    "chess-tables": "Chess Tables",
    "platters": "Platters",
    "cards-favours": "Cards & Favours",
    "keepsakes": "Keepsakes",
    "frames": "Frames",
    "decor-items": "Decor Items",
    "accessories": "Accessories",
    "presentation-items": "Presentation Items",
    "earrings": "Earrings",
    "pendants": "Pendants",
    "rings": "Rings",
    "bracelets-bangles": "Bracelets & Bangles",
    "anklets": "Anklets",
    "floral-jewellery": "Floral Jewellery",
  };

  const categoryName = categoryMap[categorySlug] || categorySlug;
  const subcategoryName = subcategoryNameMap[subcategorySlug] || subcategorySlug;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-purple-800 hover:text-purple-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            {subcategoryName}
          </h1>
          <p className="text-gray-600">
            {categoryName} • {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">No products found in this subcategory.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

