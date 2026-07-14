
import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { siteConfig } from '../../constants';
import { socials } from '../../content/socials';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useEngine } from '../../anim/engine/AnimationProvider';
import { Magnetic } from '../../animations/MagneticButton';
import { AnimatedLogo } from './AnimatedLogo';
import { useSurprises } from '../../features/surprises/SurpriseProvider';
import './Navigation.css';

const NAV_IDS = siteConfig.nav.map((n) => n.href);

export function Navigation({
  loaded,
  projectMode,
  onHome,
  disableMobileMenu = false,
}: {
  loaded: boolean;
  projectMode?: boolean;
  onHome?: () => void;
  disableMobileMenu?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const progress = useScrollProgress();
  const active = useActiveSection(NAV_IDS);
  const { lenis } = useEngine();
  const { dayMode, toggleDay } = useSurprises();

  const linksRef = useRef<HTMLElement | null>(null);
  const gooRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useLayoutEffect(() => {
    const update = () => {
      const goo = gooRef.current;
      if (!goo) return;
      let css = '';
      siteConfig.nav.forEach((item, i) => {
        const link = linkRefs.current[item.href];
        if (link) {
          css += `--bx-${i}:${link.offsetLeft}px;--by-${i}:${link.offsetTop}px;--bw-${i}:${link.offsetWidth}px;--bh-${i}:${link.offsetHeight}px;`;
        }
      });
      goo.style.cssText = css;
    };
    update();
    const ro = new ResizeObserver(update);
    if (linksRef.current) ro.observe(linksRef.current);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [loaded]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    const items = overlay
      ? Array.from(overlay.querySelectorAll<HTMLElement>('a[href], button'))
      : [];
    firstLinkRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        burgerRef.current?.focus();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const idx = items.findIndex((el) => el === document.activeElement);
        let next = idx;
        if (e.key === 'ArrowDown') next = (idx + 1) % items.length;
        else next = (idx - 1 + items.length) % items.length;
        items[Math.max(0, next)]?.focus();
      } else if (e.key === 'Tab') {
        const idx = items.findIndex((el) => el === document.activeElement);
        if (e.shiftKey && idx <= 0) {
          e.preventDefault();
          items[items.length - 1]?.focus();
        } else if (!e.shiftKey && idx === items.length - 1) {
          e.preventDefault();
          items[0]?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const goTo = useCallback(
    (href: string, close = true) => {
      if (!href.startsWith('#')) return;
      const el = document.querySelector(href);
      if (el) {
        if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -90 });
        else (el as HTMLElement).scrollIntoView({ behavior: 'smooth' });
      }
      if (close) setOpen(false);
    },
    [lenis]
  );

  const onNavClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      goTo(href);
      if (open) burgerRef.current?.focus();
    }
  };

  const toggle = () => setOpen((o) => !o);

  const logoClick = (e: React.MouseEvent) => {
    if (projectMode && onHome) {
      e.preventDefault();
      onHome();
    } else {
      onNavClick(e, '#top');
    }
  };

  return (
    <>
      <header
        className={`nav ${loaded ? 'is-loaded' : ''} ${scrolled ? 'is-scrolled' : ''} ${
          open ? 'is-menu-open' : ''
        } ${projectMode ? 'nav--project' : ''}`}
      >
        <div className="nav__inner container">
          <AnimatedLogo onClick={logoClick} />

          <nav className="nav__links" aria-label="Primary" ref={linksRef}>
            <div className="nav__goo" aria-hidden="true" ref={gooRef}>
              {siteConfig.nav.map((item, i) => (
                <span
                  key={item.href}
                  className={`nav__blob ${active === item.href ? 'is-active' : ''} ${
                    hovered === item.href ? 'is-hover' : ''
                  }`}
                  style={
                    {
                      left: `var(--bx-${i})`,
                      top: `var(--by-${i})`,
                      width: `var(--bw-${i})`,
                      height: `var(--bh-${i})`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
            <ul className="nav__list">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a
                    className={`nav__link ${
                      active === item.href ? 'is-current' : ''
                    } ${hovered === item.href ? 'is-hot' : ''}`}
                    href={item.href}
                    ref={(el) => {
                      linkRefs.current[item.href] = el;
                    }}
                    onMouseEnter={() => setHovered(item.href)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(item.href)}
                    onBlur={() => setHovered(null)}
                    onClick={(e) => onNavClick(e, item.href)}
                    aria-current={active === item.href ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <svg className="nav__goo-svg" width="0" height="0" aria-hidden="true">
              <defs>
                <filter id="goo">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
                    result="goo"
                  />
                  <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                </filter>
              </defs>
            </svg>
          </nav>

          <div className="nav__actions">
            {projectMode ? (
              <button className="nav__back" onClick={onHome} data-cursor="hover">
                ← Back to Studio
              </button>
            ) : (
              <Magnetic>
                <a
                  className="nav__cta"
                  href="#contact"
                  onClick={(e) => onNavClick(e, '#contact')}
                  data-cursor="hover"
                >
                  Get in touch
                </a>
              </Magnetic>
            )}
            <button
              className="nav__theme"
              onClick={toggleDay}
              aria-label={dayMode ? 'Switch to dark mode' : 'Switch to light mode'}
              aria-pressed={dayMode}
              data-cursor="hover"
            >
              <span aria-hidden="true">{dayMode ? '☀️' : '🌙'}</span>
            </button>
            {!disableMobileMenu && (
              <button
                className={`nav__burger ${open ? 'is-open' : ''}`}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls="nav-overlay"
                onClick={toggle}
                ref={burgerRef}
                data-cursor="hover"
              >
                <span className="nav__burger-box" aria-hidden="true">
                  <span className="nav__burger-line" />
                  <span className="nav__burger-line" />
                </span>
              </button>
            )}
          </div>
        </div>

        <div
          className="nav__progress"
          style={{ transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />
      </header>

      <nav className="nav__dots" aria-label="Section progress">
        {siteConfig.nav.map((item) => (
          <button
            key={item.href}
            className={`nav__dot ${active === item.href ? 'is-active' : ''}`}
            aria-label={`Go to ${item.label}`}
            aria-current={active === item.href ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault();
              goTo(item.href);
            }}
            data-cursor="hover"
          />
        ))}
      </nav>

      {!disableMobileMenu && (
        <div
          className={`nav__overlay ${open ? 'is-open' : ''}`}
          id="nav-overlay"
          ref={overlayRef}
          aria-hidden={!open}
        >
          <nav className="nav__overlay-nav" aria-label="Mobile">
            {siteConfig.nav.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className={`nav__overlay-link ${active === item.href ? 'is-current' : ''}`}
                onClick={(e) => onNavClick(e, item.href)}
                ref={i === 0 ? firstLinkRef : undefined}
                tabIndex={open ? 0 : -1}
                style={{ transitionDelay: open ? `${0.12 + i * 0.07}s` : '0s' }}
              >
                <span className="nav__overlay-index">0{i + 1}</span>
                <span className="nav__overlay-label">{item.label}</span>
              </a>
            ))}
          </nav>
          <div className="nav__overlay-foot">
            <a
              className="nav__overlay-mail"
              href={`mailto:${siteConfig.email}`}
              tabIndex={open ? 0 : -1}
            >
              {siteConfig.email}
            </a>
            <div className="nav__overlay-socials">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="nav__overlay-social"
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={open ? 0 : -1}
                  data-cursor="hover"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
