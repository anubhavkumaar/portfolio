import type { Metadata } from 'next';
import { StreamStage } from '@/components/stream/StreamStage';

export const metadata: Metadata = {
  title: 'Lower third, Anubhav Kumar',
  description: 'A 1920 by 200 OBS browser source that cycles every profile.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <StreamStage lower />;
}
