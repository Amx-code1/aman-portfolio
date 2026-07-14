
import React, { useEffect, useRef, useState } from 'react';
import { withAlpha, hexToRgb } from '../../lib/color';
import './InteractivePrototype.css';

interface Props {
  theme: string;
  type: 'parallax' | 'character' | 'color';
}

export function InteractivePrototype({ theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tod, setTod] = useState(40);
  const [running, setRunning] = useState(false);
  const todRef = useRef(40);
  todRef.current = tod;
  const runRef = useRef(false);
  runRef.current = running;
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 0, h = 0, dpr = 1, raf = 0, last = 0;
    let sweep = 0;
    const [tr, tg, tb] = hexToRgb(theme);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const mix = (a: number[], b: number[], t: number) => [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];
    const rgbStr = (c: number[]) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;

    const drawMountains = (
      ctx2: CanvasRenderingContext2D,
      ow: number,
      oh: number,
      ox: number,
      oy: number,
      scale: number,
      col: string
    ) => {
      ctx2.save();
      ctx2.translate(ox, oy);
      ctx2.fillStyle = col;
      ctx2.beginPath();
      ctx2.moveTo(0, oh);
      const n = 6;
      for (let i = 0; i <= n; i++) {
        const x = (i / n) * ow;
        const y = oh * (0.55 + scale * 0.5) - Math.abs(Math.sin(i * 1.7 + scale * 3)) * oh * scale * 0.5;
        ctx2.lineTo(x, y);
      }
      ctx2.lineTo(ow, oh);
      ctx2.closePath();
      ctx2.fill();
      ctx2.restore();
    };

    const draw = (time: number) => {
      const tod = todRef.current / 100;
      const top = mix([30, 90, 200], [6, 7, 18], tod);
      const bot = mix([150, 210, 255], [20, 16, 46], tod);
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, rgbStr(top));
      g.addColorStop(1, rgbStr(bot));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const mx = mouse.current.x * 18;
      const my = mouse.current.y * 12;

      const cx = w * (0.2 + tod * 0.6) + mx;
      const cy = h * (0.7 - Math.sin(tod * Math.PI) * 0.5) + my;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const r = Math.max(w, h) * 0.3;
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      cg.addColorStop(0, tod > 0.5 ? 'rgba(220,230,255,0.9)' : 'rgba(255,240,200,0.9)');
      cg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 6.28);
      ctx.fill();
      ctx.restore();

      drawMountains(ctx, w, h, mx * 0.4, my * 0.4, 0.5, `rgba(${tr * 0.06},${tg * 0.06},${tb * 0.1},0.85)`);
      drawMountains(ctx, w, h, mx * 0.8, my * 0.8, 0.28, 'rgba(6,8,18,0.95)');

      ctx.save();
      ctx.translate(w * 0.5 + mx * 1.2, h * 0.8 + my * 1.2);
      ctx.fillStyle = 'rgba(4,4,12,0.95)';
      ctx.beginPath();
      ctx.moveTo(-14, 56);
      ctx.quadraticCurveTo(-22, 0, 0, -38);
      ctx.quadraticCurveTo(22, 0, 14, 56);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -50, 11, 0, 6.28);
      ctx.fill();
      ctx.restore();

      if (runRef.current) {
        sweep += 0.012;
        const x = sweep * w;
        const sg = ctx.createLinearGradient(x - 50, 0, x + 50, 0);
        sg.addColorStop(0, 'rgba(0,0,0,0)');
        sg.addColorStop(0.5, withAlpha(theme, 0.28));
        sg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = sg;
        ctx.fillRect(x - 50, 0, 100, h);
        if (sweep >= 1) {
          sweep = 0;
          setRunning(false);
        }
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000) || 0;
      last = now;
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.08;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.08;
      draw(now / 1000);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.ty = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };

    canvas.addEventListener('mousemove', onMove);
    resize();
    raf = requestAnimationFrame(loop);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <div className="proto">
      <div className="proto__stage">
        <canvas ref={canvasRef} className="proto__canvas" aria-hidden="true" />
      </div>
      <div className="proto__controls">
        <label className="proto__slider">
          <span>Time of Day</span>
          <input
            type="range"
            min={0}
            max={100}
            value={tod}
            onChange={(e) => setTod(Number(e.target.value))}
            aria-label="Time of day"
          />
        </label>
        <button className="proto__run" onClick={() => setRunning(true)} data-cursor="hover">
          ▶ Run Intro Sweep
        </button>
      </div>
      <p className="proto__hint">Move your cursor across the scene to parallax. Drag the slider to shift the mood.</p>
    </div>
  );
}
