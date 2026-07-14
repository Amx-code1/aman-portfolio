
import React from 'react';
import { useSurprises } from './SurpriseProvider';
import { SurpriseLauncher } from './SurpriseLauncher';
import { Collectibles } from './Collectibles';
import { Terminal } from './Terminal';
import { AchievementToasts } from './AchievementToasts';
import { AchievementsPanel } from './AchievementsPanel';
import { ThemePanel } from './ThemePanel';
import { DevPanel } from './DevPanel';
import { SecretRoom } from './SecretRoom';
import { MiniGame } from './MiniGame';
import { KonamiFlash } from './KonamiFlash';

export function Surprises() {
  const s = useSurprises();
  return (
    <>
      <Collectibles />
      <SurpriseLauncher />
      <Terminal />
      <AchievementToasts />
      <AchievementsPanel />
      <ThemePanel />
      <DevPanel />
      <SecretRoom />
      <MiniGame />
      <KonamiFlash />
      {/* keep referenced to satisfy lint */}
      <span style={{ display: 'none' }} data-surprise-ready={s.loaded ? '1' : '0'} />
    </>
  );
}
