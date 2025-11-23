# Adding Products from laxmisingla.catalog.to

This guide will help you extract products and images from the reference website and add them to your Firestore database.

## Step 1: Visit the Website

1. Open http://laxmisingla.catalog.to/ in your browser
2. Browse through the products
3. Note down the products you want to add

## Step 2: Extract Product Information

For each product, collect:
- **Product Name**
- **Price** (if visible)
- **Image URL** (see Step 3)
- **Category** (e.g., Clothing, Accessories, etc.)
- **Description** (if available, or create one)

## Step 3: Get Image URLs

### Method 1: Right-Click Method
1. Right-click on the product image
2. Select **"Copy image address"** or **"Copy image URL"**
3. Paste it somewhere safe (notepad, etc.)

### Method 2: Inspect Element
1. Right-click on the image
2. Select **"Inspect"** or **"Inspect Element"**
3. In the developer tools, find the `<img>` tag
4. Look for `src` attribute
5. Copy the full URL (it might be relative, so make sure to get the full URL)

### Method 3: Open Image in New Tab
1. Right-click image → **"Open image in new tab"**
2. Copy the URL from the address bar

## Step 4: Add Products to Firestore

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **my-store-9ec37**
3. Click **"Build"** → **"Firestore Database"**
4. Click **"Start collection"** (if first time) or click **"+"** button
5. Collection ID: `products` (lowercase, exactly this)
6. Click **"Next"**

### For Each Product, Add These Fields:

| Field Name | Type | Example Value | How to Add |
|------------|------|---------------|------------|
| `name` | string | "Cotton Kurta" | Click "Add field" → name → string → enter value |
| `description` | string | "Comfortable cotton kurta..." | Add field → description → string → enter value |
| `price` | number | 899 | Add field → price → number → enter value |
| `originalPrice` | number | 1299 | Add field → originalPrice → number → enter value (optional) |
| `image` | string | "https://catalog.to/..." | Add field → image → string → paste URL |
| `category` | string | "Clothing" | Add field → category → string → enter value |
| `inStock` | boolean | true | Add field → inStock → boolean → select true |
| `createdAt` | timestamp | [now] | Add field → createdAt → timestamp → click timestamp button |
| `updatedAt` | timestamp | [now] | Add field → updatedAt → timestamp → click timestamp button |

7. Click **"Save"**
8. Click **"Add document"** to add the next product

## Step 5: Quick Product Template

Use this template for each product:

```
Field: name
Type: string
Value: [Product name from website]

Field: description
Type: string
Value: [Description or "High quality [product name] available in multiple sizes and colors"]

Field: price
Type: number
Value: [Price from website, e.g., 899]

Field: originalPrice (optional)
Type: number
Value: [Original price if there's a discount, e.g., 1299]

Field: image
Type: string
Value: [Pasted image URL from website]

Field: category
Type: string
Value: [Category like "Clothing", "Accessories", "Home", etc.]

Field: inStock
Type: boolean
Value: true

Field: createdAt
Type: timestamp
Value: [Click timestamp button]

Field: updatedAt
Type: timestamp
Value: [Click timestamp button]
```

## Tips

1. **Start with 5-10 products** for the demo
2. **Use consistent categories** (e.g., "Clothing", "Accessories", "Home Decor")
3. **If price not visible**, use reasonable demo prices (e.g., 499, 799, 1299)
4. **If image URL is relative** (starts with `/`), add the website domain:
   - Example: `/images/product.jpg` → `http://laxmisingla.catalog.to/images/product.jpg`
5. **Save image URLs** in a notepad first, then add to Firestore

## Example Product Entry

Here's what a complete product looks like in Firestore:

```
Document ID: [auto-generated]

Fields:
- name: "Designer Cotton Kurta"
- description: "Elegant cotton kurta with beautiful embroidery, available in multiple colors"
- price: 1299
- originalPrice: 1899
- image: "http://laxmisingla.catalog.to/images/kurta1.jpg"
- category: "Clothing"
- inStock: true
- createdAt: [timestamp]
- updatedAt: [timestamp]
```

## After Adding Products

1. Run your app: `npm run dev`
2. Open http://localhost:3000
3. You should see all your products!
4. Test the demo features:
   - Browse products
   - Add to cart
   - Add to wishlist
   - View product details
   - Search and filter

## Troubleshooting

**Images not loading?**
- Check if the image URL is complete (starts with http:// or https://)
- Try opening the image URL directly in browser
- Some websites block direct image access - you might need to use a different image source

**Products not showing?**
- Verify collection name is exactly `products` (lowercase)
- Check that all required fields are added
- Refresh the browser page
- Check browser console for errors

