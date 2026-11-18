'use client';

import Link from 'next/link';
import { goSection } from './SmoothScroll';

/**
 * About (About.dc.html, MAbout.dc.html): the portrait wipes up into its frame
 * then drifts, the headline rises line by line, the copy and fact cards fade
 * up, the path line draws and each milestone pops in turn. Copy is the
 * design's, verbatim. No location appears anywhere on it.
 */

const FACTS = [
  { v: '3 yrs', k: 'at Deloitte, now on GenAI' },
  { v: '20', k: 'projects, work and side builds' },
  { v: '7', k: 'kinds of work, agents to automation' },
];

const PATH = [
  { y: '2019', what: 'B.Tech, Mechanical, KIIT' },
  { y: '2022', what: 'Internships at IOCL and Komatsu' },
  { y: '2023', what: 'Joined Deloitte, data and analytics' },
  { y: 'NOW', what: 'GenAI developer, agents and retrieval' },
];

const LINES = [
  { text: 'I build AI products', accent: false, d: 0.25 },
  { text: 'that hold up', accent: false, d: 0.33 },
  { text: 'in real use.', accent: true, d: 0.41 },
];

export function About() {
  return (
    <div className="ab">
      <div className="ab__halo" aria-hidden="true" />

      <figure className="ab__fig">
        <div className="ab__frame">
          <img
            src="/about.jpg"
            alt="Illustration of Anubhav at his desk, smiling, with code on his monitors"
            width={1024}
            height={1024}
          />
          <div className="ab__shade" aria-hidden="true" />
        </div>
        <figcaption className="ab__cap">
          <span className="ab__capname">
            <span className="ab__name">Anubhav Kumar</span>
            <span className="ab__sub">at the desk, usually with something running</span>
          </span>
          <span className="ab__open">
            <span className="ab__opendot" />
            OPEN TO ROLES
          </span>
        </figcaption>
      </figure>

      <div className="ab__copy">
        <p className="ab__label">04 / ABOUT</p>
        <h2 className="ab__h" aria-label="I build AI products that hold up in real use.">
          {LINES.map((ln) => (
            <span key={ln.text} className={`ab__line${ln.accent ? ' is-accent' : ''}`} aria-hidden="true">
              <span className="ab__w" style={{ animationDelay: `${ln.d.toFixed(2)}s` }}>
                {ln.text}
              </span>
            </span>
          ))}
        </h2>
        <div className="ab__text">
          <p>
            GenAI developer at Deloitte. I work across the stack on a GenAI product platform: the agents and retrieval
            underneath, the services in between, and the chat people actually use.
          </p>
          <p>
            Mechanical engineer by degree, software by choice. Off the clock I build my own tools and automations, and
            small sites for the gaming communities I play in.
          </p>
        </div>

        <div className="ab__facts">
          {FACTS.map((f) => (
            <div key={f.v} className="ab__fact">
              <span className="ab__fv">{f.v}</span>
              <span className="ab__fk">{f.k}</span>
            </div>
          ))}
        </div>

        <div className="ab__path" aria-label="Path so far">
          <div className="ab__track" aria-hidden="true" />
          <div className="ab__draw" aria-hidden="true" />
          <ol className="ab__steps">
            {PATH.map((p, i) => (
              <li key={p.y} className="ab__step">
                <span
                  className={`ab__dot${i === PATH.length - 1 ? ' is-now' : ''}`}
                  aria-hidden="true"
                  style={{ animationDelay: `${(1.0 + i * 0.4).toFixed(1)}s` }}
                />
                <span className="ab__year">{p.y}</span>
                <span className="ab__what">{p.what}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="ab__stack">Python, FastAPI, LangGraph, MCP, AWS Bedrock, React</p>

        <div className="ab__actions">
          <Link href="/work/" className="ab__btn ab__btn--solid ab__btn--d" onClick={(e) => goSection(e, 'work')}>
            See the work
          </Link>
          <Link href="/work/index/" className="ab__btn ab__btn--solid ab__btn--m">
            See the work
          </Link>
          <Link href="/connect/" className="ab__btn ab__btn--line" onClick={(e) => goSection(e, 'connect')}>
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}
