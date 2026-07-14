
import React from 'react';
import { SplitText } from '../../animations/SplitText';
import { CyberButton } from '../ui/CyberButton';
import { HeroSky } from './HeroSky';
import { HeroCanvas } from './HeroCanvas';
import { useTypewriter } from '../../hooks/useTypewriter';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { socials } from '../../content/socials';
import { profile } from '../../content/profile';
import './Hero.css';

const ROTATING = ['Anime Worlds', 'Motion Design', 'Cinematic Stories', 'Living Frames'];

export function Hero({ active }: { active: boolean }) {
  const rootRef = useMouseParallax<HTMLElement>();
  const typed = useTypewriter(ROTATING);

  return (
    <section className={`hero ${active ? 'is-active' : ''}`} id="top" ref={rootRef}>
      <div className="hero__bg">
        <HeroSky />
        <HeroCanvas active={active} />
        <div className="hero__vignette" aria-hidden="true" />
      </div>

      <div className="hero__content container">
        <p className="hero__eyebrow">
          <span className="hero__jp">{profile.jp}</span>
          {profile.studio} — Anime &amp; Motion Studio
        </p>

        <h1 className="hero__title">
          <SplitText
            text="WE BREATHE"
            active={active}
            baseDelay={0.05}
            stagger={0.05}
            as="span"
            className="hero__line"
          />
          <SplitText
            text="LIFE INTO"
            active={active}
            baseDelay={0.28}
            stagger={0.05}
            as="span"
            className="hero__line hero__line--accent"
          />
          <SplitText
            text="STILL FRAMES"
            active={active}
            baseDelay={0.5}
            stagger={0.05}
            as="span"
            className="hero__line"
          />
        </h1>

        <div className="hero__typed">
          <span className="hero__typed-label">Now crafting</span>
          <span className="hero__typed-text" aria-hidden="true">
            {typed}
            <span className="hero__caret" />
          </span>
          <span className="visually-hidden">
            We craft anime worlds, motion design, cinematic stories and living frames.
          </span>
        </div>

        <div className="hero__actions">
          <CyberButton href="#works" variant="primary" className="hero__cta">
            Enter the Studio
          </CyberButton>
          <CyberButton href="#story" variant="ghost" className="hero__cta">
            Our Story
          </CyberButton>
        </div>

        <div className="hero__socials">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="hero__social"
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <a className="hero__scroll" href="#story" aria-label="Scroll to content" data-cursor="drag">
        <span className="hero__scroll-mouse">
          <span className="hero__scroll-dot" />
        </span>
        <span className="hero__scroll-label">Scroll</span>
      </a>
    </section>
  );
}
