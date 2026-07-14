
export interface SeoData {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
}

export const siteSeo = {
  SITE_NAME: 'KAZE 風',
  SITE_URL: 'https://kaze.studio',
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id: string, data: object) {
  if (typeof document === 'undefined') return;
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

/**
 * Applies a complete SEO + Social (OpenGraph / Twitter) + Structured Data
 * payload to the document head. Reuses existing tags when present so it is
 * safe to call on every SPA route / view change.
 */
export function applySeo(data: SeoData) {
  if (typeof document === 'undefined') return;
  const url = data.canonical ?? siteSeo.SITE_URL + '/';
  const img = data.image ?? `${siteSeo.SITE_URL}/og-image.svg`;

  document.title = data.title;
  upsertMeta('name', 'description', data.description);
  upsertLink('canonical', url);

  // OpenGraph
  upsertMeta('property', 'og:type', data.type ?? 'website');
  upsertMeta('property', 'og:site_name', siteSeo.SITE_NAME);
  upsertMeta('property', 'og:title', data.title);
  upsertMeta('property', 'og:description', data.description);
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:locale', 'en_US');
  upsertMeta('property', 'og:image', img);
  upsertMeta('property', 'og:image:alt', data.title);

  // Clear stale article tags before (re)applying
  document.head.querySelectorAll('meta[property^="article:tag:"]').forEach((n) => n.remove());
  if (data.type === 'article') {
    if (data.publishedTime) upsertMeta('property', 'article:published_time', data.publishedTime);
    if (data.modifiedTime) upsertMeta('property', 'article:modified_time', data.modifiedTime);
    if (data.section) upsertMeta('property', 'article:section', data.section);
    data.tags?.forEach((t, i) => upsertMeta('property', `article:tag:${i}`, t));
  }

  // Twitter
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', data.title);
  upsertMeta('name', 'twitter:description', data.description);
  upsertMeta('name', 'twitter:image', img);
  upsertMeta('name', 'twitter:image:alt', data.title);

  // Indexing control
  upsertMeta('name', 'robots', data.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large');

  // Structured data
  if (data.type === 'article') {
    upsertJsonLd('seo-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: data.title,
      description: data.description,
      url,
      ...(img ? { image: img } : {}),
      ...(data.publishedTime ? { datePublished: data.publishedTime } : {}),
      ...(data.modifiedTime ? { dateModified: data.modifiedTime } : {}),
      ...(data.section ? { about: data.section } : {}),
    });
  } else {
    upsertJsonLd('seo-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteSeo.SITE_NAME,
      url,
      description: data.description,
    });
  }
}
