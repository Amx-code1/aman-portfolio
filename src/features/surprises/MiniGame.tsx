
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSurprises } from './SurpriseProvider';
import './MiniGame.css';

interface Petal {
  id: number;
  x: number;
  delay: number;
  dur: number;
  size: number;
  rot: number;
}

const TOTAL = 30;

export function MiniGame() {
  const s = useSurprises();
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(TOTAL);
  const [petals, setPetals] = useState<Petal[]>([]);
  const [best, setBest] = useState(0);
  const idRef = useRef(0);
  const timerRef = useRef(0);
  const spawnRef = useRef(0);

  const spawn = useCallback(() => {
    idRef.current += 1;
    const p: Petal = {
      id: idRef.current,
      x: 6 + Math.random() * 88,
      delay: 0,
      dur: 2.4 + Math.random() * 1.6,
      size: 26 + Math.random() * 16,
      rot: Math.random() * 360,
    };
    setPetals((prev) => [...prev, p]);
    window.setTimeout(() => {
      setPetals((prev) => prev.filter((x) => x.id !== p.id));
    }, p.dur * 1000 + 200);
  }, []);

  const start = () => {
    setScore(0);
    setTime(TOTAL);
    setPetals([]);
    setRunning(true);
    let t = TOTAL;
    timerRef.current = window.setInterval(() => {
      t -= 1;
      setTime(t);
      if (t <= 0) {
        window.clearInterval(timerRef.current);
        window.clearInterval(spawnRef.current);
        setRunning(false);
        setPetals([]);
        setBest((b) => Math.max(b, score));
        if (score >= 30 && !s.achievements['sakura-master']) s.unlock('sakura-master');
      }
    }, 1000);
    spawnRef.current = window.setInterval(spawn, 520);
  };

  const catchPetal = (id: number) => {
    setPetals((prev) => prev.filter((x) => x.id !== id));
    setScore((v) => v + 1);
  };

  useEffect(() => {
    return () => {
      window.clearInterval(timerRef.current);
      window.clearInterval(spawnRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {s.miniGameOpen && (
        <motion.div
          className="mg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => s.toggleMiniGame(false)}
        >
          <motion.div
            className="mg__inner"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Sakura Catch mini game"
          >
            <button className="mg__close" onClick={() => s.toggleMiniGame(false)} aria-label="Close game">
              ✕
            </button>
            <div className="mg__hud">
              <span className="mg__stat">🌸 {score}</span>
              <span className="mg__stat">⏱ {time}s</span>
              <span className="mg__stat">🏆 {best}</span>
            </div>

            <div className="mg__stage">
              <AnimatePresence>
                {petals.map((p) => (
                  <motion.button
                    key={p.id}
                    className="mg__petal"
                    style={{ left: `${p.x}%`, width: p.size, height: p.size }}
                    initial={{ y: -60, opacity: 0, rotate: p.rot }}
                    animate={{ y: 'calc(100% + 60px)', opacity: 1, rotate: p.rot + 220 }}
                    exit={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: p.dur, ease: 'linear' }}
                    onClick={() => catchPetal(p.id)}
                    aria-label="Catch petal"
                  >
                    <svg viewBox="0 0 24 24" width="100%" height="100%">
                      <path
                        d="M12 2C9 6 6 7 4 11c3-1 5 0 8 1-3 4-3 7-2 11 3-4 6-3 8 0 0-4 1-7 4-9-3-1-5 0-8-1 3-4 1-7-2-11z"
                        fill="#ff7eb0"
                      />
                    </svg>
                  </motion.button>
                ))}
              </AnimatePresence>

              {!running && (
                <div className="mg__overlay">
                  <h3 className="mg__title">Sakura Catch</h3>
                  <p className="mg__desc">Catch 30 petals in 30 seconds to earn the Sakura Master award.</p>
                  <button className="mg__play" onClick={start} data-cursor="hover">
                    {score > 0 ? 'Play Again' : 'Start'}
                  </button>
                  {best > 0 && <p className="mg__best">Best: {best}</p>}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
