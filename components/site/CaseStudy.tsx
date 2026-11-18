'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ACC, MINI, PROJECTS, STATUS, isWorkProject, type Project, type ProjectId } from '@/content/portfolio';
import { caseHref, neighbours, projectNumber, readFrom } from '@/content/work-layout';

/**
 * One template for all 20 case studies (CaseStudy.dc.html, MCase.dc.html):
 * four hero kinds (agent, flow, cinema, browser) and three layouts (stacked,
 * split, full). Work projects stay generic on purpose and carry the
 * "Work project, details generalized" chip.
 */

const css = (v: Record<string, string>) => v as React.CSSProperties;

/** The delays the design gives each part of the intro. */
const step = (base: number, i: number, gap: number) => `${(base + i * gap).toFixed(2)}s`;

/* ── Heroes: desktop ─────────────────────────────────────────────────────── */

const S = {
  node: { fill: 'var(--c-diag-node)', stroke: 'var(--c-diag-line)' },
  mute: { fill: 'var(--c-diag-mute)' },
  ink: { fill: 'var(--c-diag-ink)' },
  chip: { fill: 'var(--c-diag-chip)' },
  acc: { fill: 'var(--c-accent)' },
  on: { fill: 'var(--c-on-accent)' },
} as const;

function AgentDiagram() {
  return (
    <>
      <video className="cs-h__fill" src="/redesign/media/agent-diagram.mp4" poster="/redesign/media/agent-diagram.jpg" autoPlay muted loop playsInline preload="metadata" style={{ opacity: 'var(--c-diag-img)' }} />
      <div className="cs-h__fill" style={{ background: 'var(--c-diag-bg)', opacity: 0.55 }} />
      <svg
        className="cs-h__fill"
        viewBox="0 0 960 290"
        role="img"
        aria-label="Architecture: chat sends a request to a supervisor, which routes it to specialist agents; they call tools through MCP servers that reach data and systems, and the answer streams back to chat."
        style={{ fontFamily: 'var(--font-mono), monospace' }}
      >
        <g fill="none" style={{ stroke: 'var(--c-diag-line)' }} strokeWidth="1.4">
          <path className="cs-flow" d="M138 150 H206" />
          <path className="cs-flow" d="M318 150 C370 150 370 80 420 80" />
          <path className="cs-flow" d="M318 150 H420" />
          <path className="cs-flow" d="M318 150 C370 150 370 220 420 220" />
          <path className="cs-flow" d="M560 80 C600 80 600 150 640 150" />
          <path className="cs-flow" d="M560 150 H640" />
          <path className="cs-flow" d="M560 220 C600 220 600 150 640 150" />
          <path className="cs-flow" d="M772 150 H822" />
        </g>
        <path className="cs-back" d="M262 196 C262 262 80 262 80 186" fill="none" style={{ stroke: 'var(--c-accent)' }} strokeWidth="1.4" />
        <text x="171" y="276" textAnchor="middle" fontSize="10" style={S.mute}>
          answer streams back
        </text>

        <g className="cs-in" style={{ animationDelay: '.05s' }}>
          <rect x="22" y="114" width="116" height="72" rx="14" style={S.node} />
          <rect x="40" y="134" width="60" height="8" rx="4" style={S.mute} opacity=".5" />
          <rect x="40" y="150" width="78" height="8" rx="4" style={S.mute} opacity=".35" />
          <text x="80" y="208" textAnchor="middle" fontSize="11" style={S.ink}>
            chat
          </text>
        </g>

        <g className="cs-in" style={{ animationDelay: '.15s' }}>
          <circle className="cs-pulse" cx="262" cy="150" r="58" style={S.acc} opacity=".35" />
          <circle cx="262" cy="150" r="46" style={S.acc} />
          <text x="262" y="147" textAnchor="middle" fontSize="12" fontWeight="500" style={S.on}>
            supervisor
          </text>
          <text x="262" y="163" textAnchor="middle" fontSize="9.5" style={S.on} opacity=".8">
            plan and route
          </text>
        </g>

        <g className="cs-in" style={{ animationDelay: '.3s' }}>
          <text x="490" y="40" textAnchor="middle" fontSize="10" letterSpacing="1.5" style={S.mute}>
            SPECIALIST AGENTS
          </text>
          {[
            ['knowledge', 58, 84],
            ['operations', 128, 154],
            ['service', 198, 224],
          ].map(([label, y, ty]) => (
            <g key={label as string}>
              <rect x="420" y={y as number} width="140" height="44" rx="10" style={S.node} />
              <text x="490" y={ty as number} textAnchor="middle" fontSize="11" style={S.ink}>
                {label}
              </text>
            </g>
          ))}
        </g>

        <g className="cs-in" style={{ animationDelay: '.45s' }}>
          <text x="706" y="40" textAnchor="middle" fontSize="10" letterSpacing="1.5" style={S.mute}>
            MCP SERVERS
          </text>
          <rect x="640" y="58" width="132" height="184" rx="14" style={{ fill: 'var(--c-diag-node)', stroke: 'var(--c-accent)' }} />
          {[78, 108, 168, 198].map((y) => (
            <rect key={y} x="660" y={y} width="92" height="22" rx="6" style={S.chip} />
          ))}
          <rect x="660" y="138" width="92" height="22" rx="6" style={S.acc} opacity=".85" />
          <text x="706" y="153" textAnchor="middle" fontSize="10" style={S.on}>
            tool
          </text>
        </g>

        <g className="cs-in" style={{ animationDelay: '.6s' }}>
          <text x="880" y="40" textAnchor="middle" fontSize="10" letterSpacing="1.5" style={S.mute}>
            DATA AND SYSTEMS
          </text>
          <ellipse cx="880" cy="96" rx="52" ry="12" style={S.node} />
          <path d="M828 96 V128 A52 12 0 0 0 932 128 V96" style={S.node} />
          <rect x="828" y="150" width="104" height="34" rx="8" style={S.node} />
          <rect x="828" y="196" width="104" height="34" rx="8" style={S.node} />
          <text x="880" y="171" textAnchor="middle" fontSize="10" style={S.mute}>
            documents
          </text>
          <text x="880" y="217" textAnchor="middle" fontSize="10" style={S.mute}>
            services
          </text>
        </g>

        <g style={S.acc}>
          <circle r="3.5">
            <animateMotion dur="3.2s" repeatCount="indefinite" path="M138 150 H206" />
          </circle>
          <circle r="3.5">
            <animateMotion dur="2.6s" begin=".8s" repeatCount="indefinite" path="M318 150 H420" />
          </circle>
          <circle r="3.5">
            <animateMotion dur="2.8s" begin=".4s" repeatCount="indefinite" path="M560 220 C600 220 600 150 640 150" />
          </circle>
          <circle r="3.5">
            <animateMotion dur="2.2s" begin="1.2s" repeatCount="indefinite" path="M772 150 H822" />
          </circle>
          <circle r="3">
            <animateMotion dur="3.6s" begin=".2s" repeatCount="indefinite" path="M262 196 C262 262 80 262 80 186" />
          </circle>
        </g>
      </svg>
    </>
  );
}

function FlowHero({ p }: { p: Project }) {
  const steps = p.steps ?? [];
  return (
    <>
      <img className="cs-h__fill cs-kb18" src={p.cover} alt="" style={{ opacity: 'var(--c-flow-img)' }} />
      <div className="cs-h__fill" style={{ background: 'var(--c-flow-veil)' }} />
      <div className="csf">
        {steps.map((label, i) => {
          const on = i === p.hot;
          return (
            <span key={label} className="csf__seg" style={{ flex: i === 0 ? '0 0 auto' : '1 1 0' }}>
              <span className="csf__line" style={{ backgroundImage: i === 0 ? 'none' : 'linear-gradient(90deg, var(--c-node-line) 50%, transparent 50%)' }} />
              <span className="csf__node" style={{ animationDelay: step(0.6, i, 0.18) }}>
                <span
                  className="csf__box"
                  style={{
                    background: on ? 'var(--c-accent)' : 'var(--c-node-bg)',
                    color: on ? 'var(--c-on-accent)' : 'var(--c-node-fg)',
                    borderColor: on ? 'var(--c-accent)' : 'var(--c-node-line)',
                    boxShadow: on ? '0 0 30px var(--c-accent)' : 'none',
                  }}
                >
                  {label}
                </span>
                <span className="csf__n">{String(i + 1).padStart(2, '0')}</span>
              </span>
            </span>
          );
        })}
        <span className="csf__dot" aria-hidden="true" />
      </div>
    </>
  );
}

function CinemaHero({ p, flip }: { p: Project; flip: boolean }) {
  return (
    <>
      <img className="cs-h__fill cs-kb20" src={p.cover} alt="" />
      <div className="cs-h__sweep" />
      <div className="cs-h__fill" style={{ background: flip ? 'var(--c-cine-veil-flip)' : 'var(--c-cine-veil)' }} />
      <span className="cs-h__num" style={flip ? { right: '6%' } : { left: '6%' }}>
        {projectNumber(p.id)}
      </span>
    </>
  );
}

function BrowserHero({ p }: { p: Project }) {
  const host = (p.live ?? '').replace('https://', '');
  return (
    <>
      <img className="cs-h__blur" src={p.cover} alt="" />
      <div className="csb">
        <div className="csb__bar">
          <span className="csb__d" style={{ background: '#ff5f57' }} />
          <span className="csb__d" style={{ background: '#febc2e' }} />
          <span className="csb__d" style={{ background: '#28c840' }} />
          <span className="csb__urlwrap">
            <span className="csb__url">{host}</span>
          </span>
        </div>
        <div className="csb__view">
          <img src={p.cover} alt="" />
        </div>
      </div>
      <span className="csb__live">
        <span className="csb__ping" />
        LIVE
      </span>
    </>
  );
}

/* ── Heroes: phone ───────────────────────────────────────────────────────── */

function PhoneHero({ p }: { p: Project }) {
  const steps = p.steps ?? [];
  if (p.kind === 'agent') {
    return (
      <>
        <video className="cs-h__fill" src="/redesign/media/agent-diagram.mp4" poster="/redesign/media/agent-diagram.jpg" autoPlay muted loop playsInline preload="metadata" style={{ opacity: 0.55 }} />
        <div className="cs-h__fill" style={{ background: 'linear-gradient(180deg, rgba(7,11,22,.35), rgba(7,11,22,.75))' }} />
        <div className="csp-agent">
          <span className="csp-agent__chip" style={{ animationDelay: '.4s' }}>chat</span>
          <span className="csp-agent__rule" />
          <span className="csp-agent__sup">supervisor</span>
          <span className="csp-agent__rule" />
          <span className="csp-agent__specs">
            {['knowledge', 'operations', 'service'].map((s) => (
              <span key={s}>{s}</span>
            ))}
          </span>
          <span className="csp-agent__rule" />
          <span className="csp-agent__mcp">MCP servers → data and systems</span>
        </div>
      </>
    );
  }
  if (p.kind === 'flow') {
    return (
      <>
        <img className="cs-h__fill cs-kb18" src={p.cover} alt="" style={{ opacity: 0.85 }} />
        <div className="cs-h__fill" style={{ background: 'linear-gradient(180deg, rgba(7,11,22,.4), rgba(7,11,22,.7))' }} />
        <div className="csp-flow">
          <span className="csp-flow__rail" />
          <span className="csp-flow__dot" />
          {steps.map((label, i) => {
            const on = i === p.hot;
            return (
              <span key={label} className="csp-flow__step" style={{ animationDelay: step(0.5, i, 0.15) }}>
                <span
                  className="csp-flow__box"
                  style={{
                    background: on ? 'var(--c-accent)' : 'rgba(11,17,32,.72)',
                    color: on ? '#070b16' : '#eef2fb',
                    borderColor: on ? 'var(--c-accent)' : 'rgba(255,255,255,.24)',
                    boxShadow: on ? '0 0 24px var(--c-accent)' : 'none',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="csp-flow__label">{label}</span>
              </span>
            );
          })}
        </div>
      </>
    );
  }
  if (p.kind === 'cinema') {
    return (
      <>
        <img className="cs-h__fill cs-kb20" src={p.cover} alt="" />
        <div className="cs-h__sweep cs-h__sweep--phone" />
        <div className="cs-h__fill" style={{ background: 'linear-gradient(180deg, rgba(7,11,22,0) 50%, var(--c-bg) 100%)' }} />
        <span className="cs-h__num cs-h__num--phone">{projectNumber(p.id)}</span>
      </>
    );
  }
  const host = (p.live ?? '').replace('https://', '');
  return (
    <>
      <img className="cs-h__blur" src={p.cover} alt="" />
      <div className="csb csb--phone">
        <div className="csb__bar">
          <span className="csb__d" style={{ background: '#ff5f57' }} />
          <span className="csb__d" style={{ background: '#febc2e' }} />
          <span className="csb__d" style={{ background: '#28c840' }} />
          <span className="csb__url csb__url--phone">{host}</span>
        </div>
        <div className="csb__view">
          <img src={p.cover} alt="" />
        </div>
      </div>
    </>
  );
}

const PHONE_HEIGHT = (p: Project) =>
  p.kind === 'cinema' ? 460 : p.kind === 'flow' ? 90 + (p.steps?.length ?? 0) * 70 : p.kind === 'agent' ? 480 : 420;

/* ── The page ────────────────────────────────────────────────────────────── */

export function CaseStudy({ id }: { id: ProjectId }) {
  const p = PROJECTS[id];
  const router = useRouter();
  const idx = projectNumber(id);
  const { prev, next } = neighbours(id);
  const work = isWorkProject(id);
  const mini = MINI[id];
  const status = STATUS[id];
  const flip = p.layout === 'full' && parseInt(idx, 10) % 2 === 1;
  const splitFlip = p.layout === 'split' && parseInt(idx, 10) % 2 === 0;

  const [wide, setWide] = useState<boolean | null>(null);
  const [back, setBack] = useState({ href: '/work/', label: 'Work' });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = () => setWide(mq.matches);
    onMq();
    mq.addEventListener('change', onMq);
    setBack(readFrom());
    return () => mq.removeEventListener('change', onMq);
  }, [id]);

  // The arrow keys cycle through all 20, unless the visitor is typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if (e.key === 'ArrowLeft') router.push(caseHref(prev.id));
      else if (e.key === 'ArrowRight') router.push(caseHref(next.id));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router, prev.id, next.id]);

  const accent = ACC[p.group];
  const hero = wide === null ? null : wide ? (
    <>
      {p.kind === 'agent' && <AgentDiagram />}
      {p.kind === 'flow' && <FlowHero p={p} />}
      {p.kind === 'cinema' && <CinemaHero p={p} flip={flip} />}
      {p.kind === 'browser' && <BrowserHero p={p} />}
    </>
  ) : (
    <PhoneHero p={p} />
  );

  const chips = (
    <div className="cs-a__chips">
      {work ? (
        <span className="cs-chip">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          Work project, details generalized
        </span>
      ) : (
        <span className="cs-chip">Personal build</span>
      )}
      {status && (
        <span className="cs-chip">
          <span className="cs-chip__live" aria-hidden="true" />
          {status}
        </span>
      )}
      {work && (
        <Link href="/connect/" className="cs-a__talk">
          Deeper walkthrough on request <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );

  return (
    <div
      className={`cs cs--${p.layout} cs--${p.kind}${flip || splitFlip ? ' is-flip' : ''}`}
      style={css({ '--c-accent-l': accent[0], '--c-accent-d': accent[1], '--hh': `${PHONE_HEIGHT(p)}px` })}
    >
      {p.layout !== 'full' && (
        <div className="cs__backdrop" aria-hidden="true">
          <img src={p.cover} alt="" />
          <div />
        </div>
      )}

      <div className="cs__hero" aria-hidden="true">
        {hero}
      </div>

      <article className="cs__article" aria-labelledby="cs-title">
        <p className="cs-a__meta cs-up" style={{ animationDelay: '.3s' }}>
          <span>{idx}</span>
          <span className="cs-a__rule" />
          <span>
            {p.group.toUpperCase()}, {p.year}
          </span>
        </p>
        <h1 id="cs-title" className="cs-a__title">
          <span>{p.title}</span>
        </h1>
        <p className="cs-a__lede cs-up" style={{ animationDelay: '.5s' }}>
          {p.lede}
        </p>
        {chips}

        <div className="cs-a__blocks" style={css({ '--cols': String(Math.min(p.blocks.length, 4)) })}>
          {p.blocks.map(([label, text], i) => (
            <section key={label} className="cs-a__block cs-up" style={{ animationDelay: step(0.6, i, 0.1) }}>
              <h2>{label}</h2>
              <p>{text}</p>
            </section>
          ))}
        </div>

        {mini && (
          <div className="cs-a__mini cs-up" style={{ animationDelay: '.9s' }}>
            <h2>HOW IT FLOWS</h2>
            <div role="img" aria-label={`How it flows: ${mini.steps.join(', then ')}`} className="cs-a__strip">
              {mini.steps.map((label, i) => {
                const on = i === mini.hot;
                return (
                  <span key={label} className="cs-a__stripitem" aria-hidden="true">
                    {i > 0 && <span className="cs-a__link" />}
                    <span
                      className="cs-a__node"
                      style={{
                        animationDelay: step(1.0, i, 0.12),
                        background: on ? 'var(--c-accent)' : 'var(--c-tag)',
                        color: on ? 'var(--c-on-accent)' : 'var(--c-ink)',
                        borderColor: on ? 'var(--c-accent)' : 'var(--c-line)',
                        boxShadow: on ? '0 0 22px var(--c-accent)' : 'none',
                      }}
                    >
                      {label}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Desktop footer */}
        <div className="cs-a__foot cs-up" style={{ animationDelay: '.95s' }}>
          {p.stack.map((s) => (
            <span key={s} className="cs-a__stack">
              {s}
            </span>
          ))}
          <span style={{ flex: 1 }} />
          {p.live && (
            <a className="cs-btn" href={p.live} target="_blank" rel="noopener">
              Open live site ↗
            </a>
          )}
          <Link className="cs-btn cs-btn--solid" href="/">
            Ask anubhav about this
          </Link>
          <Link className="cs-btn cs-btn--icon" href={caseHref(prev.id)} aria-label={`Previous project: ${prev.title}`} title={prev.title}>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </Link>
          <Link className="cs-btn" href={caseHref(next.id)} aria-label={`Next project: ${next.title}`}>
            Next: {next.title} <span aria-hidden="true">→</span>
          </Link>
          <Link className="cs-btn cs-btn--icon" href={back.href} aria-label="Close case study">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </Link>
        </div>

        {/* Phone footer */}
        <div className="cs-pf">
          <div className="cs-pf__stack">
            {p.stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          {p.live && (
            <a className="cs-pf__btn" href={p.live} target="_blank" rel="noopener">
              Open live site ↗
            </a>
          )}
          <Link className="cs-pf__btn cs-pf__btn--solid" href="/">
            Ask anubhav about this
          </Link>
          <div className="cs-pf__nav">
            <Link href={caseHref(prev.id)}>
              <span>← PREVIOUS</span>
              <strong>{prev.title}</strong>
            </Link>
            <Link href={caseHref(next.id)} className="is-next">
              <span>NEXT →</span>
              <strong>{next.title}</strong>
            </Link>
          </div>
          <Link href={back.href} className="cs-pf__back">
            ← Back to {back.label}
          </Link>
        </div>
      </article>
    </div>
  );
}

