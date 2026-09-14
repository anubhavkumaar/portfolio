// Skills, grouped as the profile sheet groups them. Every item is on the
// sheet. No logos, no proficiency bars, no counts. The "also worked with"
// line holds the tools the sheet keeps out of the headline set.

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
    name: 'Languages and frameworks',
    items: ['Python', 'FastAPI', 'Flask', 'Pydantic', 'SQL', 'TypeScript', 'JavaScript', 'React', 'Next.js', 'REST APIs', 'Server-sent events'],
    where: 'The platform services and front end, and this site.',
  },
  {
    name: 'AI',
    items: [
      'RAG',
      'AWS Bedrock and Knowledge Bases',
      'Model Context Protocol',
      'FastMCP',
      'Agentic and multi-agent orchestration',
      'Vector search and embeddings',
      'Semantic caching',
      'LLM evaluation harnesses',
      'AI-native development with Claude Code and GitHub Copilot',
      'Reviewing agent-generated code',
    ],
    where: 'The retrieval layer and the agent layer.',
  },
  {
    name: 'Cloud and infrastructure',
    items: ['AWS: Bedrock, S3, Lambda, EC2, IAM', 'Docker', 'Red Hat OpenShift (Kubernetes)', 'GitLab CI/CD', 'Azure DevOps', 'Git'],
    where: 'Where the platform runs and how it ships.',
  },
  {
    name: 'Data',
    items: ['PostgreSQL', 'psycopg3', 'Redis', 'Amazon S3', 'ETL and ingestion pipelines', 'Data modelling', 'Data validation'],
    where: 'The storage and ingestion paths under the platform.',
  },
  {
    name: 'Testing and observability',
    items: ['pytest', 'Playwright', 'End-to-end and integration testing', 'CI-gated regression suites', 'OpenTelemetry', 'Prometheus', 'structlog', 'Langfuse'],
    where: 'The end-to-end test framework, and every model call.',
  },
  {
    name: 'Security',
    items: ['TLS and CA validation', 'OAuth', 'SAST', 'SonarQube', 'ClamAV', 'SHA-256 integrity checks', 'PHI redaction', 'FIPS and HIPAA compliance'],
    where: 'The security review, cleared with zero critical findings.',
  },
  {
    name: 'Practices',
    items: ['Code review', 'Technical design documents', 'Mentoring', 'Agile', 'Scrum', 'JIRA', 'ServiceNow'],
    where: 'Every sprint.',
  },
];

export const skillsAlso = 'Also worked with: Hadoop, Hive, Oracle SQL Developer, UiPath, Power BI.';
