# How to apply this meta/OG asset update

These 25 files were regenerated from your new official seal logo and are
verified under safe sharing size limits (see report below). They mirror the
exact paths in `plantation-tracker`.

## Apply locally

```bash
cd /path/to/your/local/plantation-tracker
# copy this extracted folder's contents over your repo, preserving paths
cp -r /path/to/meta-assets-update/public ./
cp -r /path/to/meta-assets-update/icons ./
cp -r /path/to/meta-assets-update/android ./
cp /path/to/meta-assets-update/index.html ./

git add -A
git commit -m "chore: refresh meta/OG share assets and app icons with new official seal logo"
git push origin main
```

On Termux/Android, same idea — just adjust the source path to wherever you
extracted this zip (e.g. `~/storage/downloads/meta-assets-update`).

## What changed
- `public/icon-512.png`, `icon-512-maskable.png`, `icon-192.png`,
  `icon-192-maskable.png`, `apple-touch-icon.png`, favicons (16/32/48 + `.ico`)
  — regenerated from the new circular seal logo
- `icons/*.webp` (48–512px) — same logo, WebP set
- `public/og-share-large.png`, `og-image.png`, `og-image-large.png` —
  1200x630 / 1600x840, new logo + Noto Sans Bengali wordmark, pngquant-compressed
- `android/app/src/main/assets/public/*` — mirrored favicons/apple-touch-icon
- `index.html` — bumped cache-busting query params
  (`favicon.ico?v=3→4`, `og-share-large.png?v=2→3`) so social crawlers
  (Facebook/WhatsApp/Twitter/LinkedIn) drop their cached preview and refetch.

## Size audit (all under safe sharing ceilings)
| File | Dimensions | Size |
|---|---|---|
| icon-512.png | 512x512 | 90 KB |
| icon-512-maskable.png | 512x512 | 83 KB |
| icon-192.png | 192x192 | 22 KB |
| icon-192-maskable.png | 192x192 | 14 KB |
| apple-touch-icon.png | 180x180 | 19 KB |
| favicon-48x48.png | 48x48 | 2.6 KB |
| favicon-32x32.png | 32x32 | 1.6 KB |
| favicon-16x16.png | 16x16 | 0.5 KB |
| og-share-large.png | 1200x630 | 133 KB |
| og-image.png | 1200x630 | 133 KB |
| og-image-large.png | 1600x840 | 218 KB |

After pushing and redeploying on Vercel, force social crawlers to refresh:
- Facebook: https://developers.facebook.com/tools/debug/ → paste URL → Scrape Again
- Twitter/X: https://cards-dev.twitter.com/validator (or just re-share after a few min)
- WhatsApp/Telegram usually pick up new `og:image` automatically once the
  `?v=` query param changes, which this update already does.
