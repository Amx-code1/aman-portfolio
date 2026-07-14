
import React from 'react';
import { GridBackground } from '../effects/GridBackground';
import { LightRays } from '../effects/LightRays';
import { Fog } from '../effects/Fog';
import { Bloom } from '../effects/Bloom';
import { Dust } from '../effects/Dust';

/**
 * Atmosphere composes the full decorative backdrop of the design system:
 * perspective grid, light rays, drifting fog, bloom and floating dust.
 */
export function Atmosphere() {
  return (
    <>
      <GridBackground />
      <LightRays />
      <Fog />
      <Bloom />
      <Dust />
    </>
  );
}
