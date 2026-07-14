
import React from 'react';
import { SplitText } from '../../animations/SplitText';
import { socials } from '../../content/socials';
import { siteConfig } from '../../constants';
import './Footer.css';

export function Footer() {
  const year = new Date().getFullYear();
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer">
      <div className="container">
        <a className="footer__cta" href="#contact" data-cursor="hover" aria-label="Start a project">
          <SplitText as="span" text="LET'S CREATE" className="footer__cta-text" />
          <span className="footer__cta-sub">Start a project →</span>
        </a>

        <div className="footer__bottom">
          <div className="footer__socials">
            {socials.map((s) => (
              <a
                key={s.label}
                className="footer__social"
                href={s.href}
                data-cursor="hover"
                target="_blank"
                rel="noreferrer"
              >
                {s.label}
              </a>
            ))}
          </div>
          <p className="footer__copy">
            © {year} {siteConfig.name}. Crafted with motion in Tokyo.
          </p>
          <button className="footer__top" onClick={toTop} data-cursor="hover">
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
