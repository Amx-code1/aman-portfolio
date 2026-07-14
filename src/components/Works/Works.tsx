
import React from 'react';
import { SectionHeading } from '../SectionHeading/SectionHeading';
import { WorkCard } from '../WorkCard/WorkCard';
import { SwipeDeck } from './SwipeDeck';
import { works } from '../../content/works';
import { useDeviceProfile } from '../../hooks/useDeviceProfile';
import './Works.css';

export function Works({ onOpen }: { onOpen: (id: string) => void }) {
  const { isMobile } = useDeviceProfile();
  return (
    <section className="works section" id="works">
      <div className="container">
        <SectionHeading
          index="03"
          title="Selected Works"
          subtitle="A catalogue of worlds we've animated into being. Open any title for the full case study."
        />
        {isMobile ? (
          <SwipeDeck onOpen={onOpen} />
        ) : (
          <div className="works__grid">
            {works.map((work, i) => (
              <WorkCard key={work.id} work={work} index={i} onOpen={onOpen} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
