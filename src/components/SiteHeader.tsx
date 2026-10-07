"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./SiteHeader.module.css";

const nav = [
  { href: "/projects", label: "Work" },
  { href: "/projects#capabilities", label: "Capabilities" },
  { href: "https://bytesplatform.com/about", label: "About" },
  { href: "https://bytesplatform.com/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  // The drawer is portalled to <body>: inside the header, whose backdrop-filter
  // makes it the containing block for fixed children, it collapsed to 0px tall
  // and its links spilled over the page with no background behind them.
  const [mounted, setMounted] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const scrollbar = window.innerWidth - html.clientWidth;
    const prev = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    html.style.overflow = "hidden";
    if (scrollbar > 0) html.style.paddingRight = `${scrollbar}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      // Keep keyboard focus inside the drawer while it is open
      if (e.key !== "Tab" || !drawerRef.current) return;
      const items = drawerRef.current.querySelectorAll<HTMLElement>("a, button");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onResize = () => window.innerWidth > 900 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    const focus = requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
    const burger = burgerRef.current;
    return () => {
      cancelAnimationFrame(focus);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      html.style.overflow = prev.overflow;
      html.style.paddingRight = prev.paddingRight;
      burger?.focus({ preventScroll: true });
    };
  }, [open]);

  const close = () => setOpen(false);

  const drawer = (
    <div className={styles.drawerRoot} data-open={open} aria-hidden={!open}>
      <div className={styles.backdrop} onClick={close} />
      <div
        ref={drawerRef}
        id="mobile-nav"
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className={styles.drawerHead}>
          <Link href="/projects" className={styles.brand} onClick={close} tabIndex={open ? 0 : -1}>
            <span className={styles.brandMark} aria-hidden="true" />
            BytesPak
          </Link>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            aria-label="Close menu"
            onClick={close}
            tabIndex={open ? 0 : -1}
          >
            <span aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile" className={styles.drawerNav}>
          {nav.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={styles.sheetLink}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              onClick={close}
              tabIndex={open ? 0 : -1}
            >
              <span className="mono">0{i + 1}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <a href="https://bytesplatform.com/contact" className={styles.sheetCta} onClick={close} tabIndex={open ? 0 : -1}>
          Start a project ↗
        </a>
      </div>
    </div>
  );

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
          ref={burgerRef}
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <span />
        </button>
      </div>

      {mounted && createPortal(drawer, document.body)}
    </header>
  );
}
