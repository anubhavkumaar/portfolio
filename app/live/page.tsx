import type { Metadata } from 'next';
import { LivePage } from '@/components/live/LivePage';

export const metadata: Metadata = {
  title: 'Anubhav Kumar, live and everywhere else',
  description: 'Watch Anubhav Kumar live on Kick, YouTube and Twitch, and follow him on every other platform.',
  openGraph: {
    title: 'Anubhav Kumar, live and everywhere else',
    description: 'Kick, YouTube, Twitch, Discord, Instagram, X, Steam, GitHub and LinkedIn in one place.',
    type: 'website',
    url: 'https://anubhavkumaar.in/live/',
    images: [{ url: '/og/live.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

/* Runs before first paint, so nothing is hidden for an intro that will not play.
   - The intro plays once per visit: sessionStorage remembers it, ?intro=1 replays it,
     and reduced motion never gets it. The rest of the page is complete without it.
   - The live-status request starts here, before hydration, so the answer is usually
     back by the time React needs it. */
const boot = `
(function(){
  var d=document.documentElement,q=location.search;
  // /live/?mode=stream is the OBS page. The server redirects it too; this covers a host that does not.
  if(/[?&]mode=stream(&|$)/.test(q)){location.replace('/stream/'+q);return}
  try{
    var r=matchMedia('(prefers-reduced-motion: reduce)').matches;
    var seen=sessionStorage.getItem('ak-live-seen');
    if(!r&&(!seen||/[?&]intro=1/.test(q)))d.classList.add('live-intro');
    sessionStorage.setItem('ak-live-seen','1');
  }catch(e){}
  try{
    if(!/[?&]live=/.test(q))window.__akLive=fetch('/live-status.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).catch(function(){return null});
  }catch(e){}
})();
`;

export default function Page() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: boot }} />
      <LivePage />
    </>
  );
}
