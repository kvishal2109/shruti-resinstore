import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/admin/auth";
import * as BlobProducts from "@/lib/blob/products";

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const products = await BlobProducts.getAllProducts();
    const categories = await BlobProducts.getAllCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const body = await request.json();
    const { oldCategory, newCategory } = body;

    if (!oldCategory || !newCategory) {
      return NextResponse.json(
        { error: "oldCategory and newCategory are required" },
        { status: 400 }
      );
    }

    if (oldCategory === newCategory) {
      return NextResponse.json(
        { error: "Old and new category names cannot be the same" },
        { status: 400 }
      );
    }

    await BlobProducts.bulkUpdateCategory(oldCategory, newCategory);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json(
        { error: "Category parameter is required" },
        { status: 400 }
      );
    }

    await BlobProducts.deleteCategory(category);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}

