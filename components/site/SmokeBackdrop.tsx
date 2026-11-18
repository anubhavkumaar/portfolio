'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The smoke loop behind the hero and Connect. The poster is a CSS background
 * chosen by theme and screen (see .hx__poster), so only the matching still is
 * ever fetched, and it is what shows when the video cannot play (iOS Low Power
 * Mode blocks autoplay), when the visitor presses Pause (WCAG 2.2.2), under
 * reduced motion and on Save-Data. The loop also pauses while it is off screen.
 */
export function SmokeBackdrop({ still, flip = false }: { still: boolean; flip?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [phone, setPhone] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    const read = () => setTheme(html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    read();
    const mo = new MutationObserver(read);
    mo.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    const mq = window.matchMedia('(max-width: 767px)');
    const onMq = () => setPhone(mq.matches);
    onMq();
    mq.addEventListener('change', onMq);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    if (root.current) io.observe(root.current);
    return () => {
      mo.disconnect();
      io.disconnect();
      mq.removeEventListener('change', onMq);
    };
  }, []);

  const src = `/redesign/media/smoke-${theme}${phone ? '-phone' : ''}.mp4`;

  useEffect(() => {
    const v = ref.current;
    if (!v || still) return;
    if (!visible) {
      v.pause();
      return;
    }
    setFailed(false);
    // Autoplay can be refused (iOS Low Power Mode): the poster stays. An abort
    // only means the source changed under us, which is not a refusal.
    v.play().catch((err: unknown) => {
      if ((err as { name?: string } | null)?.name !== 'AbortError') setFailed(true);
    });
  }, [src, still, visible]);

  const mirror = flip ? { transform: 'scaleX(-1)' } : undefined;

  return (
    <div ref={root} className="hx__bg" aria-hidden="true">
      <div className="hx__poster" style={mirror} />
      {!still && !failed && (
        <video
          ref={ref}
          className="hx__video"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          style={mirror}
          onError={() => setFailed(true)}
        />
      )}
      <div className="hx__scrim" />
    </div>
  );
}
