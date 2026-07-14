
import React, { useRef, useState, useCallback } from 'react';
import { prefersReducedMotion } from '../../lib/utils';
import './TouchRipple.css';

interface RippleInst {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface TouchRippleProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  ariaLabel?: string;
  onClick?: (e: React.PointerEvent<HTMLElement>) => void;
  [key: string]: any;
}

/**
 * A reusable, GPU-friendly touch ripple wrapper. Renders a button (or anchor)
 * and spawns an expanding radial ripple at the exact touch point.
 */
export function TouchRipple({
  children,
  className,
  href,
  ariaLabel,
  onClick,
  ...rest
}: TouchRippleProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [ripples, setRipples] = useState<RippleInst[]>([]);

  const spawn = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2.4;
    const id = performance.now() + Math.random();
    setRipples((prev) => [...prev, { id, x, y, size }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 620);
  }, []);

  const handle = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      spawn(e);
      onClick?.(e);
    },
    [spawn, onClick]
  );

  const cls = `touch-ripple ${className ?? ''}`;
  const content = (
    <>
      <span className="touch-ripple__layer" aria-hidden="true">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="touch-ripple__item"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          />
        ))}
      </span>
      <span className="touch-ripple__content">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={cls}
        aria-label={ariaLabel}
        onClick={handle as any}
        {...rest}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      className={cls}
      aria-label={ariaLabel}
      onClick={handle as any}
      {...rest}
    >
      {content}
    </button>
  );
}
