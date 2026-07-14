
import React from 'react';
import { CharacterSilhouette } from '../CharacterSilhouette/CharacterSilhouette';
import { SplitText } from '../../animations/SplitText';
import { CyberButton } from '../ui/CyberButton';
import './NotFound.css';

export function NotFound({ onHome }: { onHome: () => void }) {
  return (
    <section className="nf" id="notfound">
      <div className="nf__bg" aria-hidden="true">
        <CharacterSilhouette className="nf__char" />
      </div>
      <div className="container nf__inner">
        <span className="nf__code">404</span>
        <SplitText
          as="h1"
          text="LOST IN THE WIND"
          className="nf__title"
          stagger={0.05}
          baseDelay={0.1}
        />
        <p className="nf__msg">
          This page drifted beyond the frame. The story you’re looking for may have moved or never
          existed.
        </p>
        <div className="nf__actions">
          <CyberButton variant="primary" onClick={onHome}>
            ← Back to Studio
          </CyberButton>
        </div>
      </div>
    </section>
  );
}
