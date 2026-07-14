
import { useEffect, useRef } from 'react';
import { isFinePointer, prefersReducedMotion } from '../lib/utils';

/**
 * Tracks the local pointer position inside an element and exposes it as the
 * CSS custom properties `--gx` / `--gy` (percentages). Surfaces use these to
 * render a handcrafted, pointer-following light — like light catching glass.
 */
export function useGlow<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--gx', `${x.toFixed(1)}%`);
      el.style.setProperty('--gy', `${y.toFixed(1)}%`);
    };
    const onLeave = () => {
      el.style.setProperty('--gx', '50%');
      el.style.setProperty('--gy', '35%');
    };

    onLeave();
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return ref;
}
