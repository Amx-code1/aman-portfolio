
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSurprises } from './SurpriseProvider';
import './AchievementToasts.css';

export function AchievementToasts() {
  const s = useSurprises();
  return (
    <div className="toasts" aria-live="polite">
      <AnimatePresence>
        {s.toasts.map((t) => (
          <motion.div
            key={t.id}
            className="toast"
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={() => s.dismissToast(t.id)}
            role="status"
          >
            <span className="toast__icon">{t.icon}</span>
            <span className="toast__body">
              <span className="toast__eyebrow">Achievement Unlocked</span>
              <span className="toast__title">{t.title}</span>
              <span className="toast__desc">{t.desc}</span>
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
