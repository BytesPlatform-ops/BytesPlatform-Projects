import type { Metadata } from "next";
import { projects, disciplines } from "@/data/projects";
import ProjectArticle from "@/components/ProjectArticle";
import RevealObserver from "@/components/RevealObserver";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects & case studies",
  description:
    "Selected work from BytesPak: Quantiva HQ, IntelliMaint AI, Aegis Creek, Team Smith Logistics and The Benavente Group. Product strategy, UI/UX, web and mobile engineering, AI and automation, growth and SEO.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects & case studies — BytesPak",
    description: "Products, platforms and growth systems, designed and built end to end.",
    images: [{ url: "/images/projects/quantiva-01-desktop.jpg", width: 2656, height: 1660 }],
  },
};

export default function ProjectsPage() {
  const total = projects.length;

  return (
    <>
      <RevealObserver />

      {/* ---- Hero ---------------------------------------------------- */}
      <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
        <p className={`mono ${styles.eyebrow}`}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
          Selected work · {String(total).padStart(2, "0")} case studies
        </p>
        <h1 id="hero-title" className={styles.h1}>
          Products, platforms
          <br />
          and growth systems,
          <br />
          <em>built end to end.</em>
        </h1>

        <div className={styles.heroFoot}>
          <p className={styles.lede}>
            BytesPak designs and engineers digital products, AI systems and search-driven growth. Every project below
            is shown through its real interfaces and the figures its case study can defend.
          </p>

          <ol className={styles.indexList} aria-label="Projects on this page">
            {projects.map((p) => (
              <li key={p.slug}>
                <a href={`#${p.slug}`} className={styles.indexItem} style={{ "--accent": p.accent } as React.CSSProperties}>
                  <span className="mono">{p.index}</span>
                  <span className={styles.indexName}>{p.name}</span>
                  <span className={styles.indexSector}>{p.sector}</span>
                  <i aria-hidden="true">↓</i>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Intro / capabilities ------------------------------------ */}
      <section className={`container ${styles.intro}`} id="capabilities" aria-labelledby="intro-title" data-reveal>
        <div className={styles.introLead}>
          <p className={`mono ${styles.eyebrow}`}>What BytesPak does</p>
          <h2 id="intro-title" className={styles.h2}>
            Strategy through
            <br />
            production.
          </h2>
          <p className={styles.introText}>
            BytesPak combines product strategy, UI/UX, web and mobile engineering, AI and automation, and growth and SEO
            where it matters. One team carries the work from the first positioning decision to the production release
            and the search results after it, so the finished product is both usable and measurable.
          </p>
        </div>

        <ol className={styles.disciplines}>
          {disciplines.map((d) => (
            <li key={d.index} className={styles.discipline}>
              <span className={`mono ${styles.disciplineIndex}`}>{d.index}</span>
              <div>
                <h3 className={styles.disciplineTitle}>
                  <span>{d.title}</span>
                </h3>
                <p className={styles.disciplineBody}>{d.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---- Projects ------------------------------------------------ */}
      <section className="container" id="work" aria-labelledby="work-title">
        <div className={styles.sectionHead} data-reveal>
          <h2 id="work-title" className={styles.h2}>
            Selected work.
          </h2>
          <p className={styles.sectionNote}>
            One dominant experience per project, with mobile, feature and proof visuals. Every metric is sourced from
            the project's case study; where a figure is not yet available, it is not claimed.
          </p>
        </div>

        {projects.map((p, i) => (
          <ProjectArticle key={p.slug} project={p} total={total} priority={i === 0} />
        ))}
      </section>
    </>
  );
}
