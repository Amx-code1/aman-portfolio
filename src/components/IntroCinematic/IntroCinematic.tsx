
import React, { useState } from 'react';
import { Dust } from '../effects/Dust';
import { CharacterSilhouette } from '../CharacterSilhouette/CharacterSilhouette';
import { SplitText } from '../../animations/SplitText';
import './IntroCinematic.css';

export function IntroCinematic({ onEnter }: { onEnter: () => void }) {
  const [entering, setEntering] = useState(false);

  const enter = () => {
    if (entering) return;
    setEntering(true);
    window.setTimeout(onEnter, 1500);
  };

  return (
    <div className={`intro ${entering ? 'is-entering' : ''}`} aria-hidden={entering}>
      <div className="intro__scene">
        <div className="intro__glow" aria-hidden="true" />
        <Dust count={80} />
        <CharacterSilhouette className="intro__char" />
        <div className="intro__logo">
          <span className="intro__jp">風</span>
          <SplitText text="KAZE" className="intro__title" baseDelay={0.1} stagger={0.08} as="span" />
          <span className="intro__tagline">Anime · Motion · Worlds</span>
        </div>
      </div>

      <div className="intro__prompt">
        <button className="intro__enter" onClick={enter} data-cursor="hover">
          <span className="intro__enter-ring" aria-hidden="true" />
          Enter The World
        </button>
        <p className="intro__hint">Best experienced with sound — headphones recommended</p>
      </div>

      <div className="intro__bars" aria-hidden="true">
        <span className="intro__bar intro__bar--top" />
        <span className="intro__bar intro__bar--bottom" />
      </div>
    </div>
  );
}
