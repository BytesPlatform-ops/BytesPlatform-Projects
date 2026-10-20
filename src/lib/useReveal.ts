"use client";

import { useEffect, type RefObject } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * One-shot entrance state for a section, shared by the dynamic sections.
 *
 * The server renders no `data-anim`, so without JavaScript (and with reduced
 * motion) everything shows in its final state. On mount a section that is
 * still ahead of the viewport gets data-anim="ready" (its pre-entrance pose)
 * and flips to "in" once, the first time enough of it is on screen.
 * `onIn` fires at that moment; `instant` is true when no animation will run.
 */
export function useReveal(
  ref: RefObject<HTMLElement | null>,
  { threshold = 0.2, onIn }: { threshold?: number; onIn?: (instant: boolean) => void } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = (instant: boolean) => {
      el.dataset.anim = "in";
      onIn?.(instant);
    };
    // Reduced motion, or already scrolled past (a reload mid-page): final state
    if (prefersReducedMotion() || el.getBoundingClientRect().bottom < 0) {
      show(true);
      return;
    }
    el.dataset.anim = "ready";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // Let the "ready" pose paint first so the transition always runs
        requestAnimationFrame(() => requestAnimationFrame(() => show(false)));
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
