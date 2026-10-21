"use client";

import { useRef, type CSSProperties } from "react";
import { useReveal } from "@/lib/useReveal";
import styles from "./AboutSection.module.css";

/**
 * About: editorial heading and copy, then the regional footprint: the outline
 * of the contiguous USA with Denton, Texas pinned as headquarters, routes from
 * Denton out to every state, and on to the Middle East and Africa. The US is
 * drawn to scale; the delivery regions are schematic.
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

/** The 48 contiguous states, each at its approximate centre, linked to
 *  headquarters and shown as unlabelled dots */
const states: { key: string; lon: number; lat: number }[] = [
  { key: "al", lon: -86.8, lat: 32.8 }, { key: "az", lon: -111.7, lat: 34.3 },
  { key: "ar", lon: -92.4, lat: 34.9 }, { key: "ca", lon: -119.5, lat: 37.2 },
  { key: "co", lon: -105.5, lat: 39.0 }, { key: "ct", lon: -72.7, lat: 41.6 },
  { key: "de", lon: -75.5, lat: 39.0 }, { key: "fl", lon: -81.7, lat: 28.4 },
  { key: "ga", lon: -83.4, lat: 32.7 }, { key: "id", lon: -114.6, lat: 44.4 },
  { key: "il", lon: -89.2, lat: 40.0 }, { key: "in", lon: -86.3, lat: 39.9 },
  { key: "ia", lon: -93.5, lat: 42.1 }, { key: "ks", lon: -98.4, lat: 38.5 },
  { key: "ky", lon: -85.3, lat: 37.5 }, { key: "la", lon: -92.0, lat: 31.0 },
  { key: "me", lon: -69.2, lat: 45.4 }, { key: "md", lon: -76.8, lat: 39.0 },
  { key: "ma", lon: -71.8, lat: 42.3 }, { key: "mi", lon: -84.7, lat: 43.6 },
  { key: "mn", lon: -94.3, lat: 46.3 }, { key: "ms", lon: -89.7, lat: 32.7 },
  { key: "mo", lon: -92.5, lat: 38.4 }, { key: "mt", lon: -109.6, lat: 47.0 },
  { key: "ne", lon: -99.8, lat: 41.5 }, { key: "nv", lon: -116.9, lat: 39.3 },
  { key: "nh", lon: -71.6, lat: 43.7 }, { key: "nj", lon: -74.7, lat: 40.1 },
  { key: "nm", lon: -106.1, lat: 34.4 }, { key: "ny", lon: -75.5, lat: 42.9 },
  { key: "nc", lon: -79.4, lat: 35.6 }, { key: "nd", lon: -100.5, lat: 47.5 },
  { key: "oh", lon: -82.8, lat: 40.3 }, { key: "ok", lon: -97.5, lat: 35.6 },
  { key: "or", lon: -120.6, lat: 43.9 }, { key: "pa", lon: -77.8, lat: 40.9 },
  { key: "ri", lon: -71.5, lat: 41.7 }, { key: "sc", lon: -80.9, lat: 33.9 },
  { key: "sd", lon: -100.2, lat: 44.4 }, { key: "tn", lon: -86.3, lat: 35.9 },
  { key: "tx", lon: -99.3, lat: 31.3 }, { key: "ut", lon: -111.7, lat: 39.3 },
  { key: "vt", lon: -72.7, lat: 44.0 }, { key: "va", lon: -78.8, lat: 37.5 },
  { key: "wa", lon: -120.5, lat: 47.4 }, { key: "wv", lon: -80.6, lat: 38.6 },
  { key: "wi", lon: -89.8, lat: 44.6 }, { key: "wy", lon: -107.5, lat: 43.0 },
];

type Pt = [number, number];

/** Each state in the drawing, with its distance from Denton as 0–1 so the
 *  hops can ripple outward from headquarters */
const statePts = (() => {
  const pts = states.map((s) => {
    const p = geo(s.lon, s.lat);
    return { key: s.key, p, dist: Math.hypot(p[0] - DENTON[0], p[1] - DENTON[1]) };
  });
  const max = Math.max(...pts.map((s) => s.dist));
  return pts.map((s) => ({ ...s, t: s.dist / max }));
})();

type Layout = "wide" | "compact";

/** The visible window of the drawing: the full width on larger screens; on
 *  phones a tighter crop, with the delivery regions drawn in closer */
const views: Record<Layout, { x: number; y: number; w: number; h: number }> = {
  wide: { x: 0, y: 0, w: 1000, h: 220 },
  compact: { x: 20, y: -10, w: 680, h: 250 },
};

/** Schematic spots for the delivery regions, per layout */
const regions: Record<Layout, { africa: Pt; mideast: Pt }> = {
  wide: { africa: [590, 158], mideast: [830, 92] },
  compact: { africa: [470, 115], mideast: [470, 20] },
};

interface Node {
  key: string;
  label?: string;
  sub?: string;
  /** Position in the drawing */
  x: number;
  y: number;
  /** Which side of the pin the label sits on */
  place?: "under" | "below" | "above" | "right";
  hub?: boolean;
  /** A US state: a small unlabelled dot */
  city?: boolean;
  /** Entrance order */
  i: number;
}

const nodesFor = (layout: Layout): Node[] => {
  const r = regions[layout];
  const side = layout === "compact" ? "right" : undefined;
  return [
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
    ...statePts.map((s): Node => ({ key: s.key, x: s.p[0], y: s.p[1], city: true, i: 1 + s.t * 2.2 })),
    { key: "africa", label: "Africa", sub: "Delivery region", x: r.africa[0], y: r.africa[1], place: side ?? "below", i: 4 },
    { key: "mideast", label: "Middle East", sub: "Delivery region", x: r.mideast[0], y: r.mideast[1], place: side ?? "above", i: 5 },
  ];
};

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
 *  every state first, nearest to farthest, then on to the delivery regions.
 *  `d` staggers them */
const routesFor = (layout: Layout): { key: string; pts: Pt[]; d: number; local?: boolean }[] => {
  const { africa, mideast } = regions[layout];
  const local = statePts.map((s) => ({ key: `to-${s.key}`, pts: arc(DENTON, s.p), d: s.t * 0.8, local: true }));
  if (layout === "compact") {
    return [
      ...local,
      { key: "to-africa", pts: arc(DENTON, africa, 0.25), d: 0.9 },
      { key: "to-mideast", pts: arc(DENTON, mideast, 0.3), d: 1.15 },
      { key: "africa-mideast", pts: arc(africa, mideast, 0.25), d: 1.4 },
    ];
  }
  return [
    ...local,
    { key: "to-africa", pts: [DENTON, [320, 50], [480, 60], africa], d: 0.9 },
    { key: "to-mideast", pts: [DENTON, [380, -12], [660, -6], mideast], d: 1.15 },
    { key: "africa-mideast", pts: [africa, [660, 140], [760, 128], mideast], d: 1.4 },
  ];
};

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
            A product and engineering company built for the long run. <span>One team takes your idea from first sketch to a
            product that scales, without ever changing hands.</span>
          </p>
          <p className={styles.body}>
            From our headquarters in Denton, strategists, designers and engineers work side by side, so the people
            who shape your product are the same people who build and ship it. We partner with founders and growing
            businesses across the United States, the Middle East and Africa, and we stay on after launch to measure,
            refine and keep what we built together moving forward.
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

        {/* Two crops of the same drawing: the full width, and a tighter one for phones */}
        {(["wide", "compact"] as const).map((layout) => {
          const v = views[layout];
          return (
            <div key={layout} className={styles.map} data-layout={layout}>
              <svg className={styles.svg} viewBox={`${v.x} ${v.y} ${v.w} ${v.h}`} aria-hidden="true">
                <defs>
                  <pattern id={`us-dots-${layout}`} width="4.2" height="4.2" patternUnits="userSpaceOnUse">
                    <circle className={styles.patternDot} cx="2.1" cy="2.1" r="0.95" />
                  </pattern>
                </defs>
                {/* The contiguous US, to scale: a soft fill, fine dots and a hairline edge */}
                <g className={styles.country}>
                  <path className={styles.countryFill} d={usPath} />
                  <path className={styles.countryDots} d={usPath} fill={`url(#us-dots-${layout})`} />
                  <path className={styles.countryEdge} d={usPath} />
                </g>
                {routesFor(layout).map((r) => (
                  <g key={r.key} style={{ "--d": `${r.d}s` } as CSSProperties} data-local={r.local || undefined}>
                    <path className={styles.route} d={pathFor(r.pts)} pathLength={1} />
                    <path className={styles.flow} d={pathFor(r.pts)} pathLength={100} />
                  </g>
                ))}
              </svg>

              {/* Nodes and labels in HTML so the type stays readable at any width */}
              {nodesFor(layout).map((n) => (
                <div
                  key={n.key}
                  className={styles.node}
                  data-hub={n.hub || undefined}
                  data-city={n.city || undefined}
                  data-place={n.place}
                  style={
                    {
                      left: `${((n.x - v.x) / v.w) * 100}%`,
                      top: `${((n.y - v.y) / v.h) * 100}%`,
                      "--i": n.i,
                    } as CSSProperties
                  }
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
          );
        })}
      </figure>
    </section>
  );
}
