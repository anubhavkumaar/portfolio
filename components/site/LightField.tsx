'use client';

import { useEffect, useRef } from 'react';
import { createLightField, type FieldController, type FieldOptions } from '@/lib/light-field';

/* The shader, the controller and the reasoning live in lib/light-field.ts.
   This is the mount: a host element that the canvas fills, and a hook for the
   surfaces that want to steer the light (/live/, stream mode). The landing
   mounts it with no props and gets exactly the field it always had. */

export function LightField({
  className = 'hero__field',
  options,
  onReady,
}: {
  className?: string;
  options?: FieldOptions;
  /** Hands the controller to a parent that wants to steer the light. */
  onReady?: (field: FieldController | null) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const ready = useRef(onReady);
  ready.current = onReady;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const field = createLightField(el, options);
    ready.current?.(field);
    return () => {
      ready.current?.(null);
      field?.destroy();
    };
    // The options are read once per mount, by design: the field is built, not re-rendered.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={host} className={className} aria-hidden="true" />;
}
