import Image from 'next/image';
import { about, facts, education, awards } from '@/content/profile';
import { Reveal } from './Reveal';

export function About() {
  return (
    <section className="section" id="about">
      <div className="wrap about">
        <figure className="about__portrait">
          <Image
            src="/about.jpg"
            alt="Anubhav Kumar at his desk"
            width={1024}
            height={1024}
            sizes="(max-width: 900px) 92vw, 36vw"
          />
        </figure>

        <div>
          <Reveal>
            <h2 className="t-title about__lead">{about.heading}</h2>
          </Reveal>
          <p className="t-lead" style={{ marginTop: '1rem', maxWidth: '46ch' }}>
            {about.lead}
          </p>

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
                <dt className="fact__value tnum">{f.value}</dt>
                <dd className="fact__label t-small">{f.label}</dd>
              </div>
            ))}
          </dl>

          <ul className="listing" aria-label="Education and awards">
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
      </div>
    </section>
  );
}
