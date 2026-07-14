
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSurprises } from './SurpriseProvider';
import { ACHIEVEMENTS } from './data';
import './PanelShared.css';
import './AchievementsPanel.css';

export function AchievementsPanel() {
  const s = useSurprises();
  const total = ACHIEVEMENTS.length;
  const got = ACHIEVEMENTS.filter((a) => s.achievements[a.id]).length;

  return (
    <AnimatePresence>
      {s.achPanelOpen && (
        <motion.div
          className="panel-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => s.toggleAchPanel(false)}
        >
          <motion.div
            className="panel"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Achievements"
          >
            <div className="panel__head">
              <div>
                <h3 className="panel__title">Achievements</h3>
                <span className="panel__sub">{got} / {total} unlocked</span>
              </div>
              <button className="panel__close" onClick={() => s.toggleAchPanel(false)} aria-label="Close">
                ✕
              </button>
            </div>
            <div className="panel__progress">
              <span style={{ width: `${(got / total) * 100}%` }} />
            </div>
            <ul className="ach-list">
              {ACHIEVEMENTS.map((a) => {
                const unlocked = !!s.achievements[a.id];
                return (
                  <li key={a.id} className={`ach-row ${unlocked ? 'is-on' : ''}`}>
                    <span className="ach-row__icon">{unlocked ? a.icon : '🔒'}</span>
                    <span className="ach-row__body">
                      <span className="ach-row__title">
                        {unlocked ? a.title : a.secret ? '??? Secret' : a.title}
                      </span>
                      <span className="ach-row__desc">
                        {unlocked ? a.desc : a.secret ? 'Keep exploring to reveal this.' : a.desc}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
