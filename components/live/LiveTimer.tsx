'use client';

import { useEffect, useRef } from 'react';
import { formatElapsed } from '@/lib/live-status';

/**
 * Counts up from the moment the stream started, in mono. Computed from the
 * clock each second rather than accumulated, so it cannot drift, and written
 * straight to the text node so it never re-renders the page. Hidden from
 * screen readers on purpose: announcing every second would be noise.
 */
export function LiveTimer({ since, className = '' }: { since: number | null; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || since == null) return;
    const tick = () => {
      el.textContent = formatElapsed(Date.now() - since);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [since]);

  if (since == null) return null;
  return <span ref={ref} className={`live__timer${className ? ` ${className}` : ''}`} aria-hidden="true" />;
}
