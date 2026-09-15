// Single source of truth for identity, positioning and contact.
// Copy rules: no em dashes, sentence case, active voice, every line does one job.

export const profile = {
  name: 'Anubhav Kumar',
  initials: 'AK',
  role: 'Full Stack Developer and GenAI Engineer',
  location: 'Hyderabad, India',
  email: 'work@anubhavkumaar.in',

  roleLine: 'I am a',
  /** The role line cycles through these after the first; all from the profile sheet. */
  roles: [
    'Full Stack Developer and GenAI Engineer',
    'Data Engineer',
    'Backend Engineer',
    'Agentic AI Engineer',
    'LLM and RAG Engineer',
    'Gamer',
  ],
  lede:
    'Building production-grade GenAI platforms at Deloitte: LLMs, RAG, AWS Bedrock, from backend APIs to frontend dashboards.',

  links: [
    { label: 'GitHub', href: 'https://github.com/anubhavkumaar' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/anubhavkumaar/' },
  ],
} as const;

// About. The wording from the previous site, kept at his request (2026-09-14).
export const about = {
  heading: 'About',
  lead:
    'I design and ship production-grade GenAI platforms used across large-scale enterprise environments. My work spans frontend, backend, cloud infrastructure, and AI systems, with a strong focus on reliability, performance, and measurable business impact.',
  problemsLabel: "Here's the kind of problems I solve",
  problems: [
    'Turning complex policies and data into fast, usable AI-driven systems',
    'Building LLM and RAG-based platforms on AWS that reduce manual effort and decision time',
    'Creating scalable APIs and dashboards that teams actually enjoy using',
    'Improving operational efficiency through automation and data-driven workflows',
  ],
  body: [
    'My background in engineering and data analysis shapes how I think: structured, curious, and impact-focused. I enjoy collaborating with cross-functional teams, mentoring peers, and building systems that hold up in production, not just demos.',
  ],
} as const;

// Measured facts. Kept separate so they render as annotations, not prose.
export const facts = [
  { value: '0', label: 'critical findings at HIPAA and FIPS security review' },
  { value: '40%', label: 'drop in support tickets after the internal tooling' },
  { value: '20+', label: 'internal APIs and tools for issue reporting and health checks' },
  { value: '69,000', label: 'manual hours a year saved by the automation programme I validated' },
] as const;

export const education = {
  degree: 'B.Tech, Mechanical Engineering',
  school: 'Kalinga Institute of Industrial Technology',
  place: 'Bhubaneswar',
  years: '2019 to 2023',
} as const;

export const awards = [
  { title: 'Applause Award', issuer: 'Deloitte: AI upskilling, delivery speed and defect resolution', year: 'May 2026' },
  { title: 'Impact Day', issuer: 'Deloitte', year: 'Nov 2024' },
  { title: 'Applause Award', issuer: 'Deloitte: built and supported two automation bots', year: 'Sep 2024' },
  { title: 'AI and Machine Learning', issuer: 'IIT Roorkee with Deloitte', year: '2023' },
  { title: 'Data Engineering', issuer: 'Deloitte', year: '2023' },
  { title: 'Machine Learning', issuer: 'Deloitte', year: '2023' },
  { title: 'SolidWorks', issuer: 'Internshala', year: '2021' },
] as const;
