'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Which slot of the cycle it is, from the wall clock.
 *
 * Slot n runs from t0 + n * hold. Every timeout is aimed at the next boundary
 * computed from t0, never "hold ms from now", so a late timer corrects itself
 * on the next tick and the cycle cannot drift however long it runs. A source
 * that was hidden restarts from the first slot when it is shown again: `epoch`
 * counts those restarts, so a slot's identity is always epoch plus n.
 */
export function useSlotClock(holdMs: number, active: boolean, startAt = 0): { epoch: number; n: number } {
  const [state, setState] = useState({ epoch: 0, n: startAt });
  const first = useRef(true);

  useEffect(() => {
    if (!active) return;
    const t0 = Date.now();
    if (first.current) first.current = false;
    else setState((s) => ({ epoch: s.epoch + 1, n: startAt }));

    let timer = 0;
    const tick = () => {
      const n = startAt + Math.max(0, Math.floor((Date.now() - t0) / holdMs));
      setState((s) => (s.n === n ? s : { epoch: s.epoch, n }));
      timer = window.setTimeout(tick, Math.max(40, t0 + (n - startAt + 1) * holdMs - Date.now()));
    };
    timer = window.setTimeout(tick, Math.max(40, t0 + holdMs - Date.now()));
    return () => window.clearTimeout(timer);
  }, [holdMs, active, startAt]);

  return state;
}
