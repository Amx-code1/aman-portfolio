
import React from 'react';
import { Reveal } from '../../animations/Reveal';
import { Parallax } from '../../animations/Parallax';
import { storyChapters } from '../../content/story';
import './Story.css';

export function Story() {
  return (
    <section className="story section" id="story">
      <div className="container">
        <p className="story__kicker eyebrow">Prologue</p>
        <h2 className="story__heading">A World Between Frames</h2>
      </div>

      <div className="story__chapters">
        {storyChapters.map((c) => (
          <article className={`story__chapter story__chapter--${c.align}`} key={c.id}>
            <Parallax speed={0.05} className="story__chapter-bg">
              <span className="story__chapter-index">{c.chapter}</span>
            </Parallax>
            <div className="container story__chapter-inner">
              <Reveal as="h3" className="story__chapter-title">
                {c.title}
              </Reveal>
              <Reveal as="p" className="story__chapter-body" delay={0.1}>
                {c.body}
              </Reveal>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
