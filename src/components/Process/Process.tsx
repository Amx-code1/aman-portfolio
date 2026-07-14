
import React from 'react';
import { SectionHeading } from '../SectionHeading/SectionHeading';
import { Reveal } from '../../animations/Reveal';
import { processSteps } from '../../content/process';
import './Process.css';

export function Process() {
  return (
    <section className="process section" id="process">
      <div className="container">
        <SectionHeading index="04" title="How We Work" subtitle="From spark to screen." />
        <ol className="process__list">
          {processSteps.map((step, i) => (
            <Reveal as="li" className="process__item" key={step.index} delay={i * 0.06} y={30}>
              <span className="process__num">{step.index}</span>
              <div className="process__body">
                <h3 className="process__title">{step.title}</h3>
                <p className="process__desc">{step.description}</p>
              </div>
              <span className="process__arrow" aria-hidden="true">
                →
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
