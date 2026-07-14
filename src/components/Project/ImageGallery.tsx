
import React, { useState, useEffect, useCallback } from 'react';
import { WorkPoster } from '../WorkPoster/WorkPoster';
import { Reveal } from '../../animations/Reveal';
import type { WorkGalleryItem } from '../../types';
import './ImageGallery.css';

export function ImageGallery({ items, theme }: { items: WorkGalleryItem[]; theme: string }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((a) => (a === null ? a : (a + 1) % items.length)),
    [items.length]
  );
  const prev = useCallback(
    () => setActive((a) => (a === null ? a : (a - 1 + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, close, next, prev]);

  return (
    <>
      <div className="gallery">
        {items.map((it, i) => (
          <Reveal className="gallery__cell" key={it.id} delay={(i % 3) * 0.08} y={40}>
            <button
              className="gallery__item"
              onClick={() => setActive(i)}
              data-cursor="hover"
              aria-label={`Open still: ${it.caption}`}
            >
              <WorkPoster theme={theme} index={it.variant} />
              <span className="gallery__cap">{it.caption}</span>
              <span className="gallery__zoom" aria-hidden="true">⤢</span>
            </button>
          </Reveal>
        ))}
      </div>

      {active !== null && (
        <div className="gallery__light" onClick={close} role="dialog" aria-modal="true" aria-label="Image viewer">
          <button className="gallery__nav gallery__nav--prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous still">←</button>
          <figure className="gallery__figure" onClick={(e) => e.stopPropagation()}>
            <div className="gallery__figure-media">
              <WorkPoster theme={theme} index={items[active].variant} />
            </div>
            <figcaption>{items[active].caption}</figcaption>
          </figure>
          <button className="gallery__nav gallery__nav--next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next still">→</button>
          <button className="gallery__close" onClick={close} aria-label="Close viewer">✕</button>
        </div>
      )}
    </>
  );
}
