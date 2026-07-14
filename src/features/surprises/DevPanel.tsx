
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSurprises } from './SurpriseProvider';
import { persistence } from '../../lib/persistence';
import './DevPanel.css';

export function DevPanel() {
  const s = useSurprises();
  const [fps, setFps] = useState(60);
  const [grid, setGrid] = useState(false);
  const raf = useRef(0);
  const frames = useRef(0);
  const last = useRef(performance.now());

  useEffect(() => {
    if (!s.devMode) return;
    const loop = () => {
      frames.current++;
      const now = performance.now();
      if (now - last.current >= 1000) {
        setFps(frames.current);
        frames.current = 0;
        last.current = now;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [s.devMode]);

  useEffect(() => {
    document.body.classList.toggle('show-grid', grid && s.devMode);
  }, [grid, s.devMode]);

  if (!s.devMode) return null;

  const reset = async () => {
    await Promise.all([
      persistence.removeItem('kaze_achievements'),
      persistence.removeItem('kaze_theme'),
      persistence.removeItem('kaze_unlocked_themes'),
      persistence.removeItem('kaze_collected'),
      persistence.removeItem('kaze_day'),
    ]);
    window.location.reload();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="dev"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
      >
        <div className="dev__head">🛠 DEV MODE</div>
        <div className="dev__row"><span>FPS</span><b className={fps < 50 ? 'is-warn' : ''}>{fps}</b></div>
        <div className="dev__row"><span>Theme</span><b>{s.themeId}</b></div>
        <div className="dev__row"><span>Day</span><b>{s.dayMode ? 'on' : 'off'}</b></div>
        <div className="dev__row"><span>Awards</span><b>{Object.values(s.achievements).filter(Boolean).length}</b></div>
        <div className="dev__row"><span>Petals</span><b>{s.collected.length}/6</b></div>
        <div className="dev__row dev__row--btns">
          <button onClick={() => setGrid((g) => !g)} className={grid ? 'is-on' : ''}>Grid</button>
          <button onClick={() => s.toggleDay()}>Day</button>
        </div>
        <div className="dev__row dev__row--btns">
          <button onClick={() => s.toggleTerminal()}>Term</button>
          <button onClick={() => s.toggleSecretRoom()}>Room</button>
        </div>
        <button className="dev__reset" onClick={reset}>Wipe progress</button>
        <div className="dev__note">Reduced motion: {typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'yes' : 'no'}</div>
      </motion.div>
    </AnimatePresence>
  );
}
