'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * The one authored arrival: a heading rises out of a clip box once when it
 * enters view. Used on section headings only, never on body copy, so it stays
 * a moment rather than a habit. Reduced motion lands it in place via CSS.
 */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add('is-in');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className="reveal">
      <span>{children}</span>
    </span>
  );
}
