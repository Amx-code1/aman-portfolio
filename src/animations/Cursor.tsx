
import React, { useEffect, useRef, useState } from 'react';
import { isFinePointer, prefersReducedMotion } from '../lib/utils';
import './Cursor.css';

type ModeName = 'default' | 'hover' | 'view' | 'text' | 'drag' | 'hidden';

interface Mode {
  name: ModeName;
  color: string;
  label?: string;
  ringScale: number;
}

const MODES: Record<ModeName, Mode> = {
  default: { name: 'default', color: '#00f0ff', ringScale: 1 },
  hover: { name: 'hover', color: '#00f0ff', ringScale: 1.7 },
  view: { name: 'view', color: '#ff5c8a', ringScale: 2.1, label: 'VIEW' },
  text: { name: 'text', color: '#9b5de5', ringScale: 0.6 },
  drag: { name: 'drag', color: '#f9c74f', ringScale: 1.8 },
  hidden: { name: 'hidden', color: '#00f0ff', ringScale: 0 },
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
}
interface Ripple {
  x: number;
  y: number;
  life: number;
  max: number;
  color: string;
}
interface TrailPoint {
  x: number;
  y: number;
  life: number;
}

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * High-performance custom cursor engine rendered on a single canvas.
 * Features: glow, magnetic pull, ambient + burst particles, fading trail,
 * click ripples, energy bursts, hover scaling, and distinct cursor modes.
 * Disabled entirely on coarse pointers and respects reduced-motion.
 */
export function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isFinePointer()) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    let W = window.innerWidth;
    let H = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    document.documentElement.classList.add('cursor-active');

    const mouse = { x: W / 2, y: H / 2 };
    const dot = { x: mouse.x, y: mouse.y };
    const ring = { x: mouse.x, y: mouse.y };
    let visible = false;
    let down = false;
    let mode: Mode = MODES.default;
    const center = { x: mouse.x, y: mouse.y, active: false };

    const particles: Particle[] = [];
    const ripples: Ripple[] = [];
    const trail: TrailPoint[] = [];

    const spawnBurst = (x: number, y: number, color: string, count: number, power: number) => {
      if (reduced) return;
      for (let i = 0; i < count; i++) {
        if (particles.length > 170) break;
        const a = Math.random() * Math.PI * 2;
        const sp = power * (0.4 + Math.random() * 0.8);
        particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          max: 0.5 + Math.random() * 0.6,
          size: 1.5 + Math.random() * 2.6,
          color,
        });
      }
    };

    const spawnAmbient = (x: number, y: number, color: string) => {
      if (reduced || particles.length > 150) return;
      const a = Math.random() * Math.PI * 2;
      const sp = 0.2 + Math.random() * 0.6;
      particles.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 0.2,
        life: 1,
        max: 0.6 + Math.random() * 0.7,
        size: 0.8 + Math.random() * 1.6,
        color,
      });
    };

    const getMode = (el: EventTarget | null): Mode => {
      const t = el as HTMLElement | null;
      if (!t || !t.closest) return MODES.default;
      const tagged = t.closest('[data-cursor]') as HTMLElement | null;
      if (tagged) {
        const v = tagged.getAttribute('data-cursor');
        if (v === 'hidden') return MODES.hidden;
        if (v === 'view') return MODES.view;
        if (v === 'text') return MODES.text;
        if (v === 'drag') return MODES.drag;
        return MODES.hover;
      }
      if (t.closest('a, button, [role="button"], input, textarea, select, label')) return MODES.hover;
      return MODES.default;
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      visible = true;
      mode = getMode(e.target);
      if (mode.name === 'hover' || mode.name === 'view' || mode.name === 'drag') {
        const tagged = (e.target as HTMLElement).closest('[data-magnetic], a, button');
        if (tagged) {
          const r = tagged.getBoundingClientRect();
          center.x = r.left + r.width / 2;
          center.y = r.top + r.height / 2;
          center.active = true;
        } else center.active = false;
      } else center.active = false;
    };

    const onDown = (e: PointerEvent) => {
      down = true;
      if (reduced) return;
      ripples.push({ x: e.clientX, y: e.clientY, life: 1, max: 0.6, color: mode.color });
      spawnBurst(e.clientX, e.clientY, mode.color, 22, 5);
    };
    const onUp = () => {
      down = false;
    };
    const onLeave = () => {
      visible = false;
    };
    const onEnter = () => {
      visible = true;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);
    window.addEventListener('resize', resize);

    let raf = 0;
    let last = performance.now();
    let ambientTick = 0;
    let lastTrail = { x: -99, y: -99 };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000) || 0;
      last = now;

      const ringEase = down ? 0.24 : 0.18;
      let tx = mouse.x;
      let ty = mouse.y;
      if (center.active && mode.name !== 'default' && mode.name !== 'hidden') {
        tx = mouse.x + (center.x - mouse.x) * 0.28;
        ty = mouse.y + (center.y - mouse.y) * 0.28;
      }
      dot.x += (mouse.x - dot.x) * 0.35;
      dot.y += (mouse.y - dot.y) * 0.35;
      ring.x += (tx - ring.x) * ringEase;
      ring.y += (ty - ring.y) * ringEase;

      ctx.clearRect(0, 0, W, H);

      if (visible && mode.name !== 'hidden') {
        const [r, g, b] = hexToRgb(mode.color);
        const ringR = (mode.name === 'text' ? 13 : 18) * mode.ringScale * (down ? 0.85 : 1);

        if (!reduced) {
          const gr = ctx.createRadialGradient(ring.x, ring.y, 0, ring.x, ring.y, 60);
          gr.addColorStop(0, `rgba(${r},${g},${b},0.18)`);
          gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = gr;
          ctx.beginPath();
          ctx.arc(ring.x, ring.y, 60, 0, 6.28);
          ctx.fill();
        }

        if (!reduced) {
          ambientTick += dt;
          if (ambientTick > 0.016) {
            ambientTick = 0;
            const d = Math.hypot(mouse.x - lastTrail.x, mouse.y - lastTrail.y);
            if (d > 3) {
              trail.push({ x: ring.x, y: ring.y, life: 1 });
              lastTrail = { x: mouse.x, y: mouse.y };
              if (trail.length > 18) trail.shift();
            }
          }
          for (let i = trail.length - 1; i >= 0; i--) {
            const p = trail[i];
            p.life -= dt * 2.2;
            if (p.life <= 0) {
              trail.splice(i, 1);
              continue;
            }
            ctx.fillStyle = `rgba(${r},${g},${b},${p.life * 0.22})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6 * p.life + 1, 0, 6.28);
            ctx.fill();
          }
          if (Math.random() < 0.4) spawnAmbient(ring.x, ring.y, mode.color);
        }

        ctx.strokeStyle = `rgba(${r},${g},${b},0.9)`;
        ctx.lineWidth = mode.name === 'text' ? 2 : 1.6;
        if (mode.name === 'text') {
          ctx.beginPath();
          ctx.moveTo(ring.x, ring.y - ringR);
          ctx.lineTo(ring.x, ring.y + ringR);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(ring.x, ring.y, ringR, 0, 6.28);
          ctx.stroke();
          if (mode.name === 'view' || mode.name === 'drag') {
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.arc(ring.x, ring.y, ringR * 0.55, 0, 6.28);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }

        if (mode.label) {
          ctx.fillStyle = `rgba(${r},${g},${b},0.95)`;
          ctx.font = '600 10px "Space Grotesk", system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(mode.label, ring.x, ring.y);
        }

        ctx.fillStyle = `rgba(${r},${g},${b},1)`;
        if (mode.name === 'text') {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 1.5, 0, 6.28);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, down ? 4 : 3, 0, 6.28);
          ctx.fill();
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life -= dt / p.max;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          p.vy += dt * 1.2;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.x += p.vx;
          p.y += p.vy;
          const [pr, pg, pb] = hexToRgb(p.color);
          ctx.fillStyle = `rgba(${pr},${pg},${pb},${p.life})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, 6.28);
          ctx.fill();
        }

        for (let i = ripples.length - 1; i >= 0; i--) {
          const rp = ripples[i];
          rp.life -= dt / rp.max;
          if (rp.life <= 0) {
            ripples.splice(i, 1);
            continue;
          }
          const rad = (1 - rp.life) * 70 + 6;
          const [rr, rg, rb] = hexToRgb(rp.color);
          ctx.strokeStyle = `rgba(${rr},${rg},${rb},${rp.life * 0.7})`;
          ctx.lineWidth = 2 * rp.life + 0.5;
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, rad, 0, 6.28);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
      window.removeEventListener('resize', resize);
      document.documentElement.classList.remove('cursor-active');
    };
  }, [enabled]);

  if (!enabled) return null;
  return <canvas ref={canvasRef} className="cursor-canvas" aria-hidden="true" />;
}
