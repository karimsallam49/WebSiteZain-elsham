/**
 * Rewrites a storage image URL to its generated WebP thumbnail variant.
 *   /storage/app/public/product/x.png → /storage/app/public/thumbs/{w}/product/x.png.webp
 * Returns the original URL if it doesn't match the storage pattern.
 */
export function thumbUrl(url: string | null | undefined, w: 200 | 600 = 200): string {
  if (!url) return "";
  return url.replace(/(\/storage\/app\/public\/)(?!thumbs\/)/, `$1thumbs/${w}/`) +
    (url.includes("/thumbs/") ? "" : ".webp");
}
