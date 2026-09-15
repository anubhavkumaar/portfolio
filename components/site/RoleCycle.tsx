'use client';

import { useEffect, useState } from 'react';

const TYPE_MS = 46;
const DELETE_MS = 26;
const HOLD_MS = 2200;
const REST_MS = 420;

/**
 * The role line types through several titles. The first one is in the
 * static HTML, so the page reads correctly before any script runs and under
 * reduced motion, where it simply stays.
 */
export function RoleCycle({ roles }: { roles: readonly string[] }) {
  const [text, setText] = useState(roles[0]);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (roles.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setLive(true);

    let idx = 0;
    let shown = roles[0].length;
    let deleting = false;
    let timer = 0;

    const tick = () => {
      const target = roles[idx];
      if (!deleting) {
        if (shown < target.length) {
          shown += 1;
          setText(target.slice(0, shown));
          timer = window.setTimeout(tick, TYPE_MS);
        } else {
          deleting = true;
          timer = window.setTimeout(tick, HOLD_MS);
        }
      } else if (shown > 0) {
        shown -= 1;
        setText(target.slice(0, shown));
        timer = window.setTimeout(tick, DELETE_MS);
      } else {
        deleting = false;
        idx = (idx + 1) % roles.length;
        timer = window.setTimeout(tick, REST_MS);
      }
    };
    timer = window.setTimeout(tick, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [roles]);

  return (
    <span className={`role-cycle${live ? ' is-live' : ''}`} aria-label={roles[0]}>
      <span aria-hidden={live || undefined}>{text}</span>
    </span>
  );
}
