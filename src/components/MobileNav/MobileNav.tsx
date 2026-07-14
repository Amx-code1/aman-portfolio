
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEngine } from '../../anim/engine/AnimationProvider';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useDeviceProfile } from '../../hooks/useDeviceProfile';
import { TouchRipple } from '../TouchRipple/TouchRipple';
import './MobileNav.css';

const I = {
  home: (p: any) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...p}>
      <path d="M3 11l9-7 9 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9h14v-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  works: (p: any) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
      <rect x="14" y="3" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
      <rect x="3" y="14" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
      <rect x="14" y="14" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  studio: (p: any) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...p}>
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M18 3l1.2 2.4L22 6.6l-2.4 1.2L18 10l-1.2-2.2L14 6.6l2.4-1.2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  lab: (p: any) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...p}>
      <path d="M9 3v6l-5 9a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3l-5-9V3" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 3h8M10 14h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  contact: (p: any) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const ITEMS = [
  { label: 'Home', href: '#top', icon: I.home },
  { label: 'Works', href: '#works', icon: I.works },
  { label: 'Studio', href: '#studio', icon: I.studio },
  { label: 'Lab', href: '#lab', icon: I.lab },
  { label: 'Contact', href: '#contact', icon: I.contact },
];

export function MobileNav({ hidden }: { hidden?: boolean }) {
  const { lenis } = useEngine();
  const { isLandscape } = useDeviceProfile();
  const active = useActiveSection(ITEMS.map((i) => i.href));
  const [hide, setHide] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > lastY.current && y > 160) setHide(true);
        else setHide(false);
        lastY.current = y;
        ticking.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -80 });
      else (el as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }
  };

  const show = !hidden && !hide;

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          className={`mbn ${isLandscape ? 'mbn--landscape' : ''}`}
          aria-label="Mobile navigation"
          initial={reduced ? false : { y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? undefined : { y: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        >
          <div className="mbn__bar">
            {ITEMS.map((it) => {
              const isActive = active === it.href;
              const Icon = it.icon;
              return (
                <TouchRipple
                  key={it.href}
                  className={`mbn__item ${isActive ? 'is-active' : ''}`}
                  onClick={() => go(it.href)}
                  ariaLabel={it.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="mbn-pill"
                      className="mbn__pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="mbn__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="mbn__label">{it.label}</span>
                </TouchRipple>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
