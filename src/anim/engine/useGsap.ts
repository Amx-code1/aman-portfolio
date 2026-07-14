
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Scoped GSAP hook. Creates a gsap.context bound to the returned ref,
 * automatically reverting all animations on unmount / dep change.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: (self: gsap.Context, el: T) => void,
  deps: any[] = []
) {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context((self) => setup(self, el), el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
