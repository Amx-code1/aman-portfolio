
import React from 'react';
import { Reveal } from '../../animations/Reveal';
import { WorkPoster } from '../WorkPoster/WorkPoster';
import { GradientBorder } from '../ui/GradientBorder';
import { Tag } from '../ui/Tag';
import { useGlow } from '../../hooks/useGlow';
import type { Work } from '../../types';
import './WorkCard.css';

function WorkCardBase({
  work,
  index,
  onOpen,
}: {
  work: Work;
  index: number;
  onOpen: (id: string) => void;
}) {
  const ref = useGlow<HTMLAnchorElement>();
  return (
    <Reveal className="work-card-wrap" delay={(index % 2) * 0.12} y={60}>
      <a
        ref={ref}
        className="work-card"
        href={`#work-${work.id}`}
        onClick={(e) => {
          e.preventDefault();
          onOpen(work.id);
        }}
        data-cursor="view"
        aria-label={`${work.title} — ${work.category}, ${work.year}. Open case study.`}
      >
        <span className="work-card__glare" aria-hidden="true" />
        <GradientBorder radius={22} className="work-card__frame">
          <div className="work-card__media">
            <WorkPoster theme={work.theme} index={index} />
            <div className="work-card__overlay">
              <span className="work-card__view">View Case Study</span>
              <span className="work-card__plus" aria-hidden="true">↗</span>
            </div>
          </div>
        </GradientBorder>
        <div className="work-card__meta">
          <div className="work-card__row">
            <h3 className="work-card__title">{work.title}</h3>
            <Tag tone="cyan">{work.year}</Tag>
          </div>
          <div className="work-card__info">
            <Tag tone="purple">{work.category}</Tag>
            <span>{work.role}</span>
          </div>
          <p className="work-card__desc">{work.description}</p>
          <span className="work-card__cta">Explore project →</span>
        </div>
      </a>
    </Reveal>
  );
}

export const WorkCard = React.memo(WorkCardBase);
