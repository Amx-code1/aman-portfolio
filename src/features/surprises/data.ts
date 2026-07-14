
import type { AchievementDef, ThemeDef, CollectibleDef } from './types';

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'awaken', title: 'First Breath', desc: 'You stepped into the KAZE studio.', icon: '🌬️' },
  { id: 'konami', title: 'KAZE MODE', desc: '↑↑↓↓←→←→ B A — a legend awakens.', icon: '⚡', secret: true },
  { id: 'collector', title: 'Petal Collector', desc: 'Gathered every drifting sakura.', icon: '🌸', secret: true },
  { id: 'explorer', title: 'Beyond the Veil', desc: 'Found the hidden sanctuary.', icon: '🚪', secret: true },
  { id: 'terminal', title: 'Root Access', desc: 'Summoned the KAZE terminal.', icon: '⌨️', secret: true },
  { id: 'dev', title: 'God Mode', desc: 'Peeked behind the curtain.', icon: '🛠️', secret: true },
  { id: 'chromatic', title: 'Chromatic Shift', desc: 'Unlocked an alternate palette.', icon: '🎨', secret: true },
  { id: 'sakura-master', title: 'Sakura Master', desc: 'Scored 30 in Sakura Catch.', icon: '🏆', secret: true },
  { id: 'hikari', title: 'Daybreak', desc: 'Toggled Hikari (day) mode.', icon: '☀️', secret: true },
  { id: 'otaku', title: 'True Otaku', desc: 'Found a hidden anime reference.', icon: '📺', secret: true },
];

export const THEMES: ThemeDef[] = [
  {
    id: 'cyber',
    name: 'Cyber Twilight',
    swatch: '#00f0ff',
    vars: {},
  },
  {
    id: 'sakura',
    name: 'Sakura Dawn',
    swatch: '#ff5c8a',
    secret: true,
    vars: {
      '--c-cyan': '#ff9ecb',
      '--c-purple': '#ff5c8a',
      '--c-pink': '#ff2d6f',
      '--c-electric': '#ff79b0',
      '--grad-primary': 'linear-gradient(135deg, #ff9ecb, #ff5c8a 48%, #ffd1e8)',
      '--grad-aurora': 'linear-gradient(115deg, #ff5c8a, #ffd1e8, #ff9ecb)',
      '--glow-cyan': '0 0 30px rgba(255, 92, 138, 0.45)',
    },
  },
  {
    id: 'emerald',
    name: 'Jade Storm',
    swatch: '#4ade80',
    secret: true,
    vars: {
      '--c-cyan': '#4ade80',
      '--c-purple': '#10b981',
      '--c-pink': '#34d399',
      '--grad-primary': 'linear-gradient(135deg, #4ade80, #10b981 48%, #a7f3d0)',
      '--grad-aurora': 'linear-gradient(115deg, #10b981, #a7f3d0, #4ade80)',
      '--glow-cyan': '0 0 30px rgba(74, 222, 128, 0.45)',
    },
  },
  {
    id: 'sunset',
    name: 'Neon Sunset',
    swatch: '#f97316',
    secret: true,
    vars: {
      '--c-cyan': '#fbbf24',
      '--c-purple': '#f97316',
      '--c-pink': '#ef4444',
      '--grad-primary': 'linear-gradient(135deg, #fbbf24, #f97316 48%, #ef4444)',
      '--grad-aurora': 'linear-gradient(115deg, #f97316, #ef4444, #fbbf24)',
      '--glow-cyan': '0 0 30px rgba(249, 115, 22, 0.45)',
    },
  },
  {
    id: 'mono',
    name: 'Mono Noir',
    swatch: '#f4f6ff',
    secret: true,
    vars: {
      '--c-cyan': '#f4f6ff',
      '--c-purple': '#a1a3c4',
      '--c-pink': '#ffffff',
      '--grad-primary': 'linear-gradient(135deg, #f4f6ff, #a1a3c4 48%, #ffffff)',
      '--grad-aurora': 'linear-gradient(115deg, #a1a3c4, #ffffff, #f4f6ff)',
      '--glow-cyan': '0 0 30px rgba(244, 246, 255, 0.4)',
    },
  },
];

export const COLLECTIBLES: CollectibleDef[] = [
  { id: 's1', label: 'First Petal' },
  { id: 's2', label: 'Wind Petal' },
  { id: 's3', label: 'Moon Petal' },
  { id: 's4', label: 'Star Petal' },
  { id: 's5', label: 'Dream Petal' },
  { id: 's6', label: 'Final Petal' },
];

export const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];
