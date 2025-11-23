// Copy this ENTIRE code and paste in browser console on laxmisingla.catalog.to
// Press F12, go to Console tab, paste this, press Enter

(function() {
    console.log('🔍 Starting product extraction...');
    
    const products = [];
    const processedImages = new Set();
    
    // Find all images on the page
    document.querySelectorAll('img').forEach((img) => {
        let src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        
        // Skip logos, icons, small images
        if (!src || 
            src.includes('logo') || 
            src.includes('icon') || 
            src.includes('avatar') ||
            processedImages.has(src) ||
            img.width < 100) {
            return;
        }
        
        // Make URL absolute if relative
        if (src.startsWith('/')) {
            src = 'http://laxmisingla.catalog.to' + src;
        } else if (!src.startsWith('http')) {
            src = 'http://laxmisingla.catalog.to/' + src;
        }
        
        processedImages.add(src);
        
        // Find parent container
        let container = img.parentElement;
        let foundContainer = false;
        
        // Go up the DOM tree to find product container
        for (let i = 0; i < 5 && container; i++) {
            const text = container.textContent || '';
            const priceMatch = text.match(/₹?\s*(\d{3,})/);
            
            if (priceMatch) {
                // Extract product name (first meaningful line)
                const lines = text.split('\n')
                    .map(l => l.trim())
                    .filter(l => l.length > 5 && l.length < 100)
                    .filter(l => !l.match(/^\d+$/) && !l.includes('₹'));
                
                const name = lines[0] || lines.find(l => l.length > 10) || 'Product';
                
                // Extract price
                const price = parseInt(priceMatch[1]);
                
                if (name && price > 100 && price < 100000) {
                    products.push({
                        id: (products.length + 1).toString(),
                        name: name.substring(0, 80),
                        price: price,
                        image: src,
                        description: name + ' - High quality product available now',
                        category: 'Clothing'
                    });
                    foundContainer = true;
                    break;
                }
            }
            container = container.parentElement;
        }
    });
    
    console.log(`\n✅ Found ${products.length} products!\n`);
    console.log(JSON.stringify(products, null, 2));
    
    // Try to copy to clipboard
    const jsonString = JSON.stringify(products, null, 2);
    if (navigator.clipboard) {
        navigator.clipboard.writeText(jsonString).then(() => {
            console.log('\n📋 Products copied to clipboard!');
        });
    }
    
    return products;
})();

