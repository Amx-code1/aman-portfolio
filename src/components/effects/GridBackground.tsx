
import React from 'react';
import './GridBackground.css';

export function GridBackground() {
  return (
    <div className="grid-bg" aria-hidden="true">
      <div className="grid-bg__plane" />
      <div className="grid-bg__fade" />
    </div>
  );
}
