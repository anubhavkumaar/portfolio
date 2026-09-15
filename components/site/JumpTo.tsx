'use client';

import { useEffect } from 'react';
import { scrollToId } from './SmoothScroll';

/**
 * Lands a section route on its section. Runs once after mount, instantly,
 * so /work/ opens on the work the way a shared link should, and the address
 * bar keeps the path from there on.
 */
export function JumpTo({ id }: { id: string }) {
  useEffect(() => {
    const t = requestAnimationFrame(() => scrollToId(id, true));
    return () => cancelAnimationFrame(t);
  }, [id]);
  return null;
}
