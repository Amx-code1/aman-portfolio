
import React from 'react';
import './LightRays.css';

export function LightRays() {
  return (
    <div className="light-rays" aria-hidden="true">
      <span className="light-rays__beam" />
      <span className="light-rays__beam light-rays__beam--2" />
      <span className="light-rays__beam light-rays__beam--3" />
    </div>
  );
}
