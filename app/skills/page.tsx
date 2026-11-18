import type { Metadata } from 'next';
import { Home } from '@/components/site/Home';
import { JumpTo } from '@/components/site/JumpTo';

export const metadata: Metadata = {
  title: 'Anubhav Kumar',
  description: 'GenAI developer at Deloitte. Agents and retrieval underneath, services in between, and the chat people actually use.',
};

/** The old /skills/ address still works: Skills folded into About in the redesign. */
export default function Page() {
  return (
    <>
      <Home />
      <JumpTo id="about" />
    </>
  );
}
