// Share cards (redesign/design-src/OgCard.dc.html): 1200 x 630 JPEGs for the home
// page and each of the 20 case studies, written to public/og/.
//
//   npm run og
//
// The card is drawn as plain HTML and screenshotted in headless Edge or Chrome,
// so it needs no build and no network. It reads the projects from
// content/portfolio.ts, the covers from public/redesign and the faces from
// assets/og (the site's own Bricolage Grotesque, Manrope and Azeret Mono, plus
// Instrument Serif italic for the one-line ledes). Run it after changing a
// project's title, lede, cover or group, then commit the PNGs.
//
// Why not next/og: its font loader fails on Windows ("Invalid URL"), which would
// break `npm run build` on a Windows machine.
//
// Set EDGE_PATH or CHROME_PATH if the browser is not in a default location.

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ACC, ORDER, PROJECTS } from '../content/portfolio.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'og');
const PORT = 9341;
const DEBUG_PORT = 9342;

const BROWSERS = [
  process.env.EDGE_PATH,
  process.env.CHROME_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);
const browser = BROWSERS.find((p) => existsSync(p));
if (!browser) throw new Error('No Edge or Chrome found. Set EDGE_PATH or CHROME_PATH.');

const FONTS = [
  ['Bricolage', 'bricolage-700.woff', 'normal', 700],
  ['Manrope', 'manrope-700.woff', 'normal', 700],
  ['Instrument Serif', 'instrument-serif-italic.woff', 'italic', 400],
  ['Azeret Mono', 'azeret-mono-500.woff', 'normal', 500],
];

const cards = [
  {
    id: 'home',
    bg: '/redesign/media/smoke-dark-phone.jpg',
    pos: 'center',
    glow: 'rgba(47,85,232,.35)',
    kicker: 'PORTFOLIO',
    title: 'Anubhav Kumar',
    size: 92,
    lede: 'GenAI engineer: agents, MCP tools and RAG in production.',
    badge: 'Open to GenAI roles',
    dot: '#3ccf7a',
  },
  ...ORDER.map((id) => {
    const p = PROJECTS[id];
    const a = ACC[p.group][1];
    return {
      id,
      bg: p.cover,
      pos: 'right center',
      glow: `${a}44`,
      kicker: `${p.group.toUpperCase()}, ${p.year}`,
      title: p.title,
      size: p.title.length > 18 ? 64 : 80,
      lede: p.lede,
      badge: 'Case study',
      dot: a,
    };
  }),
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const page = (c) => `<!doctype html><html><head><meta charset="utf-8"><style>
${FONTS.map(([name, file, style, weight]) => `@font-face{font-family:'${name}';src:url('/__fonts/${file}') format('woff');font-style:${style};font-weight:${weight}}`).join('\n')}
body{margin:0}
.card{position:relative;width:1200px;height:630px;overflow:hidden;background:#070b16;color:#eef2fb;font-family:'Manrope',system-ui,sans-serif}
.abs{position:absolute}
</style></head><body>
<div class="card">
  <img class="abs" src="${c.bg}" alt="" style="inset:0;width:100%;height:100%;object-fit:cover;object-position:${c.pos}">
  <div class="abs" style="inset:0;background:linear-gradient(90deg,rgba(7,11,22,.94) 0%,rgba(7,11,22,.82) 42%,rgba(7,11,22,.25) 75%,rgba(7,11,22,.1) 100%)"></div>
  <div class="abs" style="inset:0;background:radial-gradient(ellipse 50% 70% at 0% 100%,${c.glow},transparent 70%)"></div>
  <div class="abs" style="left:72px;top:64px;display:flex;align-items:center;gap:14px">
    <img src="/redesign/brand/logo-on-dark.png" alt="" style="height:40px;width:auto">
    <span style="width:1px;height:26px;background:rgba(255,255,255,.25)"></span>
    <span style="font-family:'Azeret Mono',monospace;font-size:16px;letter-spacing:.14em;color:#aab3cc">${esc(c.kicker)}</span>
  </div>
  <div class="abs" style="left:72px;right:470px;top:200px;display:flex;flex-direction:column;gap:18px">
    <h1 style="margin:0;font-family:'Bricolage',sans-serif;font-weight:700;font-size:${c.size}px;line-height:.98;letter-spacing:-.045em">${esc(c.title)}</h1>
    <p style="margin:0;font-family:'Instrument Serif',serif;font-style:italic;font-size:30px;line-height:1.25;color:#d5dcef">${esc(c.lede)}</p>
  </div>
  <div class="abs" style="left:72px;right:72px;bottom:56px;display:flex;align-items:center;justify-content:space-between">
    <span style="font-family:'Azeret Mono',monospace;font-size:18px;color:#eef2fb">anubhavkumaar.in</span>
    <span style="display:inline-flex;align-items:center;gap:10px;height:42px;padding:0 18px;border-radius:999px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);font-size:16px;font-weight:700"><span style="width:8px;height:8px;border-radius:50%;background:${c.dot};box-shadow:0 0 10px ${c.dot}"></span>${esc(c.badge)}</span>
  </div>
</div></body></html>`;

const MIME = { '.jpg': 'image/jpeg', '.png': 'image/png', '.woff': 'font/woff', '.mp4': 'video/mp4' };

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname === '/card') {
    const c = cards.find((k) => k.id === url.searchParams.get('id'));
    res.writeHead(c ? 200 : 404, { 'content-type': 'text/html; charset=utf-8' });
    res.end(c ? page(c) : 'not found');
    return;
  }
  const file = url.pathname.startsWith('/__fonts/')
    ? join(ROOT, 'assets', 'og', url.pathname.slice(9))
    : join(ROOT, 'public', decodeURIComponent(url.pathname));
  if (!file.startsWith(ROOT) || !existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(PORT, '127.0.0.1', r));

const profile = join(ROOT, '.og-profile');
const proc = spawn(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let target;
for (let i = 0; i < 60 && !target; i++) {
  try {
    target = (await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json`)).json()).find((t) => t.type === 'page');
  } catch {
    /* browser still starting */
  }
  if (!target) await sleep(250);
}
if (!target) throw new Error('The browser did not start.');

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let n = 0;
const waiting = new Map();
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && waiting.has(d.id)) {
    waiting.get(d.id)(d);
    waiting.delete(d.id);
  }
};
const send = (method, params = {}) =>
  new Promise((res) => {
    const id = ++n;
    waiting.set(id, res);
    ws.send(JSON.stringify({ id, method, params }));
  });

mkdirSync(OUT, { recursive: true });
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });

for (const c of cards) {
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/card?id=${c.id}` });
  // Wait for the load event, then for the fonts and every image.
  for (let i = 0; i < 80; i++) {
    const r = await send('Runtime.evaluate', {
      expression: `document.readyState==='complete' && [...document.images].every(i=>i.complete&&i.naturalWidth>0) && document.fonts.status==='loaded' && document.fonts.check("700 20px Bricolage")`,
      returnByValue: true,
    });
    if (r.result?.result?.value) break;
    await sleep(100);
  }
  await sleep(150);
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
  writeFileSync(join(OUT, `${c.id}.jpg`), Buffer.from(shot.result.data, 'base64'));
  console.log('wrote public/og/' + c.id + '.jpg');
}

ws.close();
proc.kill();
server.close();
process.exit(0);
