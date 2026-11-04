import { useEffect, useRef, useState } from 'react';
import { profiles, type StreamId } from '@/content/profiles';

/* ═══════════════════════════════════════════════════════════════════════════
   LIVE STATUS

   Hosting is static, so there is no server to ask. The page reads a small
   JSON file, public/live-status.json, and the hook turns it into state. To go
   live today, edit that file on the host. To automate it later, point
   NEXT_PUBLIC_LIVE_STATUS_URL at anything that returns the same shape (a
   scheduled job that writes the file, a worker that polls the Kick, Twitch
   and YouTube APIs), or pass a different `source` to the hook. The pages do
   not change.

   Shape of the file (every key optional):

     {
       "updated": "2026-10-28T13:05:00Z",
       "kick":    { "live": true,  "title": "Heist night", "startedAt": "2026-10-28T12:10:00Z" },
       "youtube": { "live": false },
       "twitch":  { "live": true,  "title": "Heist night", "startedAt": "2026-10-28T12:10:00Z" }
     }

   A forgotten file should not claim he is live for ever. A platform counts as
   live only while its `startedAt` is under 30 hours old; with no `startedAt`,
   only while the file's `updated` is under 12 hours old. Bump `updated` (and
   set `startedAt`) when you edit the file.

   Preview without touching the file: /live/?live=kick,twitch&title=Heist%20night&since=75
   (comma list of platforms, optional title, optional minutes since going live).
   ═══════════════════════════════════════════════════════════════════════════ */

export interface PlatformStatus {
  live: boolean;
  title?: string;
  /** ISO time the stream started. Drives the timer. */
  startedAt?: string;
}

export type LiveStatusFile = { updated?: string } & Partial<Record<StreamId, PlatformStatus>>;

export interface LiveEntry {
  id: StreamId;
  title: string;
  /** Epoch ms, or null when the file does not say or the value is too old to trust. */
  startedAt: number | null;
}

export interface LiveStatus {
  /** False until the first answer arrives. The pages render the offline state meanwhile. */
  ready: boolean;
  live: Partial<Record<StreamId, LiveEntry>>;
  /** The platform that gets the big row: the first live one in profile order. */
  primary: StreamId | null;
  anyLive: boolean;
}

export type LiveSource = (signal: AbortSignal) => Promise<LiveStatusFile | null>;

const STALE_FILE_MS = 12 * 60 * 60 * 1000;
const STALE_START_MS = 30 * 60 * 60 * 1000;
const FALLBACK_TITLE = 'Live now';

export const EMPTY_STATUS: LiveStatus = { ready: false, live: {}, primary: null, anyLive: false };

declare global {
  interface Window {
    /** Started by the inline script on /live/ so the answer is usually back before hydration. */
    __akLive?: Promise<LiveStatusFile | null>;
  }
}

/** The default source: a static JSON file, fetched fresh every time. */
export const staticJsonSource: LiveSource = async (signal) => {
  const url = process.env.NEXT_PUBLIC_LIVE_STATUS_URL || '/live-status.json';
  const res = await fetch(url, { cache: 'no-store', signal });
  if (!res.ok) return null;
  return (await res.json()) as LiveStatusFile;
};

function previewFromQuery(): LiveStatusFile | null {
  if (typeof window === 'undefined') return null;
  const q = new URLSearchParams(window.location.search);
  const ids = q.get('live');
  if (!ids) return null;
  const title = q.get('title') || undefined;
  const since = Number(q.get('since'));
  const startedAt = new Date(Date.now() - (Number.isFinite(since) && since > 0 ? since : 12) * 60000).toISOString();
  const out: LiveStatusFile = {};
  for (const id of ids.split(',')) {
    const key = id.trim() as StreamId;
    if (key === 'kick' || key === 'youtube' || key === 'twitch') out[key] = { live: true, title, startedAt };
  }
  return out;
}

export function normalise(file: LiveStatusFile | null, now = Date.now()): LiveStatus {
  if (!file) return { ...EMPTY_STATUS, ready: true };
  const updated = file.updated ? Date.parse(file.updated) : NaN;
  const fileFresh = !Number.isFinite(updated) || now - updated <= STALE_FILE_MS;

  const live: Partial<Record<StreamId, LiveEntry>> = {};
  let primary: StreamId | null = null;
  for (const p of profiles) {
    if (!p.streams) continue;
    const id = p.id as StreamId;
    const s = file[id];
    if (!s || !s.live) continue;
    const started = s.startedAt ? Date.parse(s.startedAt) : NaN;
    const hasStart = Number.isFinite(started) && started <= now + 60000;
    // A start time vouches for itself; without one the file has to be fresh.
    if (hasStart ? now - started >= STALE_START_MS : !fileFresh) continue;
    live[id] = {
      id,
      title: s.title?.trim() || FALLBACK_TITLE,
      startedAt: hasStart ? started : null,
    };
    if (!primary) primary = id;
  }
  return { ready: true, live, primary, anyLive: primary !== null };
}

/**
 * The live state of the three streaming platforms.
 *
 * `enabled` lets a section wait until it is near the viewport before asking.
 * `pollMs` of 0 asks once. The hook pauses while the tab is hidden and asks
 * again the moment it is visible.
 */
export function useLiveStatus(
  options: { enabled?: boolean; pollMs?: number; source?: LiveSource } = {},
): LiveStatus {
  const { enabled = true, pollMs = 0, source = staticJsonSource } = options;
  const [status, setStatus] = useState<LiveStatus>(EMPTY_STATUS);
  const sourceRef = useRef(source);
  sourceRef.current = source;

  useEffect(() => {
    if (!enabled) return;
    let dead = false;
    let timer = 0;
    let ctl: AbortController | null = null;

    const apply = (file: LiveStatusFile | null) => {
      if (dead) return;
      const next = normalise(file);
      setStatus((prev) => {
        // Keep the same object when nothing changed so nothing downstream re-renders.
        const a = JSON.stringify(prev.live);
        const b = JSON.stringify(next.live);
        return prev.ready && a === b ? prev : next;
      });
    };

    const run = async (first: boolean) => {
      window.clearTimeout(timer);
      const preview = previewFromQuery();
      if (preview) {
        apply(preview);
        return;
      }
      try {
        let file: LiveStatusFile | null;
        if (first && window.__akLive) {
          file = await window.__akLive;
          window.__akLive = undefined;
        } else {
          ctl?.abort();
          ctl = new AbortController();
          file = await sourceRef.current(ctl.signal);
        }
        apply(file);
      } catch {
        // Offline, blocked or malformed: stay on the last known state, or offline.
        if (!dead) setStatus((prev) => (prev.ready ? prev : { ...EMPTY_STATUS, ready: true }));
      }
      if (!dead && pollMs > 0) timer = window.setTimeout(() => run(false), pollMs);
    };

    const onVisible = () => {
      if (!document.hidden && pollMs > 0) run(false);
    };
    document.addEventListener('visibilitychange', onVisible);
    run(true);

    return () => {
      dead = true;
      window.clearTimeout(timer);
      ctl?.abort();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [enabled, pollMs]);

  return status;
}

/** hh:mm:ss, or mm:ss under an hour. Hours can pass 99 on a long stream. */
export function formatElapsed(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const two = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${two(h)}:${two(m)}:${two(sec)}` : `${two(m)}:${two(sec)}`;
}
