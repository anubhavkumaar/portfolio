import type { Metadata } from 'next';
import { LIVE_URL } from '@/content/profiles';
import { StreamStage } from '@/components/stream/StreamStage';
import { QrCode } from '@/components/stream/QrCode';

export const metadata: Metadata = {
  title: 'Stream mode, Anubhav Kumar',
  description: 'The OBS browser source for Anubhav Kumar. Add ?scene=starting, brb or ending, or open /stream/lower/ for the lower third.',
  robots: { index: false, follow: false },
};

// The QR code is drawn here, on the server, at build time. The browser only receives the SVG.
export default function Page() {
  return <StreamStage qr={<QrCode text={LIVE_URL} label="QR code for anubhavkumaar.in/live" />} />;
}
