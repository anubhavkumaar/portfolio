'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { projects, projectsNote } from '@/content/projects';
import { Reveal } from './Reveal';

/**
 * Rows, with the screenshot appearing under the cursor when a row is hovered.
 * The preview lags the pointer on a lerp and crossfades between images, so
 * moving down the list feels like flipping plates rather than swapping
 * thumbnails. Touch devices get the shot inline under each row instead.
 */
export function SideProjects() {
  const [active, setActive] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = preview.current;
    if (!el) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let seeded = false;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      // Beside the pointer, never under it, so the row stays readable. Past
      // 60% of the viewport it flips to the left so it never leaves the screen.
      const w = el.offsetWidth || 320;
      const right = e.clientX < window.innerWidth * 0.6;
      tx = right ? e.clientX + 36 + w / 2 : e.clientX - 36 - w / 2;
      ty = e.clientY;
      if (!seeded) {
        x = tx;
        y = ty;
        seeded = true;
      }
    };
    const loop = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      // Tilt slightly with horizontal velocity so it reads as an object.
      const tilt = Math.max(-6, Math.min(6, (tx - x) * 0.04));
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${tilt.toFixed(2)}deg)`;
      frame = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    frame = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="section section--tight" id="side">
      <div className="wrap">
        <div className="section__head">
          <Reveal>
            <h2 className="t-display">Live on the side.</h2>
          </Reveal>
          <p className="t-lead muted">{projectsNote}</p>
        </div>

        <ul className="plist" aria-label="Side projects" onMouseLeave={() => setActive(null)}>
          {projects.map((p, i) => (
            <li key={p.name}>
              <a
                className="prow"
                href={p.href}
                target="_blank"
                rel="noreferrer noopener"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              >
                <span>
                  <span className="t-title prow__name">{p.name}</span>
                  <span className="t-small prow__blurb">{p.blurb}</span>
                  <span className="prow__shot">
                    <Image src={p.preview} alt={`${p.name} screenshot`} width={1280} height={800} loading="lazy" sizes="92vw" />
                  </span>
                </span>
                <span className="prow__meta">
                  <span className="t-meta">{p.year}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div ref={preview} className={`ppreview${active !== null ? ' is-on' : ''}`} aria-hidden="true">
        {projects.map((p, i) => (
          <Image
            key={p.name}
            src={p.preview}
            alt=""
            width={1280}
            height={800}
            loading="lazy"
            sizes="26vw"
            className={active === i ? 'is-current' : undefined}
          />
        ))}
      </div>
    </section>
  );
}
