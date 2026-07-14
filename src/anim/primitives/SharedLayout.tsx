
import React, { useState } from 'react';
import { motion as m, AnimatePresence, LayoutGroup } from 'framer-motion';
import { works } from '../../content/works';
import './SharedLayout.css';

/**
 * Framer Motion Shared Layout. Cards share a layoutId with the expanded
 * overlay so the element physically morphs between states with spring physics.
 */
export function SharedLayout() {
  const [active, setActive] = useState<string | null>(null);
  const item = works.find((w) => w.id === active);

  return (
    <LayoutGroup>
      <div className="shared">
        <div className="shared__grid">
          {works.slice(0, 4).map((w) => (
            <m.button
              key={w.id}
              layoutId={`card-${w.id}`}
              className="shared__card"
              onClick={() => setActive(w.id)}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              data-cursor="hover"
            >
              <m.div
                layoutId={`media-${w.id}`}
                className="shared__media"
                style={{ background: `radial-gradient(circle at 40% 30%, ${w.theme}, #0c0c14)` }}
              />
              <div className="shared__meta">
                <m.h3 layoutId={`title-${w.id}`} className="shared__title">
                  {w.title}
                </m.h3>
                <span className="shared__role">{w.role}</span>
              </div>
            </m.button>
          ))}
        </div>

        <AnimatePresence>
          {item && (
            <m.div
              className="shared__overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
            >
              <m.div
                layoutId={`card-${item.id}`}
                className="shared__expanded"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              >
                <m.div
                  layoutId={`media-${item.id}`}
                  className="shared__media shared__media--big"
                  style={{ background: `radial-gradient(circle at 40% 30%, ${item.theme}, #0c0c14)` }}
                />
                <m.h3 layoutId={`title-${item.id}`} className="shared__title shared__title--big">
                  {item.title}
                </m.h3>
                <p className="shared__desc">{item.description}</p>
                <span className="shared__tag">{item.category} · {item.year}</span>
                <button className="shared__close" onClick={() => setActive(null)} data-cursor="hover">
                  Close ✕
                </button>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
