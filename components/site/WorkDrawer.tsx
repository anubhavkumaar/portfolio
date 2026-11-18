'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { PROJECTS, type Group } from '@/content/portfolio';
import {
  DRAWER_ORDER,
  GROUPS,
  GROUP_COLOR,
  caseHref,
  coverOf,
  markFrom,
  projectsIn,
} from '@/content/work-layout';
import { DESKTOP_ORBIT, PHONE_ORBIT, orbitCss } from '@/lib/orbit';
import { useSection } from './ConnectedScroll';
import { ViewSwitch, type WorkView } from './ViewSwitch';
import { WorkFreestyle } from './WorkFreestyle';

const N = DRAWER_ORDER.length;
const TAB_X = ['0%', '33.5%', '67%'];

/** Keyframes are generated once: same Fibonacci-sphere formula the design used. */
const DESKTOP_CSS = orbitCss(N, DESKTOP_ORBIT);
const PHONE_CSS = orbitCss(N, PHONE_ORBIT);

/**
 * Work: the thumbnail sphere that files into a drawer, with the grouped list on
 * the left (Orbit.dc.html). Hovering a name or a file raises that file. Below
 * 1024px the phone version takes over: a compact sphere that drops into a
 * pile, filter pills and a link to the list (MWork.dc.html).
 */
function Drawer({ animate, onView }: { animate: boolean; onView: (v: WorkView) => void }) {
  const [hot, setHot] = useState(0);
  const list = DRAWER_ORDER.map((id) => PROJECTS[id]);
  const h = list[hot];

  return (
    <div className="wd" data-animate={animate}>
      <style>{DESKTOP_CSS}</style>
      <div className="wd__glow" aria-hidden="true" />

      <header className="wd__head">
        <div>
          <h2 className="wd__title">The work drawer</h2>
          <p className="wd__tag">20 projects, filed in 7 groups. Point at one to pull it out.</p>
        </div>
        <ViewSwitch view="drawer" onView={onView} />
      </header>

      <nav className="wd__list" aria-label="All projects">
        {GROUPS.map((g, gi) => {
          const items = projectsIn(g);
          return (
            <section key={g} className="wd__group" style={{ animationDelay: `${(2.35 + gi * 0.06).toFixed(2)}s` }}>
              <h3 className="wd__ghead">
                <span className="wd__dot" style={{ background: GROUP_COLOR[g] }} />
                {g.toUpperCase()} <span className="wd__gn">{items.length}</span>
              </h3>
              {items.map((p) => {
                const i = DRAWER_ORDER.indexOf(p.id as (typeof DRAWER_ORDER)[number]);
                return (
                  <Link
                    key={p.id}
                    href={caseHref(p.id)}
                    className={`wd__row${i === hot ? ' is-hot' : ''}`}
                    onClick={() => markFrom('drawer')}
                    onMouseEnter={() => setHot(i)}
                    onFocus={() => setHot(i)}
                  >
                    <span className="wd__rtitle">{p.title}</span>
                    <span className="wd__ryear">{p.year}</span>
                  </Link>
                );
              })}
            </section>
          );
        })}
      </nav>

      <div className="wd__intro" aria-hidden="true">
        <span>Anubhav Kumar</span>
        <span className="wd__intro-mid">Work</span>
        <span>20 projects, 7 kinds</span>
      </div>

      <div className="wd__stage" aria-label="Projects, filed in a drawer">
        <div className="wd__sp">
          {list.map((p, i) => {
            const on = i === hot;
            return (
              <Link
                key={p.id}
                href={caseHref(p.id)}
                className="wd__card"
                aria-label={p.title}
                onClick={() => markFrom('drawer')}
                onMouseEnter={() => setHot(i)}
                onFocus={() => setHot(i)}
                style={{
                  transform: `translateZ(${(i - (N - 1)) * 22}px) rotateX(-4deg)`,
                  animation: animate ? `akF${i} 2.9s linear ${(0.1 + i * 0.012).toFixed(3)}s backwards` : undefined,
                }}
              >
                <span className="wd__lift" style={{ transform: on ? 'translateY(-96px)' : 'none' }}>
                  <span
                    className="wd__tab"
                    style={{
                      left: TAB_X[i % 3],
                      background: on ? 'var(--w-tab-on)' : 'var(--w-tab)',
                      color: on ? 'var(--p-bg)' : 'var(--p-ink)',
                    }}
                  >
                    <span className="wd__tdot" style={{ background: GROUP_COLOR[p.group] }} />
                    <span className="wd__tnum">{String(i + 1).padStart(2, '0')}</span>
                    <span className="wd__ttext">{p.title}</span>
                  </span>
                  <span
                    className="wd__cover"
                    style={{
                      boxShadow: on
                        ? '0 0 0 2px var(--p-accent), 0 -14px 40px rgba(20,40,90,.28)'
                        : '0 0 0 1px var(--w-line), 0 -10px 30px rgba(20,40,90,.16)',
                    }}
                  >
                    <img src={coverOf(p.id)} alt="" loading="lazy" decoding="async" />
                    <span className="wd__gloss" aria-hidden="true" />
                    {on && <span className="wd__sheen" aria-hidden="true" />}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="wd__facewrap">
          <Link href={caseHref(h.id)} className="wd__face" onClick={() => markFrom('drawer')}>
            <span className="wd__fmeta">
              <span>FILE {String(hot + 1).padStart(2, '0')} / 20</span>
              <span className="wd__fgroup">
                <span className="wd__dot" style={{ background: GROUP_COLOR[h.group] }} />
                {h.group.toUpperCase()}
              </span>
            </span>
            <span className="wd__fmain">
              <span className="wd__ftext">
                <span className="wd__ftitle">{h.title}</span>
                <span className="wd__fyear">{h.year}, open the case study</span>
              </span>
              <span className="wd__farrow" aria-hidden="true">
                →
              </span>
            </span>
            <span className="wd__fgrip" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function PhoneWork({ animate }: { animate: boolean }) {
  const [group, setGroup] = useState<'All' | Group>('All');
  const list = DRAWER_ORDER.map((id) => PROJECTS[id]);
  const n = group === 'All' ? N : list.filter((p) => p.group === group).length;
  const caption = group === 'All' ? '20 projects in 7 groups' : `${group}, ${n} ${n === 1 ? 'project' : 'projects'}`;

  return (
    <div className="mw" data-animate={animate}>
      <style>{PHONE_CSS}</style>
      <div className="mw__head">
        <h2 className="mw__title">All the work</h2>
        <p className="mw__caption">{caption}</p>
      </div>

      <div className="mw__stage" aria-label="All work on a spinning sphere">
        <div className="mw__core" aria-hidden="true" />
        <div className="mw__sphere">
          {list.map((p, i) => {
            const match = group === 'All' || group === p.group;
            return (
              <Link
                key={p.id}
                href={caseHref(p.id)}
                className="mw__card"
                aria-label={p.title}
                tabIndex={match ? undefined : -1}
                onClick={() => markFrom('drawer')}
                style={{
                  opacity: match ? 1 : 0.12,
                  pointerEvents: match ? undefined : 'none',
                  zIndex: (match ? 200 : 100) - i,
                  transform: `translateY(${i * -9 + 60}px) translateZ(${-i * 26}px) rotateX(16deg) rotateZ(${((i % 2 ? 1 : -1) * Math.min(i, 6) * 0.6).toFixed(1)}deg)`,
                  animation: animate ? `akP${i} 2.8s linear ${(0.1 + i * 0.012).toFixed(3)}s both` : undefined,
                }}
              >
                <img src={coverOf(p.id, true)} alt="" loading="lazy" decoding="async" />
              </Link>
            );
          })}
        </div>
      </div>

      <p className="mw__hint">TAP THE PILE OR A NAME BELOW</p>
      <div className="mw__pills" role="group" aria-label="Filter by group">
        {(['All', ...GROUPS] as const).map((label) => (
          <button
            key={label}
            type="button"
            className="mw__pill"
            aria-pressed={label === group}
            onClick={() => setGroup(label)}
          >
            {label}
          </button>
        ))}
      </div>
      <Link href="/work/index/" className="mw__index" onClick={() => markFrom('index')}>
        See it as a list <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

export function WorkDrawer() {
  const { play } = useSection(1);
  const [wide, setWide] = useState<boolean | null>(null);
  const [view, setView] = useState<WorkView>('drawer');

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = () => setWide(mq.matches);
    onMq();
    mq.addEventListener('change', onMq);
    // The view lives in the address as ?view=drawer|freestyle.
    if (new URLSearchParams(window.location.search).get('view') === 'freestyle') setView('freestyle');
    return () => mq.removeEventListener('change', onMq);
  }, []);

  const changeView = (v: WorkView) => {
    setView(v);
    const url = new URL(window.location.href);
    if (v === 'freestyle') url.searchParams.set('view', 'freestyle');
    else url.searchParams.delete('view');
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  };

  const body = useMemo(() => {
    if (wide === null) return <div className="wd wd--pending" />;
    if (!wide) return <PhoneWork animate={play} />;
    return view === 'freestyle' ? (
      <WorkFreestyle animate={play} onView={changeView} />
    ) : (
      <Drawer animate={play} onView={changeView} />
    );
    // changeView only touches state and the URL
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wide, view, play]);

  return body;
}
