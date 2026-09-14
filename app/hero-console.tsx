'use client';

// Hero console — replaces the static monogram box with something that shows the
// work: a scripted assistant built from SmoothUI's AI primitives. There is no
// model behind it (this is a static export); a small intent map picks a canned
// answer, streams it word by word, and offers the section it came from.
// Refs (inspora.design, Sep 2026): "AI prompt bar" by @socoloffalex — a composer
// with suggestion chips and a small avatar; "Agent Plan" by @jeetnirnejak.

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import AIResponse from '@/components/smoothui/ai-response';
import AISuggestions from '@/components/smoothui/ai-suggestions';
import AIPromptInput from '@/components/smoothui/ai-prompt-input';

const EASE_EXPO: [number, number, number, number] = [0.23, 1, 0.32, 1];
const WORD_MS = 42;
const AUTOPLAY_DELAY_MS = 1500;

type Intent = {
  id: string;
  label: string;
  match: RegExp;
  answer: string;
  /** Section the answer points at. */
  go?: { id: string; label: string };
};

// Order matters: the first regex that matches wins.
const INTENTS: Intent[] = [
  {
    id: 'build',
    label: 'What do you build?',
    match: /\b(build|do you|what do|make|working on)\b/i,
    answer:
      'Production GenAI platforms at Deloitte: LLM and RAG systems on AWS Bedrock, multi-step agents with LangGraph, and the FastAPI and React surfaces around them. End to end, in production, not demos.',
    go: { id: 'about', label: 'More about me' },
  },
  {
    id: 'work',
    label: 'Show me the work',
    match: /\b(work|project|portfolio|show|built|shipped)\b/i,
    answer:
      'Four public builds (PitStop, HEAT, SAPR and Valo Tourney) plus three case studies from the Deloitte platform: retrieval, agents, and the backend under them. Each one opens further down.',
    go: { id: 'work', label: 'Open the work' },
  },
  {
    id: 'stack',
    label: 'Tech stack?',
    match: /\b(stack|tech|tools|language|python|react|aws|typescript|postgres)\b/i,
    answer:
      'Python, FastAPI, React and Next.js on the surface; AWS Bedrock, Lambda and S3 underneath; PostgreSQL, LangChain and LangGraph in between. The full set is grouped in the skills section, and each case study lists what it was built with.',
    go: { id: 'skills', label: 'What I work with' },
  },
  {
    id: 'reach',
    label: 'How do I reach you?',
    match: /\b(available|hire|hiring|contact|email|reach|open to|freelance|contract|social|linkedin|github)\b/i,
    answer:
      'Email is the fastest route: work@anubhavkumaar.in. All eight profiles, GitHub and LinkedIn first, are in the connect section.',
    go: { id: 'connect', label: 'Get in touch' },
  },
];

const FALLBACK: Intent = {
  id: 'fallback',
  label: '',
  match: /.^/,
  answer:
    "That one is outside the script. This console runs a small intent map, not a model. Try one of the chips, or just scroll.",
};

const resolve = (q: string): Intent => INTENTS.find((i) => i.match.test(q)) ?? FALLBACK;

export function HeroConsole({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();
  const [question, setQuestion] = useState<string | null>(null);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [shown, setShown] = useState(0); // words revealed so far
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const words = intent ? intent.answer.split(' ') : [];
  const streaming = intent !== null && shown < words.length;
  const done = intent !== null && !streaming;

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  const ask = useCallback(
    (q: string) => {
      stop();
      const next = resolve(q);
      setQuestion(q);
      setIntent(next);
      const total = next.answer.split(' ').length;
      if (reduced) { setShown(total); return; }
      setShown(0);
      timer.current = setInterval(() => {
        setShown((n) => {
          if (n + 1 >= total) stop();
          return n + 1;
        });
      }, WORD_MS);
    },
    [reduced, stop],
  );

  // Autoplay the first intent so the hero has life without a click.
  useEffect(() => {
    const t = setTimeout(() => ask(INTENTS[0].label), AUTOPLAY_DELAY_MS);
    return () => { clearTimeout(t); stop(); };
  }, [ask, stop]);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className={`relative w-full p-5 md:p-6 flex flex-col gap-5 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden"
            style={{ background: 'rgba(var(--accent-rgb),0.14)', border: '1px solid rgba(var(--accent-rgb),0.28)' }}
          >
            <img src="/logo/avatar.png" alt="" className="w-[60%] h-[60%] object-contain" draggable={false} />
          </span>
          <span className="text-sm font-medium text-[rgba(var(--ink-rgb),calc(0.85*var(--ink-boost)))]">ask anubhav</span>
        </div>
        <span className="t-small">Scripted, runs locally</span>
      </div>

      {/* Transcript */}
      <div className="min-h-[7.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          {question ? (
            <motion.div
              key={question}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE_EXPO }}
            >
              <p className="mb-2.5 flex items-start gap-2 text-[13px] leading-snug text-muted-foreground">
                <span aria-hidden="true" className="mt-[3px] text-[10px] text-primary">▶</span>
                {question}
              </p>
              <AIResponse text={words.slice(0, shown).join(' ')} isStreaming={streaming} className="text-[13.5px]" />
              <AnimatePresence>
                {done && intent?.go && (
                  <motion.button
                    type="button"
                    onClick={() => go(intent.go!.id)}
                    className="mt-3 inline-flex items-center text-[13px] font-medium text-[var(--accent)] hover:text-[var(--ink)] transition-colors duration-150 border-b border-current pb-px"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE_EXPO }}
                  >
                    {intent.go.label}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              className="text-[13px] leading-relaxed text-[rgba(var(--ink-rgb),calc(0.35*var(--ink-boost)))]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Ask about the work, the stack, or how to reach me.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AISuggestions
        suggestions={INTENTS.map(({ id, label }) => ({ id, label }))}
        onSelect={(s) => ask(s.label)}
        className="[&_button]:text-[12.5px] [&_button]:py-1"
      />

      <AIPromptInput
        placeholder="Ask anything about this site…"
        state={streaming ? 'streaming' : 'idle'}
        onSubmit={ask}
        onStop={() => { stop(); setShown(words.length); }}
        maxLength={120}
      />
    </div>
  );
}
