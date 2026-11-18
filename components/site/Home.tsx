import { Hero } from './Hero';
import { WorkDrawer } from './WorkDrawer';
import { About } from './About';
import { Connect } from './Connect';
import { ConnectedScroll, Section } from './ConnectedScroll';

/**
 * The whole site is one connected scroll: Home, Work, About, Connect. The
 * section routes (/work, /about, /connect) render it and jump to their section.
 */
export function Home() {
  return (
    <ConnectedScroll>
      <Section index={0} exit>
        <Hero />
      </Section>
      <Section index={1} exit enter>
        <WorkDrawer />
      </Section>
      <Section index={2} exit enter>
        <About />
      </Section>
      <Section index={3} enter>
        <Connect />
      </Section>
    </ConnectedScroll>
  );
}
