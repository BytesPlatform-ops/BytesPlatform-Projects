"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ProjectImage } from "@/data/projects";
import styles from "./ImageLightbox.module.css";

interface Props {
  images: ProjectImage[];
  /** Index of the image to show, or null when the viewer is closed. */
  index: number | null;
  title: string;
  accent: string;
  /** Thumbnail element for an image; the viewer grows out of it and collapses back into it */
  getSource?: (index: number) => HTMLElement | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const CLOSE_MS = 450;
const OPEN_MS = 700;
const COLLAPSE_MS = 600;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const SWIPE_PX = 50;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The thumbnail <img> currently showing `src` inside a source element */
function findThumb(source: HTMLElement, src: string) {
  return (
    // Skip the decorative blurred backdrop: the sharp screenshot is the one to expand from
    Array.from(source.querySelectorAll<HTMLImageElement>("img:not([aria-hidden])")).find((img) =>
      decodeURIComponent(img.currentSrc || img.src).includes(src),
    ) ?? source.querySelector<HTMLImageElement>("img:not([aria-hidden])")
  );
}

/** Where an object-fit: contain image actually paints inside its box */
function containedRect(img: HTMLImageElement, box: DOMRect) {
  const { naturalWidth: nw, naturalHeight: nh } = img;
  if (!nw || !nh) return box;
  const k = Math.min(box.width / nw, box.height / nh);
  const w = nw * k;
  const h = nh * k;
  const [px, py] = getComputedStyle(img)
    .objectPosition.split(" ")
    .map((v) => parseFloat(v) / 100);
  const left = box.left + (box.width - w) * (Number.isFinite(px) ? px : 0.5);
  const top = box.top + (box.height - h) * (Number.isFinite(py) ? py : 0.5);
  return new DOMRect(left, top, w, h);
}

/**
 * FLIP keyframes from a thumbnail to the full viewer figure. The figure is
 * scaled to cover the thumbnail's visible image and clipped to it, so the
 * first frame matches it exactly. A contained thumbnail starts from the
 * screenshot itself, not the blurred area around it.
 */
function expandFrames(source: HTMLElement, fig: HTMLElement, src: string): Keyframe[] | null {
  const thumb = findThumb(source, src);
  const box = source.getBoundingClientRect();
  const contained = !!thumb && getComputedStyle(thumb).objectFit === "contain";
  const s = contained ? containedRect(thumb, box) : box;
  const stage = fig.parentElement?.getBoundingClientRect();
  const w = fig.offsetWidth;
  const h = fig.offsetHeight;
  if (!stage || !w || !h || !s.width || !s.height) return null;
  // Untransformed figure position: centred in the stage
  const fx = stage.left + (stage.width - w) / 2;
  const fy = stage.top + (stage.height - h) / 2;

  const [px, py] = (thumb && !contained ? getComputedStyle(thumb).objectPosition : "50% 0%")
    .split(" ")
    .map((v) => parseFloat(v) / 100);

  const k = Math.max(s.width / w, s.height / h);
  const cw = s.width / k;
  const ch = s.height / k;
  const ox = (w - cw) * (Number.isFinite(px) ? px : 0.5);
  const oy = (h - ch) * (Number.isFinite(py) ? py : 0);
  const frame = source.closest("figure");
  // A contained screenshot only has the frame's rounded corners where it fills the frame
  const fills = !contained || (Math.abs(s.width - box.width) < 1 && Math.abs(s.height - box.height) < 1);
  const r0 = frame && fills ? parseFloat(getComputedStyle(frame).borderTopLeftRadius) || 0 : 0;
  const r1 = parseFloat(getComputedStyle(fig).borderTopLeftRadius) || 0;

  return [
    {
      transformOrigin: "0 0",
      transform: `translate(${s.left - fx - ox * k}px, ${s.top - fy - oy * k}px) scale(${k})`,
      clipPath: `inset(${oy}px ${w - ox - cw}px ${h - oy - ch}px ${ox}px round ${r0 / k}px)`,
    },
    {
      transformOrigin: "0 0",
      transform: "translate(0px, 0px) scale(1)",
      clipPath: `inset(0px 0px 0px 0px round ${r1}px)`,
    },
  ];
}

/**
 * Fullscreen viewer for one project's images.
 *
 * Opening expands the clicked thumbnail into place (FLIP); closing collapses
 * the current image back into its thumbnail. Reduced motion gets a plain fade.
 * Closes on the close button, a click outside the image, or ESC.
 * Arrow keys, the Previous / Next buttons and horizontal swipes browse
 * the project's images. Focus is trapped while open and restored after.
 */
export default function ImageLightbox({ images, index, title, accent, getSource, onIndexChange, onClose }: Props) {
  // Keep the last image mounted while the close animation plays
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [flip, setFlip] = useState(false);
  const lastIndex = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const figRef = useRef<HTMLElement>(null);
  const anim = useRef<Animation | null>(null);
  const hiddenSource = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const open = index !== null;
  const count = images.length;
  if (index !== null) lastIndex.current = index;

  // The thumbnail is "lifted out" of the page while it is in flight
  const hideSource = (el: HTMLElement) => {
    restoreSource();
    el.style.visibility = "hidden";
    hiddenSource.current = el;
  };
  const restoreSource = () => {
    if (hiddenSource.current) hiddenSource.current.style.visibility = "";
    hiddenSource.current = null;
  };

  // Expand out of / collapse into the thumbnail. Layout effect: measure before paint.
  useLayoutEffect(() => {
    const fig = figRef.current;
    if (!fig) return;
    const i = lastIndex.current;
    const source = getSource?.(i) ?? null;
    const frames = source && !reducedMotion() ? expandFrames(source, fig, images[i].src) : null;
    anim.current?.cancel();

    if (open) {
      setMounted(true);
      setFlip(!!frames);
      if (!frames || !source) return;
      hideSource(source);
      const a = fig.animate(frames, { duration: OPEN_MS, easing: EASE });
      a.onfinish = a.oncancel = restoreSource;
      anim.current = a;
      return;
    }

    setVisible(false);
    if (frames && source) {
      setFlip(true);
      hideSource(source);
      const a = fig.animate([...frames].reverse(), { duration: COLLAPSE_MS, easing: EASE, fill: "forwards" });
      a.onfinish = () => {
        restoreSource();
        setMounted(false);
      };
      a.oncancel = restoreSource;
      anim.current = a;
      return;
    }
    setFlip(false);
    const t = window.setTimeout(() => setMounted(false), CLOSE_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => restoreSource(), []);

  // The thumbnail's already-loaded image stands in while the large one loads
  const shownIndex = lastIndex.current;
  useLayoutEffect(() => {
    const fig = figRef.current;
    if (!fig) return;
    const source = getSource?.(shownIndex);
    const thumb = source ? findThumb(source, images[shownIndex].src) : null;
    fig.style.backgroundImage = thumb?.currentSrc ? `url("${thumb.currentSrc}")` : "";
  }, [shownIndex, mounted, open, getSource, images]);

  // Enter animation and focus handling
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => {
      setVisible(true);
      closeRef.current?.focus({ preventScroll: true });
    });
    return () => {
      cancelAnimationFrame(raf);
      returnFocus.current?.focus({ preventScroll: true });
    };
  }, [open]);

  // Scroll lock lasts until the collapse has finished, so nothing shifts mid-flight
  const locked = open || mounted;
  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const scrollbar = window.innerWidth - html.clientWidth;
    const prevOverflow = html.style.overflow;
    const prevPadding = html.style.paddingRight;
    html.style.overflow = "hidden";
    if (scrollbar > 0) html.style.paddingRight = `${scrollbar}px`;
    return () => {
      html.style.overflow = prevOverflow;
      html.style.paddingRight = prevPadding;
    };
  }, [locked]);

  const go = useCallback(
    (step: number) => {
      if (index === null || count < 2) return;
      onIndexChange((index + step + count) % count);
    },
    [index, count, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Tab" && rootRef.current) {
        const focusable = rootRef.current.querySelectorAll<HTMLElement>("button");
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  if ((!open && !mounted) || typeof document === "undefined") return null;
  const shown = lastIndex.current;
  const image = images[shown];
  if (!image) return null;

  // Anything that is not the image or a control counts as "outside"
  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.target as Element).closest("[data-lb-keep]")) onClose();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = e.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
  };

  return createPortal(
    <div
      ref={rootRef}
      className={styles.root}
      data-state={visible ? "open" : "closed"}
      data-flip={flip ? "" : undefined}
      role="dialog"
      aria-modal="true"
      aria-label={`${title}: image ${shown + 1} of ${count}`}
      style={{ "--accent": accent } as React.CSSProperties}
      onClick={onBackdropClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.backdrop} aria-hidden="true" />

      <button
        ref={closeRef}
        type="button"
        className={`${styles.btn} ${styles.close}`}
        onClick={onClose}
        aria-label="Close image viewer"
        data-lb-keep
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div className={styles.stage}>
        <figure ref={figRef} className={styles.figure} style={{ "--ratio": image.width / image.height } as React.CSSProperties}>
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="90vw"
            quality={92}
            className={styles.img}
            draggable={false}
            data-lb-keep
          />
        </figure>
      </div>

      <div className={styles.bar}>
        {count > 1 && (
          <button
            type="button"
            className={`${styles.btn} ${styles.nav} ${styles.prev}`}
            onClick={() => go(-1)}
            aria-label="Previous image"
            data-lb-keep
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
        )}

        <p className={styles.label} aria-live="polite">
          <span className={styles.labelTitle}>
            {title}
            <span className={styles.labelSep} aria-hidden="true">
              —
            </span>
            {image.label}
          </span>
          <span className={styles.labelMeta}>
            <span className={styles.counter}>
              {String(shown + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <span className={styles.caption}>{image.caption}</span>
          </span>
        </p>

        {count > 1 && (
          <button
            type="button"
            className={`${styles.btn} ${styles.nav} ${styles.next}`}
            onClick={() => go(1)}
            aria-label="Next image"
            data-lb-keep
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}
