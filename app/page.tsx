import { Hero } from '@/components/site/Hero';
import { Spreads } from '@/components/site/Spreads';
import { SideProjects } from '@/components/site/SideProjects';
import { Skills } from '@/components/site/Skills';
import { About } from '@/components/site/About';
import { Connect } from '@/components/site/Connect';

export default function Home() {
  return (
    <>
      <Hero />
      <Spreads />
      <SideProjects />
      <Skills />
      <About />
      <Connect />
    </>
  );
}
