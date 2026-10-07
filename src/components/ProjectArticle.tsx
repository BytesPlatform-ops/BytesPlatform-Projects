import type { CSSProperties } from "react";
import type { Project } from "@/data/projects";
import ProjectShowcase from "./ProjectShowcase";
import styles from "./ProjectArticle.module.css";

interface Props {
  project: Project;
  total: number;
  priority?: boolean;
}

/** Scroll-reveal stagger step for header, metadata and body */
const st = (step: number) => ({ "--sd": `${step * 70}ms` }) as CSSProperties;

function AccessLink({ href, label, name, strong = false }: { href: string; label: string; name: string; strong?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.accessLink} ${strong ? styles.accessStrong : ""}`}
      aria-label={`${label}: ${name}`}
    >
      <span>{label}</span>
      <i aria-hidden="true">
        <span>↗</span>
      </i>
    </a>
  );
}

export default function ProjectArticle({ project, total, priority = false }: Props) {
  const { access } = project;
  const [sectorMain, ...more] = project.sector.split(" · ");
  const sectorRest = more.join(" · ");
  const appLinks = access?.apps?.map((app) => (
    <AccessLink
      key={app.platform}
      href={app.href}
      label={`View on ${app.platform}`}
      name={project.name}
      strong={access.emphasis === "app"}
    />
  ));
  const vars = {
    "--accent": project.accent,
    "--accent-soft": project.accentSoft,
    "--dark": project.dark,
  } as CSSProperties;

  return (
    <article
      id={project.slug}
      className={styles.project}
      style={vars}
      data-sweep={project.sweep}
      data-wash={project.motion.wash ? "strong" : undefined}
      data-reveal
    >
      <header className={styles.head}>
        <div className={styles.headMain}>
          <p className={`mono ${styles.index} ${styles.st}`} style={st(0)}>
            <span className={styles.indexDot} aria-hidden="true" />
            {/* Each digit rolls up into place on reveal */}
            <span className={styles.num} aria-hidden="true">
              {[...project.index].map((c, i) => (
                <span key={i} className={styles.digit} style={{ "--ci": i } as CSSProperties}>
                  <span>{c}</span>
                </span>
              ))}
            </span>
            <span className="sr-only">{project.index}</span> / {String(total).padStart(2, "0")}
            <span className={styles.indexSep} aria-hidden="true">
              —
            </span>
            {/* Phones show only the short category before the first "·" */}
            {sectorMain}
            {sectorRest && <span className={styles.sectorRest}> · {sectorRest}</span>}
          </p>
          <h2 className={`${styles.title} ${styles.st}`} style={st(1)}>
            <span>{project.name}</span>
          </h2>
          <p className={`${styles.headline} ${styles.st}`} style={st(2)}>
            {project.headline}
          </p>
          <p className={`${styles.brief} ${styles.st}`} style={st(2)}>
            {project.brief}
          </p>
        </div>

        <dl className={styles.meta}>
          <div className={`${styles.st} ${styles.metaDetail}`} style={st(3)}>
            <dt className="mono">Client</dt>
            <dd>{project.client}</dd>
          </div>
          <div className={`${styles.st} ${styles.metaDetail}`} style={st(4)}>
            <dt className="mono">Scope</dt>
            <dd>{project.services.slice(0, 3).join(" · ")}</dd>
          </div>
          {access ? (
            <div className={`${styles.access} ${styles.st}`} style={st(5)} data-emphasis={access.emphasis}>
              <dt className="mono">Platforms</dt>
              <dd className={styles.accessNote}>{access.note}</dd>
              <dd className={styles.accessLinks}>
                {/* Order follows emphasis: store apps first where mobile is the core product */}
                {access.emphasis === "app" && appLinks}
                <AccessLink href={access.website} label="View Website" name={project.name} />
                {access.emphasis !== "app" && appLinks}
              </dd>
            </div>
          ) : (
            <div className={`${styles.metaLink} ${styles.st}`} style={st(5)}>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
                <span>View Website</span>
                <i aria-hidden="true">↗</i>
              </a>
            </div>
          )}
        </dl>
      </header>

      <ProjectShowcase project={project} priority={priority} />

      <div className={styles.body}>
        <div className={`${styles.copy} ${styles.st}`} style={st(6)}>
          <p className={styles.summary}>{project.summary}</p>
          <h3 className={`mono ${styles.builtTitle}`}>What we built</h3>
          <ol className={styles.built}>
            {project.built.map((item, i) => (
              <li key={i}>
                <span className={styles.builtNum} aria-hidden="true">
                  0{i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <aside className={`${styles.aside} ${styles.st}`} style={st(7)}>
          <p className={`mono ${styles.asideLabel}`}>Services</p>
          <ul className={styles.tags}>
            {project.services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          {project.disclosure && <p className={styles.disclosure}>{project.disclosure}</p>}

          <div className={styles.ctas}>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.primary}>
              <span>View project</span>
              <span className={styles.primaryCircle} aria-hidden="true">
                <span>↗</span>
              </span>
            </a>
            <a href={project.caseStudyUrl} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
              <span>{project.caseStudyLabel}</span>
              <i aria-hidden="true">↗</i>
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}
