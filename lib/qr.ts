import qrcode from 'qrcode-generator';

/**
 * A QR code as one SVG path, made with no network and no runtime cost: it is
 * called from a server component, so the code is drawn into the exported HTML
 * at build time. Nothing here ships to the browser.
 *
 * Error correction Q at version 3 holds the 30-character live URL in a 29 by
 * 29 grid, and Q survives the blocking that Kick and Twitch compression put on
 * a screen. Runs of dark modules in a row are merged into one rectangle, so
 * the path stays a few hundred bytes.
 */
export function qrPath(text: string, quiet = 3): { size: number; d: string } {
  const qr = qrcode(0, 'Q');
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  let d = '';
  for (let r = 0; r < n; r++) {
    let c = 0;
    while (c < n) {
      if (!qr.isDark(r, c)) {
        c++;
        continue;
      }
      let end = c;
      while (end < n && qr.isDark(r, end)) end++;
      d += `M${c + quiet} ${r + quiet}h${end - c}v1h-${end - c}z`;
      c = end;
    }
  }
  return { size: n + quiet * 2, d };
}
