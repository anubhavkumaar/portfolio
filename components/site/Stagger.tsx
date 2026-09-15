'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Marks a list so its rows rise in one after another when it enters view.
 * The motion itself lives in CSS. By default it only runs on touch, where
 * there is no pointer to give the page life; `always` runs it on a desktop
 * too, for the sections that have no hover interaction of their own.
 * Armed by script, so nothing is hidden without it.
 */
export function Stagger({
  children,
  always = false,
  className = '',
}: {
  children: ReactNode;
  always?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const list = el.firstElementChild;
    if (!list) return;
    Array.from(list.children).forEach((child, i) => {
      (child as HTMLElement).style.setProperty('--i', String(i));
      // Second level, for chips inside a row: each one sets itself a beat
      // after the row it belongs to.
      Array.from(child.querySelectorAll<HTMLElement>('.chip')).forEach((chip, j) => chip.style.setProperty('--j', String(j)));
    });
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
    <div ref={ref} className={`stagger${always ? ' stagger--always' : ''}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}
