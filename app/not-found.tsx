import Link from 'next/link';
import type { Metadata } from 'next';
import { PROJECTS } from '@/content/portfolio';

export const metadata: Metadata = { title: 'Anubhav Kumar' };

/**
 * 404 (NotFound.dc.html, MNotFound.dc.html): a searchlight orb drifts over a
 * dark ground, fibres flicker, and three projects offer a way back in.
 */
const PICKS = [
  { id: 'agent', note: 'A supervisor routes every request' },
  { id: 'mcp', note: 'One protocol, many tools' },
  { id: 'retrieval', note: 'Cites its sources or stays quiet' },
] as const;

export default function NotFound() {
  return (
    <div className="nf" data-not-found>
      <div className="nf__wash" aria-hidden="true" />

      <div className="nf__scene" aria-hidden="true">
        <svg className="nf__fibers" width="1200" height="520" viewBox="-600 -260 1200 520">
          <g fill="none" strokeWidth="1.4" strokeLinecap="round" style={{ stroke: 'var(--nf-fiber)' }}>
            <path className="nf__fiber" d="M-60 20 C-180 60 -260 10 -380 70 S-520 40 -600 90" />
            <path className="nf__fiber" d="M60 30 C190 80 250 30 360 110" style={{ animationDelay: '-.8s, -1.7s' }} />
            <path className="nf__fiber" d="M420 128 C470 150 520 140 600 180" style={{ animationDelay: '-1.2s, -3s' }} />
            <path className="nf__fiber" d="M-20 70 C-60 160 -140 200 -170 260" style={{ animationDelay: '-.4s, -2.2s' }} />
            <path className="nf__fiber" d="M30 -60 C110 -150 220 -170 330 -230" style={{ animationDelay: '-1.6s, -.9s' }} />
          </g>
          <g style={{ fill: 'var(--p-accent)' }}>
            <circle cx="-380" cy="70" r="3" />
            <circle cx="360" cy="110" r="3" />
            <circle cx="-170" cy="260" r="2.5" />
            <circle cx="330" cy="-230" r="2.5" />
          </g>
        </svg>
        <div className="nf__orbwrap">
          <div className="nf__beamwrap">
            <div className="nf__beam" />
          </div>
          <div className="nf__halo" />
          <div className="nf__orb" />
          <div className="nf__spec" />
        </div>
      </div>

      <section className="nf__copy" aria-labelledby="nf-title">
        <p className="nf__chip nf-up" style={{ animationDelay: '.1s' }}>
          GET /this-page <span aria-hidden="true">→</span> <span className="nf__code">404</span>
        </p>
        <h1 id="nf-title" className="nf__h nf-up" style={{ animationDelay: '.2s' }}>
          This route returned 404.
        </h1>
        <p className="nf__sub nf-up" style={{ animationDelay: '.3s' }}>
          The agent looked everywhere. It isn&apos;t here.
        </p>
        <div className="nf__actions nf-up" style={{ animationDelay: '.4s' }}>
          <Link href="/" className="nf__btn nf__btn--solid">
            Back home
          </Link>
          <Link href="/work/" className="nf__btn">
            See the work
          </Link>
          <Link href="/connect/" className="nf__btn">
            Let&apos;s talk
          </Link>
        </div>
      </section>

      <nav className="nf__picks nf-up" aria-label="Popular projects" style={{ animationDelay: '.55s' }}>
        <p className="nf__picks-h">OR START WITH ONE OF THESE</p>
        <div className="nf__cards">
          {PICKS.map((k) => (
            <Link key={k.id} href={`/work/${k.id}/`} className="nf__card">
              <img src={PROJECTS[k.id].cover} alt="" loading="lazy" decoding="async" />
              <span className="nf__ctext">
                <span className="nf__ctitle">{PROJECTS[k.id].title}</span>
                <span className="nf__cnote">{k.note}</span>
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
