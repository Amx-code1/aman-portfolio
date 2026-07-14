
import { useEffect, useRef } from 'react';

export type SwipeDir = 'up' | 'down' | 'left' | 'right';

interface Handlers {
  onSwipe?: (dir: SwipeDir, distance: number) => void;
  onTap?: (x: number, y: number) => void;
  threshold?: number;
}

/**
 * Lightweight pointer-based gesture detector. Attaches to a ref element
 * and resolves taps and directional swipes — the foundation for touch UX.
 */
export function useGestures<T extends HTMLElement = HTMLDivElement>(handlers: Handlers) {
  const ref = useRef<T | null>(null);
  const h = useRef(handlers);
  h.current = handlers;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let sx = 0;
    let sy = 0;
    let st = 0;
    let tracking = false;

    const down = (e: PointerEvent) => {
      tracking = true;
      sx = e.clientX;
      sy = e.clientY;
      st = performance.now();
    };
    const up = (e: PointerEvent) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);
      const dt = performance.now() - st;
      const thr = h.current.threshold ?? 40;
      if (adx < 10 && ady < 10 && dt < 350) {
        h.current.onTap?.(e.clientX, e.clientY);
        return;
      }
      if (Math.max(adx, ady) < thr) return;
      if (adx > ady) h.current.onSwipe?.(dx < 0 ? 'left' : 'right', adx);
      else h.current.onSwipe?.(dy < 0 ? 'up' : 'down', ady);
    };
    const cancel = () => {
      tracking = false;
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', cancel);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', cancel);
    };
  }, []);

  return ref;
}
