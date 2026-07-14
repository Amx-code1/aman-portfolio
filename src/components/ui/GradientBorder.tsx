
import React from 'react';
import { useGlow } from '../../hooks/useGlow';
import './GradientBorder.css';

interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  glass?: boolean;
}

export const GradientBorder = React.memo(function GradientBorder({
  children,
  className,
  radius = 18,
  glass = true,
}: GradientBorderProps) {
  const ref = useGlow<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`grad-border ${className ?? ''}`}
      style={{ ['--gb-radius' as any]: `${radius}px` }}
    >
      <span className="grad-border__reflect" aria-hidden="true" />
      <div className={`grad-border__inner ${glass ? 'grad-border__inner--glass' : ''}`}>
        {children}
      </div>
    </div>
  );
});
