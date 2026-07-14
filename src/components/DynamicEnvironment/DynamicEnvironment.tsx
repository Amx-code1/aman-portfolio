
import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../lib/utils';
import './DynamicEnvironment.css';

type RGB = [number, number, number];

interface Scene {
  t: number;
  name: string;
  skyTop: RGB;
  skyBot: RGB;
  sunH: number;
  sunX: number;
  sunVis: number;
  moonH: number;
  moonX: number;
  moonVis: number;
  stars: number;
  galaxy: number;
  cherry: number;
  leaves: number;
  firefly: number;
  snow: number;
  rain: number;
  cloud: number;
  fog: number;
  light: number;
  cityLight: number;
}

const SCENES: Scene[] = [
  {
    t: 0.0, name: 'Dawn',
    skyTop: [26, 16, 56], skyBot: [255, 138, 179],
    sunH: 0.14, sunX: 0.16, sunVis: 1,
    moonH: 0.6, moonX: 0.8, moonVis: 0.15,
    stars: 0.25, galaxy: 0, cherry: 1, leaves: 0, firefly: 0, snow: 0, rain: 0,
    cloud: 0.45, fog: 0.35, light: 0.5, cityLight: 0.1,
  },
  {
    t: 0.28, name: 'Day',
    skyTop: [30, 95, 207], skyBot: [126, 215, 255],
    sunH: 0.74, sunX: 0.5, sunVis: 1,
    moonH: 0.7, moonX: 0.85, moonVis: 0,
    stars: 0, galaxy: 0, cherry: 0.35, leaves: 0.05, firefly: 0, snow: 0, rain: 0.12,
    cloud: 1, fog: 0.15, light: 1, cityLight: 0,
  },
  {
    t: 0.52, name: 'Dusk',
    skyTop: [42, 27, 77], skyBot: [255, 126, 82],
    sunH: 0.13, sunX: 0.84, sunVis: 0.85,
    moonH: 0.62, moonX: 0.2, moonVis: 0.25,
    stars: 0.3, galaxy: 0.12, cherry: 0, leaves: 0.6, firefly: 0.85, snow: 0, rain: 0,
    cloud: 0.5, fog: 0.4, light: 0.45, cityLight: 0.45,
  },
  {
    t: 0.76, name: 'Night',
    skyTop: [5, 6, 15], skyBot: [19, 26, 58],
    sunH: 0, sunX: 0.5, sunVis: 0,
    moonH: 0.74, moonX: 0.7, moonVis: 1,
    stars: 1, galaxy: 0.45, cherry: 0, leaves: 0.05, firefly: 0.5, snow: 0.3, rain: 0,
    cloud: 0.22, fog: 0.3, light: 0.05, cityLight: 1,
  },
  {
    t: 1.0, name: 'Galaxy',
    skyTop: [2, 3, 10], skyBot: [12, 9, 34],
    sunH: 0, sunX: 0.5, sunVis: 0,
    moonH: 0.55, moonX: 0.25, moonVis: 0.6,
    stars: 1, galaxy: 1, cherry: 0, leaves: 0, firefly: 0.1, snow: 0.6, rain: 0,
    cloud: 0.12, fog: 0.2, light: 0, cityLight: 0.9,
  },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpRGB = (a: RGB, b: RGB, t: number): RGB => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];
const rgb = (c: RGB, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

function sampleScene(t: number): Scene {
  t = Math.max(0, Math.min(1, t));
  let i = 0;
  while (i < SCENES.length - 1 && t > SCENES[i + 1].t) i++;
  const a = SCENES[i];
  const b = SCENES[Math.min(i + 1, SCENES.length - 1)];
  const span = b.t - a.t || 1;
  const f = Math.max(0, Math.min(1, (t - a.t) / span));
  return {
    t,
    name: f < 0.5 ? a.name : b.name,
    skyTop: lerpRGB(a.skyTop, b.skyTop, f),
    skyBot: lerpRGB(a.skyBot, b.skyBot, f),
    sunH: lerp(a.sunH, b.sunH, f),
    sunX: lerp(a.sunX, b.sunX, f),
    sunVis: lerp(a.sunVis, b.sunVis, f),
    moonH: lerp(a.moonH, b.moonH, f),
    moonX: lerp(a.moonX, b.moonX, f),
    moonVis: lerp(a.moonVis, b.moonVis, f),
    stars: lerp(a.stars, b.stars, f),
    galaxy: lerp(a.galaxy, b.galaxy, f),
    cherry: lerp(a.cherry, b.cherry, f),
    leaves: lerp(a.leaves, b.leaves, f),
    firefly: lerp(a.firefly, b.firefly, f),
    snow: lerp(a.snow, b.snow, f),
    rain: lerp(a.rain, b.rain, f),
    cloud: lerp(a.cloud, b.cloud, f),
    fog: lerp(a.fog, b.fog, f),
    light: lerp(a.light, b.light, f),
    cityLight: lerp(a.cityLight, b.cityLight, f),
  };
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  ph: number;
  hue: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function makeGlow(size: number, r: number, g: number, b: number, inner = 0.9): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d')!;
  const grd = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, `rgba(${r},${g},${b},${inner})`);
  grd.addColorStop(0.4, `rgba(${r},${g},${b},${inner * 0.35})`);
  grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
  x.fillStyle = grd;
  x.fillRect(0, 0, size, size);
  return c;
}

export function DynamicEnvironment() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sceneName, setSceneName] = useState('Dawn');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    const reduced = prefersReducedMotion();

    let W = 0;
    let H = 0;
    let DPR = 1;
    let isSmall = false;
    let time = 0;
    let raf = 0;
    let last = 0;
    let running = false;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const scrollRef = { v: 0 };
    let lastName = 'Dawn';

    // ---- data pools ----
    let stars: { x: number; y: number; r: number; ph: number; sp: number }[] = [];
    let mountains: number[][] = [];
    let cityBuildings: { x: number; w: number; h: number; cols: number; rows: number; wins: { c: number; r: number }[] }[] = [];
    let islands: { x: number; y: number; s: number; ph: number }[] = [];
    let cloudSprites: { x: number; y: number; s: number; sp: number; ph: number }[] = [];
    let fogSprites: { x: number; y: number; size: number; sp: number }[] = [];
    let rain: Particle[] = [];
    let snow: Particle[] = [];
    let leaves: Particle[] = [];
    let cherry: Particle[] = [];
    let fire: Particle[] = [];
    let dust: Particle[] = [];

    let galaxySprite: HTMLCanvasElement | null = null;
    let cloudSprite: HTMLCanvasElement | null = null;
    let fogSprite: HTMLCanvasElement | null = null;
    let starGlow: HTMLCanvasElement | null = null;
    let fireGlow: HTMLCanvasElement | null = null;
    let dustGlow: HTMLCanvasElement | null = null;

    // ---- builders ----
    function mkRain(): Particle {
      return { x: Math.random(), y: Math.random(), vx: rand(-0.04, -0.01), vy: rand(1.2, 1.9), rot: 0, vr: 0, size: rand(0.018, 0.04), ph: 0, hue: 0 };
    }
    function mkSnow(): Particle {
      return { x: Math.random(), y: Math.random(), vx: rand(-0.01, 0.01), vy: rand(0.05, 0.12), rot: 0, vr: 0, size: rand(0.003, 0.006), ph: Math.random() * 6.28, hue: 0 };
    }
    function mkLeaf(): Particle {
      return { x: Math.random(), y: Math.random(), vx: rand(-0.02, 0.02), vy: rand(0.08, 0.16), rot: Math.random() * 6.28, vr: rand(-1.2, 1.2), size: rand(0.012, 0.022), ph: Math.random() * 6.28, hue: rand(12, 42) };
    }
    function mkCherry(): Particle {
      return { x: Math.random(), y: Math.random(), vx: rand(-0.02, 0.02), vy: rand(0.05, 0.11), rot: Math.random() * 6.28, vr: rand(-1, 1), size: rand(0.01, 0.018), ph: Math.random() * 6.28, hue: 0 };
    }
    function mkFire(): Particle {
      return { x: Math.random(), y: rand(0.3, 0.9), vx: rand(-0.01, 0.01), vy: rand(-0.01, 0.01), rot: 0, vr: 0, size: rand(0.003, 0.006), ph: Math.random() * 6.28, hue: 0 };
    }
    function mkDust(): Particle {
      return { x: Math.random(), y: Math.random(), vx: rand(-0.01, 0.01), vy: rand(-0.04, -0.01), rot: 0, vr: 0, size: rand(0.0015, 0.004), ph: Math.random() * 6.28, hue: 0 };
    }

    function makeRange(n: number, max: number): number[] {
      const a: number[] = [];
      let h = max * 0.5;
      for (let i = 0; i < n; i++) {
        h += (Math.random() - 0.5) * max * 0.5;
        h = Math.max(0.1, Math.min(max, h));
        a.push(h);
      }
      return a;
    }

    function buildCloudSprite(): HTMLCanvasElement {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 128;
      const g = c.getContext('2d')!;
      for (let i = 0; i < 7; i++) {
        const x = 40 + Math.random() * 176;
        const y = 48 + Math.random() * 32;
        const r = 30 + Math.random() * 42;
        const grd = g.createRadialGradient(x, y, 0, x, y, r);
        grd.addColorStop(0, 'rgba(255,255,255,0.5)');
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = grd;
        g.beginPath();
        g.arc(x, y, r, 0, 6.28);
        g.fill();
      }
      return c;
    }

    function buildFogSprite(): HTMLCanvasElement {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const g = c.getContext('2d')!;
      const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
      grd.addColorStop(0, 'rgba(200,210,255,0.5)');
      grd.addColorStop(1, 'rgba(200,210,255,0)');
      g.fillStyle = grd;
      g.fillRect(0, 0, 256, 256);
      return c;
    }

    function buildGalaxy() {
      const G = Math.ceil(Math.max(W, H) * 1.15);
      const c = document.createElement('canvas');
      c.width = c.height = G;
      const g = c.getContext('2d')!;
      const cx = G / 2;
      const cy = G / 2;
      const arms = 4;
      const starsN = isSmall ? 600 : 1400;
      for (let i = 0; i < starsN; i++) {
        const arm = i % arms;
        const dist = Math.pow(Math.random(), 0.6) * (G * 0.46);
        const ang = arm * ((Math.PI * 2) / arms) + dist / (G * 0.12) + (Math.random() - 0.5) * 0.5;
        const x = cx + Math.cos(ang) * dist + (Math.random() - 0.5) * 14;
        const y = cy + Math.sin(ang) * dist * 0.7 + (Math.random() - 0.5) * 14;
        const col = Math.random() < 0.5 ? '255,255,255' : Math.random() < 0.5 ? '0,240,255' : '155,93,229';
        const al = 0.2 + Math.random() * 0.6;
        const s = Math.random() < 0.1 ? 2 : 1;
        g.fillStyle = `rgba(${col},${al})`;
        g.fillRect(x, y, s, s);
      }
      const core = g.createRadialGradient(cx, cy, 0, cx, cy, G * 0.18);
      core.addColorStop(0, 'rgba(255,245,230,0.9)');
      core.addColorStop(0.4, 'rgba(255,180,220,0.4)');
      core.addColorStop(1, 'rgba(255,180,220,0)');
      g.fillStyle = core;
      g.beginPath();
      g.arc(cx, cy, G * 0.18, 0, 6.28);
      g.fill();
      galaxySprite = c;
    }

    function buildStatics() {
      stars = Array.from({ length: isSmall ? 130 : 240 }, () => ({
        x: Math.random(),
        y: Math.random() * 0.82,
        r: 0.5 + Math.random() * 1.6,
        ph: Math.random() * 6.28,
        sp: 0.4 + Math.random() * 1.4,
      }));
      mountains = [makeRange(9, 0.4), makeRange(13, 0.58), makeRange(17, 0.78)];
      cityBuildings = [];
      let x = -0.02;
      while (x < 1.02) {
        const w = 0.014 + Math.random() * 0.04;
        const h = 0.06 + Math.random() * 0.2;
        const cols = Math.max(2, Math.floor(w / 0.012));
        const rows = Math.max(3, Math.floor(h / 0.02));
        const wins: { c: number; r: number }[] = [];
        for (let r = 0; r < rows; r++)
          for (let c = 0; c < cols; c++) if (Math.random() < 0.55) wins.push({ c, r });
        cityBuildings.push({ x, w, h, cols, rows, wins });
        x += w + 0.004 + Math.random() * 0.02;
      }
      islands = [
        { x: 0.2, y: 0.32, s: 0.95, ph: 0 },
        { x: 0.76, y: 0.22, s: 0.7, ph: 2.1 },
        { x: 0.52, y: 0.52, s: 0.5, ph: 4.2 },
      ];
      cloudSprites = Array.from({ length: 5 }, () => ({
        x: Math.random(),
        y: 0.04 + Math.random() * 0.4,
        s: 0.6 + Math.random() * 0.8,
        sp: rand(0.003, 0.012),
        ph: Math.random() * 6.28,
      }));
      fogSprites = Array.from({ length: 3 }, () => ({
        x: Math.random(),
        y: 0.5 + Math.random() * 0.4,
        size: 0.3 + Math.random() * 0.2,
        sp: rand(0.002, 0.006),
      }));
      rain = Array.from({ length: isSmall ? 70 : 130 }, mkRain);
      snow = Array.from({ length: isSmall ? 50 : 90 }, mkSnow);
      leaves = Array.from({ length: isSmall ? 22 : 42 }, mkLeaf);
      cherry = Array.from({ length: isSmall ? 28 : 52 }, mkCherry);
      fire = Array.from({ length: isSmall ? 22 : 42 }, mkFire);
      dust = Array.from({ length: isSmall ? 26 : 46 }, mkDust);
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(W * DPR));
      canvas.height = Math.max(1, Math.floor(H * DPR));
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      isSmall = W < 760;
      buildGalaxy();
    }

    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      scrollRef.v = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
    }
    function onMove(e: MouseEvent) {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    }
    function onVis() {
      if (document.hidden) stop();
      else if (!reduced) start();
    }

    function updateP(p: Particle, dt: number, type: string) {
      if (type === 'rain') {
        p.y += p.vy * dt;
        p.x += p.vx * dt;
        if (p.y > 1.1) {
          p.y = -0.1;
          p.x = Math.random();
        }
      } else if (type === 'snow') {
        p.y += p.vy * dt;
        p.ph += dt;
        p.x += Math.sin(p.ph) * 0.0009 + p.vx * dt;
        if (p.y > 1.05) {
          p.y = -0.05;
          p.x = Math.random();
        }
      } else if (type === 'leaf' || type === 'cherry') {
        p.y += p.vy * dt;
        p.ph += dt;
        p.rot += p.vr * dt;
        p.x += Math.sin(p.ph * 1.3) * 0.0007 + p.vx * dt;
        if (p.y > 1.05) {
          p.y = -0.05;
          p.x = Math.random();
        }
      } else if (type === 'fire') {
        p.ph += dt;
        p.x += Math.sin(p.ph * 0.7) * 0.001 + p.vx * dt;
        p.y += Math.cos(p.ph * 0.5) * 0.0008 + p.vy * dt;
        if (p.x < 0 || p.x > 1 || p.y < 0.1 || p.y > 1) {
          p.x = Math.random();
          p.y = rand(0.3, 0.85);
        }
      } else if (type === 'dust') {
        p.y += p.vy * dt;
        p.ph += dt;
        p.x += Math.sin(p.ph) * 0.0004 + p.vx * dt;
        if (p.y < -0.05) {
          p.y = 1.05;
          p.x = Math.random();
        }
        if (p.x > 1) p.x = 0;
        if (p.x < 0) p.x = 1;
      }
    }

    function drawIsland(x: number, y: number, sc: number) {
      ctx.fillStyle = 'rgb(18,16,30)';
      ctx.beginPath();
      ctx.moveTo(x - 60 * sc, y);
      ctx.quadraticCurveTo(x - 30 * sc, y + 50 * sc, x, y + 70 * sc);
      ctx.quadraticCurveTo(x + 30 * sc, y + 50 * sc, x + 60 * sc, y);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgb(40,90,70)';
      ctx.beginPath();
      ctx.ellipse(x, y, 60 * sc, 16 * sc, 0, 0, 6.28);
      ctx.fill();
      ctx.fillStyle = 'rgb(22,62,52)';
      ctx.fillRect(x - 2 * sc, y - 30 * sc, 4 * sc, 30 * sc);
      ctx.beginPath();
      ctx.arc(x, y - 38 * sc, 16 * sc, 0, 6.28);
      ctx.fill();
    }

    function drawTemple(cx: number, baseY: number, scale: number, lantern: number) {
      ctx.save();
      ctx.fillStyle = 'rgba(5,5,14,0.97)';
      const w = 90 * scale;
      const h = 14 * scale;
      ctx.fillRect(cx - w / 2, baseY - h, w, h);
      let ty = baseY - h;
      let tw = w * 1.5;
      for (let i = 0; i < 3; i++) {
        const th = 44 * scale;
        ctx.fillRect(cx - tw * 0.28, ty - th, tw * 0.56, th);
        ctx.beginPath();
        ctx.moveTo(cx - tw * 0.5, ty - th);
        ctx.quadraticCurveTo(cx - tw * 0.28, ty - th - 10 * scale, cx, ty - th - 16 * scale);
        ctx.quadraticCurveTo(cx + tw * 0.28, ty - th - 10 * scale, cx + tw * 0.5, ty - th);
        ctx.closePath();
        ctx.fill();
        ty -= th + 8 * scale;
        tw *= 0.7;
      }
      ctx.fillRect(cx - 2 * scale, ty - 20 * scale, 4 * scale, 20 * scale);
      if (lantern > 0.02) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = lantern;
        const positions: [number, number][] = [
          [cx - w * 0.5, baseY - h - 2 * scale],
          [cx + w * 0.5, baseY - h - 2 * scale],
          [cx, baseY - h - 30 * scale],
        ];
        for (const [lx, ly] of positions) {
          const r = 9 * scale;
          const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, r * 2.4);
          g.addColorStop(0, 'rgba(255,120,160,0.95)');
          g.addColorStop(1, 'rgba(255,120,160,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(lx, ly, r * 2.4, 0, 6.28);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    function drawPool(pool: Particle[], type: string, s: Scene, dt: number) {
      const w =
        type === 'rain'
          ? s.rain
          : type === 'snow'
          ? s.snow
          : type === 'leaves'
          ? s.leaves
          : type === 'cherry'
          ? s.cherry
          : type === 'fire'
          ? s.firefly
          : 0;
      if (type !== 'dust' && w <= 0.01) return;

      ctx.save();
      if (type === 'fire' || type === 'dust') ctx.globalCompositeOperation = 'lighter';
      for (const p of pool) {
        updateP(p, dt, type);
        const px = p.x * W;
        const py = p.y * H;
        if (type === 'rain') {
          ctx.globalAlpha = 0.5 * w;
          ctx.strokeStyle = 'rgba(180,215,255,1)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px - p.vx * 0.06 * W, py - p.vy * 0.06 * H);
          ctx.stroke();
        } else if (type === 'snow') {
          ctx.globalAlpha = 0.9 * w;
          ctx.fillStyle = '#eaf2ff';
          ctx.beginPath();
          ctx.arc(px, py, p.size * H * 0.5 + 0.5, 0, 6.28);
          ctx.fill();
        } else if (type === 'leaf') {
          ctx.globalAlpha = w;
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(p.rot);
          ctx.scale(1, Math.sin(p.ph) * 0.4 + 0.6);
          ctx.fillStyle = `hsl(${p.hue},70%,52%)`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * H * 0.5, p.size * H * 0.25, 0, 0, 6.28);
          ctx.fill();
          ctx.restore();
        } else if (type === 'cherry') {
          ctx.globalAlpha = w;
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(p.rot);
          ctx.fillStyle = 'rgba(255,150,190,0.95)';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * H * 0.5, p.size * H * 0.28, 0, 0, 6.28);
          ctx.fill();
          ctx.restore();
        } else if (type === 'fire') {
          const a = w * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(p.ph * 3)));
          ctx.globalAlpha = a;
          const r = p.size * H * 1.5;
          if (fireGlow) ctx.drawImage(fireGlow, px - r, py - r, r * 2, r * 2);
        } else if (type === 'dust') {
          const a = 0.3 * (0.4 + 0.6 * Math.sin(p.ph));
          ctx.globalAlpha = a;
          const r = p.size * H * 1.5;
          if (dustGlow) ctx.drawImage(dustGlow, px - r, py - r, r * 2, r * 2);
        }
      }
      ctx.restore();
    }

    function draw(s: Scene, dt: number) {
      const horizon = H * 0.8;
      const shoreY = H * 0.86;

      // sky
      const skyG = ctx.createLinearGradient(0, 0, 0, H);
      skyG.addColorStop(0, rgb(s.skyTop));
      skyG.addColorStop(0.55, rgb(lerpRGB(s.skyTop, s.skyBot, 0.5)));
      skyG.addColorStop(1, rgb(s.skyBot));
      ctx.fillStyle = skyG;
      ctx.fillRect(0, 0, W, H);

      // galaxy
      if (s.galaxy > 0.01 && galaxySprite) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = s.galaxy;
        const gx = W * 0.5;
        const gy = H * 0.34;
        const gs = Math.max(W, H) * 1.15;
        ctx.translate(gx, gy);
        ctx.rotate(time * 0.006);
        ctx.drawImage(galaxySprite, -gs / 2, -gs / 2, gs, gs);
        ctx.restore();
      }

      // stars
      if (s.stars > 0.01 && starGlow) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (const st of stars) {
          const a = Math.max(0, 0.4 + 0.6 * Math.sin(time * st.sp + st.ph)) * s.stars;
          if (a <= 0.02) continue;
          ctx.globalAlpha = a;
          const px = st.x * W + mouse.x * 6;
          const py = st.y * H + mouse.y * 4;
          const r = st.r * 4;
          ctx.drawImage(starGlow, px - r, py - r, r * 2, r * 2);
        }
        ctx.restore();
      }

      // sun
      if (s.sunVis > 0.01) {
        const sx = W * s.sunX + mouse.x * 8;
        const sy = horizon - s.sunH * (H * 0.62) + mouse.y * 6;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = s.sunVis;
        const R = Math.max(W, H) * 0.5;
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 0.5);
        sg.addColorStop(0, 'rgba(255,250,235,0.95)');
        sg.addColorStop(0.06, 'rgba(255,230,180,0.8)');
        sg.addColorStop(0.25, `rgba(255,180,120,${0.3 * s.sunVis})`);
        sg.addColorStop(1, 'rgba(255,160,100,0)');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(sx, sy, R * 0.5, 0, 6.28);
        ctx.fill();
        ctx.restore();
      }

      // moon
      if (s.moonVis > 0.01) {
        const sx = W * s.moonX + mouse.x * 8;
        const sy = horizon - s.moonH * (H * 0.62) + mouse.y * 6;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = s.moonVis;
        const R = Math.max(W, H) * 0.22;
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 0.5);
        sg.addColorStop(0, 'rgba(225,232,255,0.95)');
        sg.addColorStop(0.4, 'rgba(180,200,255,0.5)');
        sg.addColorStop(1, 'rgba(160,180,255,0)');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(sx, sy, R * 0.5, 0, 6.28);
        ctx.fill();
        ctx.restore();
      }

      // light rays
      if (s.light > 0.2 && s.sunVis > 0.01) {
        const sx = W * s.sunX + mouse.x * 8;
        const sy = horizon - s.sunH * (H * 0.62) + mouse.y * 6;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = s.light * 0.12 * s.sunVis;
        for (let i = 0; i < 3; i++) {
          const ang = -0.15 + i * 0.15 + Math.sin(time * 0.1 + i) * 0.03;
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(ang);
          const len = H * 1.2;
          const w = W * 0.06 * (1 + i * 0.3);
          const lg = ctx.createLinearGradient(0, 0, 0, len);
          lg.addColorStop(0, 'rgba(255,240,210,0.9)');
          lg.addColorStop(1, 'rgba(255,240,210,0)');
          ctx.fillStyle = lg;
          ctx.beginPath();
          ctx.moveTo(-w / 2, 0);
          ctx.lineTo(w / 2, 0);
          ctx.lineTo(w * 2, len);
          ctx.lineTo(-w * 2, len);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      }

      // clouds
      if (s.cloud > 0.01 && cloudSprite) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = s.cloud;
        for (const c of cloudSprites) {
          c.x += c.sp * dt;
          if (c.x > 1.2) c.x = -0.2;
          const cx = c.x * W + mouse.x * 16;
          const cy = c.y * H + mouse.y * 10;
          const cw = W * 0.3 * c.s;
          const ch = W * 0.13 * c.s;
          ctx.drawImage(cloudSprite, cx - cw / 2, cy - ch / 2, cw, ch);
        }
        ctx.restore();
      }

      // mountains + ground
      mountains.forEach((range, li) => {
        ctx.save();
        ctx.translate(mouse.x * (li + 1) * 4, mouse.y * 4 + scrollRef.v * 20 * (li + 1));
        const col = lerpRGB([24, 22, 48], [6, 6, 14], li / 2);
        ctx.fillStyle = rgb(col, 0.92 - li * 0.02);
        ctx.beginPath();
        ctx.moveTo(0, horizon + 2);
        const n = range.length;
        for (let i = 0; i < n; i++) {
          const x = (i / (n - 1)) * W;
          const y = horizon - range[i] * horizon * 0.55;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, horizon + 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
      ctx.fillStyle = rgb(lerpRGB([14, 12, 28], [6, 6, 14], 0.5), 1);
      ctx.fillRect(0, horizon, W, shoreY - horizon);

      // city
      ctx.save();
      ctx.translate(mouse.x * 10, scrollRef.v * 30);
      const cityCol: RGB = [6, 6, 16];
      ctx.fillStyle = rgb(cityCol, 0.96);
      for (const b of cityBuildings) {
        const bx = b.x * W;
        const bw = b.w * W;
        const bh = b.h * H;
        const by = shoreY - bh;
        ctx.fillRect(bx, by, bw, bh);
        if (s.cityLight > 0.05) {
          ctx.fillStyle = `rgba(255,210,120,${s.cityLight})`;
          const ww = (bw * 0.6) / b.cols;
          const wh = (bh * 0.7) / b.rows;
          for (const win of b.wins) {
            ctx.fillRect(
              bx + bw * 0.18 + win.c * ((bw * 0.64) / b.cols),
              by + bh * 0.12 + win.r * ((bh * 0.74) / b.rows),
              ww,
              wh
            );
          }
          ctx.fillStyle = rgb(cityCol, 0.96);
        }
      }
      ctx.restore();

      // temple
      drawTemple(
        W * 0.5,
        shoreY,
        Math.min(W, H) * 0.0016,
        Math.min(1, s.cityLight * 0.8 + s.moonVis * 0.4)
      );

      // floating islands
      islands.forEach((isl, idx) => {
        const bob = Math.sin(time * 0.6 + isl.ph) * 6;
        const ix = isl.x * W + mouse.x * 22 * (idx + 1);
        const iy = isl.y * H + bob - scrollRef.v * 60 * (idx + 1) * 0.4;
        drawIsland(ix, iy, isl.s * Math.min(W, H) * 0.0016);
      });

      // water
      const waterTop = shoreY;
      const topC = lerpRGB(s.skyBot, [20, 30, 60], 0.3);
      const wg = ctx.createLinearGradient(0, waterTop, 0, H);
      wg.addColorStop(0, rgb(topC));
      wg.addColorStop(1, rgb([4, 6, 16]));
      ctx.fillStyle = wg;
      ctx.fillRect(0, waterTop, W, H - waterTop);

      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const yy = waterTop + ((i + 1) * (H - waterTop)) / 6;
        ctx.beginPath();
        for (let xx = 0; xx <= W; xx += 20) {
          const yo = Math.sin(xx * 0.02 + time * 1.5 + i) * 2;
          if (xx === 0) ctx.moveTo(xx, yy + yo);
          else ctx.lineTo(xx, yy + yo);
        }
        ctx.stroke();
      }
      if (s.sunVis > 0.01) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = s.sunVis * 0.4;
        const sx = W * s.sunX;
        const rg = ctx.createLinearGradient(0, waterTop, 0, H);
        rg.addColorStop(0, 'rgba(255,220,170,0.8)');
        rg.addColorStop(1, 'rgba(255,200,150,0)');
        ctx.fillStyle = rg;
        ctx.fillRect(sx - W * 0.04, waterTop, W * 0.08, H - waterTop);
        ctx.restore();
      }
      if (s.moonVis > 0.01) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = s.moonVis * 0.35;
        const sx = W * s.moonX;
        const rg = ctx.createLinearGradient(0, waterTop, 0, H);
        rg.addColorStop(0, 'rgba(200,220,255,0.8)');
        rg.addColorStop(1, 'rgba(200,220,255,0)');
        ctx.fillStyle = rg;
        ctx.fillRect(sx - W * 0.03, waterTop, W * 0.06, H - waterTop);
        ctx.restore();
      }

      // fog
      if (s.fog > 0.01 && fogSprite) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = s.fog;
        for (const f of fogSprites) {
          f.x += f.sp * dt;
          if (f.x > 1.2) f.x = -0.2;
          const fx = f.x * W;
          const fy = f.y * H + mouse.y * 8;
          const fw = f.size * W;
          const fh = f.size * H;
          ctx.drawImage(fogSprite, fx - fw / 2, fy - fh / 2, fw, fh);
        }
        ctx.restore();
      }

      // particles
      drawPool(rain, 'rain', s, dt);
      drawPool(snow, 'snow', s, dt);
      drawPool(leaves, 'leaf', s, dt);
      drawPool(cherry, 'cherry', s, dt);
      drawPool(fire, 'fire', s, dt);
      drawPool(dust, 'dust', s, dt);

      // scene label sync
      if (s.name !== lastName) {
        lastName = s.name;
        setSceneName(s.name);
      }
    }

    function frame(now: number) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000) || 0;
      last = now;
      time += dt;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      draw(sampleScene(scrollRef.v), dt);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    // init sprites + data
    starGlow = makeGlow(16, 255, 255, 255, 0.9);
    fireGlow = makeGlow(32, 255, 238, 170, 0.95);
    dustGlow = makeGlow(16, 180, 220, 255, 0.8);
    cloudSprite = buildCloudSprite();
    fogSprite = buildFogSprite();
    buildStatics();
    resize();
    onScroll();

    if (reduced) {
      const redraw = () => {
        onScroll();
        draw(sampleScene(scrollRef.v), 0);
      };
      redraw();
      window.addEventListener('resize', () => {
        resize();
        redraw();
      });
      window.addEventListener('scroll', redraw, { passive: true });
      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('scroll', redraw);
      };
    }

    draw(sampleScene(scrollRef.v), 0);
    start();

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="env-canvas" aria-hidden="true" />
      <div className="env-overlay" aria-hidden="true" />
      <div className="env-label" aria-hidden="true">
        {sceneName}
      </div>
    </>
  );
}
