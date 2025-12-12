# Product Data Template

Use this template when adding products to Firestore.

## Required Fields

```json
{
  "name": "Product Name",
  "description": "Product description here",
  "price": 999,
  "image": "https://image-url.com/image.jpg",
  "category": "Category Name",
  "inStock": true,
  "createdAt": [timestamp],
  "updatedAt": [timestamp]
}
```

## Optional Fields

```json
{
  "originalPrice": 1499,
  "discount": 33,
  "stock": 50,
  "images": [
    "https://image-url.com/image1.jpg",
    "https://image-url.com/image2.jpg"
  ]
}
```

## Field Types Reference

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `name` | string | "Wireless Headphones" | Product title |
| `description` | string | "High quality..." | Product description |
| `price` | number | 999 | Current price (in INR) |
| `originalPrice` | number | 1499 | Original price (for discounts) |
| `discount` | number | 33 | Discount percentage |
| `image` | string | "https://..." | Main product image URL |
| `images` | array | ["url1", "url2"] | Additional images |
| `category` | string | "Electronics" | Product category |
| `inStock` | boolean | true | Availability status |
| `stock` | number | 50 | Available quantity |
| `createdAt` | timestamp | [auto] | Creation date |
| `updatedAt` | timestamp | [auto] | Last update date |

## Category Suggestions

- Electronics
- Clothing
- Home & Kitchen
- Books
- Sports
- Beauty
- Toys
- Food & Beverages

## Image Sources

### Free Image Options:

1. **Unsplash** (Recommended)
   - https://unsplash.com/
   - Search for product images
   - Right-click → Copy image address
   - Use the URL directly

2. **Pexels**
   - https://www.pexels.com/
   - Similar to Unsplash

3. **Vercel Blob Storage**
   - Upload images via admin panel
   - Images are automatically stored in Vercel Blob
   - URL is automatically generated

## Example Products

### Example 1: Electronics
```json
{
  "name": "Wireless Bluetooth Headphones",
  "description": "Premium quality wireless headphones with noise cancellation",
  "price": 2999,
  "originalPrice": 4999,
  "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  "category": "Electronics",
  "inStock": true,
  "stock": 25,
  "createdAt": [timestamp],
  "updatedAt": [timestamp]
}
```

### Example 2: Clothing
```json
{
  "name": "Cotton T-Shirt",
  "description": "Comfortable 100% cotton t-shirt in multiple colors",
  "price": 599,
  "originalPrice": 899,
  "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  "category": "Clothing",
  "inStock": true,
  "stock": 100,
  "createdAt": [timestamp],
  "updatedAt": [timestamp]
}
```

### Example 3: Home & Kitchen
```json
{
  "name": "Stainless Steel Water Bottle",
  "description": "Eco-friendly 1L stainless steel water bottle",
  "price": 799,
  "image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
  "category": "Home & Kitchen",
  "inStock": true,
  "createdAt": [timestamp],
  "updatedAt": [timestamp]
}
```

## Tips

1. **Use descriptive names** - Help customers find products
2. **Write good descriptions** - Include key features and benefits
3. **Set realistic prices** - In Indian Rupees (INR)
4. **Use high-quality images** - Better images = more sales
5. **Organize by categories** - Makes browsing easier
6. **Keep stock updated** - Set `inStock: false` when out of stock

