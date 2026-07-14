
import React, { useState } from 'react';
import { motion as m } from 'framer-motion';
import './CardExpand.css';

export interface ExpandItem {
  title: string;
  body: string;
  tone?: string;
}

/**
 * Framer Motion spring-driven accordion. Each card expands its body with a
 * height + opacity spring on click and lifts on hover.
 */
export function CardExpand({ items }: { items: ExpandItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="expand-list">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <m.div
            key={it.title}
            className={`expand ${isOpen ? 'is-open' : ''}`}
            layout
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            whileHover={{ x: 6 }}
            onClick={() => setOpen(isOpen ? null : i)}
            data-cursor="hover"
          >
            <m.div className="expand__bar" layout="position">
              <span className="expand__dot" style={{ background: it.tone ?? 'var(--c-cyan)' }} />
              <span className="expand__title">{it.title}</span>
              <m.span className="expand__icon" animate={{ rotate: isOpen ? 45 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                +
              </m.span>
            </m.div>
            <m.div
              className="expand__body"
              initial={false}
              animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              style={{ overflow: 'hidden' }}
            >
              <p className="expand__text">{it.body}</p>
            </m.div>
          </m.div>
        );
      })}
    </div>
  );
}
