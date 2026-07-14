
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '../SectionHeading/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { CharacterSilhouette } from '../CharacterSilhouette/CharacterSilhouette';
import { timelineEvents } from '../../content/timeline';
import { prefersReducedMotion } from '../../lib/utils';
import './Timeline.css';

gsap.registerPlugin(ScrollTrigger);

interface Pt {
  x: number;
  y: number;
}

function buildPath(points: Pt[]): string {
  if (points.length < 2) return '';
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function Timeline() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pathGlowRef = useRef<SVGPathElement>(null);
  const charRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathLenRef = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const path = pathRef.current;
    const pathGlow = pathGlowRef.current;
    const svg = svgRef.current;
    const char = charRef.current;
    if (!wrap || !path || !pathGlow || !svg || !char) return;
    const reduce = prefersReducedMotion();
    let drawTween: gsap.core.Tween | null = null;
    let charTrigger: ScrollTrigger | null = null;

    const measure = () => {
      const rect = wrap.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const pts: Pt[] = dotRefs.current.filter(Boolean).map((el) => {
        const r = el!.getBoundingClientRect();
        return { x: r.left + r.width / 2 - rect.left, y: r.top + r.height / 2 - rect.top };
      });
      if (pts.length < 2) return;
      const ext0 = { x: pts[0].x, y: Math.max(0, pts[0].y - 110) };
      const ext1 = { x: pts[pts.length - 1].x, y: Math.min(H, pts[pts.length - 1].y + 110) };
      const d = buildPath([ext0, ...pts, ext1]);
      path.setAttribute('d', d);
      pathGlow.setAttribute('d', d);
      const len = path.getTotalLength();
      pathLenRef.current = len;
      path.style.strokeDasharray = `${len}`;
      pathGlow.style.strokeDasharray = `${len}`;

      if (reduce) {
        path.style.strokeDashoffset = '0';
        pathGlow.style.strokeDashoffset = '0';
        return;
      }
      if (drawTween) {
        drawTween.scrollTrigger?.kill();
        drawTween.kill();
        drawTween = null;
      }
      if (charTrigger) {
        charTrigger.kill();
        charTrigger = null;
      }
      path.style.strokeDashoffset = `${len}`;
      pathGlow.style.strokeDashoffset = `${len}`;
      drawTween = gsap.to([path, pathGlow], {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top 62%', end: 'bottom 82%', scrub: 1 },
      });
      charTrigger = ScrollTrigger.create({
        trigger: wrap,
        start: 'top 78%',
        end: 'bottom 62%',
        onUpdate: (self) => {
          const pt = path.getPointAtLength(self.progress * pathLenRef.current);
          char.style.transform = `translate(-50%, -50%) translate(${pt.x}px, ${pt.y}px)`;
          char.style.opacity = self.progress > 0.01 && self.progress < 0.99 ? '1' : '0.3';
        },
      });
    };

    measure();

    const ro = new ResizeObserver(() => {
      measure();
      ScrollTrigger.refresh();
    });
    ro.observe(wrap);

    const rowObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('is-active');
          else e.target.classList.remove('is-active');
        });
      },
      { rootMargin: '-42% 0px -42% 0px' }
    );
    rowRefs.current.filter(Boolean).forEach((el) => rowObs.observe(el));

    return () => {
      ro.disconnect();
      rowObs.disconnect();
      if (drawTween) {
        drawTween.scrollTrigger?.kill();
        drawTween.kill();
      }
      if (charTrigger) charTrigger.kill();
      gsap.killTweensOf([path, pathGlow]);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const path = pathRef.current;
    if (!canvas || !path) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = prefersReducedMotion();
    let raf = 0;
    let running = false;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let flow: { t: number; speed: number; size: number }[] = [];
    let ambient: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];

    const samplePoints = (): Pt[] => {
      const len = path.getTotalLength();
      const N = 260;
      const arr: Pt[] = [];
      for (let i = 0; i <= N; i++) {
        const p = path.getPointAtLength((i / N) * len);
        arr.push({ x: p.x, y: p.y });
      }
      return arr;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rebuild = () => {
      (canvas as any)._pts = samplePoints();
      const count = Math.min(30, Math.max(16, Math.floor(W / 38)));
      flow = Array.from({ length: count }, () => ({
        t: Math.random(),
        speed: 0.0006 + Math.random() * 0.0014,
        size: 1.6 + Math.random() * 2.6,
      }));
      ambient = Array.from({ length: 20 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -0.05 - Math.random() * 0.14,
        r: 0.6 + Math.random() * 1.8,
        a: 0.08 + Math.random() * 0.26,
      }));
    };

    const colorAt = (t: number) => {
      if (t < 0.5) {
        const k = t / 0.5;
        return `rgba(${Math.round(0 + (155 - 0) * k)}, ${Math.round(240 + (93 - 240) * k)}, ${Math.round(255 + (229 - 255) * k)},`;
      }
      const k = (t - 0.5) / 0.5;
      return `rgba(${Math.round(155 + (255 - 155) * k)}, ${Math.round(93 + (92 - 93) * k)}, ${Math.round(229 + (138 - 229) * k)},`;
    };

    const draw = () => {
      const pts: Pt[] = (canvas as any)._pts || [];
      ctx.clearRect(0, 0, W, H);
      if (pts.length < 2) {
        raf = requestAnimationFrame(draw);
        return;
      }
      ctx.globalCompositeOperation = 'lighter';
      for (const p of ambient) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -6) {
          p.y = H + 6;
          p.x = Math.random() * W;
        }
        if (p.x < -6) p.x = W + 6;
        else if (p.x > W + 6) p.x = -6;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = '#9b5de5';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.28);
        ctx.fill();
      }
      for (const f of flow) {
        f.t += f.speed;
        if (f.t > 1) f.t -= 1;
        const idx = f.t * (pts.length - 1);
        const i = Math.floor(idx);
        const frac = idx - i;
        const a = pts[i];
        const b = pts[Math.min(i + 1, pts.length - 1)];
        const x = a.x + (b.x - a.x) * frac;
        const y = a.y + (b.y - a.y) * frac;
        const col = colorAt(f.t);
        const r = f.size * 3.4;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2);
        g.addColorStop(0, col + '0.95)');
        g.addColorStop(0.4, col + '0.32)');
        g.addColorStop(1, col + '0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r * 2, 0, 6.28);
        ctx.fill();
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, f.size * 0.5, 0, 6.28);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    rebuild();
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(canvas);
    const onResize = () => {
      resize();
      rebuild();
    };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section className="vtimeline section" id="timeline">
      <div className="container">
        <SectionHeading index="05" title="Our Journey" subtitle="A vertical saga carved in living light." />
        <div className="vtimeline__wrap" ref={wrapRef}>
          <svg className="vtimeline__svg" ref={svgRef} aria-hidden="true" preserveAspectRatio="none">
            <defs>
              <linearGradient id="vt-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="50%" stopColor="#9b5de5" />
                <stop offset="100%" stopColor="#ff5c8a" />
              </linearGradient>
              <filter id="vt-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="7" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path ref={pathGlowRef} className="vtimeline__path vtimeline__path--glow" />
            <path ref={pathRef} className="vtimeline__path vtimeline__path--main" />
          </svg>

          <canvas className="vtimeline__energy" ref={canvasRef} aria-hidden="true" />

          <div className="vtimeline__char" ref={charRef} aria-hidden="true">
            <div className="vtimeline__char-inner">
              <CharacterSilhouette className="vtimeline__char-svg" />
            </div>
            <span className="vtimeline__char-aura" />
          </div>

          {timelineEvents.map((ev, i) => {
            const side = i % 2 === 0 ? 'left' : 'right';
            return (
              <div
                key={ev.year}
                className={`vt-row vt-row--${side}`}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
              >
                <div className={`vt-row__card vt-row__card--${side}`}>
                  <GlassCard className="vt-card" glow>
                    <div className="vt-card__top">
                      <span className="vt-card__kanji" aria-hidden="true">
                        {ev.kanji}
                      </span>
                      <span className="vt-card__year">{ev.year}</span>
                    </div>
                    <h3 className="vt-card__title">{ev.title}</h3>
                    <p className="vt-card__desc">{ev.desc}</p>
                    <div className="vt-card__detail">
                      <span className="vt-card__detail-label">Archive Note</span>
                      <p>{ev.detail}</p>
                    </div>
                    <span className="vt-card__corner" aria-hidden="true" />
                  </GlassCard>
                </div>
                <div className="vt-row__rail">
                  <span
                    className="vt-dot"
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    aria-hidden="true"
                  >
                    <span className="vt-dot__core" />
                    <span className="vt-dot__ring" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
