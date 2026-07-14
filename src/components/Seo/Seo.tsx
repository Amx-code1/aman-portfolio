
import React, { useEffect } from 'react';
import { applySeo, SeoData } from '../../lib/seo';

/**
 * Headless component that pushes an SEO payload to the document head.
 * Render it once per view (home, project, 404) so metadata stays in sync
 * with the active SPA route.
 */
export function Seo({ data }: { data: SeoData }) {
  useEffect(() => {
    applySeo(data);
  }, [data]);
  return null;
}
