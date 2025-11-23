"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import PriceBulkEditor from "@/components/admin/PriceBulkEditor";
import toast from "react-hot-toast";

export default function PricesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Price Management</h1>
        <p className="text-gray-600 mt-1">Bulk update product prices</p>
      </div>

      <PriceBulkEditor products={products} onUpdate={fetchProducts} />
    </div>
  );
}

