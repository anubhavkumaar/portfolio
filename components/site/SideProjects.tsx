'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { projects, projectsNote } from '@/content/projects';
import { Reveal } from './Reveal';

// three.js and react-three-fiber load only once this section is on screen,
// and never under reduced motion or on touch, where the JS buys nothing.
const SideCanvas = dynamic(() => import('./SideCanvas').then((m) => m.SideCanvas), { ssr: false });

/**
 * Rows on the left; behind and to the right, the four screenshots drift as
 * ghostly 3D panels and resolve into view on hover, the way the site showed
 * them before this week's rebuild.
 */
export function SideProjects() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [canvasOn, setCanvasOn] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCanvasOn(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section section--tight side-section" id="side">
      {canvasOn && (
        <div className="side-canvas-host" aria-hidden="true">
          <SideCanvas hoveredIdx={hovered} previews={projects.map((p) => p.preview)} />
        </div>
      )}

      <div className="wrap">
        <div className="section__head">
          <Reveal>
            <h2 className="t-display">Live on the side.</h2>
          </Reveal>
          <p className="t-lead muted">{projectsNote}</p>
        </div>

        <ul className="plist" aria-label="Side projects" onMouseLeave={() => setHovered(null)}>
          {projects.map((p, i) => (
            <li key={p.name}>
              <a
                className="prow"
                href={p.href}
                target="_blank"
                rel="noreferrer noopener"
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
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
    </section>
  );
}
