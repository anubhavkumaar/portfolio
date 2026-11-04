/* ═══════════════════════════════════════════════════════════════════════════
   GLYPH SPRING

   The one spring the whole site answers with. The hero name was the first
   place it lived; the Connect register, /live/ and stream mode now share it,
   so the end of the page rhymes with the start.

   Same constants as the hero (k 0.09, damping 0.78, radius 220px, push 26px),
   integrated on a fixed 60Hz step so a 120Hz phone and a 30fps OBS source feel
   identical. The loop only runs while something is moving; at rest it stops
   and the inline transform is removed, so a still page costs nothing.

   Writes transforms only. Never reads layout inside the loop.
   ═══════════════════════════════════════════════════════════════════════════ */

export const SPRING = { k: 0.09, damping: 0.78, radius: 220, push: 26 } as const;

const STEP_MS = 1000 / 60;
const MAX_CATCH_UP = 6;

export interface Glyph {
  el: HTMLElement;
  /** Rest centre in page coordinates, from the last measure(). */
  cx: number;
  cy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  /** Fixed steps to wait before this glyph starts to move (stagger). */
  wait: number;
  /** A target that travels instead of jumping: the spring follows it. */
  ramp: { fx: number; fy: number; ex: number; ey: number; i: number; n: number } | null;
}

export interface PushOptions {
  radius?: number;
  push?: number;
}

export interface Spring {
  add(els: ArrayLike<HTMLElement>): Glyph[];
  drop(glyphs: Glyph[]): void;
  /** Re-reads each glyph's rest centre. Call on pointer enter, resize, font load. */
  measure(glyphs: Glyph[]): void;
  /** Eases the glyphs away from a point (page coordinates), like the hero name. */
  push(glyphs: Glyph[], px: number, py: number, opts?: PushOptions): void;
  /** Sends the glyphs back to rest. */
  release(glyphs: Glyph[]): void;
  /** One impulse away from a point: the press response on touch. */
  burst(glyphs: Glyph[], px: number, py: number, speed?: number, radius?: number): void;
  /** Aims one glyph at an offset, optionally after a delay in ms. */
  aim(glyph: Glyph, tx: number, ty: number, delayMs?: number): void;
  /**
   * Moves the target to an offset over a duration and lets the spring follow
   * it. The same spring, but slow: what stream mode uses so motion survives
   * video compression.
   */
  glide(glyph: Glyph, tx: number, ty: number, delayMs: number, durationMs: number): void;
  pause(): void;
  resume(): void;
  destroy(): void;
}

export function createSpring(opts: { k?: number; damping?: number } = {}): Spring {
  const K = opts.k ?? SPRING.k;
  const D = opts.damping ?? SPRING.damping;
  const active = new Set<Glyph>();
  let raf = 0;
  let last = 0;
  let acc = 0;
  let paused = false;
  let dead = false;

  const write = (g: Glyph) => {
    g.el.style.transform = `translate3d(${g.x.toFixed(2)}px, ${g.y.toFixed(2)}px, 0)`;
  };

  const rest = (g: Glyph) => {
    g.x = g.tx;
    g.y = g.ty;
    g.vx = 0;
    g.vy = 0;
    if (g.tx === 0 && g.ty === 0) {
      g.el.style.transform = '';
      g.el.style.willChange = '';
    } else {
      write(g);
    }
  };

  const wake = (g: Glyph) => {
    if (dead) return;
    if (!active.has(g)) {
      g.el.style.willChange = 'transform';
      active.add(g);
    }
    if (!raf && !paused) {
      last = 0;
      acc = 0;
      raf = requestAnimationFrame(frame);
    }
  };

  const frame = (now: number) => {
    raf = 0;
    if (dead || paused) return;
    if (!last) last = now;
    acc += Math.min(now - last, STEP_MS * MAX_CATCH_UP);
    last = now;
    while (acc >= STEP_MS) {
      acc -= STEP_MS;
      active.forEach((g) => {
        if (g.wait > 0) {
          g.wait -= 1;
          return;
        }
        const r = g.ramp;
        if (r) {
          r.i += 1;
          const u = Math.min(1, r.i / r.n);
          const e = 1 - (1 - u) ** 3;
          g.tx = r.fx + (r.ex - r.fx) * e;
          g.ty = r.fy + (r.ey - r.fy) * e;
          if (u >= 1) g.ramp = null;
        }
        g.vx = (g.vx + (g.tx - g.x) * K) * D;
        g.vy = (g.vy + (g.ty - g.y) * K) * D;
        g.x += g.vx;
        g.y += g.vy;
      });
    }
    active.forEach((g) => {
      if (g.wait > 0 || g.ramp) {
        write(g);
        return;
      }
      if (
        Math.abs(g.vx) < 0.02 &&
        Math.abs(g.vy) < 0.02 &&
        Math.abs(g.tx - g.x) < 0.05 &&
        Math.abs(g.ty - g.y) < 0.05
      ) {
        rest(g);
        active.delete(g);
      } else {
        write(g);
      }
    });
    if (active.size) raf = requestAnimationFrame(frame);
  };

  return {
    add(els) {
      const out: Glyph[] = [];
      for (let i = 0; i < els.length; i++) {
        const g: Glyph = { el: els[i], cx: 0, cy: 0, x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, wait: 0, ramp: null };
        out.push(g);
      }
      return out;
    },
    drop(glyphs) {
      for (const g of glyphs) {
        active.delete(g);
        g.el.style.transform = '';
        g.el.style.willChange = '';
      }
    },
    measure(glyphs) {
      const sx = window.scrollX;
      const sy = window.scrollY;
      for (const g of glyphs) {
        const r = g.el.getBoundingClientRect();
        // Remove the glyph's own displacement so this is always the rest centre.
        g.cx = r.left + r.width / 2 + sx - g.x;
        g.cy = r.top + r.height / 2 + sy - g.y;
      }
    },
    push(glyphs, px, py, o = {}) {
      const radius = o.radius ?? SPRING.radius;
      const amount = o.push ?? SPRING.push;
      for (const g of glyphs) {
        const dx = g.cx - px;
        const dy = g.cy - py;
        const d = Math.hypot(dx, dy);
        let tx = 0;
        let ty = 0;
        if (d < radius && d > 0.001) {
          const f = (1 - d / radius) ** 2 * amount;
          tx = (dx / d) * f;
          ty = (dy / d) * f;
        }
        if (tx !== g.tx || ty !== g.ty) {
          g.tx = tx;
          g.ty = ty;
          wake(g);
        }
      }
    },
    release(glyphs) {
      for (const g of glyphs) {
        g.ramp = null;
        if (g.tx !== 0 || g.ty !== 0) {
          g.tx = 0;
          g.ty = 0;
          wake(g);
        }
      }
    },
    burst(glyphs, px, py, speed = 11, radius = 260) {
      for (const g of glyphs) {
        const dx = g.cx - px;
        const dy = g.cy - py;
        const d = Math.hypot(dx, dy) || 1;
        // Falloff is gentle so the whole word moves; the nearest glyphs move most.
        const f = Math.max(0.28, 1 - d / (radius * 2));
        g.ramp = null;
        g.vx += (dx / d) * speed * f;
        g.vy += (dy / d) * speed * f * 0.7;
        g.tx = 0;
        g.ty = 0;
        wake(g);
      }
    },
    aim(g, tx, ty, delayMs = 0) {
      g.ramp = null;
      g.tx = tx;
      g.ty = ty;
      g.wait = Math.round(delayMs / STEP_MS);
      wake(g);
    },
    glide(g, tx, ty, delayMs, durationMs) {
      g.ramp = { fx: g.tx, fy: g.ty, ex: tx, ey: ty, i: 0, n: Math.max(1, Math.round(durationMs / STEP_MS)) };
      g.wait = Math.round(delayMs / STEP_MS);
      wake(g);
    },
    pause() {
      paused = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    },
    resume() {
      if (!paused) return;
      paused = false;
      if (active.size && !raf) {
        last = 0;
        acc = 0;
        raf = requestAnimationFrame(frame);
      }
    },
    destroy() {
      dead = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      active.forEach((g) => {
        g.el.style.transform = '';
        g.el.style.willChange = '';
      });
      active.clear();
    },
  };
}
