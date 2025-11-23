import { collection, getDocs, doc, getDoc, query, where, orderBy, addDoc, updateDoc, deleteDoc, Timestamp, writeBatch } from "firebase/firestore";
import { db } from "./config";
import { Product } from "@/types";
import { hardcodedProducts } from "@/lib/data/products";

const PRODUCTS_COLLECTION = "products";

// Get all products - uses hardcoded data if Firebase is not configured
export async function getAllProducts(): Promise<Product[]> {
  try {
    // Check if Firebase is configured
    if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      console.log("Using hardcoded products (Firebase not configured)");
      return hardcodedProducts;
    }

    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];

    // If no products in Firestore, return hardcoded products
    if (products.length === 0) {
      console.log("No products in Firestore, using hardcoded products");
      return hardcodedProducts;
    }

    return products;
  } catch (error) {
    console.error("Error fetching products from Firebase, using hardcoded products:", error);
    // Fallback to hardcoded products on error
    return hardcodedProducts;
  }
}

// Get product by ID - uses hardcoded data if Firebase is not configured
export async function getProductById(id: string): Promise<Product | null> {
  try {
    // Check if Firebase is configured
    if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      console.log("Using hardcoded products (Firebase not configured)");
      return hardcodedProducts.find(p => p.id === id) || null;
    }

    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      // Fallback to hardcoded products
      return hardcodedProducts.find(p => p.id === id) || null;
    }
    
    return {
      id: productSnap.id,
      ...productSnap.data(),
      createdAt: productSnap.data().createdAt?.toDate() || new Date(),
      updatedAt: productSnap.data().updatedAt?.toDate() || new Date(),
    } as Product;
  } catch (error) {
    console.error("Error fetching product from Firebase, checking hardcoded products:", error);
    // Fallback to hardcoded products
    return hardcodedProducts.find(p => p.id === id) || null;
  }
}

// Get products by category - uses hardcoded data if Firebase is not configured
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    // Check if Firebase is configured
    if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      console.log("Using hardcoded products (Firebase not configured)");
      return hardcodedProducts.filter(p => p.category === category);
    }

    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];

    // If no products found, return hardcoded products for that category
    if (products.length === 0) {
      return hardcodedProducts.filter(p => p.category === category);
    }

    return products;
  } catch (error) {
    console.error("Error fetching products by category, using hardcoded products:", error);
    // Fallback to hardcoded products
    return hardcodedProducts.filter(p => p.category === category);
  }
}

export async function getProductsByCatalog(catalogId: string): Promise<Product[]> {
  try {
    if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      console.log("Using hardcoded products (Firebase not configured)");
      return hardcodedProducts.filter((p) => p.catalogId === catalogId);
    }

    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where("catalogId", "==", catalogId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[];

    if (products.length === 0) {
      return hardcodedProducts.filter((p) => p.catalogId === catalogId);
    }

    return products;
  } catch (error) {
    console.error("Error fetching products by catalog, using hardcoded products:", error);
    return hardcodedProducts.filter((p) => p.catalogId === catalogId);
  }
}

// Get all categories
export async function getAllCategories(): Promise<string[]> {
  try {
    const products = await getAllProducts();
    const categories = [...new Set(products.map((p) => p.category))];
    return categories.sort();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

// Admin functions - Create a new product
export async function createProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      throw new Error("Firebase not initialized");
    }

    const productRef = collection(db, PRODUCTS_COLLECTION);
    const newProduct = {
      ...productData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(productRef, newProduct);
    return docRef.id;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

// Admin functions - Update an existing product
export async function updateProduct(
  productId: string,
  updates: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  try {
    if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      throw new Error("Firebase not initialized");
    }

    // Check if product exists in Firebase
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      throw new Error(`Product with ID "${productId}" does not exist in Firebase. Please create it first or use a product that exists in Firestore.`);
    }

    // Remove Date objects and convert to Firestore-compatible format
    const firestoreUpdates: any = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        // Skip Date objects - Firestore will handle timestamps
        if (value instanceof Date) {
          firestoreUpdates[key] = Timestamp.fromDate(value);
        } else {
          firestoreUpdates[key] = value;
        }
      }
    }

    await updateDoc(productRef, {
      ...firestoreUpdates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

// Admin functions - Delete a product
export async function deleteProduct(productId: string): Promise<void> {
  try {
    if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      throw new Error("Firebase not initialized");
    }

    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

// Admin functions - Bulk update prices
export async function bulkUpdatePrices(
  updates: Array<{ productId: string; price: number; originalPrice?: number; discount?: number }>
): Promise<void> {
  try {
    if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      throw new Error("Firebase not initialized");
    }

    const batch = writeBatch(db);
    
    updates.forEach(({ productId, price, originalPrice, discount }) => {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      const updateData: any = {
        price,
        updatedAt: Timestamp.now(),
      };
      
      if (originalPrice !== undefined) {
        updateData.originalPrice = originalPrice;
      }
      
      if (discount !== undefined) {
        updateData.discount = discount;
      }
      
      batch.update(productRef, updateData);
    });

    await batch.commit();
  } catch (error) {
    console.error("Error bulk updating prices:", error);
    throw error;
  }
}

// Admin functions - Bulk update inventory
export async function bulkUpdateInventory(
  updates: Array<{ productId: string; stock?: number; inStock: boolean }>
): Promise<void> {
  try {
    if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      throw new Error("Firebase not initialized");
    }

    const batch = writeBatch(db);
    
    updates.forEach(({ productId, stock, inStock }) => {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      const updateData: any = {
        inStock,
        updatedAt: Timestamp.now(),
      };
      
      if (stock !== undefined) {
        updateData.stock = stock;
      }
      
      batch.update(productRef, updateData);
    });

    await batch.commit();
  } catch (error) {
    console.error("Error bulk updating inventory:", error);
    throw error;
  }
}

