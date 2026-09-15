'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A number that counts up to its value once when it enters view, keeping any
 * prefix or suffix ("40%", "20+", "69,000") intact. The static HTML carries
 * the final value, so it reads correctly before script and under reduced
 * motion, where it never moves.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const m = value.match(/^([^\d]*)([\d,]+)(.*)$/);
    if (!m) return;
    const [, pre, digits, post] = m;
    const target = parseInt(digits.replace(/,/g, ''), 10);
    if (!Number.isFinite(target) || target === 0) return;
    const grouped = digits.includes(',');
    const fmt = (n: number) => (grouped ? n.toLocaleString('en-US') : String(n));

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 900;
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          setShown(`${pre}${fmt(Math.round(target * eased))}${post}`);
          if (t < 1) requestAnimationFrame(step);
        };
        setShown(`${pre}${fmt(0)}${post}`);
        requestAnimationFrame(step);
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return <span ref={ref}>{shown}</span>;
}
