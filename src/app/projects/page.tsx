import type { Metadata } from "next";
import Image from "next/image";
import { projects, capabilities } from "@/data/projects";
import ProjectArticle from "@/components/ProjectArticle";
import RevealObserver from "@/components/RevealObserver";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects & case studies",
  description:
    "Selected work from BytesPak, including Quantiva HQ, IntelliMaint AI, Aegis Creek, Team Smith Logistics, The Benavente Group, Cascadia Health, Goldway Capital and SQUSH LLC. Product strategy, UI/UX, web and mobile engineering, AI and automation, growth and SEO.",
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
        <div className={styles.heroStage}>
          <span className={styles.heroGlow} aria-hidden="true" />
          {/* Official BYTES. PLATFORM logo, shown at its own proportions */}
          <Image
            src="/images/bytes-platform-logo-dark.png"
            alt="Bytes Platform"
            width={1639}
            height={608}
            priority
            sizes="(max-width: 767px) 220px, 340px"
            className={styles.heroLogo}
          />
          <p className={`mono ${styles.eyebrow} ${styles.heroEyebrow}`}>
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
          <p className={styles.lede}>
            BytesPak designs and engineers digital products, AI systems and search-driven growth. Every project below
            is shown through its real interfaces and the figures its case study can defend.
          </p>
        </div>
      </section>

      {/* ---- About ---------------------------------------------------- */}
      <section className={`container ${styles.intro}`} id="capabilities" aria-labelledby="intro-title" data-reveal>
        <div className={styles.aboutHead}>
          <div className={styles.introLead}>
            <p className={`mono ${styles.eyebrow} ${styles.introEyebrow}`}>
              <span className={styles.introRule} aria-hidden="true" />
              About
            </p>
            {/* Each line rises out of its own mask on reveal */}
            <h2 id="intro-title" className={`${styles.h2} ${styles.introTitle}`}>
              <span className={styles.line}>
                <span>One team,</span>
              </span>
              <span className={styles.line}>
                <span>strategy to scale.</span>
              </span>
            </h2>
          </div>
          <p className={styles.introText}>
            BytesPak is a modern digital product and engineering company, building websites, software platforms, AI
            systems, automation workflows and growth infrastructure for businesses in 2026. We bring strategy, design,
            development and search-driven execution together in one team, to ship products that are usable, scalable
            and commercially effective.
          </p>
        </div>

        <div className={styles.capHead}>
          <p className={`mono ${styles.eyebrow}`}>Capabilities</p>
          <span className={`mono ${styles.capCount}`}>{String(capabilities.length).padStart(2, "0")}</span>
        </div>
        <ol
          className={styles.disciplines}
          style={{ "--rows": Math.ceil(capabilities.length / 2) } as React.CSSProperties}
        >
          {capabilities.map((c, i) => (
            <li key={c.title} className={styles.discipline} style={{ "--i": i } as React.CSSProperties}>
              <span className={`mono ${styles.disciplineIndex}`}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className={styles.disciplineTitle}>
                  <span>{c.title}</span>
                </h3>
                <p className={styles.disciplineBody}>{c.body}</p>
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
