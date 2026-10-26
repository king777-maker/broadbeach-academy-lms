Add-Type -AssemblyName System.Drawing

$publicDir = (Resolve-Path "public").Path
$logoPath = Join-Path $publicDir "logo.png"

# 1. Generate Favicon PNGs (16x16, 32x32, 180x180)
function Generate-Square-Icon($size, $outputPath) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # Deep Navy Blue Background (#0B315B)
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 49, 91))
    $g.FillRectangle($bgBrush, 0, 0, $size, $size)

    # Gold Border (#F7C600)
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(247, 198, 0), [Math]::Max(1, [float]($size * 0.05)))
    $g.DrawRectangle($borderPen, 0, 0, $size - 1, $size - 1)

    # Text Monogram "BB"
    $fontFamily = [System.Drawing.FontFamily]::GenericSansSerif
    $fontSize = [float]($size * 0.48)
    $font = New-Object System.Drawing.Font($fontFamily, $fontSize, [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    
    $rect = New-Object System.Drawing.RectangleF(0, 0, $size, $size)
    $g.DrawString("BB", $font, $textBrush, $rect, $sf)

    # Gold Accent bar at bottom
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(247, 198, 0))
    $barHeight = [Math]::Max(2, [float]($size * 0.1))
    $g.FillRectangle($goldBrush, 0, $size - $barHeight, $size, $barHeight)

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Generated $outputPath ($size x $size)"
}

Generate-Square-Icon 16 (Join-Path $publicDir "favicon-16x16.png")
Generate-Square-Icon 32 (Join-Path $publicDir "favicon-32x32.png")
Generate-Square-Icon 180 (Join-Path $publicDir "apple-touch-icon.png")

# 2. Generate Open Graph Social Image (1200 x 630)
$ogWidth = 1200
$ogHeight = 630
$ogBmp = New-Object System.Drawing.Bitmap($ogWidth, $ogHeight)
$ogG = [System.Drawing.Graphics]::FromImage($ogBmp)
$ogG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$ogG.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$ogG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Background Gradient
$rect = New-Object System.Drawing.Rectangle(0, 0, $ogWidth, $ogHeight)
$gradBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $rect,
    [System.Drawing.Color]::FromArgb(11, 49, 91),
    [System.Drawing.Color]::FromArgb(16, 47, 83),
    45.0
)
$ogG.FillRectangle($gradBrush, $rect)

# Gold Accent Line at top
$topGoldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(247, 198, 0))
$ogG.FillRectangle($topGoldBrush, 0, 0, $ogWidth, 12)

# Decorative card rectangle in center
$cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 255, 255, 255))
$ogG.FillRectangle($cardBrush, 60, 60, 1080, 510)
$cardBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 255, 255, 255), 2)
$ogG.DrawRectangle($cardBorder, 60, 60, 1080, 510)

# Draw authentic Logo if present
if (Test-Path $logoPath) {
    $logoImg = [System.Drawing.Image]::FromFile($logoPath)
    # Scale logo nicely (e.g. height 70)
    $logoScale = 70.0 / $logoImg.Height
    $scaledW = [int]($logoImg.Width * $logoScale)
    $scaledH = 70
    $ogG.DrawImage($logoImg, 100, 100, $scaledW, $scaledH)
    $logoImg.Dispose()
}

# Tagline Badge
$badgeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(247, 198, 0))
$ogG.FillRectangle($badgeBrush, 100, 200, 360, 36)
$badgeFont = New-Object System.Drawing.Font([System.Drawing.FontFamily]::GenericSansSerif, 13, [System.Drawing.FontStyle]::Bold)
$badgeTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 49, 91))
$ogG.DrawString("ACCREDITED CERTIFICATION PLATFORM", $badgeFont, $badgeTextBrush, 110, 208)

# Title Text
$titleFont = New-Object System.Drawing.Font([System.Drawing.FontFamily]::GenericSansSerif, 36, [System.Drawing.FontStyle]::Bold)
$titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$ogG.DrawString("Broadbeach Online Academy", $titleFont, $titleBrush, 100, 260)

# Subtitle Text
$subFont = New-Object System.Drawing.Font([System.Drawing.FontFamily]::GenericSansSerif, 20, [System.Drawing.FontStyle]::Regular)
$subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(210, 225, 245))
$ogG.DrawString("Globally Recognized ISO, EHS & Quality Management Certifications", $subFont, $subBrush, 100, 335)
$ogG.DrawString("Self-Paced Training | Online Exams | Instant Verified Credentials", $subFont, $subBrush, 100, 375)

# Verification URL footer
$urlFont = New-Object System.Drawing.Font([System.Drawing.FontFamily]::GenericSansSerif, 18, [System.Drawing.FontStyle]::Bold)
$urlBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(247, 198, 0))
$ogG.DrawString("https://cadac.in/broadbeachlearning.com", $urlFont, $urlBrush, 100, 480)

$ogOutputPath = Join-Path $publicDir "og-image.png"
$ogBmp.Save($ogOutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$ogG.Dispose()
$ogBmp.Dispose()
Write-Output "Generated $ogOutputPath (1200 x 630)"
