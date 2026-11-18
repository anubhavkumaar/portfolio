import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudy } from '@/components/site/CaseStudy';
import { ORDER, PROJECTS, type ProjectId } from '@/content/portfolio';


// Static export: every case study is prerendered at build time.
export async function generateStaticParams() {
  return ORDER.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = PROJECTS[params.slug as ProjectId];
  if (!p) return {};
  return {
    title: 'Anubhav Kumar',
    description: p.lede,
    openGraph: {
      title: p.title,
      description: p.lede,
      type: 'article',
      images: [{ url: `/og/${params.slug}.jpg`, width: 1200, height: 630, alt: p.title }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  if (!(params.slug in PROJECTS)) notFound();
  return <CaseStudy id={params.slug as ProjectId} />;
}
