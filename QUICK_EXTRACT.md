# Quick Product Extraction Guide

## Method 1: Use the HTML Tool (Easiest)

1. Open `extract-products.html` in your browser
2. Follow the instructions in the file
3. It will generate the code for you automatically

## Method 2: Manual Browser Console Method

1. Open https://laxmisingla.catalog.to/ in your browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Copy and paste this code:

```javascript
const products = [];
document.querySelectorAll('img').forEach((img, index) => {
    const src = img.src;
    if (src && !src.includes('logo') && !src.includes('icon')) {
        const parent = img.closest('div, article, section');
        if (parent) {
            const text = parent.textContent.trim();
            const priceMatch = text.match(/₹?\s*(\d{3,})/);
            const lines = text.split('\n').filter(l => l.trim().length > 0);
            const name = lines[0] || lines.find(l => l.length < 100) || 'Product ' + (index + 1);
            
            if (priceMatch && name.length > 3) {
                let imageUrl = src;
                if (imageUrl.startsWith('/')) {
                    imageUrl = 'http://laxmisingla.catalog.to' + imageUrl;
                }
                
                products.push({
                    id: (products.length + 1).toString(),
                    name: name.substring(0, 100),
                    price: parseInt(priceMatch[1]),
                    image: imageUrl,
                    description: name + ' - Available now',
                    category: 'Clothing'
                });
            }
        }
    }
});

console.log(JSON.stringify(products, null, 2));
```

5. Press Enter
6. Copy the JSON output
7. Paste it into `extract-products.html` tool to generate the code

## Method 3: Manual Entry (If above don't work)

Just tell me:
- Product names (as many as you see)
- Prices
- I'll help you format them

