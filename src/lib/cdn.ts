
export interface ImageTransform {
  width?: number;
  height?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  quality?: number;
  fit?: 'cover' | 'contain' | 'fill';
}

/**
 * Deployment-ready image CDN helper (Imgix / Cloudinary compatible).
 * The studio renders all visuals as SVG/CSS, so no raster assets are shipped,
 * but this utility is provided for any future bitmap content (posters,
 * stills, OG images) to be served optimally from a CDN edge.
 */
export function cdnUrl(base: string, t: ImageTransform = {}): string {
  const params = new URLSearchParams();
  if (t.width) params.set('w', String(t.width));
  if (t.height) params.set('h', String(t.height));
  if (t.format) params.set('fm', t.format === 'auto' ? 'auto' : t.format);
  if (t.quality) params.set('q', String(t.quality));
  if (t.fit) params.set('fit', t.fit);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}
