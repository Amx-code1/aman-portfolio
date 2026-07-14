
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSurprises } from './SurpriseProvider';
import { CharacterSilhouette } from '../../components/CharacterSilhouette/CharacterSilhouette';
import './KonamiFlash.css';

export function KonamiFlash() {
  const s = useSurprises();

  useEffect(() => {
    if (!s.konamiFlash) return;
    const t = window.setTimeout(() => s.clearKonamiFlash(), 2600);
    return () => window.clearTimeout(t);
  }, [s.konamiFlash, s.clearKonamiFlash]);

  return (
    <AnimatePresence>
      {s.konamiFlash && (
        <motion.div
          className="kf"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="kf__slash kf__slash--1" />
          <div className="kf__slash kf__slash--2" />
          <div className="kf__slash kf__slash--3" />
          <motion.div
            className="kf__char"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 16 }}
          >
            <CharacterSilhouette />
          </motion.div>
          <motion.div
            className="kf__text"
            initial={{ scale: 0.4, opacity: 0, letterSpacing: '0.6em' }}
            animate={{ scale: 1, opacity: 1, letterSpacing: '0.16em' }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            KAZE MODE
          </motion.div>
          <div className="kf__sub">全ての力を解放 — all powers unlocked</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
