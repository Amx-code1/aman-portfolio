
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './SlashTransition.css';

/**
 * Anime "slash" wipe powered by GSAP. Coloured panels slash across the
 * screen with skew, revealing a logo flash in the centre.
 */
export function SlashTransition({ play, onComplete }: { play: boolean; onComplete?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!play || !el) return;

    const panels = el.querySelectorAll('.slash__panel');
    const word = el.querySelector('.slash__word');

    const tl = gsap.timeline({ onComplete });
    tl.set(el, { pointerEvents: 'auto' })
      .fromTo(
        panels,
        { yPercent: 106, skewY: 7 },
        { yPercent: 0, skewY: 0, duration: 0.5, ease: 'power4.in', stagger: 0.05 }
      )
      .fromTo(word, { opacity: 0, scale: 0.78, filter: 'blur(8px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.32 }, '-=0.22')
      .to(word, { opacity: 0, duration: 0.24 }, '+=0.34')
      .to(panels, { yPercent: -106, skewY: -7, duration: 0.5, ease: 'power4.out', stagger: 0.05 }, '-=0.08')
      .set(el, { pointerEvents: 'none' });

    return () => {
      tl.kill();
    };
  }, [play]);

  return (
    <div className="slash" ref={ref} aria-hidden="true">
      <span className="slash__panel" style={{ background: 'var(--c-cyan)' }} />
      <span className="slash__panel" style={{ background: 'var(--c-purple)' }} />
      <span className="slash__panel" style={{ background: 'var(--c-pink)' }} />
      <span className="slash__panel" style={{ background: 'var(--c-indigo-soft)' }} />
      <span className="slash__word">KAZE</span>
    </div>
  );
}
