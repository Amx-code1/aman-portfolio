
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { SectionHeading } from '../SectionHeading/SectionHeading';
import { SkillOrb } from './SkillOrb';
import { skillCore, skillBranches } from '../../content/skills';
import { prefersReducedMotion } from '../../lib/utils';
import './Skills.css';

function useTween(target: number, duration = 800) {
  const [val, setVal] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setVal(target);
      prev.current = target;
      return;
    }
    let raf = 0;
    const start = performance.now();
    const from = prev.current;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else prev.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

interface LinkDef {
  d: string;
  color: string;
  target: string;
}

function linkPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
}

export function Skills() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<Set<string>>(new Set());

  const leaves = useMemo(() => skillBranches.flatMap((b) => b.nodes), []);
  const total = leaves.length;
  const coreXp = Math.round((active.size / total) * 100);
  const coreDisplay = useTween(coreXp);

  const coreNode = useMemo(() => ({ ...skillCore, xp: coreXp }), [coreXp]);

  const links = useMemo<LinkDef[]>(() => {
    const out: LinkDef[] = [];
    for (const b of skillBranches) {
      out.push({ d: linkPath(skillCore, b.root), color: b.color, target: b.root.id });
      for (const n of b.nodes) {
        out.push({ d: linkPath(b.root, n), color: b.color, target: n.id });
      }
    }
    return out;
  }, []);

  const isLit = (id: string) => hovered === id || active.has(id);

  const toggle = (id: string) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="skills section" id="skills">
      <div className="container">
        <SectionHeading
          index="02"
          title="Arcane Capabilities"
          subtitle="Every craft a power to awaken. Hover to read, tap a node to channel its energy."
        />
        <div className="skills__layout">
          <div className="skilltree" role="group" aria-label="Interactive skill tree">
            <svg className="skilltree__bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <circle className="skilltree__bg-ring" cx="50" cy="50" r="47" />
              <circle className="skilltree__bg-ring skilltree__bg-ring--spin" cx="50" cy="50" r="40" />
              <polygon className="skilltree__bg-poly" points="50,14 83,67 17,67" />
              <circle className="skilltree__bg-ring skilltree__bg-ring--dash" cx="50" cy="50" r="30" />
            </svg>

            <svg className="skilltree__links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {links.map((l, i) => (
                <path
                  key={i}
                  d={l.d}
                  className={`skilltree__link ${isLit(l.target) ? 'is-lit' : ''}`}
                  style={{ stroke: l.color, color: l.color }}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>

            <SkillOrb node={coreNode} variant="core" active={false} displayXp={coreDisplay} onActivate={() => {}} onHover={() => {}} />
            {skillBranches.map((b) => (
              <React.Fragment key={b.id}>
                <SkillOrb node={b.root} variant="root" active={active.has(b.root.id)} onActivate={toggle} onHover={setHovered} />
                {b.nodes.map((n) => (
                  <SkillOrb key={n.id} node={n} variant="leaf" active={active.has(n.id)} onActivate={toggle} onHover={setHovered} />
                ))}
              </React.Fragment>
            ))}
          </div>

          <div className="skills__readout" aria-live="polite">
            <div className="skills__mastery">
              <span className="skills__mastery-label">Core Mastery</span>
              <span className="skills__mastery-val">
                {coreDisplay}
                <span>%</span>
              </span>
              <span className="skills__mastery-sub">
                {active.size} / {total} powers channeled
              </span>
            </div>
            <p className="skills__hint">Tap any node to channel its energy into the core.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
