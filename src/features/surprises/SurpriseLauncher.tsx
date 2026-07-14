
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSurprises } from './SurpriseProvider';
import './SurpriseLauncher.css';

const ITEMS = [
  { key: 'terminal', icon: '⌨️', label: 'Terminal', action: 'toggleTerminal' as const },
  { key: 'ach', icon: '🏅', label: 'Awards', action: 'toggleAchPanel' as const },
  { key: 'themes', icon: '🎨', label: 'Themes', action: 'toggleThemePanel' as const },
  { key: 'game', icon: '🌸', label: 'Mini Game', action: 'toggleMiniGame' as const },
  { key: 'secret', icon: '🚪', label: 'Sanctuary', action: 'toggleSecretRoom' as const },
  { key: 'day', icon: '☀️', label: 'Day Mode', action: 'toggleDay' as const },
  { key: 'dev', icon: '🛠️', label: 'Dev Mode', action: 'setDevMode' as const },
];

export function SurpriseLauncher() {
  const s = useSurprises();

  return (
    <div className="launcher">
      <AnimatePresence>
        {s.menuOpen && (
          <motion.div
            className="launcher__menu"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            {ITEMS.map((it, i) => {
              const angle = (Math.PI * 2 * i) / ITEMS.length - Math.PI / 2;
              const x = Math.cos(angle) * 116;
              const y = Math.sin(angle) * 116;
              return (
                <motion.button
                  key={it.key}
                  className="launcher__item"
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{ x, y, opacity: 1 }}
                  exit={{ x: 0, y: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22, delay: i * 0.03 }}
                  onClick={() => {
                    if (it.action === 'setDevMode') s.setDevMode(!s.devMode);
                    else if (it.action === 'toggleDay') s.toggleDay();
                    else if (it.action === 'toggleTerminal') s.toggleTerminal();
                    else if (it.action === 'toggleAchPanel') s.toggleAchPanel();
                    else if (it.action === 'toggleThemePanel') s.toggleThemePanel();
                    else if (it.action === 'toggleMiniGame') s.toggleMiniGame();
                    else if (it.action === 'toggleSecretRoom') s.toggleSecretRoom();
                    s.toggleMenu(false);
                  }}
                  aria-label={it.label}
                  data-cursor="hover"
                >
                  <span className="launcher__item-icon">{it.icon}</span>
                  <span className="launcher__item-label">{it.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        className={`launcher__btn ${s.menuOpen ? 'is-open' : ''}`}
        onClick={() => s.toggleMenu()}
        aria-label="Secret menu"
        aria-expanded={s.menuOpen}
        data-cursor="hover"
      >
        <span className="launcher__petal" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path
              d="M12 2C9 6 6 7 4 11c3-1 5 0 8 1-3 4-3 7-2 11 3-4 6-3 8 0 0-4 1-7 4-9-3-1-5 0-8-1 3-4 1-7-2-11z"
              fill="currentColor"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
