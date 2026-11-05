'use client';

import { useRef } from 'react';
import { GROUPS, byGroup, type Profile, type ProfileId, type StreamId } from '@/content/profiles';
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

function Row({ p, live }: { p: Profile; live?: LiveStatus }) {
  const entry = p.streams && live ? live.live[p.id as StreamId] : undefined;
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

/**
 * `exclude` leaves profiles out of this register only; the list in
 * content/profiles.ts is untouched, so /live/ and stream mode still show them.
 * A group left with no rows is not drawn. `live` is optional: without it no
 * row shows a live state.
 */
export function ProfileRegister({
  live,
  exclude = [],
  className = '',
}: {
  live?: LiveStatus;
  exclude?: readonly ProfileId[];
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  useGlyphRegister(root, { rowSelector: '.profile', hover: { radius: 130, push: 11 } });

  const groups = GROUPS.map((g) => ({
    ...g,
    rows: byGroup(g.id).filter((p) => !exclude.includes(p.id)),
  })).filter((g) => g.rows.length > 0);

  return (
    <div ref={root} className={`profiles${className ? ` ${className}` : ''}`}>
      {groups.map((g) => (
        <section key={g.id} className="profiles__group" aria-labelledby={`profiles-${g.id}`}>
          <h3 id={`profiles-${g.id}`} className="profiles__label t-small">
            {g.label}
          </h3>
          <Stagger>
            <ul className="profiles__list">
              {g.rows.map((p) => (
                <Row key={p.id} p={p} live={live} />
              ))}
            </ul>
          </Stagger>
        </section>
      ))}
    </div>
  );
}
