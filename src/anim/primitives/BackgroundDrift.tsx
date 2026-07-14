
import React, { ReactNode, useEffect, useRef } from 'react';
import { scroll } from 'motion';
import { prefersReducedMotion } from '../../lib/utils';
import './BackgroundDrift.css';

/**
 * Motion One scroll-linked background movement. The inner layer drifts
 * opposite to scroll progress creating parallax depth.
 */
export function BackgroundDrift({
  children,
  speed = 0.25,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const cleanup = scroll(
      ({ y }) => {
        const v = (y.current || 0) * -speed;
        el.style.transform = `translate3d(0, ${v}px, 0)`;
      },
      { target: el, offset: ['start end', 'end start'] }
    );

    return () => cleanup();
  }, [speed]);

  return (
    <div className={`drift ${className ?? ''}`}>
      <div className="drift__layer" ref={ref}>
        {children}
      </div>
    </div>
  );
}
