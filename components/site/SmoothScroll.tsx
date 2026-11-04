'use client';

import { useEffect } from 'react';
import type Lenis from 'lenis';

let instance: Lenis | null = null;

/** Scroll to an id through Lenis when it is running, natively otherwise. */
export function scrollToId(id: string, immediate = false) {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) instance.scrollTo(el, { offset: -8, immediate });
  else el.scrollIntoView({ block: 'start', behavior: immediate ? 'instant' : 'auto' });
}

/**
 * Smooth scroll with a conservative lerp: it is here so scroll-linked motion
 * has a continuous signal, not to make the page feel slippery. Not mounted
 * under prefers-reduced-motion, and native keyboard scrolling stays intact.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false;
    let frame = 0;
    let lenis: Lenis | null = null;
    // Loaded on demand, so pages that never smooth-scroll never download it.
    import('lenis').then(({ default: LenisCtor }) => {
      if (cancelled) return;
      lenis = new LenisCtor({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.5, syncTouch: false });
      instance = lenis;
      const loop = (t: number) => {
        lenis?.raf(t);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      lenis?.destroy();
      instance = null;
    };
  }, []);
  return null;
}
