
import React, { useRef, useState, useCallback } from 'react';
import { WorkPoster } from '../WorkPoster/WorkPoster';
import './BeforeAfter.css';

interface Props {
  theme: string;
  beforeCaption: string;
  afterCaption: string;
  beforeVariant?: number;
  afterVariant?: number;
}

export function BeforeAfter({
  theme,
  beforeCaption,
  afterCaption,
  beforeVariant = 0,
  afterVariant = 3,
}: Props) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    update(e.clientX);
  };
  const onMove = (e: React.PointerEvent) => {
    if (dragging.current) update(e.clientX);
  };
  const onUp = () => {
    dragging.current = false;
  };

  return (
    <div
      className="ba"
      ref={ref}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 4));
        if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 4));
      }}
    >
      <div className="ba__layer ba__layer--after">
        <WorkPoster theme={theme} index={afterVariant} />
        <span className="ba__tag ba__tag--after">{afterCaption}</span>
      </div>
      <div className="ba__layer ba__layer--before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <WorkPoster theme="#5a5f7a" index={beforeVariant} />
        <span className="ba__tag ba__tag--before">{beforeCaption}</span>
      </div>
      <div className="ba__handle" style={{ left: `${pos}%` }}>
        <span className="ba__handle-line" />
        <span className="ba__handle-grip" aria-hidden="true">⇆</span>
      </div>
    </div>
  );
}
