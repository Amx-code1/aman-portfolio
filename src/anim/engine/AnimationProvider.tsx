
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../lib/utils';
import './AnimationProvider.css';

gsap.registerPlugin(ScrollTrigger);

interface EngineState {
  lenis: Lenis | null;
  reduced: boolean;
}

const EngineCtx = createContext<EngineState>({ lenis: null, reduced: false });

export const useEngine = () => useContext(EngineCtx);

/**
 * The AnimationProvider boots the global engine:
 *  - Lenis smooth scroll (drives native scroll + GSAP ScrollTrigger)
 *  - Registers GSAP plugins
 *  - Exposes reduced-motion awareness to the whole tree
 */
export function AnimationProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const l = new Lenis({
      duration: 1.1,
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    setLenis(l);

    l.on('scroll', ScrollTrigger.update);

    let raf = 0;
    const loop = (t: number) => {
      l.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      l.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <EngineCtx.Provider value={{ lenis, reduced }}>{children}</EngineCtx.Provider>;
}
