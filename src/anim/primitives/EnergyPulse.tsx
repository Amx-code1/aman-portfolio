
import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'motion';
import { prefersReducedMotion } from '../../lib/utils';
import './EnergyPulse.css';

/**
 * Motion One energy pulse — concentric rings expand outward forever.
 * Used for "power core" moments.
 */
export function EnergyPulse({ count = 4, color = 'var(--c-cyan)' }: { count?: number; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const rings = el.querySelectorAll('.pulse__ring');
    const controls = animate(
      rings,
      { transform: ['scale(0.25)', 'scale(2.2)'], opacity: [0.75, 0] },
      { duration: 2.6, delay: stagger(0.62), repeat: Infinity, easing: 'ease-out' }
    );
    return () => controls.stop?.();
  }, [count]);

  return (
    <div className="pulse" ref={ref} style={{ ['--pulse-color' as any]: color }}>
      {Array.from({ length: count }).map((_, i) => (
        <span className="pulse__ring" key={i} />
      ))}
      <span className="pulse__core" />
    </div>
  );
}
