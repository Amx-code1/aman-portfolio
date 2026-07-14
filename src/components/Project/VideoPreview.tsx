
import React, { useEffect, useRef, useState } from 'react';
import { withAlpha, hexToRgb } from '../../lib/color';
import './VideoPreview.css';

interface Props {
  theme: string;
  title: string;
  duration: string;
}

function parseDuration(d: string): number {
  const [m, s] = d.split(':').map(Number);
  return (m || 0) * 60 + (s || 0);
}

function fmtTime(p: number, total: number): string {
  const sec = Math.floor(p * total);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function VideoPreview({ theme, title, duration }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const progRef = useRef(0);
  const playingRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const total = parseDuration(duration);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 0, h = 0, dpr = 1, raf = 0, last = 0, running = false;
    let t = 0;
    const dots: { x: number; y: number; vx: number; vy: number; r: number; ph: number }[] = [];
    const [tr, tg, tb] = hexToRgb(theme);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      dots.length = 0;
      const n = Math.min(90, Math.floor((w * h) / 9000));
      for (let i = 0; i < n; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: Math.random() * 0.4 + 0.1,
          r: Math.random() * 1.8 + 0.6,
          ph: Math.random() * 6.28,
        });
      }
    };

    const draw = () => {
      const p = progRef.current;
      const speed = playingRef.current ? 1.8 : 0.4;
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, `rgb(${Math.round(tr * 0.12)},${Math.round(tg * 0.12)},${Math.round(tb * 0.18)})`);
      g.addColorStop(0.6, `rgb(${Math.round(tr * 0.05)},${Math.round(tg * 0.05)},${Math.round(tb * 0.1)})`);
      g.addColorStop(1, '#04040a');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const cx = w * (0.3 + p * 0.4);
      const cg = ctx.createRadialGradient(cx, h * 0.45, 0, cx, h * 0.45, Math.max(w, h) * 0.5);
      cg.addColorStop(0, withAlpha(theme, playingRef.current ? 0.35 : 0.18));
      cg.addColorStop(1, withAlpha(theme, 0));
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = withAlpha(theme, 0.9);
      for (const d of dots) {
        d.x += d.vx * speed;
        d.y += d.vy * speed;
        d.ph += 0.05 * speed;
        if (d.y > h + 4) { d.y = -4; d.x = Math.random() * w; }
        if (d.x < -4) d.x = w + 4;
        else if (d.x > w + 4) d.x = -4;
        const a = 0.3 + 0.5 * Math.sin(d.ph);
        ctx.globalAlpha = Math.max(0, a) * (playingRef.current ? 1 : 0.6);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, 6.28);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.strokeStyle = withAlpha(theme, 0.4);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.72);
      ctx.lineTo(w, h * 0.72);
      ctx.stroke();

      ctx.fillStyle = 'rgba(4,4,12,0.9)';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.72);
      const steps = 8;
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * w;
        const y = h * 0.72 - Math.abs(Math.sin(i * 1.3 + 0.5)) * h * 0.18;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      if (playingRef.current) {
        const sy = (t * 120) % h;
        ctx.fillStyle = withAlpha(theme, 0.05);
        ctx.fillRect(0, sy, w, 2);
      }

      if (playingRef.current && p < 0.12) {
        ctx.globalAlpha = 1 - p / 0.12;
        ctx.fillStyle = '#f4f6ff';
        ctx.font = `700 ${Math.max(18, w * 0.045)}px "Clash Display", system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(title.toUpperCase(), w / 2, h * 0.5);
        ctx.globalAlpha = 1;
      }
    };

    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000) || 0;
      last = now;
      t += dt;
      if (playingRef.current) {
        progRef.current += dt / total;
        if (progRef.current >= 1) {
          progRef.current = 1;
          playingRef.current = false;
          setPlaying(false);
        }
        if (fillRef.current) fillRef.current.style.width = `${progRef.current * 100}%`;
        if (timeRef.current) timeRef.current.textContent = `${fmtTime(progRef.current, total)} / ${duration}`;
      }
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    init();
    start();
    window.addEventListener('resize', () => { resize(); init(); });
    return () => {
      stop();
      window.removeEventListener('resize', resize);
    };
  }, [theme, title, duration, total]);

  const toggle = () => {
    if (playing) {
      playingRef.current = false;
      setPlaying(false);
    } else {
      if (progRef.current >= 1) {
        progRef.current = 0;
        if (fillRef.current) fillRef.current.style.width = '0%';
        if (timeRef.current) timeRef.current.textContent = `0:00 / ${duration}`;
      }
      playingRef.current = true;
      setPlaying(true);
    }
  };

  const onScrub = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    progRef.current = p;
    if (fillRef.current) fillRef.current.style.width = `${p * 100}%`;
    if (timeRef.current) timeRef.current.textContent = `${fmtTime(p, total)} / ${duration}`;
  };

  return (
    <div className={`vp ${playing ? 'is-playing' : ''}`}>
      <div className="vp__stage">
        <canvas ref={canvasRef} className="vp__canvas" aria-hidden="true" />
        {!playing && (
          <button className="vp__play" onClick={toggle} aria-label="Play trailer" data-cursor="hover">
            <span className="vp__play-ring" />
            <span className="vp__play-tri" />
          </button>
        )}
        <div className="vp__timecode" ref={timeRef}>0:00 / {duration}</div>
        <div className="vp__badge">TRAILER</div>
      </div>
      <div
        className="vp__bar"
        onClick={onScrub}
        role="slider"
        aria-label="Trailer progress"
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
      >
        <span className="vp__bar-fill" ref={fillRef} style={{ width: '0%' }} />
      </div>
    </div>
  );
}
