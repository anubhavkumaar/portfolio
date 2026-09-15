import { Hero } from './Hero';
import { Spreads } from './Spreads';
import { SideProjects } from './SideProjects';
import { Skills } from './Skills';
import { About } from './About';
import { Connect } from './Connect';

/** The whole site is one page; the section routes render it and jump. */
export function Home() {
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
