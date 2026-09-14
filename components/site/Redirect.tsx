'use client';

import { useEffect } from 'react';

/** Keeps the URLs the previous build published resolving to their sections. */
export function Redirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return (
    <p className="wrap t-small" style={{ paddingBlock: '8rem' }}>
      Moved. <a href={to} style={{ textDecoration: 'underline' }}>Continue</a>
    </p>
  );
}
