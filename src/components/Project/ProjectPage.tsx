
import React from 'react';
import { Reveal } from '../../animations/Reveal';
import { SplitText } from '../../animations/SplitText';
import { SectionHeading } from '../SectionHeading/SectionHeading';
import { CyberButton } from '../ui/CyberButton';
import { Tag } from '../ui/Tag';
import { CharacterSilhouette } from '../CharacterSilhouette/CharacterSilhouette';
import { useInView } from '../../hooks/useInView';
import { useCountUp } from '../../hooks/useCountUp';
import { VideoPreview } from './VideoPreview';
import { ImageGallery } from './ImageGallery';
import { BeforeAfter } from './BeforeAfter';
import { InteractivePrototype } from './InteractivePrototype';
import { withAlpha, rotateHue } from '../../lib/color';
import type { Work } from '../../types';
import './ProjectPage.css';

interface Props {
  work: Work;
  onBack: () => void;
  onOpen: (id: string) => void;
  next: Work | null;
}

function MetricCard({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });
  const v = useCountUp(value, inView, 1700);
  return (
    <div ref={ref} className="project__metric">
      <span className="project__metric-val">
        {v}
        {suffix ?? ''}
      </span>
      <span className="project__metric-label">{label}</span>
    </div>
  );
}

export function ProjectPage({ work, onBack, onOpen, next }: Props) {
  const p2 = rotateHue(work.theme, 45);
  const p3 = rotateHue(work.theme, -55);

  const themeVars = {
    ['--p-primary']: work.theme,
    ['--p-2']: p2,
    ['--p-3']: p3,
    ['--p-soft']: withAlpha(work.theme, 0.16),
    ['--p-glow']: `0 0 50px ${withAlpha(work.theme, 0.45)}`,
    ['--p-grad']: `linear-gradient(135deg, ${work.theme}, ${p2} 50%, ${p3})`,
  } as React.CSSProperties;

  return (
    <article className="project" style={themeVars}>
      <div className="project__atmos" aria-hidden="true">
        <span className="project__atmos-glow" />
        <span className="project__atmos-glow project__atmos-glow--2" />
      </div>

      <header className="project__hero">
        <div className="project__hero-bg" aria-hidden="true">
          <span className="project__hero-glow" />
          <CharacterSilhouette className="project__hero-char" />
        </div>
        <div className="container project__hero-inner">
          <div className="project__hero-meta">
            <button className="project__back" onClick={onBack} data-cursor="hover">
              ← All Works
            </button>
            <Tag tone="cyan">{work.category}</Tag>
            <Tag tone="purple">{work.year}</Tag>
            {work.format && <Tag>{work.format}</Tag>}
          </div>
          <SplitText as="h1" text={work.title} className="project__title" stagger={0.05} />
          <p className="project__tagline">{work.tagline}</p>
          <p className="project__desc">{work.description}</p>
          <div className="project__hero-actions">
            <CyberButton href={work.liveDemo} variant="primary">
              ▶ Live Demo
            </CyberButton>
            <CyberButton href={work.github} variant="ghost">
              GitHub
            </CyberButton>
          </div>
        </div>
      </header>

      <section className="project__video section" id="trailer">
        <div className="container">
          <SectionHeading index="00" title="Trailer" subtitle="A glimpse into the world we built." />
          <VideoPreview theme={work.theme} title={work.title} duration={work.duration ?? '2:00'} />
        </div>
      </section>

      <section className="project__case section">
        <div className="container project__case-grid">
          <Reveal className="project__case-block">
            <h3 className="project__case-h">Role</h3>
            <p>{work.role}</p>
          </Reveal>
          <Reveal className="project__case-block" delay={0.08}>
            <h3 className="project__case-h">Format</h3>
            <p>{work.format ?? `${work.category} · ${work.year}`}</p>
          </Reveal>
          <Reveal className="project__case-block" delay={0.16}>
            <h3 className="project__case-h">Discipline</h3>
            <p>Anime · Motion · World Building</p>
          </Reveal>
          <Reveal className="project__case-block" delay={0.24}>
            <h3 className="project__case-h">Studio</h3>
            <p>KAZE 風 — Tokyo</p>
          </Reveal>
        </div>
      </section>

      <section className="project__gallery section" id="stills">
        <div className="container">
          <SectionHeading index="01" title="Stills" subtitle="Frames from the final master." />
          <ImageGallery items={work.gallery} theme={work.theme} />
        </div>
      </section>

      <section className="project__stack section" id="craft">
        <div className="container">
          <SectionHeading index="02" title="Tech Stack" subtitle="The tools behind the frames." />
          <div className="project__chips">
            {work.techStack.map((t, i) => (
              <Reveal className="project__chip" key={t.name} delay={i * 0.05} y={24}>
                <span className="project__chip-dot" />
                <span className="project__chip-name">{t.name}</span>
                <span className="project__chip-role">{t.role}</span>
              </Reveal>
            ))}
          </div>

          <SectionHeading index="03" title="Animation Craft" subtitle="Techniques in motion." />
          <div className="project__anim-grid">
            {work.animationTechniques.map((a, i) => (
              <Reveal className="project__anim" key={a.name} delay={(i % 3) * 0.06} y={30}>
                <span className="project__anim-bar" />
                <h4 className="project__anim-name">{a.name}</h4>
                <p className="project__anim-note">{a.note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="project__metrics section" id="metrics">
        <div className="container">
          <SectionHeading index="04" title="By the Numbers" subtitle="Impact & performance." />
          <div className="project__metrics-grid">
            {work.metrics.map((m, i) => (
              <MetricCard key={m.label} value={m.value} suffix={m.suffix} label={m.label} />
            ))}
          </div>
        </div>
      </section>

      <section className="project__timeline section" id="timeline">
        <div className="container">
          <SectionHeading index="05" title="Production Timeline" subtitle="From spark to screen." />
          <ol className="project__tl">
            {work.timeline.map((ph, i) => (
              <Reveal as="li" className="project__tl-item" key={ph.phase} delay={i * 0.07} y={28}>
                <span className="project__tl-dot" />
                <div className="project__tl-body">
                  <span className="project__tl-phase">{ph.phase}</span>
                  <span className="project__tl-dur">{ph.duration}</span>
                  <p className="project__tl-desc">{ph.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="project__challenge section" id="challenge">
        <div className="container">
          <SectionHeading index="06" title="The Challenge" subtitle="What stood in our way." />
          <div className="project__cs-grid">
            <Reveal className="project__cs-block">
              <span className="project__cs-tag">The Challenge</span>
              <p>{work.challenge}</p>
            </Reveal>
            <Reveal className="project__cs-block" delay={0.1}>
              <span className="project__cs-tag project__cs-tag--sol">The Solution</span>
              <p>{work.solution}</p>
            </Reveal>
          </div>
          <BeforeAfter
            theme={work.theme}
            beforeCaption={work.beforeCaption}
            afterCaption={work.afterCaption}
          />
        </div>
      </section>

      <section className="project__proto section" id="prototype">
        <div className="container">
          <SectionHeading index="07" title="Interactive Prototype" subtitle={work.prototype.hint} />
          <InteractivePrototype theme={work.theme} type={work.prototype.type} />
        </div>
      </section>

      <nav className="project__footnav container">
        <button className="project__foot-btn" onClick={onBack} data-cursor="hover">
          ← Back to all works
        </button>
        {next && (
          <button className="project__foot-btn project__foot-btn--next" onClick={() => onOpen(next.id)} data-cursor="hover">
            Next: {next.title} →
          </button>
        )}
      </nav>
    </article>
  );
}
