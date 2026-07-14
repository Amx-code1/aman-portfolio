
import React, { useEffect, useRef } from 'react';
import { animate, spring } from 'motion';
import { isFinePointer, prefersReducedMotion } from '../../lib/utils';
import './CursorFX.css';

/**
 * Container-scoped cursor effect (Motion One). A precise dot tracks the
 * pointer while a spring-driven ring trails behind — a contained demo of
 * cursor FX without hijacking the global cursor.
 */
export function CursorFX() {
  const areaRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const area = areaRef.current;
    if (!area || !isFinePointer() || prefersReducedMotion()) return;

    const onMove = (e: MouseEvent) => {
      const rect = area.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (dotRef.current) {
        animate(dotRef.current, { transform: `translate(${x}px, ${y}px)` }, { duration: 0.12 });
      }
      if (ringRef.current) {
        animate(ringRef.current, { transform: `translate(${x}px, ${y}px)` }, { easing: spring({ stiffness: 220, damping: 18 }) });
      }
    };

    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };
    const onEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
    };

    area.addEventListener('mousemove', onMove);
    area.addEventListener('mouseleave', onLeave);
    area.addEventListener('mouseenter', onEnter);
    return () => {
      area.removeEventListener('mousemove', onMove);
      area.removeEventListener('mouseleave', onLeave);
      area.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return (
    <div className="cursorfx" ref={areaRef}>
      <div className="cursorfx__hint">Move your cursor here</div>
      <div className="cursorfx__ring" ref={ringRef} aria-hidden="true" />
      <div className="cursorfx__dot" ref={dotRef} aria-hidden="true" />
    </div>
  );
}
