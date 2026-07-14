
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSurprises } from './SurpriseProvider';
import { THEMES } from './data';
import './PanelShared.css';
import './ThemePanel.css';

export function ThemePanel() {
  const s = useSurprises();

  return (
    <AnimatePresence>
      {s.themePanelOpen && (
        <motion.div
          className="panel-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => s.toggleThemePanel(false)}
        >
          <motion.div
            className="panel"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Theme palette"
          >
            <div className="panel__head">
              <div>
                <h3 className="panel__title">Palettes</h3>
                <span className="panel__sub">Chromatic surprises</span>
              </div>
              <button className="panel__close" onClick={() => s.toggleThemePanel(false)} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="theme-grid">
              {THEMES.map((t) => {
                const unlocked = t.id === 'cyber' || s.unlockedThemes.includes(t.id);
                const active = s.themeId === t.id;
                return (
                  <button
                    key={t.id}
                    className={`theme-card ${active ? 'is-active' : ''} ${unlocked ? '' : 'is-locked'}`}
                    disabled={!unlocked}
                    onClick={() => unlocked && s.setTheme(t.id)}
                    aria-pressed={active}
                    data-cursor="hover"
                  >
                    <span className="theme-card__swatch" style={{ background: t.swatch }} />
                    <span className="theme-card__name">{t.name}</span>
                    <span className="theme-card__state">
                      {active ? 'Active' : unlocked ? 'Apply' : '🔒 Locked'}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="theme-hint">
              Tip: the legendary <b>↑↑↓↓←→←→ B A</b> unlocks every secret palette at once.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
