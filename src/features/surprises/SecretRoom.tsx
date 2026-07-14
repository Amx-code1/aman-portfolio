
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSurprises } from './SurpriseProvider';
import { CharacterSilhouette } from '../../components/CharacterSilhouette/CharacterSilhouette';
import './PanelShared.css';
import './SecretRoom.css';

const REFERENCES = [
  { t: '風 (Kaze)', d: 'Our namesake — the wind that carries every frame forward.' },
  { t: 'Ghibli Homage', d: 'The drifting petals nod to spirited skies and wandering castles.' },
  { t: 'Neon Genesis', d: 'The scrolling timeline echoes a famous elevator descent.' },
  { t: 'Cardcaptor', d: 'Sakura Catch is a love-letter to magical girl transformation.' },
  { t: 'JoJo', d: 'The anime slash transition pays respect to dramatically posed cuts.' },
  { t: 'Akira', d: 'The cyberpunk city engine bows to a certain 1988 motorcycle ride.' },
];

export function SecretRoom() {
  const s = useSurprises();

  return (
    <AnimatePresence>
      {s.secretRoomOpen && (
        <motion.div
          className="secret"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => s.toggleSecretRoom(false)}
        >
          <motion.div
            className="secret__inner"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Hidden sanctuary"
          >
            <div className="secret__glow" aria-hidden="true" />
            <CharacterSilhouette className="secret__char" />
            <span className="secret__jp">聖域</span>
            <h2 className="secret__title">The Hidden Sanctuary</h2>
            <p className="secret__lead">
              You found what lies between the frames. Few wanderers ever do. Here, the wind speaks plainly.
            </p>

            <div className="secret__refs">
              {REFERENCES.map((r, i) => (
                <motion.div
                  key={r.t}
                  className="secret__ref"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                >
                  <span className="secret__ref-t">{r.t}</span>
                  <span className="secret__ref-d">{r.d}</span>
                </motion.div>
              ))}
            </div>

            <div className="secret__actions">
              <button className="secret__btn" onClick={() => { s.toggleSecretRoom(false); s.toggleMiniGame(true); }} data-cursor="hover">
                🌸 Play Sakura Catch
              </button>
              <button className="secret__btn secret__btn--ghost" onClick={() => { s.toggleSecretRoom(false); s.toggleTerminal(true); }} data-cursor="hover">
                ⌨️ Open Terminal
              </button>
            </div>
            <button className="secret__close" onClick={() => s.toggleSecretRoom(false)} aria-label="Leave sanctuary">
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
