
import React, { useState, useEffect, useRef } from 'react';
import { Reveal } from '../../animations/Reveal';
import { Magnetic } from '../../animations/MagneticButton';
import { SectionHeading } from '../SectionHeading/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { CyberButton } from '../ui/CyberButton';
import { AnimeMailbox } from './AnimeMailbox';
import { PaperPlane } from './PaperPlane';
import { MagicPortal } from './MagicPortal';
import { Confetti } from './Confetti';
import { persistence } from '../../lib/persistence';
import { audio } from '../../lib/audio';
import { siteConfig } from '../../constants';
import { socials } from '../../content/socials';
import { profile } from '../../content/profile';
import { prefersReducedMotion } from '../../lib/utils';
import './Contact.css';

type FormState = { name: string; email: string; message: string; company: string };
type Status = 'idle' | 'sending' | 'sent';
type Errors = Partial<Record<'name' | 'email' | 'message' | 'form', string>>;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function buildResume(): string {
  const year = new Date().getFullYear();
  return [
    'KAZE 風 — ANIME & MOTION DESIGN STUDIO',
    'Profile: https://kaze.studio',
    '',
    'STUDIO',
    'KAZE is a Tokyo-based anime and motion design studio crafting original',
    'series, music videos, and cinematic worlds. We breathe life into still frames.',
    '',
    'CONTACT',
    `Email: ${profile.email}`,
    `Location: ${profile.location}`,
    `Established: ${profile.established}`,
    '',
    'CAPABILITIES',
    '• Animation Direction & Keyframe Craft',
    '• World Building & Visual Development',
    '• VFX, Simulation & Generative Systems',
    '• Sound Design & Audioreactive Direction',
    '',
    'SELECTED WORKS',
    '• Neon Drifter — 12-episode cyberpunk series (2024)',
    '• Crimson Lotus — Period fantasy feature (2023)',
    '• Echoes of Tomorrow — Audioreactive music video (2023)',
    '• Silent Horizon — Festival short film (2022)',
    '• Paper Moons — Original OVA (2022)',
    '• Void Walker — Game cinematic trailer (2024)',
    '',
    'RECOGNITION',
    '48 Projects Shipped · 12 Awards · 32M Frames Drawn',
    '',
    `© ${year} KAZE Studio. Crafted with motion in Tokyo.`,
  ].join('\n');
}

export function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '', company: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [planeFlying, setPlaneFlying] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [tokyo, setTokyo] = useState('');
  const startRef = useRef(Date.now());
  const successRef = useRef<HTMLDivElement>(null);

  const update =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Tokyo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const tick = () => setTokyo(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  const validate = (): Errors => {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your name (2+ characters).';
    if (!EMAIL_RE.test(form.email)) e.email = 'Enter a valid email address.';
    if (form.message.trim().length < 10) e.message = 'Tell us a bit more (10+ characters).';
    return e;
  };

  const resetForm = () => {
    setForm({ name: '', email: '', message: '', company: '' });
    setStatus('idle');
    setErrors({});
    setPlaneFlying(false);
    setConfetti(false);
    startRef.current = Date.now();
  };

  const onFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setErrors({});

    // Honeypot — real users never fill this field
    if (form.company.trim() !== '') {
      setStatus('sent');
      setPlaneFlying(true);
      if (!prefersReducedMotion()) {
        setConfetti(true);
        window.setTimeout(() => setConfetti(false), 3400);
      }
      audio.playSfx('success');
      return;
    }

    // Minimum human interaction time
    if (Date.now() - startRef.current < 2500) {
      setErrors({ form: 'Please take a moment before sending.' });
      audio.playSfx('error');
      return;
    }

    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setStatus('sending');
    setPlaneFlying(true);

    window.setTimeout(async () => {
      try {
        await persistence.setItem(
          'kaze_message_' + Date.now(),
          JSON.stringify({ ...form, at: new Date().toISOString() })
        );
        setStatus('sent');
        audio.playSfx('success');
        if (!prefersReducedMotion()) {
          setConfetti(true);
          window.setTimeout(() => setConfetti(false), 3400);
        }
        window.setTimeout(() => successRef.current?.focus(), 140);
      } catch {
        setStatus('idle');
        setPlaneFlying(false);
        setErrors({ form: 'Transmission failed. Please try again.' });
        audio.playSfx('error');
      }
    }, 1100);
  };

  const downloadResume = () => {
    const blob = new Blob([buildResume()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'KAZE_Studio_Profile.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const mailboxState: 'idle' | 'sending' | 'sent' =
    status === 'sent' ? 'sent' : status === 'sending' ? 'sending' : 'idle';

  return (
    <section className="contact section" id="contact">
      <Confetti fire={confetti} />
      <div className="container">
        <SectionHeading
          index="06"
          title="Open a Channel"
          subtitle="Send a message through the wind. We answer every transmission."
        />

        <div className="contact__grid">
          <div className="contact__left">
            <Reveal className="contact__mailbox-stage" as="div">
              <MagicPortal />
              <AnimeMailbox state={mailboxState} />
              <PaperPlane flying={planeFlying} />
            </Reveal>

            <Reveal as="div" delay={0.05}>
              <p className="contact__lead">
                Whether it's an original series, a music video, or a brand film — we'd love to hear
                about the world you want to build.
              </p>
              <a className="contact__email" href={`mailto:${siteConfig.email}`} data-cursor="hover">
                {siteConfig.email}
              </a>
            </Reveal>

            <Reveal as="div" delay={0.1}>
              <div className="contact__avail">
                <span className="contact__avail-dot" aria-hidden="true" />
                <span className="contact__avail-text-wrap">
                  <span className="contact__avail-text">Available for new projects</span>
                  <span className="contact__avail-sub">Tokyo {tokyo} · replies in 1–2 days</span>
                </span>
              </div>
            </Reveal>

            <Reveal as="div" delay={0.15}>
              <div className="contact__socials">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    className="contact__social"
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
              <button className="contact__resume" type="button" onClick={downloadResume} data-cursor="hover">
                ↓ Download Studio Profile
              </button>
            </Reveal>
          </div>

          <div className="contact__right">
            <div className="contact__portal-wrap">
              <MagicPortal />
              <GlassCard className="contact__panel" glow>
                {status === 'sent' ? (
                  <div
                    className="contact__success"
                    role="status"
                    aria-live="polite"
                    tabIndex={-1}
                    ref={successRef}
                  >
                    <div className="contact__success-check" aria-hidden="true">
                      <svg viewBox="0 0 52 52">
                        <circle className="contact__check-circle" cx="26" cy="26" r="24" />
                        <path className="contact__check-path" d="M14 27 L22 35 L38 18" />
                      </svg>
                    </div>
                    <h3>Transmission received</h3>
                    <p>
                      Thank you, {form.name.trim().split(' ')[0] || 'friend'}. Your message is on its
                      way through the wind — we'll reply within two business days.
                    </p>
                    <button className="contact__again" type="button" onClick={resetForm} data-cursor="hover">
                      Send another →
                    </button>
                  </div>
                ) : (
                  <form className="contact__form" onSubmit={onFormSubmit} noValidate>
                    {errors.form && (
                      <p className="contact__error contact__error--form" role="alert">
                        {errors.form}
                      </p>
                    )}

                    <div className="contact__field">
                      <label className="contact__label" htmlFor="c-name">
                        <span>Name</span>
                      </label>
                      <input
                        id="c-name"
                        name="name"
                        type="text"
                        className={`contact__input ${errors.name ? 'is-invalid' : ''}`}
                        value={form.name}
                        onChange={update('name')}
                        placeholder="Your name"
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'err-name' : undefined}
                        data-cursor="text"
                      />
                      {errors.name && (
                        <span className="contact__error" id="err-name" role="alert">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div className="contact__field">
                      <label className="contact__label" htmlFor="c-email">
                        <span>Email</span>
                      </label>
                      <input
                        id="c-email"
                        name="email"
                        type="email"
                        className={`contact__input ${errors.email ? 'is-invalid' : ''}`}
                        value={form.email}
                        onChange={update('email')}
                        placeholder="you@studio.com"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'err-email' : undefined}
                        data-cursor="text"
                      />
                      {errors.email && (
                        <span className="contact__error" id="err-email" role="alert">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    <div className="contact__field">
                      <label className="contact__label" htmlFor="c-message">
                        <span>Project</span>
                        <span className="contact__count">
                          {form.message.trim().length < 10
                            ? `${10 - form.message.trim().length} more`
                            : '✓'}
                        </span>
                      </label>
                      <textarea
                        id="c-message"
                        name="message"
                        rows={4}
                        className={`contact__textarea ${errors.message ? 'is-invalid' : ''}`}
                        value={form.message}
                        onChange={update('message')}
                        placeholder="A few words about your vision…"
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'err-message' : undefined}
                        data-cursor="text"
                      />
                      {errors.message && (
                        <span className="contact__error" id="err-message" role="alert">
                          {errors.message}
                        </span>
                      )}
                    </div>

                    {/* Honeypot — hidden from humans & assistive tech */}
                    <div className="contact__hp" aria-hidden="true">
                      <label htmlFor="c-company">Company</label>
                      <input
                        id="c-company"
                        name="company"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.company}
                        onChange={update('company')}
                      />
                    </div>

                    <Magnetic>
                      <CyberButton type="submit" variant="primary" className="contact__submit">
                        {status === 'sending' ? 'Sending…' : 'Send Message'}
                      </CyberButton>
                    </Magnetic>
                  </form>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
