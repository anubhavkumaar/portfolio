import type { Metadata } from 'next';
import { Home } from '@/components/site/Home';
import { JumpTo } from '@/components/site/JumpTo';

export const metadata: Metadata = { title: 'Work, Anubhav Kumar' };

export default function Page() {
  return (
    <>
      <Home />
      <JumpTo id="work" />
    </>
  );
}
