import { NextResponse } from "next/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, { params }: Params) {
  // Catalogs feature removed - using Vercel Blob Storage instead
  await params; // Await params to satisfy Next.js 16 type requirements
  return NextResponse.json(
    { error: "Catalog not found" },
    { status: 404 }
  );
}
