
import { useEffect } from 'react';

export interface Vitals {
  lcp?: number;
  cls?: number;
  inp?: number;
  fcp?: number;
  ttfb?: number;
}

/**
 * Lightweight Core Web Vitals collector using PerformanceObserver.
 * Reports incremental metric updates to the supplied callback (used to feed
 * analytics / monitoring). No external dependency.
 */
export function usePerformance(onReport?: (v: Partial<Vitals>) => void) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
    const vitals: Partial<Vitals> = {};
    const report = () => onReport?.({ ...vitals });

    const make = (type: string, cb: (entry: any) => void) => {
      try {
        const obs = new PerformanceObserver((list) => list.getEntries().forEach(cb));
        obs.observe({ type, buffered: true } as any);
        return obs;
      } catch {
        return null;
      }
    };

    const lcp = make('largest-contentful-paint', (e) => {
      vitals.lcp = e.startTime;
      report();
    });
    const cls = make('layout-shift', (e) => {
      if (!e.hadRecentInput) {
        vitals.cls = (vitals.cls ?? 0) + e.value;
        report();
      }
    });
    const evt = make('event', (e) => {
      if (e.name === 'click' || e.name === 'keydown' || e.name === 'pointerdown') {
        vitals.inp = Math.max(vitals.inp ?? 0, e.processingEnd - e.startTime);
        report();
      }
    });
    const paint = make('paint', (e) => {
      if (e.name === 'first-contentful-paint') vitals.fcp = e.startTime;
      report();
    });

    const nav = performance.getEntriesByType('navigation')[0] as any;
    if (nav) {
      vitals.ttfb = nav.responseStart;
      report();
    }

    return () => {
      lcp?.disconnect();
      cls?.disconnect();
      evt?.disconnect();
      paint?.disconnect();
    };
  }, [onReport]);
}
