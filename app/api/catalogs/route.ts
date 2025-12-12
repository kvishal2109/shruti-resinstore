import { NextResponse } from "next/server";

export async function GET() {
  // Catalogs feature removed - using Vercel Blob Storage instead
  return NextResponse.json({ success: true, catalogs: [] });
}
