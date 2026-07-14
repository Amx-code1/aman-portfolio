
import React, { useMemo } from 'react';
import './Dust.css';

const COLORS = ['#00f0ff', '#9b5de5', '#ff5c8a', '#f4f6ff'];

export function Dust({ count = 46 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 12,
      duration: Math.random() * 12 + 10,
      color: COLORS[i % COLORS.length],
    }));
  }, [count]);

  return (
    <div className="dust" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="dust__particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
