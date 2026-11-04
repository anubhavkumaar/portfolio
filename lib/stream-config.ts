import { filterProfiles, type Profile } from '@/content/profiles';

/* ═══════════════════════════════════════════════════════════════════════════
   STREAM CONFIG

   Everything an OBS browser source can ask for is in the URL, so a scene is
   one address and nothing needs a server:

     /stream/                         the cycle, field behind it
     /stream/?scene=starting          countdown and cycle   (&min=10 or &to=20:30)
     /stream/?scene=brb               "Back soon"
     /stream/?scene=ending            "Thanks for watching"
     /stream/?bg=transparent          no field, no ground: for a plate of your own
     /stream/?only=social             cycle just the seven Social profiles
     /stream/?hold=8                  seconds each name stays (3 to 30, default 6)
     /stream/?start=2                 begin on the third name instead of the first
     /stream/?motion=full             animate even if the OS asks for reduced motion
     /stream/lower/                   the 1920 by 200 lower third (&plate=1 adds a ground)

   Pure functions so the parsing can be checked without a browser.
   ═══════════════════════════════════════════════════════════════════════════ */

export type Scene = 'cycle' | 'starting' | 'brb' | 'ending';

export interface StreamConfig {
  scene: Scene;
  transparent: boolean;
  profiles: readonly Profile[];
  holdMs: number;
  motion: 'auto' | 'full';
  /** Epoch ms the countdown runs to. Only set for the starting scene. */
  countdownTo: number | null;
  plate: boolean;
  /** Which name the cycle begins on, 0 based. Handy for previewing one platform. */
  startAt: number;
  /** Seconds of field time to start from, so a frame can be found again. */
  fieldStart: number;
}

const SCENES: readonly Scene[] = ['cycle', 'starting', 'brb', 'ending'];

/** "20:30" means the next 20:30 today; an ISO string is taken as written. */
export function parseTarget(v: string, now: number): number | null {
  const hm = /^(\d{1,2}):(\d{2})$/.exec(v);
  if (hm) {
    const d = new Date(now);
    d.setHours(Number(hm[1]), Number(hm[2]), 0, 0);
    // A time that passed long ago means tomorrow's; one that passed minutes ago just reads 0:00.
    if (d.getTime() < now - 6 * 3600_000) d.setDate(d.getDate() + 1);
    return d.getTime();
  }
  const t = Date.parse(v);
  return Number.isFinite(t) ? t : null;
}

export function parseStreamConfig(search: string, now: number = Date.now(), lower = false): StreamConfig {
  const q = new URLSearchParams(search);
  const sceneRaw = q.get('scene') as Scene | null;
  const scene: Scene = !lower && sceneRaw && SCENES.includes(sceneRaw) ? sceneRaw : 'cycle';

  const holdRaw = Number(q.get('hold'));
  const base = lower ? 5 : 6;
  const hold = Number.isFinite(holdRaw) && holdRaw > 0 ? Math.min(30, Math.max(3, holdRaw)) : base;

  let countdownTo: number | null = null;
  if (scene === 'starting') {
    const to = q.get('to');
    const min = Number(q.get('min'));
    if (to) countdownTo = parseTarget(to, now);
    if (countdownTo == null && Number.isFinite(min) && min > 0) countdownTo = now + min * 60_000;
    if (countdownTo == null) countdownTo = now + 5 * 60_000;
  }

  const t = Number(q.get('t'));
  return {
    scene,
    transparent: lower || q.get('bg') === 'transparent',
    profiles: filterProfiles(q.get('only')),
    holdMs: hold * 1000,
    motion: q.get('motion') === 'full' ? 'full' : 'auto',
    countdownTo,
    plate: q.get('plate') === '1',
    startAt: Number.isInteger(Number(q.get('start'))) ? Math.max(0, Number(q.get('start'))) : 0,
    fieldStart: Number.isFinite(t) && t > 0 ? t : 0,
  };
}

/** 4:32 under an hour, 1:04:32 over. Never negative. */
export function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const two = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${two(m)}:${two(sec)}` : `${two(m)}:${two(sec)}`;
}
