'use client';

import { useEffect, useRef, useState } from 'react';
import { SmokeBackdrop } from './SmokeBackdrop';

/**
 * Connect (Connect.dc.html, MConnect.dc.html): contact for work only. The
 * headline rises letter by letter, the dot pings, tiles rise in one after
 * another and each brand glow drifts; hover lifts a tile and nudges its arrow.
 * Copy flips to a toast that is announced politely to screen readers.
 */

const EMAIL = 'work@anubhavkumaar.in';

const ICON = {
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  github:
    'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  x: 'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z',
};

type Tile = { name: string; kind: string; handle: string; url: string; light: string; dark: string; icon: string; hot?: boolean };

const LINKEDIN: Tile = { name: 'LinkedIn', kind: 'PROFILE', handle: 'in/anubhavkumaar', url: 'https://www.linkedin.com/in/anubhavkumaar/', light: '#2f7de1', dark: '#2f7de1', icon: ICON.linkedin, hot: true };
const GITHUB: Tile = { name: 'GitHub', kind: 'CODE', handle: '@anubhavkumaar', url: 'https://github.com/anubhavkumaar', light: '#24292f', dark: '#c9d1d9', icon: ICON.github };
const X: Tile = { name: 'X', kind: 'SOCIAL', handle: '@theanubhavkumar', url: 'https://x.com/theanubhavkumar', light: '#0f1419', dark: '#e7e9ea', icon: ICON.x };

const GROUPS: { label: string; items: Tile[] }[] = [
  { label: 'WORK', items: [LINKEDIN, GITHUB] },
  { label: 'ELSEWHERE', items: [X] },
];

const HEAD = "Let's talk.";

const tc = (t: Tile) => ({ '--tc-l': t.light, '--tc-d': t.dark }) as React.CSSProperties;

export function Connect() {
  const [copied, setCopied] = useState(false);
  const [still, setStill] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (reduced || nav.connection?.saveData) setStill(true);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      /* the address is selectable on the page as a fallback */
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  };

  let k = 0;
  return (
    <div className="cx">
      <SmokeBackdrop still={still} flip />

      <section className="cx__lead">
        <p className="cx__status">
          <span className="cx__dot" aria-hidden="true" />
          <span className="cx__status-long">OPEN TO GENAI AND AI ENGINEERING ROLES</span>
          <span className="cx__status-short">OPEN TO GENAI AND AI ROLES</span>
        </p>
        <h2 className="cx__h" aria-label={HEAD}>
          <span aria-hidden="true">
            {[...HEAD].map((ch, i) => (
              <span key={i} className="cx__l" style={{ animationDelay: `${(0.2 + i * 0.035).toFixed(3)}s` }}>
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </span>
        </h2>
        <p className="cx__lede">
          Hiring, a project, or a question about something I built. Email or LinkedIn gets the fastest reply.
        </p>
        <div className="cx__mail">
          <span className="cx__writeto">write to</span>
          <div className="cx__mailrow">
            <a className="cx__addr" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <button type="button" className="cx__copy" onClick={copy} aria-label="Copy email address">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="12" height="12" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </svg>
              <span className="cx__copy-long">Copy</span>
              <span className="cx__copy-short">Copy email</span>
            </button>
          </div>
        </div>
      </section>

      <section className="cx__profiles" aria-label="Profiles">
        {GROUPS.map((g) => (
          <div key={g.label} className="cx__group">
            <h3 className="cx__glabel">{g.label}</h3>
            <div className="cx__grid">
              {g.items.map((s) => (
                <a
                  key={s.name}
                  className={`cx__tile${s.hot ? ' is-hot' : ''}`}
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  style={{ ...tc(s), animationDelay: `${(0.35 + k++ * 0.07).toFixed(2)}s` }}
                >
                  <span className="cx__glow" aria-hidden="true" />
                  <span className="cx__top">
                    <span className="cx__kind">
                      <span className="cx__icon">
                        <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                          <path d={s.icon} />
                        </svg>
                      </span>
                      <span className="cx__kindtext">{s.kind}</span>
                    </span>
                    <svg className="cx__arrow" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </span>
                  <span className="cx__names">
                    <span className="cx__name">{s.name}</span>
                    <span className="cx__handle">{s.handle}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>

      <button type="button" className="hx__ctl cx__ctl" aria-pressed={still} onClick={() => setStill((s) => !s)}>
        {still ? 'Play background' : 'Pause background'}
      </button>

      <div className="cx__toast" role="status" aria-live="polite">
        {copied && (
          <span className="cx__toast-pill">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5 9-10" />
            </svg>
            Email copied
          </span>
        )}
      </div>
    </div>
  );
}
