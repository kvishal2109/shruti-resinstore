import { Product } from "@/types";
import { getSupabaseAdmin } from "./client";
import { hardcodedProducts } from "@/lib/data/products";

/**
 * Get all products from Supabase
 * Falls back to hardcoded products if database is empty
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching products from Supabase:", error);
      return hardcodedProducts;
    }

    if (!data || data.length === 0) {
      return hardcodedProducts;
    }

    // Convert database format to Product format
    const products: Product[] = data.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
      discount: row.discount ? parseFloat(row.discount) : undefined,
      image: row.image,
      images: row.images || [],
      category: row.category,
      subcategory: row.subcategory || undefined,
      inStock: row.in_stock ?? true,
      stock: row.stock || undefined,
      catalogId: row.catalog_id || undefined,
      catalogName: row.catalog_name || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));

    return products;
  } catch (error) {
    console.error("Error fetching products from Supabase, using hardcoded:", error);
    return hardcodedProducts;
  }
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const products = await getAllProducts();
    return products.find((p) => p.id === id) || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return hardcodedProducts.find((p) => p.id === id) || null;
  }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error || !data) {
      const products = await getAllProducts();
      return products.filter((p) => p.category === category);
    }

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
      discount: row.discount ? parseFloat(row.discount) : undefined,
      image: row.image,
      images: row.images || [],
      category: row.category,
      subcategory: row.subcategory || undefined,
      inStock: row.in_stock ?? true,
      stock: row.stock || undefined,
      catalogId: row.catalog_id || undefined,
      catalogName: row.catalog_name || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  } catch (error) {
    console.error("Error fetching products by category:", error);
    const products = await getAllProducts();
    return products.filter((p) => p.category === category);
  }
}

/**
 * Get products by catalog
 */
export async function getProductsByCatalog(catalogId: string): Promise<Product[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('catalog_id', catalogId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      const products = await getAllProducts();
      return products.filter((p) => p.catalogId === catalogId);
    }

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
      discount: row.discount ? parseFloat(row.discount) : undefined,
      image: row.image,
      images: row.images || [],
      category: row.category,
      subcategory: row.subcategory || undefined,
      inStock: row.in_stock ?? true,
      stock: row.stock || undefined,
      catalogId: row.catalog_id || undefined,
      catalogName: row.catalog_name || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  } catch (error) {
    console.error("Error fetching products by catalog:", error);
    const products = await getAllProducts();
    return products.filter((p) => p.catalogId === catalogId);
  }
}

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<string[]> {
  try {
    const products = await getAllProducts();
    
    if (!products || products.length === 0) {
      const categories = [...new Set(hardcodedProducts.map((p) => p.category))];
      const categoryOrder = ["Wedding", "Jewellery", "Home Decor", "Furniture"];
      const orderedCategories = categoryOrder.filter(cat => categories.includes(cat));
      const remainingCategories = categories.filter(cat => !categoryOrder.includes(cat));
      return [...orderedCategories, ...remainingCategories];
    }
    
    const categories = [...new Set(products.map((p) => p.category))];
    const categoryOrder = ["Wedding", "Jewellery", "Home Decor", "Furniture"];
    const orderedCategories = categoryOrder.filter(cat => categories.includes(cat));
    const remainingCategories = categories.filter(cat => !categoryOrder.includes(cat));
    return [...orderedCategories, ...remainingCategories];
  } catch (error) {
    console.error("Error fetching categories, using hardcoded:", error);
    const categories = [...new Set(hardcodedProducts.map((p) => p.category))];
    const categoryOrder = ["Wedding", "Jewellery", "Home Decor", "Furniture"];
    const orderedCategories = categoryOrder.filter(cat => categories.includes(cat));
    const remainingCategories = categories.filter(cat => !categoryOrder.includes(cat));
    return [...orderedCategories, ...remainingCategories];
  }
}

/**
 * Admin Functions - Create product
 */
export async function createProduct(
  productData: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const supabase = getSupabaseAdmin();
    const productId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const { error } = await supabase
      .from('products')
      .insert({
        id: productId,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        original_price: productData.originalPrice || null,
        discount: productData.discount || null,
        image: productData.image,
        images: productData.images || [],
        category: productData.category,
        subcategory: productData.subcategory || null,
        in_stock: productData.inStock ?? true,
        stock: productData.stock || null,
        catalog_id: productData.catalogId || null,
        catalog_name: productData.catalogName || null,
      });

    if (error) {
      throw error;
    }

    return productId;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

/**
 * Admin Functions - Update product
 */
export async function updateProduct(
  productId: string,
  updates: Partial<Omit<Product, "id" | "createdAt">>
): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.originalPrice !== undefined) updateData.original_price = updates.originalPrice;
    if (updates.discount !== undefined) updateData.discount = updates.discount;
    if (updates.image !== undefined) updateData.image = updates.image;
    if (updates.images !== undefined) updateData.images = updates.images;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.subcategory !== undefined) updateData.subcategory = updates.subcategory;
    if (updates.inStock !== undefined) updateData.in_stock = updates.inStock;
    if (updates.stock !== undefined) updateData.stock = updates.stock;
    if (updates.catalogId !== undefined) updateData.catalog_id = updates.catalogId;
    if (updates.catalogName !== undefined) updateData.catalog_name = updates.catalogName;

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

/**
 * Admin Functions - Delete product
 */
export async function deleteProduct(productId: string): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

/**
 * Admin Functions - Bulk update prices
 */
export async function bulkUpdatePrices(
  updates: Array<{ productId: string; price: number; originalPrice?: number; discount?: number }>
): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    
    // Update each product
    for (const update of updates) {
      const updateData: any = {
        price: update.price,
        updated_at: new Date().toISOString(),
      };
      
      if (update.originalPrice !== undefined) updateData.original_price = update.originalPrice;
      if (update.discount !== undefined) updateData.discount = update.discount;

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', update.productId);

      if (error) {
        console.error(`Error updating product ${update.productId}:`, error);
      }
    }
  } catch (error) {
    console.error("Error bulk updating prices:", error);
    throw error;
  }
}

/**
 * Admin Functions - Bulk update inventory
 */
export async function bulkUpdateInventory(
  updates: Array<{ productId: string; stock?: number; inStock: boolean }>
): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    
    for (const update of updates) {
      const updateData: any = {
        in_stock: update.inStock,
        updated_at: new Date().toISOString(),
      };
      
      if (update.stock !== undefined) updateData.stock = update.stock;

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', update.productId);

      if (error) {
        console.error(`Error updating product ${update.productId}:`, error);
      }
    }
  } catch (error) {
    console.error("Error bulk updating inventory:", error);
    throw error;
  }
}

/**
 * Admin Functions - Bulk update category (rename category)
 */
export async function bulkUpdateCategory(
  oldCategory: string,
  newCategory: string
): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('products')
      .update({
        category: newCategory,
        updated_at: new Date().toISOString(),
      })
      .eq('category', oldCategory);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error bulk updating category:", error);
    throw error;
  }
}

/**
 * Admin Functions - Delete category (delete all products in category)
 */
export async function deleteCategory(category: string): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('products')
      .delete()
      .ilike('category', category);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

