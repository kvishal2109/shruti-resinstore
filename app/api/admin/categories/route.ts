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

