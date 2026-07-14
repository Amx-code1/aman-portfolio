
import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { works } from '../../content/works';
import { WorkPoster } from '../WorkPoster/WorkPoster';
import { Tag } from '../ui/Tag';
import { TouchRipple } from '../TouchRipple/TouchRipple';
import './SwipeDeck.css';

/**
 * Mobile-first swipe deck for browsing works. Drag horizontally or use the
 * arrow controls; tap the card to open the full case study.
 */
export function SwipeDeck({ onOpen }: { onOpen: (id: string) => void }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const reduced = useReducedMotion();

  const paginate = (d: number) =>
    setState(([i]) => [(i + d + works.length) % works.length, d]);

  const work = works[index];

  return (
    <div className="deck">
      <div className="deck__head">
        <span className="deck__counter">
          {String(index + 1).padStart(2, '0')} <i>/</i> {String(works.length).padStart(2, '0')}
        </span>
        <span className="deck__hint">Swipe or use arrows</span>
      </div>

      <div className="deck__stage">
        <AnimatePresence custom={dir}>
          <motion.div
            key={work.id}
            className="deck__card"
            custom={dir}
            initial={reduced ? { opacity: 0 } : { x: dir > 0 ? 280 : -280, opacity: 0, scale: 0.82, rotate: dir > 0 ? 6 : -6 }}
            animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
            exit={reduced ? { opacity: 0 } : { x: dir > 0 ? -280 : 280, opacity: 0, scale: 0.82, rotate: dir > 0 ? -6 : 6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (info.offset.x < -110) paginate(1);
              else if (info.offset.x > 110) paginate(-1);
            }}
          >
            <button className="deck__open" onClick={() => onOpen(work.id)} aria-label={`Open ${work.title}`}>
              <div className="deck__media">
                <WorkPoster theme={work.theme} index={index} />
                <span className="deck__media-glow" />
              </div>
              <div className="deck__meta">
                <div className="deck__tags">
                  <Tag tone="cyan">{work.year}</Tag>
                  <Tag tone="purple">{work.category}</Tag>
                </div>
                <h3 className="deck__title">{work.title}</h3>
                <p className="deck__desc">{work.description}</p>
                <span className="deck__cta">Explore project →</span>
              </div>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="deck__controls">
        <TouchRipple className="deck__nav" onClick={() => paginate(-1)} ariaLabel="Previous work">
          ←
        </TouchRipple>
        <TouchRipple className="deck__nav deck__nav--open" onClick={() => onOpen(work.id)} ariaLabel={`Open ${work.title}`}>
          View Case
        </TouchRipple>
        <TouchRipple className="deck__nav" onClick={() => paginate(1)} ariaLabel="Next work">
          →
        </TouchRipple>
      </div>

      <div className="deck__dots" aria-hidden="true">
        {works.map((w, i) => (
          <span key={w.id} className={`deck__dot ${i === index ? 'is-active' : ''}`} />
        ))}
      </div>
    </div>
  );
}
