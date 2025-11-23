import { ref, uploadBytes, getDownloadURL, deleteObject, getStorage } from "firebase/storage";
import { initializeApp, getApps } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Get storage instance (works on server-side)
function getStorageInstance() {
  let app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  return getStorage(app);
}

// Upload image to Firebase Storage
export async function uploadImage(
  file: File | Buffer,
  fileName: string,
  path: string = "products"
): Promise<string> {
  try {
    const storage = getStorageInstance();

    // Generate unique filename if not provided
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const finalFileName = fileName || `${timestamp}-${randomString}`;
    const storageRef = ref(storage, `${path}/${finalFileName}`);

    // Convert File to Buffer if needed (for server-side)
    let fileBuffer: Buffer;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } else {
      fileBuffer = file;
    }

    // Upload file
    await uploadBytes(storageRef, fileBuffer);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

// Upload multiple images
export async function uploadImages(
  files: Array<{ file: File | Buffer; fileName: string }>,
  path: string = "products"
): Promise<string[]> {
  try {
    const uploadPromises = files.map(({ file, fileName }) => 
      uploadImage(file, fileName, path)
    );
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
}

// Delete image from Firebase Storage
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    const storage = getStorageInstance();

    // Extract path from URL
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
    
    if (!pathMatch) {
      throw new Error("Invalid image URL");
    }

    const imagePath = decodeURIComponent(pathMatch[1]);
    const imageRef = ref(storage, imagePath);
    
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}

