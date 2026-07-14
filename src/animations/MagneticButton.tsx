
import React from 'react';
import { useMagnetic } from '../hooks/useMagnetic';
import './MagneticButton.css';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const ref = useMagnetic<HTMLDivElement>(strength);
  return (
    <div ref={ref} className={`magnetic ${className ?? ''}`}>
      {children}
    </div>
  );
}
