import type { Metadata } from "next";
import Image from "next/image";
import { projects, capabilities } from "@/data/projects";
import ProjectArticle from "@/components/ProjectArticle";
import RevealObserver from "@/components/RevealObserver";
import ShowcaseCanvas from "@/components/ShowcaseCanvas";
import AboutSection from "@/components/AboutSection";
import ByTheNumbers, { type Stat } from "@/components/ByTheNumbers";
import CapabilityExplorer from "@/components/CapabilityExplorer";
import ClientReviews from "@/components/ClientReviews";
import HeroHeadline from "@/components/HeroHeadline";
import { BRAND, PROJECTS_URL, withBase } from "@/lib/site";
import styles from "./projects.module.css";

const ogImage = `${PROJECTS_URL}${withBase("/images/projects/quantiva-01-desktop.jpg")}`;

export const metadata: Metadata = {
  // The page shares the root segment with the layout, so its title template does not apply
  title: { absolute: `Projects & case studies — ${BRAND}` },
  description:
    "Selected work from BytesPlatform, including Quantiva HQ, IntelliMaint AI, Aegis Creek, Team Smith Logistics, The Benavente Group, Cascadia Health, Goldway Capital and SQUSH LLC. Product strategy, UI/UX, web and mobile engineering, AI and automation, growth and SEO.",
  alternates: { canonical: PROJECTS_URL },
  openGraph: {
    title: `Projects & case studies — ${BRAND}`,
    description: "Products, platforms and growth systems, designed and built end to end.",
    url: PROJECTS_URL,
    images: [{ url: ogImage, width: 2656, height: 1660, alt: "Quantiva HQ, built by BytesPlatform" }],
  },
  twitter: {
    title: `Projects & case studies — ${BRAND}`,
    description: "Products, platforms and growth systems, designed and built end to end.",
    images: [ogImage],
  },
};

/** Company figures, as stated by BytesPlatform. The illustrations are symbolic. */
const stats: Stat[] = [
  { value: 2, suffix: "+", label: "Years of continual excellence", kicker: "Track record", viz: "timeline" },
  { value: 300, suffix: "+", label: "Successful projects deployed", kicker: "Delivery", viz: "delivery" },
  { value: 90, suffix: "+", label: "Employees", kicker: "Team", viz: "team" },
  { value: 8, suffix: "+", label: "Industries served", kicker: "Reach", viz: "sectors" },
];

export default function ProjectsPage() {
  const total = projects.length;

  return (
    <>
      <RevealObserver />

      {/* ---- Hero ---------------------------------------------------- */}
      <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
        <div className={styles.heroStage}>
          <span className={styles.heroGlow} aria-hidden="true" />
          {/* A glint of gold runs along the hairline once it has drawn */}
          <span className={styles.heroGlint} aria-hidden="true" />
          <div className={styles.heroTop}>
            {/* Official BYTES. PLATFORM logo at its own proportions, kept alive by a slow light
                sweep (masked to the letters) and a soft pulse from its full stop */}
            <span
              className={styles.heroMark}
              style={{ "--logo": `url(${withBase("/images/bytes-platform-logo-dark.png")})` } as React.CSSProperties}
            >
              <Image
                src={withBase("/images/bytes-platform-logo-dark.png")}
                alt="BytesPlatform"
                width={1639}
                height={608}
                priority
                sizes="(max-width: 767px) 220px, 340px"
                className={styles.heroLogo}
              />
              <span className={styles.heroShine} aria-hidden="true">
                <span />
              </span>
              <span className={styles.heroPulse} aria-hidden="true" />
            </span>
            {/* Studio label, opposite the logo: quiet, never competing with the headline */}
            <p className={styles.portfolio}>
              <span className={styles.portfolioRule} aria-hidden="true" />
              <span className={`mono ${styles.portfolioLabel}`}>Portfolio</span>
              <span className={styles.portfolioLine}>This is just showing off.</span>
            </p>
          </div>
          <div className={styles.heroBody}>
            <div className={styles.heroMain}>
              <p className={`mono ${styles.eyebrow} ${styles.heroEyebrow}`}>
                <span className={styles.eyebrowDot} aria-hidden="true" />
                <span className={styles.heroEyebrowText}>
                  Selected work · {String(total).padStart(2, "0")} case studies
                </span>
              </p>
              {/* Kinetic headline: masked line reveal, then subtly alive */}
              <HeroHeadline className={styles.h1} />
              <p className={styles.lede}>
                BytesPlatform designs and engineers digital products, AI systems and search-driven growth. Every project
                below is shown through its real interfaces and the figures its case study can defend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- At a glance --------------------------------------------- */}
      <ShowcaseCanvas total={total} />

      {/* ---- About ---------------------------------------------------- */}
      <AboutSection />

      {/* ---- By the numbers ------------------------------------------ */}
      <ByTheNumbers stats={stats} />

      {/* ---- Client reviews ------------------------------------------ */}
      <ClientReviews />

      {/* ---- Capabilities -------------------------------------------- */}
      <CapabilityExplorer capabilities={capabilities} />

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
