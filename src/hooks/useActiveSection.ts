
import { useEffect, useState } from 'react';

/**
 * Tracks which section (by id) is currently active in the viewport.
 * Uses a narrow horizontal band via rootMargin so the "active" section
 * is the one crossing the vertical center of the screen.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id.replace(/^#/, '')))
      .filter((el): el is HTMLElement => el !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive('#' + entry.target.id);
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);

  return active;
}
