'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Marks a list so its rows rise in one after another when it enters view.
 * The motion itself lives in CSS and only runs on touch, where there is no
 * pointer to give the page life; on a desktop the rows are simply there.
 */
export function Stagger({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const list = el.firstElementChild;
    if (!list) return;
    Array.from(list.children).forEach((child, i) => (child as HTMLElement).style.setProperty('--i', String(i)));
    el.classList.add('is-armed');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add('is-in');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="stagger">
      {children}
    </div>
  );
}
