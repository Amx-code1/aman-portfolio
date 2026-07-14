
import React from 'react';
import type { SkillNode } from '../../content/skills';
import { skillGroups } from '../../content/skills';
import { useCountUp } from '../../hooks/useCountUp';
import { useInView } from '../../hooks/useInView';
import './SkillOrb.css';

type Variant = 'core' | 'root' | 'leaf';

interface Props {
  node: SkillNode;
  variant: Variant;
  active: boolean;
  displayXp?: number;
  onActivate: (id: string) => void;
  onHover: (id: string | null) => void;
}

const R = 40;
const CIRC = 2 * Math.PI * R;

function SkillOrbBase({ node, variant, active, displayXp, onActivate, onHover }: Props) {
  const { ref, inView } = useInView<HTMLButtonElement>({ threshold: 0.35 });
  const counted = useCountUp(node.xp, inView, 1700);
  const xp = displayXp ?? counted;
  const offset = CIRC * (1 - (inView ? node.xp : 0) / 100);

  const isCore = variant === 'core';
  const color = isCore ? '#00f0ff' : skillGroups[node.group].color;
  const tipUp = node.y > 68;
  const tipLeft = node.x < 18;
  const tipRight = node.x > 82;

  return (
    <button
      ref={ref}
      type="button"
      className={[
        'orb',
        `orb--${variant}`,
        tipUp ? 'orb--tip-up' : '',
        tipLeft ? 'orb--tip-left' : '',
        tipRight ? 'orb--tip-right' : '',
        active ? 'is-active' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ left: `${node.x}%`, top: `${node.y}%`, ['--orb-color' as any]: color }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.id)}
      onBlur={() => onHover(null)}
      onClick={() => onActivate(node.id)}
      aria-pressed={active}
      data-cursor="hover"
      aria-label={`${node.name}, ${node.xp} percent mastery`}
    >
      <span className="orb__halo" aria-hidden="true" />
      <span className="orb__particles" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="orb__circle">
        <svg className="orb__magic" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="orb__ring orb__ring--outer" cx="50" cy="50" r="47" />
          <g className="orb__runes">
            {Array.from({ length: 12 }).map((_, i) => (
              <rect key={i} x="49" y="3.5" width="2" height="6" transform={`rotate(${i * 30} 50 50)`} />
            ))}
          </g>
          <circle className="orb__ring orb__ring--inner" cx="50" cy="50" r="34" />
          <polygon className="orb__poly" points="50,17 78,66 22,66" />
          <circle
            className="orb__ring orb__ring--progress"
            cx="50"
            cy="50"
            r={R}
            style={{ strokeDasharray: CIRC, strokeDashoffset: offset }}
          />
        </svg>
        <span className="orb__core">
          <span className="orb__symbol">{node.symbol}</span>
        </span>
      </span>
      <span className="orb__info">
        <span className="orb__name">{node.name}</span>
        <span className="orb__xp">
          <span className="orb__xp-val">{xp}</span>
          <span className="orb__xp-pct">%</span>
          <span className="orb__xp-tag">XP</span>
        </span>
        <span className="orb__desc">{node.desc}</span>
      </span>
    </button>
  );
}

export const SkillOrb = React.memo(SkillOrbBase);
