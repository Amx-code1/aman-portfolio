
import React, { useState } from 'react';
import { useInView } from '../../hooks/useInView';
import { useCountUp } from '../../hooks/useCountUp';
import { useNarration } from '../../hooks/useNarration';
import { SplitText } from '../../animations/SplitText';
import { Reveal } from '../../animations/Reveal';
import { Parallax } from '../../animations/Parallax';
import { Appear } from '../../anim/primitives/Appear';
import { EnergyPulse } from '../../anim/primitives/EnergyPulse';
import { CharacterSilhouette } from '../CharacterSilhouette/CharacterSilhouette';
import { GlassCard } from '../ui/GlassCard';
import { AboutIllustration } from './AboutIllustration';
import {
  aboutProfile,
  mission,
  dream,
  values,
  achievements,
  journey,
  type AboutValue,
  type Achievement,
} from '../../content/about';
import './About.css';

function ChapterHead({ index, kanji, title }: { index: string; kanji: string; title: string }) {
  return (
    <div className="about-ch__head">
      <div className="about-ch__rail">
        <span className="about-ch__index">CH.{index}</span>
        <h3 className="about-ch__title">
          <SplitText text={title} as="span" stagger={0.05} />
        </h3>
      </div>
      <Parallax speed={0.05} className="about-ch__kanji-bg">
        <span className="about-ch__kanji" aria-hidden="true">
          {kanji}
        </span>
      </Parallax>
    </div>
  );
}

function ValueCard({ value, i }: { value: AboutValue; i: number }) {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -8, y: px * 8 });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <Reveal as="div" className="value-card-wrap" delay={i * 0.08} y={42}>
      <button
        className={`value-card ${flipped ? 'is-flipped' : ''}`}
        style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        onClick={() => setFlipped((f) => !f)}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        aria-pressed={flipped}
        data-cursor="hover"
        aria-label={`${value.title} — ${value.short}. Activate to read more.`}
      >
        <span className="value-card__glow" style={{ background: value.tone }} aria-hidden="true" />
        <span className="value-card__kanji" style={{ color: value.tone }} aria-hidden="true">
          {value.kanji}
        </span>
        <span className="value-card__inner">
          <span className="value-card__face value-card__face--front">
            <span className="value-card__title">{value.title}</span>
            <span className="value-card__short">{value.short}</span>
            <span className="value-card__hint">Tap to read →</span>
          </span>
          <span className="value-card__face value-card__face--back">
            <span className="value-card__long">{value.long}</span>
          </span>
        </span>
      </button>
    </Reveal>
  );
}

function AchievementCard({ a, i }: { a: Achievement; i: number }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });
  const v = useCountUp(a.value, inView, 1700);

  return (
    <div ref={ref} className={`ach-card ${inView ? 'is-in' : ''}`} style={{ transitionDelay: `${i * 0.08}s` }}>
      <GlassCard className="ach-card__inner" glow>
        <span className="ach-card__value">
          {v}
          {a.suffix ?? ''}
        </span>
        <span className="ach-card__label">{a.label}</span>
        <span className="ach-card__note">{a.note}</span>
      </GlassCard>
    </div>
  );
}

export function About() {
  const { speak, stop, speaking, supported } = useNarration();
  const fullScript = `${mission.narration} ${dream.narration} ${values
    .map((v) => v.long)
    .join(' ')}`;

  const toggleNarration = () => {
    if (speaking) stop();
    else speak(fullScript);
  };

  return (
    <section className="about-cinematic section" id="studio">
      <div className="container">
        <header className="about-ep">
          <Reveal className="about-ep__badge" as="div">
            <span className="about-ep__dot" aria-hidden="true" />
            {aboutProfile.episode}
          </Reveal>
          <SplitText as="h2" text={aboutProfile.title} className="about-ep__title" stagger={0.035} />
          <Reveal as="p" className="about-ep__sub" delay={0.1}>
            {aboutProfile.subtitle}
          </Reveal>
          {supported && (
            <button
              className={`about-narrate ${speaking ? 'is-on' : ''}`}
              onClick={toggleNarration}
              data-cursor="hover"
              aria-pressed={speaking}
            >
              <span className="about-narrate__bars" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              {speaking ? 'Stop Narration' : 'Play Episode Narration'}
            </button>
          )}
        </header>

        <article className="about-ch">
          <ChapterHead index="00" kanji="志" title="Mission" />
          <div className="about-mission">
            <AboutIllustration variant="wind" className="about-mission__art" />
            <Reveal as="p" className="about-mission__text" delay={0.1}>
              {mission.body}
            </Reveal>
          </div>
        </article>

        <article className="about-ch about-ch--center">
          <ChapterHead index="01" kanji="夢" title="Dream" />
          <div className="about-dream">
            <div className="about-dream__pulse" aria-hidden="true">
              <EnergyPulse count={3} color="var(--c-purple)" />
            </div>
            <CharacterSilhouette className="about-dream__char" />
            <Appear mode="scale" className="about-dream__statement">
              <h3 className="about-dream__title">{dream.statement}</h3>
            </Appear>
            <Reveal as="p" className="about-dream__sub" delay={0.15}>
              {dream.sub}
            </Reveal>
          </div>
        </article>

        <article className="about-ch">
          <ChapterHead index="02" kanji="心" title="Values" />
          <div className="about-values">
            {values.map((v, i) => (
              <ValueCard key={v.id} value={v} i={i} />
            ))}
          </div>
        </article>

        <article className="about-ch">
          <ChapterHead index="03" kanji="績" title="Achievements" />
          <div className="about-ach">
            {achievements.map((a, i) => (
              <AchievementCard key={a.label} a={a} i={i} />
            ))}
          </div>
        </article>

        <article className="about-ch">
          <ChapterHead index="04" kanji="旅" title="Journey" />
          <div className="about-journey">
            {journey.map((b, i) => (
              <Reveal as="div" className="about-beat" key={b.id} delay={i * 0.06} y={30}>
                <Parallax speed={0.04} className="about-beat__bg">
                  <span className="about-beat__kanji" aria-hidden="true">
                    {b.kanji}
                  </span>
                </Parallax>
                <span className="about-beat__ch">CH.{b.chapter}</span>
                <h4 className="about-beat__title">{b.title}</h4>
                <p className="about-beat__body">{b.body}</p>
              </Reveal>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
