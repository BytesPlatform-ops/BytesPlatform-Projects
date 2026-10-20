"use client";

import { useRef, type CSSProperties } from "react";
import { useReveal } from "@/lib/useReveal";
import styles from "./AboutSection.module.css";

/**
 * About: editorial heading and copy, then the regional footprint: the USA as
 * the hub, a route sweeping across it west to east, then on to the Middle
 * East and Africa. A compact, schematic strip rather than a map; node
 * positions only hint at geography.
 */

interface Node {
  key: string;
  label?: string;
  sub?: string;
  /** Position in the 1000 × 220 drawing */
  x: number;
  y: number;
  /** Which side of the pin the label sits on */
  place?: "under" | "below" | "above";
  hub?: boolean;
  /** A small waypoint (the US coasts) */
  dot?: boolean;
}

const nodes: Node[] = [
  { key: "us-west", label: "West USA", x: 70, y: 140, place: "below", dot: true },
  { key: "usa", label: "USA", sub: "Headquarters · Texas", x: 195, y: 105.75, place: "above", hub: true },
  { key: "us-east", label: "East USA", x: 320, y: 118, place: "below", dot: true },
  { key: "africa", label: "Africa", sub: "Delivery region", x: 590, y: 158, place: "below" },
  { key: "mideast", label: "Middle East", sub: "Delivery region", x: 830, y: 92, place: "above" },
];

/** Order on the phone rail: the hub first, then outward */
const railOrder = ["usa", "mideast", "africa"];

/** Routes as cubic curves: start, two controls, end. The first crosses the
 *  US west to east (passing through the hub); the others leave the east coast */
const routes: { key: string; pts: [number, number][] }[] = [
  {
    key: "us-west-east",
    pts: [
      [70, 140],
      [150, 100],
      [240, 96],
      [320, 118],
    ],
  },
  {
    key: "to-africa",
    pts: [
      [320, 118],
      [420, 50],
      [500, 70],
      [590, 158],
    ],
  },
  {
    key: "to-mideast",
    pts: [
      [320, 118],
      [450, 6],
      [680, 0],
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

/** The delivery path, beside the heading */
const steps = [
  { title: "Strategy", body: "The problem worth solving" },
  { title: "Design", body: "How it looks, reads and feels" },
  { title: "Engineering", body: "Software, AI, web and mobile" },
  { title: "Growth", body: "Automation and search that scale it" },
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
          <p className={styles.lead}>
            A Texas-based product and engineering company. <span>One team takes your idea from first sketch to a
            product that scales, without ever changing hands.</span>
          </p>
          {/* Strategy to scale, as the four steps the heading promises */}
          <ol className={styles.steps}>
            {steps.map((s, i) => (
              <li key={s.title} className={styles.step} style={{ "--i": i } as CSSProperties}>
                <span className={`mono ${styles.stepIndex}`}>{String(i + 1).padStart(2, "0")}</span>
                <strong className={styles.stepTitle}>{s.title}</strong>
                <span className={styles.stepBody}>{s.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <figure className={styles.footprint} aria-labelledby="footprint-caption">
        <figcaption id="footprint-caption" className={styles.caption}>
          <span className={`mono ${styles.captionLabel}`}>Regional footprint</span>
          <strong className={styles.captionHome}>Proudly Texan</strong>
          <span className={`mono ${styles.captionReach}`}>USA · Middle East · Africa</span>
        </figcaption>

        <div className={styles.map}>
          <svg className={styles.svg} viewBox="0 0 1000 220" aria-hidden="true">
            {routes.map((r, k) => (
              <g key={r.key} style={{ "--i": k } as CSSProperties} data-us={k === 0 || undefined}>
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
              data-dot={n.dot || undefined}
              data-place={n.place}
              style={{ left: `${n.x / 10}%`, top: `${(n.y / 220) * 100}%`, "--i": i } as CSSProperties}
            >
              <span className={styles.pin} aria-hidden="true" />
              {n.label && (
                <span className={styles.nodeText}>
                  <span className={styles.nodeLabel}>{n.label}</span>
                  {n.sub && <span className={`mono ${styles.nodeSub}`}>{n.sub}</span>}
                </span>
              )}
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
