"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import styles from "./GalleryCursor.module.css";

interface Props {
  /** Element whose `[data-gallery-frame]` children show the pill */
  areaRef: RefObject<HTMLElement | null>;
  accent: string;
  label?: string;
}

const LERP = 0.2;

/**
 * Floating "View Gallery ↗" pill that trails the cursor over project images.
 * Fine pointers with motion allowed only; touch and reduced-motion users keep
 * the native cursor. Rendered into <body> so transformed ancestors cannot
 * offset its fixed position.
 */
export default function GalleryCursor({ areaRef, accent, label = "View Gallery" }: Props) {
  const [enabled, setEnabled] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !rm.matches);
    update();
    fine.addEventListener("change", update);
    rm.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      rm.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const area = areaRef.current;
    if (!enabled || !area) return;
    area.dataset.cursor = "custom";

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let shown = false;
    let raf = 0;

    const tick = () => {
      pos.x += (target.x - pos.x) * LERP;
      pos.y += (target.y - pos.y) * LERP;
      const pill = pillRef.current;
      if (pill) pill.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      const settled = Math.abs(target.x - pos.x) < 0.1 && Math.abs(target.y - pos.y) < 0.1;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };

    const setShown = (next: boolean) => {
      if (next === shown) return;
      shown = next;
      pillRef.current?.toggleAttribute("data-on", next);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = e.target as Element;
      const over = !!el.closest("[data-gallery-frame]") && !el.closest("a");
      target.x = e.clientX;
      target.y = e.clientY;
      if (over && !shown) {
        // Appear at the pointer instead of sliding in from the last spot
        pos.x = target.x;
        pos.y = target.y;
      }
      setShown(over);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => setShown(false);
    // A click opens the viewer; get out of its way
    const onDown = () => setShown(false);

    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerleave", onLeave);
    area.addEventListener("pointerdown", onDown);
    return () => {
      delete area.dataset.cursor;
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      area.removeEventListener("pointerdown", onDown);
      cancelAnimationFrame(raf);
    };
  }, [enabled, areaRef]);

  if (!enabled) return null;

  return createPortal(
    <div ref={pillRef} className={styles.cursor} aria-hidden="true" style={{ "--accent": accent } as React.CSSProperties}>
      <span className={styles.pill}>
        <span>{label}</span>
        <i>↗</i>
      </span>
    </div>,
    document.body,
  );
}
