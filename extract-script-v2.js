// IMPROVED Product Extractor - Copy this ENTIRE code
// Paste in browser console on laxmisingla.catalog.to

(function() {
    console.log('🔍 Starting improved product extraction...');
    
    const products = [];
    const processedImages = new Set();
    
    // Find all product containers - try different selectors
    const containerSelectors = [
        '[class*="product"]',
        '[class*="item"]',
        '[class*="card"]',
        '[class*="catalog"]',
        'article',
        '[data-product]',
        '[data-item]'
    ];
    
    let containers = [];
    containerSelectors.forEach(sel => {
        const found = document.querySelectorAll(sel);
        if (found.length > 0) {
            containers = Array.from(found);
            console.log(`Found ${found.length} containers with selector: ${sel}`);
        }
    });
    
    // If no containers found, use all divs with images
    if (containers.length === 0) {
        document.querySelectorAll('div').forEach(div => {
            const img = div.querySelector('img');
            const text = div.textContent || '';
            if (img && text.length > 20 && text.length < 500) {
                containers.push(div);
            }
        });
    }
    
    containers.forEach((container, index) => {
        const img = container.querySelector('img');
        if (!img) return;
        
        let src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        
        // Skip logos, icons, small images
        if (!src || 
            src.includes('logo') || 
            src.includes('icon') || 
            src.includes('avatar') ||
            src.includes('powered_by') ||
            src.includes('close-black') ||
            src.includes('.svg') ||
            processedImages.has(src) ||
            (img.width && img.width < 150)) {
            return;
        }
        
        // Make URL absolute if relative
        if (src.startsWith('/')) {
            src = 'http://laxmisingla.catalog.to' + src;
        } else if (!src.startsWith('http')) {
            src = 'http://laxmisingla.catalog.to/' + src;
        }
        
        processedImages.add(src);
        
        // Extract text from container
        const text = container.textContent || '';
        const lines = text.split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 3)
            .filter(l => !l.match(/^[₹\d\s,]+$/) && !l.includes('Add to') && !l.includes('View'));
        
        // Find product name (usually first or second meaningful line)
        let name = '';
        for (let i = 0; i < Math.min(5, lines.length); i++) {
            const line = lines[i];
            if (line.length > 10 && line.length < 80 && 
                !line.match(/^\d+$/) && 
                !line.includes('₹') &&
                !line.toLowerCase().includes('product') &&
                !line.toLowerCase().includes('view') &&
                !line.toLowerCase().includes('add')) {
                name = line;
                break;
            }
        }
        
        // If no good name found, try to find heading
        if (!name || name.length < 5) {
            const heading = container.querySelector('h1, h2, h3, h4, h5, h6, [class*="title"], [class*="name"]');
            if (heading) {
                name = heading.textContent.trim();
            }
        }
        
        // Extract price
        const priceMatch = text.match(/₹?\s*(\d{3,})/);
        const price = priceMatch ? parseInt(priceMatch[1]) : 0;
        
        // Only add if we have valid data
        if (name && name.length > 5 && price > 100 && price < 100000) {
            products.push({
                id: (products.length + 1).toString(),
                name: name.substring(0, 100),
                price: price,
                image: src,
                description: name + ' - High quality product available now',
                category: 'Clothing'
            });
        }
    });
    
    console.log(`\n✅ Found ${products.length} products with names!\n`);
    console.log(JSON.stringify(products, null, 2));
    
    // Show in table format too
    console.table(products);
    
    return products;
})();

