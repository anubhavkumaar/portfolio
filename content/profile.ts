// Single source of truth for identity, positioning and contact.
// Copy rules: no em dashes, sentence case, active voice, every line does one job.

export const profile = {
  name: 'Anubhav Kumar',
  initials: 'AK',
  role: 'Full Stack Developer and GenAI Engineer',
  location: 'Hyderabad, India',
  email: 'work@anubhavkumaar.in',

  lede:
    'I build production GenAI platforms at Deloitte: retrieval, agents, and the streaming backends under them, licensed to US state governments.',
  ledeMeta: 'Three years at Deloitte. Hyderabad, India.',

  links: [
    { label: 'GitHub', href: 'https://github.com/anubhavkumaar' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/anubhavkumaar/' },
  ],
} as const;

// About. The review-gate claim leads because it is the strongest single signal:
// three years in and approving merges from engineers senior in grade.
export const about = {
  heading: 'Three years on one platform.',
  lead:
    'I joined Deloitte in July 2023 and have worked on the same GenAI platform since: backend, retrieval, and the front end around them. I review most of what ships on the team and carry releases into production.',

  body: [
    'My degree is in mechanical engineering. What transferred was load paths: knowing which part of a structure is carrying, and what happens when it stops. Most of what I know about software I learned by shipping it into environments where being wrong is expensive.',
    'Before the platform work I validated UiPath automations on a programme that removed over 69,000 manual hours a year, writing the SQL and test plans that checked each workflow against source data.',
  ],
} as const;

// Measured facts. Kept separate so they render as annotations, not prose.
export const facts = [
  { value: '5', label: 'state portals running the platform' },
  { value: '5,000+', label: 'users on it' },
  { value: '40%', label: 'drop in support tickets after the internal tooling' },
  { value: '0', label: 'critical findings at HIPAA and FIPS review' },
] as const;

export const education = {
  degree: 'B.Tech, Mechanical Engineering',
  school: 'Kalinga Institute of Industrial Technology',
  place: 'Bhubaneswar',
  years: '2019 to 2023',
} as const;

export const awards = [
  { title: 'Applause Award', issuer: 'Deloitte', year: '2026' },
  { title: 'Applause Award', issuer: 'Deloitte', year: '2024' },
  { title: 'AI and Machine Learning', issuer: 'IIT Roorkee', year: '2023' },
] as const;
