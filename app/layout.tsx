import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Manrope, Azeret_Mono } from 'next/font/google';
import './globals.css';
import { SiteChrome } from '@/components/site/SiteChrome';

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
    'Building production-grade GenAI platforms at Deloitte: LLMs, RAG, AWS Bedrock, from backend APIs to frontend dashboards.',
  metadataBase: new URL('https://anubhavkumaar.in'),
  openGraph: {
    title: 'Anubhav Kumar',
    description: 'Full Stack Developer and GenAI Engineer. Retrieval, agents, platform, security.',
    type: 'website',
  },
};

// The site opens light. The browser bar follows: one colour here, and the theme
// toggle (Nav) swaps it when a visitor chooses dark.
export const viewport: Viewport = {
  themeColor: '#f4f6fa',
};

// Runs before paint so the theme never flashes.
const themeInit = `
(function(){try{
var d=document.documentElement,p=location.pathname;
if(/^\\/stream(\\/|$)/.test(p)){
  d.classList.add('is-stream');
  d.setAttribute('data-theme','dark');
  if(/^\\/stream\\/lower/.test(p)||/[?&]bg=transparent/.test(location.search))d.classList.add('is-transparent');
  return;
}
// Light is the default. A saved choice wins; the system preference does not.
var s=localStorage.getItem('theme');
d.setAttribute('data-theme', s==='dark'?'dark':'light');
}catch(e){document.documentElement.setAttribute('data-theme','light');}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
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
        <SiteChrome />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
