'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type { FieldController } from '@/lib/light-field';

/**
 * Optional device tilt for /live/: the light slides a little and the type
 * shifts a few pixels the other way, so the page has depth in the hand.
 *
 * It is an extra. The page is complete without it, and it asks for nothing
 * until the viewer acts:
 *   - Android and most others need no permission: readings simply arrive and
 *     the tilt starts.
 *   - iOS makes the page ask. The page shows a quiet text button in the footer,
 *     and the permission prompt appears only after the viewer taps it.
 * Off under reduced motion, on devices with no motion sensor, and when the
 * screen is not in portrait. Readings are taken relative to how the phone is
 * held when it starts, so any resting angle is neutral.
 */

type OrientationCtor = {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

const RANGE = 24; // degrees of tilt that count as full
const LIGHT = 0.09; // noise-space shift at full tilt
const PX = 8; // pixels the head moves at full tilt; the list moves half

export function useTilt(
  field: FieldController | null,
  head: RefObject<HTMLElement>,
  body: RefObject<HTMLElement>,
): { canAsk: boolean; ask: () => void } {
  const [canAsk, setCanAsk] = useState(false);
  const started = useRef(false);
  const fieldRef = useRef(field);
  fieldRef.current = field;
  const stop = useRef<(() => void) | null>(null);

  const start = useCallback(() => {
    if (started.current) return;
    started.current = true;

    let base: { g: number; b: number } | null = null;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let lastX = 9;
    let lastY = 9;

    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      if (!base) base = { g: e.gamma, b: e.beta };
      tx = Math.max(-1, Math.min(1, (e.gamma - base.g) / RANGE));
      ty = Math.max(-1, Math.min(1, (e.beta - base.b) / RANGE));
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const portrait = !screen.orientation || screen.orientation.angle === 0;
      const gx = portrait ? tx : 0;
      const gy = portrait ? ty : 0;
      x += (gx - x) * 0.08;
      y += (gy - y) * 0.08;
      if (Math.abs(x - lastX) < 0.002 && Math.abs(y - lastY) < 0.002) return;
      lastX = x;
      lastY = y;
      fieldRef.current?.setTilt(x * LIGHT, y * LIGHT);
      if (head.current) head.current.style.transform = `translate3d(${(-x * PX).toFixed(2)}px, ${(-y * PX * 0.75).toFixed(2)}px, 0)`;
      if (body.current) body.current.style.transform = `translate3d(${(-x * PX * 0.5).toFixed(2)}px, ${(-y * PX * 0.4).toFixed(2)}px, 0)`;
    };

    const onVis = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };

    window.addEventListener('deviceorientation', onOrient, true);
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(loop);
    stop.current = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('deviceorientation', onOrient, true);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [head, body]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: coarse)').matches) return;
    const Ctor = (window as unknown as { DeviceOrientationEvent?: OrientationCtor }).DeviceOrientationEvent;
    if (!Ctor) return;

    // Listen briefly without asking for anything. Where no permission is
    // needed (most Android browsers) readings arrive and the tilt just starts.
    // Where one is (iOS) nothing arrives, and the page offers a button that
    // asks only when it is tapped.
    let timer = 0;
    const probe = (e: DeviceOrientationEvent) => {
      if (e.gamma == null && e.beta == null) return;
      window.removeEventListener('deviceorientation', probe, true);
      window.clearTimeout(timer);
      start();
    };
    window.addEventListener('deviceorientation', probe, true);
    timer = window.setTimeout(() => {
      window.removeEventListener('deviceorientation', probe, true);
      if (!started.current && typeof Ctor.requestPermission === 'function') setCanAsk(true);
    }, 900);

    return () => {
      window.removeEventListener('deviceorientation', probe, true);
      window.clearTimeout(timer);
      stop.current?.();
      stop.current = null;
      started.current = false;
    };
  }, [start]);

  const ask = useCallback(() => {
    const Ctor = (window as unknown as { DeviceOrientationEvent?: OrientationCtor }).DeviceOrientationEvent;
    Ctor?.requestPermission?.()
      .then((res) => {
        if (res === 'granted') start();
        setCanAsk(false);
      })
      .catch(() => setCanAsk(false));
  }, [start]);

  return { canAsk, ask };
}
