'use client';

import { createContext, Fragment, useContext, useEffect, useRef, useState } from 'react';
import { scrollToId } from './SmoothScroll';

/**
 * One connected page: Home, Work, About and Connect flow into each other with
 * no curtain or overlay (Site.dc.html). This provider does the two things the
 * design asks of the scroll:
 *
 *  1. The address follows the section in view, through history.replaceState
 *     (never router.replace): /, /work/, /about/, /connect/.
 *  2. Each section's intro replays every time it re-enters. A section counts as
 *     "in view" once more than 30% of the viewport is covered by it, and stops
 *     once under 5% is (under 20% for sections after the current one). Coming
 *     back into view bumps its cycle, which remounts its content.
 */

export const SECTIONS = [
  { id: 'top', path: '/', label: 'Home' },
  { id: 'work', path: '/work/', label: 'Work' },
  { id: 'about', path: '/about/', label: 'About' },
  { id: 'connect', path: '/connect/', label: 'Connect' },
] as const;

type State = { vis: boolean[]; cycle: number[] };

const Ctx = createContext<State>({ vis: [true, false, false, false], cycle: [0, 0, 0, 0] });

/** Whether a section is currently in view, and which intro replay it is on. */
export function useSection(index: number) {
  const s = useContext(Ctx);
  return { play: !!s.vis[index], cycle: s.cycle[index] ?? 0 };
}

function indexForPath(pathname: string) {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (p === '' || p === '/' || p === '/home') return 0;
  const i = SECTIONS.findIndex((s) => s.path.replace(/\/+$/, '') === p);
  return i < 0 ? 0 : i;
}

export function ConnectedScroll({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>({ vis: [true, false, false, false], cycle: [0, 0, 0, 0] });
  const current = useRef(0);
  const sync = useRef(false);

  useEffect(() => {
    let raf = 0;

    const compute = () => {
      raf = 0;
      const vh = window.innerHeight;
      const els = SECTIONS.map((s) => document.getElementById(s.id));
      if (els.some((e) => !e)) return;
      const rects = els.map((e) => (e as HTMLElement).getBoundingClientRect());

      // The section holding the point 45% down the viewport is the current one.
      let i = 0;
      rects.forEach((r, k) => {
        if (r.top <= vh * 0.45) i = k;
      });

      setState((prev) => {
        const vis = prev.vis.map((was, k) => {
          const r = rects[k];
          const o = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)) / vh;
          if (k > i) return was ? o > 0.2 : o > 0.3;
          return was ? o > 0.05 : o > 0.3;
        });
        if (vis.every((v, k) => v === prev.vis[k])) return prev;
        return { vis, cycle: prev.cycle.map((c, k) => (vis[k] && !prev.vis[k] ? c + 1 : c)) };
      });

      if (i !== current.current) {
        current.current = i;
        if (sync.current) {
          const target = SECTIONS[i].path;
          if (window.location.pathname !== target) {
            // The query string survives: campaign tags and ?view= are not ours to drop.
            history.replaceState(null, '', target + window.location.search);
          }
        }
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    // A direct hit on /work/ lands on its section first (JumpTo does it); the
    // address is only rewritten once that jump has settled, so it is not
    // overwritten with / on the way.
    const start = indexForPath(window.location.pathname);
    current.current = start;
    const settle = window.setTimeout(
      () => {
        sync.current = true;
        compute();
      },
      start === 0 ? 0 : 350,
    );
    if (start !== 0) requestAnimationFrame(() => scrollToId(SECTIONS[start].id, true));

    compute();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.clearTimeout(settle);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

/**
 * One section of the connected page. `exit` drifts it away slower than the
 * scroll, smaller and fading, as it leaves; `enter` rises it in under the one
 * before. Both are scroll-driven CSS (see .ak-sec in redesign.css) and are off
 * under reduced motion. Content is remounted when the section re-enters, which
 * replays its intro.
 */
export function Section({
  index,
  exit = false,
  enter = false,
  children,
}: {
  index: number;
  exit?: boolean;
  enter?: boolean;
  children: React.ReactNode;
}) {
  const { id, label } = SECTIONS[index];
  const { cycle } = useSection(index);
  return (
    // Earlier sections paint above later ones: the next section rises in under it.
    <section id={id} aria-label={label} className={`ak-section${exit ? ' ak-sec' : ''}`} style={{ zIndex: 10 - index }}>
      <div className={enter ? 'ak-sec-in' : undefined}>
        <Fragment key={cycle}>{children}</Fragment>
      </div>
    </section>
  );
}
