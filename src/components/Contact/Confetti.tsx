
import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/utils';
import './Confetti.css';

interface ConfettiProps {
  fire: boolean;
  colors?: string[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  size: number;
  color: string;
  shape: 'rect' | 'circle';
  life: number;
}

export function Confetti({
  fire,
  colors = ['#00f0ff', '#9b5de5', '#ff5c8a', '#f4f6ff', '#4cc9f0'],
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (!fire || prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height * 0.38;
    const particles: Particle[] = [];
    for (let i = 0; i < 170; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 10;
      particles.push({
        x: cx + (Math.random() - 0.5) * 50,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 7,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 0.32,
        size: 4 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
        life: 1,
      });
    }
    particlesRef.current = particles;

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000) || 0;
      last = now;
      ctx.clearRect(0, 0, w, h);
      let alive = 0;
      for (const p of particlesRef.current) {
        p.vy += 19 * dt;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        p.life -= dt * 0.32;
        if (p.life > 0) alive++;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      if (alive > 0) rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [fire, colors]);

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}
