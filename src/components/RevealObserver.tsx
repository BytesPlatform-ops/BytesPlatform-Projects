"use client";

import { useEffect } from "react";

/**
 * Progressive scroll reveal. Elements carrying `data-reveal` are visible by
 * default (no-JS and reduced-motion safe); on mount they are hidden and then
 * revealed as they enter the viewport.
 */
export default function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );

    for (const el of els) {
      const r = el.getBoundingClientRect();
      // Anything already on screen on first paint stays visible.
      if (r.top < window.innerHeight * 0.9) continue;
      el.classList.add("reveal-ready");
      io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return null;
}
