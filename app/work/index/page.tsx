import type { Metadata } from 'next';
import { WorkIndex } from '@/components/site/WorkIndex';

export const metadata: Metadata = {
  title: 'Index, Anubhav Kumar',
  description: 'Every project, grouped by what it does.',
};

export default function Page() {
  return <WorkIndex />;
}
