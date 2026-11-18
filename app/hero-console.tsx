'use client';

// The landing console: a scripted assistant built from SmoothUI's AI
// primitives. There is no model behind it (this is a static export). A
// question is scored against the answer set in content/answers.ts, the best
// match streams in word by word, and a link offers the section it came from.
// Refs (inspora.design, Sep 2026): "AI prompt bar" by @socoloffalex, a composer
// with suggestion chips and a small avatar; "Agent Plan" by @jeetnirnejak.

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import AIResponse from '@/components/smoothui/ai-response';
import AISuggestions from '@/components/smoothui/ai-suggestions';
import AIPromptInput from '@/components/smoothui/ai-prompt-input';
import { answerText, chips, resolve, type Answer } from '@/content/answers';
import { scrollToId } from '@/components/site/SmoothScroll';

const EASE_EXPO: [number, number, number, number] = [0.23, 1, 0.32, 1];
const WORD_MS = 42;
const AUTOPLAY_DELAY_MS = 1500;

export function HeroConsole({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  const reduced = useReducedMotion();
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [text, setText] = useState('');
  const [shown, setShown] = useState(0); // words revealed so far
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const words = text ? text.split(' ') : [];
  const streaming = answer !== null && shown < words.length;
  const done = answer !== null && !streaming;

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  const ask = useCallback(
    (q: string) => {
      stop();
      const next = resolve(q);
      const body = answerText(next);
      const total = body.split(' ').length;
      setQuestion(q);
      setAnswer(next);
      setText(body);
      if (reduced) {
        setShown(total);
        return;
      }
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

  // Autoplay the first chip so the landing has life without a click. The
  // compact (phone) card stays a prompt and chips until a question is asked.
  useEffect(() => {
    if (compact) return;
    const t = setTimeout(() => ask(chips[0].label), AUTOPLAY_DELAY_MS);
    return () => {
      clearTimeout(t);
      stop();
    };
  }, [ask, stop]);

  return (
    <div className={`hx-console relative w-full flex flex-col ${className}`}>
      <div className="hx-console__head">
        <img className="rd-logo-light" src="/redesign/brand/logo-on-light.png" alt="" height={23} />
        <img className="rd-logo-dark" src="/redesign/brand/logo-on-dark.png" alt="" height={23} />
        <span className="hx-console__name">ask anubhav</span>
        <span className="hx-console__ping" aria-hidden="true" />
        <span className="hx-console__mem">remembers this chat</span>
      </div>

      <div className={compact && !question ? 'hidden' : 'min-h-[7.5rem]'}>
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
                <span aria-hidden="true" className="mt-[3px] text-[10px] text-primary">
                  ▶
                </span>
                {question}
              </p>
              <AIResponse text={words.slice(0, shown).join(' ')} isStreaming={streaming} className="text-[13.5px]" />
              <AnimatePresence>
                {done && answer?.go && (
                  <motion.button
                    type="button"
                    onClick={() => scrollToId(answer.go!.id)}
                    className="mt-3 inline-flex items-center text-[13px] font-medium text-[var(--accent)] hover:text-[var(--ink)] transition-colors duration-150 border-b border-current pb-px"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE_EXPO }}
                  >
                    {answer.go.label}
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
              Ask about the work, the stack, experience, education, or how to reach me.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AISuggestions
        suggestions={chips}
        onSelect={(s) => ask(s.label)}
        className={compact ? 'hx-chips hx-chips--row' : 'hx-chips [&_button]:text-[12.5px] [&_button]:py-1'}
      />

      <AIPromptInput
        placeholder="Ask anything about me or the work"
        state={streaming ? 'streaming' : 'idle'}
        onSubmit={ask}
        onStop={() => {
          stop();
          setShown(words.length);
        }}
        maxLength={160}
      />
    </div>
  );
}
