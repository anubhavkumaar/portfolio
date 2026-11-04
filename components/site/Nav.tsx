'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { scrollToId } from './SmoothScroll';

const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'about', label: 'About' },
  { id: 'connect', label: 'Connect', keep: true },
];

/** The browser bar takes the page's ground: the layout ships the light one, this swaps it. */
function syncThemeColor(theme: 'dark' | 'light') {
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', theme === 'dark' ? '#0a0c10' : '#f4f6fa'));
}

export function Nav() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState<string>('');

  useEffect(() => {
    const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(t);
    syncThemeColor(t);

    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Which section owns the middle of the viewport. Nothing is current while
    // the landing holds it, so the state clears when no section intersects.
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const inBand = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inBand.add(e.target.id);
          else inBand.delete(e.target.id);
        }
        setCurrent(LINKS.find((l) => inBand.has(l.id))?.id ?? '');
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));

    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  // The address follows the section, the way the previous site's did:
  // /work/, /skills/, /about/, /connect/, and /home/ for the landing.
  // Replaced, not pushed, so the back button still leaves in one step.
  useEffect(() => {
    let path: string | null = null;
    if (current) path = `/${current}/`;
    else if (window.scrollY < window.innerHeight * 0.5) path = '/home/';
    if (path && window.location.pathname !== path) {
      // Keep the query string: campaign tags and the ?live= preview survive the scroll.
      history.replaceState(null, '', path + window.location.search);
    }
  }, [current]);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode: the choice does not persist and that is fine */
    }
    setTheme(next);
    syncThemeColor(next);
  };

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="wrap nav__inner">
        <a
          href="#top"
          className="nav__mark"
          onClick={(e) => {
            e.preventDefault();
            scrollToId('top');
          }}
          aria-label="Anubhav Kumar, top of page"
        >
          <img src={theme === 'light' ? '/logo/black.png' : '/logo/white.png'} alt="" width={26} height={26} />
          <span>Anubhav Kumar</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`nav__link${l.keep ? ' nav__link--keep' : ''}`}
              aria-current={current === l.id ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(l.id);
              }}
            >
              {l.label}
            </a>
          ))}
          <button
            type="button"
            className="nav__theme"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
