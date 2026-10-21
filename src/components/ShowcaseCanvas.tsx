"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { withBase } from "@/lib/site";
import { prefersReducedMotion, useReveal } from "@/lib/useReveal";
import styles from "./ShowcaseCanvas.module.css";

/**
 * "At a glance": one composed canvas of real project screens. A desktop
 * site, an app dashboard, a supporting product flow and two phone slots that
 * quietly rotate through more client work. Every image is an unaltered
 * screenshot from the case studies; phone screens are straight crops of the
 * existing mobile composites (public/images/montage).
 */

interface Shot {
  src: string;
  width: number;
  height: number;
  alt: string;
  project: string;
}

const shot = (file: string, width: number, height: number, alt: string, project: string): Shot => ({
  src: withBase(file),
  width,
  height,
  alt,
  project,
});

const desktop = shot(
  "/images/projects/benavente-01-desktop.jpg",
  2656,
  1660,
  "The Benavente Group website homepage: real estate valuation and consultancy over Honolulu",
  "The Benavente Group",
);
const dashboard = shot(
  "/images/projects/quantiva-02-app.jpg",
  1400,
  826,
  "Quantiva HQ app screens: open trade ideas, the portfolio dashboard and the order ticket",
  "Quantiva HQ",
);
const flow = shot(
  "/images/projects/cascadia-03-feature.jpg",
  1440,
  814,
  "Cascadia Health facility staffing request, step 1 of 7",
  "Cascadia Health",
);

/** Two phone slots, each rotating through its own set */
const phoneSets: Shot[][] = [
  [
    shot("/images/montage/cascadia-phone.jpg", 405, 835, "Cascadia Health homepage on mobile", "Cascadia Health"),
    shot("/images/montage/gilbert-phone.jpg", 412, 849, "Gilbert & Sons roofing homepage on mobile", "Gilbert & Sons"),
    shot(
      "/images/montage/twiph-phone.jpg",
      379,
      781,
      "This Week in Public Health homepage on mobile",
      "This Week in Public Health",
    ),
  ],
  [
    shot("/images/montage/aegis-phone.jpg", 383, 790, "Aegis Creek homepage on mobile", "Aegis Creek"),
    shot("/images/montage/sqush-phone.jpg", 404, 833, "SQUSH LLC homepage on mobile", "SQUSH LLC"),
    shot(
      "/images/montage/ontop-phone.jpg",
      382,
      788,
      "On Top Home Services homepage on mobile",
      "On Top Home Services",
    ),
  ],
];

const industries = [
  "Fintech",
  "AI",
  "Healthcare",
  "Real estate",
  "Logistics",
  "Public sector",
  "Local services",
  "B2B commerce",
];

const SWAP_MS = 4200;

/** Wide-screen placement in % of the stage; `depth` drives scroll parallax */
const layout = {
  dashboard: { x: 49, y: 3, w: 46, depth: -0.5, z: 1 },
  desktop: { x: 3, y: 11, w: 55, depth: 0.25, z: 2 },
  flow: { x: 13, y: 63, w: 31, depth: 0.8, z: 3 },
  // Below the app dashboard, clear of it at every point of the parallax
  phoneA: { x: 61, y: 52.5, w: 11, depth: -0.6, z: 4 },
  phoneB: { x: 76.5, y: 57, w: 11, depth: 0.25, z: 4 },
};

const place = (k: keyof typeof layout, i: number, s: Shot) =>
  ({
    "--x": `${layout[k].x}%`,
    "--y": `${layout[k].y}%`,
    "--w": `${layout[k].w}%`,
    "--depth": layout[k].depth,
    "--z": layout[k].z,
    "--i": i,
    "--ar": `${s.width} / ${s.height}`,
  }) as CSSProperties;

export default function ShowcaseCanvas({ total }: { total: number }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [swap, setSwap] = useState(0);
  const [visible, setVisible] = useState(false);

  useReveal(sectionRef, { threshold: 0.15 });

  // Scroll parallax (wide screens, motion allowed, only while on screen) and
  // visibility for the phone rotation. One CSS variable feeds every layer.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const wide = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let listening = false;

    const update = () => {
      frame = 0;
      const r = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      stage.style.setProperty("--p", Math.max(-1, Math.min(1, p)).toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      const on = e.isIntersecting && wide.matches;
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener("scroll", onScroll, { passive: true });
        update();
      } else window.removeEventListener("scroll", onScroll);
    });
    io.observe(stage);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Phone rotation: only while on screen, never with reduced motion
  useEffect(() => {
    if (!visible || prefersReducedMotion()) return;
    const t = window.setInterval(() => {
      if (!document.hidden) setSwap((s) => s + 1);
    }, SWAP_MS);
    return () => window.clearInterval(t);
  }, [visible]);

  const nowShowing = phoneSets.map((set, slot) => set[(swap + slot) % set.length]);

  return (
    <section ref={sectionRef} className={`container ${styles.section}`} aria-labelledby="glance-title">
      <div className={styles.head}>
        <p className={`mono ${styles.eyebrow}`}>
          <span className={styles.rule} aria-hidden="true" />
          At a glance
        </p>
        <h2 id="glance-title" className={styles.title}>
          <span className={styles.line}>
            <span>The range,</span>
          </span>
          <span className={styles.line}>
            <em>at a glance.</em>
          </span>
        </h2>
        <p className={styles.note}>
          {total} case studies across product, AI, web and mobile, and search-led growth, shown through their real
          screens.
        </p>
      </div>

      {/* Industries, drifting slowly; the second copy closes the loop */}
      <div className={styles.ticker} aria-label={`Industries: ${industries.join(", ")}`}>
        {[0, 1].map((copy) => (
          <ul key={copy} className={`mono ${styles.tickerTrack}`} aria-hidden={copy === 1 || undefined}>
            {industries.map((name) => (
              <li key={name}>
                {name}
                <span aria-hidden="true">/</span>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <div className={styles.canvas}>
        <div ref={stageRef} className={styles.stage}>
          <span className={styles.grid} aria-hidden="true" />

          <figure
            className={`${styles.piece} ${styles.dark}`}
            data-slot="dashboard"
            style={place("dashboard", 0, dashboard)}
          >
            <div className={styles.card}>
              <Image
                src={dashboard.src}
                alt={dashboard.alt}
                width={dashboard.width}
                height={dashboard.height}
                sizes="(max-width: 767px) 86vw, 46vw"
              />
            </div>
            <figcaption className={`mono ${styles.tag}`}>App · {dashboard.project}</figcaption>
          </figure>

          <figure className={styles.piece} data-slot="desktop" style={place("desktop", 1, desktop)}>
            <div className={styles.card}>
              <Image
                src={desktop.src}
                alt={desktop.alt}
                width={desktop.width}
                height={desktop.height}
                sizes="(max-width: 767px) 86vw, 55vw"
              />
            </div>
            <figcaption className={`mono ${styles.tag}`}>Web · {desktop.project}</figcaption>
          </figure>

          <figure className={styles.piece} data-slot="flow" style={place("flow", 2, flow)}>
            <div className={styles.card}>
              <Image
                src={flow.src}
                alt={flow.alt}
                width={flow.width}
                height={flow.height}
                sizes="(max-width: 767px) 86vw, 31vw"
              />
            </div>
            <figcaption className={`mono ${styles.tag}`}>Flow · {flow.project}</figcaption>
          </figure>

          {phoneSets.map((set, slot) => (
            <figure
              key={slot}
              className={`${styles.piece} ${styles.phone}`}
              data-slot={slot ? "phoneB" : "phoneA"}
              style={place(slot ? "phoneB" : "phoneA", 3 + slot, set[0])}
            >
              <div className={styles.card}>
                {set.map((s, i) => (
                  <Image
                    key={s.src}
                    src={s.src}
                    alt={s.alt}
                    width={s.width}
                    height={s.height}
                    sizes="(max-width: 767px) 42vw, 13vw"
                    // Hidden screens load up front, so each fades in fully drawn
                    loading="eager"
                    className={styles.swap}
                    data-active={(swap + slot) % set.length === i || undefined}
                  />
                ))}
              </div>
            </figure>
          ))}
        </div>

        <p className={`mono ${styles.now}`}>
          <span className={styles.nowDot} aria-hidden="true" />
          Mobile · {nowShowing[0].project} / {nowShowing[1].project}
        </p>
      </div>
    </section>
  );
}
