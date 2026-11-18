'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PROJECTS } from '@/content/portfolio';
import { readFrom } from '@/content/work-layout';
import { scrollToId } from './SmoothScroll';

type Active = 'home' | 'work' | 'about' | 'connect' | '';

/** The sections the page tracks. Nothing is current while the landing holds the middle of the view. */
const SECTION_IDS = ['work', 'about', 'connect'];

const ROUTE: Record<string, string> = { top: '/', work: '/work/', about: '/about/', connect: '/connect/' };

const LINKS: { key: Exclude<Active, ''>; id: string; label: string }[] = [
  { key: 'home', id: 'top', label: 'Home' },
  { key: 'work', id: 'work', label: 'Work' },
  { key: 'about', id: 'about', label: 'About' },
];

/** Phone sheet rows. Index is its own route, so it has no section id and navigates. */
const SHEET: { key: string; id: string; label: string; note: string; href: string; active: Active }[] = [
  { key: 'home', id: 'top', label: 'Home', note: '01', href: '/', active: 'home' },
  { key: 'work', id: 'work', label: 'Work', note: '02', href: '/work/', active: 'work' },
  { key: 'index', id: 'index-route', label: 'Index', note: '03', href: '/work/index/', active: '' },
  { key: 'about', id: 'about', label: 'About', note: '04', href: '/about/', active: 'about' },
  { key: 'connect', id: 'connect', label: "Let's talk", note: '05', href: '/connect/', active: 'connect' },
];

const NAME: Record<Exclude<Active, ''>, string> = { home: 'Home', work: 'Work', about: 'About', connect: 'Connect' };

/** The browser bar takes the page's ground: the layout ships the light one, this swaps it. */
function syncThemeColor(theme: 'dark' | 'light') {
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', theme === 'dark' ? '#0a0c10' : '#f4f6fa'));
}

/** Which top-level route a pathname belongs to, for pages that are not the one-page site. */
function routeActive(path: string): Active {
  if (path === '/' || path === '/home') return 'home';
  if (path === '/work' || path.startsWith('/work/')) return 'work';
  if (path === '/about') return 'about';
  if (path === '/connect') return 'connect';
  return '';
}

/** Breadcrumb for work sub-pages: parent link and the current page's name. */
function subCrumb(path: string): { parent: string; here: string; isCase: boolean } | null {
  const m = /^\/work\/([^/]+)$/.exec(path);
  if (!m) return null;
  if (m[1] === 'index') return { parent: 'Work', here: 'Index', isCase: false };
  const p = (PROJECTS as Record<string, { title: string }>)[m[1]];
  return p ? { parent: 'Work', here: p.title, isCase: true } : null;
}

const SunIcon = ({ strokeWidth = 2.4 }: { strokeWidth?: number }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
  </svg>
);

/** Both marks ship in the markup; CSS picks one from data-theme, so there is no flash. */
function Logo({ height = 30 }: { height?: number }) {
  return (
    <>
      <img className="dock__logo-light" src="/redesign/brand/logo-on-light.png" alt="" height={height} />
      <img className="dock__logo-dark" src="/redesign/brand/logo-on-dark.png" alt="" height={height} />
    </>
  );
}

export function Nav() {
  const pathname = usePathname() || '/';
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

  const [dark, setDark] = useState(false);
  const [current, setCurrent] = useState<string>('');
  // True when this page carries the sections (the one-page site and its section routes).
  const [hasSections, setHasSections] = useState(false);
  const [open, setOpen] = useState(false);
  // A case study returns to where it was opened from: the drawer, freestyle or the index.
  const [from, setFrom] = useState({ href: '/work/', label: 'Work' });
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstItem = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setDark(t === 'dark');
    syncThemeColor(t);
  }, []);

  useEffect(() => {
    setHasSections(!!document.getElementById('work'));
    setOpen(false);
    setFrom(readFrom());
  }, [pathname]);

  // Which section owns the middle of the viewport. Nothing is current while
  // the landing holds it, so the state clears when no section intersects.
  useEffect(() => {
    if (!hasSections) {
      setCurrent('');
      return;
    }
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const inBand = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inBand.add(e.target.id);
          else inBand.delete(e.target.id);
        }
        setCurrent(SECTION_IDS.find((id) => inBand.has(id)) ?? '');
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [hasSections]);

  // The address follows the section too, but ConnectedScroll owns that (it
  // replaces the URL with history.replaceState as each section takes the view).
  const active: Active = hasSections ? (current === '' ? 'home' : (current as Active)) : routeActive(path);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) menuBtn.current?.focus();
  }, []);

  // Phone sheet: Escape closes and hands focus back to Menu; the page behind
  // does not scroll; the sheet gives way if the window grows to desktop width.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(true);
    };
    const mq = window.matchMedia('(min-width: 768px)');
    const onMq = () => mq.matches && close();
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstItem.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode: the choice does not persist and that is fine */
    }
    setDark(next === 'dark');
    syncThemeColor(next);
  };

  /** On the one-page site a link scrolls to its section; elsewhere it navigates to the route. */
  const go = (e: React.MouseEvent, id: string, after?: () => void) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (document.getElementById(id)) {
      e.preventDefault();
      scrollToId(id);
    }
    after?.();
  };

  const sub = subCrumb(path);
  const hereText = sub ? sub.here : active ? NAME[active] : '';

  return (
    <header className="dock">
      {/* Desktop */}
      <div className="dock__d">
        <div className="dock__veil" aria-hidden="true" />
        <div className="dock__row">
          <div className="dock__pill dock__crumb">
            <Link href="/" className="dock__logo" aria-label="Anubhav Kumar, home" onClick={(e) => go(e, 'top')}>
              <Logo />
            </Link>
            <span className="dock__sep" aria-hidden="true" />
            <p className="dock__path">
              <Link href="/" onClick={(e) => go(e, 'top')}>
                anubhavkumaar.in
              </Link>
              <span className="dock__path-sep">/</span>
              {sub && (
                <>
                  <Link href={sub.isCase ? from.href : '/work/'} onClick={(e) => go(e, 'work')}>
                    {sub.isCase ? from.label : sub.parent}
                  </Link>
                  <span className="dock__path-sep">/</span>
                </>
              )}
              <span className="dock__here">{hereText}</span>
            </p>
          </div>

          <nav className="dock__pill dock__links" aria-label="Main">
            {LINKS.map((l) => (
              <Link
                key={l.key}
                href={ROUTE[l.id]}
                className="dock__link"
                aria-current={active === l.key ? 'page' : undefined}
                onClick={(e) => go(e, l.id)}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/connect/" className="dock__talk" aria-current={active === 'connect' ? 'page' : undefined} onClick={(e) => go(e, 'connect')}>
              <span className="dock__live" aria-hidden="true" />
              Let&apos;s talk
              <span aria-hidden="true">→</span>
            </Link>
          </nav>

          <button type="button" role="switch" aria-checked={dark} aria-label="Dark theme" className="dock__switch" onClick={toggleTheme}>
            <span className="dock__ico dock__ico--sun" aria-hidden="true">
              <SunIcon />
            </span>
            <span className="dock__ico dock__ico--moon" aria-hidden="true">
              <MoonIcon />
            </span>
            <span className="dock__knob" aria-hidden="true">
              <span className="dock__knob-sun">
                <SunIcon strokeWidth={2.6} />
              </span>
              <span className="dock__knob-moon">
                <MoonIcon />
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Phone */}
      <div className="dock__m">
        <div className="mdock__bar">
          <Link href="/" className="mdock__logo dock__logo" aria-label="Anubhav Kumar, home" onClick={(e) => go(e, 'top', () => close())}>
            <Logo />
          </Link>
          <span className="mdock__label">ANUBHAVKUMAAR.IN</span>
          <button
            ref={menuBtn}
            type="button"
            className="mdock__btn"
            aria-expanded={open}
            aria-controls="ak-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? (
              <>
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
                Close
              </>
            ) : (
              <>
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M4 8h16M4 16h10" />
                </svg>
                Menu
              </>
            )}
          </button>
        </div>

        {open && (
          <>
            <div className="mdock__shade" aria-hidden="true" onClick={() => close()} />
            <nav id="ak-menu" className="mdock__sheet" aria-label="Main">
              <span className="mdock__grip" aria-hidden="true" />
              {SHEET.map((l, i) => {
                const on = l.active !== '' && active === l.active;
                return (
                  <Link
                    key={l.key}
                    ref={i === 0 ? firstItem : undefined}
                    href={l.href}
                    className="mdock__item"
                    aria-current={on ? 'page' : undefined}
                    style={{ animationDelay: `${(0.06 + i * 0.05).toFixed(2)}s` }}
                    onClick={(e) => go(e, l.id, () => close())}
                  >
                    <span className="mdock__name">{l.label}</span>
                    <span className="mdock__note">{on ? 'YOU ARE HERE' : l.note}</span>
                  </Link>
                );
              })}
              <div className="mdock__actions">
                <a className="mdock__action mdock__action--solid" href="/resume.pdf" target="_blank" rel="noopener" download="Anubhav_Kumar_Resume.pdf">
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4v11" />
                    <path d="M7 10l5 5 5-5" />
                    <path d="M5 20h14" />
                  </svg>
                  Resume
                </a>
                <button type="button" className="mdock__action mdock__action--ghost" aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`} onClick={toggleTheme}>
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 13.5A8 8 0 1 1 10.5 4a6.2 6.2 0 0 0 9.5 9.5z" />
                  </svg>
                  {dark ? 'Light mode' : 'Dark mode'}
                </button>
              </div>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}
