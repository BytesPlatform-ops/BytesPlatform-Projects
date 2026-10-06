"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./SiteHeader.module.css";

const nav = [
  { href: "/projects", label: "Work" },
  { href: "/projects#capabilities", label: "Capabilities" },
  { href: "https://bytesplatform.com/about", label: "About" },
  { href: "https://bytesplatform.com/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 900 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={styles.header}>
      <a href="#main" className={`${styles.skip} sr-only`}>
        Skip to content
      </a>
      <div className={`container ${styles.inner}`}>
        <Link href="/projects" className={styles.brand} aria-label="BytesPak home">
          <span className={styles.brandMark} aria-hidden="true" />
          BytesPak
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.label} href={item.href} className={styles.navLink}>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <a href="https://bytesplatform.com/contact" className={styles.cta}>
          Start a project
          <i aria-hidden="true">↗</i>
        </a>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span data-open={open} />
        </button>
      </div>

      <div id="mobile-nav" className={styles.sheet} data-open={open} aria-hidden={!open}>
        <nav aria-label="Mobile">
          {nav.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={styles.sheetLink}
              style={{ transitionDelay: `${60 + i * 40}ms` }}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
            >
              <span className="mono">0{i + 1}</span>
              {item.label}
            </Link>
          ))}
          <a
            href="https://bytesplatform.com/contact"
            className={styles.sheetCta}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            Start a project ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
