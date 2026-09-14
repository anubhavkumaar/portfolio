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
          'I built the whole pipeline by hand first: chunking, embeddings, vector search, ranking. Not because it was the right long term choice, but because I wanted to watch it fail against my own instrumentation before handing the problem to a managed service. Then I moved it onto AWS Bedrock Knowledge Bases with S3 document ingestion, query routing and citation extraction.',
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
    slug: 'backend',
    word: 'PLATFORM',
    tag: 'FastAPI',
    year: '2025',
    title: 'One backend, several tenants',
    lede:
      'One codebase serves several customers, each with their own extensions on top. The backend is built so that seam is real instead of implied.',
    beats: [
      {
        label: 'problem',
        body:
          'Every customer runs the same codebase with their own extensions on top. Without a clean seam for that, customer specific behaviour lands in places that belong to everyone, and each new customer makes the shared paths harder to change.',
      },
      {
        label: 'constraint',
        body:
          'The portals are live services, so there is no window where the platform can simply stop. One customer\'s extensions must not become visible to another. And streaming responses mean the request path cannot be quietly rebuilt underneath the part users actually watch.',
      },
      {
        label: 'decision',
        body:
          'I built the services around a defined extension seam: streaming FastAPI over server sent events, a PostgreSQL schema written with psycopg3 rather than an ORM so the queries stay legible, and Redis semantic caching in front of model calls. Every model call carries OpenTelemetry, Prometheus and Langfuse instrumentation, so latency, token cost and retrieval quality are per request facts rather than guesses.',
      },
      {
        label: 'cost',
        body:
          'A stricter contract for anyone adding customer specific behaviour, and instrumentation that has to be kept honest as the services change. What it buys is onboarding a customer without editing shared paths, and being able to answer why a request was slow instead of speculating.',
      },
    ],
    stack: ['FastAPI', 'PostgreSQL', 'psycopg3', 'Redis', 'OpenTelemetry', 'Prometheus'],
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
