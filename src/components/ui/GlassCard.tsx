
import React from 'react';
import { useGlow } from '../../hooks/useGlow';
import './GlassCard.css';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

export const GlassCard = React.memo(function GlassCard({
  children,
  className,
  glow,
  as = 'div',
}: GlassCardProps) {
  const Tag = as as any;
  const ref = useGlow<HTMLElement>();
  return (
    <Tag ref={ref} className={`glass-card ${glow ? 'glass-card--glow' : ''} ${className ?? ''}`}>
      <span className="glass-card__reflect" aria-hidden="true" />
      {children}
    </Tag>
  );
});
