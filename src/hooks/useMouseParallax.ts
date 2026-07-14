
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/utils';

/**
 * Tracks the normalized mouse position (-1..1) and writes it to the
 * element as --mx / --my CSS custom properties, smoothly lerped via rAF.
 * Layers inside the element can read these vars to parallax independently.
 */
export function useMouseParallax<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const loop = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      el.style.setProperty('--mx', cx.toFixed(3));
      el.style.setProperty('--my', cy.toFixed(3));
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
