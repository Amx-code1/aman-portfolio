
import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '../engine/useGsap';
import { prefersReducedMotion } from '../../lib/utils';
import './TextReveal.css';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  text: string;
  className?: string;
  stagger?: number;
  as?: 'h2' | 'h3' | 'p' | 'span' | 'div';
}

/**
 * GSAP-driven character reveal. Each glyph is masked and scrubbed up
 * on scroll — the anime "title card" feel.
 */
export function TextReveal({ text, className, stagger = 0.028, as = 'div' }: TextRevealProps) {
  const reduced = prefersReducedMotion();

  const ref = useGsap<HTMLDivElement>(
    (ctx, el) => {
      if (reduced) return;
      const chars = el.querySelectorAll('[data-char]');
      gsap.set(chars, { yPercent: 118 });
      gsap.to(chars, {
        yPercent: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    },
    [text]
  );

  const words = text.split(' ');
  const Tag = as as any;

  return (
    <Tag ref={ref} className={`text-reveal ${className ?? ''}`} aria-label={text}>
      {words.map((w, wi) => (
        <span className="tr-word" key={wi} aria-hidden="true">
          {w.split('').map((c, ci) => (
            <span className="tr-mask" key={ci}>
              <span className="tr-char" data-char>
                {c}
              </span>
            </span>
          ))}
          {wi < words.length - 1 && <span className="tr-space"> </span>}
        </span>
      ))}
    </Tag>
  );
}
