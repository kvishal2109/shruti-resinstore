# How to Update Hardcoded Products

The products are currently hardcoded in `lib/data/products.ts`. To add products from the actual website:

## Step 1: Visit the Website

Go to: https://laxmisingla.catalog.to/

## Step 2: Extract Product Information

For each product, collect:
1. **Product Name**
2. **Price** (current price)
3. **Original Price** (if there's a discount)
4. **Image URL** - Right-click image → "Copy image address"
5. **Category** (Clothing, Accessories, etc.)
6. **Description** (or create one)

## Step 3: Update the Products File

Open `lib/data/products.ts` and replace the products array with actual products:

```typescript
export const hardcodedProducts: Product[] = [
  {
    id: "1",
    name: "Actual Product Name from Website",
    description: "Product description",
    price: 1299,  // Current price
    originalPrice: 1899,  // Original price (if discount)
    image: "http://laxmisingla.catalog.to/path/to/image.jpg",  // Actual image URL
    category: "Clothing",  // or "Accessories", etc.
    inStock: true,
    stock: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Add more products...
];
```

## Step 4: Get Image URLs

1. Right-click on product image on the website
2. Select "Copy image address" or "Open image in new tab"
3. Copy the full URL
4. Paste in the `image` field

**Note**: If the URL is relative (starts with `/`), add the full domain:
- `/images/product.jpg` → `http://laxmisingla.catalog.to/images/product.jpg`

## Quick Template

```typescript
{
  id: "unique-id",  // Change for each product (1, 2, 3, etc.)
  name: "Product Name",
  description: "Product description",
  price: 999,  // Number (no currency symbol)
  originalPrice: 1499,  // Optional, only if there's a discount
  image: "https://full-image-url.com/image.jpg",
  category: "Clothing",  // Keep consistent categories
  inStock: true,
  stock: 50,  // Optional
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

## After Updating

1. Save the file
2. The app will automatically use the new products
3. No need to restart - Next.js will hot-reload

## Switching to Firebase Later

When you're ready to use Firebase:
1. Add products to Firestore (see SETUP_GUIDE.md)
2. The app will automatically switch to Firebase products
3. Hardcoded products will be used as fallback if Firebase fails

