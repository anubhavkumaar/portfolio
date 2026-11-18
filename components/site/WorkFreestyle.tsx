'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PROJECTS } from '@/content/portfolio';
import { FREE_TILES, GROUP_COLOR, caseHref, markFrom } from '@/content/work-layout';
import { ViewSwitch, type WorkView } from './ViewSwitch';

const OFF = 120;

/**
 * Freestyle: all 20 covers scattered at different sizes with no grouping
 * (Freestyle.dc.html). Hovering one dims and greys the rest, lifts that one,
 * and opens an info card beside it. Click opens the case study.
 */
export function WorkFreestyle({ animate, onView }: { animate: boolean; onView: (v: WorkView) => void }) {
  const [hot, setHot] = useState(-1);
  const t = hot >= 0 ? FREE_TILES[hot] : null;
  const p = t ? PROJECTS[t.id] : null;
  const toRight = t ? t.x + t.w / 2 < 50 : true;

  return (
    <div className="wf" data-animate={animate} onMouseLeave={() => setHot(-1)}>
      <div className="wf__glow" aria-hidden="true" />

      <div className="wf__bar">
        <p className="wf__note">20 PROJECTS, NO ORDER. POINT AT ONE.</p>
        <ViewSwitch view="freestyle" onView={onView} />
      </div>

      <div className="wf__field">
        {FREE_TILES.map((c, i) => {
          const proj = PROJECTS[c.id];
          const on = i === hot;
          const any = hot >= 0;
          return (
            <Link
              key={c.id}
              href={caseHref(c.id)}
              className="wf__tile"
              aria-label={proj.title}
              onClick={() => markFrom('freestyle')}
              onMouseEnter={() => setHot(i)}
              onFocus={() => setHot(i)}
              onBlur={() => setHot(-1)}
              style={{
                left: `${c.x}%`,
                top: `${c.y + OFF}px`,
                width: `${c.w}%`,
                height: `${c.h}px`,
                animationDelay: `${(0.15 + (i % 7) * 0.06 + Math.floor(i / 7) * 0.12).toFixed(2)}s`,
              }}
            >
              <span
                className="wf__img"
                style={{
                  opacity: any && !on ? 'var(--w-dim)' : 1,
                  filter: any && !on ? 'grayscale(.6)' : 'none',
                  transform: on ? 'scale(1.035)' : 'none',
                  boxShadow: on ? 'var(--w-hot-ring)' : 'none',
                }}
              >
                <img src={proj.cover} alt="" loading="lazy" decoding="async" />
                <span className="wf__chip">
                  <span className="wf__cdot" style={{ background: GROUP_COLOR[proj.group] }} />
                  {String(i + 1).padStart(2, '0')}
                </span>
              </span>
            </Link>
          );
        })}

        {t && p && (
          <div
            className="wf__card"
            aria-hidden="true"
            style={{
              left: toRight ? `calc(${t.x + t.w}% + 18px)` : `calc(${t.x}% - 438px)`,
              top: `${Math.max(t.y + OFF - 30, 140)}px`,
            }}
          >
            <div className="wf__main">
              <span className="wf__meta">
                <span>{String(hot + 1).padStart(2, '0')} / 20</span>
                <span>{p.year}</span>
              </span>
              <span className="wf__ctitle">{p.title}</span>
              <span className="wf__lede">{p.lede}</span>
              <span className="wf__hint">Click the image to open the case study</span>
            </div>
            <div className="wf__chips">
              <span className="wf__chipg">
                <span className="wf__cdot wf__cdot--lg" style={{ background: GROUP_COLOR[p.group] }} />
                {p.group}
              </span>
              {p.stack.slice(0, 3).map((s) => (
                <span key={s} className="wf__chips-s">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
