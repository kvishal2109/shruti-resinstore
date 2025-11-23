// SIMPLE Text Extractor - Shows all text on page
// Copy this ENTIRE code and paste in browser console

(function() {
    console.log('📋 Extracting all visible text from page...\n');
    
    // Get all text content
    const allText = document.body.innerText || document.body.textContent;
    const lines = allText.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0)
        .filter(l => !l.match(/^[₹\d\s,]+$/) && l.length < 200);
    
    console.log('=== ALL TEXT LINES ON PAGE ===\n');
    lines.forEach((line, i) => {
        if (line.length > 5 && line.length < 100) {
            console.log(`${i + 1}. ${line}`);
        }
    });
    
    console.log('\n\n=== PRODUCT IMAGES FOUND ===\n');
    const images = [];
    document.querySelectorAll('img').forEach((img, index) => {
        let src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        if (src && 
            !src.includes('logo') && 
            !src.includes('icon') && 
            !src.includes('powered_by') &&
            !src.includes('close-black') &&
            !src.includes('.svg')) {
            images.push({
                index: index + 1,
                url: src,
                alt: img.alt || 'No alt text'
            });
        }
    });
    
    images.forEach(img => {
        console.log(`${img.index}. ${img.url}`);
        console.log(`   Alt: ${img.alt}\n`);
    });
    
    console.log('\n=== INSTRUCTIONS ===');
    console.log('1. Look at the text lines above');
    console.log('2. Identify product names (usually 10-50 characters)');
    console.log('3. Match them with the image numbers');
    console.log('4. Share the product names in order (1, 2, 3, etc.)');
    
    return { lines, images };
})();

