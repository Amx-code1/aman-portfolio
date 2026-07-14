
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSurprises } from './SurpriseProvider';
import { COLLECTIBLES } from './data';
import './Collectibles.css';

function Petal({ onCollect, label }: { onCollect: () => void; label: string }) {
  const pos = useMemo(() => {
    const x = 8 + Math.random() * 84;
    const y = 12 + Math.random() * 74;
    const dur = 6 + Math.random() * 5;
    const delay = Math.random() * 4;
    const drift = (Math.random() - 0.5) * 40;
    return { x, y, dur, delay, drift };
  }, []);

  return (
    <motion.button
      className="collectible"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      onClick={onCollect}
      aria-label={`Collect ${label}`}
      data-cursor="hover"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 0.92,
        y: [0, pos.drift, 0],
        x: [0, -pos.drift, 0],
        rotate: [0, 18, -12, 0],
      }}
      transition={{
        scale: { duration: 0.5 },
        opacity: { duration: 0.5 },
        y: { duration: pos.dur, repeat: Infinity, ease: 'easeInOut', delay: pos.delay },
        x: { duration: pos.dur * 1.3, repeat: Infinity, ease: 'easeInOut', delay: pos.delay },
        rotate: { duration: pos.dur, repeat: Infinity, ease: 'easeInOut', delay: pos.delay },
      }}
      whileHover={{ scale: 1.35 }}
    >
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
        <path
          d="M12 2C9 6 6 7 4 11c3-1 5 0 8 1-3 4-3 7-2 11 3-4 6-3 8 0 0-4 1-7 4-9-3-1-5 0-8-1 3-4 1-7-2-11z"
          fill="url(#collgrad)"
        />
        <defs>
          <linearGradient id="collgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffd1e8" />
            <stop offset="100%" stopColor="#ff5c8a" />
          </linearGradient>
        </defs>
      </svg>
    </motion.button>
  );
}

export function Collectibles() {
  const s = useSurprises();
  const remaining = COLLECTIBLES.filter((c) => !s.collected.includes(c.id));

  return (
    <div className="collectibles" aria-hidden={remaining.length === 0}>
      <AnimatePresence>
        {remaining.map((c) => (
          <Petal key={c.id} label={c.label} onCollect={() => s.collect(c.id)} />
        ))}
      </AnimatePresence>
      {remaining.length > 0 && (
        <div className="collectibles__hint" aria-hidden="true">
          🌸 {remaining.length} hidden petals drift nearby
        </div>
      )}
    </div>
  );
}
