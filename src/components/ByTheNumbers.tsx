"use client";

import { useRef, type CSSProperties } from "react";
import { useReveal } from "@/lib/useReveal";
import styles from "./ByTheNumbers.module.css";

export interface Stat {
  value: number;
  suffix: string;
  label: string;
  /** Short mono kicker above the figure */
  kicker: string;
  viz: "timeline" | "delivery" | "team" | "sectors";
}

const DURATION = 1300;
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Company figures as telemetry modules. Each figure counts up once when the
 * row comes into view; its illustration then draws in. The illustrations are
 * deliberately abstract (no axes, values or dates): they set the figure in
 * context, they are not measured data.
 */
export default function ByTheNumbers({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLElement>(null);

  useReveal(ref, {
    threshold: 0.35,
    onIn: (instant) => {
      const el = ref.current;
      if (!el) return;
      const outputs = Array.from(el.querySelectorAll<HTMLElement>("[data-count]"));
      if (instant) {
        el.dataset.done = "";
        return;
      }
      for (const o of outputs) o.textContent = "0";
      const start = performance.now();
      requestAnimationFrame(function tick(now) {
        const t = Math.min(1, (now - start) / DURATION);
        const e = easeOutQuart(t);
        for (const o of outputs) o.textContent = String(Math.round(Number(o.dataset.count) * e));
        if (t < 1) requestAnimationFrame(tick);
        else el.dataset.done = "";
      });
    },
  });

  return (
    <section ref={ref} className={`container ${styles.section}`} aria-labelledby="numbers-title">
      <div className={styles.head}>
        <h2 id="numbers-title" className={`mono ${styles.eyebrow}`}>
          <span className={styles.rule} aria-hidden="true" />
          By the numbers
        </h2>
      </div>

      <ol className={styles.list}>
        {stats.map((s, i) => (
          <li key={s.label} className={styles.module} style={{ "--i": i } as CSSProperties}>
            <div className={styles.top}>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              <span className={`mono ${styles.kicker}`}>{s.kicker}</span>
            </div>
            <p className={styles.figure} aria-label={`${s.value}${s.suffix} ${s.label}`}>
              {/* Width reserved for the final value, so counting never shifts the layout */}
              <span className={styles.digits} aria-hidden="true" style={{ minWidth: `${String(s.value).length}ch` }}>
                <span data-count={s.value}>{s.value}</span>
                <span className={styles.suffix}>{s.suffix}</span>
              </span>
            </p>
            <p className={styles.label} aria-hidden="true">
              {s.label}
            </p>
            <div className={styles.viz} aria-hidden="true">
              {s.viz === "timeline" && <Timeline />}
              {s.viz === "delivery" && <Delivery />}
              {s.viz === "team" && <Team />}
              {s.viz === "sectors" && <Sectors />}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

const v = (n: number) => ({ "--n": n }) as CSSProperties;

/** 2+: a milestone track, start to today, that keeps going */
function Timeline() {
  const stops = [
    { x: 14, label: "Start" },
    { x: 104, label: "Year 1" },
    { x: 194, label: "Year 2" },
    { x: 266, label: "Now" },
  ];
  return (
    <svg viewBox="0 0 300 88" className={styles.svg}>
      <line className={styles.base} x1="14" y1="40" x2="292" y2="40" />
      <line className={styles.progress} x1="14" y1="40" x2="266" y2="40" pathLength={1} />
      {/* Beyond today: dashed, open-ended */}
      <line className={styles.ahead} x1="272" y1="40" x2="296" y2="40" />
      {stops.map((s, i) => (
        <g key={s.label} className={styles.stop} style={v(i)}>
          <circle
            cx={s.x}
            cy="40"
            r={i === stops.length - 1 ? 5 : 3.5}
            className={i === stops.length - 1 ? styles.now : undefined}
          />
          <text x={s.x} y="66" textAnchor={i === 0 ? "start" : "middle"}>
            {s.label}
          </text>
        </g>
      ))}
      <circle cx="266" cy="40" r="5" className={styles.ring} />
    </svg>
  );
}

/** 300+: delivery bars that build up, with a sparkline over their tops */
const BARS = Array.from({ length: 30 }, (_, i) => {
  const t = i / 29;
  const h = 12 + 50 * Math.pow(t, 1.25) + 7 * Math.sin(i * 1.7) * (0.4 + t * 0.6);
  return Math.round(Math.max(8, Math.min(66, h)));
});

function Delivery() {
  const step = 9.4;
  const x = (i: number) => 9 + i * step;
  const points = BARS.map((h, i) => `${x(i) + 2.5},${74 - h - 5}`).join(" ");
  const last = BARS.length - 1;
  return (
    <svg viewBox="0 0 300 88" className={styles.svg}>
      <line className={styles.base} x1="4" y1="74.5" x2="296" y2="74.5" />
      {BARS.map((h, i) => (
        <rect key={i} className={styles.bar} x={x(i)} y={74 - h} width="5" height={h} rx="1.5" style={v(i)} />
      ))}
      <polyline className={styles.spark} points={points} pathLength={1} />
      <circle className={styles.now} cx={x(last) + 2.5} cy={74 - BARS[last] - 5} r="3.5" />
      <circle className={styles.ring} cx={x(last) + 2.5} cy={74 - BARS[last] - 5} r="3.5" />
    </svg>
  );
}

/** 90+: a team as a network: a core, an inner circle and a wider team */
const CX = 150;
const CY = 42;
const ring = (count: number, rx: number, ry: number, offset: number) =>
  Array.from({ length: count }, (_, i) => {
    const a = offset + (i / count) * Math.PI * 2;
    // Rounded so server and browser render identical attributes
    return { x: Math.round((CX + rx * Math.cos(a)) * 10) / 10, y: Math.round((CY + ry * Math.sin(a)) * 10) / 10 };
  });
const INNER = ring(6, 58, 22, -Math.PI / 2);
const OUTER = ring(14, 128, 36, -Math.PI / 2 + 0.22);

function Team() {
  return (
    <svg viewBox="0 0 300 88" className={styles.svg}>
      <ellipse className={styles.orbit} cx={CX} cy={CY} rx="58" ry="22" />
      <ellipse className={styles.orbit} cx={CX} cy={CY} rx="128" ry="36" />
      {INNER.map((p, i) => (
        <line key={`l${i}`} className={styles.link} x1={CX} y1={CY} x2={p.x} y2={p.y} pathLength={1} style={v(i)} />
      ))}
      {OUTER.map((p, i) => (
        <circle key={`o${i}`} className={styles.member} cx={p.x} cy={p.y} r="2.6" style={v(i)} />
      ))}
      {INNER.map((p, i) => (
        <circle key={`i${i}`} className={styles.lead} cx={p.x} cy={p.y} r="3.6" style={v(i)} />
      ))}
      <circle className={styles.now} cx={CX} cy={CY} r="6" />
      <circle className={styles.ring} cx={CX} cy={CY} r="6" />
    </svg>
  );
}

/** 8+: the industries served, as tiles that light up one after another */
const SECTORS = ["Fintech", "AI", "Health", "Property", "Logistics", "Public", "Local", "B2B"];

function Sectors() {
  const w = 70;
  const h = 32;
  const gap = 6;
  return (
    <svg viewBox="0 0 300 88" className={styles.svg}>
      {SECTORS.map((name, i) => {
        const x = 1 + (i % 4) * (w + gap);
        const y = 6 + Math.floor(i / 4) * (h + gap);
        return (
          <g key={name} className={styles.sector} style={v(i)}>
            <rect x={x} y={y} width={w} height={h} rx="5" />
            <text x={x + w / 2} y={y + h / 2 + 3} textAnchor="middle">
              {name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
