import { BRAND, main } from "@/lib/site";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer} id="contact">
      <div className={`container ${styles.inner}`}>
        <div className={styles.ctaBlock}>
          <p className="mono" style={{ color: "var(--muted)" }}>
            Next project
          </p>
          <h2 className={styles.cta}>
            Build something
            <br />
            worth showing.
          </h2>
          <a href={main.contact} className={styles.ctaLink}>
            <span>Start a conversation</span>
            <span className={styles.ctaCircle} aria-hidden="true">
              ↗
            </span>
          </a>
        </div>

        <div className={styles.cols}>
          <div>
            <p className="mono">{BRAND}</p>
            <p className={styles.small}>
              Product strategy, UI/UX, web and mobile engineering, AI and automation, growth and SEO.
            </p>
          </div>
          <div>
            <p className="mono">Contact</p>
            <p className={styles.small}>
              <a href="mailto:info@bytesplatform.com">info@bytesplatform.com</a>
              <span className={styles.phone}>
                <span className={`mono ${styles.phoneLabel}`}>Phone · Toll free</span>
                <a href="tel:+18333230371">+1 833 323 0371</a>
              </span>
              Denton, Texas
            </p>
          </div>
          <div>
            <p className="mono">Company</p>
            <p className={styles.small}>
              <a href={main.home}>bytesplatform.com</a>
              <br />
              <a href={main.about}>About</a>
              <br />
              <a href={`${main.home}#services`}>Services</a>
              <br />
              <a href={main.blogs}>Insights</a>
            </p>
          </div>
        </div>

        <div className={styles.legal}>
          <span>© {year} {BRAND}. All rights reserved.</span>
          <span>Selected work · figures sourced from client case studies</span>
        </div>
      </div>
    </footer>
  );
}
