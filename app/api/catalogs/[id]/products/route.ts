import { NextResponse } from "next/server";
import { getProductsByCatalog } from "@/lib/blob/products";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const products = await getProductsByCatalog(params.id);
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products for catalog:", error);
    return NextResponse.json(
      { error: "Failed to fetch products for catalog" },
      { status: 500 }
    );
  }
}
