
import React from 'react';
import { useInView } from '../../hooks/useInView';
import { SplitText } from '../../animations/SplitText';
import { Reveal } from '../../animations/Reveal';
import './SectionHeading.css';

export const SectionHeading = React.memo(function SectionHeading({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div className="section-heading" ref={ref}>
      <span className="section-heading__index">({index})</span>
      <SplitText
        as="h2"
        text={title}
        className="section-heading__title"
        active={inView}
        baseDelay={0.05}
        stagger={0.04}
      />
      <Reveal as="p" className="section-heading__subtitle" delay={0.1}>
        {subtitle}
      </Reveal>
    </div>
  );
});
