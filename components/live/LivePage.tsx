'use client';

import dynamic from 'next/dynamic';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Mail } from 'lucide-react';
import { profile } from '@/content/profile';
import { profiles, type Profile, type StreamId } from '@/content/profiles';
import { useLiveStatus, type LiveEntry } from '@/lib/live-status';
import type { FieldController } from '@/lib/light-field';
import { AkMark } from '@/components/site/AkMark';
import { BrandIcon } from '@/components/site/BrandIcon';
import { GlyphName } from '@/components/site/GlyphName';
import { useGlyphRegister } from '@/components/site/useGlyphRegister';
import { LiveTimer } from './LiveTimer';
import { useTilt } from './useTilt';

/* ═══════════════════════════════════════════════════════════════════════════
   /live/

   The page a chat link points at. It has two jobs, in this order:

     1. Be tappable at once. The nine rows and the email are real links in the
        static HTML, so they work before a byte of script has run.
     2. Then be worth stopping for. The light field mounts after first paint,
        follows the finger, blooms where a row is tapped, and changes state when
        he is live. The intro plays once per visit and any tap skips it.

   Everything that moves does so on transform and opacity. Under reduced
   motion the field is one frozen frame, there is no intro, no spring and no
   tilt, and everything is simply there.
   ═══════════════════════════════════════════════════════════════════════════ */

const LightField = dynamic(() => import('@/components/site/LightField').then((m) => m.LightField), { ssr: false });

// The field at rest is calm and a touch dimmer, so type has room. Live, it
// runs faster and breathes. Its peak (gain times the top of the breath) is kept
// within a few percent of the calm peak: the brightest the light ever gets
// behind 15px type is what sets whether that type holds 4.5 to 1, and that was
// measured, at the top of the breath, across many field times.
const CALM = { speed: 0.75, gain: 0.9, breathRate: 0.05, breathDepth: 0.03 };
const LIVE = { speed: 2.1, gain: 0.9, breathRate: 0.16, breathDepth: 0.05 };

const idx = (n: number) => ({ '--r': n }) as CSSProperties;

/** `?t=240` starts the field 240 seconds in, so a given frame can be found again. */
function fieldStart() {
  const t = Number(new URLSearchParams(window.location.search).get('t'));
  return Number.isFinite(t) && t > 0 ? t : 0;
}

/** `?gl=any` lets the field run on software rendering too. For captures and audits made on a machine with no GPU. */
function needsGpu() {
  return new URLSearchParams(window.location.search).get('gl') !== 'any';
}

/** On a wide screen the list is one column at the left; the light gives way there. A phone's type spans the width, so the light is left whole. */
function quietZone() {
  return window.matchMedia('(min-width: 1000px)').matches ? { strength: 0.5, reach: 0.55 } : undefined;
}

/** Mount something once the first paint is done and the main thread has a quiet moment, so it can never block a tap or the page's own hydration. */
function useAfterPaint(ms: number) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let t = 0;
    let idle = 0;
    const go = () => setReady(true);
    const raf = requestAnimationFrame(() => {
      t = window.setTimeout(() => {
        if ('requestIdleCallback' in window) idle = window.requestIdleCallback(go, { timeout: 1200 });
        else go();
      }, ms);
    });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      if (idle && 'cancelIdleCallback' in window) window.cancelIdleCallback(idle);
    };
  }, [ms]);
  return ready;
}

function Row({ p, entry, order }: { p: Profile; entry?: LiveEntry; order: number }) {
  return (
    <li
      className="lrow-item"
      style={idx(order)}
      data-flip={p.id}
      data-edge={p.id === 'steam' || p.id === 'linkedin' ? 'after' : undefined}
    >
      <a className="lrow" href={p.href} target="_blank" rel="noreferrer noopener">
        <span className="lrow__icon" aria-hidden="true">
          <BrandIcon name={p.id} width={28} height={28} />
        </span>
        <span className="lrow__text">
          <span className="lrow__head">
            <GlyphName text={p.name} className="lrow__name" />
            {entry && <span className="profile__live">live</span>}
          </span>
          <span className="lrow__handle">{p.handle}</span>
        </span>
      </a>
    </li>
  );
}

function EmailRow({ order }: { order: number }) {
  return (
    <li className="lrow-item" style={idx(order)} data-flip="email">
      <a className="lrow" href={`mailto:${profile.email}`}>
        <span className="lrow__icon" aria-hidden="true">
          <Mail size={28} strokeWidth={1.75} />
        </span>
        <span className="lrow__text">
          <span className="lrow__head">
            <GlyphName text="Email" className="lrow__name" />
          </span>
          <span className="lrow__handle">{profile.email}</span>
        </span>
      </a>
    </li>
  );
}

/** The live platform: the largest type on the page, with the stream title under it. */
function Hero({ p, entry }: { p: Profile; entry: LiveEntry }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    // The rise needs a mask; the spring does not want one. Drop it once the name has landed.
    const t = window.setTimeout(() => ref.current?.querySelector('.gname')?.classList.remove('gname--rise'), 1300);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <a
      ref={ref}
      className="lhero"
      href={p.href}
      target="_blank"
      rel="noreferrer noopener"
      data-flip="hero"
      style={{ '--n': p.name.length } as CSSProperties}
    >
      <span className="lhero__meta">
        <span className="lhero__icon" aria-hidden="true">
          <BrandIcon name={p.id} width={30} height={30} />
        </span>
        <span className="profile__live">live</span>
        <LiveTimer since={entry.startedAt} />
      </span>
      <GlyphName text={p.name} className="lhero__name gname--rise" />
      <span className="lhero__title">{entry.title}</span>
      <span className="lhero__handle">{p.handle}</span>
    </a>
  );
}

export function LivePage() {
  const live = useLiveStatus({ pollMs: 30000 });
  const primary = live.primary;
  const primaryProfile = primary ? profiles.find((p) => p.id === primary) : undefined;

  const rootRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<FieldController | null>(null);
  const fieldElRef = useRef<HTMLDivElement>(null);
  const [field, setField] = useState<FieldController | null>(null);
  const fieldWanted = useAfterPaint(120);

  // ── intro: CSS does the work; this only lets a tap end it early ──────────
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains('live-intro')) return;
    const end = () => html.classList.remove('live-intro', 'live-skip');
    const t = window.setTimeout(end, 1500);
    const skip = () => {
      html.classList.add('live-skip');
      window.setTimeout(end, 80);
    };
    window.addEventListener('pointerdown', skip, { once: true, passive: true });
    window.addEventListener('keydown', skip, { once: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
    };
  }, []);

  // ── the field reacts to him being live ───────────────────────────────────
  useEffect(() => {
    fieldRef.current = field;
    field?.setMood(live.anyLive ? LIVE : CALM, live.anyLive ? 1.4 : 0.9);
  }, [field, live.anyLive]);

  // ── a tap blooms the light where it lands ────────────────────────────────
  useGlyphRegister(bodyRef, {
    rowSelector: '.lrow, .lhero',
    hover: { radius: 140, push: 12 },
    onPress: ({ x, y, phase }) => fieldRef.current?.pulse(x, y, phase === 'tap' ? 1 : 0.45),
  });
  useEffect(() => {
    // Taps on the empty parts of the page bloom too. Rows are covered above.
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest?.('.lrow, .lhero')) return;
      fieldRef.current?.pulse(e.clientX, e.clientY, 0.5);
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, []);

  const { canAsk, ask } = useTilt(field, headRef, bodyRef);

  // ── FLIP: when the live row is promoted or dropped, everything slides ────
  const snap = useRef<Map<string, number> | null>(null);
  const seen = useRef<string | null>(null);
  const measure = () => {
    const out = new Map<string, number>();
    rootRef.current?.querySelectorAll<HTMLElement>('[data-flip]').forEach((el) => {
      out.set(el.dataset.flip!, el.getBoundingClientRect().top + window.scrollY);
    });
    return out;
  };
  if (seen.current !== primary) {
    // Render phase, DOM not yet changed: this is the "first" of first, last, invert, play.
    snap.current = seen.current === null && primary === null ? null : measure();
    seen.current = primary;
  }
  useLayoutEffect(() => {
    const before = snap.current;
    snap.current = null;
    if (!before || before.size === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    rootRef.current?.querySelectorAll<HTMLElement>('[data-flip]').forEach((el) => {
      const id = el.dataset.flip!;
      const prev = before.get(id);
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (prev === undefined) {
        // New to the page: the hero rises in, a returning row fades in.
        // It waits a beat so the rows have slid clear of where it lands.
        el.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], {
          duration: 620,
          delay: 180,
          fill: 'backwards',
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        });
      } else if (Math.abs(prev - top) > 1) {
        el.animate([{ transform: `translateY(${prev - top}px)` }, { transform: 'none' }], {
          duration: 700,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        });
      }
    });
  }, [primary]);

  const list = profiles.filter((p) => p.id !== primary);
  const state = live.anyLive ? 'live' : 'offline';

  // The line under the name fades in only if the state changes while it is on screen.
  const firstState = useRef(state);
  const changed = useRef(false);
  if (firstState.current !== state) changed.current = true;

  return (
    <div ref={rootRef} className="live" data-state={state}>
      <div ref={fieldElRef} className="live__field" aria-hidden="true">
        {fieldWanted && (
          <LightField
            className="live__field-host"
            options={{
              quality: 'phone',
              touch: true,
              fullHeight: true,
              restAt: [0.3, 0.72],
              startAt: fieldStart(),
              quiet: quietZone(),
              asyncCompile: true,
              requireGpu: needsGpu(),
              // Fade in on the first drawn frame, not on mount: the shader may still be compiling.
              onFirstFrame: () => fieldElRef.current?.classList.add('is-on'),
            }}
            onReady={setField}
          />
        )}
      </div>

      <div className="live__layer">
        <header ref={headRef} className="live__head">
          <span className="live__mark" aria-hidden="true">
            <span className="live__mark-clip">
              <span className="live__mark-in">
                <AkMark className="live__mark-svg" />
              </span>
            </span>
          </span>
          <h1 className="live__name">
            <GlyphName text="Anubhav" />
            <GlyphName text="Kumar" startAt={7} />
          </h1>
          <p key={state} className={`live__lede t-lead${changed.current ? ' live__lede--in' : ''}`}>
            {live.anyLive ? "I'm live right now." : 'I stream on Kick, YouTube and Twitch. Follow wherever you like.'}
          </p>
        </header>

        <div ref={bodyRef} className="live__body">
          {primaryProfile && primary && live.live[primary] && <Hero p={primaryProfile} entry={live.live[primary]!} />}

          <ul className="live__list" aria-label="Profiles">
            {list.map((p) => (
              <Row
                key={p.id}
                p={p}
                entry={p.streams ? live.live[p.id as StreamId] : undefined}
                order={profiles.indexOf(p)}
              />
            ))}
            <EmailRow order={profiles.length} />
          </ul>

          <footer className="live__foot">
            <p className="t-small">
              Curious about the engineering side?{' '}
              <a className="live__link" href="/">
                Read the portfolio.
              </a>
            </p>
            {canAsk && (
              <button type="button" className="live__tilt" onClick={ask}>
                Tilt your phone to move the light
              </button>
            )}
          </footer>
        </div>
      </div>

      <p className="sr-only" role="status">
        {primaryProfile && primary && live.live[primary] ? `Live on ${primaryProfile.name}: ${live.live[primary]!.title}` : ''}
      </p>
    </div>
  );
}
