
import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../lib/utils';

interface TypewriterOptions {
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
}

export function useTypewriter(words: string[], options: TypewriterOptions = {}) {
  const { typeSpeed = 75, deleteSpeed = 38, pause = 1700 } = options;
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setText(words[0] ?? '');
      return;
    }

    let timer: number;
    const current = words[wordIndex % words.length] ?? '';

    if (!deleting && text === current) {
      timer = window.setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === '') {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    } else {
      timer = window.setTimeout(() => {
        setText((prev) =>
          deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1)
        );
      }, deleting ? deleteSpeed : typeSpeed);
    }

    return () => window.clearTimeout(timer);
  }, [text, deleting, wordIndex, words, typeSpeed, deleteSpeed, pause]);

  return text;
}
