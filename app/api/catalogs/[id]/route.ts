import { NextResponse } from "next/server";
import { getCatalogById } from "@/lib/firebase/catalogs";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const catalog = await getCatalogById(params.id);

    if (!catalog) {
      return NextResponse.json(
        { error: "Catalog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, catalog });
  } catch (error) {
    console.error("Error fetching catalog:", error);
    return NextResponse.json(
      { error: "Failed to fetch catalog" },
      { status: 500 }
    );
  }
}
