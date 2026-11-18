/**
 * Portfolio content for the redesign: the 20 projects behind the work drawer,
 * freestyle view, index and case studies. Copy is taken verbatim from the
 * design file (CaseStudy.dc.html). Work projects stay generic on purpose:
 * no client, system or host names, no real schemas, no uncleared metrics.
 *
 * content/work.ts keeps the long-form write-ups; it is separate.
 */

export type Kind = 'agent' | 'flow' | 'cinema' | 'browser';
export type Layout = 'stacked' | 'split' | 'full';
export type Group =
  | 'Agents'
  | 'Retrieval and Search'
  | 'Backend and Data'
  | 'Frontend'
  | 'Quality and Delivery'
  | 'Automation'
  | 'Side Builds';

export type Project = {
  id: string;
  title: string;
  group: Group;
  year: string;
  kind: Kind;
  layout: Layout;
  cover: string;
  lede: string;
  /** Label and text pairs shown as the case study columns. */
  blocks: [label: string, text: string][];
  stack: string[];
  /** Flow kind: the steps, and the index of the highlighted one. */
  steps?: string[];
  hot?: number;
  /** Browser kind: the live site. */
  live?: string;
};

export const ORDER = [
  'agent', 'mcp', 'logs', 'tickets', 'retrieval', 'multimodal', 'stream', 'portal', 'harness', 'releases',
  'obs', 'rpa', 'academy', 'jobradar', 'shorts', 'site', 'pitstop', 'heat', 'sapr', 'valo',
] as const;

export type ProjectId = (typeof ORDER)[number];

export const PROJECTS: Record<ProjectId, Project> = {
  agent: {
    id: 'agent',
    title: 'Agent backend',
    group: 'Agents',
    year: '2026',
    kind: 'agent',
    layout: 'stacked',
    cover: '/redesign/covers/agent.jpg',
    lede: 'A supervisor plans each request and hands it to the right specialist.',
    blocks: [
      ['PROBLEM', 'One chat had to answer very different questions: knowledge lookups, operational checks and service requests, each needing different tools.'],
      ['APPROACH', 'A supervisor reads each request, plans the steps and routes them to the right specialist agent instead of one prompt doing everything.'],
      ['TOOLS', 'Specialists never touch systems directly. They call tools exposed through MCP servers, so each integration is added, tested and permissioned once.'],
      ['OUTCOME', 'New capabilities plug in as a specialist or a tool without reworking the rest, and answers stream back as they form.'],
    ],
    stack: ['Python', 'FastAPI', 'LangGraph', 'MCP', 'AWS Bedrock'],
  },
  mcp: {
    id: 'mcp',
    title: 'MCP tool layer',
    group: 'Agents',
    year: '2026',
    kind: 'flow',
    layout: 'stacked',
    cover: '/redesign/covers/mcp.jpg',
    steps: ['agent', 'MCP client', 'tool server', 'business system'],
    hot: 2,
    lede: 'One protocol, many tools, every agent.',
    blocks: [
      ['WHAT', 'A shared tool layer built on the Model Context Protocol.'],
      ['HOW', 'Each integration is its own MCP server, so any agent can discover and call it through the same contract.'],
      ['OUTCOME', 'New agents get existing tools for free, and access rules live in one place.'],
    ],
    stack: ['Python', 'FastMCP', 'LangChain', 'MCP'],
  },
  logs: {
    id: 'logs',
    title: 'Network log agent',
    group: 'Agents',
    year: '2026',
    kind: 'flow',
    layout: 'stacked',
    cover: '/redesign/covers/logs.jpg',
    steps: ['question', 'draft search', 'guard', 'log platform', 'answer'],
    hot: 2,
    lede: 'Plain-English questions over network logs, with a guard on every search.',
    blocks: [
      ['WHAT', 'Operations teams ask about network traffic in plain language.'],
      ['HOW', 'The agent drafts the search, and a deterministic guard checks it before anything runs.'],
      ['OUTCOME', 'Every answer shows how it was found and says plainly when results are partial.'],
    ],
    stack: ['Python', 'LangGraph', 'MCP'],
  },
  tickets: {
    id: 'tickets',
    title: 'Tickets in chat',
    group: 'Agents',
    year: '2026',
    kind: 'flow',
    layout: 'stacked',
    cover: '/redesign/covers/tickets.jpg',
    steps: ['chat', 'access check', 'ticket', 'queue'],
    hot: 1,
    lede: 'See and raise IT tickets without leaving the conversation.',
    blocks: [
      ['WHAT', 'Approvers check their tickets and raise new ones from the chat.'],
      ['HOW', 'An agent reaches the ticketing system through tools, and role-based access decides what each person sees.'],
      ['OUTCOME', 'Live on several customer portals, saving approvers real time every day (a team estimate).'],
    ],
    stack: ['Python', 'FastAPI', 'MCP', 'React'],
  },
  retrieval: {
    id: 'retrieval',
    title: 'Retrieval layer',
    group: 'Retrieval and Search',
    year: '2025',
    kind: 'flow',
    layout: 'stacked',
    cover: '/redesign/covers/retrieval.jpg',
    steps: ['documents', 'chunks', 'vectors', 'top matches', 'cited answer'],
    hot: 4,
    lede: 'The search layer behind every answer, built to cite or stay quiet.',
    blocks: [
      ['WHAT', 'Retrieval that grounds the chat in real documents.'],
      ['HOW', 'Prototyped from scratch first to learn where retrieval breaks, then moved to managed knowledge bases with query routing and citations.'],
      ['OUTCOME', 'Answers may only cite evidence the search actually returned.'],
    ],
    stack: ['Python', 'FAISS', 'AWS Bedrock', 'S3'],
  },
  multimodal: {
    id: 'multimodal',
    title: 'Multimodal search',
    group: 'Retrieval and Search',
    year: '2026',
    kind: 'flow',
    layout: 'stacked',
    cover: '/redesign/covers/multimodal.jpg',
    steps: ['PDF', 'slides', 'video', 'one index', 'search'],
    hot: 3,
    lede: 'One search across documents, slides and video.',
    blocks: [
      ['WHAT', 'A single search over every kind of file people actually share.'],
      ['HOW', 'Video is split by scene, with speech and on-screen text indexed beside pages and slides, then exposed as a tool agents can call.'],
      ['OUTCOME', 'A smaller, faster model matched the larger one in testing, so the fast one ships.'],
    ],
    stack: ['Python', 'Docling', 'AWS Bedrock', 'MCP'],
  },
  stream: {
    id: 'stream',
    title: 'Chat backend',
    group: 'Backend and Data',
    year: '2026',
    kind: 'cinema',
    layout: 'full',
    cover: '/redesign/covers/stream.jpg',
    lede: 'Answers that start arriving the moment they exist.',
    blocks: [
      ['WHAT', 'The services that stream chat answers and keep history.'],
      ['HOW', 'FastAPI with server-sent events, PostgreSQL for history and per-user semantic caching.'],
      ['OUTCOME', 'Fast first tokens, and repeat questions come straight from cache.'],
    ],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis'],
  },
  portal: {
    id: 'portal',
    title: 'Portal and chat UI',
    group: 'Frontend',
    year: '2026',
    kind: 'cinema',
    layout: 'full',
    cover: '/redesign/covers/portal.jpg',
    lede: 'The chat people use, with sources they can check.',
    blocks: [
      ['WHAT', 'Chat, dashboards and document views for the platform.'],
      ['HOW', 'React, Next.js and TypeScript, with a backend-for-frontend so no service address or key reaches the browser.'],
      ['OUTCOME', 'Streamed answers with source cards beside them.'],
    ],
    stack: ['React', 'Next.js', 'TypeScript'],
  },
  harness: {
    id: 'harness',
    title: 'Test harness',
    group: 'Quality and Delivery',
    year: '2026',
    kind: 'flow',
    layout: 'stacked',
    cover: '/redesign/covers/harness.jpg',
    steps: ['merge request', 'end-to-end checks', 'answer match', 'gate'],
    hot: 3,
    lede: 'Nothing merges until the chat still works end to end.',
    blocks: [
      ['WHAT', 'An end-to-end suite that gates every merge.'],
      ['HOW', 'Playwright scenarios across the chat portals: sign-in, streaming and semantic matching of answers, run in CI.'],
      ['OUTCOME', 'Part of a rewrite that multiplied automated test coverage.'],
    ],
    stack: ['Playwright', 'TypeScript', 'GitLab CI'],
  },
  releases: {
    id: 'releases',
    title: 'Releases',
    group: 'Quality and Delivery',
    year: '2026',
    kind: 'cinema',
    layout: 'full',
    cover: '/redesign/covers/releases.jpg',
    lede: 'Parallel release lines, shipped on a steady beat.',
    blocks: [
      ['WHAT', 'Release management across many repositories and parallel release lines.'],
      ['HOW', 'CI/CD pipelines, first-line review on merge requests and checks built into every release.'],
      ['OUTCOME', 'Predictable releases instead of release-day surprises.'],
    ],
    stack: ['GitLab CI', 'Docker'],
  },
  obs: {
    id: 'obs',
    title: 'Observability',
    group: 'Backend and Data',
    year: '2025',
    kind: 'cinema',
    layout: 'full',
    cover: '/redesign/covers/obs.jpg',
    lede: 'Every model call traced, timed and costed.',
    blocks: [
      ['WHAT', 'Visibility into what each model call does.'],
      ['HOW', 'Tracing, metrics and cost tracking on every call.'],
      ['OUTCOME', 'Slow or expensive calls are easy to find and fix.'],
    ],
    stack: ['OpenTelemetry', 'Prometheus', 'Langfuse'],
  },
  rpa: {
    id: 'rpa',
    title: 'RPA validation',
    group: 'Automation',
    year: '2024',
    kind: 'cinema',
    layout: 'full',
    cover: '/redesign/covers/rpa.jpg',
    lede: 'Checking the bots before their numbers reach anyone.',
    blocks: [
      ['WHAT', 'Validation for a large automation programme.'],
      ['HOW', 'Monitored the bots and wrote the SQL and test plans that checked each workflow against source data.'],
      ['OUTCOME', 'Bad runs caught before they reached reports.'],
    ],
    stack: ['UiPath', 'SQL'],
  },
  academy: {
    id: 'academy',
    title: 'AI Academy capstone',
    group: 'Automation',
    year: '2023',
    kind: 'cinema',
    layout: 'full',
    cover: '/redesign/covers/academy.jpg',
    lede: 'Where the machine learning started.',
    blocks: [
      ['WHAT', 'Capstone for an internal AI academy.'],
      ['HOW', 'Trained and compared predictive models on a vehicle insurance dataset in the cloud.'],
      ['OUTCOME', 'A solid grounding in ML before moving to GenAI.'],
    ],
    stack: ['Python', 'SQL', 'AWS SageMaker'],
  },
  jobradar: {
    id: 'jobradar',
    title: 'Job radar',
    group: 'Automation',
    year: '2026',
    kind: 'cinema',
    layout: 'full',
    cover: '/redesign/covers/jobradar.jpg',
    lede: 'My own morning scout for roles worth applying to.',
    blocks: [
      ['WHAT', 'A personal job search pipeline.'],
      ['HOW', 'Every morning it checks company career sites and job boards across my target regions, scores each role against my resume and posts good fits to Discord.'],
      ['OUTCOME', 'A short ranked list instead of endless scrolling.'],
    ],
    stack: ['Python', 'Scheduled agents', 'Discord'],
  },
  shorts: {
    id: 'shorts',
    title: 'Shorts producer',
    group: 'Automation',
    year: '2026',
    kind: 'cinema',
    layout: 'full',
    cover: '/redesign/covers/shorts.jpg',
    lede: 'Long footage in, vertical Shorts out.',
    blocks: [
      ['WHAT', 'Turns long gameplay recordings into vertical Shorts.'],
      ['HOW', 'Audio peaks find the moments, contact sheets help pick them, and ffmpeg reframes them to vertical.'],
      ['OUTCOME', 'Daily Shorts from footage I already have.'],
    ],
    stack: ['Python', 'ffmpeg'],
  },
  site: {
    id: 'site',
    title: 'This site',
    group: 'Side Builds',
    year: '2026',
    kind: 'cinema',
    layout: 'full',
    cover: '/redesign/covers/site.jpg',
    lede: 'A portfolio you can ask questions.',
    blocks: [
      ['WHAT', 'This portfolio and its "ask anubhav" chat.'],
      ['HOW', 'A chatbot that answers from my own content and remembers the conversation.'],
      ['OUTCOME', 'Visitors ask instead of hunting through pages.'],
    ],
    stack: ['React', 'Next.js'],
  },
  pitstop: {
    id: 'pitstop',
    title: 'PitStop',
    group: 'Side Builds',
    year: '2025',
    kind: 'browser',
    layout: 'split',
    cover: '/redesign/covers/pitstop.jpg',
    live: 'https://pitstop-services.web.app',
    lede: 'An auto shop, run properly, for a GTA roleplay crew.',
    blocks: [
      ['WHAT', 'An auto services site for a GTA V roleplay community.'],
      ['HOW', 'Bookings, job logs and crew management.'],
      ['OUTCOME', 'Live and used by the crew.'],
    ],
    stack: ['React', 'Firebase'],
  },
  heat: {
    id: 'heat',
    title: 'HEAT',
    group: 'Side Builds',
    year: '2025',
    kind: 'browser',
    layout: 'split',
    cover: '/redesign/covers/heat.jpg',
    live: 'https://sasp-heat.web.app',
    lede: 'A handbook for a roleplay highway unit.',
    blocks: [
      ['WHAT', 'A site for a highway enforcement unit in roleplay.'],
      ['HOW', 'Procedures, roles and vehicle specs in one place.'],
      ['OUTCOME', 'New members get up to speed without asking around.'],
    ],
    stack: ['Firebase'],
  },
  sapr: {
    id: 'sapr',
    title: 'SAPR',
    group: 'Side Builds',
    year: '2025',
    kind: 'browser',
    layout: 'split',
    cover: '/redesign/covers/sapr.jpg',
    live: 'https://saspsapr.web.app',
    lede: 'The park rangers department, organised.',
    blocks: [
      ['WHAT', 'A department site for park rangers in roleplay.'],
      ['HOW', 'Hierarchy, procedures and officer profiles with role-based access.'],
      ['OUTCOME', 'One source of truth for the whole department.'],
    ],
    stack: ['Firebase'],
  },
  valo: {
    id: 'valo',
    title: 'Valo Tourney',
    group: 'Side Builds',
    year: '2024',
    kind: 'browser',
    layout: 'split',
    cover: '/redesign/covers/valo.jpg',
    live: 'https://soulcityvalo.web.app',
    lede: 'Brackets and match tracking for community Valorant.',
    blocks: [
      ['WHAT', 'A Valorant tournament site.'],
      ['HOW', 'Brackets, match tracking and registration.'],
      ['OUTCOME', 'Ran community tournaments end to end.'],
    ],
    stack: ['Firebase'],
  },
};

/** Projects in display order. */
export const PROJECT_LIST: Project[] = ORDER.map((id) => PROJECTS[id]);

/** Work projects (shown with the "Work project, details generalized" chip). */
export const WORK: readonly string[] = [
  'agent', 'mcp', 'logs', 'tickets', 'retrieval', 'multimodal', 'stream', 'portal', 'harness', 'releases', 'obs', 'rpa', 'academy',
];

export const isWorkProject = (id: string) => WORK.includes(id);

/** Status chip text, only where one is set. */
export const STATUS: Record<string, string> = {
  tickets: 'In production',
  rpa: 'Completed',
  academy: 'Completed',
  jobradar: 'Runs daily',
  shorts: 'Runs daily',
  site: 'Live',
  pitstop: 'Live',
  heat: 'Live',
  sapr: 'Live',
  valo: 'Live',
};

/** The small "How it flows" strip for cinema projects: steps and the highlighted index. */
export const MINI: Record<string, { steps: string[]; hot: number }> = {
  stream: { steps: ['question', 'cache', 'model', 'SSE stream', 'history'], hot: 1 },
  portal: { steps: ['browser', 'React UI', 'BFF', 'services'], hot: 2 },
  releases: { steps: ['code', 'review', 'pipeline', 'release'], hot: 2 },
  obs: { steps: ['model call', 'trace', 'cost', 'dashboard'], hot: 1 },
  rpa: { steps: ['bot run', 'monitor', 'SQL check', 'report'], hot: 2 },
  academy: { steps: ['dataset', 'features', 'train', 'compare'], hot: 2 },
  jobradar: { steps: ['job sites', 'score', 'shortlist', 'Discord'], hot: 1 },
  shorts: { steps: ['recording', 'audio peaks', 'moments', 'vertical'], hot: 1 },
  site: { steps: ['question', 'my content', 'model', 'answer'], hot: 1 },
};

/** Accent colour per group: [light, dark]. */
export const ACC: Record<Group, [light: string, dark: string]> = {
  Agents: ['#2f55e8', '#8ea2ff'],
  'Retrieval and Search': ['#0d8a82', '#5fe3d6'],
  'Backend and Data': ['#6b38d4', '#b79bff'],
  Frontend: ['#1f74d6', '#86c3ff'],
  'Quality and Delivery': ['#1f9a4a', '#7fe3a0'],
  Automation: ['#c26a0a', '#ffc56b'],
  'Side Builds': ['#d6336c', '#ff8fb1'],
};

/** Case study colour tokens, from the `t` objects in CaseStudy.dc.html. */
export const CASE_TOKENS = {
  light: {
    bg: '#f4f6fa', ink: '#0e1116', mute: '#59606b', body: '#2c323c', lede: '#1f2430', line: 'rgba(14,17,22,.1)', accent: '#2f55e8',
    plate: '#e9eef8', tag: 'rgba(14,17,22,.06)', pill: 'rgba(255,255,255,.75)', sheet: '#ffffff', glass: 'rgba(255,255,255,.72)',
    scrim: 'rgba(244,246,250,.78)', backdropOp: '.5', shadow: '0 40px 120px rgba(40,70,160,.2)',
    diagBg: '#eef2fb', diagImg: '.0', diagNode: 'rgba(255,255,255,.92)', diagLine: 'rgba(14,17,22,.2)', diagInk: '#0e1116', diagMute: '#59606b', diagChip: 'rgba(14,17,22,.07)', onAccent: '#ffffff',
    flowImg: '.9', flowVeil: 'linear-gradient(180deg, rgba(5,8,18,.2), rgba(5,8,18,.45))', flowMute: '#d5dcef', nodeBg: 'rgba(11,17,32,.62)', nodeFg: '#eef2fb', nodeLine: 'rgba(255,255,255,.28)',
    cineVeil: 'linear-gradient(90deg, rgba(244,246,250,0) 35%, rgba(244,246,250,.7) 70%, rgba(244,246,250,.92) 100%)',
  },
  dark: {
    bg: '#070b16', ink: '#e9eefb', mute: '#8e98b3', body: '#c3cbe0', lede: '#d5dcef', line: 'rgba(255,255,255,.1)', accent: '#8ea2ff',
    plate: '#0d1324', tag: 'rgba(255,255,255,.07)', pill: 'rgba(17,24,44,.66)', sheet: 'rgba(11,17,32,.9)', glass: 'rgba(11,17,32,.62)',
    scrim: 'rgba(7,11,22,.72)', backdropOp: '.55', shadow: '0 40px 120px rgba(0,0,0,.6)',
    diagBg: '#0a0f1e', diagImg: '.5', diagNode: 'rgba(14,20,38,.82)', diagLine: 'rgba(255,255,255,.22)', diagInk: '#e9eefb', diagMute: '#8e98b3', diagChip: 'rgba(255,255,255,.1)', onAccent: '#070b16',
    flowImg: '.75', flowVeil: 'linear-gradient(180deg, rgba(7,11,22,.35), rgba(7,11,22,.55))', flowMute: '#b6bfd6', nodeBg: 'rgba(11,17,32,.7)', nodeFg: '#e9eefb', nodeLine: 'rgba(255,255,255,.2)',
    cineVeil: 'linear-gradient(90deg, rgba(7,11,22,0) 30%, rgba(7,11,22,.75) 70%, rgba(7,11,22,.92) 100%)',
  },
} as const;
