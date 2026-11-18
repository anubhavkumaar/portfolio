'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { goSection } from './SmoothScroll';

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

/** The role cycler: one line, rolled by CSS (akRoles in redesign.css). The first role repeats last so the loop is seamless. */
const ROLES = [
  'Full Stack Developer and GenAI Engineer',
  'Data Engineer',
  'Backend Engineer',
  'Agentic AI Engineer',
  'LLM and RAG Engineer',
  'Gamer',
  'Full Stack Developer and GenAI Engineer',
];

function Letters({ text, start }: { text: string; start: number }) {
  return (
    <>
      {text.split('').map((ch, i) => (
        <span key={i} className="hx__l" style={{ animationDelay: `${(start + i * 0.035).toFixed(3)}s` }}>
          {ch}
        </span>
      ))}
    </>
  );
}

/**
 * The smoke loop behind the hero. The poster is a CSS background chosen by
 * theme and screen, so only the matching still is ever fetched, and it is what
 * shows when the video cannot play (iOS Low Power Mode blocks autoplay), when
 * the visitor presses Pause (WCAG 2.2.2), under reduced motion, and on Save-Data.
 */
function Backdrop({ still }: { still: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [phone, setPhone] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    const mq = window.matchMedia('(max-width: 767px)');
    const onMq = () => setPhone(mq.matches);
    onMq();
    mq.addEventListener('change', onMq);
    return () => {
      mo.disconnect();
      mq.removeEventListener('change', onMq);
    };
  }, []);

  const src = `/redesign/media/smoke-${theme}${phone ? '-phone' : ''}.mp4`;

  useEffect(() => {
    const v = ref.current;
    if (!v || still) return;
    setFailed(false);
    // Autoplay can be refused (iOS Low Power Mode): the poster stays. An abort
    // only means the source changed under us, which is not a refusal.
    v.play().catch((err: unknown) => {
      if ((err as { name?: string } | null)?.name !== 'AbortError') setFailed(true);
    });
  }, [src, still]);

  return (
    <div className="hx__bg" aria-hidden="true">
      <div className="hx__poster" />
      {!still && !failed && (
        <video
          ref={ref}
          className="hx__video"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
        />
      )}
      <div className="hx__scrim" />
    </div>
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
      <Backdrop still={still} />

      <div className="hx__copy">
        <p className="hx__eyebrow">
          <span className="hx__dot" aria-hidden="true" />
          <span className="hx__eyebrow-long">OPEN TO GENAI ENGINEERING ROLES</span>
          <span className="hx__eyebrow-short">OPEN TO GENAI ROLES</span>
        </p>
        <h1 className="hx__name" aria-label="Anubhav Kumar">
          <span aria-hidden="true">
            <Letters text="Anubhav" start={0.3} />
            <br />
            <Letters text="Kumar" start={0.545} />
          </span>
        </h1>
        <p className="hx__role">
          <span className="hx__pre">I am a </span>
          <span className="hx__roles" aria-label="Full Stack Developer and GenAI Engineer">
            <span className="hx__roles-track" aria-hidden="true">
              {ROLES.map((r, i) => (
                <span key={i} className="hx__role-line">
                  {r}
                  <span className="hx__caret" aria-hidden="true" />
                </span>
              ))}
            </span>
          </span>
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
