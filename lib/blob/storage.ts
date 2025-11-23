import { put, del, list } from "@vercel/blob";

const BLOB_STORE_PREFIX = "store-data";

// Products storage
const PRODUCTS_BLOB_PATH = `${BLOB_STORE_PREFIX}/products.json`;
// Orders storage  
const ORDERS_BLOB_PATH = `${BLOB_STORE_PREFIX}/orders.json`;

/**
 * Products Storage Functions
 */
export async function getProductsBlob(): Promise<any[]> {
  try {
    // Try to find the blob by listing with prefix
    const { blobs } = await list({ prefix: PRODUCTS_BLOB_PATH });
    
    if (blobs.length === 0) {
      // Blob doesn't exist yet
      return [];
    }
    
    // Get the blob URL (should be only one)
    const blob = blobs[0];
    
    // Fetch the JSON data from the blob URL
    const response = await fetch(blob.url, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    // If error is about blob not found, return empty array
    if (error.status === 404 || error.message?.includes("not found")) {
      return [];
    }
    console.error("Error reading products from blob:", error);
    return [];
  }
}

export async function saveProductsBlob(products: any[]): Promise<void> {
  try {
    const jsonData = JSON.stringify(products, null, 2);
    await put(PRODUCTS_BLOB_PATH, jsonData, {
      access: "public",
      contentType: "application/json",
    });
  } catch (error) {
    console.error("Error saving products to blob:", error);
    throw error;
  }
}

/**
 * Orders Storage Functions
 */
export async function getOrdersBlob(): Promise<any[]> {
  try {
    // Try to find the blob by listing with prefix
    const { blobs } = await list({ prefix: ORDERS_BLOB_PATH });
    
    if (blobs.length === 0) {
      // Blob doesn't exist yet
      return [];
    }
    
    // Get the blob URL (should be only one)
    const blob = blobs[0];
    
    // Fetch the JSON data from the blob URL
    const response = await fetch(blob.url, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    // If error is about blob not found, return empty array
    if (error.status === 404 || error.message?.includes("not found")) {
      return [];
    }
    console.error("Error reading orders from blob:", error);
    return [];
  }
}

export async function saveOrdersBlob(orders: any[]): Promise<void> {
  try {
    const jsonData = JSON.stringify(orders, null, 2);
    await put(ORDERS_BLOB_PATH, jsonData, {
      access: "public",
      contentType: "application/json",
    });
  } catch (error) {
    console.error("Error saving orders to blob:", error);
    throw error;
  }
}

/**
 * Image Upload - Generate upload URL for client-side upload
 * Returns a URL that the client can POST to directly
 */
export async function generateImageUploadUrl(
  fileName: string,
  folder: string = "products"
): Promise<{ url: string; path: string }> {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileName.split(".").pop() || "jpg";
    const blobPath = `${BLOB_STORE_PREFIX}/${folder}/${timestamp}-${randomString}.${fileExtension}`;
    
    // Create a temporary blob to get the upload URL
    // The client will upload directly to this URL
    const { url } = await put(blobPath, new Blob(), {
      access: "public",
      contentType: "image/jpeg",
      addRandomSuffix: false,
    });
    
    return { url, path: blobPath };
  } catch (error) {
    console.error("Error generating upload URL:", error);
    throw error;
  }
}

/**
 * Delete image from blob storage
 */
export async function deleteImageBlob(blobUrl: string): Promise<void> {
  try {
    // Extract blob path from URL
    const url = new URL(blobUrl);
    const pathMatch = url.pathname.match(/\/([^?]+)/);
    if (pathMatch) {
      const blobPath = pathMatch[1];
      await del(blobPath);
    }
  } catch (error) {
    console.error("Error deleting image from blob:", error);
    // Don't throw - image deletion is not critical
  }
}

/**
 * List all images in a folder (for cleanup/admin)
 */
export async function listImagesBlob(folder: string = "products"): Promise<string[]> {
  try {
    const prefix = `${BLOB_STORE_PREFIX}/${folder}/`;
    const { blobs } = await list({ prefix });
    return blobs.map((blob) => blob.url);
  } catch (error) {
    console.error("Error listing images:", error);
    return [];
  }
}

