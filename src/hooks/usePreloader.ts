
import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../lib/utils';

export function usePreloader(duration = 2200) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setProgress(100);
      setDone(true);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(100, (elapsed / duration) * 100);
      setProgress(p);
      if (p < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setDone(true), 450);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  return { progress, done };
}
