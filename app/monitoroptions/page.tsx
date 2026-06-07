'use client';

import { useState } from 'react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

  .mp {
    --bg: #0a0c0f; --surface: #111318; --card: #16191f;
    --border: #252930; --accent: #00e5a0; --accent2: #0ea5e9;
    --gold: #f5a623; --text: #e8eaf0; --muted: #6b7280; --dim: #9ca3af;
    background: var(--bg); color: var(--text);
    font-family: 'Syne', sans-serif; min-height: 100vh; position: relative;
  }
  .mp::before {
    content: ''; position: fixed; inset: 0;
    background-image: linear-gradient(rgba(0,229,160,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,160,.03) 1px, transparent 1px);
    background-size: 40px 40px; pointer-events: none; z-index: 0;
  }
  .mp .wrap { position:relative; z-index:1; max-width:980px; margin:0 auto; padding:0 20px 72px; }

  /* Topnav */
  .mp .topnav {
    position:sticky; top:0; z-index:50;
    background:rgba(10,12,15,0.82); backdrop-filter:blur(16px);
    border-bottom:1px solid rgba(0,229,160,.12);
    padding:0 24px; display:flex; align-items:center; justify-content:space-between; height:52px;
  }
  .mp .topnav-brand { display:flex; align-items:center; gap:10px; text-decoration:none; }
  .mp .topnav-logo {
    width:32px; height:32px; border-radius:8px;
    background:rgba(0,229,160,.08); border:1px solid rgba(0,229,160,.25);
    display:flex; align-items:center; justify-content:center;
    font-family:'Space Mono',monospace; font-weight:700; font-size:12px;
    color:var(--accent); letter-spacing:.05em; transition:all .2s;
  }
  .mp .topnav-brand:hover .topnav-logo { background:rgba(0,229,160,.15); border-color:var(--accent); box-shadow:0 0 12px rgba(0,229,160,.25); }
  .mp .topnav-site { font-family:'Space Mono',monospace; font-size:11px; color:var(--dim); letter-spacing:.06em; transition:color .2s; }
  .mp .topnav-brand:hover .topnav-site { color:var(--accent); }
  .mp .topnav-back {
    display:flex; align-items:center; gap:6px; text-decoration:none;
    font-family:'Space Mono',monospace; font-size:11px; color:var(--muted); letter-spacing:.06em;
    padding:6px 12px; border-radius:6px; border:1px solid var(--border); transition:all .2s;
  }
  .mp .topnav-back:hover { color:var(--accent); border-color:rgba(0,229,160,.35); background:rgba(0,229,160,.06); }
  .mp .topnav-back-arrow { font-size:13px; transition:transform .2s; }
  .mp .topnav-back:hover .topnav-back-arrow { transform:translateX(-3px); }
  .mp .topnav-center {
    font-family:'Space Mono',monospace; font-size:10px; color:var(--muted); letter-spacing:.1em; text-transform:uppercase;
    position:absolute; left:50%; transform:translateX(-50%);
  }
  @media(max-width:600px){ .mp .topnav-center { display:none; } }

  /* Hero */
  .mp .hero { padding:48px 0 32px; border-bottom:1px solid var(--border); margin-bottom:36px; }
  .mp .hero-tag {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(0,229,160,.08); border:1px solid rgba(0,229,160,.2);
    color:var(--accent); font-family:'Space Mono',monospace; font-size:11px;
    padding:5px 12px; border-radius:4px; letter-spacing:.08em; margin-bottom:18px;
  }
  .mp h1 { font-size:clamp(26px,5vw,44px); font-weight:800; line-height:1.1; letter-spacing:-.02em; margin-bottom:12px; }
  .mp h1 span { color:var(--accent); }
  .mp .hero-sub { color:var(--dim); font-size:15px; line-height:1.65; max-width:600px; }
  .mp .hero-sub strong { color:var(--text); }
  .mp .gpu-badge {
    display:inline-flex; align-items:center; gap:8px;
    background:var(--surface); border:1px solid var(--border);
    padding:10px 16px; border-radius:8px; margin-top:18px; font-size:13px; color:var(--dim);
  }
  .mp .gpu-badge b { color:var(--accent2); font-family:'Space Mono',monospace; font-size:12px; }

  /* GPU Picker */
  .mp .gpu-picker { display:flex; align-items:center; flex-wrap:wrap; gap:8px; margin-top:20px; }
  .mp .gpu-picker-label { font-family:'Space Mono',monospace; font-size:10px; color:var(--muted); letter-spacing:.08em; text-transform:uppercase; margin-right:4px; }
  .mp .gpu-btn {
    font-family:'Space Mono',monospace; font-size:11px; font-weight:700;
    padding:5px 12px; border-radius:5px; cursor:pointer;
    border:1px solid var(--border); background:transparent; color:var(--dim); letter-spacing:.04em; transition:all .18s;
  }
  .mp .gpu-btn:hover { border-color:rgba(0,229,160,.4); color:var(--accent); background:rgba(0,229,160,.06); }
  .mp .gpu-btn.active { border-color:var(--accent); color:#000; background:var(--accent); }

  /* GPU Note */
  .mp .gpu-note {
    margin-top:16px; padding:10px 14px;
    background:rgba(245,166,35,.07); border:1px solid rgba(245,166,35,.2);
    border-radius:8px; font-family:'Space Mono',monospace; font-size:11px; color:var(--gold); line-height:1.6;
  }

  /* Section label */
  .mp .slabel {
    font-family:'Space Mono',monospace; font-size:11px; color:var(--muted); letter-spacing:.1em; text-transform:uppercase;
    margin-bottom:18px; display:flex; align-items:center; gap:12px;
  }
  .mp .slabel::after { content:''; flex:1; height:1px; background:var(--border); }

  /* Monitor Card */
  .mp .cards { display:flex; flex-direction:column; gap:22px; margin-bottom:48px; }
  .mp .mcard {
    background:var(--card); border:1px solid var(--border); border-radius:14px; overflow:hidden;
    transition:border-color .2s, transform .2s; position:relative;
  }
  .mp .mcard:hover { border-color:rgba(0,229,160,.25); transform:translateY(-2px); }
  .mp .mcard.top { border-color:rgba(0,229,160,.35); background:linear-gradient(135deg,#16191f 0%,#0f1a14 100%); }
  .mp .mcard.top::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--accent),transparent); }
  .mp .mcard-inner { display:grid; grid-template-columns:1fr 280px; }
  @media(max-width:700px){ .mp .mcard-inner { grid-template-columns:1fr; } }

  .mp .mc-left { padding:22px 24px; border-right:1px solid var(--border); }
  @media(max-width:700px){ .mp .mc-left { border-right:none; border-bottom:1px solid var(--border); } }

  .mp .ribbon { position:absolute; top:14px; right:0; background:var(--accent); color:#000; font-size:10px; font-weight:700; padding:4px 14px 4px 10px; letter-spacing:.06em; border-radius:4px 0 0 4px; }
  .mp .mc-brand { font-family:'Space Mono',monospace; font-size:10px; color:var(--muted); letter-spacing:.1em; text-transform:uppercase; margin-bottom:3px; }
  .mp .mc-name { font-size:19px; font-weight:700; letter-spacing:-.01em; margin-bottom:2px; }
  .mp .mc-model { font-family:'Space Mono',monospace; font-size:11px; color:var(--muted); margin-bottom:12px; }
  .mp .rating { display:flex; align-items:center; gap:6px; margin-bottom:12px; }
  .mp .stars { color:var(--gold); font-size:13px; }
  .mp .rn { font-family:'Space Mono',monospace; font-size:11px; color:var(--muted); }
  .mp .chips { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:14px; }
  .mp .chip { font-family:'Space Mono',monospace; font-size:11px; padding:3px 9px; border-radius:4px; border:1px solid; }
  .mp .cg { background:rgba(0,229,160,.07); color:#00e5a0; border-color:rgba(0,229,160,.2); }
  .mp .cb { background:rgba(14,165,233,.07); color:#38bdf8; border-color:rgba(14,165,233,.2); }
  .mp .cy { background:rgba(245,166,35,.07); color:#f5a623; border-color:rgba(245,166,35,.2); }
  .mp .cm { background:rgba(255,255,255,.04); color:var(--dim); border-color:var(--border); }
  .mp .verdict { font-size:13px; color:var(--dim); line-height:1.6; border-left:2px solid rgba(0,229,160,.3); padding-left:12px; margin-bottom:14px; }
  .mp .verdict strong { color:var(--accent); }
  .mp .pc-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .mp .pc-box { background:var(--surface); border-radius:8px; padding:10px 12px; }
  .mp .pc-title { font-size:10px; font-weight:700; letter-spacing:.08em; margin-bottom:5px; }
  .mp .pc-title.p { color:#4ade80; }
  .mp .pc-title.c { color:#f87171; }
  .mp .pc-box ul { list-style:none; }
  .mp .pc-box li { font-size:11px; color:var(--dim); padding:2px 0 2px 14px; position:relative; line-height:1.4; }
  .mp .pc-box.pros li::before { content:'+'; position:absolute; left:0; color:#4ade80; font-weight:700; }
  .mp .pc-box.cons li::before { content:'−'; position:absolute; left:0; color:#f87171; font-weight:700; }

  .mp .mc-right { padding:22px 20px; display:flex; flex-direction:column; gap:14px; }
  .mp .price { font-size:28px; font-weight:800; letter-spacing:-.02em; }
  .mp .price-note { font-size:11px; color:var(--muted); margin-top:2px; }
  .mp .store-cat-title { font-family:'Space Mono',monospace; font-size:9px; color:var(--muted); letter-spacing:.12em; text-transform:uppercase; margin-bottom:6px; display:flex; align-items:center; gap:8px; }
  .mp .store-cat-title::after { content:''; flex:1; height:1px; background:var(--border); }
  .mp .store-links { display:flex; flex-direction:column; gap:6px; }
  .mp .btn { display:flex; align-items:center; justify-content:space-between; text-decoration:none; padding:8px 12px; border-radius:7px; font-size:11px; font-weight:700; letter-spacing:.03em; transition:opacity .15s, transform .15s; border:1px solid; gap:8px; white-space:nowrap; }
  .mp .btn:hover { opacity:.82; transform:scale(.98); }
  .mp .btn-left { display:flex; align-items:center; gap:7px; }
  .mp .btn-icon { font-size:13px; flex-shrink:0; }
  .mp .btn-price { font-family:'Space Mono',monospace; font-size:10px; opacity:.75; }
  .mp .btn-arr { font-size:10px; opacity:.6; flex-shrink:0; }
  .mp .b-amz { background:#ff9900; color:#000; border-color:#e68900; }
  .mp .b-fk  { background:#2874f0; color:#fff; border-color:#1a5cc8; }
  .mp .b-eh  { background:#7c3aed; color:#fff; border-color:#6d28d9; }
  .mp .b-md  { background:#0f766e; color:#fff; border-color:#0d6560; }
  .mp .b-pa  { background:#b45309; color:#fff; border-color:#92400e; }
  .mp .b-vc  { background:#1d4ed8; color:#fff; border-color:#1e3a8a; }
  .mp .b-cs  { background:#065f46; color:#fff; border-color:#064e3b; }
  .mp .b-cr  { background:#dc2626; color:#fff; border-color:#b91c1c; }
  .mp .b-rd  { background:#0369a1; color:#fff; border-color:#075985; }
  .mp .b-vs  { background:#7c2d12; color:#fff; border-color:#6b2109; }
  .mp .b-br  { background:transparent; color:var(--dim); border-color:var(--border); }
  .mp .b-br:hover { color:var(--text); border-color:var(--dim); }
  .mp .price-tracker { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:10px 12px; font-size:11px; color:var(--muted); line-height:1.5; }
  .mp .price-tracker strong { color:var(--text); font-size:12px; display:block; margin-bottom:4px; }
  .mp .price-tracker a { color:var(--accent); text-decoration:none; }
  .mp .price-tracker a:hover { text-decoration:underline; }

  /* Store Guide */
  .mp .store-guide { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:26px 28px; margin-bottom:40px; }
  .mp .sg-title { font-size:15px; font-weight:700; color:var(--accent); margin-bottom:20px; }
  .mp .sg-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:14px; }
  .mp .sg-cat-name { font-family:'Space Mono',monospace; font-size:10px; color:var(--muted); letter-spacing:.1em; text-transform:uppercase; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid var(--border); }
  .mp .sg-store { display:flex; flex-direction:column; gap:6px; }
  .mp .sg-item { background:var(--card); border:1px solid var(--border); border-radius:8px; padding:9px 12px; text-decoration:none; transition:border-color .15s; display:block; }
  .mp .sg-item:hover { border-color:rgba(0,229,160,.3); }
  .mp .sg-item-name { font-size:12px; font-weight:600; color:var(--text); margin-bottom:2px; }
  .mp .sg-item-desc { font-size:11px; color:var(--muted); line-height:1.45; }
  .mp .sg-item-tag { display:inline-block; margin-top:4px; font-family:'Space Mono',monospace; font-size:9px; padding:2px 6px; border-radius:3px; }
  .mp .tag-cheap { background:rgba(0,229,160,.1); color:var(--accent); }
  .mp .tag-gst { background:rgba(14,165,233,.1); color:#38bdf8; }
  .mp .tag-phy { background:rgba(245,166,35,.1); color:var(--gold); }
  .mp .tag-cmp { background:rgba(255,255,255,.06); color:var(--dim); }

  /* Tips */
  .mp .tips { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:26px 28px; }
  .mp .tips-title { font-size:15px; font-weight:700; color:var(--accent); margin-bottom:18px; }
  .mp .tips-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:14px; }
  .mp .tip { border-left:2px solid var(--border); padding-left:12px; }
  .mp .tip-name { font-size:12px; font-weight:700; color:var(--text); margin-bottom:3px; }
  .mp .tip-body { font-size:12px; color:var(--muted); line-height:1.55; }

  /* Footer */
  .mp .footer { margin-top:44px; padding-top:18px; border-top:1px solid var(--border); display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; font-size:11px; color:var(--muted); font-family:'Space Mono',monospace; }
  .mp .footer span { color:var(--accent); }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type GpuKey = '5060' | '5070' | '5080' | '4070' | '4080';
type MonitorId = 'g5' | 'vs2758' | 'lg75q' | 'vs3219' | 'lg60qc';

interface StoreLink { href: string; cls: string; icon: string; label: string; price: string; }
interface StoreGroup { title: string; links: StoreLink[]; }
interface Chip { label: string; cls: 'cg' | 'cb' | 'cy' | 'cm'; }
interface MonitorDef {
  id: MonitorId;
  brand: string; name: string; model: string;
  rating: string; reviews: string;
  chips: Chip[];
  verdicts: Record<GpuKey, string>;
  pros: string[]; cons: string[];
  bestPrice: string; priceNote: string;
  storeGroups: StoreGroup[];
  trackerLinks?: { href: string; label: string }[];
}

// ─── GPU Profiles ─────────────────────────────────────────────────────────────

const GPU_PROFILES: Record<GpuKey, { label: string; badge: string; rec: string; note?: string }> = {
  '5060': {
    label: 'RTX 5060',
    badge: '⚡ Your GPU: RTX 5060 · Sweet spot at QHD 1440p 100–144fps',
    rec: '1080p → 1440p QHD',
  },
  '5070': {
    label: 'RTX 5070',
    badge: '⚡ Your GPU: RTX 5070 · Ideal for QHD 1440p at 144–200fps',
    rec: '1080p → 1440p QHD',
  },
  '5080': {
    label: 'RTX 5080',
    badge: '⚡ Your GPU: RTX 5080 · Push QHD 240Hz or step up to 4K',
    rec: '1440p QHD 240Hz',
    note: '🔺 Your RTX 5080 can handle 4K gaming. The picks below are excellent value under ₹25k, but if budget allows, consider 4K monitors in the ₹35–50k range for the full potential.',
  },
  '4070': {
    label: 'RTX 4070',
    badge: '⚡ Your GPU: RTX 4070 · Great for QHD 1440p at 120–165fps',
    rec: '1080p → 1440p QHD',
  },
  '4080': {
    label: 'RTX 4080',
    badge: '⚡ Your GPU: RTX 4080 · Handles QHD 240Hz or 4K easily',
    rec: '1440p QHD 240Hz',
    note: '🔺 Your RTX 4080 is capable of 4K gaming. These ₹25k QHD picks are great value, but if budget allows, a 4K monitor in the ₹35–50k range unlocks your GPU\'s full potential.',
  },
};

// ─── GPU → Monitor ordering + top pick ───────────────────────────────────────

const GPU_CONFIGS: Record<GpuKey, { order: MonitorId[]; top: MonitorId }> = {
  '5060': { order: ['lg60qc', 'g5', 'lg75q', 'vs2758', 'vs3219'], top: 'lg60qc' },
  '5070': { order: ['g5', 'vs2758', 'lg75q', 'vs3219', 'lg60qc'], top: 'g5' },
  '5080': { order: ['vs2758', 'g5', 'vs3219', 'lg75q', 'lg60qc'], top: 'vs2758' },
  '4070': { order: ['g5', 'lg75q', 'lg60qc', 'vs2758', 'vs3219'], top: 'g5' },
  '4080': { order: ['vs2758', 'vs3219', 'g5', 'lg75q', 'lg60qc'], top: 'vs2758' },
};

// ─── Monitor Data ─────────────────────────────────────────────────────────────

const MONITORS: Record<MonitorId, MonitorDef> = {
  'g5': {
    id: 'g5', brand: 'Samsung', name: 'Odyssey G5 27"', model: 'LS27DG502EWXXL',
    rating: '★★★★★', reviews: '4.7/5 · 1.2k+ reviews',
    chips: [
      { label: 'QHD 2560×1440', cls: 'cg' }, { label: '180Hz Fast IPS', cls: 'cg' },
      { label: '1ms GTG', cls: 'cb' }, { label: 'G-Sync + FreeSync', cls: 'cb' },
      { label: 'DisplayHDR 400', cls: 'cy' }, { label: 'Full ergo stand', cls: 'cm' }, { label: 'DP + HDMI', cls: 'cm' },
    ],
    verdicts: {
      '5060': 'Good IPS pick for RTX 5060: 180Hz Fast IPS at 1440p. Your GPU sustains 130–150fps in AAA titles and 180+ in esports. G-Sync Compatible works natively. Full ergo stand is rare at this price.',
      '5070': 'Best RTX 5070 match: 180Hz Fast IPS at 1440p is ideal — push 144–180fps in AAA and 200+ in esports. G-Sync Compatible works natively. Full ergonomic stand rarely seen at this price. Samsung 3-year India warranty.',
      '5080': 'Solid IPS pick for RTX 5080, but note your GPU can easily saturate 240Hz panels. The G5\'s 180Hz cap becomes the bottleneck in esports — consider the ViewSonic 240Hz as your top pick instead.',
      '4070': 'Best RTX 4070 match: 180Hz Fast IPS at 1440p. Your GPU sustains 120–160fps in most AAA titles comfortably. G-Sync Compatible + full ergo stand make this exceptional value for the price.',
      '4080': 'Good pick for RTX 4080 — excellent for AAA and content work — but your GPU can push 240fps at 1440p in esports. For pure gaming, consider the ViewSonic 240Hz as primary. This wins for hybrid use.',
    },
    pros: ['Fast IPS: color + speed', 'G-Sync + FreeSync dual', 'DisplayHDR 400 certified', 'Full ergo stand (rare here)', 'Samsung 3-yr India warranty'],
    cons: ['No built-in speakers', '~350 nits (not super bright)', 'No USB hub'],
    bestPrice: '₹20,185', priceNote: '₹22,999 avg · MRP ₹31,600',
    storeGroups: [
      { title: 'PC Specialty (often cheapest)', links: [
        { href: 'https://computechstore.in/product/samsung-odyssey-g5-ls27dg502ewxxl/', cls: 'b-cs', icon: '🖥️', label: 'Computech Store', price: '₹20,185' },
        { href: 'https://elitehubs.com/products/samsung-odyssey-g5-ls27dg502ewxxl-32-inch-2k-qhd-180hz-ips-panel-99-srgb-1ms-amd-freesync-gaming-monitor', cls: 'b-eh', icon: '🏬', label: 'EliteHubs', price: '₹20,395' },
        { href: 'https://mdcomputers.in/product/samsung-odyssey-g5-27-inch-gaming-monitor-ls27dg502ewxxl', cls: 'b-md', icon: '💻', label: 'MD Computers', price: '~₹20,248' },
        { href: 'https://www.primeabgb.com/online-price-reviews-india/samsung-27dg502-27-odyssey-g5-2k-qhd-180hz-1ms-gaming-monitor/', cls: 'b-pa', icon: '⚡', label: 'Primeabgb', price: 'Check' },
      ]},
      { title: 'E-commerce', links: [
        { href: 'https://www.amazon.in/Samsung-Odyssey-FreeSync-Headphone-LS27DG502EWXXL/dp/B0DFYVF4JY', cls: 'b-amz', icon: '🛒', label: 'Amazon.in', price: '₹22,999' },
        { href: 'https://www.flipkart.com/samsung-odyssey-g5-68-58-cm-27-inch-quad-hd-led-backlit-ips-panel-vesa-displayhdr400-support-dp-hdmi-headphone-jack-height-tilt-swivel-pivot-adjustable-stand-gaming-monitor-ls27dg502ewxxl/p/itm2b8482228c7a5', cls: 'b-fk', icon: '🏪', label: 'Flipkart', price: '₹22,999' },
      ]},
      { title: 'Physical Chains', links: [
        { href: 'https://www.croma.com/searchB?q=samsung+odyssey+g5+27', cls: 'b-cr', icon: '🏢', label: 'Croma', price: 'Check' },
        { href: 'https://www.reliancedigital.in/search?q=samsung+odyssey+g5+27', cls: 'b-rd', icon: '📡', label: 'Reliance Digital', price: 'Check' },
      ]},
      { title: 'Brand Direct', links: [
        { href: 'https://www.samsung.com/in/monitors/gaming/odyssey-g5-g50d-27-inch-180hz-ips-qhd-ls27dg502ewxxl/', cls: 'b-br', icon: '🌐', label: 'Samsung India', price: '' },
      ]},
    ],
    trackerLinks: [
      { href: 'https://pricehistory.app/p/samsung-odyssey-g5-68-58-cm-27-wR4bXCIm', label: 'PriceHistory.app' },
      { href: 'https://www.smartprix.com/monitors/samsung-odyssey-g5-ls27dg502ew-27-inch-quad-ppd14t15703t', label: 'Smartprix' },
    ],
  },

  'vs2758': {
    id: 'vs2758', brand: 'ViewSonic', name: 'VX2758A 27" 240Hz', model: 'VX2758A-2K-PRO-3',
    rating: '★★★★☆', reviews: '4.3/5 · 800+ reviews',
    chips: [
      { label: 'QHD 2560×1440', cls: 'cg' }, { label: '240Hz IPS', cls: 'cg' },
      { label: '1ms MPRT', cls: 'cb' }, { label: 'FreeSync Premium', cls: 'cb' },
      { label: 'HDR10', cls: 'cy' }, { label: '137% sRGB', cls: 'cm' }, { label: '2× HDMI + DP', cls: 'cm' },
    ],
    verdicts: {
      '5060': 'Future-proof pick for RTX 5060: 240Hz at QHD under ₹22k. Your GPU won\'t sustain 240fps in AAA, but in CS2, Valorant, BGMI at 1440p it can. 137% sRGB is a bonus for versatility.',
      '5070': 'Best for competitive gaming: 240Hz at QHD is exceptional value. RTX 5070 can sustain 200+ fps in CS2, Valorant, BGMI at 1440p. 137% sRGB makes it versatile for content as well.',
      '5080': 'Perfect RTX 5080 match: Your GPU can max out this 240Hz panel in nearly every game. CS2, Valorant at 240+ fps at 1440p — don\'t leave that refresh rate on the table.',
      '4070': 'Great competitive pick for RTX 4070: 240Hz at QHD. In esports titles (CS2, Valorant) your GPU can hit 200+ fps. In AAA you\'ll be around 120–150fps — 240Hz still provides smoother interpolation.',
      '4080': 'Perfect RTX 4080 match: Your GPU saturates this 240Hz panel in esports and nearly matches it in AAA titles at 1440p. Best price-to-performance at this refresh rate available in India.',
    },
    pros: ['240Hz at QHD — rare value', '137% sRGB wide gamut', '3-yr ViewSonic onsite warranty', 'Best price-to-Hz in segment'],
    cons: ['Tilt-only stand', 'Some panel QC reports', 'No official G-Sync cert'],
    bestPrice: '₹21,490', priceNote: 'MRP ₹34,000 · check live',
    storeGroups: [
      { title: 'E-commerce', links: [
        { href: 'https://www.amazon.in/ViewSonic-VX2758A-2K-PRO-3-Monitor-FreeSync-Display/dp/B0CZ3JJFW6', cls: 'b-amz', icon: '🛒', label: 'Amazon.in', price: '₹21,490' },
        { href: 'https://www.flipkart.com/viewsonic-68-58-cm-27-inch-quad-hd-led-backlit-ips-panel-hdr10-2-x-hdmi-display-port-eye-care-tilt-able-stand-137-srgb-gaming-monitor-vx2758a-2k-pro-3/p/itm6d3158331ab72', cls: 'b-fk', icon: '🏪', label: 'Flipkart', price: 'Check' },
      ]},
      { title: 'PC Specialty', links: [
        { href: 'https://elitehubs.com/collections/viewsonic', cls: 'b-eh', icon: '🏬', label: 'EliteHubs', price: 'Check' },
        { href: 'https://www.primeabgb.com/buy-online-price-india/led-monitors/viewsonic/', cls: 'b-pa', icon: '⚡', label: 'Primeabgb', price: 'Check' },
        { href: 'https://www.vedantcomputers.com/index.php?route=product/search&search=viewsonic+2758', cls: 'b-vc', icon: '💻', label: 'Vedant Computers', price: 'Check' },
      ]},
      { title: 'Brand Direct', links: [
        { href: 'https://www.viewsonic.com/in/products/lcd/VX2758A-2K-PRO-3', cls: 'b-br', icon: '🌐', label: 'ViewSonic India', price: '' },
      ]},
    ],
    trackerLinks: [
      { href: 'https://www.smartprix.com/monitors/viewsonic-brand', label: 'Smartprix ViewSonic' },
    ],
  },

  'lg75q': {
    id: 'lg75q', brand: 'LG UltraGear', name: '27GS75Q 27"', model: '27GS75Q-B',
    rating: '★★★★★', reviews: '4.5/5 · 600+ reviews',
    chips: [
      { label: 'QHD 2560×1440', cls: 'cg' }, { label: '180Hz IPS (OC 200Hz)', cls: 'cg' },
      { label: '1ms GTG', cls: 'cb' }, { label: 'G-Sync + FreeSync', cls: 'cb' },
      { label: 'HDR10', cls: 'cy' }, { label: '99% sRGB', cls: 'cm' }, { label: 'Full ergo stand', cls: 'cm' },
    ],
    verdicts: {
      '5060': 'Best colors for RTX 5060: 99% sRGB + 180Hz IPS. Your GPU handles 1440p at 120–150fps easily. If you create content or want accurate, vivid colors — this is the pick at this price.',
      '5070': 'Best all-round + colors: LG\'s IPS delivers 99% sRGB — ideal for creators. Overclocks to 200Hz via DisplayPort. RTX 5070 can push 180–200fps at 1440p. LG India service is excellent in Hyderabad.',
      '5080': 'Content creation pick for RTX 5080: 99% sRGB is unmatched here. However your GPU can push past 200fps — for pure competitive gaming, the ViewSonic 240Hz better utilizes it. For hybrid/creator use, this wins.',
      '4070': 'Best all-round for RTX 4070: 99% sRGB for creators + 180Hz for gaming. Overclocks to 200Hz via DP. LG\'s India service network is excellent — especially important in Hyderabad for warranty claims.',
      '4080': 'Creator pick for RTX 4080: 99% sRGB is the best color accuracy in this list. For pure gaming your GPU can max 240Hz panels. For content + gaming hybrid use, this is the most versatile option here.',
    },
    pros: ['99% sRGB — best color here', 'OC to 200Hz via DP', 'G-Sync + FreeSync official', 'LG India service (HYD)', 'Full ergo stand'],
    cons: ['~300 nits brightness', 'No USB hub on base model', 'No built-in speakers'],
    bestPrice: '₹20,999', priceNote: 'Check live — fluctuates',
    storeGroups: [
      { title: 'E-commerce', links: [
        { href: 'https://www.amazon.in/LG-27GS75Q-B-Ultragear-2560x1440-Compatible/dp/B0F1CWSF7F', cls: 'b-amz', icon: '🛒', label: 'Amazon.in', price: '₹20,999' },
      ]},
      { title: 'PC Specialty', links: [
        { href: 'https://elitehubs.com/collections/lg-monitor', cls: 'b-eh', icon: '🏬', label: 'EliteHubs', price: 'Check' },
        { href: 'https://www.primeabgb.com/online-price-reviews-india/lg-ultragear-27gs75q-b-27-inch-gaming-monitor/', cls: 'b-pa', icon: '⚡', label: 'Primeabgb', price: 'Check' },
        { href: 'https://www.vedantcomputers.com/index.php?route=product/search&search=lg+27gs75q', cls: 'b-vc', icon: '💻', label: 'Vedant Computers', price: 'Check' },
      ]},
      { title: 'Physical Chains', links: [
        { href: 'https://www.croma.com/searchB?q=lg+ultragear+27+1440p', cls: 'b-cr', icon: '🏢', label: 'Croma', price: 'Check' },
        { href: 'https://www.reliancedigital.in/search?q=lg+ultragear+27+qhd', cls: 'b-rd', icon: '📡', label: 'Reliance Digital', price: 'Check' },
      ]},
      { title: 'Brand Direct', links: [
        { href: 'https://www.lg.com/in/monitors/gaming-monitors/', cls: 'b-br', icon: '🌐', label: 'LG India', price: '' },
      ]},
    ],
    trackerLinks: [
      { href: 'https://www.smartprix.com/monitors/lg-brand/27_inch-display', label: 'Smartprix LG 27"' },
    ],
  },

  'vs3219': {
    id: 'vs3219', brand: 'ViewSonic', name: 'VX3219 32"', model: 'VX3219-2K-PRO-2',
    rating: '★★★★☆', reviews: '4.2/5 · 400+ reviews',
    chips: [
      { label: 'QHD 2560×1440', cls: 'cg' }, { label: '165Hz IPS', cls: 'cg' },
      { label: '<0.5ms MPRT', cls: 'cb' }, { label: 'FreeSync Premium', cls: 'cb' },
      { label: 'HDR10', cls: 'cy' }, { label: 'DCI-P3 95%', cls: 'cm' }, { label: '32" BIG screen', cls: 'cy' },
    ],
    verdicts: {
      '5060': 'Immersive AAA pick for RTX 5060: 32" fills your field of view. Your GPU handles 1440p at 120–150fps — the 165Hz cap is rarely a bottleneck in heavy AAA titles. DCI-P3 95% is spectacular.',
      '5070': 'Best for immersive AAA gaming: 32" at QHD fills your field of view — Cyberpunk, GTA VI, Elden Ring look cinematic. RTX 5070 handles 1440p at 144fps. DCI-P3 95% is the widest color here.',
      '5080': 'Immersive AAA pick for RTX 5080: 32" at 1440p 165Hz. Your GPU can push 200+ fps but the panel caps at 165Hz. Great for single-player / story games where immersion matters over raw Hz.',
      '4070': 'Immersive pick for RTX 4070: 32" at QHD 165Hz. Your GPU handles 1440p at 120–150fps, so the 165Hz cap isn\'t a bottleneck in AAA. DCI-P3 95% + big screen = excellent story gaming experience.',
      '4080': '32" immersive pick — but RTX 4080 is somewhat overkill at 165Hz. Your GPU can sustain 200+ fps at 1440p but you\'d be capped at 165Hz. Best chosen if screen size matters more than max refresh rate.',
    },
    pros: ['Largest screen here (32")', 'DCI-P3 95% — wide color', 'Excellent for AAA immersion', '3-yr ViewSonic warranty'],
    cons: ['Lower PPI (92 vs 108 at 27")', '165Hz, not 180/240Hz', 'Tilt-only stand'],
    bestPrice: '₹23,999', priceNote: 'MRP ₹38,000',
    storeGroups: [
      { title: 'E-commerce', links: [
        { href: 'https://www.amazon.in/ViewSonic-2560X1440-Freesync-1XDisplay-Vx3219-2K-Pro-2/dp/B0CQ8DX7VJ', cls: 'b-amz', icon: '🛒', label: 'Amazon.in', price: '₹23,999' },
      ]},
      { title: 'PC Specialty', links: [
        { href: 'https://elitehubs.com/collections/viewsonic', cls: 'b-eh', icon: '🏬', label: 'EliteHubs', price: 'Check' },
        { href: 'https://www.primeabgb.com/buy-online-price-india/led-monitors/viewsonic/', cls: 'b-pa', icon: '⚡', label: 'Primeabgb', price: 'Check' },
      ]},
      { title: 'Brand Direct', links: [
        { href: 'https://www.viewsonic.com/in/products/lcd/VX3219-2K-PRO-2', cls: 'b-br', icon: '🌐', label: 'ViewSonic India', price: '' },
      ]},
    ],
  },

  'lg60qc': {
    id: 'lg60qc', brand: 'LG UltraGear', name: '27GS60QC 27" Curved', model: '27GS60QC-B',
    rating: '★★★★☆', reviews: '4.1/5 · 500+ reviews',
    chips: [
      { label: 'QHD 2560×1440', cls: 'cg' }, { label: '180Hz VA Curved', cls: 'cg' },
      { label: '1ms MPRT', cls: 'cb' }, { label: 'FreeSync', cls: 'cb' },
      { label: 'HDR10', cls: 'cy' }, { label: '1000R curve', cls: 'cm' }, { label: '3-side borderless', cls: 'cm' },
    ],
    verdicts: {
      '5060': 'Best RTX 5060 match: Budget curved 180Hz VA at 1440p. Your GPU sustains 120–150fps in AAA and 180+ in esports. Best value pick for 5060 builds — save ₹3–5k for SSDs, RAM, or peripherals.',
      '5070': 'Budget curved pick: VA panel = richer blacks and deeper contrast. RTX 5070 can push past 180fps in esports here. Best if you want curved immersion and save ₹3–5k vs other picks.',
      '5080': 'Not the ideal match for RTX 5080: the 180Hz VA cap undersells your GPU in esports, and VA response limits perceived smoothness at high framerates. Choose only if curved aesthetics matter most.',
      '4070': 'Great RTX 4070 value: 180Hz VA + 1000R curve at a wallet-friendly price. Your GPU handles 1440p at 120–150fps comfortably. The deeper blacks are a genuine highlight for atmospheric games.',
      '4080': 'Budget mismatch for RTX 4080: your GPU deserves a 240Hz panel. VA response also limits smoothness at high framerates. Only choose this if curved aesthetics or budget is the primary constraint.',
    },
    pros: ['1000R curved design', 'VA = deeper blacks', '180Hz at 1440p', 'Saves ₹3–5k vs others', 'LG India warranty'],
    cons: ['VA: slower than IPS', 'Lower brightness', 'Tilt-only stand'],
    bestPrice: '₹19,999', priceNote: 'Best budget option here',
    storeGroups: [
      { title: 'E-commerce', links: [
        { href: 'https://www.amazon.in/LG-27GS60QC-B-DisplayPort-Borderless-Stabilizer/dp/B0DMS8VK96', cls: 'b-amz', icon: '🛒', label: 'Amazon.in', price: '₹19,999' },
      ]},
      { title: 'PC Specialty', links: [
        { href: 'https://elitehubs.com/collections/lg-monitor', cls: 'b-eh', icon: '🏬', label: 'EliteHubs', price: 'Check' },
        { href: 'https://mdcomputers.in/lg-monitors.html', cls: 'b-md', icon: '💻', label: 'MD Computers', price: 'Check' },
      ]},
      { title: 'Physical Chains', links: [
        { href: 'https://www.croma.com/searchB?q=lg+ultragear+curved+27', cls: 'b-cr', icon: '🏢', label: 'Croma', price: 'Check' },
        { href: 'https://www.vijaysales.com/search?q=lg+monitor+curved+27', cls: 'b-vs', icon: '🏬', label: 'Vijay Sales', price: 'Check' },
      ]},
      { title: 'Brand Direct', links: [
        { href: 'https://www.lg.com/in/monitors/gaming-monitors/', cls: 'b-br', icon: '🌐', label: 'LG India', price: '' },
      ]},
    ],
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function BuyBtn({ link }: { link: StoreLink }) {
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={`btn ${link.cls}`}>
      <div className="btn-left">
        <span className="btn-icon">{link.icon}</span>
        <span className="btn-label">{link.label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {link.price && <span className="btn-price">{link.price}</span>}
        <span className="btn-arr">↗</span>
      </div>
    </a>
  );
}

function MonitorCard({ def, isTop, gpu }: { def: MonitorDef; isTop: boolean; gpu: GpuKey }) {
  const verdict = def.verdicts[gpu];
  const colonIdx = verdict.indexOf(':');
  const boldPart = colonIdx !== -1 ? verdict.slice(0, colonIdx + 1) : '';
  const restPart = colonIdx !== -1 ? verdict.slice(colonIdx + 1) : verdict;

  return (
    <div className={`mcard${isTop ? ' top' : ''}`}>
      {isTop && <div className="ribbon">⭐ TOP PICK</div>}
      <div className="mcard-inner">
        <div className="mc-left">
          <div className="mc-brand">{def.brand}</div>
          <div className="mc-name">{def.name}</div>
          <div className="mc-model">{def.model}</div>
          <div className="rating">
            <span className="stars">{def.rating}</span>
            <span className="rn">{def.reviews}</span>
          </div>
          <div className="chips">
            {def.chips.map((c, i) => (
              <span key={i} className={`chip ${c.cls}`}>{c.label}</span>
            ))}
          </div>
          <div className="verdict">
            {boldPart && <strong>{boldPart}</strong>}{restPart}
          </div>
          <div className="pc-grid">
            <div className="pc-box pros">
              <div className="pc-title p">PROS</div>
              <ul>{def.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
            <div className="pc-box cons">
              <div className="pc-title c">CONS</div>
              <ul>{def.cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
            </div>
          </div>
        </div>
        <div className="mc-right">
          <div>
            <div className="price">{def.bestPrice}</div>
            <div className="price-note">{def.priceNote}</div>
          </div>
          {def.storeGroups.map((group, gi) => (
            <div key={gi} className="store-cat">
              <div className="store-cat-title">{group.title}</div>
              <div className="store-links">
                {group.links.map((link, li) => <BuyBtn key={li} link={link} />)}
              </div>
            </div>
          ))}
          {def.trackerLinks && def.trackerLinks.length > 0 && (
            <div className="price-tracker">
              <strong>📈 Track Price</strong>
              {def.trackerLinks.map((t, i) => (
                <span key={i}>
                  {i > 0 && ' · '}
                  <a href={t.href} target="_blank" rel="noopener noreferrer">{t.label}</a>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MonitorOptions() {
  const [gpu, setGpu] = useState<GpuKey>('5070');
  const profile = GPU_PROFILES[gpu];
  const config = GPU_CONFIGS[gpu];
  const orderedMonitors = config.order.map(id => MONITORS[id]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="mp">

        {/* ── Top Navbar ── */}
        <nav className="topnav">
          <a href="https://anubhavkumaar.in" className="topnav-brand">
            <div className="topnav-logo">AK</div>
            <span className="topnav-site">anubhavkumaar.in</span>
          </a>
          <span className="topnav-center">Monitor Buying Guide · India 2026</span>
          <a href="https://anubhavkumaar.in" className="topnav-back">
            <span className="topnav-back-arrow">←</span> Portfolio
          </a>
        </nav>

        <div className="wrap">

          {/* ── Hero ── */}
          <div className="hero">
            <div className="hero-tag">▶ {profile.label} Build · Monitor Upgrade Guide · India 2026</div>
            <h1>Best Monitors Under<br /><span>₹25,000</span> — India</h1>
            <p className="hero-sub">
              Upgraded picks for your {profile.label} rig. Jump from <strong>{profile.rec}</strong> across all major Indian retailers — specialty PC stores, chains, and brand direct.
            </p>
            <div className="gpu-badge">{profile.badge}</div>

            {profile.note && (
              <div className="gpu-note">{profile.note}</div>
            )}

            <div className="gpu-picker">
              <span className="gpu-picker-label">Your GPU:</span>
              {(Object.keys(GPU_PROFILES) as GpuKey[]).map(key => (
                <button key={key} className={`gpu-btn${gpu === key ? ' active' : ''}`} onClick={() => setGpu(key)}>
                  {GPU_PROFILES[key].label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Monitor Cards ── */}
          <div className="slabel">5 picks · ranked for {profile.label} · multiple stores per monitor</div>
          <div className="cards">
            {orderedMonitors.map(def => (
              <MonitorCard key={def.id} def={def} isTop={def.id === config.top} gpu={gpu} />
            ))}
          </div>

          {/* ── Store Guide ── */}
          <div className="slabel">where to buy in india</div>
          <div className="store-guide">
            <div className="sg-title">// Full Store Directory</div>
            <div className="sg-grid">
              <div className="sg-cat">
                <div className="sg-cat-name">🔧 PC Specialty (often cheapest)</div>
                <div className="sg-store">
                  <a href="https://elitehubs.com" target="_blank" rel="noopener noreferrer" className="sg-item">
                    <div className="sg-item-name">EliteHubs.com</div>
                    <div className="sg-item-desc">Pan-India shipping, GST invoice, EMI. Often ₹1–2k cheaper than Amazon. Large gaming monitor selection.</div>
                    <span className="sg-item-tag tag-cheap">Often cheapest</span> <span className="sg-item-tag tag-gst">GST invoice</span>
                  </a>
                  <a href="https://computechstore.in" target="_blank" rel="noopener noreferrer" className="sg-item">
                    <div className="sg-item-name">Computech Store</div>
                    <div className="sg-item-desc">Competitive pricing, ships Pan-India. Samsung G5 at ₹20,185 — one of the lowest found.</div>
                    <span className="sg-item-tag tag-cheap">Lowest price found</span>
                  </a>
                  <a href="https://mdcomputers.in" target="_blank" rel="noopener noreferrer" className="sg-item">
                    <div className="sg-item-name">MD Computers</div>
                    <div className="sg-item-desc">Kolkata-based, very trusted. HDFC card 7.5% instant discount. Good stock depth.</div>
                    <span className="sg-item-tag tag-gst">HDFC offers</span>
                  </a>
                  <a href="https://www.primeabgb.com" target="_blank" rel="noopener noreferrer" className="sg-item">
                    <div className="sg-item-name">Primeabgb</div>
                    <div className="sg-item-desc">Mumbai-based PC hardware store. Good range of LG, ViewSonic, Asus monitors. Ships PAN India.</div>
                    <span className="sg-item-tag tag-cheap">Good pricing</span>
                  </a>
                  <a href="https://www.vedantcomputers.com" target="_blank" rel="noopener noreferrer" className="sg-item">
                    <div className="sg-item-name">Vedant Computers</div>
                    <div className="sg-item-desc">Kolkata-based, highly rated by enthusiasts. Frequently recommended on Indian PC builder forums.</div>
                    <span className="sg-item-tag tag-cheap">Enthusiast favourite</span>
                  </a>
                </div>
              </div>
              <div className="sg-cat">
                <div className="sg-cat-name">🛒 Mainstream E-commerce</div>
                <div className="sg-store">
                  <a href="https://www.amazon.in/s?k=gaming+monitor+1440p" target="_blank" rel="noopener noreferrer" className="sg-item">
                    <div className="sg-item-name">Amazon.in</div>
                    <div className="sg-item-desc">Best return policy (10-day), fast delivery, Prime benefits. Great for GST invoice via B2B. Prices slightly higher than specialty stores.</div>
                    <span className="sg-item-tag tag-gst">Easy returns</span>
                  </a>
                  <a href="https://www.flipkart.com/monitors/gaming-monitors/pr?sid=6bo,jdg,bm0" target="_blank" rel="noopener noreferrer" className="sg-item">
                    <div className="sg-item-name">Flipkart</div>
                    <div className="sg-item-desc">Strong during Big Billion Days sale. SuperCoins, HDFC & Axis card offers. Competitive on select brands.</div>
                    <span className="sg-item-tag tag-cheap">Sale periods best</span>
                  </a>
                </div>
              </div>
              <div className="sg-cat">
                <div className="sg-cat-name">🏢 Physical Chain Stores</div>
                <div className="sg-store">
                  <a href="https://www.croma.com/computers-tablets/monitors/gaming-monitors/c/1101" target="_blank" rel="noopener noreferrer" className="sg-item">
                    <div className="sg-item-name">Croma (Tata)</div>
                    <div className="sg-item-desc">Multiple stores in Hyderabad (Hitech City, Banjara Hills etc). Can demo before buying. Tata Neu cashback. Exchange offers.</div>
                    <span className="sg-item-tag tag-phy">HYD stores</span> <span className="sg-item-tag tag-cheap">Exchange offers</span>
                  </a>
                  <a href="https://www.reliancedigital.in/collection/computer-monitors" target="_blank" rel="noopener noreferrer" className="sg-item">
                    <div className="sg-item-name">Reliance Digital</div>
                    <div className="sg-item-desc">Stores across Hyderabad and Telangana. JioFinance EMI. Good after-sales. No-cost EMI on HDFC, SBI cards.</div>
                    <span className="sg-item-tag tag-phy">HYD + TG stores</span>
                  </a>
                  <a href="https://www.vijaysales.com/monitors/gaming-monitors" target="_blank" rel="noopener noreferrer" className="sg-item">
                    <div className="sg-item-name">Vijay Sales</div>
                    <div className="sg-item-desc">Has stores in Telangana and Andhra Pradesh. Good for negotiating. Strong exchange value.</div>
                    <span className="sg-item-tag tag-phy">TG + AP stores</span>
                  </a>
                </div>
              </div>
              <div className="sg-cat">
                <div className="sg-cat-name">📊 Price Comparison</div>
                <div className="sg-store">
                  <a href="https://www.smartprix.com/monitors" target="_blank" rel="noopener noreferrer" className="sg-item">
                    <div className="sg-item-name">Smartprix.com</div>
                    <div className="sg-item-desc">Aggregates prices across Amazon, Flipkart, and specialty stores. Best for cross-store comparison.</div>
                    <span className="sg-item-tag tag-cmp">Compare all</span>
                  </a>
                  <a href="https://pricehistory.app" target="_blank" rel="noopener noreferrer" className="sg-item">
                    <div className="sg-item-name">PriceHistory.app</div>
                    <div className="sg-item-desc">Track price history on Flipkart. See if you're buying at a genuine low or a fake MRP discount.</div>
                    <span className="sg-item-tag tag-cmp">Price tracking</span>
                  </a>
                  <a href="https://www.91mobiles.com/monitors" target="_blank" rel="noopener noreferrer" className="sg-item">
                    <div className="sg-item-name">91Mobiles Monitors</div>
                    <div className="sg-item-desc">Reviews + price comparison + spec comparisons. Good editorial content for research.</div>
                    <span className="sg-item-tag tag-cmp">Reviews + prices</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tips ── */}
          <div className="slabel" style={{ marginTop: '32px' }}>buying tips for hyderabad</div>
          <div className="tips">
            <div className="tips-title">// Before you pull the trigger</div>
            <div className="tips-grid">
              <div className="tip">
                <div className="tip-name">🔌 Always use DisplayPort</div>
                <div className="tip-body">Connect via DP 1.4, not HDMI. HDMI 2.0 caps at 144Hz at 1440p. DisplayPort 1.4 handles 180–240Hz without DSC compression.</div>
              </div>
              <div className="tip">
                <div className="tip-name">🎥 Unboxing video is critical</div>
                <div className="tip-body">Record an unboxing video immediately. All retailers (Amazon, specialty stores) require it for dead pixel / physical damage returns.</div>
              </div>
              <div className="tip">
                <div className="tip-name">⚡ Enable G-Sync in NVIDIA CP</div>
                <div className="tip-body">All IPS monitors here are G-Sync Compatible. Go to NVIDIA Control Panel → Set up G-Sync → enable for all modes. Massive smoothness upgrade.</div>
              </div>
              <div className="tip">
                <div className="tip-name">💳 HDFC card trick</div>
                <div className="tip-body">MD Computers and Amazon.in both run HDFC Credit/Debit card offers — up to ₹2,000 instant discount on orders above ₹10,000.</div>
              </div>
              <div className="tip">
                <div className="tip-name">🏙️ Hyderabad physical stores</div>
                <div className="tip-body">Croma (Hitech City / Banjara Hills) and Reliance Digital let you demo monitors before buying. Worth visiting for a panel that'll sit on your desk for years.</div>
              </div>
              <div className="tip">
                <div className="tip-name">🖥️ Keep your old monitor as secondary</div>
                <div className="tip-body">Your existing 1080p panel becomes a brilliant secondary — Discord, browser, OBS dashboard, or stream monitor. Dual-monitor setup is elite.</div>
              </div>
            </div>
          </div>

          <div className="footer">
            <div>INDIA MONITOR GUIDE 2026 · <span>{profile.label} BUILD</span></div>
            <div>All prices indicative · verify on platform before purchasing</div>
          </div>

        </div>
      </div>
    </>
  );
}
