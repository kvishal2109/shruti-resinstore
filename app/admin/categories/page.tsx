"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (categories.includes(newCategory.trim())) {
      toast.error("Category already exists");
      return;
    }

    // Note: Categories are managed through products
    // This is a read-only view for now
    toast.success("Add categories by creating products with that category");
    setNewCategory("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-600 mt-1">Manage product categories</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <form onSubmit={handleAddCategory} className="flex space-x-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Category</span>
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-2">
            Note: Categories are automatically created when you add products. To add a new category, create a product with that category name.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Existing Categories ({categories.length})
          </h2>
          {categories.length === 0 ? (
            <p className="text-gray-500">No categories found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <span className="font-medium text-gray-900">{category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

