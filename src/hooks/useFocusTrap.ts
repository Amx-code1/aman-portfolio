
import { useEffect, RefObject } from 'react';

/**
 * Accessible focus trap for modal/dialog surfaces.
 * - Moves focus into the container on activation
 * - Cycles Tab / Shift+Tab between focusable children
 * - Restores focus to the previously active element on teardown
 * Respects prefers-reduced-motion indirectly (no animation, just focus).
 */
export function useFocusTrap(ref: RefObject<HTMLElement>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const node = ref.current;
    const prevActive = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);

    const first = getFocusable()[0];
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = getFocusable();
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    node.addEventListener('keydown', onKey);
    return () => {
      node.removeEventListener('keydown', onKey);
      prevActive?.focus?.();
    };
  }, [ref, active]);
}
