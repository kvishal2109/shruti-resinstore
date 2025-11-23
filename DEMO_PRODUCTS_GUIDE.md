# Quick Demo Products Setup

## Fastest Way to Add Products for Demo

### Option 1: Manual Entry (Recommended for 5-10 products)

1. **Open the website**: http://laxmisingla.catalog.to/
2. **For each product you see:**
   - Note the name
   - Right-click image → Copy image address
   - Note the price (or use demo prices: 499, 799, 1299, 1999)
   - Decide category (Clothing, Accessories, Home, etc.)

3. **Add to Firestore:**
   - Firebase Console → Firestore Database
   - Collection: `products`
   - Add document with fields (see template below)

### Option 2: Use Sample Products (If website is slow)

If you want to quickly set up a demo, you can use these sample products with placeholder images:

**Product 1:**
- name: "Designer Cotton Kurta"
- description: "Elegant cotton kurta with beautiful embroidery"
- price: 1299
- originalPrice: 1899
- image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1"
- category: "Clothing"
- inStock: true

**Product 2:**
- name: "Silk Saree"
- description: "Traditional silk saree in vibrant colors"
- price: 2999
- originalPrice: 3999
- image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d"
- category: "Clothing"
- inStock: true

**Product 3:**
- name: "Handmade Jewelry Set"
- description: "Beautiful handmade jewelry set with traditional design"
- price: 899
- originalPrice: 1299
- image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338"
- category: "Accessories"
- inStock: true

## Quick Firestore Entry Steps

1. Go to Firebase Console
2. Firestore Database → Start collection (if first time)
3. Collection ID: `products`
4. For each product:
   - Click "Add field"
   - Enter field name, select type, enter value
   - Repeat for all fields
5. Click "Save"
6. Click "Add document" for next product

## Field Quick Reference

```
name → string → "Product Name"
description → string → "Product description"
price → number → 1299
originalPrice → number → 1899 (optional)
image → string → "https://image-url.com"
category → string → "Clothing"
inStock → boolean → true
createdAt → timestamp → [click timestamp]
updatedAt → timestamp → [click timestamp]
```

## Demo-Ready in 10 Minutes!

Add 5-10 products and you're ready to show the client:
- ✅ Product catalog
- ✅ Search & filters
- ✅ Shopping cart
- ✅ Wishlist
- ✅ Product details
- ✅ Responsive design

