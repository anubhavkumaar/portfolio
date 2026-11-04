import { qrPath } from '@/lib/qr';

/**
 * Server component: the code is drawn at build time and arrives as plain SVG.
 * It sits on a light plate whatever the theme, because a scanner needs dark
 * modules on a light ground and a stream's compression makes that margin
 * matter. Colours are the site's own two grounds.
 */
export function QrCode({ text, label, className = 'st-qr__svg' }: { text: string; label: string; className?: string }) {
  const { size, d } = qrPath(text);
  return (
    <svg className={className} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label} shapeRendering="crispEdges">
      <rect width={size} height={size} fill="#f4f6fa" />
      <path d={d} fill="#0a0c10" />
    </svg>
  );
}
