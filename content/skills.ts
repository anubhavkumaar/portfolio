// Skills, grouped by what each one is for. Every item here appears somewhere
// else on the site (a case study stack, the about copy, the console) or on the
// resumes this site was built from. No logos, no proficiency bars, no counts.

export type SkillGroup = {
  name: string;
  items: string[];
  /** Where on the site, or in the work, the group earned its place. */
  where: string;
};

export const skillsNote =
  'Grouped by what each one is for. The case studies show where they earned their place.';

export const skills: SkillGroup[] = [
  {
    name: 'GenAI',
    items: [
      'LLM applications',
      'Retrieval (RAG)',
      'AWS Bedrock',
      'Bedrock Knowledge Bases',
      'LangChain',
      'LangGraph',
      'Model Context Protocol',
      'Embeddings and vector search',
    ],
    where: 'The retrieval layer and the agent layer.',
  },
  {
    name: 'Backend',
    items: ['Python', 'FastAPI', 'Streaming APIs', 'PostgreSQL', 'psycopg3', 'Redis', 'OAuth', 'OpenTelemetry', 'Prometheus'],
    where: 'The backend re-platform, and every service under the platform.',
  },
  {
    name: 'Frontend',
    items: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Accessibility'],
    where: 'The platform front end, the four side projects, and this site.',
  },
  {
    name: 'Cloud and data',
    items: ['AWS Lambda', 'S3', 'Hadoop', 'Hive', 'Oracle SQL', 'SQL for validation and BI', 'UiPath'],
    where: 'Data lake and automation work before the GenAI platform.',
  },
  {
    name: 'Security and delivery',
    items: ['HIPAA and FIPS controls', 'Static analysis', 'TLS and CA validation', 'Code review', 'Release management', 'Git'],
    where: 'Every release on the platform.',
  },
];
