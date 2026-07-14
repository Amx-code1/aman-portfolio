
import type { SeoData } from '../lib/seo';

export const defaultSeo: SeoData = {
  title: 'KAZE 風 — Anime & Motion Design Studio',
  description:
    'KAZE is a Tokyo-based anime and motion design studio crafting original series, music videos, and cinematic worlds. We breathe life into still frames.',
  canonical: 'https://kaze.studio/',
  type: 'website',
};

export const notFoundSeo: SeoData = {
  title: '404 — Lost in the Wind | KAZE 風',
  description: 'This page drifted beyond the frame. The story you’re looking for may have moved or never existed.',
  canonical: 'https://kaze.studio/404',
  type: 'website',
  noindex: true,
};

export function projectSeo(
  slug: string,
  title: string,
  description: string,
  year: string
): SeoData {
  return {
    title: `${title} — KAZE 風 Case Study`,
    description,
    canonical: `https://kaze.studio/work/${slug}`,
    type: 'article',
    publishedTime: `${year}-01-01`,
    modifiedTime: new Date().toISOString(),
    section: 'Works',
    tags: ['Anime', 'Motion Design', title],
  };
}
