import type { Metadata } from 'next';
import { Home } from '@/components/site/Home';
import { JumpTo } from '@/components/site/JumpTo';

export const metadata: Metadata = {
  title: 'Anubhav Kumar',
  description: 'Hiring, a project, or a question about something I built. Email or LinkedIn gets the fastest reply.',
};

export default function Page() {
  return (
    <>
      <Home />
      <JumpTo id="connect" />
    </>
  );
}
