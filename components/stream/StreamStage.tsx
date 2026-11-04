'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { LIVE_SHORT, type Profile } from '@/content/profiles';
import type { FieldController } from '@/lib/light-field';
import { parseStreamConfig, type Scene, type StreamConfig } from '@/lib/stream-config';
import { BrandIcon } from '@/components/site/BrandIcon';
import { GlyphName } from '@/components/site/GlyphName';
import { Countdown } from './Countdown';
import { Cycle } from './Cycle';

/* ═══════════════════════════════════════════════════════════════════════════
   STREAM MODE

   A fixed 1920 by 1080 stage for an OBS browser source (or a lower third at
   1920 by 200). The stage is laid out in stage pixels and scaled to fit the
   window, so at the size OBS uses it is exactly 1:1 and in a browser tab it
   is a faithful preview. The light field is a fixed layer behind it at the
   size of the window.

   What it leaves out on purpose: no pointer effects, no scrollbar, no smooth
   scroll, no nav. What it keeps for a source that runs for hours: one
   absolute clock for every timer, two cycle layers at most, one spring, and
   a field that stops drawing when OBS hides the source.

   Written for OBS's embedded Chromium (103): no :has(), no dvh, no
   individual transform properties.
   ═══════════════════════════════════════════════════════════════════════════ */

const LightField = dynamic(() => import('@/components/site/LightField').then((m) => m.LightField), { ssr: false });

const STAGE = { w: 1920, h: 1080 };
const LOWER = { w: 1920, h: 200 };

/** Quiet, slow, and dim enough that every line of type holds its contrast. */
const MOOD = { speed: 0.5, gain: 0.8, breathRate: 0.035, breathDepth: 0.04 };

declare global {
  interface Window {
    /** OBS calls this when a browser source is shown or hidden. */
    obsSourceVisibleChanged?: (visible: boolean) => void;
  }
}

function useFit(ref: React.RefObject<HTMLElement>, size: { w: number; h: number }, ready: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !ready) return;
    const fit = () => {
      const raw = Math.min(window.innerWidth / size.w, window.innerHeight / size.h);
      const k = Math.abs(raw - 1) < 0.004 ? 1 : raw;
      const x = (window.innerWidth - size.w * k) / 2;
      const y = (window.innerHeight - size.h * k) / 2;
      el.style.transform = k === 1 && x === 0 && y === 0 ? 'none' : `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${k.toFixed(5)})`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [ref, size.w, size.h, ready]);
}

/** Nine glyphs, one per profile, the current one in the accent. Solid shapes, never a hairline. */
function Progress({ items, index }: { items: readonly Profile[]; index: number }) {
  return (
    <ul className="st-progress" aria-hidden="true">
      {items.map((p, i) => (
        <li key={p.id} className={i === index ? 'is-now' : undefined}>
          <BrandIcon name={p.id} width="100%" height="100%" />
        </li>
      ))}
    </ul>
  );
}

function Headline({ lines, motion }: { lines: string[]; motion: boolean }) {
  let at = 0;
  return (
    <h1 className={`st-headline${motion ? '' : ' st-headline--still'}`}>
      {lines.map((line, i) => {
        const el = <GlyphName key={line} text={line} className="st-headline__line" startAt={at} />;
        at += line.length + 1;
        return (
          <span key={i} className="st-headline__row" style={{ ['--len' as string]: line.length }}>
            {el}
          </span>
        );
      })}
    </h1>
  );
}

const HEADLINES: Record<Exclude<Scene, 'cycle' | 'starting'>, string[]> = {
  brb: ['Back soon'],
  ending: ['Thanks for', 'watching'],
};

export function StreamStage({ qr, lower = false }: { qr?: ReactNode; lower?: boolean }) {
  const [cfg, setCfg] = useState<StreamConfig | null>(null);
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const [field, setField] = useState<FieldController | null>(null);
  const [started, setStarted] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  // The address bar is the scene: read it once, on the client.
  useEffect(() => {
    const c = parseStreamConfig(window.location.search, Date.now(), lower);
    if (c.motion === 'full') document.documentElement.classList.add('stream-motion');
    setCfg(c);
  }, [lower]);

  useFit(stage, lower ? LOWER : STAGE, !!cfg);

  // OBS hides a source without the page knowing unless it is told. It tells us here.
  useEffect(() => {
    const prev = window.obsSourceVisibleChanged;
    window.obsSourceVisibleChanged = (v) => setVisible(!!v);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.obsSourceVisibleChanged = prev;
    };
  }, []);

  useEffect(() => {
    field?.setActive(visible);
  }, [field, visible]);

  useEffect(() => {
    field?.setMood(MOOD, 0.6);
  }, [field]);

  // The light drifts a little toward each new name, slowly: golden-angle steps, so no two neighbours line up.
  useEffect(() => {
    field?.setDrift(Math.cos(index * 2.399) * 0.55, Math.sin(index * 2.399) * 0.32, 0.16);
  }, [field, index]);

  // The field waits for the first paint, like everything heavy on the site.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const onIndex = useCallback((i: number) => setIndex(i), []);
  const [done, setDone] = useState(false);

  if (!cfg) return <div className="stream" />;

  const reducedOS = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion = cfg.motion === 'full' || !reducedOS;
  const items = cfg.profiles;
  const scene = cfg.scene;

  if (lower) {
    return (
      <div className="stream stream--lower" data-plate={cfg.plate ? 'on' : 'off'}>
        <div ref={stage} className="stage stage--lower">
          <Cycle items={items} holdMs={cfg.holdMs} active={visible} motion={motion} variant="strip" startAt={cfg.startAt} />
        </div>
      </div>
    );
  }

  return (
    <div className="stream" data-scene={scene} data-field={cfg.transparent ? 'off' : 'on'}>
      {!cfg.transparent && started && (
        <div className={`stream__field${field ? ' is-on' : ''}`} aria-hidden="true">
          <LightField
            className="stream__field-host"
            options={{
              quality: 'phone',
              renderScale: 0.5,
              fullHeight: true,
              restAt: [0.78, 0.4],
              startAt: cfg.fieldStart,
              ignoreReducedMotion: cfg.motion === 'full',
            }}
            onReady={setField}
          />
        </div>
      )}

      <div ref={stage} className="stage">
        {scene === 'starting' && cfg.countdownTo != null && (
          <header className="st-head">
            <p className="st-label">{done ? 'Starting now' : 'Starting soon'}</p>
            <Countdown to={cfg.countdownTo} active={visible} onDone={() => setDone(true)} />
          </header>
        )}

        {(scene === 'brb' || scene === 'ending') && <Headline lines={HEADLINES[scene]} motion={motion} />}

        <div className={`st-main st-main--${scene}`}>
          <Cycle
            items={items}
            holdMs={cfg.holdMs}
            active={visible}
            motion={motion}
            variant={scene === 'brb' || scene === 'ending' ? 'mini' : 'stage'}
            startAt={cfg.startAt}
            onIndex={onIndex}
          />
        </div>

        <footer className="st-foot">
          <Progress items={items} index={index} />
          <p className="st-addr">{LIVE_SHORT}</p>
        </footer>

        {qr && (
          <div className="st-qr">
            <p className="st-qr__label">Scan for every link</p>
            <div className="st-qr__plate">{qr}</div>
          </div>
        )}
      </div>
    </div>
  );
}
