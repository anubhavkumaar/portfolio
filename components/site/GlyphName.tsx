import type { CSSProperties } from 'react';

/**
 * A name set one glyph per element, so each glyph can answer a spring.
 * Two nested spans per glyph on purpose: the outer one carries the entrance
 * (a rise through a mask), the inner one carries the spring, so the two never
 * fight over the same transform. Screen readers get the plain text; the glyph
 * spans are hidden from them.
 */
export function GlyphName({
  text,
  className = '',
  startAt = 0,
}: {
  text: string;
  className?: string;
  /** Index of the first glyph, so a second word can continue the first one's stagger. */
  startAt?: number;
}) {
  return (
    <span className={`gname${className ? ` ${className}` : ''}`}>
      <span className="sr-only">{text}</span>
      <span className="gname__line" aria-hidden="true">
        {Array.from(text).map((ch, i) =>
          ch === ' ' ? (
            <span key={i} className="gc gc--space" />
          ) : (
            <span key={i} className="gc" style={{ '--i': i + startAt } as CSSProperties}>
              <span className="gc__i">{ch}</span>
            </span>
          ),
        )}
      </span>
    </span>
  );
}
