'use client';

import { useEffect, useRef } from 'react';

// The clip (loader.mp4) is 5.87 s: particles stream in, lock into a sphere, the camera flies into
// its core and light fills the frame. It plays once, in full, sped up to fit DURATION_MS, and the
// on-screen type and progress line are timed to the same length by --ld-dur in pages.css.
const CLIP_S = 5.867;
const DURATION_MS = 4400;
const FADE_MS = 600;

/**
 * The intro loader (Loader.dc.html): the whole clip once, about 4.4 s, with a Skip link.
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
  const video = useRef<HTMLVideoElement>(null);

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
    const v = video.current;
    if (v) {
      v.playbackRate = CLIP_S / (DURATION_MS / 1000);
      v.addEventListener('ended', end);
    }
    // The timer is the backstop if the clip stalls or cannot play.
    const t = window.setTimeout(end, DURATION_MS + 300);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') end();
    };
    window.addEventListener('keydown', onKey);
    el?.addEventListener('ak-skip', end);
    return () => {
      window.clearTimeout(t);
      v?.removeEventListener('ended', end);
      window.removeEventListener('keydown', onKey);
      el?.removeEventListener('ak-skip', end);
    };
  }, []);

  const name = 'Anubhav Kumar';
  return (
    <div ref={root} className="ld" role="dialog" aria-label="Loading anubhavkumaar.in" aria-modal="false">
      <video ref={video} className="ld__video" src="/redesign/media/loader.mp4" poster="/redesign/media/loader.jpg" autoPlay muted playsInline preload="auto" aria-hidden="true" />

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
    </div>
  );
}
