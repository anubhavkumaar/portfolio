'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { SPRING, createSpring } from '@/lib/glyph-spring';
import { goSection } from './SmoothScroll';
import { SmokeBackdrop } from './SmokeBackdrop';

// The console and the SmoothUI primitives it pulls in are the heaviest script
// above the fold. They arrive after the page is interactive, behind a shell of
// the same size, so the name and the lede paint first and nothing shifts.
const HeroConsole = dynamic(() => import('@/app/hero-console').then((m) => m.HeroConsole), {
  ssr: false,
  loading: () => (
    <div className="hx-shell" aria-hidden="true">
      <span className="hx-shell__line" />
    </div>
  ),
});

/** The role line types through these. The first is in the static HTML, so the page reads correctly before any script runs. */
const ROLES = [
  'Full Stack Developer and GenAI Engineer',
  'Data Engineer',
  'Backend Engineer',
  'Agentic AI Engineer',
  'LLM and RAG Engineer',
  'Gamer',
];

const TYPE_MS = 46;
const DELETE_MS = 26;
const HOLD_MS = 2200;
const REST_MS = 420;

/**
 * The role line types a title, holds it, deletes it and types the next. The first
 * title is what the server renders and what stays under reduced motion, where
 * nothing types.
 */
function RoleTyper() {
  const [text, setText] = useState(ROLES[0]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let idx = 0;
    let shown = ROLES[0].length;
    let deleting = false;
    let timer = 0;
    const tick = () => {
      const target = ROLES[idx];
      if (!deleting) {
        if (shown < target.length) {
          shown += 1;
          setText(target.slice(0, shown));
          timer = window.setTimeout(tick, TYPE_MS);
        } else {
          deleting = true;
          timer = window.setTimeout(tick, HOLD_MS);
        }
      } else if (shown > 0) {
        shown -= 1;
        setText(target.slice(0, shown));
        timer = window.setTimeout(tick, DELETE_MS);
      } else {
        deleting = false;
        idx = (idx + 1) % ROLES.length;
        timer = window.setTimeout(tick, REST_MS);
      }
    };
    timer = window.setTimeout(tick, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <span className="hx__roles" aria-label={ROLES[0]}>
      <span className="hx__role-line" aria-hidden="true">
        {text}
        <span className="hx__caret" aria-hidden="true" />
      </span>
    </span>
  );
}

/**
 * The name. Each letter rises in on load. After that, letters near the cursor ease away from it
 * and settle back on the same spring the rest of the site uses (lib/glyph-spring.ts). Pointer
 * devices only, and not under reduced motion; the loop runs only while something is moving.
 */
function HeroName() {
  const root = useRef<HTMLHeadingElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const spring = createSpring();
    const glyphs = spring.add(Array.from(el.querySelectorAll<HTMLElement>('.hx__c')));
    let ready = false;
    let near = false;
    let measuredAt = 0;
    // Wait for the rise to finish (it is held back while the intro loader plays), then lift the
    // clip so pushed letters are not cut off.
    const html = document.documentElement;
    let t = 0;
    let mo: MutationObserver | null = null;
    const arm = () => {
      t = window.setTimeout(() => {
        ready = true;
        setLive(true);
      }, 1500);
    };
    if (html.hasAttribute('data-intro')) {
      mo = new MutationObserver(() => {
        if (html.hasAttribute('data-intro')) return;
        mo?.disconnect();
        arm();
      });
      mo.observe(html, { attributes: true, attributeFilter: ['data-intro'] });
    } else {
      arm();
    }

    const away = () => {
      if (!near) return;
      near = false;
      spring.release(glyphs);
    };
    const onMove = (e: PointerEvent) => {
      if (!ready) return;
      const r = el.getBoundingClientRect();
      const pad = SPRING.radius;
      const inside = e.clientX > r.left - pad && e.clientX < r.right + pad && e.clientY > r.top - pad && e.clientY < r.bottom + pad;
      if (!inside) {
        away();
        return;
      }
      const now = performance.now();
      if (!near || now - measuredAt > 250) {
        spring.measure(glyphs);
        measuredAt = now;
      }
      near = true;
      spring.push(glyphs, e.clientX + window.scrollX, e.clientY + window.scrollY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('blur', away);
    document.documentElement.addEventListener('mouseleave', away);
    return () => {
      window.clearTimeout(t);
      mo?.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('blur', away);
      document.documentElement.removeEventListener('mouseleave', away);
      spring.destroy();
    };
  }, []);

  return (
    <h1 ref={root} className={`hx__name${live ? ' is-live' : ''}`} aria-label="Anubhav Kumar">
      <span aria-hidden="true">
        <Letters text="Anubhav" start={0.3} />
        <br />
        <Letters text="Kumar" start={0.545} />
      </span>
    </h1>
  );
}

function Letters({ text, start }: { text: string; start: number }) {
  return (
    <>
      {text.split('').map((ch, i) => (
        <span key={i} className="hx__l" style={{ animationDelay: `${(start + i * 0.035).toFixed(3)}s` }}>
          <span className="hx__c">{ch}</span>
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const [still, setStill] = useState(false);
  const [phone, setPhone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (reduced || nav.connection?.saveData) setStill(true);
    const mq = window.matchMedia('(max-width: 767px)');
    const onMq = () => setPhone(mq.matches);
    onMq();
    mq.addEventListener('change', onMq);
    return () => mq.removeEventListener('change', onMq);
  }, []);

  return (
    <div className="hx">
      <SmokeBackdrop still={still} />

      <div className="hx__copy">
        <HeroName />
        <p className="hx__role">
          <span className="hx__pre">I am a </span>
          <RoleTyper />
        </p>
        <p className="hx__lede">
          <span className="hx__lede-long">
            I build AI agents, retrieval and the screens around them for a GenAI product platform at Deloitte: Python and
            FastAPI services, MCP tools on AWS Bedrock, and React front ends.
          </span>
          <span className="hx__lede-short">
            I build AI agents, retrieval and the screens around them for a GenAI product platform at Deloitte.
          </span>
        </p>
        <div className="hx__actions">
          <Link href="/work/" className="hx__btn hx__btn--solid" onClick={(e) => goSection(e, 'work')}>
            View work
          </Link>
          <Link href="/about/" className="hx__btn hx__btn--line" onClick={(e) => goSection(e, 'about')}>
            About me
          </Link>
          <a className="hx__btn hx__btn--text" href="/resume.pdf" download="Anubhav_Kumar_Resume.pdf">
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v11" />
              <path d="M7 10l5 5 5-5" />
              <path d="M5 20h14" />
            </svg>
            Resume
          </a>
        </div>
      </div>

      <div className="hx__chat">
        <aside className="hx__card" aria-label="Ask anubhav chat">
          <span className="hx__sheen" aria-hidden="true" />
          <HeroConsole compact={phone} />
        </aside>
      </div>

      <button type="button" className="hx__ctl" aria-pressed={still} onClick={() => setStill((s) => !s)}>
        {still ? (
          <>
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 5l12 7-12 7z" />
            </svg>
            Play background
          </>
        ) : (
          <>
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
            Pause background
          </>
        )}
      </button>
    </div>
  );
}
