'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

let instance: Lenis | null = null;

/** Scroll to an id through Lenis when it is running, natively otherwise. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) instance.scrollTo(el, { offset: -8 });
  else el.scrollIntoView({ block: 'start' });
}

/**
 * Smooth scroll with a conservative lerp: it is here so scroll-linked motion
 * has a continuous signal, not to make the page feel slippery. Not mounted
 * under prefers-reduced-motion, and native keyboard scrolling stays intact.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.5, syncTouch: false });
    instance = lenis;
    let frame = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      instance = null;
    };
  }, []);
  return null;
}
