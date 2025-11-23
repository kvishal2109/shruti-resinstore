import { NextResponse } from "next/server";
import { getAllCatalogs } from "@/lib/firebase/catalogs";

export async function GET() {
  try {
    const catalogs = await getAllCatalogs();
    return NextResponse.json({ success: true, catalogs });
  } catch (error) {
    console.error("Error fetching catalogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch catalogs" },
      { status: 500 }
    );
  }
}
