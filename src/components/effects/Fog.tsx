
import React from 'react';
import './Fog.css';

export function Fog() {
  return (
    <div className="fog" aria-hidden="true">
      <span className="fog__layer fog__layer--1" />
      <span className="fog__layer fog__layer--2" />
      <span className="fog__layer fog__layer--3" />
    </div>
  );
}
