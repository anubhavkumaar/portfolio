'use client';

import { usePathname } from 'next/navigation';
import { Nav } from './Nav';
import { SmoothScroll } from './SmoothScroll';

/** Routes that are whole pages of their own: no site nav, no smooth scroll. */
export const BARE_ROUTE = /^\/(live|stream)(\/|$)/;

/**
 * The navigation and the scroll smoother belong to the portfolio. /live/ and
 * the stream scenes are standalone surfaces (one is opened from a chat link on
 * a phone, the others sit inside OBS), so they get neither.
 */
export function SiteChrome() {
  const path = usePathname();
  if (path && BARE_ROUTE.test(path)) return null;
  return (
    <>
      <SmoothScroll />
      <Nav />
    </>
  );
}
