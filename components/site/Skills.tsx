import { skills, skillsAlso, skillsNote } from '@/content/skills';
import { Reveal } from './Reveal';
import { Stagger } from './Stagger';

/**
 * One ruled register: a group per row, the tools as chips, and a line naming
 * where each group did its work. Static markup, nothing to hydrate.
 */
export function Skills() {
  return (
    <section className="section section--tight" id="skills">
      <div className="wrap">
        <div className="section__head">
          <Reveal>
            <h2 className="t-display">What I work with.</h2>
          </Reveal>
          <p className="t-lead muted">{skillsNote}</p>
        </div>

        <Stagger>
        <dl className="skills">
          {skills.map((g) => (
            <div key={g.name} className="skill">
              <dt>
                <span className="t-title skill__name">{g.name}</span>
                <span className="t-small skill__where">{g.where}</span>
              </dt>
              <dd>
                <ul className="skill__items" aria-label={`${g.name} tools`}>
                  {g.items.map((item) => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
        </Stagger>
        <p className="t-small skills__also">{skillsAlso}</p>
      </div>
    </section>
  );
}
