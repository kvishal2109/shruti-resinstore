"use client";

import { useState } from "react";
import { Product } from "@/types";
import { DollarSign } from "lucide-react";
import toast from "react-hot-toast";

interface PriceBulkEditorProps {
  products: Product[];
  onUpdate: () => void;
}

export default function PriceBulkEditor({
  products,
  onUpdate,
}: PriceBulkEditorProps) {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [updateType, setUpdateType] = useState<"percentage" | "fixed">("percentage");
  const [updateValue, setUpdateValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map((p) => p.id)));
    }
  };

  const handleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProducts.size === 0) {
      toast.error("Please select at least one product");
      return;
    }

    if (!updateValue) {
      toast.error("Please enter an update value");
      return;
    }

    setLoading(true);

    try {
      const updates = Array.from(selectedProducts).map((productId) => {
        const product = products.find((p) => p.id === productId);
        if (!product) return null;

        let newPrice = product.price;
        if (updateType === "percentage") {
          const percentage = Number(updateValue);
          newPrice = product.price * (1 + percentage / 100);
        } else {
          const fixed = Number(updateValue);
          newPrice = product.price + fixed;
        }

        return {
          productId,
          price: Math.round(newPrice * 100) / 100,
        };
      }).filter(Boolean) as Array<{ productId: string; price: number }>;

      const response = await fetch("/api/admin/products/bulk-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      toast.success(`Updated ${updates.length} product(s)`);
      setSelectedProducts(new Set());
      setUpdateValue("");
      onUpdate();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update prices");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <DollarSign className="w-5 h-5" />
        <span>Bulk Price Update</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {selectedProducts.size === products.length ? "Deselect All" : "Select All"}
          </button>
          <span className="text-sm text-gray-600">
            {selectedProducts.size} product(s) selected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Type
            </label>
            <select
              value={updateType}
              onChange={(e) => setUpdateType(e.target.value as "percentage" | "fixed")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="percentage">Percentage Change</option>
              <option value="fixed">Fixed Amount Change</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {updateType === "percentage" ? "Percentage (%)" : "Amount (₹)"}
            </label>
            <input
              type="number"
              step={updateType === "percentage" ? "0.1" : "0.01"}
              value={updateValue}
              onChange={(e) => setUpdateValue(e.target.value)}
              placeholder={updateType === "percentage" ? "e.g., 10 for +10%" : "e.g., 100 for +₹100"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || selectedProducts.size === 0}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Updating..." : "Update Prices"}
        </button>
      </form>
    </div>
  );
}

