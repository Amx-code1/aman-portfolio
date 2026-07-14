
import React from 'react';
import { CharacterSilhouette } from '../CharacterSilhouette/CharacterSilhouette';
import { Reveal } from '../../animations/Reveal';
import { Dust } from '../effects/Dust';
import './EndingCinematic.css';

export function EndingCinematic({ onReplay }: { onReplay: () => void }) {
  const year = new Date().getFullYear();

  return (
    <section className="ending section" id="ending">
      <div className="ending__bg" aria-hidden="true">
        <Dust count={50} />
        <CharacterSilhouette className="ending__char" />
      </div>
      <div className="container ending__inner">
        <p className="ending__kicker">— Fin —</p>
        <Reveal as="h2" className="ending__title">
          The Wind Carries On
        </Reveal>
        <Reveal as="p" className="ending__sub" delay={0.1}>
          Every ending is just the next frame waiting to be drawn.
        </Reveal>
        <Reveal className="ending__actions" delay={0.2}>
          <button className="ending__replay" onClick={onReplay} data-cursor="hover">
            ↺ Replay Opening
          </button>
        </Reveal>
        <div className="ending__credits">
          <span>KAZE Studio</span>
          <span>Tokyo · Kyoto · Remote</span>
          <span>© {year}</span>
        </div>
      </div>
    </section>
  );
}
