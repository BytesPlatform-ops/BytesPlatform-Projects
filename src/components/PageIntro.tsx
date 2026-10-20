import styles from "./PageIntro.module.css";

const WORD = "BYTES".split("");

/**
 * Brand intro markup, after the main BytesPlatform site: BYTES. appears with a
 * progress count at the bottom left; once the page has loaded and the count
 * reads 100, the word tilts, closes in on its white dot, and the page opens
 * through that dot.
 *
 * Everything is driven by the inline head script (src/lib/intro.ts) and CSS,
 * never by React, so the intro runs the same however long hydration takes.
 * The count is drawn from a data attribute the script updates, so React never
 * owns (or fights over) its text.
 */
export default function PageIntro() {
  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.word}>
        <span className={styles.lockup}>
          <span className={styles.mask}>
            {WORD.map((ch, i) => (
              <span key={i} className={styles.char} style={{ "--i": i } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
          {/* The page opens through this dot */}
          <i className={styles.dot} data-intro-dot />
        </span>
      </div>
      <div className={styles.progress}>
        {/* The head script writes data-n and the bar's transform before React hydrates */}
        <span className={styles.count} data-intro-count suppressHydrationWarning />
        <span className={styles.bar} data-intro-bar suppressHydrationWarning />
      </div>
    </div>
  );
}
