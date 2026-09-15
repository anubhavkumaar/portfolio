import Image from 'next/image';
import { about, facts, education, awards } from '@/content/profile';
import { Reveal } from './Reveal';
import { Stagger } from './Stagger';
import { CountUp } from './CountUp';

export function About() {
  return (
    <section className="section" id="about">
      <div className="wrap about">
        {/* The wrapper is the sticky grid item; the figure inside develops in. */}
        <Stagger always className="about__portrait-wrap">
          <figure className="about__portrait">
            <Image
              src="/about.jpg"
              alt="Anubhav Kumar at his desk"
              width={1024}
              height={1024}
              sizes="(max-width: 900px) 92vw, 36vw"
            />
          </figure>
        </Stagger>

        <Stagger always>
          <div className="about__col">
            <div>
              <Reveal>
                <h2 className="t-display">{about.heading}</h2>
              </Reveal>
              <p className="t-lead" style={{ marginTop: '1rem', maxWidth: '46ch' }}>
                {about.lead}
              </p>
            </div>

            <div className="about__problems">
              <p className="t-small about__problems-label">{about.problemsLabel}</p>
              <ul className="about__list">
                {about.problems.map((p) => (
                  <li key={p} className="t-body">
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="about__body">
              {about.body.map((p) => (
                <p key={p.slice(0, 24)} className="t-body">
                  {p}
                </p>
              ))}
            </div>

            <dl className="facts" aria-label="Measured facts">
              {facts.map((f) => (
                <div key={f.label} className="fact">
                  <dt className="fact__value tnum">
                    <CountUp value={f.value} />
                  </dt>
                  <dd className="fact__label t-small">{f.label}</dd>
                </div>
              ))}
            </dl>

            <ul className="listing" aria-label="Education, awards and certifications">
              <li className="listing__row">
                <span>
                  <span className="t-body">{education.degree}</span>
                  <span className="t-small" style={{ display: 'block' }}>
                    {education.school}, {education.place}
                  </span>
                </span>
                <span className="t-meta">{education.years}</span>
              </li>
              {awards.map((a) => (
                <li key={`${a.title}-${a.year}`} className="listing__row">
                  <span>
                    <span className="t-body">{a.title}</span>
                    <span className="t-small" style={{ display: 'block' }}>
                      {a.issuer}
                    </span>
                  </span>
                  <span className="t-meta">{a.year}</span>
                </li>
              ))}
            </ul>
          </div>
        </Stagger>
      </div>
    </section>
  );
}
