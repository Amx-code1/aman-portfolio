
import { useEffect, useState } from 'react';

export interface DeviceProfile {
  isTouch: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isFoldable: boolean;
  isLandscape: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
  folded: boolean;
}

function compute(): DeviceProfile {
  if (typeof window === 'undefined') {
    return {
      isTouch: false,
      isMobile: false,
      isTablet: false,
      isFoldable: false,
      isLandscape: false,
      isDesktop: true,
      width: 1280,
      height: 800,
      folded: false,
    };
  }
  const w = window.innerWidth;
  const h = window.innerHeight;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const isLandscape = w >= h;
  const foldVertical = window.matchMedia('(spanning: single-fold-vertical)').matches;
  const foldHorizontal = window.matchMedia('(spanning: single-fold-horizontal)').matches;
  const extremeRatio = w / h > 2.1 || h / w > 2.1;
  const isFoldable = foldVertical || foldHorizontal || (isTouch && extremeRatio);
  const isMobile = (isTouch && w < 768) || (isFoldable && w < 640);
  const isTablet = isTouch && !isMobile && w < 1200;
  const isDesktop = !isTouch || w >= 1200;
  const folded = isFoldable && w < 720;
  return { isTouch, isMobile, isTablet, isFoldable, isLandscape, isDesktop, width: w, height: h, folded };
}

export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(compute);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setProfile(compute()));
    };
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    const mqV = window.matchMedia('(spanning: single-fold-vertical)');
    mqV.addEventListener?.('change', update);
    const mqH = window.matchMedia('(spanning: single-fold-horizontal)');
    mqH.addEventListener?.('change', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      mqV.removeEventListener?.('change', update);
      mqH.removeEventListener?.('change', update);
      cancelAnimationFrame(raf);
    };
  }, []);

  return profile;
}
