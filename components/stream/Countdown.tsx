'use client';

import { useEffect, useRef } from 'react';
import { formatCountdown } from '@/lib/stream-config';

/**
 * A mono countdown to an absolute time. It reads the clock each second and
 * writes straight into the text node, so it never re-renders the scene and
 * cannot drift. It re-aims at each whole second, and ticks at once when the
 * source is shown again after being hidden.
 */
export function Countdown({
  to,
  active,
  onDone,
  className = '',
}: {
  to: number;
  active: boolean;
  onDone?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    let timer = 0;
    const tick = () => {
      const left = to - Date.now();
      el.textContent = formatCountdown(left);
      if (left <= 0) {
        done.current?.();
        return;
      }
      timer = window.setTimeout(tick, (left % 1000) + 8);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, [to, active]);

  return <span ref={ref} className={`st-count${className ? ` ${className}` : ''}`} aria-label="Time until the stream starts" />;
}
