/* ═══════════════════════════════════════════════════════════════════════════
   LIGHT FIELD

   The living light: two slow bands of colour, blue and violet, drifting
   through a warped noise field over the ground, with a soft bloom that
   follows the pointer. It is the atmosphere Raycast and Cursor carry, done as
   material rather than a static gradient: it moves, it answers the visitor,
   and it is dim enough that type sits on it.

   Raw WebGL2, one triangle, one fragment shader. This module owns the shader
   and a small controller, so the landing, Connect, /live/ and stream mode all
   run the same light:

     - mood      speed and brightness, eased, with a slow breath
     - pulse     a bloom from a point that opens and fades (a tap)
     - drift     a slow slide of the noise domain (stream mode, tilt)
     - pointer   the lagging bloom, from mouse or touch

   Every extra uniform is neutral at its default, so the landing renders
   exactly what it did before the controller existed.

   Quality: DPR capped at 1.5 (1 on phones, with three noise octaves). A
   frame-time watcher lowers the render scale on a slow device, never below
   half: the field is smooth enough that half resolution reads the same.
   Paused when offscreen, hidden, or told to; one frame under reduced motion;
   rebuilt after a lost GL context so a source that runs for hours survives a
   GPU reset.
   ═══════════════════════════════════════════════════════════════════════════ */

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;
out vec4 o;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform vec3  u_bg;
uniform vec3  u_a;   // accent blue
uniform vec3  u_b;   // violet
uniform float u_light; // 1 on the light theme, 0 on dark
uniform float u_gain;  // brightness of the light over the ground (1 = as designed)
uniform float u_fade;  // 1 fades the field to the ground at the bottom, 0 keeps it full height
uniform vec2  u_drift; // slide of the noise domain
uniform vec4  u_pulse[2]; // x, y, radius, amplitude
uniform vec2  u_quiet; // strength, and how far from the left edge (0 to 1) the quiet zone reaches; 0 strength is off

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 ps = vec2(uv.x * aspect, uv.y);   // screen space: bloom and pulses
  vec2 p = ps + u_drift;                 // noise space: the clouds
  float t = u_time * 0.045;

  // Slow domain warp. This is what stops it reading as a gradient.
  vec2 q = vec2(fbm(p * 0.9 + vec2(0.0, t)), fbm(p * 0.9 + vec2(4.1, -t * 0.8)));
  vec2 r = vec2(fbm(p * 1.1 + 2.2 * q + vec2(1.3, 7.2) + t * 0.5),
                fbm(p * 1.1 + 2.2 * q + vec2(6.7, 2.1) - t * 0.35));
  float f = fbm(p * 1.3 + 1.8 * r);

  // Two bands of light, weighted toward the upper right so the name on the
  // left sits on the quiet part of the field.
  float band1 = smoothstep(0.42, 0.78, f) * smoothstep(0.1, 0.9, uv.x + uv.y * 0.4);
  float band2 = smoothstep(0.55, 0.9, fbm(p * 1.6 - 1.4 * r + t * 0.3)) * smoothstep(0.0, 0.8, uv.y);

  // Pointer bloom: soft, wide, and lagging (the JS smooths the position).
  vec2 m = vec2(u_mouse.x / u_res.y, u_mouse.y / u_res.y);
  float d = distance(ps, m);
  float bloom = exp(-d * d * 3.2) * 0.55;

  // Pulses: a tap blooms from its point, a ring opens outward and fades.
  float pl = 0.0;
  for (int i = 0; i < 2; i++) {
    vec4 pu = u_pulse[i];
    if (pu.w > 0.001) {
      float pd = distance(ps, pu.xy);
      float rr = max(pu.z, 0.001);
      float core = exp(-(pd * pd) / (rr * rr * 0.9 + 0.004));
      float rd = (pd - rr) / 0.075;
      pl += (core * 0.55 + exp(-rd * rd) * 0.7) * pu.w;
    }
  }

  float dark = 1.0 - u_light;

  // Dark: light is added to the ground, and where a band runs strong the
  // cloud goes luminous, lifting toward a pale blue, so it has the same
  // structure the light theme gets from staining white. Light: adding light
  // to a white ground goes nowhere, so the ground is stained toward the same
  // two colours instead, at a strength that reads as the same clouds.
  vec3 col = u_bg;
  col += u_a * (band1 * 0.95 + bloom * 0.7 + pl * 0.8) * 0.62;
  col += u_b * (band2 * 0.85) * 0.55;
  float core = smoothstep(0.45, 1.0, band1) * 0.5 + smoothstep(0.5, 1.0, band2) * 0.35;
  col += vec3(0.62, 0.74, 1.0) * core * 0.38;
  vec3 lit = u_bg;
  lit = mix(lit, u_a, clamp(band1 * 0.62 + bloom * 0.42 + pl * 0.4, 0.0, 0.85));
  lit = mix(lit, u_b, band2 * 0.5);
  col = mix(col, lit, u_light);

  // Mood: the same light, more or less of it.
  // Quiet zone: dims the light toward the left edge, where a column of type sits.
  float quiet = 1.0 - u_quiet.x * (1.0 - smoothstep(0.0, max(u_quiet.y, 0.001), uv.x));
  col = u_bg + (col - u_bg) * u_gain * quiet;

  // Fade to the ground toward the bottom so the page takes over cleanly.
  float fade = smoothstep(0.0, 0.42, uv.y);
  col = mix(u_bg, col, mix(1.0, fade, u_fade));

  // Subtle dither to keep the bands from posterising on 8-bit displays.
  col += (hash(gl_FragCoord.xy) - 0.5) * (1.0 / 255.0) * (1.0 + dark);
  o = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

function cssRGB(name: string, fallback: [number, number, number]): [number, number, number] {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const m = v.match(/^#([0-9a-f]{6})$/i);
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export interface FieldOptions {
  /** 'auto' picks phone settings on small or coarse-pointer devices. */
  quality?: 'auto' | 'phone' | 'desktop';
  /** Follow touches as well as the mouse. The landing does not; /live/ does. */
  touch?: boolean;
  /** Keep the field at full height instead of fading to the ground at the bottom. */
  fullHeight?: boolean;
  /** Starting render scale, 0.5 to 1. The frame-time watcher can only lower it. */
  renderScale?: number;
  /** Where the bloom rests before any pointer has been seen, as fractions of the host. */
  restAt?: [number, number];
  /** Animate even when the system asks for reduced motion. For an OBS source whose host OS has animations switched off. */
  ignoreReducedMotion?: boolean;
  /** Dims the light toward the left edge so a column of type there keeps its contrast. `strength` 0 to 1, `reach` is how far across (0 to 1) the dimming lasts. Off by default. */
  quiet?: { strength: number; reach: number };
  /** Seconds of field time to start from. The clouds are a function of time, so this picks which ones. */
  startAt?: number;
  /** Compile the shader off the main thread where the browser can (KHR_parallel_shader_compile), so a slow GPU or driver cannot freeze a tap. The first frame then lands a few frames late; pair it with `onFirstFrame`. Elsewhere it compiles at once, as before. */
  asyncCompile?: boolean;
  /** Called once, after the first frame has been drawn. The moment to fade the canvas in. */
  onFirstFrame?: () => void;
  /** Skip the field on a browser whose only GL is software (no GPU, a blocklisted driver, a headless audit). A full-screen noise shader there costs more than the light is worth. */
  requireGpu?: boolean;
}

export interface FieldController {
  /** Moves the pointer bloom. Client coordinates. */
  setPointer(clientX: number, clientY: number, snap?: boolean): void;
  /** Opens a bloom from a point. Client coordinates. */
  pulse(clientX: number, clientY: number, strength?: number): void;
  /** Sets the target mood. Speed and gain ease toward it; breath is a slow swell of the gain. */
  setMood(mood: { speed?: number; gain?: number; breathRate?: number; breathDepth?: number }, easePerSecond?: number): void;
  /** Slides the noise domain toward an offset, easing over a couple of seconds. */
  setDrift(x: number, y: number, easePerSecond?: number): void;
  /** Small immediate shift from device tilt, added on top of the drift. */
  setTilt(x: number, y: number): void;
  /** Stops drawing and the frame loop (an OBS source hidden, a tab in the background). */
  setActive(active: boolean): void;
  /** Draws one frame now. For the reduced-motion field after a mood change. */
  redraw(): void;
  destroy(): void;
}

interface PulseSlot {
  x: number;
  y: number;
  t0: number;
  amp: number;
}

/** True when the browser is drawing GL on the CPU: SwiftShader, llvmpipe, a driver-less fallback. */
function isSoftwareGL(gl: WebGL2RenderingContext) {
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  if (!info) return false;
  return /swiftshader|llvmpipe|softpipe|software|basic render|microsoft basic/i.test(String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)));
}

export function createLightField(host: HTMLElement, options: FieldOptions = {}): FieldController | null {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches && !options.ignoreReducedMotion;
  const small = window.matchMedia('(max-width: 800px), (pointer: coarse)').matches;
  const phone = options.quality === 'phone' || (options.quality !== 'desktop' && small);

  // Fresh canvas per run: a context released in cleanup is handed back by
  // getContext on the same element, which breaks StrictMode's second mount.
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: false,
    powerPreference: 'high-performance',
    failIfMajorPerformanceCaveat: !!options.requireGpu,
  });
  if (!gl || (options.requireGpu && isSoftwareGL(gl))) {
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    canvas.remove();
    return null;
  }

  type Program = {
    prog: WebGLProgram;
    U: Record<'res' | 'time' | 'mouse' | 'bg' | 'a' | 'b' | 'light' | 'gain' | 'fade' | 'drift' | 'pulse' | 'quiet', WebGLUniformLocation | null>;
  };
  type Building = { prog: WebGLProgram; vs: WebGLShader; fs: WebGLShader };
  let program: Program | null = null;
  let building: Building | null = null;

  /** Hands the source to the driver. With the parallel-compile extension this returns at once and the work happens elsewhere. */
  const begin = (): Building => {
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    // Phones take three noise octaves instead of five: the field reads the
    // same at that size and the fragment cost drops by roughly a third.
    const fs = compile(gl.FRAGMENT_SHADER, phone ? FRAG.replace('i < 5', 'i < 3') : FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    return { prog, vs, fs };
  };

  /** Asking for a status waits for the driver. Do it when it is done, or when nothing else is waiting on the page. */
  const finish = ({ prog, vs, fs }: Building): Program | null => {
    for (const s of [vs, fs]) {
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('LightField shader:', gl.getShaderInfoLog(s));
        return null;
      }
    }
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    return {
      prog,
      U: {
        res: u('u_res'),
        time: u('u_time'),
        mouse: u('u_mouse'),
        bg: u('u_bg'),
        a: u('u_a'),
        b: u('u_b'),
        light: u('u_light'),
        gain: u('u_gain'),
        fade: u('u_fade'),
        drift: u('u_drift'),
        pulse: u('u_pulse'),
        quiet: u('u_quiet'),
      },
    };
  };

  const build = () => finish(begin());

  const parallel = options.asyncCompile ? gl.getExtension('KHR_parallel_shader_compile') : null;
  if (parallel) {
    building = begin();
  } else {
    program = build();
    if (!program) {
      canvas.remove();
      return null;
    }
  }

  // ── sizing ────────────────────────────────────────────────────────────────
  let scale = Math.min(1, Math.max(0.5, options.renderScale ?? 1));
  let w = 0;
  let h = 0;
  const dprOf = () => Math.min(window.devicePixelRatio || 1, phone ? 1 : 1.5) * scale;
  const resize = () => {
    const r = host.getBoundingClientRect();
    const dpr = dprOf();
    w = Math.max(1, Math.round(r.width * dpr));
    h = Math.max(1, Math.round(r.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };

  // ── theme ─────────────────────────────────────────────────────────────────
  const syncTheme = () => {
    if (!program) return;
    const U = program.U;
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    gl.uniform3fv(U.bg, cssRGB('--bg', [0.04, 0.047, 0.063]));
    gl.uniform3fv(U.a, cssRGB('--accent', [0.357, 0.624, 1]));
    gl.uniform3fv(U.b, cssRGB('--accent-2', [0.486, 0.361, 1]));
    gl.uniform1f(U.light, light ? 1 : 0);
    gl.uniform1f(U.fade, options.fullHeight ? 0 : 1);
    gl.uniform2f(U.quiet, options.quiet?.strength ?? 0, options.quiet?.reach ?? 0.5);
  };
  syncTheme();
  const mo = new MutationObserver(() => {
    syncTheme();
    if (reduced) redraw();
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ── state ─────────────────────────────────────────────────────────────────
  let ptx = 0;
  let pty = 0;
  let pmx = 0;
  let pmy = 0;
  let seeded = false;

  const mood = { speed: 1, gain: 1, breathRate: 0, breathDepth: 0 };
  const moodT = { speed: 1, gain: 1, breathRate: 0, breathDepth: 0 };
  let moodEase = 1.6;
  let drift = { x: 0, y: 0 };
  let driftT = { x: 0, y: 0 };
  let driftEase = 0.7;
  let tilt = { x: 0, y: 0 };
  let simT = options.startAt ?? 0;
  const pulses: PulseSlot[] = [];
  const pulseBuf = new Float32Array(8);

  const toLocal = (clientX: number, clientY: number) => {
    const r = host.getBoundingClientRect();
    return { x: clientX - r.left, y: r.height - (clientY - r.top) };
  };

  const setPointer = (clientX: number, clientY: number, snap = false) => {
    const l = toLocal(clientX, clientY);
    ptx = l.x;
    pty = l.y;
    if (!seeded || snap) {
      pmx = ptx;
      pmy = pty;
      seeded = true;
    }
  };

  // ── draw ──────────────────────────────────────────────────────────────────
  let lastNow = 0;
  let slowFor = 0;
  let drawn = false;

  /** True once there is a program to draw with. While a parallel compile is still out, it polls without waiting. */
  const settle = () => {
    if (program) return true;
    if (!building) return false;
    if (parallel && !gl.getProgramParameter(building.prog, parallel.COMPLETION_STATUS_KHR)) return false;
    program = finish(building);
    building = null;
    if (!program) {
      // The driver refused it. Leave the page as it is without the light.
      active = false;
      canvas.remove();
      return false;
    }
    syncTheme();
    return true;
  };

  const draw = (now: number) => {
    if (!settle() || !program) {
      // The reduced-motion field has no loop to come back on, so it asks again itself.
      if (reduced && building) requestAnimationFrame(draw);
      return;
    }
    const dt = lastNow ? Math.min(0.1, Math.max(0, (now - lastNow) / 1000)) : 1 / 60;
    lastNow = now;

    // Adaptive resolution: if frames keep coming in over ~28ms, lower the scale.
    if (!reduced) {
      if (dt > 0.028) slowFor += dt;
      else slowFor = Math.max(0, slowFor - dt * 0.5);
      if (slowFor > 1.2 && scale > 0.5) {
        scale = Math.max(0.5, scale * 0.8);
        slowFor = 0;
      }
    }

    resize();
    const U = program.U;
    const dpr = dprOf();

    const ease = (rate: number) => 1 - Math.exp(-dt * rate);
    const em = ease(moodEase);
    mood.speed += (moodT.speed - mood.speed) * em;
    mood.gain += (moodT.gain - mood.gain) * em;
    mood.breathRate += (moodT.breathRate - mood.breathRate) * em;
    mood.breathDepth += (moodT.breathDepth - mood.breathDepth) * em;
    simT += dt * mood.speed;

    const ed = ease(driftEase);
    drift.x += (driftT.x - drift.x) * ed;
    drift.y += (driftT.y - drift.y) * ed;

    // Same lag as the original (0.06 a frame at 60fps), now frame-rate independent.
    const ep = 1 - Math.pow(1 - 0.06, dt * 60);
    pmx += (ptx - pmx) * ep;
    pmy += (pty - pmy) * ep;

    const breath = reduced ? 0 : Math.sin(simT * mood.breathRate * 6.2831853) * mood.breathDepth;
    const gain = Math.max(0, mood.gain * (1 + breath));

    // Retire spent pulses, then let the two newest fill the two shader slots.
    for (let i = pulses.length - 1; i >= 0; i--) {
      if (pulses[i].amp * Math.exp(-((now - pulses[i].t0) / 1000) * 2.1) < 0.01) pulses.splice(i, 1);
    }
    pulseBuf.fill(0);
    for (let k = 0; k < 2; k++) {
      const s = pulses[pulses.length - 1 - k];
      if (!s) break;
      const age = (now - s.t0) / 1000;
      const amp = s.amp * Math.exp(-age * 2.1);
      pulseBuf[k * 4] = (s.x * dpr) / h;
      pulseBuf[k * 4 + 1] = (s.y * dpr) / h;
      pulseBuf[k * 4 + 2] = 0.05 + age * 0.34;
      pulseBuf[k * 4 + 3] = amp;
    }

    gl.uniform2f(U.res, w, h);
    gl.uniform1f(U.time, reduced ? 30 : simT);
    gl.uniform2f(U.mouse, seeded ? pmx * dpr : w * (options.restAt?.[0] ?? 0.7), seeded ? pmy * dpr : h * (options.restAt?.[1] ?? 0.6));
    gl.uniform1f(U.gain, gain);
    gl.uniform2f(U.drift, drift.x + tilt.x, drift.y + tilt.y);
    gl.uniform4fv(U.pulse, pulseBuf);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!drawn) {
      drawn = true;
      options.onFirstFrame?.();
    }
  };

  const redraw = () => {
    if (reduced) {
      // Reduced motion: no loop. Snap every eased value so the frame is the target state.
      mood.speed = moodT.speed;
      mood.gain = moodT.gain;
      mood.breathRate = 0;
      mood.breathDepth = 0;
      drift = { ...driftT };
    }
    requestAnimationFrame(draw);
  };

  // ── loop ──────────────────────────────────────────────────────────────────
  let frame = 0;
  let visible = true;
  let active = true;
  let lost = false;
  const loop = (now: number) => {
    frame = 0;
    if (!active || lost) return;
    if (visible && !document.hidden) draw(now);
    frame = requestAnimationFrame(loop);
  };
  const start = () => {
    if (reduced || frame || !active || lost) return;
    lastNow = 0;
    frame = requestAnimationFrame(loop);
  };

  const io = new IntersectionObserver((es) => {
    visible = es[0].isIntersecting;
  });
  io.observe(host);

  const onVis = () => {
    if (!document.hidden) start();
  };
  document.addEventListener('visibilitychange', onVis);

  // ── pointer ───────────────────────────────────────────────────────────────
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch' && options.touch) return; // touch events carry it
    setPointer(e.clientX, e.clientY);
  };
  const onTouch = (e: TouchEvent) => {
    const t = e.touches[0];
    if (t) setPointer(t.clientX, t.clientY);
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  if (options.touch) {
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
  }
  window.addEventListener('resize', resize);

  // ── context loss: a source that runs for hours will see a GPU reset ───────
  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };
  const onRestored = () => {
    building = null;
    program = build();
    if (!program) return;
    syncTheme();
    lost = false;
    canvas.width = 0; // force the viewport to be set again
    if (reduced) redraw();
    else start();
  };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  if (reduced) redraw();
  else start();

  return {
    setPointer,
    pulse(clientX, clientY, strength = 1) {
      // The reduced-motion field is one frozen frame; a bloom drawn into it would never fade.
      if (reduced) return;
      const l = toLocal(clientX, clientY);
      pulses.push({ x: l.x, y: l.y, t0: performance.now(), amp: strength });
      if (pulses.length > 6) pulses.shift();
    },
    setMood(m, easePerSecond) {
      if (m.speed !== undefined) moodT.speed = m.speed;
      if (m.gain !== undefined) moodT.gain = m.gain;
      if (m.breathRate !== undefined) moodT.breathRate = m.breathRate;
      if (m.breathDepth !== undefined) moodT.breathDepth = m.breathDepth;
      if (easePerSecond !== undefined) moodEase = easePerSecond;
      if (reduced) redraw();
    },
    setDrift(x, y, easePerSecond) {
      driftT = { x, y };
      if (easePerSecond !== undefined) driftEase = easePerSecond;
      if (reduced) redraw();
    },
    setTilt(x, y) {
      tilt = { x, y };
    },
    setActive(next) {
      active = next;
      if (next) start();
      else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    redraw,
    destroy() {
      active = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      mo.disconnect();
      io.disconnect();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    },
  };
}
