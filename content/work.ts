// Case studies. Each answers four beats: problem, constraint, decision, cost.
// If a project cannot answer all four it does not go on the site.
//
// Confidentiality: the platform is an internal Deloitte product licensed to
// external customers. Describe capability, decisions and tradeoffs only. No
// architecture diagrams, no client or customer-category names, no product
// screenshots, no backend system names, no uncleared metrics.

export type Beat = {
  label: 'problem' | 'constraint' | 'decision' | 'cost';
  body: string;
};

export type CaseStudy = {
  slug: string;
  /** Display word in the hero index. One word, carries the largest type on the site. */
  word: string;
  /** Margin annotation. The primary technology, so the index is scannable. */
  tag: string;
  year: string;
  title: string;
  lede: string;
  beats: Beat[];
  stack: string[];
  /** Set when the copy is reconstructed rather than confirmed by Anubhav. */
  needsReview?: string;
  /** False keeps the entry as product truth without listing it on the page. */
  listed?: boolean;
};

export const work: CaseStudy[] = [
  {
    slug: 'retrieval-layer',
    word: 'RETRIEVAL',
    tag: 'Bedrock',
    year: '2024',
    title: 'Retrieval layer, built twice',
    lede:
      'The platform answers policy questions with citations. I built the retrieval behind it twice, and the second one was only right because the first one was mine.',
    beats: [
      {
        label: 'problem',
        body:
          'Users needed answers out of a large policy corpus, with citations they could open and check. A wrong answer delivered in a confident tone is worse than no answer, so retrieval had to be inspectable, not just accurate on average.',
      },
      {
        label: 'constraint',
        body:
          'Retrieval failure modes are invisible from outside the system. You see a bad answer, not the chunk boundary that split a rule in half, or the embedding that filed two unrelated clauses next to each other. Protected health information could not cross the model boundary either, which ruled out shipping raw documents somewhere convenient to debug them.',
      },
      {
        label: 'decision',
        body:
          'I built the whole pipeline by hand first: chunking, embeddings, vector search, ranking. Not because it was the right long term choice, but because I wanted to watch it fail against my own instrumentation before handing the problem to a managed service. Then I moved it onto AWS Bedrock Knowledge Bases with S3 document ingestion, query routing and citation extraction, and built a RAG file management system on top: the S3 documents and their ingest jobs, the list of what is indexed, and deleting from it.',
      },
      {
        label: 'cost',
        body:
          'The rewrite cost what a rewrite costs. It bought back ingestion and citation extraction I no longer maintain, and a retrieval path I can still reason about when it returns the wrong thing. Policy lookup time dropped. I would not have known which knobs mattered on the managed version without having built the manual one.',
      },
    ],
    stack: ['Python', 'AWS Bedrock Knowledge Bases', 'S3', 'PostgreSQL', 'psycopg3'],
  },

  {
    slug: 'agent-layer',
    word: 'AGENTS',
    tag: 'MCP',
    year: '2025',
    title: 'Agents over four backends',
    lede:
      'The chatbot could answer from documents. It could not do anything. The answer was not one bigger agent but several small ones, each owning one kind of action, over a tool layer that decides how much of four enterprise backends a model gets to touch.',
    beats: [
      {
        label: 'problem',
        body:
          'Retrieval answers questions. It does not file a ticket, look up a record, read a log, or check whether a pod is healthy. The platform needed the model to act on four enterprise backends, not just read about them, and no single agent should hold every tool.',
      },
      {
        label: 'constraint',
        body:
          'Each backend has its own auth and its own idea of what a record is. None of them were built expecting a language model to call them. The model also could not be handed credentials or protected health information, which rules out the obvious approach of giving it an HTTP client and a set of API docs.',
      },
      {
        label: 'decision',
        body:
          'A multi-agent system rather than one agent with every tool: a RAG agent for document questions, portal tools agents for actions inside the product, a ticket agent, a log agent, and a pod agent for the runtime on OpenShift, with an orchestrator routing each request to the agent that owns it. Underneath, each backend is exposed through a Model Context Protocol server, built with FastMCP, with a deliberately narrow tool surface. Each tool takes typed arguments, does its own auth, and redacts at the boundary before anything returns. An agent gets a menu, not a network. Every agent step and tool call is traced in Langfuse, so a wrong answer can be walked back to the step that produced it.',
      },
      {
        label: 'cost',
        body:
          'More moving parts: several agents and a tool layer to maintain, and a narrow surface means some requests fail that a wider one would have served. In exchange each agent can reach only what it was given, and the model cannot reach anything I have not explicitly exposed. That property is most of the reason the security review went the way it did.',
      },
    ],
    stack: ['Multi-agent orchestration', 'Model Context Protocol', 'FastMCP', 'Langfuse', 'Python', 'AWS Bedrock'],
  },

  {
    slug: 'release-gate',
    word: 'RELEASE',
    tag: 'CI',
    year: '2026',
    title: 'Tests at the merge, releases on a cadence',
    lede:
      'A generative platform fails in ways unit tests do not see: a stream that drops a token, an answer that is right but worded differently, a response that quietly gets slower. I wrote the end-to-end framework that drives the real deployed app like a user would and checks for those on every merge request, and I carry what passes it into production.',
    beats: [
      {
        label: 'problem',
        body:
          'The platform streams answers over server-sent events, and the answers are generated. A unit test can prove a function returns. It cannot prove that a session survives the auth flow, that a stream arrives whole, or that an answer still means what it meant last week. Those are the failures that matter, and nothing at the merge was checking for them.',
      },
      {
        label: 'constraint',
        body:
          'The checks have to run on every merge request without becoming the reason merges are slow. They have to run against the real stack, deployed and live, auth and streaming and model included, or they prove nothing. And a generated answer cannot be compared to a fixed string: two correct answers rarely share their words, and an answer built from live data changes with the data behind it, so meaning alone will not catch a wrong number.',
      },
      {
        label: 'decision',
        body:
          'An end-to-end framework in pytest and Playwright that runs against the real deployed environment: it drives the UI the way a visitor would, signs in, opens the chat, asks it something, and reads the SSE stream back, checking the auth flow holds, the stream arrives whole, and timing it, time to first event and total response time, so a regression shows up as a number, not a feeling. The answer itself gets one of two checks depending on what it is: semantic matching scores an ordinary answer against its expected meaning rather than its exact words, and for an answer built from live, changing data, keyword checking looks for the facts that have to be there instead, since two correct answers over different data will never share their words either. It runs as a CI merge-request check in GitLab, so a change that breaks any of it cannot merge. What passes moves from development to production on a sprint cadence, and I carry those releases, absorbing the defect and security fixes each one surfaces.',
      },
      {
        label: 'cost',
        body:
          'Merges take as long as a real end-to-end run, and the suite needs tending, because a flaky check is worse than no check. What it bought is the only number that matters here: no production regressions since it went in.',
      },
    ],
    stack: ['pytest', 'Playwright', 'GitLab CI/CD', 'Server-sent events', 'Docker', 'Red Hat OpenShift'],
  },

  {
    slug: 'security-review',
    word: 'SECURITY',
    tag: 'HIPAA',
    listed: false,
    year: '2025',
    title: 'HIPAA and FIPS, zero critical findings',
    lede:
      'The platform handles protected health information, so it clears review before it ships. A generative model is a boundary the existing controls were not written for.',
    beats: [
      {
        label: 'problem',
        body:
          'The platform handles protected health information. It does not ship without clearing HIPAA and FIPS review, and a single finding rated critical means it does not ship at all.',
      },
      {
        label: 'constraint',
        body:
          'The controls have to hold without making the product unusable. Every check added at the model boundary is latency a user waits through. The review process also assumes conventional software, and a component that takes free text and returns free text is a class of boundary the existing controls did not describe.',
      },
      {
        label: 'decision',
        body:
          'I enforced redaction at the model boundary rather than downstream, so sensitive data does not reach the model in the first place. Uploads get malware scanned and integrity checked with SHA-256. Auth runs through OAuth with TLS and certificate authority validation. On static analysis findings I remediated every one before sign off instead of arguing severity, because arguing costs more review cycles than fixing.',
      },
      {
        label: 'cost',
        body:
          'Latency at the boundary, and engineering time that produced no features. It cleared with zero critical findings and no second review cycle, which is the only outcome that was worth anything.',
      },
    ],
    stack: ['OAuth', 'TLS', 'ClamAV', 'SHA-256', 'SAST', 'SonarQube'],
  },
];

export const workBySlug = (slug: string) => work.find((w) => w.slug === slug);
