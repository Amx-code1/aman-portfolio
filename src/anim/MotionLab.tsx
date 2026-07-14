
import React, { useState } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '../components/SectionHeading/SectionHeading';
import { Appear } from './primitives/Appear';
import { TextReveal } from './primitives/TextReveal';
import { SlashTransition } from './primitives/SlashTransition';
import { EnergyPulse } from './primitives/EnergyPulse';
import { CursorFX } from './primitives/CursorFX';
import { CameraZoom } from './primitives/CameraZoom';
import { SharedLayout } from './primitives/SharedLayout';
import { CardExpand } from './primitives/CardExpand';
import { BackgroundDrift } from './primitives/BackgroundDrift';
import './MotionLab.css';

type TabId = 'shared' | 'camera' | 'pulse' | 'drift';

const TABS: { id: TabId; label: string; mode: 'scale' | 'rotate' | 'blur' | 'fade' }[] = [
  { id: 'shared', label: 'Shared Layout', mode: 'scale' },
  { id: 'camera', label: 'Camera · Slash', mode: 'rotate' },
  { id: 'pulse', label: 'Energy · Cursor', mode: 'blur' },
  { id: 'drift', label: 'Drift · Text', mode: 'fade' },
];

const VARIANTS = {
  scale: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  },
  rotate: {
    initial: { opacity: 0, rotate: -3, y: 24 },
    animate: { opacity: 1, rotate: 0, y: 0 },
    exit: { opacity: 0, rotate: 3, y: -24 },
  },
  blur: {
    initial: { opacity: 0, filter: 'blur(18px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(18px)' },
  },
  fade: {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -28 },
  },
};

const EXPAND_ITEMS = [
  { title: 'Frame-by-frame Direction', body: 'We direct motion the way filmmakers direct actors — intent behind every in-between.', tone: 'var(--c-cyan)' },
  { title: 'Generative Worlds', body: 'Procedural systems paint cities, skies, and weather that breathe on their own.', tone: 'var(--c-purple)' },
  { title: 'Audioreactive Design', body: 'Sound drives shape. Particles, type, and light lock to the score in real time.', tone: 'var(--c-pink)' },
];

export function MotionLab() {
  const [tab, setTab] = useState<TabId>('shared');
  const [slash, setSlash] = useState(false);
  const active = TABS.find((t) => t.id === tab)!;

  const renderPanel = () => {
    switch (tab) {
      case 'shared':
        return (
          <div className="lab__block">
            <p className="lab__lead">Framer Motion <b>Shared Layout</b> — click a card to morph it into a focused view with spring physics.</p>
            <SharedLayout />
          </div>
        );
      case 'camera':
        return (
          <div className="lab__block">
            <p className="lab__lead">GSAP <b>Camera Zoom</b> (scrubbed dolly) plus the anime <b>Slash Transition</b>.</p>
            <div className="lab__camera-wrap">
              <CameraZoom className="lab__camera">
                <div className="lab__camera-art">
                  <span className="lab__camera-jp">風</span>
                </div>
              </CameraZoom>
            </div>
            <button className="lab__btn" onClick={() => setSlash(true)} data-cursor="hover">
              Play Slash Transition →
            </button>
            <SlashTransition play={slash} onComplete={() => setSlash(false)} />
          </div>
        );
      case 'pulse':
        return (
          <div className="lab__block lab__block--split">
            <div className="lab__pulse-wrap">
              <EnergyPulse count={4} />
            </div>
            <CursorFX />
          </div>
        );
      case 'drift':
        return (
          <div className="lab__block">
            <p className="lab__lead">Motion One <b>scroll-driven drift</b> behind a GSAP <b>Text Reveal</b>.</p>
            <div className="lab__drift-stage">
              <BackgroundDrift speed={0.35} className="lab__drift">
                <span className="lab__drift-orb lab__drift-orb--1" />
                <span className="lab__drift-orb lab__drift-orb--2" />
                <span className="lab__drift-orb lab__drift-orb--3" />
              </BackgroundDrift>
              <TextReveal as="h3" className="lab__drift-text" text="Motion is emotion — every keyframe a deliberate choice." />
            </div>
            <Appear mode="elastic" className="lab__expand-wrap" delay={0.1}>
              <CardExpand items={EXPAND_ITEMS} />
            </Appear>
          </div>
        );
    }
  };

  return (
    <section className="lab section" id="lab">
      <div className="container">
        <SectionHeading index="07" title="Motion Engine" subtitle="A multi-library animation system in motion." />

        <div className="lab__tabs" role="tablist" aria-label="Animation demos">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`lab__tab ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
              data-cursor="hover"
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="lab__stage">
          <AnimatePresence mode="wait">
            <m.div
              key={tab}
              className="lab__panel"
              variants={VARIANTS[active.mode]}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderPanel()}
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
