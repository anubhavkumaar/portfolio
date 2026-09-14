import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Manrope, Azeret_Mono } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/site/Nav';
import { SmoothScroll } from '@/components/site/SmoothScroll';

// Self-hosted through next/font: preloaded, subset, no render-blocking CSS
// import. Bricolage carries the optical-size axis so display and text sizes
// get the cut drawn for them.
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-display',
});

const text = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-text',
});

const mono = Azeret_Mono({
  subsets: ['latin'],
  weight: '500',
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Anubhav Kumar, Full Stack Developer and GenAI Engineer',
  description:
    'I build production GenAI platforms at Deloitte: retrieval, agents, and the streaming backends under them. Three years, Hyderabad.',
  metadataBase: new URL('https://anubhavkumaar.in'),
  openGraph: {
    title: 'Anubhav Kumar',
    description: 'Full Stack Developer and GenAI Engineer. Retrieval, agents, platform, security.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0c10' },
    { media: '(prefers-color-scheme: light)', color: '#f4f6fa' },
  ],
};

// Runs before paint so the theme never flashes.
const themeInit = `
(function(){try{
var s=localStorage.getItem('theme');
var l=window.matchMedia('(prefers-color-scheme: light)').matches;
document.documentElement.setAttribute('data-theme', s || (l?'light':'dark'));
}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${display.variable} ${text.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <Nav />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
