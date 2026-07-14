
import React from 'react';
import './HeroSky.css';

export function HeroSky() {
  return (
    <div className="herosky" aria-hidden="true">
      <div className="herosky__sky" />
      <div className="herosky__sky2" />
      <div className="herosky__aurora" />

      <div className="herosky__moon">
        <span className="herosky__moon-glow" />
        <span className="herosky__crater herosky__crater--1" />
        <span className="herosky__crater herosky__crater--2" />
        <span className="herosky__crater herosky__crater--3" />
        <span className="herosky__lens" />
      </div>

      <div className="herosky__clouds">
        <span className="herosky__cloud herosky__cloud--1" />
        <span className="herosky__cloud herosky__cloud--2" />
        <span className="herosky__cloud herosky__cloud--3" />
      </div>

      <div className="herosky__fog" />
    </div>
  );
}
