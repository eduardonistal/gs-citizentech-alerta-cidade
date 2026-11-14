param(
  [Parameter(Mandatory = $true)][string]$OutPath,
  [Parameter(Mandatory = $true)][string]$Title,
  [Parameter(Mandatory = $true)][string]$Body,
  [string]$Footer = "Alerta Cidade · GS FIAP 2026 · Eduardo Nistal RM94524"
)

Add-Type -AssemblyName System.Drawing
$width = 1280
$height = 720
$bmp = New-Object System.Drawing.Bitmap $width, $height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.Clear([System.Drawing.Color]::FromArgb(255, 8, 18, 32))

# accent bar
$accent = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 14, 116, 144))
$g.FillRectangle($accent, 0, 0, 16, $height)

$titleFont = New-Object System.Drawing.Font "Segoe UI Semibold", 34, ([System.Drawing.FontStyle]::Bold)
$bodyFont = New-Object System.Drawing.Font "Segoe UI", 24
$footerFont = New-Object System.Drawing.Font "Segoe UI", 14
$white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 241, 245, 249))
$muted = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 148, 163, 184))

$rectTitle = New-Object System.Drawing.RectangleF 64, 72, 1150, 120
$rectBody = New-Object System.Drawing.RectangleF 64, 220, 1150, 380
$format = New-Object System.Drawing.StringFormat
$format.Alignment = [System.Drawing.StringAlignment]::Near
$format.LineAlignment = [System.Drawing.StringAlignment]::Near

$g.DrawString($Title, $titleFont, $white, $rectTitle, $format)
$g.DrawString($Body, $bodyFont, $white, $rectBody, $format)
$g.DrawString($Footer, $footerFont, $muted, 64, 660)

$dir = Split-Path -Parent $OutPath
if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
$bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Output $OutPath
