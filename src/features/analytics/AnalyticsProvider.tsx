
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { persistence } from '../../lib/persistence';
import { usePerformance, Vitals } from '../../hooks/usePerformance';

type Consent = 'granted' | 'denied' | 'unknown';

interface AnalyticsState {
  consent: Consent;
  grant: () => void;
  deny: () => void;
  track: (name: string, props?: Record<string, unknown>) => void;
  pageView: (path: string, title?: string) => void;
}

const Ctx = createContext<AnalyticsState | null>(null);

export function useAnalytics(): AnalyticsState {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAnalytics must be used within AnalyticsProvider');
  return c;
}

const ENDPOINT = '/api/collect';

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<Consent>('unknown');
  const queue = useRef<unknown[]>([]);
  const flushTimer = useRef(0);

  useEffect(() => {
    (async () => {
      const c = await persistence.getItem('kaze_analytics_consent');
      if (c === 'granted' || c === 'denied') setConsent(c as Consent);
    })();
  }, []);

  const flush = useCallback(() => {
    if (!queue.current.length) return;
    const payload = JSON.stringify({ events: queue.current.splice(0) });
    try {
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, payload);
      }
    } catch {
      /* swallow — analytics must never break the app */
    }
  }, []);

  const enqueue = useCallback(
    (ev: unknown) => {
      if (consent !== 'granted') return;
      queue.current.push(ev);
      if (!flushTimer.current) {
        flushTimer.current = window.setTimeout(() => {
          flushTimer.current = 0;
          flush();
        }, 1500);
      }
    },
    [consent, flush]
  );

  const grant = useCallback(() => {
    setConsent('granted');
    persistence.setItem('kaze_analytics_consent', 'granted');
  }, []);
  const deny = useCallback(() => {
    setConsent('denied');
    persistence.setItem('kaze_analytics_consent', 'denied');
    queue.current = [];
  }, []);

  const track = useCallback(
    (name: string, props?: Record<string, unknown>) => {
      enqueue({ type: 'event', name, props, ts: Date.now() });
    },
    [enqueue]
  );

  const pageView = useCallback(
    (path: string, title?: string) => {
      enqueue({ type: 'page_view', path, title, ts: Date.now() });
    },
    [enqueue]
  );

  useEffect(() => {
    if (consent !== 'granted') return;
    const onErr = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      enqueue({ type: 'error', detail, ts: Date.now() });
    };
    window.addEventListener('app:error', onErr as EventListener);
    window.addEventListener('beforeunload', flush);
    return () => {
      window.removeEventListener('app:error', onErr as EventListener);
      window.removeEventListener('beforeunload', flush);
      flush();
    };
  }, [consent, enqueue, flush]);

  const reportVitals = useCallback(
    (v: Partial<Vitals>) => {
      enqueue({ type: 'web_vitals', metrics: v, ts: Date.now() });
    },
    [enqueue]
  );
  usePerformance(reportVitals);

  return (
    <Ctx.Provider value={{ consent, grant, deny, track, pageView }}>
      {children}
      {consent === 'unknown' && <ConsentBanner />}
    </Ctx.Provider>
  );
}

function ConsentBanner() {
  const { grant, deny } = useAnalytics();
  return (
    <div className="consent" role="dialog" aria-label="Privacy consent">
      <div className="consent__inner">
        <p className="consent__text">
          We use privacy-first, anonymous analytics to tune the experience. No personal data is
          stored.
        </p>
        <div className="consent__actions">
          <button className="consent__btn consent__btn--ghost" onClick={deny} data-cursor="hover">
            Decline
          </button>
          <button className="consent__btn" onClick={grant} data-cursor="hover">
            Accept
          </button>
        </div>
      </div>
      <style>{`
        .consent {
          position: fixed;
          left: 50%;
          bottom: 20px;
          transform: translateX(-50%);
          z-index: 9700;
          width: min(560px, 92vw);
          border-radius: 16px;
          border: 1px solid var(--glass-border);
          background: var(--glass-bg-strong);
          backdrop-filter: blur(16px) saturate(150%);
          -webkit-backdrop-filter: blur(16px) saturate(150%);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
          padding: 16px 20px;
        }
        .consent__inner { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .consent__text { flex: 1; min-width: 220px; margin: 0; color: var(--text-dim); font-size: 0.84rem; font-weight: 300; }
        .consent__actions { display: flex; gap: 10px; }
        .consent__btn {
          padding: 10px 20px; border-radius: 999px; border: none;
          background: var(--grad-primary); color: #05050a; font-family: var(--font-heading);
          font-weight: 600; letter-spacing: 0.04em; cursor: pointer;
          transition: transform 0.25s var(--ease), box-shadow 0.25s var(--ease);
        }
        .consent__btn:hover { transform: translateY(-2px); box-shadow: var(--glow-cyan); }
        .consent__btn--ghost { background: var(--glass-bg); color: var(--text); border: 1px solid var(--glass-border); }
      `}</style>
    </div>
  );
}
