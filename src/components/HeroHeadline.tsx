"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { prefersReducedMotion } from "@/lib/useReveal";
import styles from "./HeroHeadline.module.css";

/**
 * The hero headline as controlled kinetic type.
 *
 * Entrance (CSS, offset from --intro-delay so it waits for the brand intro):
 * each line rises out of its own mask 110ms apart, the keywords settle from a
 * lighter, looser cut into full weight, and the last line arrives slower and
 * heavier, its full stop landing last in brand blue.
 *
 * Once the last line has settled, this component:
 *   - runs one restrained wave through each keyword in turn (wide screens)
 *   - marks the heading alive: weight and tracking breathe on a ~5s cycle and
 *     the lines drift 2–3px (phones: the drift only)
 *   - lifts one keyword at a time every few seconds
 *   - on desktop, lets the keyword nearest the cursor lean 3px toward it and
 *     gain a little weight
 * Nothing runs with reduced motion, or while the hero is off screen.
 */

const KEYWORDS = ["Products", "platforms", "growth systems"];
const WAVE_GAP_MS = 380;
const EMPHASIS_EVERY_MS = 5200;
const EMPHASIS_HOLD_MS = 1900;
/** Cursor reach, and how far a keyword may lean toward it */
const REACH = 340;
const LEAN = 3;

/** A keyword as animatable letters. Trailing punctuation rides inside it, glued
 *  to the last word, so a comma can never drop to a line of its own. */
function Keyword({ index, trail = "" }: { index: number; trail?: string }) {
  const word = KEYWORDS[index];
  const split = word.lastIndexOf(" ") + 1;
  const letters = (from: number, to: number) =>
    [...word.slice(from, to)].map((ch, k) =>
      // A real space, so a phrase can still wrap between its words where the line needs it
      ch === " " ? (
        " "
      ) : (
        <span key={from + k} className={styles.ch} style={{ "--c": from + k } as CSSProperties}>
          {ch}
        </span>
      ),
    );
  return (
    <span className={styles.kw} data-kw={index}>
      {letters(0, split)}
      <span className={styles.keep}>
        {letters(split, word.length)}
        {trail}
      </span>
    </span>
  );
}

const line = (l: number) => ({ "--l": l }) as CSSProperties;

export default function HeroHeadline({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const title = ref.current;
    if (!title || prefersReducedMotion()) return;

    const kws = Array.from(title.querySelectorAll<HTMLElement>("[data-kw]"));
    const last = title.querySelector<HTMLElement>("[data-last] > *");
    const wide = window.matchMedia("(min-width: 1024px)");
    const finePointer = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    let onScreen = true;
    let alive = false;
    let emphasis = 0;
    let emphasisTimer = 0;

    // ---- After the entrance: wave, then breathing and emphasis ------------
    const wave = (kw: HTMLElement) => {
      kw.removeAttribute("data-wave");
      void kw.offsetWidth; // restart the letters' animation
      kw.setAttribute("data-wave", "");
      later(() => kw.removeAttribute("data-wave"), 1400);
    };

    const emphasise = () => {
      if (!onScreen || document.hidden) return;
      const kw = kws[emphasis % kws.length];
      emphasis++;
      kw.setAttribute("data-emph", "");
      later(() => kw.removeAttribute("data-emph"), EMPHASIS_HOLD_MS);
    };

    const start = () => {
      if (alive) return;
      alive = true;
      title.setAttribute("data-alive", "");
      if (wide.matches) kws.forEach((kw, i) => later(() => wave(kw), i * WAVE_GAP_MS));
      emphasisTimer = window.setInterval(emphasise, EMPHASIS_EVERY_MS);
    };

    // Alive once the last line has landed; it may already have, if hydration
    // came late. While the brand intro holds the entrance, this simply waits.
    let disposed = false;
    const entrance = last
      ?.getAnimations()
      .find((a) => "animationName" in a && String((a as CSSAnimation).animationName).includes("lineIn"));
    if (!entrance || entrance.playState === "finished") start();
    else
      entrance.finished.then(
        () => !disposed && start(),
        () => !disposed && start(),
      );

    // ---- Cursor: the nearest keyword leans in -------------------------------
    const pointer = { x: 0, y: 0, active: false };
    const state = kws.map(() => ({ x: 0, y: 0, h: 0 }));
    let frame = 0;

    const tick = () => {
      frame = 0;
      let moving = false;
      // Nearest keyword to the cursor, within reach
      let target = -1;
      let best = REACH;
      const rects = kws.map((kw) => kw.getBoundingClientRect());
      if (pointer.active) {
        rects.forEach((r, i) => {
          const d = Math.hypot(pointer.x - (r.left + r.width / 2), pointer.y - (r.top + r.height / 2));
          if (d < best) {
            best = d;
            target = i;
          }
        });
      }
      kws.forEach((kw, i) => {
        const s = state[i];
        let tx = 0;
        let ty = 0;
        let th = 0;
        if (i === target) {
          const r = rects[i];
          const dx = pointer.x - (r.left + r.width / 2);
          const dy = pointer.y - (r.top + r.height / 2);
          const len = Math.hypot(dx, dy) || 1;
          const pull = Math.min(1, len / 120) * LEAN;
          tx = (dx / len) * pull;
          ty = (dy / len) * pull;
          th = 1 - best / REACH;
        }
        // Very smooth follow
        s.x += (tx - s.x) * 0.085;
        s.y += (ty - s.y) * 0.085;
        s.h += (th - s.h) * 0.07;
        if (Math.abs(tx - s.x) > 0.01 || Math.abs(ty - s.y) > 0.01 || Math.abs(th - s.h) > 0.002) moving = true;
        kw.style.setProperty("--kw-x", `${s.x.toFixed(2)}px`);
        kw.style.setProperty("--kw-y", `${s.y.toFixed(2)}px`);
        kw.style.setProperty("--kw-h", s.h.toFixed(3));
      });
      if (moving) frame = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (!finePointer.matches || !onScreen || e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      kick();
    };
    const onLeave = () => {
      pointer.active = false;
      kick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    // Off screen: breathing pauses (CSS), emphasis skips, the cursor lets go
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      title.toggleAttribute("data-paused", !onScreen);
      if (!onScreen) onLeave();
    });
    io.observe(title);

    return () => {
      disposed = true;
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      io.disconnect();
      timers.forEach(clearTimeout);
      clearInterval(emphasisTimer);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <h1 ref={ref} id="hero-title" className={`${className} ${styles.title}`}>
      <span className="sr-only">Products, platforms and growth systems, built end to end.</span>
      {/* Visual copy: lines, keywords and letters, each animatable on its own */}
      <span aria-hidden="true">
        <span className={styles.line} style={line(0)}>
          <span className={styles.inner}>
            <Keyword index={0} trail="," /> <Keyword index={1} />
          </span>
        </span>{" "}
        <span className={styles.line} style={line(1)}>
          <span className={styles.inner}>
            and <Keyword index={2} trail="," />
          </span>
        </span>{" "}
        <span className={styles.line} style={line(2)} data-last>
          <em className={styles.inner}>
            built end to end<span className={styles.stop}>.</span>
          </em>
        </span>
      </span>
    </h1>
  );
}
