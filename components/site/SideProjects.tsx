import Image from 'next/image';
import { projects, projectsNote } from '@/content/projects';
import { Reveal } from './Reveal';

/**
 * Rows on the left, a fixed preview panel on the right: the hovered
 * project's screenshot with its name as a caption, sticky as the list
 * scrolls. No pointer tracking, so it costs nothing on touch, where the
 * shot instead sits inline under each row.
 */
export function SideProjects() {
  return (
    <section className="section section--tight" id="side">
      <div className="wrap">
        <div className="section__head">
          <Reveal>
            <h2 className="t-display">Live on the side.</h2>
          </Reveal>
          <p className="t-lead muted">{projectsNote}</p>
        </div>

        <div className="side">
          <ul className="plist" aria-label="Side projects">
            {projects.map((p) => (
              <li key={p.name} className="prow-li">
                <a className="prow" href={p.href} target="_blank" rel="noreferrer noopener">
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

          <figure className="spreview" aria-hidden="true">
            <span className="spreview__frame">
              {projects.map((p, i) => (
                <Image
                  key={p.name}
                  src={p.preview}
                  alt=""
                  width={1280}
                  height={800}
                  loading="lazy"
                  sizes="32vw"
                  className={`spreview__img spreview__img--${i}`}
                />
              ))}
            </span>
            {projects.map((p, i) => (
              <figcaption key={p.name} className={`t-body spreview__title spreview__title--${i}`}>
                {p.name}
              </figcaption>
            ))}
          </figure>
        </div>
      </div>
    </section>
  );
}
