"use client";

import { useRef, type CSSProperties } from "react";
import { useReveal } from "@/lib/useReveal";
import styles from "./AboutSection.module.css";

/**
 * About: editorial heading and copy, then the regional footprint: Denton,
 * Texas as the hub, with routes to the Middle East and Africa. A compact,
 * schematic strip rather than a map; node positions only hint at geography.
 */

interface Node {
  key: string;
  label: string;
  sub: string;
  /** Position in the 1000 × 220 drawing */
  x: number;
  y: number;
  /** Which side of the pin the label sits on */
  place: "under" | "below" | "above";
  hub?: boolean;
}

const nodes: Node[] = [
  { key: "denton", label: "Denton, Texas", sub: "USA · Headquarters", x: 150, y: 132, place: "under", hub: true },
  { key: "africa", label: "Africa", sub: "Delivery region", x: 590, y: 158, place: "below" },
  { key: "mideast", label: "Middle East", sub: "Delivery region", x: 830, y: 92, place: "above" },
];

/** Order on the phone rail: the hub first, then outward */
const railOrder = ["denton", "mideast", "africa"];

/** Routes out of Denton as cubic curves: start, two controls, end */
const routes: { key: string; pts: [number, number][] }[] = [
  {
    key: "to-africa",
    pts: [
      [150, 132],
      [300, 40],
      [470, 60],
      [590, 158],
    ],
  },
  {
    key: "to-mideast",
    pts: [
      [150, 132],
      [340, -10],
      [650, -6],
      [830, 92],
    ],
  },
  {
    key: "africa-mideast",
    pts: [
      [590, 158],
      [660, 140],
      [760, 128],
      [830, 92],
    ],
  },
];

const pathFor = (pts: [number, number][]) => {
  const [a, b, c, d] = pts.map(([x, y]) => `${x} ${y}`);
  return `M${a} C ${b}, ${c}, ${d}`;
};

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { threshold: 0.25 });

  return (
    <section ref={ref} className={`container ${styles.section}`} id="about" aria-labelledby="about-title">
      <div className={styles.head}>
        <div>
          <p className={`mono ${styles.eyebrow}`}>
            <span className={styles.rule} aria-hidden="true" />
            About
          </p>
          <h2 id="about-title" className={styles.title}>
            <span className={styles.line}>
              <span>One team,</span>
            </span>
            <span className={styles.line}>
              <span>strategy to scale.</span>
            </span>
          </h2>
        </div>
        <div className={styles.copy}>
          <p className={styles.long}>
            BytesPlatform is a Texas-based digital product and engineering company. We build software, AI systems, web
            and mobile experiences, automation and growth infrastructure for businesses operating in 2026 and beyond,
            with strategy, design, engineering and search visibility in one delivery team, from first concept through
            production and scale.
          </p>
          <p className={styles.short}>
            A Texas-based product and engineering company: software, AI, web and mobile, automation and growth, with
            strategy, design, engineering and search in one team, from concept to scale.
          </p>
        </div>
      </div>

      <figure className={styles.footprint} aria-labelledby="footprint-caption">
        <figcaption id="footprint-caption" className={styles.caption}>
          <span className={`mono ${styles.captionLabel}`}>Regional footprint</span>
          <strong className={styles.captionHome}>Denton, Texas</strong>
          <span className={`mono ${styles.captionReach}`}>USA · Middle East · Africa</span>
        </figcaption>

        <div className={styles.map}>
          <svg className={styles.svg} viewBox="0 0 1000 220" aria-hidden="true">
            {routes.map((r, k) => (
              <g key={r.key} style={{ "--i": k } as CSSProperties}>
                <path className={styles.route} d={pathFor(r.pts)} pathLength={1} />
                <path className={styles.flow} d={pathFor(r.pts)} pathLength={100} />
              </g>
            ))}
          </svg>

          {/* Nodes and labels in HTML so the type stays readable at any width */}
          {nodes.map((n, i) => (
            <div
              key={n.key}
              className={styles.node}
              data-hub={n.hub || undefined}
              data-place={n.place}
              style={{ left: `${n.x / 10}%`, top: `${(n.y / 220) * 100}%`, "--i": i } as CSSProperties}
            >
              <span className={styles.pin} aria-hidden="true" />
              <span className={styles.nodeText}>
                <span className={styles.nodeLabel}>{n.label}</span>
                <span className={`mono ${styles.nodeSub}`}>{n.sub}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Phones: the same routes as a vertical rail, every label full size */}
        <ol className={styles.rail}>
          {railOrder.map((key, i) => {
            const n = nodes.find((node) => node.key === key)!;
            return (
              <li
                key={n.key}
                className={styles.railStop}
                data-hub={n.hub || undefined}
                style={{ "--i": i } as CSSProperties}
              >
                <span className={styles.railPin} aria-hidden="true" />
                <span className={styles.railLabel}>{n.label}</span>
                <span className={`mono ${styles.railSub}`}>{n.sub}</span>
              </li>
            );
          })}
        </ol>
      </figure>
    </section>
  );
}
