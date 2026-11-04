'use client';

import { useRef } from 'react';
import { GROUPS, byGroup, type Profile, type StreamId } from '@/content/profiles';
import type { LiveStatus } from '@/lib/live-status';
import { BrandIcon } from './BrandIcon';
import { GlyphName } from './GlyphName';
import { Stagger } from './Stagger';
import { useGlyphRegister } from './useGlyphRegister';

/**
 * The profiles as two ruled registers, Social and Work, read from
 * content/profiles.ts. One column of full-width rows at every size, so the
 * layout can never leave a hole whatever the count.
 *
 * The signature: the name of the row under the pointer opens around it on the
 * same spring as the hero name. On touch the press does the same from the
 * point of contact. Both are off under reduced motion, where the colour change
 * alone carries the state.
 */

function Row({ p, live }: { p: Profile; live: LiveStatus }) {
  const entry = p.streams ? live.live[p.id as StreamId] : undefined;
  return (
    <li>
      <a
        className={`profile${entry ? ' is-live' : ''}`}
        href={p.href}
        target="_blank"
        rel="noreferrer noopener"
      >
        <span className="profile__icon" aria-hidden="true">
          <BrandIcon name={p.id} />
        </span>
        <span className="profile__head">
          <GlyphName text={p.name} className="profile__name t-title" />
          {entry && <span className="profile__live">live</span>}
        </span>
        <span className="profile__handle t-small">{p.handle}</span>
        {entry && <span className="profile__title t-small">{entry.title}</span>}
      </a>
    </li>
  );
}

export function ProfileRegister({ live, className = '' }: { live: LiveStatus; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useGlyphRegister(root, { rowSelector: '.profile', hover: { radius: 130, push: 11 } });

  return (
    <div ref={root} className={`profiles${className ? ` ${className}` : ''}`}>
      {GROUPS.map((g) => (
        <section key={g.id} className="profiles__group" aria-labelledby={`profiles-${g.id}`}>
          <h3 id={`profiles-${g.id}`} className="profiles__label t-small">
            {g.label}
          </h3>
          <Stagger>
            <ul className="profiles__list">
              {byGroup(g.id).map((p) => (
                <Row key={p.id} p={p} live={live} />
              ))}
            </ul>
          </Stagger>
        </section>
      ))}
    </div>
  );
}
