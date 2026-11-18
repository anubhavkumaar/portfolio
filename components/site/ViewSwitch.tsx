'use client';

import Link from 'next/link';
import { markFrom } from '@/content/work-layout';

export type WorkView = 'drawer' | 'freestyle';

/** Drawer / freestyle toggle plus "Index ↗" (ViewSwitch.dc.html). */
export function ViewSwitch({ view, onView }: { view: WorkView; onView: (v: WorkView) => void }) {
  return (
    <div className="vs">
      <div className="vs__group" role="group" aria-label="View">
        <button
          type="button"
          className="vs__btn"
          aria-pressed={view === 'drawer'}
          aria-label="Drawer view"
          title="Drawer"
          onClick={() => onView('drawer')}
        >
          <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4h7l2 2h3v6" />
            <path d="M4 9h8l2 2h6" />
            <rect x="3" y="13" width="18" height="7" rx="2" />
            <path d="M10 16.5h4" />
          </svg>
        </button>
        <button
          type="button"
          className="vs__btn"
          aria-pressed={view === 'freestyle'}
          aria-label="Freestyle view"
          title="Freestyle"
          onClick={() => onView('freestyle')}
        >
          <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
            <rect x="3" y="3" width="8" height="10" rx="1.5" />
            <rect x="13" y="3" width="8" height="6" rx="1.5" />
            <rect x="13" y="11" width="8" height="10" rx="1.5" />
            <rect x="3" y="15" width="8" height="6" rx="1.5" />
          </svg>
        </button>
      </div>
      <Link href="/work/index/" className="vs__index" onClick={() => markFrom(view)}>
        Index <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}
