Add-Type -AssemblyName System.Drawing

$sourcePath = "e:/Projects/bitcentral-v2/client/public/CardImgs/cropped_circle_image.png"
$outputDir = "e:/Projects/bitcentral-v2/client/public/icons"

if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$srcImage = [System.Drawing.Image]::FromFile($sourcePath)

$sizes = @(72, 96, 128, 144, 152, 180, 192, 384, 512)
foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($srcImage, 0, 0, $size, $size)
    $g.Dispose()
    $outputPath = Join-Path $outputDir "icon-$size`x$size.png"
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created icon-$size`x$size.png"
}

# Generate maskable icons with safe area padding
$maskableSizes = @(192, 512)
foreach ($size in $maskableSizes) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#2563eb'))
    $g.FillRectangle($brush, 0, 0, $size, $size)
    $brush.Dispose()
    
    $innerSize = [int]($size * 0.8)
    $offset = [int](($size - $innerSize) / 2)
    $g.DrawImage($srcImage, $offset, $offset, $innerSize, $innerSize)
    $g.Dispose()
    $outputPath = Join-Path $outputDir "icon-maskable-$size`x$size.png"
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created icon-maskable-$size`x$size.png"
}

$srcImage.Dispose()
Write-Host "All PWA icons generated successfully!"
