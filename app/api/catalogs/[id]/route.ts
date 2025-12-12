import { NextResponse } from "next/server";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: Params) {
  // Catalogs feature removed - using Vercel Blob Storage instead
  return NextResponse.json(
    { error: "Catalog not found" },
    { status: 404 }
  );
}
