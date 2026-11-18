import type { Metadata } from 'next';
import { Home } from '@/components/site/Home';
import { JumpTo } from '@/components/site/JumpTo';

export const metadata: Metadata = {
  title: 'Anubhav Kumar',
  description: 'Twenty projects in seven groups: agents, retrieval, backend, frontend, quality and delivery, automation and side builds.',
};

export default function Page() {
  return (
    <>
      <Home />
      <JumpTo id="work" />
    </>
  );
}
