
import React from 'react';
import './Marquee.css';

interface MarqueeProps {
  items: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
}

export const Marquee = React.memo(function Marquee({
  items,
  speed = 30,
  reverse,
  className,
}: MarqueeProps) {
  const content = items.join('  —  ');
  return (
    <div className={`marquee ${className ?? ''}`} aria-hidden="true">
      <div
        className="marquee__track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        <span className="marquee__item">{content}</span>
        <span className="marquee__item">{content}</span>
      </div>
    </div>
  );
});
