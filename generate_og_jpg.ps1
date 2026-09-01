# Generates index.html\assets\og-image.jpg (1200x630) using site accent colors
$out = "index.html\assets\og-image.jpg"
[System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($out)) | Out-Null

$W = 1200; $H = 630
$bmp = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# Gradient from accent to slightly darker
$rect = New-Object System.Drawing.Rectangle(0,0,$W,$H)
$start = [System.Drawing.Color]::FromArgb(0xD9,0x77,0x06) # #d97706
$end   = [System.Drawing.Color]::FromArgb(0xB4,0x53,0x09) # #b45309
$lgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $start, $end, 45)
$g.FillRectangle($lgBrush, $rect)

# Text
$font = New-Object System.Drawing.Font('Arial',48,[System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$text = '10XTHINK — HEFZ|TECH'
$size = $g.MeasureString($text, $font)
$x = [int](($W - $size.Width) / 2)
$y = [int](($H - $size.Height) / 2)
$g.DrawString($text, $font, $brush, $x, $y)

# Save JPEG
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose(); $bmp.Dispose(); $lgBrush.Dispose()
Write-Output "Saved $out"
