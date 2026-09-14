'use client';

// Simulated models of what the Deloitte platform does. The product is internal,
// so there is no screenshot to show; each demo runs a small loop of the
// behaviour, built from SmoothUI's AI primitives (components/smoothui/*).
// All content here is illustrative and labelled as simulated on the page.

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import AIResponse from '@/components/smoothui/ai-response';
import AITaskList, { type AITask, type AITaskStatus } from '@/components/smoothui/ai-task-list';
import AIToolCall, { type AIToolCallStatus } from '@/components/smoothui/ai-tool-call';

// ─── Demo clock ───────────────────────────────────────────────────────────────
// Ticks `step` 0 → steps while the element is on screen, holds on the final
// frame, then restarts. Reduced motion: sit on the final frame, no loop.
function useDemoClock(
  ref: React.RefObject<Element>,
  steps: number,
  { tick = 900, hold = 2800, start = 700 }: { tick?: number; hold?: number; start?: number } = {},
) {
  const inView = useInView(ref, { amount: 0.5 });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) { setStep(steps); return; }
    if (!inView) return;
    const delay = step === 0 ? start : step >= steps ? hold : tick;
    const t = setTimeout(() => setStep((s) => (s >= steps ? 0 : s + 1)), delay);
    return () => clearTimeout(t);
  }, [inView, reduced, step, steps, tick, hold, start]);

  return step;
}

const statusAt = (idx: number, step: number): AITaskStatus =>
  idx < step ? 'done' : idx === step ? 'running' : 'pending';

// ─── 05 · DeepChat, policy Q&A with citations ────────────────────────────────
const QUESTION = 'How many unused leave days carry over?';
const ANSWER =
  "Up to 10 unused days carry over [1], provided they're used by 31 March. Anything beyond that lapses [2], and the updated balance shows in the leave portal within two working days.";
const ANSWER_WORDS = ANSWER.split(' ');
// Internal documents, no URL on purpose, so the pills render as plain markers.
const CITATIONS = [
  { id: 'leave-4-1', index: 1, title: 'Leave policy, section 4.1, carry-over' },
  { id: 'hr-faq', index: 2, title: 'HR FAQ, leave balances' },
];

export function DeepChatDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useDemoClock(ref, ANSWER_WORDS.length, { tick: 75, hold: 3600, start: 900 });
  const text = ANSWER_WORDS.slice(0, step).join(' ');

  return (
    <div ref={ref} className="w-full">
      <p className="mb-3 flex items-start gap-2 text-[13px] leading-snug text-muted-foreground">
        <span aria-hidden="true" className="mt-[3px] text-[10px] text-primary">▶</span>
        {QUESTION}
      </p>
      <AIResponse
        text={text}
        citations={CITATIONS}
        isStreaming={step < ANSWER_WORDS.length}
        className="text-[13px]"
      />
    </div>
  );
}

// ─── 06 · Agentic Assistant, a plan working itself through ───────────────────
// Leaf order is the execution order; the parent step derives from its children.
const LEAVES = ['parse', 'search', 'rank', 'draft', 'guard', 'cite'] as const;

export function AgentPlanDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useDemoClock(ref, LEAVES.length, { tick: 850, hold: 2600 });
  const at = (id: (typeof LEAVES)[number]) => statusAt(LEAVES.indexOf(id), step);

  const search = at('search');
  const rank = at('rank');
  const kb: AITaskStatus =
    rank === 'done' ? 'done' : search === 'pending' ? 'pending' : 'running';

  const tasks: AITask[] = [
    { id: 'parse', label: 'Route to an agent, pick tools', status: at('parse') },
    {
      id: 'kb',
      label: 'Query knowledge base',
      status: kb,
      children: [
        { id: 'search', label: 'Search policy index', note: search === 'pending' ? undefined : '12 hits', status: search },
        { id: 'rank', label: 'Rerank chunks', note: rank === 'done' ? '12/12' : undefined, status: rank },
      ],
    },
    { id: 'draft', label: 'Draft response', status: at('draft') },
    { id: 'guard', label: 'Check guardrails', status: at('guard') },
    { id: 'cite', label: 'Return with citations', status: at('cite') },
  ];

  return (
    <div ref={ref} className="w-full">
      <AITaskList label="Plan" tasks={tasks} className="text-[13px]" />
    </div>
  );
}

// ─── 07 · RAG Platform, the retrieval pipeline as tool calls ─────────────────
const TOOLS = [
  { name: 'ingest_documents', summary: '1,240 chunks' },
  { name: 'embed_chunks', summary: '1536-d' },
  { name: 'vector_search', summary: 'top 5, 38 ms' },
  { name: 'answer_with_citations', summary: '2 sources' },
];

export function RagPipelineDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useDemoClock(ref, TOOLS.length, { tick: 950, hold: 2600 });

  return (
    <div ref={ref} className="flex w-full flex-col gap-1.5">
      {TOOLS.map((tool, i) => {
        const status: AIToolCallStatus = i < step ? 'success' : i === step ? 'running' : 'pending';
        return (
          <AIToolCall
            key={tool.name}
            name={tool.name}
            status={status}
            summary={status === 'success' ? tool.summary : undefined}
          />
        );
      })}
    </div>
  );
}


// ─── Security review: the controls at the boundary, each one passing ─────────
const CONTROLS = ['redact', 'scan', 'hash', 'auth', 'tls', 'sast'] as const;

// ─── 08 · Release gate, the merge-request check running its suites ──────────
const GATE = ['auth', 'stream', 'match', 'verdict'] as const;

export function ReleaseGateDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useDemoClock(ref, GATE.length, { tick: 950, hold: 3000 });
  const at = (id: (typeof GATE)[number]) => statusAt(GATE.indexOf(id), step);

  const tasks: AITask[] = [
    { id: 'auth', label: 'Auth flow: sign in, session, refresh', status: at('auth') },
    {
      id: 'stream',
      label: 'SSE stream validation',
      note: at('stream') === 'done' ? 'arrives whole' : undefined,
      status: at('stream'),
    },
    {
      id: 'match',
      label: 'Semantic response matching',
      note: at('match') === 'done' ? 'meaning holds' : undefined,
      status: at('match'),
    },
    { id: 'verdict', label: 'Merge request check', note: at('verdict') === 'done' ? 'mergeable' : undefined, status: at('verdict') },
  ];

  return (
    <div ref={ref} className="w-full">
      <AITaskList label="Pipeline" tasks={tasks} className="text-[13px]" />
    </div>
  );
}

export function SecurityChecksDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useDemoClock(ref, CONTROLS.length, { tick: 700, hold: 3000 });
  const at = (id: (typeof CONTROLS)[number]) => statusAt(CONTROLS.indexOf(id), step);

  const tasks: AITask[] = [
    { id: 'redact', label: 'Redact PHI at the model boundary', status: at('redact') },
    { id: 'scan', label: 'Malware scan on upload', note: at('scan') === 'done' ? 'clean' : undefined, status: at('scan') },
    { id: 'hash', label: 'SHA-256 integrity check', status: at('hash') },
    { id: 'auth', label: 'OAuth session', status: at('auth') },
    { id: 'tls', label: 'TLS and CA validation', status: at('tls') },
    { id: 'sast', label: 'Static analysis', note: at('sast') === 'done' ? '0 critical' : undefined, status: at('sast') },
  ];

  return (
    <div ref={ref} className="w-full">
      <AITaskList label="Review" tasks={tasks} className="text-[13px]" />
    </div>
  );
}
