'use client';

import { useEffect, type RefObject } from 'react';
import { createSpring, type Glyph } from '@/lib/glyph-spring';

/**
 * The register's pointer behaviour, shared by Connect and /live/.
 *
 *   hover  (mouse, pen) the name under the pointer eases away from it, on the
 *          hero's spring
 *   press  any pointer: `onPress` fires on contact ('down') and again if the
 *          contact turns out to be a tap ('tap'), at which point the name
 *          springs outward from the touch point
 *   focus  a row reached from the keyboard answers with a gentle burst
 *
 * A tap is contact that ends within 600ms and 10px of where it began, so
 * starting a scroll on a row never sets the type off. Everything that moves is
 * skipped under reduced motion; `onPress` still fires so callers can decide.
 */

export interface RegisterPress {
  row: HTMLElement;
  /** Client coordinates of the contact. */
  x: number;
  y: number;
  phase: 'down' | 'tap';
}

export function useGlyphRegister(
  ref: RefObject<HTMLElement>,
  opts: {
    rowSelector: string;
    hover?: { radius: number; push: number };
    onPress?: (p: RegisterPress) => void;
  },
) {
  const { rowSelector, hover, onPress } = opts;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const spring = reduced ? null : createSpring();

    const cache = new WeakMap<HTMLElement, Glyph[]>();
    const glyphsOf = (row: HTMLElement) => {
      let g = cache.get(row);
      if (!g && spring) {
        g = spring.add(row.querySelectorAll<HTMLElement>('.gc__i'));
        cache.set(row, g);
      }
      return g ?? [];
    };
    const rowOf = (e: Event) => (e.target as Element | null)?.closest?.(rowSelector) as HTMLElement | null;
    const page = (x: number, y: number) => [x + window.scrollX, y + window.scrollY] as const;

    let active: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      if (!spring || !hover || (e.pointerType !== 'mouse' && e.pointerType !== 'pen')) return;
      const row = rowOf(e);
      if (row !== active) {
        if (active) spring.release(glyphsOf(active));
        active = row;
        if (row) spring.measure(glyphsOf(row));
      }
      if (row) {
        const [px, py] = page(e.clientX, e.clientY);
        spring.push(glyphsOf(row), px, py, hover);
      }
    };
    const onLeave = () => {
      if (spring && active) spring.release(glyphsOf(active));
      active = null;
    };

    let down: { row: HTMLElement; x: number; y: number; t: number; id: number } | null = null;
    const onDown = (e: PointerEvent) => {
      const row = rowOf(e);
      if (!row) return;
      down = { row, x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId };
      onPress?.({ row, x: e.clientX, y: e.clientY, phase: 'down' });
    };
    const onUp = (e: PointerEvent) => {
      const d = down;
      down = null;
      if (!d || e.pointerId !== d.id) return;
      const tap = performance.now() - d.t < 600 && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 10;
      if (!tap) return;
      if (spring) {
        const g = glyphsOf(d.row);
        spring.measure(g);
        const [px, py] = page(e.clientX, e.clientY);
        spring.burst(g, px, py);
      }
      onPress?.({ row: d.row, x: e.clientX, y: e.clientY, phase: 'tap' });
    };
    const onCancel = () => {
      down = null;
    };
    const onFocus = (e: FocusEvent) => {
      const row = rowOf(e);
      if (!row || !spring || !row.matches(':focus-visible')) return;
      const g = glyphsOf(row);
      spring.measure(g);
      const r = row.getBoundingClientRect();
      const [px, py] = page(r.left, r.top + r.height / 2);
      spring.burst(g, px, py, 7);
    };

    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('pointerdown', onDown, { passive: true });
    root.addEventListener('pointerup', onUp, { passive: true });
    root.addEventListener('pointercancel', onCancel, { passive: true });
    root.addEventListener('focusin', onFocus);
    const onVis = () => (document.hidden ? spring?.pause() : spring?.resume());
    document.addEventListener('visibilitychange', onVis);

    return () => {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointerup', onUp);
      root.removeEventListener('pointercancel', onCancel);
      root.removeEventListener('focusin', onFocus);
      document.removeEventListener('visibilitychange', onVis);
      spring?.destroy();
    };
    // onPress is read through the closure at mount; callers pass a stable function.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, rowSelector]);
}
