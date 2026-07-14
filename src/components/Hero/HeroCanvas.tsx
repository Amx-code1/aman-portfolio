
import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/utils';
import './HeroCanvas.css';

interface Star {
  x: number;
  y: number;
  r: number;
  tw: number;
  tws: number;
  depth: number;
  col: string;
}

interface RainDrop {
  x: number;
  y: number;
  len: number;
  vy: number;
  depth: number;
  alpha: number;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  depth: number;
  sway: number;
  swaySpeed: number;
  col: string;
}

interface DustMote {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  depth: number;
  col: string;
}

const PETAL_COLORS = [
  'rgba(255,138,178,',
  'rgba(255,182,210,',
  'rgba(196,140,240,',
  'rgba(255,120,160,',
];
const DUST_COLORS = [
  'rgba(0,240,255,',
  'rgba(155,93,229,',
  'rgba(255,255,255,',
  'rgba(255,92,138,',
];

export function HeroCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduce = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let mx = 0;
    let my = 0;
    let stars: Star[] = [];
    let rain: RainDrop[] = [];
    let petals: Petal[] = [];
    let dust: DustMote[] = [];
    let glow: HTMLCanvasElement | null = null;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const makeGlow = (col: string, size: number) => {
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const g = c.getContext('2d');
      if (!g) return c;
      const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, col + '0.9)');
      grad.addColorStop(0.4, col + '0.32)');
      grad.addColorStop(1, col + '0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, size, size);
      return c;
    };

    const init = () => {
      const isSmall = w < 760;
      const sCount = isSmall ? 80 : 150;
      const rCount = isSmall ? 80 : 150;
      const pCount = isSmall ? 14 : 26;
      const dCount = isSmall ? 18 : 34;

      stars = Array.from({ length: sCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.72,
        r: rand(0.4, 1.7),
        tw: Math.random() * Math.PI * 2,
        tws: rand(0.008, 0.03),
        depth: rand(0.15, 0.5),
        col: Math.random() > 0.78 ? 'rgba(0,240,255,' : 'rgba(226,232,255,',
      }));

      rain = Array.from({ length: rCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        len: rand(8, 20),
        vy: rand(7, 13),
        depth: rand(0.4, 1),
        alpha: rand(0.05, 0.18),
      }));

      petals = Array.from({ length: pCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: rand(5, 11),
        vx: rand(-0.5, -0.12),
        vy: rand(0.35, 0.95),
        rot: Math.random() * Math.PI * 2,
        vrot: rand(-0.02, 0.02),
        depth: rand(0.35, 1),
        sway: Math.random() * Math.PI * 2,
        swaySpeed: rand(0.01, 0.03),
        col: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      }));

      dust = Array.from({ length: dCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: rand(1.2, 3.4),
        vx: rand(-0.08, 0.08),
        vy: rand(-0.14, -0.03),
        alpha: rand(0.12, 0.4),
        depth: rand(0.5, 1),
        col: DUST_COLORS[Math.floor(Math.random() * DUST_COLORS.length)],
      }));

      glow = makeGlow('rgba(255,255,255,', 64);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    };

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(p.size / 10, p.size / 10);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(5, -3, 0, -11);
      ctx.quadraticCurveTo(-5, -3, 0, 0);
      ctx.fillStyle = p.col + '0.85)';
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const px = mx * 20;
      const py = my * 14;

      for (const s of stars) {
        s.tw += s.tws;
        const a = 0.4 + Math.sin(s.tw) * 0.4;
        ctx.globalAlpha = Math.max(0, a);
        ctx.fillStyle = s.col + '1)';
        ctx.beginPath();
        ctx.arc(s.x + px * s.depth * 0.4, s.y + py * s.depth * 0.4, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (glow) {
        for (const d of dust) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.y < -10) {
            d.y = h + 10;
            d.x = Math.random() * w;
          }
          if (d.x < -10) d.x = w + 10;
          else if (d.x > w + 10) d.x = -10;
          ctx.globalAlpha = d.alpha;
          const size = d.r * 6;
          ctx.drawImage(
            glow,
            d.x + px * d.depth - size / 2,
            d.y + py * d.depth - size / 2,
            size,
            size
          );
        }
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(170,210,255,1)';
      for (const r of rain) {
        r.y += r.vy;
        if (r.y > h + r.len) {
          r.y = -r.len;
          r.x = Math.random() * w;
        }
        const dx = px * r.depth * 0.6;
        const dy = py * r.depth * 0.6;
        ctx.globalAlpha = r.alpha;
        ctx.beginPath();
        ctx.moveTo(r.x + dx, r.y + dy);
        ctx.lineTo(r.x + dx - 1.5, r.y + dy + r.len);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      for (const p of petals) {
        p.sway += p.swaySpeed;
        p.x += p.vx + Math.sin(p.sway) * 0.3;
        p.y += p.vy;
        p.rot += p.vrot;
        if (p.y > h + 20) {
          p.y = -20;
          p.x = Math.random() * w;
        }
        if (p.x < -20) p.x = w + 20;
        drawPetal({
          ...p,
          x: p.x + px * p.depth,
          y: p.y + py * p.depth,
        });
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = s.col + '1)';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const p of petals) drawPetal(p);
      ctx.globalAlpha = 1;
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(render);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && activeRef.current) start();
      else stop();
    });
    io.observe(canvas);

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    resize();
    if (reduce) drawStatic();
    else if (activeRef.current) start();

    return () => {
      stop();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      io.disconnect();
    };
  }, [active]);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
