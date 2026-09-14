'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { profile } from '@/content/profile';
import { BrandIcon, type Brand } from './BrandIcon';
import { Reveal } from './Reveal';
import { scrollToId } from './SmoothScroll';

const SOCIALS: { id: Brand; name: string; handle: string; href: string }[] = [
  { id: 'github', name: 'GitHub', handle: 'anubhavkumaar', href: 'https://github.com/anubhavkumaar' },
  { id: 'linkedin', name: 'LinkedIn', handle: 'in/anubhavkumaar', href: 'https://www.linkedin.com/in/anubhavkumaar/' },
  { id: 'x', name: 'X', handle: '@theanubhavkumar', href: 'https://twitter.com/theanubhavkumar/' },
  { id: 'instagram', name: 'Instagram', handle: '@theanubhavkumar', href: 'https://www.instagram.com/theanubhavkumar/' },
  { id: 'youtube', name: 'YouTube', handle: '@anubhavkumaar', href: 'https://youtube.com/@anubhavkumaar' },
  { id: 'twitch', name: 'Twitch', handle: 'anubhavkumaar', href: 'https://twitch.com/anubhavkumaar' },
  { id: 'discord', name: 'Discord', handle: 'anubhavkumaar.in/discord', href: 'https://anubhavkumaar.in/discord' },
  { id: 'steam', name: 'Steam', handle: 'anubhavkumar', href: 'https://steamcommunity.com/id/anubhavkumar/' },
];

/**
 * The last screen. Full viewport on desktop: the heading at the top, the email
 * address at the largest scale on the screen because it is the action, the
 * eight profiles as one ruled register, and the footer on the bottom edge.
 */
export function Connect() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section className="connect" id="connect">
      <div className="wrap section__head connect__head">
        <Reveal>
          <h2 className="t-display">Get in touch.</h2>
        </Reveal>
        <p className="t-lead muted">
          For a role, a contract, or a question about any of the work above. Email is the fastest
          route.
        </p>
      </div>

      <div className="wrap connect__main">
        <a className="connect__email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <div className="connect__actions">
          <a className="btn btn--primary" href={`mailto:${profile.email}`}>
            Email me
          </a>
          <button type="button" className="btn btn--ghost" onClick={copy} aria-live="polite">
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied' : 'Copy address'}
          </button>
        </div>

        <ul className="socials" aria-label="Profiles">
          {SOCIALS.map((s) => (
            <li key={s.id}>
              <a className="social" href={s.href} target="_blank" rel="noreferrer noopener">
                <span className="social__icon" aria-hidden="true">
                  <BrandIcon name={s.id} />
                </span>
                <span className="social__text">
                  <span className="social__name">{s.name}</span>
                  <span className="social__handle t-small">{s.handle}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="footer">
        <div className="wrap footer__inner">
          <span className="t-small">
            {profile.name}. {new Date().getFullYear()}.
          </span>
          <a
            className="t-small footer__top"
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('top');
            }}
          >
            Back to top
          </a>
        </div>
      </footer>
    </section>
  );
}
