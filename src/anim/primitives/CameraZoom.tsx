
import React, { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '../engine/useGsap';
import { prefersReducedMotion } from '../../lib/utils';
import './CameraZoom.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP scrubbed camera zoom. As the element travels through the viewport the
 * inner layer scales + un-blurs + de-rotates, simulating a dolly-in.
 */
export function CameraZoom({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useGsap<HTMLDivElement>((ctx, el) => {
    if (prefersReducedMotion()) return;
    const inner = el.querySelector('.cam__inner');
    if (!inner) return;
    gsap.fromTo(
      inner,
      { scale: 1.55, rotate: -4, filter: 'blur(8px)' },
      {
        scale: 1,
        rotate: 0,
        filter: 'blur(0px)',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'center center',
          scrub: 1,
        },
      }
    );
  }, []);

  return (
    <div className={`cam ${className ?? ''}`} ref={ref}>
      <div className="cam__inner">{children}</div>
    </div>
  );
}
