/**
 * Keyframes for the Work intro (Orbit.dc.html, MWork.dc.html): about 20 small
 * thumbnails, always facing the viewer, gather into a sphere, turn, then file
 * into the drawer. The design generated these per card from a Fibonacci sphere;
 * this is the same formula, so the motion matches.
 *
 *   y0 = i*(2/N) - 1 + 1/N;  lat = asin(y0);  lon = (i*137.508) % 360
 *   pose(L, r, s) = [centre] rotateY(L) rotateX(lat) translateZ(r)
 *                   rotateX(-lat) rotateY(-L) rotateX(tilt) scale(s)
 *   0%   opacity 0, pose(lon - 30, far, s0)
 *   12%  opacity 1
 *   36%  pose(lon + 20, near, s1)
 *   64%  pose(lon + 75, near, s1), then on to the card's rest transform
 */

export type OrbitSpec = {
  /** Keyframe name prefix: `${prefix}${i}`. */
  prefix: string;
  /** Prepended to every pose, e.g. translate3d(-317px,-236px,0). */
  centre?: string;
  far: number;
  near: number;
  s0: number;
  s1: number;
  tilt: number;
};

/** Desktop drawer, from Orbit.dc.html. */
export const DESKTOP_ORBIT: OrbitSpec = {
  prefix: 'akF',
  centre: 'translate3d(-317px,-236px,0)',
  far: 620,
  near: 240,
  s0: 0.16,
  s1: 0.26,
  tilt: 18,
};

/** Phone sphere, from MWork.dc.html. */
export const PHONE_ORBIT: OrbitSpec = { prefix: 'akP', far: 320, near: 125, s0: 0.12, s1: 0.34, tilt: 12 };

const f1 = (n: number) => n.toFixed(1);

export function orbitCss(n: number, spec: OrbitSpec): string {
  const { prefix, centre, far, near, s0, s1, tilt } = spec;
  let css = '';
  for (let i = 0; i < n; i++) {
    const y0 = i * (2 / n) - 1 + 1 / n;
    const lat = (Math.asin(y0) * 180) / Math.PI;
    const lon = (i * 137.508) % 360;
    const pose = (L: number, r: number, s: number) =>
      `${centre ? centre + ' ' : ''}rotateY(${f1(L)}deg) rotateX(${f1(lat)}deg) translateZ(${r}px) rotateX(${f1(-lat)}deg) rotateY(${f1(-L)}deg) rotateX(${tilt}deg) scale(${s})`;
    css +=
      `@keyframes ${prefix}${i}{` +
      `0%{opacity:0;transform:${pose(lon - 30, far, s0)};animation-timing-function:cubic-bezier(.16,1,.3,1)}` +
      `12%{opacity:1}` +
      `36%{transform:${pose(lon + 20, near, s1)};animation-timing-function:linear}` +
      `64%{opacity:1;transform:${pose(lon + 75, near, s1)};animation-timing-function:cubic-bezier(.7,0,.2,1)}` +
      `}\n`;
  }
  return css;
}
