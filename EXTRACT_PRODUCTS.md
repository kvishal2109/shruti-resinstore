# Quick Guide: Extract Products from laxmisingla.catalog.to

## Fast Method (5 minutes)

### Step 1: Open the Website
1. Go to: https://laxmisingla.catalog.to/
2. Open browser Developer Tools (F12)
3. Go to Console tab

### Step 2: Extract Product Data
Copy and paste this JavaScript code in the browser console:

```javascript
// Extract products from the page
const products = [];
document.querySelectorAll('[class*="product"], [class*="item"], [class*="card"]').forEach((el, index) => {
  const name = el.querySelector('h1, h2, h3, [class*="title"], [class*="name"]')?.textContent?.trim();
  const price = el.querySelector('[class*="price"]')?.textContent?.match(/\d+/)?.[0];
  const image = el.querySelector('img')?.src;
  
  if (name && price && image) {
    products.push({
      name: name,
      price: parseInt(price),
      image: image,
      id: index + 1
    });
  }
});

console.log(JSON.stringify(products, null, 2));
```

### Step 3: Manual Extraction (If above doesn't work)

For each product on the website:

1. **Product Name**: Copy the product title
2. **Price**: Note the price (remove ₹ symbol, just number)
3. **Image URL**: 
   - Right-click product image
   - "Inspect Element"
   - Find `<img>` tag
   - Copy the `src` attribute value
   - If it's relative (starts with `/`), add: `http://laxmisingla.catalog.to` before it

### Step 4: Update lib/data/products.ts

Replace the products array with your extracted products using this format:

```typescript
{
  id: "1",
  name: "Actual Product Name",
  description: "Product description or 'High quality product'",
  price: 999,  // Actual price number
  originalPrice: 1499,  // If there's discount, otherwise remove this line
  image: "http://laxmisingla.catalog.to/full-image-path.jpg",  // Full image URL
  category: "Clothing",  // or "Accessories", "Home", etc.
  inStock: true,
  stock: 25,
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

## Quick Copy-Paste Template

Open `lib/data/products.ts` and replace the array with:

```typescript
export const hardcodedProducts: Product[] = [
  // Paste your products here, one per line
  // Use the format above
];
```

