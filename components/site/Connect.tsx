'use client';

import { useState } from 'react';
import { Check, Copy, Mail } from 'lucide-react';
import { profile } from '@/content/profile';
import type { ProfileId } from '@/content/profiles';
import { ProfileRegister } from './ProfileRegister';
import { Reveal } from './Reveal';
import { scrollToId } from './SmoothScroll';

/**
 * Left out of the portfolio's Connect section at his request (2026-11-05).
 * They stay in content/profiles.ts, so /live/, stream mode and the lower third
 * still show them; this page is for the recruiter.
 */
const HIDDEN: readonly ProfileId[] = ['kick', 'youtube', 'twitch', 'discord'];

/**
 * The last screen, for a recruiter who scrolled here with a role in mind.
 * Streaming viewers have /live/.
 *
 * Two layouts of the same content, chosen with `variant`:
 *
 *   address  The email stays at the largest scale on the screen, as it always
 *            has been. The two registers sit side by side under it, Social
 *            wide, Work narrow.
 *   ledger   The page splits. Heading, email and actions hold the left
 *            column; the profiles run down the right as one ledger.
 *
 * Both read the profiles from content/profiles.ts, minus HIDDEN. No streaming
 * platform is listed here, so no live state is fetched.
 */
export function Connect({ variant = 'address' }: { variant?: 'address' | 'ledger' }) {
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
    <section className={`connect connect--${variant}`} id="connect">
      <div className="wrap connect__inner">
        <div className="connect__lead">
          <div className="section__head connect__head">
            <Reveal>
              <h2 className="t-display">Get in touch.</h2>
            </Reveal>
            <p className="t-lead muted">
              Email is the fastest route for a role, a contract or a question. My other profiles
              are below.
            </p>
          </div>

          <div className="connect__address">
            <a className="connect__email" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <div className="connect__actions">
              <a className="btn btn--primary" href={`mailto:${profile.email}`}>
                <Mail size={15} className="btn__icon" aria-hidden="true" />
                <span>Email me</span>
              </a>
              <button type="button" className="btn btn--ghost" onClick={copy} aria-live="polite">
                {copied ? <Check size={15} /> : <Copy size={15} />}
                <span>{copied ? 'Copied' : 'Copy address'}</span>
              </button>
            </div>
          </div>
        </div>

        <ProfileRegister exclude={HIDDEN} className="connect__groups" />
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
