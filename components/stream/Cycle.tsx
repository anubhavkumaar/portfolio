'use client';

import { useEffect, useRef, useState, type CSSProperties, type MutableRefObject } from 'react';
import { shortUrl, type Profile } from '@/content/profiles';
import { createSpring, type Spring } from '@/lib/glyph-spring';
import { BrandIcon } from '@/components/site/BrandIcon';
import { GlyphName } from '@/components/site/GlyphName';
import { useSlotClock } from './useSlotClock';

/* ═══════════════════════════════════════════════════════════════════════════
   THE CYCLE

   One profile at a time. The name rises through a mask a glyph after glyph,
   holds, and breaks away on the glyph spring while the next one builds in
   underneath it. Three sizes share the code:

     stage  the full-frame name, with handle and short address under it
     mini   one line (glyph, name, handle) for scenes that have a headline
     strip  the lower third

   Memory and time: two layers exist at once at most, each layer is removed
   when it has left, the spring is one instance for the life of the page, and
   the slot comes from an absolute clock. Nothing accumulates over hours.
   ═══════════════════════════════════════════════════════════════════════════ */

export type CycleVariant = 'stage' | 'mini' | 'strip';

/** How far a glyph travels when it breaks away: offset, fan and rise, in stage pixels. */
const FLIGHT: Record<CycleVariant, { x: number; y: number; fan: number; lift: number }> = {
  stage: { x: 220, y: 170, fan: 46, lift: 70 },
  mini: { x: 110, y: 70, fan: 20, lift: 30 },
  strip: { x: 90, y: 60, fan: 16, lift: 24 },
};

/** The rise takes about 1.6s; the mask is only needed while it plays. */
const UNMASK_MS = 1800;
/** A leaving layer is gone once its glyphs and its fade have finished. */
const EXIT_MS = 2000;

interface Layer {
  key: string;
  idx: number;
  out: boolean;
}

function Slot({
  p,
  out,
  variant,
  motion,
  spring,
}: {
  p: Profile;
  out: boolean;
  variant: CycleVariant;
  motion: boolean;
  spring: MutableRefObject<Spring | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const flying = useRef<ReturnType<Spring['add']>>([]);
  const [masked, setMasked] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setMasked(false), UNMASK_MS);
    return () => window.clearTimeout(t);
  }, []);

  // Leaving: each glyph is given a target up and to the right, fanned by its
  // place in the word, and the spring follows the target as it travels.
  useEffect(() => {
    const sp = spring.current;
    const el = ref.current;
    if (!out || !motion || !sp || !el) return;
    const g = sp.add(el.querySelectorAll<HTMLElement>('.sk__name .gc__i'));
    flying.current = g;
    const f = FLIGHT[variant];
    g.forEach((gl, i) => {
      const spread = i - (g.length - 1) / 2;
      sp.glide(gl, f.x + spread * f.fan, -(f.y + (i % 3) * f.lift), i * 45, 1100);
    });
  }, [out, motion, variant, spring]);

  useEffect(
    () => () => {
      if (flying.current.length) spring.current?.drop(flying.current);
      flying.current = [];
    },
    [spring],
  );

  return (
    <div
      ref={ref}
      className={`sk sk--${variant} ${out ? 'sk--out' : 'sk--in'}${masked ? ' sk--mask' : ''}${motion ? '' : ' sk--still'}`}
      style={{ '--n': p.name.length } as CSSProperties}
      aria-hidden={out || undefined}
    >
      {variant !== 'stage' && (
        <span className="sk__icon" aria-hidden="true">
          <BrandIcon name={p.id} width="100%" height="100%" />
        </span>
      )}
      <GlyphName text={p.name} className="sk__name" />
      <span className="sk__handle">{p.handle}</span>
      <span className="sk__short">{shortUrl(p)}</span>
    </div>
  );
}

export function Cycle({
  items,
  holdMs,
  active,
  motion,
  variant,
  startAt = 0,
  onIndex,
}: {
  items: readonly Profile[];
  holdMs: number;
  /** False while the source is hidden: the clock stops and the spring pauses. */
  active: boolean;
  /** False for reduced motion: names crossfade instead of rising and flying. */
  motion: boolean;
  variant: CycleVariant;
  /** Slot to begin on. */
  startAt?: number;
  /** Told which profile is current, for the progress row and the field's drift. */
  onIndex?: (index: number) => void;
}) {
  const { epoch, n } = useSlotClock(holdMs, active, startAt);
  const idx = n % items.length;
  const key = `${epoch}:${n}`;
  const [layers, setLayers] = useState<Layer[]>(() => [{ key, idx, out: false }]);
  const spring = useRef<Spring | null>(null);

  useEffect(() => {
    const s = createSpring();
    spring.current = s;
    return () => {
      s.destroy();
      spring.current = null;
    };
  }, []);

  useEffect(() => {
    if (active) spring.current?.resume();
    else spring.current?.pause();
  }, [active]);

  useEffect(() => {
    setLayers((ls) =>
      ls.some((l) => l.key === key) ? ls : [...ls.map((l) => ({ ...l, out: true })), { key, idx, out: false }],
    );
  }, [key, idx]);

  useEffect(() => {
    if (!layers.some((l) => l.out)) return;
    const t = window.setTimeout(() => setLayers((ls) => ls.filter((l) => !l.out)), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [layers]);

  useEffect(() => {
    onIndex?.(idx);
  }, [idx, onIndex]);

  return (
    <div className={`cycle cycle--${variant}`}>
      {layers.map((l) => (
        <Slot key={l.key} p={items[l.idx % items.length]} out={l.out} variant={variant} motion={motion} spring={spring} />
      ))}
    </div>
  );
}
