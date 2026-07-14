
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { audio, SfxType } from '../lib/audio';
import { persistence } from '../lib/persistence';
import { prefersReducedMotion } from '../lib/utils';

interface AudioState {
  muted: boolean;
  volume: number;
  ambientOn: boolean;
  ready: boolean;
  toggleMute: () => void;
  toggleAmbient: () => void;
  setVolume: (v: number) => void;
  play: (type: SfxType) => void;
}

const Ctx = createContext<AudioState | null>(null);

export function useAudio(): AudioState {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAudio must be used within an AudioProvider');
  return c;
}

const SEL =
  'a, button, [role="button"], input, textarea, select, [data-cursor], [data-audio]';

/**
 * Boots and orchestrates the immersive audio engine:
 * - Loads + persists user preferences (muted, volume, ambient)
 * - Resumes the AudioContext on the first user gesture (autoplay policy)
 * - Delegates hover / click sound effects globally to interactive elements
 * - Exposes controls through context
 * - Honors prefers-reduced-motion (skips non-essential hover spam)
 */
export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false);
  const [volume, setVol] = useState(0.6);
  const [ambientOn, setAmbientOn] = useState(false);
  const [ready, setReady] = useState(false);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    let active = true;
    (async () => {
      const [m, v, a] = await Promise.all([
        persistence.getItem('kaze_audio_muted'),
        persistence.getItem('kaze_audio_vol'),
        persistence.getItem('kaze_audio_ambient'),
      ]);
      if (!active) return;
      if (m !== null) setMuted(m === 'true');
      if (v !== null) setVol(parseFloat(v) || 0.6);
      if (a !== null) setAmbientOn(a === 'true');
      setReady(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    audio.applyState({ muted, volume });
  }, [muted, volume, ready]);

  useEffect(() => {
    if (!ready) return;
    audio.setAmbient(ambientOn);
    persistence.setItem('kaze_audio_ambient', String(ambientOn));
  }, [ambientOn, ready]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      persistence.setItem('kaze_audio_muted', String(next));
      return next;
    });
  }, []);

  const toggleAmbient = useCallback(() => {
    audio.resume();
    setAmbientOn((a) => !a);
  }, []);

  const changeVolume = useCallback((v: number) => {
    setVol(v);
    persistence.setItem('kaze_audio_vol', String(v));
  }, []);

  const play = useCallback((type: SfxType) => {
    audio.playSfx(type);
  }, []);

  // Resume context on first user gesture (required by autoplay policies)
  useEffect(() => {
    const resume = () => {
      audio.resume();
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
    };
    window.addEventListener('pointerdown', resume);
    window.addEventListener('keydown', resume);
    return () => {
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
    };
  }, []);

  // Global, delegated UI sound effects
  useEffect(() => {
    if (!ready) return;
    let lastHover: Element | null = null;
    let lastHoverT = 0;

    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(SEL);
      if (!el) return;
      if (el === lastHover) return;
      lastHover = el;
      if (reduced) return;
      const now = performance.now();
      if (now - lastHoverT < 70) return;
      lastHoverT = now;
      audio.playSfx('hover');
    };
    const onOut = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(SEL);
      if (el === lastHover) lastHover = null;
    };
    const onDown = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(SEL);
      if (!el) return;
      audio.playSfx('click');
    };

    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [ready, reduced]);

  return (
    <Ctx.Provider
      value={{ muted, volume, ambientOn, ready, toggleMute, toggleAmbient, setVolume: changeVolume, play }}
    >
      {children}
    </Ctx.Provider>
  );
}
