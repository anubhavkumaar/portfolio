'use client';

import dynamic from 'next/dynamic';
import { useState, type ComponentType } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Plus } from 'lucide-react';
import { work, type CaseStudy } from '@/content/work';
import { Reveal } from './Reveal';

// The demos and the SmoothUI primitives they pull in are below the fold, so
// their code arrives when a spread is opened rather than in the first bundle.
const RagPipelineDemo = dynamic(() => import('@/app/enterprise-demos').then((m) => m.RagPipelineDemo), { ssr: false });
const AgentPlanDemo = dynamic(() => import('@/app/enterprise-demos').then((m) => m.AgentPlanDemo), { ssr: false });
const DeepChatDemo = dynamic(() => import('@/app/enterprise-demos').then((m) => m.DeepChatDemo), { ssr: false });

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Each case study carries a simulated model of the thing it describes. The
   product is internal, so this is the only honest way to show it working. */
const DEMOS: Record<string, ComponentType> = {
  'retrieval-layer': RagPipelineDemo,
  'agent-layer': AgentPlanDemo,
  backend: DeepChatDemo,
};

const LISTED = work.filter((w) => w.listed !== false);

function Spread({ c, open, onToggle }: { c: CaseStudy; open: boolean; onToggle: () => void }) {
  const reduced = useReducedMotion();
  const Demo = DEMOS[c.slug];
  const bodyId = `spread-${c.slug}`;

  return (
    <article className="spread" data-open={open}>
      <button
        type="button"
        className="spread__bar"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={bodyId}
      >
        <span>
          <span className="t-title spread__title">{c.title}</span>
          <span className="t-body spread__lede">{c.lede}</span>
        </span>
        <span className="spread__meta">
          <span className="t-meta spread__tag">
            {c.tag} {c.year}
          </span>
          <span className="spread__toggle" aria-hidden="true">
            <Plus size={16} />
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={bodyId}
            className="spread__body"
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.62, ease: EASE }}
          >
            <div className="spread__grid">
              <div>
                <dl className="beats">
                  {c.beats.map((b) => (
                    <div key={b.label} className="beat">
                      <dt className="beat__label">{b.label}</dt>
                      <dd className="t-body muted">{b.body}</dd>
                    </div>
                  ))}
                </dl>
                <div className="spread__stack" aria-label="Built with">
                  {c.stack.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {Demo && (
                <div className="glass spread__demo">
                  <p className="t-small" style={{ marginBottom: '0.9rem' }}>
                    Simulated. Illustrative content, no product data.
                  </p>
                  <Demo />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export function Spreads() {
  const [openSlug, setOpenSlug] = useState<string | null>(LISTED[0].slug);

  return (
    <section className="section" id="work">
      <div className="wrap">
        <div className="section__head">
          <Reveal>
            <h2 className="t-display">Three pieces of work, told properly.</h2>
          </Reveal>
          <p className="t-lead muted">
            Each one names the problem, the constraint that made it hard, what I decided, and what
            it cost. Open one.
          </p>
        </div>

        <div className="spreads">
          {LISTED.map((c) => (
            <Spread
              key={c.slug}
              c={c}
              open={openSlug === c.slug}
              onToggle={() => setOpenSlug(openSlug === c.slug ? null : c.slug)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
