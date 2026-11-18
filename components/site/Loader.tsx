'use client';

import { useEffect, useRef } from 'react';

const DURATION_MS = 2800;
const FADE_MS = 400;

/**
 * The intro loader (Loader.dc.html), 2.8 s with a Skip link.
 *
 * It plays on every load of the home page (a reload or a fresh visit), never on a
 * deep link (any path other than /), never under reduced motion and never on
 * Save-Data. Navigating within the site does not replay it. The decision is made
 * by a script in <head> (see layout.tsx) that sets data-intro on <html> before
 * first paint, so there is no flash of the page underneath. This component
 * only runs the timer and removes the attribute. The top bar sits above the
 * loader (z-index) and renders from the first frame.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (html.getAttribute('data-intro') !== '1') return;
    const el = root.current;
    let done = false;
    const end = () => {
      if (done) return;
      done = true;
      el?.classList.add('is-out');
      window.setTimeout(() => html.removeAttribute('data-intro'), FADE_MS);
    };
    const t = window.setTimeout(end, DURATION_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') end();
    };
    window.addEventListener('keydown', onKey);
    el?.addEventListener('ak-skip', end);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      el?.removeEventListener('ak-skip', end);
    };
  }, []);

  const name = 'Anubhav Kumar';
  return (
    <div ref={root} className="ld" role="dialog" aria-label="Loading anubhavkumaar.in" aria-modal="false">
      <video className="ld__video" src="/redesign/media/loader.mp4" poster="/redesign/media/loader.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />

      <div className="ld__logo ld-chrome" aria-hidden="true">
        <img src="/redesign/brand/logo-on-dark.png" alt="" height={31} />
      </div>

      <div className="ld__name">
        <p className="ld__h" aria-label={name}>
          <span aria-hidden="true">
            {[...name].map((ch, i) => (
              <span key={i} className="ld__l" style={{ animationDelay: `${(i * 0.03).toFixed(2)}s` }}>
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </span>
        </p>
        <p className="ld__sub">builds AI agents, retrieval and the screens around them</p>
      </div>

      <div className="ld__rail ld-chrome" aria-hidden="true">
        <div className="ld__bar" />
      </div>

      <button
        type="button"
        className="ld__skip"
        onClick={(e) => e.currentTarget.closest('.ld')?.dispatchEvent(new Event('ak-skip'))}
      >
        Skip intro <span aria-hidden="true">→</span>
      </button>

      <div className="ld__veil" aria-hidden="true" />
    </div>
  );
}
