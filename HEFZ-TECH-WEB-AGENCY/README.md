# 10XTHINK Metadata

This project includes SEO metadata added for 10XTHINK / HEFZ|TECH.

- OpenGraph/Twitter image: `assets/og-image.svg`
- Canonical URLs in head tags point to `https://example.com/` — replace with your production domain.
- JSON-LD added to `index.html` for Organization and WebSite (if present).
 - OpenGraph/Twitter image: `assets/og-image.svg` (source) and `assets/og-image.jpg` (recommended raster)
 - Canonical URLs in head tags point to `https://example.com/` — replace with your production domain.
 - JSON-LD added to `index.html` for Organization and WebSite (if present).

To generate a JPG raster (1200×630) from the new futuristic SVG using ImageMagick:

```powershell
magick "index.html/assets/og-futuristic.svg" -resize 1200x630 -background white -flatten "index.html/assets/og-futuristic.jpg"
```

If `magick` is not in your PATH, use the full ImageMagick path, for example:

```powershell
& "C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe" "index.html/assets/og-futuristic.svg" -resize 1200x630 -background white -flatten "index.html/assets/og-futuristic.jpg"
```

The HTML meta tags have been updated to reference `assets/og-futuristic.jpg`.

Favicons
-------

I added a scalable `assets/favicon.svg`. To produce raster favicon files (PNG and ICO) for wider compatibility, run ImageMagick from the repo root:

```powershell
# generate PNG variants
magick "index.html/assets/og-futuristic.svg" -resize 32x32 "index.html/assets/favicon-32.png"
magick "index.html/assets/og-futuristic.svg" -resize 16x16 "index.html/assets/favicon-16.png"

# generate Apple touch icon
magick "index.html/assets/og-futuristic.svg" -resize 180x180 "index.html/assets/apple-touch-icon.png"

# generate multi-resolution ICO (favicons)
magick convert "index.html/assets/favicon-16.png" "index.html/assets/favicon-32.png" "index.html/assets/apple-touch-icon.png" "index.html/assets/favicon.ico"
```

After generating these files, the HTML already references them.
