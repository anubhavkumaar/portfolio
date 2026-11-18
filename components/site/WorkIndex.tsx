'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { PROJECTS } from '@/content/portfolio';
import { GROUPS, KIND_LABEL, caseHref, coverOf, groupSlug, markFrom, projectNumber, projectsIn, takeReturn, clearReturn } from '@/content/work-layout';

/**
 * Index: every project in its group, with sticky group pills (Index.dc.html on
 * desktop, MIndex.dc.html on phones; one layout that reflows). Each tile opens
 * its own case study. The agent tile plays its diagram loop, which shows its
 * poster under reduced motion.
 */
export function WorkIndex() {
  let k = 0;

  // Coming back from a case study: land where the visitor left the list.
  useEffect(() => {
    const y = takeReturn();
    if (y === null) return;
    const go = () => window.scrollTo(0, y);
    const t = window.setTimeout(go, 60);
    const t2 = window.setTimeout(() => {
      go();
      clearReturn();
    }, 400);
    go();
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, []);
  return (
    <div className="wi">
      <div className="wi__band-top" aria-hidden="true" />
      <div className="wi__band-bottom" aria-hidden="true" />

      <h1 className="wi__h">
        Everything I have built, <em>grouped by what it does.</em>
      </h1>

      <div className="wi__jump" role="group" aria-label="Jump to a group">
        {GROUPS.map((g) => (
          <a key={g} href={`#${groupSlug(g)}`} className="wi__pill">
            {g} <span>{projectsIn(g).length}</span>
          </a>
        ))}
      </div>

      {GROUPS.map((g, gi) => {
        const items = projectsIn(g);
        return (
          <section key={g} id={groupSlug(g)} className="wi__group" aria-label={g}>
            <div className="wi__ghead">
              <span className="wi__gnum">{String(gi + 1).padStart(2, '0')}</span>
              <h2 className="wi__gname">{g}</h2>
              <span className="wi__gcount">
                {items.length} {items.length === 1 ? 'project' : 'projects'}
              </span>
            </div>
            <div className="wi__grid">
              {items.map((p) => {
                const n = k++;
                return (
                  <Link
                    key={p.id}
                    href={caseHref(p.id)}
                    className="wi__tile"
                    onClick={() => markFrom('index')}
                    style={{ animationDelay: `${(Math.min(n, 8) * 0.07).toFixed(2)}s` }}
                  >
                    <span className="wi__plate">
                      <img
                        src={coverOf(p.id, true)}
                        alt=""
                        style={{ animationDuration: `${13 + (n % 3) * 3}s` }}
                        loading={n < 3 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                      {p.id === 'agent' && (
                        <video src="/redesign/media/agent-diagram.mp4" poster={coverOf(p.id, true)} autoPlay muted loop playsInline preload="metadata" />
                      )}
                      <span className="wi__idx">
                        {projectNumber(p.id)}
                        <span className="wi__kind">{KIND_LABEL[PROJECTS[p.id as keyof typeof PROJECTS].kind]}</span>
                      </span>
                      <span className="wi__view" aria-hidden="true">
                        View
                      </span>
                    </span>
                    <span className="wi__meta">
                      <span className="wi__name">{p.title}</span>
                      <span className="wi__year">
                        {p.year} <span aria-hidden="true">→</span>
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      <Link href="/about/" className="wi__next">
        <span className="wi__nextcopy">
          <span className="wi__keep">KEEP SCROLLING</span>
          <span className="wi__about">
            About me <span>→</span>
          </span>
        </span>
        <span className="wi__then">then Connect</span>
      </Link>
    </div>
  );
}
