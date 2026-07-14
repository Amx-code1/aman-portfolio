
import React, { ReactNode } from 'react';
import { motion as m, useReducedMotion } from 'framer-motion';

export type AppearMode = 'fade' | 'scale' | 'rotate' | 'blur' | 'spring' | 'elastic';
type Tag = 'div' | 'section' | 'span' | 'h2' | 'h3' | 'p' | 'li';

interface AppearProps {
  children: ReactNode;
  mode?: AppearMode;
  delay?: number;
  y?: number;
  rotate?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  as?: Tag;
}

/**
 * Multi-mode entrance primitive powered by Framer Motion.
 * Each mode maps to a distinct physics profile so the same component
 * never feels repetitive across the site.
 */
export function Appear({
  children,
  mode = 'fade',
  delay = 0,
  y = 40,
  rotate = 8,
  duration = 0.9,
  className,
  once = true,
  as = 'div',
}: AppearProps) {
  const reduced = useReducedMotion();
  const Tag = (m as any)[as] ?? m.div;

  if (reduced) {
    return (
      <Tag className={className} ref={undefined}>
        {children}
      </Tag>
    );
  }

  const hidden = {
    opacity: mode === 'fade' || mode === 'blur' ? 0 : 1,
    y,
    scale: mode === 'scale' ? 0.82 : 1,
    rotate: mode === 'rotate' ? rotate : 0,
    filter: mode === 'blur' ? 'blur(16px)' : 'blur(0px)',
  };

  const show = {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    filter: 'blur(0px)',
    transition:
      mode === 'spring' || mode === 'elastic'
        ? {
            type: 'spring',
            stiffness: mode === 'elastic' ? 120 : 220,
            damping: mode === 'elastic' ? 9 : 20,
            delay,
          }
        : { duration, delay, ease: [0.16, 1, 0.3, 1] },
  };

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-12% 0px' }}
      variants={{ hidden, show }}
    >
      {children}
    </Tag>
  );
}
