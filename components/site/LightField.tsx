'use client';

import { useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   LIGHT FIELD

   The living light behind the landing: two slow bands of colour, blue and
   violet, drifting through a warped noise field over the ground, with a soft
   bloom that follows the pointer. It is the atmosphere Raycast and Cursor
   carry, done as material rather than a static gradient: it moves, it answers
   the cursor, and it is dim enough that the name and the console sit on it.

   Raw WebGL2, one triangle, one fragment shader, a few KB. DPR capped at 1.5,
   paused when scrolled away or the tab is hidden, and under reduced motion it
   draws one frame and stops so the composition survives without movement.
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
  vec2 p = vec2(uv.x * aspect, uv.y);
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
  float d = distance(p, m);
  float bloom = exp(-d * d * 3.2) * 0.55;

  float dark = 1.0 - u_light;

  // Dark: light is added to the ground. Light: adding light to a white ground
  // goes nowhere, so the ground is stained toward the same two colours
  // instead, at a strength that reads as the same clouds.
  // Dark: light is added to the ground, and where a band runs strong the
  // cloud goes luminous, lifting toward a pale blue, so it has the same
  // structure the light theme gets from staining white.
  vec3 col = u_bg;
  col += u_a * (band1 * 0.95 + bloom * 0.7) * 0.62;
  col += u_b * (band2 * 0.85) * 0.55;
  float core = smoothstep(0.45, 1.0, band1) * 0.5 + smoothstep(0.5, 1.0, band2) * 0.35;
  col += vec3(0.62, 0.74, 1.0) * core * 0.38;
  vec3 lit = u_bg;
  lit = mix(lit, u_a, clamp(band1 * 0.62 + bloom * 0.42, 0.0, 0.85));
  lit = mix(lit, u_b, band2 * 0.5);
  col = mix(col, lit, u_light);

  // Fade to the ground toward the bottom so the page takes over cleanly.
  float fade = smoothstep(0.0, 0.42, uv.y);
  col = mix(u_bg, col, fade);

  // Subtle dither to keep the bands from posterising on 8-bit displays.
  col += (hash(gl_FragCoord.xy) - 0.5) * (1.0 / 255.0) * (1.0 + dark);
  o = vec4(col, 1.0);
}
`;

function cssRGB(name: string, fallback: [number, number, number]): [number, number, number] {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const m = v.match(/^#([0-9a-f]{6})$/i);
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function LightField() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    // Fresh canvas per effect run: a context released in cleanup is handed
    // back by getContext on the same element, which breaks StrictMode's
    // second mount in development.
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    el.appendChild(canvas);

    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) {
      canvas.remove();
      return;
    }

    const phone = window.matchMedia('(max-width: 800px), (pointer: coarse)').matches;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('LightField shader:', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    // Phones take three noise octaves instead of five: the field reads the
    // same at that size and the fragment cost drops by roughly a third.
    const fs = compile(gl.FRAGMENT_SHADER, phone ? FRAG.replace('i < 5', 'i < 3') : FRAG);
    if (!vs || !fs) {
      canvas.remove();
      return;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.remove();
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = {
      res: gl.getUniformLocation(prog, 'u_res'),
      time: gl.getUniformLocation(prog, 'u_time'),
      mouse: gl.getUniformLocation(prog, 'u_mouse'),
      bg: gl.getUniformLocation(prog, 'u_bg'),
      a: gl.getUniformLocation(prog, 'u_a'),
      b: gl.getUniformLocation(prog, 'u_b'),
      light: gl.getUniformLocation(prog, 'u_light'),
    };

    let w = 0;
    let h = 0;
    const dprOf = () => Math.min(window.devicePixelRatio || 1, phone ? 1 : 1.5);
    const resize = () => {
      const r = el.getBoundingClientRect();
      const dpr = dprOf();
      w = Math.max(1, Math.round(r.width * dpr));
      h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const syncTheme = () => {
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      gl.uniform3fv(U.bg, cssRGB('--bg', [0.04, 0.047, 0.063]));
      gl.uniform3fv(U.a, cssRGB('--accent', [0.357, 0.624, 1]));
      gl.uniform3fv(U.b, cssRGB('--accent-2', [0.486, 0.361, 1]));
      gl.uniform1f(U.light, light ? 1 : 0);
    };
    syncTheme();
    const mo = new MutationObserver(syncTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    let tx = 0;
    let ty = 0;
    let mx = 0;
    let my = 0;
    let seeded = false;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = r.height - (e.clientY - r.top);
      if (!seeded) {
        mx = tx;
        my = ty;
        seeded = true;
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    const io = new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
    });
    io.observe(el);
    const onVis = () => {
      visible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVis);

    const start = performance.now();
    let frame = 0;
    const draw = (now: number) => {
      resize();
      const dpr = dprOf();
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      gl.uniform2f(U.res, w, h);
      gl.uniform1f(U.time, reduced ? 30 : (now - start) / 1000);
      gl.uniform2f(U.mouse, seeded ? mx * dpr : w * 0.7, seeded ? my * dpr : h * 0.6);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    if (reduced) {
      requestAnimationFrame(draw);
    } else {
      const loop = (now: number) => {
        if (visible) draw(now);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    }
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      mo.disconnect();
      io.disconnect();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    };
  }, []);

  return <div ref={host} className="hero__field" aria-hidden="true" />;
}
