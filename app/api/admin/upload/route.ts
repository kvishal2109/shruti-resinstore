import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/admin/auth";
import { put } from "@vercel/blob";

const BLOB_STORE_PREFIX = "store-data";

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "products";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop() || "jpg";
    const blobPath = `${BLOB_STORE_PREFIX}/${folder}/${timestamp}-${randomString}.${fileExtension}`;

    // Upload file to Vercel Blob
    const blob = await put(blobPath, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}

/**
 * Generate signed URL for client-side upload
 * This allows direct upload from browser (bypasses 4.5MB limit)
 */
export async function GET(request: NextRequest) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName") || "image.jpg";
    const folder = searchParams.get("folder") || "products";

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileName.split(".").pop() || "jpg";
    const blobPath = `${BLOB_STORE_PREFIX}/${folder}/${timestamp}-${randomString}.${fileExtension}`;

    // Generate upload URL for client-side upload
    const { url } = await put(blobPath, new Blob(), {
      access: "public",
      contentType: "image/jpeg",
      addRandomSuffix: false,
    });

    return NextResponse.json({ 
      success: true, 
      uploadUrl: url,
      path: blobPath 
    });
  } catch (error: any) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
