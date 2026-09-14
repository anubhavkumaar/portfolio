'use client';

// Adapted from Amicro `magnetic-button` (MIT) by Syed Subhan / @SubhanHQ
// https://github.com/Subhan-code/Amicro--Micro-transitions-
//
// Changes for this site: unstyled (palette comes in via className), renders an <a>
// when `href` is given so the hero CTAs stay real links, pull only on hover-capable
// pointers, spring press via whileTap, and a static fallback under reduced motion.
// The original's `range` check was dropped, mousemove only fires over the element,
// so the pull is simply "while hovered".

import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: React.ReactNode;
  /** 0–1: how far the element follows the cursor from its centre. */
  strength?: number;
  className?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

const SPRING = { stiffness: 150, damping: 15, mass: 0.6 };

export function MagneticButton({
  children,
  strength = 0.35,
  className,
  href,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const active = finePointer && !reduced;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!active || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    x.set((e.clientX - (left + width / 2)) * strength);
    y.set((e.clientY - (top + height / 2)) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const shared = {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick,
    style: { x, y },
    whileTap: reduced ? undefined : { scale: 0.97 },
    className: cn('relative inline-flex items-center justify-center select-none', className),
  };

  const inner = (
    <span className="relative z-10 inline-flex items-center gap-2 pointer-events-none">{children}</span>
  );

  if (href) {
    return (
      <motion.a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} {...shared}>
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button ref={ref as React.RefObject<HTMLButtonElement>} type="button" {...shared}>
      {inner}
    </motion.button>
  );
}
