// What the landing console knows. Every answer is a fact from the profile
// sheet, in Anubhav's voice, first person. No model behind it: a question is
// scored against each entry's keys and the best match answers. Nothing here
// leaves the browser.
//
// Keep out, per the profile sheet: who runs the platform, client or customer
// names, compensation, seniority relative to colleagues, a hardcoded
// years-of-experience number, and any number the sheet does not list.

import { profile } from './profile';

export type Answer = {
  id: string;
  /** Chip label, when the entry is offered as a suggestion. */
  chip?: string;
  /** Lower-case words or phrases; each one found in the question scores a point. */
  keys: string[];
  /** The reply. A function when part of it is computed at ask time. */
  text: string | (() => string);
  /** Section the reply points at. */
  go?: { id: string; label: string };
  /** Broad entries lose ties to specific ones. */
  general?: boolean;
};

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'];
const word = (n: number) => WORDS[n] ?? String(n);

/** Time at Deloitte since July 2023, counted at ask time rather than typed in. */
export function tenure(): string {
  const start = new Date(2023, 6, 1);
  const now = new Date();
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (months < 0) months = 0;
  const y = Math.floor(months / 12);
  const m = months % 12;
  const years = y === 0 ? '' : `${word(y)} year${y === 1 ? '' : 's'}`;
  const rest = m === 0 ? '' : `${word(m)} month${m === 1 ? '' : 's'}`;
  return [years, rest].filter(Boolean).join(' and ') || 'under a month';
}

const monthYear = () =>
  new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(new Date());

export const answers: Answer[] = [
  {
    id: 'build',
    chip: 'What do you build?',
    general: true,
    keys: ['build', 'do you do', 'what do you', 'working on', 'make', 'platform', 'day to day', 'daily'],
    text:
      'AI and full stack engineering on a multi-tenant GenAI product platform at Deloitte: FastAPI streaming services, PostgreSQL with psycopg3, Redis semantic caching, and a React and TypeScript front end, running on Docker and Red Hat OpenShift with GitLab CI/CD.',
    go: { id: 'work', label: 'Open the work' },
  },
  {
    id: 'experience',
    chip: 'Experience',
    general: true,
    keys: ['experience', 'how long', 'years', 'since when', 'tenure', 'how many', 'worked', 'career', 'exp'],
    text: () =>
      `I joined Deloitte in July 2023, so ${tenure()} as of ${monthYear()}, all of it on the same team. First a Data Analyst on an RPA automation programme, then GenAI Developer, now Data Engineer I.`,
    go: { id: 'about', label: 'More about me' },
  },
  {
    id: 'summary',
    general: true,
    keys: ['what all', 'did', 'done', 'everything', 'all', 'summary', 'overview', 'highlights', 'accomplish', 'what has', 'worked on', 'project', 'contribution', 'tell me', 'about him', 'his work', 'proud'],
    text:
      'Since July 2023, all on one GenAI platform at Deloitte: built the retrieval stack twice (a from-scratch RAG first, then AWS Bedrock Knowledge Bases), built the multi-agent system (RAG, portal tools, ticket, log and pod agents) and the Model Context Protocol servers behind the product chatbot, wrote the end-to-end test framework that gates every merge request, cleared HIPAA and FIPS security review with zero critical findings, instrumented every model call with OpenTelemetry, Prometheus and Langfuse, refactored SSE streaming across 16 React components, and built 20+ internal APIs and tools that cut support tickets by roughly 40%. Before that, a year validating UiPath automations on a programme saving over 69,000 manual hours a year. The three case studies tell the big ones properly.',
    go: { id: 'work', label: 'Open the work' },
  },
  {
    id: 'role',
    general: true,
    keys: ['role', 'position', 'title', 'job', 'designation', 'current', 'data engineer', 'work at', 'where do you work', 'company', 'employer', 'deloitte'],
    text:
      'Data Engineer I at Deloitte, since June 2026. Before that GenAI Developer on the same platform, and before that a Data Analyst on an RPA automation programme from October 2023 to October 2024. One continuous run at Deloitte since July 2023.',
    go: { id: 'about', label: 'More about me' },
  },
  {
    id: 'stack',
    chip: 'Tech stack?',
    general: true,
    keys: ['stack', 'tech', 'tools', 'technolog', 'language', 'framework', 'skills', 'know', 'use'],
    text:
      'Python, FastAPI, Pydantic and SQL on the backend; TypeScript, React and Next.js on the front end. AWS Bedrock and Knowledge Bases, Model Context Protocol and agent orchestration on the AI side. PostgreSQL, psycopg3, Redis and S3 for data. Docker, OpenShift and GitLab CI/CD to ship it. The full set is in the skills section.',
    go: { id: 'skills', label: 'What I work with' },
  },
  {
    id: 'education',
    chip: 'Education',
    keys: ['education', 'degree', 'college', 'university', 'study', 'studied', 'btech', 'b.tech', 'kiit', 'mechanical', 'academy', 'course', 'certif', 'roorkee', 'school', 'graduat'],
    text:
      'B.Tech in Mechanical Engineering from Kalinga Institute of Industrial Technology, 2019 to 2023. Then the Deloitte AI Academy programme, July to October 2023: Python, SQL, machine learning and AWS, with a capstone that cleaned and analysed a vehicle insurance dataset and compared predictive models on SageMaker. AI and Machine Learning certification from IIT Roorkee.',
    go: { id: 'about', label: 'More about me' },
  },
  {
    id: 'awards',
    keys: ['award', 'applause', 'recognition', 'achievement', 'won', 'prize', 'honour', 'honor'],
    text: 'Two Applause Awards at Deloitte. The full list of awards and certifications is in the about section.',
    go: { id: 'about', label: 'See the list' },
  },
  {
    id: 'rag',
    keys: ['rag', 'retrieval', 'bedrock', 'knowledge base', 'embedding', 'vector', 'citation', 'ingest', 'search', 'document'],
    text:
      'I built the retrieval stack twice: a from-scratch RAG implementation first, to learn the failure modes, then a migration onto AWS Bedrock Knowledge Bases with S3 document ingestion, query routing and citation extraction. The first case study is that story.',
    go: { id: 'work', label: 'Open the case study' },
  },
  {
    id: 'agents',
    keys: ['agent', 'mcp', 'model context protocol', 'chatbot', 'tool', 'orchestrat', 'multi-agent', 'multi agent', 'assistant', 'rag agent', 'ticket agent', 'log agent', 'pod', 'router'],
    text:
      'A multi-agent system behind the product chatbot: a RAG agent for document questions, portal tools agents for actions inside the product, a ticket agent, a log agent, and a pod agent for the runtime, with an orchestrator routing each request to the agent that owns it. Underneath, Model Context Protocol servers expose four enterprise backend systems as narrow, typed tools. The second case study covers it.',
    go: { id: 'work', label: 'Open the case study' },
  },
  {
    id: 'backend',
    keys: ['backend', 'back end', 'fastapi', 'api', 'apis', 'stream', 'sse', 'server sent', 'postgres', 'psycopg', 'redis', 'cach', 'database', 'db'],
    text:
      'FastAPI streaming services over server-sent events, PostgreSQL with psycopg3, Redis semantic caching in front of model calls, and every model call instrumented with OpenTelemetry, Prometheus and Langfuse. I also tuned the PostgreSQL and S3 retrieval paths to cut policy lookup time.',
    go: { id: 'work', label: 'Open the case study' },
  },
  {
    id: 'frontend',
    keys: ['react', 'next', 'typescript', 'frontend', 'front end', 'ui', 'tailwind', 'javascript', 'component'],
    text:
      'TypeScript, React and Next.js. On the platform I refactored SSE streaming across 16 React components and roughly 10,000 lines to eliminate dropped-token and reconnect failures. This site is Next.js, exported as static files.',
    go: { id: 'skills', label: 'What I work with' },
  },
  {
    id: 'testing',
    keys: ['test', 'pytest', 'playwright', 'ci', 'regression', 'quality', 'e2e', 'end to end', 'end-to-end', 'merge request', 'pipeline'],
    text:
      'I wrote the end-to-end test framework for the platform: auth flow, SSE stream validation and semantic response matching, gated as a CI merge-request check. No production regressions since it went in. pytest and Playwright underneath.',
    go: { id: 'skills', label: 'What I work with' },
  },
  {
    id: 'security',
    keys: ['security', 'hipaa', 'fips', 'compliance', 'phi', 'redact', 'clamav', 'oauth', 'tls', 'sast', 'sonar', 'secure', 'audit'],
    text:
      'The platform cleared HIPAA and FIPS security review with zero critical findings: PHI redaction at the model boundary, ClamAV scanning, SHA-256 integrity checks, OAuth, TLS and CA validation, and every static analysis finding remediated before sign-off.',
    go: { id: 'about', label: 'More about me' },
  },
  {
    id: 'observability',
    keys: ['observab', 'monitor', 'opentelemetry', 'otel', 'prometheus', 'langfuse', 'structlog', 'logging', 'logs', 'metrics', 'tracing', 'latency'],
    text:
      'Every model call carries OpenTelemetry, Prometheus and Langfuse instrumentation, so latency, token cost and retrieval quality are per-request facts rather than guesses. Logs go through structlog.',
  },
  {
    id: 'internal-tools',
    keys: ['support', 'ticket', 'internal', 'health check', 'issue report', 'tooling', 'reporting'],
    text:
      'I built 20+ internal APIs and tools for automated issue reporting and platform health checks, which cut support ticket volume by roughly 40%.',
    go: { id: 'about', label: 'More about me' },
  },
  {
    id: 'releases',
    keys: ['release', 'deploy', 'production', 'ship', 'sprint', 'review', 'mentor', 'design doc', 'team', 'lead', 'responsib', 'incident', 'triage', 'week'],
    text:
      'I carry releases from development through to production on a sprint cadence, and absorb the defect and security fixes each release surfaces. A good share of my week goes on code review, unblocking the team, and writing the design documents the work gets built from.',
    go: { id: 'about', label: 'More about me' },
  },
  {
    id: 'rpa',
    keys: ['rpa', 'uipath', 'automation', 'analyst', 'orchestrator', '2023', '2024', 'jira', 'azure devops', 'first year', 'started'],
    text:
      'From October 2023 to October 2024 I was a Data Analyst on an RPA automation programme: monitoring and validating UiPath automations through Orchestrator on a programme saving over 69,000 manual hours a year, writing the SQL and test plans that checked each workflow against source data, and moving project tracking from JIRA to Azure DevOps.',
    go: { id: 'about', label: 'More about me' },
  },
  {
    id: 'python',
    keys: ['python', 'flask', 'pydantic'],
    text:
      'Python since day one at Deloitte, including in periods when the role called for less of it. FastAPI, Flask and Pydantic on the service side; pytest for the tests.',
    go: { id: 'skills', label: 'What I work with' },
  },
  {
    id: 'cloud',
    keys: ['cloud', 'aws', 'docker', 'openshift', 'kubernetes', 'k8s', 'lambda', 'ec2', 'iam', 's3', 'gitlab', 'devops', 'infra'],
    text:
      'AWS: Bedrock, S3, Lambda, EC2 and IAM. Docker and Red Hat OpenShift for running things, GitLab CI/CD and Azure DevOps for shipping them. Kubernetes through OpenShift.',
    go: { id: 'skills', label: 'What I work with' },
  },
  {
    id: 'ai-tools',
    keys: ['claude', 'copilot', 'ai native', 'ai-native', 'coding assistant', 'cursor', 'agent-generated', 'vibe'],
    text:
      'Claude Code and GitHub Copilot day to day, and reviewing agent-generated code before it goes anywhere near a merge. The tooling changes the pace, not the bar.',
  },
  {
    id: 'earlier',
    keys: ['internship', 'intern', 'komatsu', 'indian oil', 'iocl', 'ksac', 'before deloitte', 'earlier', 'previous', 'history', 'background'],
    text:
      'Before Deloitte: internships at Komatsu in June 2022 and Indian Oil Corporation in May 2022, and KSAC from 2020 to 2023 during the degree.',
    go: { id: 'about', label: 'More about me' },
  },
  {
    id: 'side',
    keys: ['side project', 'pitstop', 'heat', 'sapr', 'valo', 'tourney', 'gta', 'roleplay', 'gaming', 'game', 'firebase', 'hobby', 'fun', 'personal project'],
    text:
      'Four live sites for a GTA V roleplay community: PitStop, HEAT, SAPR and Valo Tourney. React and Firebase. They sit in the side projects list, and the gaming profiles are in the connect section.',
    go: { id: 'side', label: 'See the side projects' },
  },
  {
    id: 'location',
    keys: ['where', 'based', 'location', 'city', 'live', 'hyderabad', 'india', 'country', 'timezone', 'time zone', 'remote', 'relocat'],
    text: 'Hyderabad, Telangana, India.',
    go: { id: 'connect', label: 'Get in touch' },
  },
  {
    id: 'age',
    keys: ['age', 'old', 'born', 'birthday'],
    text: '25.',
  },
  {
    id: 'name',
    keys: ['who are you', 'your name', 'who is', 'about you', 'yourself', 'introduce', 'intro'],
    text:
      'Anubhav Kumar. AI and full stack engineer at Deloitte, working on GenAI platform engineering: retrieval, agents, and the streaming backends under them.',
    go: { id: 'about', label: 'More about me' },
  },
  {
    id: 'reach',
    chip: 'How do I reach you?',
    keys: ['reach', 'contact', 'email', 'mail', 'linkedin', 'phone', 'number', 'call', 'whatsapp', 'text', 'connect', 'hire', 'hiring', 'available', 'open to', 'freelance', 'contract', 'opportunit', 'talk', 'social', 'github'],
    text: () =>
      `Email is the fastest route: ${profile.email}. LinkedIn: linkedin.com/in/anubhavkumaar. The rest of the profiles are in the connect section.`,
    go: { id: 'connect', label: 'Get in touch' },
  },
  {
    id: 'resume',
    keys: ['resume', 'cv', 'download', 'pdf'],
    text: () =>
      `No download. The site is the resume: the work, the skills, the about section, and ${profile.email} for anything else.`,
    go: { id: 'work', label: 'Open the work' },
  },
  {
    id: 'salary',
    keys: ['salary', 'compensation', 'ctc', 'pay', 'rate', 'expect'],
    text: () => `Not something I put on a website. Email me at ${profile.email} and we can talk.`,
    go: { id: 'connect', label: 'Get in touch' },
  },
  {
    id: 'site',
    keys: ['this site', 'website', 'portfolio', 'built with', 'how did you build', 'console', 'bot', 'are you a model', 'are you ai', 'are you an ai', 'an ai', 'real person', 'human', 'chatgpt', 'llm'],
    text:
      'Next.js, exported as static files, no tracking. This console is a keyword map over my profile, not a model: nothing you type leaves the browser.',
  },
  {
    id: 'greeting',
    keys: ['hi', 'hello', 'hey', 'yo', 'sup', 'good morning', 'good evening'],
    text: 'Hi. Ask me about the work, the stack, experience, education, or how to reach me.',
  },
  {
    id: 'thanks',
    keys: ['thanks', 'thank you', 'cheers', 'great', 'cool', 'nice'],
    text: 'Any time.',
  },
];

export const FALLBACK: Answer = {
  id: 'fallback',
  keys: [],
  text:
    'Nothing scripted for that one. Ask about experience, education, the stack, the work, awards, where I am, or how to reach me.',
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Best-scoring entry for a question, or the fallback when nothing matches. */
export function resolve(question: string): Answer {
  const q = question.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ');
  let best: Answer | null = null;
  let bestScore = 0;
  for (const a of answers) {
    let score = 0;
    for (const k of a.keys) {
      // A key must start a word. Short keys must also end one, so "ci" never
      // hits "city"; longer keys may stem, so "test" hits "testing".
      const tail = k.length <= 3 ? '(?![a-z0-9])' : '';
      const re = new RegExp(`(^|[^a-z0-9])${escape(k)}${tail}`, 'i');
      if (re.test(q)) score += k.includes(' ') ? 2 : 1;
    }
    if (score > bestScore || (score === bestScore && score > 0 && best?.general && !a.general)) {
      best = a;
      bestScore = score;
    }
  }
  if (best) return best;
  // Nothing specific matched, but the question is plainly about him: give the
  // overview rather than a shrug.
  if (/(^|[^a-z])(he|his|him|you|your|anubhav|yourself)([^a-z]|$)/.test(q)) {
    return answers.find((a) => a.id === 'summary') ?? FALLBACK;
  }
  return FALLBACK;
}

export const answerText = (a: Answer) => (typeof a.text === 'function' ? a.text() : a.text);
const CHIP_ORDER = ['build', 'experience', 'stack', 'education', 'reach'];
export const chips = CHIP_ORDER.map((id) => answers.find((a) => a.id === id)!).map((a) => ({ id: a.id, label: a.chip as string }));
