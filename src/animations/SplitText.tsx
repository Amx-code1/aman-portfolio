
import React from 'react';
import './SplitText.css';

interface SplitTextProps {
  text: string;
  className?: string;
  active?: boolean;
  baseDelay?: number;
  stagger?: number;
  as?: keyof JSX.IntrinsicElements;
}

export const SplitText = React.memo(function SplitText({
  text,
  className,
  active = true,
  baseDelay = 0,
  stagger = 0.04,
  as = 'span',
}: SplitTextProps) {
  const Tag = as as any;
  const words = text.split(' ');
  let charIndex = 0;

  return (
    <Tag className={`split-text ${active ? 'is-active' : ''} ${className ?? ''}`} aria-label={text}>
      {words.map((word, wi) => (
        <span className="split-word" key={wi} aria-hidden="true">
          {word.split('').map((ch, ci) => {
            const delay = baseDelay + charIndex * stagger;
            charIndex += 1;
            return (
              <span
                className="split-char"
                key={ci}
                style={{ transitionDelay: `${delay}s` }}
              >
                {ch}
              </span>
            );
          })}
          {wi < words.length - 1 && <span className="split-space"> </span>}
        </span>
      ))}
    </Tag>
  );
});
