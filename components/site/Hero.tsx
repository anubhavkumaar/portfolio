'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { profile } from '@/content/profile';
import { scrollToId } from './SmoothScroll';
import { MagneticButton } from '@/components/amicro/magnetic-button';

const LightField = dynamic(() => import('./LightField').then((m) => m.LightField), { ssr: false });

// The console and the SmoothUI primitives it pulls in are the heaviest script
// above the fold. They arrive after the page is interactive, behind a shell of
// the same size, so the name and the lede paint first and nothing shifts.
const HeroConsole = dynamic(() => import('@/app/hero-console').then((m) => m.HeroConsole), {
  ssr: false,
  loading: () => (
    <div className="glass glass--lit console-shell" aria-hidden="true">
      <div className="console-shell__head">
        <span className="console-shell__avatar" />
        <span className="t-small">ask anubhav</span>
      </div>
    </div>
  ),
});

/**
 * The name is set one character at a time so each glyph can answer the
 * pointer: glyphs near the cursor ease away from it and settle back on a
 * spring. Positions are measured once per resize, and the loop writes only
 * transforms, so nothing reads layout per frame.
 */
function ProximityName({ lines }: { lines: string[] }) {
  const root = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const chars = Array.from(el.querySelectorAll<HTMLElement>('.hero__char:not(.hero__char--space)'));
    let centres: { x: number; y: number }[] = [];
    const measure = () => {
      centres = chars.map((c) => {
        const r = c.getBoundingClientRect();
        return { x: r.left + r.width / 2 + window.scrollX, y: r.top + r.height / 2 + window.scrollY };
      });
    };
    // Measure after the entrance animation has landed the glyphs.
    const t = setTimeout(measure, 1200);
    window.addEventListener('resize', measure);

    const cur = chars.map(() => ({ x: 0, y: 0 }));
    const vel = chars.map(() => ({ x: 0, y: 0 }));
    let mx = -9999;
    let my = -9999;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX + window.scrollX;
      my = e.clientY + window.scrollY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const RADIUS = 220;
    const PUSH = 26;
    const K = 0.09; // spring stiffness
    const D = 0.78; // damping
    let frame = 0;
    const loop = () => {
      for (let i = 0; i < chars.length; i++) {
        const c = centres[i];
        let tx = 0;
        let ty = 0;
        if (c) {
          const dx = c.x - mx;
          const dy = c.y - my;
          const d = Math.hypot(dx, dy);
          if (d < RADIUS && d > 0.001) {
            const f = (1 - d / RADIUS) ** 2 * PUSH;
            tx = (dx / d) * f;
            ty = (dy / d) * f;
          }
        }
        const s = cur[i];
        const v = vel[i];
        v.x = (v.x + (tx - s.x) * K) * D;
        v.y = (v.y + (ty - s.y) * K) * D;
        s.x += v.x;
        s.y += v.y;
        chars[i].style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <h1 ref={root} className="t-hero hero__name" aria-label={lines.join(' ')}>
      {lines.map((line, li) => (
        <span key={line} className="hero__line" aria-hidden="true">
          <span style={{ animationDelay: `${0.25 + li * 0.1}s` }}>
            {line.split('').map((ch, i) =>
              ch === ' ' ? (
                <span key={i} className="hero__char hero__char--space" />
              ) : (
                <span key={i} className="hero__char">
                  {ch}
                </span>
              ),
            )}
          </span>
        </span>
      ))}
    </h1>
  );
}

/** Mounts the field after the page is interactive rather than at hydration,
    so shader compilation never lands inside the first-input window. */
function DeferredField() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    if (idle) {
      idle(() => setReady(true), { timeout: 1200 });
      return;
    }
    const t = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(t);
  }, []);
  return ready ? <LightField /> : null;
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <DeferredField />
      <div className="hero__grain" aria-hidden="true" />

      <div className="wrap hero__inner">
        <div className="hero__copy">
          <ProximityName lines={['Anubhav', 'Kumar']} />
          <p className="hero__role t-lead">
            <span className="hero__role-pre">{profile.roleLine} </span>
            {profile.role}
          </p>
          <p className="hero__lede t-body">{profile.lede}</p>
          <div className="hero__actions">
            <MagneticButton
              className="btn btn--primary"
              strength={0.3}
              onClick={(e) => {
                e.preventDefault();
                scrollToId('work');
              }}
              href="#work"
            >
              View Work
            </MagneticButton>
            <MagneticButton
              className="btn btn--ghost"
              strength={0.3}
              onClick={(e) => {
                e.preventDefault();
                scrollToId('connect');
              }}
              href="#connect"
            >
              Connect
            </MagneticButton>
          </div>
        </div>

        <div className="hero__console">
          <HeroConsole className="glass glass--lit" />
        </div>
      </div>

      <div className="hero__cue" aria-hidden="true">
        <span className="hero__cue-line" />
        <span className="t-meta">scroll</span>
      </div>
    </section>
  );
}
