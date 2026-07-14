
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSurprises } from './SurpriseProvider';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import './Terminal.css';

interface Line {
  id: number;
  text: string;
  kind?: 'in' | 'out' | 'err' | 'sys';
}

let lineId = 0;

export function Terminal() {
  const s = useSurprises();
  const [lines, setLines] = useState<Line[]>([
    { id: lineId++, text: 'KAZE TERMINAL v1.0 — type "help" to begin.', kind: 'sys' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<HTMLDivElement>(null);

  useFocusTrap(termRef, s.terminalOpen);

  useEffect(() => {
    if (s.terminalOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [s.terminalOpen]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const print = (outs: string[]) => {
    if (outs.length === 1 && outs[0] === '__CLEAR__') {
      setLines([]);
      return;
    }
    setLines((prev) => [...prev, ...outs.map((t) => ({ id: lineId++, text: t, kind: 'out' as const }))]);
  };

  const submit = () => {
    const val = input;
    if (!val.trim()) return;
    setLines((prev) => [...prev, { id: lineId++, text: `> ${val}`, kind: 'in' }]);
    setHistory((h) => [val, ...h].slice(0, 40));
    setHIdx(-1);
    const out = s.runCommand(val);
    print(out);
    setInput('');
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submit();
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHIdx((i) => {
        const ni = Math.min(history.length - 1, i + 1);
        if (history[ni] !== undefined) setInput(history[ni]);
        return ni;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHIdx((i) => {
        const ni = Math.max(-1, i - 1);
        setInput(ni === -1 ? '' : history[ni] ?? '');
        return ni;
      });
    }
  };

  return (
    <AnimatePresence>
      {s.terminalOpen && (
        <motion.div
          className="term"
          ref={termRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          role="dialog"
          aria-modal="true"
          aria-label="KAZE terminal"
        >
          <div className="term__bar">
            <span className="term__dot term__dot--r" />
            <span className="term__dot term__dot--y" />
            <span className="term__dot term__dot--g" />
            <span className="term__title">kaze@studio: ~</span>
            <button className="term__close" onClick={() => s.toggleTerminal(false)} aria-label="Close terminal">
              ✕
            </button>
          </div>
          <div className="term__screen" ref={scrollRef} onClick={() => inputRef.current?.focus()}>
            {lines.map((l) => (
              <div key={l.id} className={`term__line term__line--${l.kind ?? 'out'}`}>
                {l.text}
              </div>
            ))}
            <div className="term__input-row">
              <span className="term__prompt">$</span>
              <input
                ref={inputRef}
                className="term__input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal input"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
