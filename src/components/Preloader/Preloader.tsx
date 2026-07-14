
import React, { useEffect } from 'react';
import { usePreloader } from '../../hooks/usePreloader';
import { SplitText } from '../../animations/SplitText';
import './Preloader.css';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const { progress, done } = usePreloader();

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(onComplete, 250);
    return () => window.clearTimeout(t);
  }, [done, onComplete]);

  return (
    <div className={`preloader ${done ? 'is-done' : ''}`} aria-hidden={done}>
      <div className="preloader__brand">
        <SplitText
          text="KAZE"
          className="preloader__title"
          active
          baseDelay={0.15}
          stagger={0.09}
          as="span"
        />
        <span className="preloader__jp">風</span>
      </div>
      <div className="preloader__counter">
        <span>{String(Math.floor(progress)).padStart(3, '0')}</span>
      </div>
      <div className="preloader__bar">
        <div
          className="preloader__bar-fill"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>
    </div>
  );
}
