'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Three.js canvas: loaded client-only (no SSR) — requires browser WebGL
const WorksCanvas3D = dynamic(() => import('./works-canvas'), { ssr: false });
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useScroll,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from 'framer-motion';
import {
  Github,
  Linkedin,
  Instagram,
  ExternalLink,
  Twitch,
  ArrowUpRight,
  Youtube,
  Sparkles,
  Bot,
  Cloud,
  Code2,
  Component,
  Database,
  Brain,
  Workflow,
  Server,
  Table2,
  Boxes,
  Plug,
  Award,
  Trophy,
  Sun,
  Moon,
} from 'lucide-react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const ACCENT = 'var(--accent)';
// Emil: expo ease-out for all reveals
const EASE_EXPO: [number, number, number, number] = [0.23, 1, 0.32, 1];
// Emil: spring config for mouse-tracking
const SPRING_CFG = { stiffness: 180, damping: 28 };

// ─── Theme ────────────────────────────────────────────────────────────────────
type Theme = 'dark' | 'light';

function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const stored = window.localStorage.getItem('theme');
    const initial: Theme = stored === 'light' ? 'light' : 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      window.localStorage.setItem('theme', next);
      return next;
    });
  };

  return { theme, toggle };
}

// ─── Data ─────────────────────────────────────────────────────────────────────
interface Project {
  number: string;
  name: string;
  year: string;
  stack: string;
  live?: string;
  repo?: string;
  preview: string;
  localPreview: string;
  desc: string;
  badge?: string;
}

const PROJECTS: Project[] = [
  {
    number: '01',
    name: 'PitStop',
    year: '2025',
    stack: 'React · Firebase',
    live: 'https://pitstop-services.web.app',
    repo: 'https://github.com/anubhavkumaar/pitstop',
    preview: 'https://opengraph.githubassets.com/1/anubhavkumaar/pitstop',
    localPreview: '/previews/pitstop.jpg',
    desc: 'Auto-services platform for GTA V roleplay — bookings, job logs, crew management.',
  },
  {
    number: '02',
    name: 'HEAT',
    year: '2025',
    stack: 'React · Firebase',
    live: 'https://sasp-heat.web.app',
    repo: 'https://github.com/anubhavkumaar/saspheat',
    preview: 'https://opengraph.githubassets.com/1/anubhavkumaar/saspheat',
    localPreview: '/previews/heat.jpg',
    desc: 'Highway Enforcement unit site: SOPs, officer roles, vehicle specs, pursuit protocols.',
  },
  {
    number: '03',
    name: 'SAPR',
    year: '2025',
    stack: 'React · Firebase',
    live: 'https://saspsapr.web.app',
    repo: 'https://github.com/anubhavkumaar/saspsapr',
    preview: 'https://opengraph.githubassets.com/1/anubhavkumaar/saspsapr',
    localPreview: '/previews/sapr.jpg',
    desc: 'San Andreas Police Roleplay platform: department hierarchy, SOPs, role access.',
  },
  {
    number: '04',
    name: 'Valo Tourney',
    year: '2024',
    stack: 'React · Firebase',
    live: 'https://soulcityvalo.web.app',
    repo: 'https://github.com/anubhavkumaar/SoulCity-Valo-Tourney',
    preview: 'https://opengraph.githubassets.com/1/anubhavkumaar/SoulCity-Valo-Tourney',
    localPreview: '/previews/soulcity.jpg',
    desc: 'Valorant tournament management: brackets, match tracking, registration.',
  },
  {
    number: '05',
    name: 'DeepChat',
    year: '2025',
    stack: 'Python · FastAPI · React · AWS Bedrock',
    preview: '',
    localPreview: '',
    badge: 'Deloitte',
    desc: 'DeepChat-powered enterprise chatbot for internal policy Q&A and knowledge retrieval, deployed across Deloitte business units.',
  },
  {
    number: '06',
    name: 'Agentic Assistant',
    year: '2025',
    stack: 'LangGraph · AWS Bedrock · FastAPI',
    preview: '',
    localPreview: '',
    badge: 'Deloitte',
    desc: 'Multi-step autonomous agent with tool-calling, memory, and dynamic workflow orchestration for enterprise task automation.',
  },
  {
    number: '07',
    name: 'RAG Platform',
    year: '2024',
    stack: 'RAG · PostgreSQL · AWS · FastAPI',
    preview: '',
    localPreview: '',
    badge: 'Deloitte',
    desc: 'Database-managed RAG system on AWS Bedrock — structured document ingestion, vector search, and policy retrieval reducing manual lookup time significantly.',
  },
];

const EXPERIENCE = [
  {
    period: 'Oct 2024 - Present',
    title: 'GenAI Developer',
    company: 'Deloitte',
    desc: 'Enterprise GenAI platforms using LLMs and RAG on AWS Bedrock. Python/FastAPI, React/Next.js, PostgreSQL.',
  },
  {
    period: 'Oct 2023 - Oct 2024',
    title: 'RPA QA & Data Analyst',
    company: 'Deloitte',
    desc: 'QA for enterprise automation workflows. SQL data validation, process automation.',
  },
  {
    period: 'Jul 2023 - Oct 2023',
    title: 'AI Academy Trainee',
    company: 'Deloitte',
    desc: 'Python, SQL, PowerBI, Hadoop, Hive, AWS. ML capstone with IIT Roorkee.',
  },
  {
    period: '2019 - 2023',
    title: 'BTech, Mechanical Engineering',
    company: 'KIIT University',
    desc: 'Lead Student Coordinator. Internships at Komatsu and Indian Oil Corporation.',
  },
];

const STACK = [
  'Python', 'FastAPI', 'React', 'Next.js', 'TypeScript', 'JavaScript',
  'AWS Bedrock', 'AWS Lambda', 'AWS S3', 'LLMs', 'RAG', 'LangChain', 'LangGraph',
  'PostgreSQL', 'Oracle SQL', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn',
  'TensorFlow', 'RPA', 'Hadoop', 'Hive', 'PowerBI', 'Docker', 'Git', 'REST APIs',
];

const CERTS = [
  { title: 'Applause Award', issuer: 'Deloitte — AI upskilling, delivery speed & defect resolution', year: 'May 2026', type: 'award' as const },
  { title: 'Impact Day', issuer: 'Deloitte', year: 'Nov 2024', type: 'award' as const },
  { title: 'Applause Award', issuer: 'Deloitte — built & supported two automation bots', year: 'Sep 2024', type: 'award' as const },
  { title: 'AI & Machine Learning', issuer: 'IIT Roorkee × Deloitte', year: '2023', type: 'cert' as const },
  { title: 'Data Engineering', issuer: 'Deloitte', year: '2023', type: 'cert' as const },
  { title: 'Machine Learning', issuer: 'Deloitte', year: '2023', type: 'cert' as const },
  { title: 'SolidWorks', issuer: 'Internshala', year: '2021', type: 'cert' as const },
];

const SKILL_CATEGORIES = ['All', 'AI & ML', 'Engineering', 'Data & Automation'] as const;

const SKILLS = [
  { name: 'Generative AI',       desc: 'Built enterprise-grade GenAI platforms focusing on scalable, performant AI solutions and workflow optimization.', icon: Sparkles, category: 'AI & ML' },
  { name: 'LLMs & RAG',          desc: 'Developed intelligent RAG systems on AWS, significantly reducing manual policy lookup times for enterprise portals.', icon: Bot, category: 'AI & ML' },
  { name: 'AWS Bedrock',         desc: 'Deployed and managed foundation models on AWS infrastructure to build robust, cloud-native AI workflows.', icon: Cloud, category: 'AI & ML' },
  { name: 'Machine Learning',    desc: 'Analyzed and optimized data pipelines for ML models, culminating in a capstone project with IIT Roorkee.', icon: Brain, category: 'AI & ML' },
  { name: 'Python & FastAPI',    desc: 'Designed scalable backend services, rapid data pipelines, and high-performance APIs for production environments.', icon: Code2, category: 'Engineering' },
  { name: 'React & Next.js',     desc: 'Created responsive frontend components and enterprise dashboards with strong focus on usability and accessibility.', icon: Component, category: 'Engineering' },
  { name: 'PostgreSQL & SQL',    desc: 'Wrote complex queries for data validation, ETL pipelines, and BI reporting to track automation outputs.', icon: Database, category: 'Engineering' },
  { name: 'Custom Integrations', desc: 'Developed tailored solutions bridging modern frontends, robust backends, and cross-platform APIs.', icon: Plug, category: 'Engineering' },
  { name: 'RPA & Automation',    desc: 'Supported QA and tested enterprise automation workflows, yielding significant operational time savings.', icon: Workflow, category: 'Data & Automation' },
  { name: 'Hadoop',              desc: 'Designed and maintained large enterprise data lakes for big data storage and distributed processing.', icon: Server, category: 'Data & Automation' },
  { name: 'Oracle SQL',          desc: 'Engineered complex analytical queries for corporate BI reporting and structured database management.', icon: Table2, category: 'Data & Automation' },
  { name: 'Hive',                desc: 'Leveraged Hive to efficiently structure, summarize, and query large-scale distributed datasets.', icon: Boxes, category: 'Data & Automation' },
];

// ─── Character mask reveal (lorisbukvic style) ────────────────────────────────
// Impeccable: typographic scale, no gradient text
// Emil: expo ease, proper stagger, never from scale(0)
function MaskText({
  text,
  tag: Tag = 'span',
  className = '',
  style,
  delay = 0,
  stagger = 0.03,
  once = true,
}: {
  text: string;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-5% 0px' });
  const reduced = useReducedMotion();

  return (
    // @ts-ignore — dynamic tag
    <Tag ref={ref} className={className} style={style} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            // Extra room below baseline so descenders aren't clipped
            paddingBottom: '0.12em',
            marginBottom: '-0.12em',
            verticalAlign: 'bottom',
          }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            // Emil: never from scale(0); use y translate
            initial={reduced ? { opacity: 0 } : { y: '112%' }}
            animate={isInView ? (reduced ? { opacity: 1 } : { y: 0 }) : {}}
            transition={{
              duration: reduced ? 0.18 : 0.6,
              ease: reduced ? 'linear' : EASE_EXPO,
              delay: delay + (char === ' ' ? 0 : i * stagger),
            }}
          >
            {char === ' ' ? ' ' : char}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

// ─── Scroll reveal ────────────────────────────────────────────────────────────
// Emil: expo ease, opacity+y only (never scale from 0)
function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-6% 0px' });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reduced ? 0.18 : 0.6, ease: EASE_EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
function TypeWriter({ phrases, className = '' }: { phrases: string[]; className?: string }) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<'typing' | 'hold' | 'erasing'>('typing');
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) { setDisplayed(phrases[0]); return; }
    const phrase = phrases[phraseIdx];
    let t: ReturnType<typeof setTimeout>;
    if (phase === 'typing') {
      if (displayed.length < phrase.length) {
        t = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 65);
      } else {
        t = setTimeout(() => setPhase('hold'), 1800);
      }
    } else if (phase === 'hold') {
      t = setTimeout(() => setPhase('erasing'), 400);
    } else {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed((d) => d.slice(0, -1)), 38);
      } else {
        setPhraseIdx((i) => (i + 1) % phrases.length);
        setPhase('typing');
      }
    }
    return () => clearTimeout(t);
  }, [phase, displayed, phraseIdx, phrases, reduced]);

  return (
    <span className={className}>
      {displayed}
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: 2,
          marginLeft: 3,
          backgroundColor: ACCENT,
          verticalAlign: 'text-bottom',
          height: '0.85em',
          animation: 'blink 1s step-end infinite',
        }}
      />
    </span>
  );
}

// ─── Orbit rings (hero monogram) ──────────────────────────────────────────────
function OrbitRings({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;

  return (
    <div className="relative flex items-center justify-center">
      {/* Static ring 1 */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 390, height: 390, border: '1px solid rgba(var(--ink-rgb),calc(0.055*var(--ink-boost)))' }}
      />
      {/* Static ring 2 */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 470, height: 470, border: '1px solid rgba(var(--accent-rgb),0.045)' }}
      />
      {/* Orbiting accent dot — ring 1 */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ width: 390, height: 390 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
      >
        <div
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: 0,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: ACCENT,
            opacity: 0.6,
            boxShadow: '0 0 10px rgba(var(--accent-rgb), 0.56)',
          }}
        />
      </motion.div>
      {/* Orbiting white dot — ring 2 (opposite direction) */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ width: 470, height: 470 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 38, ease: 'linear', repeat: Infinity }}
      >
        <div
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            top: 0,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(var(--ink-rgb),calc(0.45*var(--ink-boost)))',
            boxShadow: '0 0 6px rgba(var(--ink-rgb),calc(0.3*var(--ink-boost)))',
          }}
        />
      </motion.div>
      {/* Monogram */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// ─── 3D tilt (AK monogram) ────────────────────────────────────────────────────
// Emil: spring mouse-tracking, never animates from scale(0)
function Tilt({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), SPRING_CFG);
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), SPRING_CFG);
  const sc = useSpring(1, SPRING_CFG);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX: rx,
        rotateY: ry,
        scale: sc,
        transformStyle: 'preserve-3d',
        perspective: 1200,
      }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseEnter={() => sc.set(1.04)}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
        sc.set(1);
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Project section (numbered list + cursor preview) ─────────────────────────
// Taste: no scroll cues, no decorative dots, numbered list is earned (actual sequence)
// Emil: spring cursor following, opacity+scale for preview, active feedback on links
function ProjectsSection({ theme }: { theme: Theme }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const reduced = useReducedMotion();

  return (
    <section
      id="work"
      className="relative min-h-[100dvh] overflow-hidden bg-[var(--bg)]"
    >
      {/* Three.js 3D tilted-panel canvas — lorisbukvic.graphics/works style */}
      {!reduced && (
        <div className="absolute inset-0 z-0">
          <WorksCanvas3D hoveredIdx={hoveredIdx} previews={PROJECTS.map(p => p.localPreview)} theme={theme} />
        </div>
      )}

      {/* Stage vignette — corners darken, eye drawn to center */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(var(--bg-rgb),0.88) 100%)',
        }}
      />

      {/* Atmospheric blue glows */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 70% at 70% 15%, rgba(var(--accent-rgb),0.09) 0%, transparent 65%),
            radial-gradient(ellipse 40% 55% at 12% 65%, rgba(var(--accent-rgb),0.05) 0%, transparent 60%)
          `,
        }}
      />

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[4] pointer-events-none"
        style={{ height: '20vh', background: 'linear-gradient(to bottom, transparent, var(--bg))' }}
      />

      {/* Content layer */}
      <div className="relative z-[10] max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 py-28 md:py-36 flex flex-col justify-center min-h-[100dvh]">
        {/* Editorial header */}
        <Reveal className="mb-16 md:mb-24">
          <div className="flex items-center justify-between border-b border-[rgba(var(--ink-rgb),calc(0.08*var(--ink-boost)))] pb-4 mb-5">
            <span className="text-[10px] text-[rgba(var(--ink-rgb),calc(0.25*var(--ink-boost)))] uppercase tracking-[0.2em] font-medium">Selected Work</span>
            <span className="text-[10px] text-[rgba(var(--ink-rgb),calc(0.20*var(--ink-boost)))] tabular-nums">0{PROJECTS.length}</span>
          </div>
          <MaskText
            text="Projects"
            tag="h2"
            className="text-[clamp(3rem,7vw,5.5rem)] font-bold tracking-[-0.04em] text-[rgba(var(--ink-rgb),calc(0.92*var(--ink-boost)))] leading-none"
            stagger={0.03}
          />
        </Reveal>

        {/* Project list with fade-mask at edges (lorisbukvic mask-image pattern) */}
        <div
          style={{
            maskImage: 'linear-gradient(transparent 0%, black 6%, black 94%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(transparent 0%, black 6%, black 94%, transparent 100%)',
          }}
        >
          {PROJECTS.map((p, i) => (
            <ProjectRow
              key={p.number}
              project={p}
              index={i}
              onHover={() => setHoveredIdx(i)}
              onLeave={() => setHoveredIdx(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({
  project,
  index,
  onHover,
  onLeave,
}: {
  project: Project;
  index: number;
  onHover: () => void;
  onLeave: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE_EXPO, delay: index * 0.07 }}
      className="border-t border-[rgba(var(--ink-rgb),calc(0.07*var(--ink-boost)))] last:border-b last:border-[rgba(var(--ink-rgb),calc(0.07*var(--ink-boost)))] cursor-default"
      style={{
        backgroundColor: hovered ? 'rgba(var(--ink-rgb),calc(0.018*var(--ink-boost)))' : 'transparent',
        transition: 'background-color 200ms ease, border-color 200ms ease',
      }}
      onMouseEnter={() => { setHovered(true); onHover(); }}
      onMouseLeave={() => { setHovered(false); onLeave(); }}
    >
      <div className="grid grid-cols-[1.75rem_1fr_auto] md:grid-cols-[2.5rem_1fr_auto] gap-4 md:gap-8 py-6 md:py-8">
        {/* Number */}
        <span className="text-[11px] tabular-nums select-none pt-[0.4rem] transition-colors duration-200"
          style={{ color: hovered ? 'rgba(var(--accent-rgb),0.6)' : 'rgba(var(--ink-rgb),calc(0.18*var(--ink-boost)))' }}>
          {project.number}
        </span>

        {/* Title + stack + description */}
        <div>
          <div className="flex flex-wrap items-baseline gap-2 md:gap-5 mb-2.5">
            <span
              className="font-bold leading-tight transition-colors duration-200"
              style={{
                fontSize: 'clamp(1.35rem, 2.8vw, 2rem)',
                color: hovered ? 'var(--ink)' : 'rgba(var(--ink-rgb),calc(0.85*var(--ink-boost)))',
                fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
              }}
            >
              {project.name}
            </span>
            {project.badge && (
              <span
                className="text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-[0.12em] shrink-0"
                style={{
                  color: hovered ? 'rgba(var(--accent-rgb),0.9)' : 'rgba(var(--accent-rgb),0.55)',
                  border: `1px solid ${hovered ? 'rgba(var(--accent-rgb),0.35)' : 'rgba(var(--accent-rgb),0.18)'}`,
                  transition: 'color 200ms ease, border-color 200ms ease',
                }}
              >
                {project.badge}
              </span>
            )}
            <span className="text-[11px] text-[rgba(var(--ink-rgb),calc(0.25*var(--ink-boost)))] uppercase tracking-[0.13em] font-medium shrink-0">
              {project.stack}
            </span>
          </div>
          {/* Description: always rendered (no layout shift), opacity-only reveal — GPU safe */}
          <p
            className="text-sm leading-relaxed transition-opacity duration-200"
            style={{
              maxWidth: '60ch',
              color: 'rgba(var(--ink-rgb),calc(0.45*var(--ink-boost)))',
              opacity: hovered ? 1 : 0,
            }}
          >
            {project.desc}
          </p>
        </div>

        {/* Year + action links */}
        <div className="flex flex-col items-end gap-3 pt-[0.35rem]">
          <span className="text-xs text-[rgba(var(--ink-rgb),calc(0.25*var(--ink-boost)))] tabular-nums shrink-0">{project.year}</span>
          {(project.live || project.repo) && (
            <div
              className="flex gap-0.5 transition-opacity duration-200"
              style={{ opacity: hovered ? 1 : 0 }}
            >
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded text-[rgba(var(--ink-rgb),calc(0.45*var(--ink-boost)))] hover:text-[var(--ink)] transition-colors duration-150 active:scale-90 active:text-[var(--accent)] active:transition-none"
                  aria-label={`Open ${project.name} live site`}
                >
                  <ExternalLink size={13} />
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded text-[rgba(var(--ink-rgb),calc(0.45*var(--ink-boost)))] hover:text-[var(--ink)] transition-colors duration-150 active:scale-90 active:text-[var(--accent)] active:transition-none"
                  aria-label={`Open ${project.name} repository`}
                >
                  <Github size={13} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Skills section ───────────────────────────────────────────────────────────
// Counts up once when scrolled into view
function AnimatedCounter({ value, className, style }: {
  value: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });
  const [display, setDisplay] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (reduced) { setDisplay(value); return; }
    const duration = 900;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value, reduced]);

  return (
    <span ref={ref} className={className} style={style}>
      {String(display).padStart(2, '0')}
    </span>
  );
}

// One row of the interactive skills index — fills with accent on hover/active
// and drives the SkillPreview panel beside it.
function SkillRow({ skill, index, active, onActivate }: {
  skill: typeof SKILLS[0];
  index: number;
  active: boolean;
  onActivate: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });
  const reduced = useReducedMotion();
  const Icon = skill.icon;

  return (
    <motion.div
      ref={ref}
      layout
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: -16 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE_EXPO } }}
      transition={{ duration: 0.5, ease: EASE_EXPO, delay: index * 0.05 }}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
      role="button"
      className="relative border-t border-[rgba(var(--ink-rgb),calc(0.07*var(--ink-boost)))] first:border-t-0 cursor-pointer overflow-hidden outline-none"
    >
      {/* Accent fill wipe */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(var(--accent-rgb),0.09), transparent)',
          clipPath: active ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
          transition: 'clip-path 450ms cubic-bezier(0.23,1,0.32,1)',
        }}
      />
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] pointer-events-none"
        style={{
          background: ACCENT,
          transform: active ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'center',
          transition: 'transform 350ms cubic-bezier(0.23,1,0.32,1)',
        }}
      />

      <div className="relative flex items-center gap-4 md:gap-6 py-5 md:py-6 pl-4 md:pl-6">
        <span
          className="text-xs tabular-nums font-semibold shrink-0"
          style={{
            color: active ? ACCENT : 'rgba(var(--ink-rgb),calc(0.22*var(--ink-boost)))',
            letterSpacing: '0.1em',
            transition: 'color 280ms ease',
            width: '2ch',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <div
          className="rounded-lg flex items-center justify-center shrink-0 md:hidden"
          style={{
            width: 30,
            height: 30,
            background: active ? 'rgba(var(--accent-rgb),0.14)' : 'rgba(var(--ink-rgb),calc(0.04*var(--ink-boost)))',
            border: `1px solid ${active ? 'rgba(var(--accent-rgb),0.3)' : 'rgba(var(--ink-rgb),calc(0.06*var(--ink-boost)))'}`,
            transition: 'background 280ms ease, border-color 280ms ease',
          }}
        >
          <Icon size={14} strokeWidth={1.75} style={{ color: active ? ACCENT : 'rgba(var(--ink-rgb),calc(0.4*var(--ink-boost)))', transition: 'color 280ms ease' }} />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold leading-snug truncate"
            style={{
              fontSize: 'clamp(1.15rem, 2.4vw, 1.75rem)',
              color: active ? 'var(--ink)' : 'rgba(var(--ink-rgb),calc(0.6*var(--ink-boost)))',
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
              transform: active ? 'translateX(8px)' : 'translateX(0)',
              transitionProperty: 'color, transform',
              transitionDuration: '320ms',
              transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)',
            }}
          >
            {skill.name}
          </h3>
          <p className="text-sm text-[rgba(var(--ink-rgb),calc(0.35*var(--ink-boost)))] leading-relaxed mt-1.5 md:hidden" style={{ maxWidth: '34ch' }}>
            {skill.desc}
          </p>
        </div>

        <span
          className="text-[10px] uppercase tracking-[0.18em] shrink-0 hidden sm:block"
          style={{ color: active ? ACCENT : 'rgba(var(--ink-rgb),calc(0.22*var(--ink-boost)))', transition: 'color 280ms ease', opacity: active ? 0.85 : 0.6 }}
        >
          {skill.category}
        </span>

        <ArrowUpRight
          size={16}
          strokeWidth={1.75}
          className="shrink-0 hidden md:block"
          style={{
            color: active ? ACCENT : 'rgba(var(--ink-rgb),calc(0.15*var(--ink-boost)))',
            transform: active ? 'rotate(45deg) scale(1.1)' : 'rotate(0deg) scale(1)',
            transition: 'color 280ms ease, transform 320ms cubic-bezier(0.23,1,0.32,1)',
          }}
        />
      </div>
    </motion.div>
  );
}

// Sticky detail panel — crossfades with a subtle blur when the active skill changes.
function SkillPreview({ skill }: { skill: typeof SKILLS[0] }) {
  const reduced = useReducedMotion();
  const Icon = skill.icon;

  return (
    <div
      className="rounded-2xl p-8 relative overflow-hidden"
      style={{
        background: 'rgba(var(--ink-rgb),calc(0.025*var(--ink-boost)))',
        border: '1px solid rgba(var(--ink-rgb),calc(0.07*var(--ink-boost)))',
        boxShadow: 'inset 0 1px 0 rgba(var(--ink-rgb),calc(0.04*var(--ink-boost)))',
        minHeight: 280,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={skill.name}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14, filter: 'blur(6px)' }}
          transition={{ duration: 0.4, ease: EASE_EXPO }}
        >
          <div
            className="rounded-xl flex items-center justify-center mb-8"
            style={{ width: 52, height: 52, background: 'rgba(var(--accent-rgb),0.12)', border: '1px solid rgba(var(--accent-rgb),0.25)' }}
          >
            <Icon size={24} strokeWidth={1.5} style={{ color: ACCENT }} />
          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2" style={{ color: ACCENT, opacity: 0.7 }}>
            {skill.category}
          </p>
          <h3
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", color: 'rgba(var(--ink-rgb),calc(0.92*var(--ink-boost)))' }}
          >
            {skill.name}
          </h3>
          <p className="text-sm text-[rgba(var(--ink-rgb),calc(0.45*var(--ink-boost)))] leading-relaxed" style={{ maxWidth: '38ch' }}>
            {skill.desc}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<typeof SKILL_CATEGORIES[number]>('All');

  // Mouse-tracking spotlight
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 22 });
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${springX}px ${springY}px, rgba(var(--accent-rgb),0.065), transparent 65%)`;

  const filtered = activeCategory === 'All' ? SKILLS : SKILLS.filter((s) => s.category === activeCategory);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSkill = filtered[activeIndex] ?? filtered[0];

  const handleCategoryChange = (cat: typeof SKILL_CATEGORIES[number]) => {
    setActiveCategory(cat);
    setActiveIndex(0);
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative px-6 md:px-16 lg:px-24 py-28 md:py-36"
      style={{ maxWidth: 1400, margin: '0 auto' }}
      onMouseMove={(e) => {
        if (reduced || !sectionRef.current) return;
        const r = sectionRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - r.left);
        mouseY.set(e.clientY - r.top);
      }}
      onMouseLeave={() => { mouseX.set(-9999); mouseY.set(-9999); }}
    >
      {/* Mouse spotlight */}
      {!reduced && (
        <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ background: spotlight }} />
      )}

      {/* Static ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '25%', left: '15%', width: 700, height: 500,
          background: 'radial-gradient(ellipse, rgba(var(--accent-rgb),0.035), transparent 70%)',
          filter: 'blur(48px)',
        }}
      />

      <div className="relative z-10">
        <Reveal className="mb-10 md:mb-12">
          <div className="flex items-center justify-between border-b border-[rgba(var(--ink-rgb),calc(0.08*var(--ink-boost)))] pb-4 mb-5">
            <span className="text-[10px] text-[rgba(var(--ink-rgb),calc(0.25*var(--ink-boost)))] uppercase tracking-[0.2em] font-medium">Technical Arsenal</span>
            <AnimatedCounter value={filtered.length} className="text-[10px] text-[rgba(var(--ink-rgb),calc(0.20*var(--ink-boost)))] tabular-nums" />
          </div>
          <MaskText
            text="Skills"
            tag="h2"
            className="text-[clamp(3rem,7vw,5.5rem)] font-bold tracking-[-0.04em] text-[rgba(var(--ink-rgb),calc(0.92*var(--ink-boost)))] leading-none"
            stagger={0.03}
          />
        </Reveal>

        {/* Category filter tabs */}
        <Reveal delay={0.08} className="mb-10 md:mb-14">
          <div className="flex flex-wrap gap-2">
            {SKILL_CATEGORIES.map((cat) => {
              const active = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className="text-sm rounded-full px-4 py-2 cursor-pointer select-none active:scale-[0.97] active:transition-none"
                  style={{
                    color: active ? 'var(--ink)' : 'rgba(var(--ink-rgb),calc(0.45*var(--ink-boost)))',
                    background: active ? 'rgba(var(--accent-rgb),0.14)' : 'rgba(var(--ink-rgb),calc(0.03*var(--ink-boost)))',
                    border: `1px solid ${active ? 'rgba(var(--accent-rgb),0.4)' : 'rgba(var(--ink-rgb),calc(0.08*var(--ink-boost)))'}`,
                    boxShadow: active ? '0 0 18px rgba(var(--accent-rgb),0.12)' : 'none',
                    transition: 'color 200ms ease, background 200ms ease, border-color 200ms ease, box-shadow 200ms ease, transform 160ms ease',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Index list + sticky preview */}
        <div className="grid md:grid-cols-[1fr_360px] gap-8 md:gap-16 items-start">
          <motion.div layout>
            <AnimatePresence mode="popLayout">
              {filtered.map((skill, i) => (
                <SkillRow
                  key={skill.name}
                  skill={skill}
                  index={i}
                  active={i === activeIndex}
                  onActivate={() => setActiveIndex(i)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="hidden md:block sticky top-28">
            <SkillPreview skill={activeSkill} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── About section ────────────────────────────────────────────────────────────
function StackChip({ label, index }: { label: string; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.span
      ref={ref}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.4, ease: EASE_EXPO, delay: (index % 10) * 0.025 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-xs rounded-full px-3 py-1 cursor-default select-none"
      style={{
        color: hovered ? 'rgba(var(--ink-rgb),calc(0.9*var(--ink-boost)))' : 'rgba(var(--ink-rgb),calc(0.6*var(--ink-boost)))',
        border: `1px solid ${hovered ? 'rgba(var(--accent-rgb),0.35)' : 'rgba(var(--ink-rgb),calc(0.09*var(--ink-boost)))'}`,
        background: hovered ? 'rgba(var(--accent-rgb),0.08)' : 'transparent',
        boxShadow: hovered ? '0 0 14px rgba(var(--accent-rgb),0.12)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'color 200ms ease, border-color 200ms ease, background 200ms ease, box-shadow 200ms ease, transform 200ms cubic-bezier(0.23,1,0.32,1)',
      }}
    >
      {label}
    </motion.span>
  );
}

function CertRow({ cert, index }: { cert: typeof CERTS[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const Icon = cert.type === 'award' ? Trophy : Award;

  return (
    <motion.div
      ref={ref}
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE_EXPO, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-4 border-t border-[rgba(var(--ink-rgb),calc(0.06*var(--ink-boost)))] py-4 px-3 -mx-3 first:border-t-0 first:pt-0 rounded-lg"
      style={{ background: hovered ? 'rgba(var(--accent-rgb),0.05)' : 'transparent', transition: 'background 220ms ease' }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: hovered ? 'rgba(var(--accent-rgb),0.14)' : 'rgba(var(--ink-rgb),calc(0.04*var(--ink-boost)))',
          border: `1px solid ${hovered ? 'rgba(var(--accent-rgb),0.3)' : 'rgba(var(--ink-rgb),calc(0.06*var(--ink-boost)))'}`,
          transition: 'background 220ms ease, border-color 220ms ease',
        }}
      >
        <Icon size={14} strokeWidth={1.75} style={{ color: hovered ? ACCENT : 'rgba(var(--ink-rgb),calc(0.4*var(--ink-boost)))', transition: 'color 220ms ease' }} />
      </div>
      <div className="flex-1 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[rgba(var(--ink-rgb),calc(0.80*var(--ink-boost)))]">{cert.title}</p>
          <p className="text-xs text-[rgba(var(--ink-rgb),calc(0.35*var(--ink-boost)))] mt-0.5">{cert.issuer}</p>
        </div>
        <span className="text-xs text-[rgba(var(--ink-rgb),calc(0.25*var(--ink-boost)))] tabular-nums shrink-0 pt-0.5">{cert.year}</span>
      </div>
    </motion.div>
  );
}

function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [photoHovered, setPhotoHovered] = useState(false);

  // Mouse-tracking spotlight
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 22 });
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${springX}px ${springY}px, rgba(var(--accent-rgb),0.06), transparent 65%)`;

  // Subtle 3D tilt on the photo card
  const rotateX = useSpring(0, { stiffness: 250, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 250, damping: 25 });

  const handlePhotoMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !photoRef.current) return;
    const rect = photoRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 8);
    rotateX.set(-py * 8);
  };
  const handlePhotoLeave = () => {
    setPhotoHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-[100dvh] px-6 md:px-16 lg:px-24 py-28 md:py-36 flex flex-col justify-center overflow-hidden"
      style={{ maxWidth: 1400, margin: '0 auto' }}
      onMouseMove={(e) => {
        if (reduced || !sectionRef.current) return;
        const r = sectionRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - r.left);
        mouseY.set(e.clientY - r.top);
      }}
      onMouseLeave={() => { mouseX.set(-9999); mouseY.set(-9999); }}
    >
      {/* Mouse spotlight */}
      {!reduced && (
        <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ background: spotlight }} />
      )}

      {/* Static ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '8%', right: '6%', width: 620, height: 480,
          background: 'radial-gradient(ellipse, rgba(var(--accent-rgb),0.04), transparent 70%)',
          filter: 'blur(64px)',
        }}
      />

      <div className="relative z-10">
        <div className="grid md:grid-cols-[minmax(0,400px)_1fr] gap-12 lg:gap-20 items-start mb-16 md:mb-24">
          {/* Left: photo */}
          <Reveal>
            <div className="relative">
              <div
                className="absolute pointer-events-none"
                style={{
                  inset: '-12%',
                  background: 'radial-gradient(ellipse, rgba(var(--accent-rgb),0.14) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />
              <motion.div
                ref={photoRef}
                className="relative rounded-2xl overflow-hidden group"
                style={{
                  aspectRatio: '1 / 1',
                  border: '1px solid rgba(var(--ink-rgb),calc(0.09*var(--ink-boost)))',
                  boxShadow: photoHovered
                    ? 'inset 0 1px 0 rgba(var(--ink-rgb),calc(0.07*var(--ink-boost))), 0 -2px 0 0 rgba(var(--accent-rgb),0.5), 0 24px 70px rgba(var(--accent-rgb),0.18)'
                    : 'inset 0 1px 0 rgba(var(--ink-rgb),calc(0.05*var(--ink-boost))), 0 20px 60px rgba(0,0,0,0.4)',
                  rotateX: reduced ? 0 : rotateX,
                  rotateY: reduced ? 0 : rotateY,
                  transformPerspective: 800,
                  transition: 'box-shadow 300ms ease',
                }}
                onMouseEnter={() => setPhotoHovered(true)}
                onMouseLeave={handlePhotoLeave}
                onMouseMove={handlePhotoMove}
              >
                <img
                  src="/about.jpg"
                  alt="Anubhav Kumar at his desk"
                  className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
                  draggable={false}
                />

                {/* Shimmer sweep — fires once per hover-enter */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(108deg, transparent 38%, rgba(var(--ink-rgb),calc(0.10*var(--ink-boost))) 50%, transparent 62%)',
                    transform: photoHovered ? 'translateX(200%)' : 'translateX(-200%)',
                    transition: photoHovered ? 'transform 900ms cubic-bezier(0.23,1,0.32,1)' : 'none',
                  }}
                />

                {/* Corner brackets — frame accent */}
                <div
                  className="absolute top-3 left-3 pointer-events-none"
                  style={{
                    width: 18, height: 18,
                    borderTop: `1.5px solid ${photoHovered ? ACCENT : 'rgba(var(--ink-rgb),calc(0.35*var(--ink-boost)))'}`,
                    borderLeft: `1.5px solid ${photoHovered ? ACCENT : 'rgba(var(--ink-rgb),calc(0.35*var(--ink-boost)))'}`,
                    opacity: photoHovered ? 0.9 : 0.45,
                    transition: 'border-color 300ms ease, opacity 300ms ease',
                  }}
                />
                <div
                  className="absolute bottom-3 right-3 pointer-events-none"
                  style={{
                    width: 18, height: 18,
                    borderBottom: `1.5px solid ${photoHovered ? ACCENT : 'rgba(var(--ink-rgb),calc(0.35*var(--ink-boost)))'}`,
                    borderRight: `1.5px solid ${photoHovered ? ACCENT : 'rgba(var(--ink-rgb),calc(0.35*var(--ink-boost)))'}`,
                    opacity: photoHovered ? 0.9 : 0.45,
                    transition: 'border-color 300ms ease, opacity 300ms ease',
                  }}
                />
              </motion.div>
            </div>
          </Reveal>

          {/* Right: heading + bio */}
          <div>
            <Reveal>
              <MaskText
                text="About"
                tag="h2"
                className="text-[clamp(2.25rem,5vw,3.75rem)] font-bold tracking-[-0.03em] text-[rgba(var(--ink-rgb),calc(0.90*var(--ink-boost)))] mb-10"
                stagger={0.045}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[0.95rem] text-[rgba(var(--ink-rgb),calc(0.55*var(--ink-boost)))] leading-[1.75]" style={{ maxWidth: '58ch' }}>
                I design and ship production-grade GenAI platforms used across large-scale enterprise environments. My work spans frontend, backend, cloud infrastructure, and AI systems — with a strong focus on reliability, performance, and measurable business impact.
              </p>
            </Reveal>
            <Reveal delay={0.16} className="mt-6">
              <p className="text-[11px] text-[rgba(var(--ink-rgb),calc(0.30*var(--ink-boost)))] uppercase tracking-[0.16em] font-medium mb-4">Here's the kind of problems I solve</p>
              <ul className="space-y-3">
                {[
                  'Turning complex policies and data into fast, usable AI-driven systems',
                  'Building LLM and RAG-based platforms on AWS that reduce manual effort and decision time',
                  'Creating scalable APIs and dashboards that teams actually enjoy using',
                  'Improving operational efficiency through automation and data-driven workflows',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-[0.9rem] text-[rgba(var(--ink-rgb),calc(0.50*var(--ink-boost)))] leading-[1.65]" style={{ maxWidth: '54ch' }}>
                    <span style={{ color: ACCENT, opacity: 0.7, flexShrink: 0, marginTop: '0.35rem', fontSize: '0.45rem' }}>●</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.28} className="mt-6">
              <p className="text-[0.95rem] text-[rgba(var(--ink-rgb),calc(0.55*var(--ink-boost)))] leading-[1.75]" style={{ maxWidth: '58ch' }}>
                My background in engineering and data analysis shapes how I think: structured, curious, and impact-focused. I enjoy collaborating with cross-functional teams, mentoring peers, and building systems that hold up in production, not just demos.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Stack + certifications */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Taste: eyebrow rationing — only two, here and below, not on every section */}
          <Reveal delay={0.12}>
            <p className="text-[11px] text-[rgba(var(--ink-rgb),calc(0.25*var(--ink-boost)))] uppercase tracking-[0.18em] mb-5 font-medium">Stack</p>
            <div className="flex flex-wrap gap-2">
              {STACK.map((item, i) => (
                <StackChip key={item} label={item} index={i} />
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="text-[11px] text-[rgba(var(--ink-rgb),calc(0.25*var(--ink-boost)))] uppercase tracking-[0.18em] mb-5 font-medium">Certifications</p>
            <div>
              {CERTS.map((cert, i) => (
                <CertRow key={cert.title} cert={cert} index={i} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Global cursor glow ───────────────────────────────────────────────────────
function MouseGlow() {
  const reduced = useReducedMotion();
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  const springX = useSpring(mouseX, { stiffness: 55, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 55, damping: 18 });
  const bg = useMotionTemplate`radial-gradient(380px circle at ${springX}px ${springY}px, rgba(var(--accent-rgb),0.045), transparent 65%)`;

  useEffect(() => {
    if (reduced) return;
    const move = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    const leave = () => { mouseX.set(-9999); mouseY.set(-9999); };
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseleave', leave); };
  }, [reduced, mouseX, mouseY]);

  if (reduced) return null;
  return <motion.div className="fixed inset-0 z-[6] pointer-events-none" style={{ background: bg }} />;
}

// ─── Scroll progress bar ──────────────────────────────────────────────────────
function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });
  if (reduced) return null;
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] pointer-events-none"
      style={{
        height: 2,
        scaleX,
        transformOrigin: '0%',
        background: `linear-gradient(90deg, ${ACCENT}, rgba(var(--ink-rgb),calc(0.6*var(--ink-boost))))`,
      }}
    />
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
// Taste: no custom cursor, no scroll cues, minimal link set
// Emil: active feedback, ≤200ms transitions
// Light/dark toggle — sun glows orange in light mode, moon stays cool blue-white in dark
function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative w-9 h-9 rounded-full flex items-center justify-center border transition-colors duration-200 active:scale-90 active:transition-none shrink-0"
      style={{
        borderColor: 'rgba(var(--ink-rgb),calc(0.12*var(--ink-boost)))',
        color: theme === 'dark' ? 'rgba(var(--ink-rgb),calc(0.6*var(--ink-boost)))' : 'var(--accent-2)',
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.3, ease: EASE_EXPO }}
          className="flex items-center justify-center"
        >
          {theme === 'dark' ? <Moon size={15} strokeWidth={1.75} /> : <Sun size={15} strokeWidth={1.75} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function Nav({ theme, toggleTheme }: { theme: Theme; toggleTheme: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  // Track which section is in view — highlight nav link and update URL
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.id;
            setActiveSection(id);
            const url = id === 'home' ? '/' : `/${id}`;
            window.history.replaceState(null, '', url);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    document.querySelectorAll('section[id]').forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.pushState(null, '', id === 'home' ? '/' : `/${id}`);
    setMobileOpen(false);
  };

  const NAV_LINKS = [
    { label: 'About',   id: 'about' },
    { label: 'Skills',  id: 'skills' },
    { label: 'Work',    id: 'work' },
    { label: 'Connect', id: 'connect' },
  ];

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_EXPO, delay: 0.15 }}
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(var(--bg-rgb),0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(var(--ink-rgb),calc(0.05*var(--ink-boost)))' : '1px solid transparent',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 h-16 flex items-center justify-between">
          {/* white.png wordmark */}
          <button
            onClick={() => scrollTo('home')}
            className="active:scale-95 active:transition-none transition-transform duration-150"
            aria-label="Back to top"
          >
            <img src={theme === 'dark' ? '/logo/white.png' : '/logo/black.png'} alt="AK" className="h-7 w-auto" />
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm transition-colors duration-150 active:text-[var(--accent)] active:transition-none"
                style={{ color: activeSection === id ? 'rgba(var(--ink-rgb),calc(0.92*var(--ink-boost)))' : 'rgba(var(--ink-rgb),calc(0.45*var(--ink-boost)))' }}
              >
                {label}
              </button>
            ))}
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>

          {/* Mobile: hamburger + theme toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button
              className="p-2 text-[rgba(var(--ink-rgb),calc(0.60*var(--ink-boost)))] hover:text-[var(--ink)] transition-colors duration-150 active:text-[var(--accent)] active:transition-none"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? (
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M18 6L6 18M6 6l12 12"/></svg>
              ) : (
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[var(--bg)] flex flex-col items-center justify-center gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_EXPO }}
          >
            {NAV_LINKS.map(({ label, id }, i) => (
              <motion.button
                key={id}
                className="text-3xl font-bold text-[rgba(var(--ink-rgb),calc(0.80*var(--ink-boost)))] hover:text-[var(--accent)] transition-colors duration-150 active:scale-95 active:transition-none"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE_EXPO, delay: i * 0.07 }}
                onClick={() => scrollTo(id)}
              >
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Page() {
  const { theme, toggle: toggleTheme } = useTheme();

  // Scroll to the right section when landing on /work, /about, /connect
  useEffect(() => {
    const id = window.location.pathname.replace(/^\//, '').split('/')[0];
    if (['work', 'skills', 'about', 'connect'].includes(id)) {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'auto' });
      }, 400);
    }
  }, []);

  return (
    <div className="bg-[var(--bg)] text-[var(--ink)] overflow-x-hidden" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
      {/* Global effects */}
      <MouseGlow />
      <ScrollProgress />

      {/* Drifting gradient blobs — whole-page ambient atmosphere */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div style={{
          position: 'absolute', width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(var(--accent-rgb),0.11) 0%, transparent 70%)',
          filter: 'blur(72px)', top: '-8%', right: '-5%',
          animation: 'blob-1 20s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 550, height: 550, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(100,70,240,0.07) 0%, transparent 70%)',
          filter: 'blur(90px)', bottom: '15%', left: '-8%',
          animation: 'blob-2 26s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 450, height: 450, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(var(--accent-rgb),0.06) 0%, transparent 70%)',
          filter: 'blur(100px)', top: '40%', left: '40%',
          animation: 'blob-3 34s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(60,180,255,0.055) 0%, transparent 70%)',
          filter: 'blur(80px)', bottom: '5%', right: '20%',
          animation: 'blob-4 28s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(var(--accent-2-rgb),0.05) 0%, transparent 70%)',
          filter: 'blur(90px)', top: '55%', right: '-6%',
          animation: 'blob-2 30s ease-in-out infinite',
        }} />
      </div>

      <Nav theme={theme} toggleTheme={toggleTheme} />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="min-h-[100dvh] flex flex-col md:flex-row items-center px-6 md:px-16 lg:px-24 pt-28 pb-16 md:pt-0 gap-12 md:gap-0"
        style={{ maxWidth: 1400, margin: '0 auto' }}
      >
        {/* Left: text column */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.p
            className="text-xs mb-10 flex items-center gap-1.5 font-medium"
            style={{ color: 'rgba(52,211,153,0.75)', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE_EXPO, delay: 0.35 }}
          >
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: 5,
                height: 5,
                borderRadius: '50%',
                backgroundColor: '#34d399',
                animation: 'pulse-dot 2s ease-in-out infinite',
              }}
            />
            Available for work
          </motion.p>

          {/* Oversized hero — character mask reveal, lorisbukvic style */}
          {/* Impeccable: clamp max ≤ 6rem hero; tracking ≥ -0.04em */}
          <div
            className="font-bold leading-[0.9] tracking-[-0.04em] text-[var(--ink)]"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontSize: 'clamp(3.5rem,9.5vw,6rem)' }}
          >
            <MaskText text="Anubhav" tag="div" className="block" delay={0.4} stagger={0.028} />
            <div style={{ color: ACCENT }}>
              <MaskText text="Kumar" tag="div" className="block" delay={0.52} stagger={0.028} />
            </div>
          </div>

          {/* Typewriter role line */}
          <Reveal delay={0.85} className="mt-7">
            <p
              className="text-[1.05rem] md:text-[1.2rem] font-medium leading-tight"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", color: 'rgba(var(--ink-rgb),calc(0.65*var(--ink-boost)))' }}
            >
              I am a{' '}
              <TypeWriter
                phrases={['Full Stack Developer', 'GenAI Engineer', 'Data Engineer', 'Software Engineer', 'AI Systems Builder', 'Gamer']}
                className="text-[var(--ink)]"
              />
            </p>
          </Reveal>
          {/* Description */}
          <Reveal delay={1.0} className="mt-4">
            <p
              className="text-sm md:text-base text-[rgba(var(--ink-rgb),calc(0.42*var(--ink-boost)))] font-normal leading-relaxed"
              style={{ maxWidth: '50ch' }}
            >
              Building production-grade GenAI platforms at Deloitte — LLMs, RAG, AWS Bedrock, from backend APIs to frontend dashboards.
            </p>
          </Reveal>

          {/* CTAs */}
          {/* Taste + Emil: :active feedback, border-radius locked, ≤200ms transitions */}
          <Reveal delay={1.18} className="mt-10 flex flex-wrap gap-3">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-[var(--bg)] transition-colors duration-200 active:scale-[0.97] active:transition-none"
              style={{ backgroundColor: ACCENT }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--ink)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = ACCENT)}
            >
              View Work
              <ArrowUpRight size={13} />
            </a>
            <a
              href="#connect"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-[rgba(var(--ink-rgb),calc(0.70*var(--ink-boost)))] border border-[rgba(var(--ink-rgb),calc(0.15*var(--ink-boost)))] hover:border-[rgba(var(--ink-rgb),calc(0.40*var(--ink-boost)))] hover:text-[rgba(var(--ink-rgb),calc(0.90*var(--ink-boost)))] transition-all duration-200 active:scale-[0.97] active:transition-none"
            >
              Connect
            </a>
          </Reveal>
        </div>

        {/* Right: AK monogram — 3D centerpiece with orbit rings */}
        <div className="flex-1 flex justify-center md:justify-end items-center">
          <Reveal delay={0.5}>
            <OrbitRings>
              <Tilt className="w-[260px] h-[260px] md:w-[340px] md:h-[340px]">
                <div
                  className="w-full h-full rounded-3xl border border-[rgba(var(--ink-rgb),calc(0.08*var(--ink-boost)))] flex items-center justify-center"
                  style={{ background: 'radial-gradient(ellipse at 40% 40%, var(--surface) 0%, var(--bg) 100%)' }}
                >
                  <img
                    src="/logo/avatar.png"
                    alt="AK monogram"
                    className="w-[65%] h-[65%] object-contain select-none"
                    style={{ filter: 'drop-shadow(0 0 32px rgba(var(--accent-rgb), 0.25))' }}
                    draggable={false}
                  />
                </div>
              </Tilt>
            </OrbitRings>
          </Reveal>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
      <AboutSection />

      {/* ── SKILLS ────────────────────────────────────────────────────────── */}
      <SkillsSection />

      {/* ── EXPERIENCE ────────────────────────────────────────────────────── */}
      {/* Impeccable: no tree visualization, clean two-column list */}
      <section
        className="px-6 md:px-16 lg:px-24 py-28 md:py-36"
        style={{ maxWidth: 1400, margin: '0 auto' }}
      >
        <Reveal className="mb-16 md:mb-20">
          <MaskText
            text="Experience"
            tag="h2"
            className="text-[clamp(2.25rem,5vw,3.75rem)] font-bold tracking-[-0.03em] text-[rgba(var(--ink-rgb),calc(0.90*var(--ink-boost)))]"
            stagger={0.025}
          />
        </Reveal>

        <div>
          {EXPERIENCE.map((item, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="grid md:grid-cols-[220px_1fr] gap-3 md:gap-16 border-t border-[rgba(var(--ink-rgb),calc(0.07*var(--ink-boost)))] py-7 md:py-9 group hover:border-[rgba(var(--ink-rgb),calc(0.15*var(--ink-boost)))] transition-colors duration-200">
                <p className="text-xs text-[rgba(var(--ink-rgb),calc(0.30*var(--ink-boost)))] tabular-nums leading-relaxed pt-0.5">{item.period}</p>
                <div>
                  <h3 className="text-base font-semibold text-[rgba(var(--ink-rgb),calc(0.85*var(--ink-boost)))] leading-snug">{item.title}</h3>
                  <p className="text-sm mt-1 mb-3" style={{ color: ACCENT, opacity: 0.75 }}>{item.company}</p>
                  <p className="text-sm text-[rgba(var(--ink-rgb),calc(0.40*var(--ink-boost)))] leading-relaxed" style={{ maxWidth: '60ch' }}>{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── WORK ──────────────────────────────────────────────────────────── */}
      <ProjectsSection theme={theme} />

      {/* ── CONNECT ───────────────────────────────────────────────────────── */}
      {/* Taste: no decorative dots, no glassmorphism; Impeccable: large display CTA */}
      <section
        id="connect"
        className="min-h-[100dvh] px-6 md:px-16 lg:px-24 py-28 md:py-36 flex flex-col justify-center"
        style={{ maxWidth: 1400, margin: '0 auto' }}
      >
        <div style={{ maxWidth: 800 }}>
          {/* Large display mask reveal — lorisbukvic style CTA */}
          <MaskText
            text="Let's build"
            tag="h2"
            className="font-bold tracking-[-0.04em] leading-[0.95] text-[rgba(var(--ink-rgb),calc(0.90*var(--ink-boost)))] block"
            style={{ fontSize: 'clamp(2.75rem,8vw,5.5rem)', fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" } as React.CSSProperties}
            stagger={0.03}
          />
          <MaskText
            text="something great."
            tag="h2"
            className="font-bold tracking-[-0.04em] leading-[0.95] block"
            style={{ fontSize: 'clamp(2.75rem,8vw,5.5rem)', color: ACCENT, fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" } as React.CSSProperties}
            delay={0.2}
            stagger={0.025}
          />

          <Reveal delay={0.5} className="mt-12">
            <a
              href="mailto:work@anubhavkumaar.in"
              className="group inline-flex items-center gap-3 text-base md:text-lg text-[rgba(var(--ink-rgb),calc(0.55*var(--ink-boost)))] hover:text-[rgba(var(--ink-rgb),calc(0.90*var(--ink-boost)))] border-b border-[rgba(var(--ink-rgb),calc(0.15*var(--ink-boost)))] hover:border-[rgba(var(--ink-rgb),calc(0.40*var(--ink-boost)))] pb-2 transition-[color,border-color] duration-200 active:scale-[0.97] active:text-[var(--accent)] active:transition-none"
            >
              work@anubhavkumaar.in
              <ArrowUpRight
                size={16}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150"
              />
            </a>
          </Reveal>

          {/* Social links */}
          <Reveal delay={0.65} className="mt-12">
            <div className="flex flex-wrap gap-2.5">
              {[
                {
                  label: 'GitHub',
                  href: 'https://github.com/anubhavkumaar',
                  icon: <Github size={14} />,
                },
                {
                  label: 'LinkedIn',
                  href: 'https://www.linkedin.com/in/anubhavkumaar/',
                  icon: <Linkedin size={14} />,
                },
                {
                  label: 'Instagram',
                  href: 'https://www.instagram.com/theanubhavkumar/',
                  icon: <Instagram size={14} />,
                },
                {
                  label: 'Twitter',
                  href: 'https://twitter.com/theanubhavkumar/',
                  // Simple Icons CDN: https://cdn.simpleicons.org/x
                  icon: <img src="https://cdn.simpleicons.org/x/ffffff" alt="" width={14} height={14} className="opacity-50 group-hover:opacity-90 transition-opacity duration-200" aria-hidden="true" />,
                },
                {
                  label: 'YouTube',
                  href: 'https://youtube.com/@anubhavkumaar',
                  icon: <Youtube size={14} />,
                },
                {
                  label: 'Twitch',
                  href: 'https://twitch.com/anubhavkumaar',
                  icon: <Twitch size={14} />,
                },
                {
                  label: 'Discord',
                  href: 'https://anubhavkumaar.in/discord',
                  // Simple Icons CDN: https://cdn.simpleicons.org/discord
                  icon: <img src="https://cdn.simpleicons.org/discord/ffffff" alt="" width={14} height={14} className="opacity-50 group-hover:opacity-90 transition-opacity duration-200" aria-hidden="true" />,
                },
                {
                  label: 'Steam',
                  href: 'https://steamcommunity.com/id/anubhavkumar/',
                  // Simple Icons CDN: https://cdn.simpleicons.org/steam
                  icon: <img src="https://cdn.simpleicons.org/steam/ffffff" alt="" width={14} height={14} className="opacity-50 group-hover:opacity-90 transition-opacity duration-200" aria-hidden="true" />,
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-xs text-[rgba(var(--ink-rgb),calc(0.45*var(--ink-boost)))] border border-[rgba(var(--ink-rgb),calc(0.09*var(--ink-boost)))] rounded-full px-3.5 py-2 hover:text-[rgba(var(--ink-rgb),calc(0.80*var(--ink-boost)))] hover:border-[rgba(var(--ink-rgb),calc(0.25*var(--ink-boost)))] transition-all duration-200 active:scale-[0.97] active:text-[var(--accent)] active:transition-none"
                >
                  {s.icon}
                  {s.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[rgba(var(--ink-rgb),calc(0.05*var(--ink-boost)))] px-6 md:px-16 lg:px-24 py-8 max-w-[1400px] mx-auto flex items-center justify-between">
        <img src="/logo/white.png" alt="AK" className="h-5 w-auto opacity-30" />
        <p className="text-xs text-[rgba(var(--ink-rgb),calc(0.20*var(--ink-boost)))]">
          &copy; {new Date().getFullYear()} Anubhav Kumar
        </p>
      </footer>
    </div>
  );
}
