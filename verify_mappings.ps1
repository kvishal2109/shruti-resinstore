# Verification script for product-image mappings
$productsFile = Get-Content "lib\data\products.ts" -Raw

# Extract product names and image paths
$productNames = [regex]::Matches($productsFile, 'name:\s*"([^"]+)"') | ForEach-Object { $_.Groups[1].Value }
$imagePaths = [regex]::Matches($productsFile, 'image:\s*"/catalog_images/[^/]+/([^"]+)"') | ForEach-Object { $_.Groups[1].Value }

Write-Host "=== PRODUCT-IMAGE MAPPING VERIFICATION ===" -ForegroundColor Cyan
Write-Host "Total products: $($productNames.Count)`n" -ForegroundColor Yellow

$mismatches = @()
for ($i = 0; $i -lt $productNames.Count; $i++) {
    $productName = $productNames[$i]
    $imagePath = $imagePaths[$i]
    # Remove (1), (2), etc. and .png extension
    $imageBaseName = $imagePath -replace '\s*\(\d+\)\.png$', '' -replace '\.png$', ''
    
    if ($productName -ne $imageBaseName) {
        $mismatches += [PSCustomObject]@{
            Index = $i + 1
            ProductName = $productName
            ImageBaseName = $imageBaseName
            ImagePath = $imagePath
        }
        Write-Host "❌ MISMATCH #$($i+1):" -ForegroundColor Red
        Write-Host "   Product: '$productName'" -ForegroundColor Red
        Write-Host "   Image:   '$imageBaseName' (from $imagePath)" -ForegroundColor Red
        Write-Host ""
    } else {
        Write-Host "✓ #$($i+1): '$productName' -> '$imageBaseName'" -ForegroundColor Green
    }
}

Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
if ($mismatches.Count -eq 0) {
    Write-Host "✅ ALL MAPPINGS ARE CORRECT! ($($productNames.Count) products verified)" -ForegroundColor Green
} else {
    Write-Host "❌ Found $($mismatches.Count) mismatches out of $($productNames.Count) products" -ForegroundColor Red
    $mismatches | Format-Table -AutoSize
}

