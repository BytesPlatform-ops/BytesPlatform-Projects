"use client";

import Image from "next/image";
import { useId, useRef, useState, type CSSProperties } from "react";
import type { Capability } from "@/data/projects";
import { withBase } from "@/lib/site";
import { useReveal } from "@/lib/useReveal";
import styles from "./CapabilityExplorer.module.css";

/**
 * Capabilities as an explorer: the list on the left, one live preview on the
 * right. Hover or focus a row on desktop to switch the preview; on phones each
 * row is an accordion that opens its preview in place.
 *
 * Previews are real project screens (named only where the case study supports
 * it) or light HTML/SVG diagrams of how the work flows. Nothing here is a
 * mock product screenshot.
 */

type Visual =
  | { kind: "screens"; main: Screen; phone?: Screen }
  | { kind: "flow"; steps: Step[] }
  | { kind: "pipeline" }
  | { kind: "visibility" };

interface Screen {
  src: string;
  width: number;
  height: number;
  alt: string;
}
interface Step {
  label: string;
  sub: string;
  chips?: string[];
}
interface Preview {
  visual: Visual;
  /** Case studies that list this kind of work */
  related?: string[];
}

const screen = (file: string, width: number, height: number, alt: string): Screen => ({
  src: withBase(file),
  width,
  height,
  alt,
});

const previews: Record<string, Preview> = {
  "AI Automation & Intelligent Workflows": {
    visual: {
      kind: "flow",
      steps: [
        { label: "Trigger", sub: "A request, form or new record arrives" },
        { label: "AI step", sub: "Classify, extract and decide" },
        { label: "Actions", sub: "Run, log and monitor", chips: ["Update CRM", "Notify team", "Create task"] },
      ],
    },
  },
  "AI Agents & Business Assistants": {
    visual: {
      kind: "screens",
      main: screen(
        "/images/projects/intellimaint-02-app.jpg",
        1448,
        1086,
        "IntelliMaint AI app screens: equipment photo history, the welcome screen and document upload",
      ),
    },
    related: ["IntelliMaint AI"],
  },
  "Custom SaaS & Product Development": {
    visual: {
      kind: "screens",
      main: screen(
        "/images/projects/quantiva-02-app.jpg",
        1400,
        826,
        "Quantiva HQ app screens: trade ideas, the portfolio dashboard and the order ticket",
      ),
    },
    related: ["Quantiva HQ", "This Week in Public Health"],
  },
  "Web & Mobile App Development": {
    visual: {
      kind: "screens",
      main: screen(
        "/images/projects/cascadia-01-desktop-hero.jpg",
        1440,
        814,
        "Cascadia Health website homepage: the right care team, right when it matters",
      ),
      phone: screen("/images/montage/cascadia-phone.jpg", 405, 835, "Cascadia Health homepage on mobile"),
    },
    related: ["Cascadia Health", "Quantiva HQ"],
  },
  "CRM & ERP Systems": {
    visual: {
      kind: "screens",
      main: screen(
        "/images/projects/sqush-crm-dashboard.jpg",
        1911,
        861,
        "SQUSH LLC operations CRM dashboard: pending requests, active jobs, deliveries and invoices",
      ),
    },
    related: ["SQUSH LLC"],
  },
  "SEO & Organic Growth": {
    visual: { kind: "visibility" },
    related: ["The Benavente Group", "Team Smith Logistics", "Gilbert & Sons", "Jobco Supply"],
  },
  "AI Search & Generative Engine Optimization": {
    visual: {
      kind: "flow",
      steps: [
        { label: "Question", sub: "A buyer asks an AI assistant" },
        {
          label: "AI discovery",
          sub: "Engines read and compare sources",
          chips: ["ChatGPT", "Gemini", "Perplexity", "AI search"],
        },
        { label: "Answer", sub: "Built to be the source it cites" },
      ],
    },
    related: ["This Week in Public Health", "Nexus Alliance", "Fairpath Consultants"],
  },
  "Government Opportunity & Proposal Technology": {
    visual: {
      kind: "flow",
      steps: [
        { label: "Opportunity", sub: "Find and track public-sector openings" },
        { label: "Qualification", sub: "Fit, requirements and go / no-go" },
        { label: "Response", sub: "Draft, review and submit" },
      ],
    },
  },
  "Public-Sector Digital Solutions": {
    visual: {
      kind: "screens",
      main: screen(
        "/images/projects/nexus-01-desktop.jpg",
        1440,
        814,
        "Nexus Alliance website homepage for government-contract operational support",
      ),
    },
    related: ["Nexus Alliance"],
  },
  "UAE eInvoicing & Business System Integration": {
    visual: {
      kind: "flow",
      steps: [
        { label: "ERP data", sub: "Invoices from your business systems" },
        { label: "Mapping", sub: "Fields mapped to the e-invoice format" },
        { label: "Validation", sub: "Checked before exchange", chips: ["Structure", "Tax fields", "Totals"] },
        { label: "Exchange", sub: "Sent through the e-invoicing network" },
      ],
    },
  },
};

export default function CapabilityExplorer({ capabilities }: { capabilities: Capability[] }) {
  const ref = useRef<HTMLElement>(null);
  const uid = useId();
  // -1: every row closed (phones only; wide screens always show a preview)
  const [active, setActive] = useState(0);
  const shown = active < 0 ? 0 : active;
  useReveal(ref, { threshold: 0.12 });

  const wide = () => window.matchMedia("(min-width: 1024px)").matches;
  const current = capabilities[shown];

  return (
    <section ref={ref} className={`container ${styles.section}`} id="capabilities" aria-labelledby="capabilities-title">
      <div className={styles.head}>
        <div>
          <p className={`mono ${styles.eyebrow}`}>
            <span className={styles.rule} aria-hidden="true" />
            Capabilities
          </p>
          <h2 id="capabilities-title" className={styles.title}>
            What we build, <em>and how it works.</em>
          </h2>
        </div>
        <p className={styles.note}>
          {capabilities.length} disciplines, one delivery team. Choose one to see the kind of system behind it.
        </p>
      </div>

      <div className={styles.explorer}>
        <ol className={styles.list}>
          {capabilities.map((c, i) => {
            const open = active === i;
            return (
              <li
                key={c.title}
                className={styles.item}
                data-active={i === shown || undefined}
                data-open={open || undefined}
                style={{ "--i": i } as CSSProperties}
              >
                <button
                  type="button"
                  className={styles.row}
                  aria-expanded={open}
                  aria-controls={`${uid}-panel-${i}`}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse" && wide()) setActive(i);
                  }}
                  onFocus={() => wide() && setActive(i)}
                  onClick={() => setActive(wide() ? i : open ? -1 : i)}
                >
                  <span className={`mono ${styles.index}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.rowTitle}>{c.title}</span>
                  <span className={styles.chevron} aria-hidden="true" />
                </button>
                {/* Phones: the preview opens in place under its row */}
                <div id={`${uid}-panel-${i}`} className={styles.inline} hidden={!open}>
                  {open && <PreviewBody capability={c} />}
                </div>
              </li>
            );
          })}
        </ol>

        {/* Wide screens: one shared preview panel */}
        <aside className={styles.panel} aria-label={`Preview: ${current.title}`}>
          <div className={`mono ${styles.panelTop}`}>
            <span>
              <span className={styles.liveDot} aria-hidden="true" />
              Preview
            </span>
            <span>
              {String(shown + 1).padStart(2, "0")} / {String(capabilities.length).padStart(2, "0")}
            </span>
          </div>
          <PreviewBody key={current.title} capability={current} />
        </aside>
      </div>
    </section>
  );
}

function PreviewBody({ capability }: { capability: Capability }) {
  const preview = previews[capability.title];
  return (
    <div className={styles.preview}>
      <div className={styles.stage}>{preview && <VisualView visual={preview.visual} />}</div>
      <div className={styles.meta}>
        <h3 className={styles.metaTitle}>{capability.title}</h3>
        <p className={styles.metaBody}>{capability.body}</p>
        {preview?.related && (
          <p className={styles.related}>
            <span className="mono">Related work</span>
            {preview.related.map((name) => (
              <span key={name} className={styles.chip}>
                {name}
              </span>
            ))}
          </p>
        )}
        {capability.href && (
          <a href={capability.href} className={styles.link}>
            <span>Explore the service</span>
            <i aria-hidden="true">↗</i>
          </a>
        )}
      </div>
    </div>
  );
}

function VisualView({ visual }: { visual: Visual }) {
  switch (visual.kind) {
    case "screens":
      return <Screens main={visual.main} phone={visual.phone} />;
    case "flow":
      return <Flow steps={visual.steps} />;
    case "pipeline":
      return <Pipeline />;
    case "visibility":
      return <Visibility />;
  }
}

const n = (i: number) => ({ "--n": i }) as CSSProperties;

function Screens({ main, phone }: { main: Screen; phone?: Screen }) {
  return (
    <div className={styles.screens} data-with-phone={phone ? "" : undefined}>
      <div className={styles.shot} style={{ aspectRatio: `${main.width} / ${main.height}` }}>
        <Image
          src={main.src}
          alt={main.alt}
          width={main.width}
          height={main.height}
          sizes="(max-width: 1023px) 90vw, 46vw"
        />
      </div>
      {phone && (
        <div className={styles.phoneShot} style={{ aspectRatio: `${phone.width} / ${phone.height}` }}>
          <Image
            src={phone.src}
            alt={phone.alt}
            width={phone.width}
            height={phone.height}
            sizes="(max-width: 1023px) 26vw, 12vw"
          />
        </div>
      )}
    </div>
  );
}

/** Steps joined by connectors; a highlight travels along them in turn */
function Flow({ steps }: { steps: Step[] }) {
  return (
    <ol className={styles.flow} style={{ "--steps": steps.length } as CSSProperties}>
      {steps.map((s, i) => (
        <li key={s.label} className={styles.step} style={n(i)}>
          <span className={`mono ${styles.stepIndex}`}>{String(i + 1).padStart(2, "0")}</span>
          <strong>{s.label}</strong>
          <span className={styles.stepSub}>{s.sub}</span>
          {s.chips && (
            <span className={styles.chips}>
              {s.chips.map((c, j) => (
                <span key={c} className={styles.miniChip} style={n(j)}>
                  {c}
                </span>
              ))}
            </span>
          )}
          {i < steps.length - 1 && <span className={styles.connector} aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

/** CRM & ERP: a deal moving through a pipeline, synced to the ERP below */
function Pipeline() {
  const stages = ["Lead", "Qualified", "Proposal", "Won"];
  const cards = [3, 2, 2, 1];
  return (
    <div className={styles.pipeline}>
      <div className={styles.columns}>
        {stages.map((s, i) => (
          <div key={s} className={styles.column} style={n(i)}>
            <span className={`mono ${styles.columnHead}`}>{s}</span>
            {Array.from({ length: cards[i] }, (_, j) => (
              <span key={j} className={styles.card} style={n(i * 3 + j)}>
                <i />
                <i />
              </span>
            ))}
          </div>
        ))}
        <span className={styles.mover} aria-hidden="true">
          <i />
          <i />
        </span>
      </div>
      <div className={styles.sync}>
        <span className="mono">CRM</span>
        <span className={styles.syncLine} aria-hidden="true" />
        <span className="mono">ERP</span>
      </div>
    </div>
  );
}

/** SEO: visibility compounding across the work's phases (no values) */
function Visibility() {
  const phases = ["Technical", "Content", "Local", "Authority"];
  return (
    <div className={styles.visibility}>
      <svg viewBox="0 0 400 180" className={styles.chart} aria-hidden="true">
        {[45, 90, 135].map((y) => (
          <line key={y} className={styles.gridLine} x1="0" x2="400" y1={y} y2={y} />
        ))}
        <path
          className={styles.area}
          d="M0 168 C 70 166, 110 150, 150 132 S 250 70, 300 52 S 370 22, 400 14 L 400 180 L 0 180 Z"
        />
        <path
          className={styles.curve}
          d="M0 168 C 70 166, 110 150, 150 132 S 250 70, 300 52 S 370 22, 400 14"
          pathLength={1}
        />
      </svg>
      <ol className={styles.phases}>
        {phases.map((p, i) => (
          <li key={p} style={n(i)}>
            <span className={styles.phaseDot} aria-hidden="true" />
            <span className="mono">{p}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
