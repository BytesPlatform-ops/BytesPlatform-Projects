"use client";

import { useRef, type CSSProperties } from "react";
import { useReveal } from "@/lib/useReveal";
import styles from "./AboutSection.module.css";

/**
 * About: editorial heading and copy, then the regional footprint: the outline
 * of the contiguous USA with Denton, Texas pinned as headquarters, routes from
 * Denton out to major US cities, and on to the Middle East and Africa. The US
 * is drawn to scale; the delivery regions are schematic.
 */

/** Simplified outline of the contiguous US as [longitude, latitude] */
const US_OUTLINE: [number, number][] = [
  [-124.7, 48.4], [-124.1, 46.9], [-124.0, 46.2], [-124.1, 43.4], [-124.4, 42.0], [-123.8, 39.8],
  [-122.9, 38.0], [-122.4, 37.2], [-121.9, 36.6], [-120.6, 34.6], [-119.2, 34.2], [-118.4, 33.8],
  [-117.1, 32.5], [-114.7, 32.7], [-111.1, 31.3], [-108.2, 31.3], [-108.2, 31.8], [-106.5, 31.8],
  [-105.0, 30.7], [-104.5, 29.6], [-103.1, 29.0], [-102.4, 29.8], [-101.4, 29.8], [-100.3, 28.3],
  [-99.5, 27.5], [-97.4, 25.9], [-97.2, 27.6], [-96.6, 28.3], [-95.0, 29.3], [-93.8, 29.7],
  [-92.0, 29.6], [-90.9, 29.1], [-89.4, 29.0], [-89.6, 30.2], [-88.0, 30.6], [-86.5, 30.4],
  [-85.3, 29.7], [-84.0, 30.1], [-83.0, 29.1], [-82.7, 27.9], [-82.0, 26.5], [-81.1, 25.2],
  [-80.4, 25.2], [-80.1, 26.7], [-80.6, 28.6], [-81.4, 30.7], [-80.9, 32.0], [-79.2, 33.4],
  [-77.9, 34.0], [-76.5, 34.7], [-75.5, 35.3], [-76.0, 36.9], [-75.6, 37.9], [-75.1, 38.8],
  [-74.4, 39.4], [-74.0, 40.5], [-72.6, 40.9], [-71.9, 41.3], [-70.0, 41.7], [-70.6, 42.6],
  [-70.2, 43.7], [-68.8, 44.4], [-67.0, 44.8], [-67.8, 47.1], [-69.2, 47.4], [-70.9, 45.3],
  [-71.5, 45.0], [-74.7, 45.0], [-76.3, 44.2], [-79.0, 43.3], [-79.8, 42.3], [-82.5, 41.7],
  [-83.5, 41.7], [-82.5, 42.6], [-82.4, 43.0], [-82.5, 45.3], [-84.6, 46.5], [-87.6, 47.4],
  [-89.6, 48.0], [-91.0, 48.2], [-93.0, 48.6], [-94.8, 48.8], [-95.2, 49.0], [-123.0, 49.0],
  [-123.2, 48.3],
];

/** Longitude / latitude to the 1000 × 220 drawing (equirectangular, scaled for ~39°N) */
const geo = (lon: number, lat: number): [number, number] => [
  Math.round((40 + (lon + 125) * 0.777 * 7) * 10) / 10,
  Math.round((20 + (50 - lat) * 7) * 10) / 10,
];

const usPath = `M${US_OUTLINE.map(([lon, lat]) => geo(lon, lat).join(" ")).join(" L")} Z`;

const DENTON = geo(-97.13, 33.21);

/** US cities linked to headquarters (Seattle, Los Angeles, Denver, Chicago,
 *  New York, Atlanta), shown as unlabelled dots */
const cities: { key: string; lon: number; lat: number }[] = [
  { key: "seattle", lon: -122.33, lat: 47.6 },
  { key: "la", lon: -118.24, lat: 34.05 },
  { key: "denver", lon: -104.99, lat: 39.74 },
  { key: "chicago", lon: -87.63, lat: 41.88 },
  { key: "nyc", lon: -74.0, lat: 40.7 },
  { key: "atlanta", lon: -84.39, lat: 33.75 },
];

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
  /** A US city: a small unlabelled dot */
  city?: boolean;
  /** Entrance order */
  i: number;
}

const nodes: Node[] = [
  {
    key: "usa",
    label: "USA",
    sub: "Headquarters · Denton, Texas",
    x: DENTON[0],
    y: DENTON[1],
    place: "under",
    hub: true,
    i: 0,
  },
  ...cities.map((c, k): Node => {
    const [x, y] = geo(c.lon, c.lat);
    return { key: c.key, x, y, city: true, i: 1 + k * 0.35 };
  }),
  { key: "africa", label: "Africa", sub: "Delivery region", x: 590, y: 158, place: "below", i: 4 },
  { key: "mideast", label: "Middle East", sub: "Delivery region", x: 830, y: 92, place: "above", i: 5 },
];

/** Order on the phone rail: the hub first, then outward */
const railOrder = ["usa", "mideast", "africa"];

type Pt = [number, number];

/** A gentle arc from a to b, bowing up the drawing */
const arc = (a: Pt, b: Pt, bend = 0.2): Pt[] => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const [nx, ny] = dx >= 0 ? [dy, -dx] : [-dy, dx];
  const at = (t: number): Pt => [
    Math.round((a[0] + dx * t + nx * bend) * 10) / 10,
    Math.round((a[1] + dy * t + ny * bend) * 10) / 10,
  ];
  return [a, at(1 / 3), at(2 / 3), b];
};

/** Routes as cubic curves: start, two controls, end. All leave Denton: out to
 *  the US cities first, then on to the delivery regions. `d` staggers them */
const routes: { key: string; pts: Pt[]; d: number; local?: boolean }[] = [
  ...nodes
    .filter((n) => n.city)
    .map((n, k) => ({ key: `to-${n.key}`, pts: arc(DENTON, [n.x, n.y]), d: k * 0.12, local: true })),
  { key: "to-africa", pts: [DENTON, [320, 50], [480, 60], [590, 158]], d: 0.9 },
  { key: "to-mideast", pts: [DENTON, [380, -12], [660, -6], [830, 92]], d: 1.15 },
  {
    key: "africa-mideast",
    pts: [
      [590, 158],
      [660, 140],
      [760, 128],
      [830, 92],
    ],
    d: 1.4,
  },
];

/** The delivery path, beside the heading */
const steps = [
  { title: "Strategy", body: "The problem worth solving" },
  { title: "Design", body: "How it looks, reads and feels" },
  { title: "Engineering", body: "Software, AI, web and mobile" },
  { title: "Growth", body: "Automation and search that scale it" },
];

const pathFor = (pts: Pt[]) => {
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
            <defs>
              <pattern id="us-dots" width="4.2" height="4.2" patternUnits="userSpaceOnUse">
                <circle className={styles.patternDot} cx="2.1" cy="2.1" r="0.95" />
              </pattern>
            </defs>
            {/* The contiguous US, to scale: a soft fill, fine dots and a hairline edge */}
            <g className={styles.country}>
              <path className={styles.countryFill} d={usPath} />
              <path className={styles.countryDots} d={usPath} fill="url(#us-dots)" />
              <path className={styles.countryEdge} d={usPath} />
            </g>
            {routes.map((r) => (
              <g key={r.key} style={{ "--d": `${r.d}s` } as CSSProperties} data-local={r.local || undefined}>
                <path className={styles.route} d={pathFor(r.pts)} pathLength={1} />
                <path className={styles.flow} d={pathFor(r.pts)} pathLength={100} />
              </g>
            ))}
          </svg>

          {/* Nodes and labels in HTML so the type stays readable at any width */}
          {nodes.map((n) => (
            <div
              key={n.key}
              className={styles.node}
              data-hub={n.hub || undefined}
              data-city={n.city || undefined}
              data-place={n.place}
              style={{ left: `${n.x / 10}%`, top: `${(n.y / 220) * 100}%`, "--i": n.i } as CSSProperties}
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
