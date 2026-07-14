
import React from 'react';
import { useInView } from '../hooks/useInView';
import './Reveal.css';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: keyof JSX.IntrinsicElements;
  once?: boolean;
}

export const Reveal = React.memo(function Reveal({
  children,
  className,
  delay = 0,
  y = 44,
  as = 'div',
  once = true,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ once });
  const Tag = as as any;

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-inview' : ''} ${className ?? ''}`}
      style={
        {
          '--reveal-delay': `${delay}s`,
          '--reveal-y': `${y}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
});
