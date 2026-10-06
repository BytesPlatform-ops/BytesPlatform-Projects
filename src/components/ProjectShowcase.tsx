"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Project, ProjectImage, ProjectImageRole, SwapStyle } from "@/data/projects";
import GalleryCursor from "./GalleryCursor";
import ImageLightbox from "./ImageLightbox";
import styles from "./ProjectShowcase.module.css";

interface Props {
  project: Project;
  priority?: boolean;
}

/** Grid slots in visual order. Slot 0 is the large frame. */
const SLOT_CLASS = [styles.main, styles.feature, styles.secondary, styles.mobile];
const INITIAL: ProjectImageRole[] = ["desktop", "feature", "secondary", "mobile"];

/** Desktop swap: slower and more cinematic than the text / CTA hovers (--t-ui) */
const SWAP_MS = 1800;
/**
 * Soft ease-in-out for the image replacement. The page curve (0.22, 1, 0.36, 1)
 * does most of its movement in the first fifth of the time, so even a long swap
 * looked quick; this spreads the movement evenly across the whole duration.
 */
const EASE = "cubic-bezier(0.45, 0, 0.2, 1)";
/** Touch swap: shorter, and without directional effects */
const TAP_SWAP_MS = 1000;
/** Hover intent: a thumbnail has to be hovered this long before it swaps */
const INTENT_MS = 150;
/** Sample count for the hand-eased keyframes */
const STEPS = 24;
/** The directional edge starts this much later than the anchored one (fraction of the swap) */
const LAG = 0.35;
/** Every image uses the large slot's `sizes`, so moving between slots never swaps its source */
const SIZES = "(max-width: 1023px) 100vw, 64vw";

type Box = { x: number; y: number; w: number; h: number };
/** Layout box, unaffected by transforms (hover scale, parallax, running animations) */
const boxOf = (el: HTMLElement): Box => ({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** CSS cubic-bezier() as a function, so keyframes can be sampled with the page easing */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const at = (u: number, a: number, b: number) => 3 * a * (1 - u) ** 2 * u + 3 * b * (1 - u) * u ** 2 + u ** 3;
  const slope = (u: number, a: number, b: number) =>
    3 * a * (1 - u) ** 2 + 6 * (b - a) * (1 - u) * u + 3 * (1 - b) * u ** 2;
  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let u = t;
    for (let i = 0; i < 8; i++) {
      const dx = at(u, x1, x2) - t;
      const d = slope(u, x1, x2);
      if (Math.abs(dx) < 1e-6 || Math.abs(d) < 1e-6) break;
      u = Math.min(1, Math.max(0, u - dx / d));
    }
    return at(u, y1, y2);
  };
}
/** EASE as a function, for the sampled flight keyframes */
const ease = cubicBezier(0.45, 0, 0.2, 1);

interface FlightOptions {
  /** Edge the reveal opens from. Omitted: a plain, symmetric move. */
  dir?: "ltr" | "rtl";
  /** Reveal flavour for the incoming image */
  style?: SwapStyle;
  /** Dip in opacity mid-flight (the outgoing image) */
  fade?: boolean;
}

/**
 * Sampled FLIP keyframes for a frame that has just moved from box `from` to box `to`.
 *
 * The frame is scaled uniformly (so the image keeps its aspect ratio) to cover
 * its old box and clipped to it with a matching corner radius, so the first
 * keyframe is pixel-identical to where it was. It then eases into its new box.
 *
 * With `dir`, the clip opens from that edge first while the opposite edge
 * follows LAG later: the image is revealed from the left (ltr) or right (rtl)
 * as it travels. `style` adds an angled leading edge (diagonal) or a soft
 * dissolve and pan (drift) on the inner media. Easing is baked into the
 * samples, so animate with `easing: "linear"`.
 */
function flight(el: HTMLElement, from: Box, to: Box, end: string, opts: FlightOptions = {}) {
  const k = Math.max(from.w / to.w, from.h / to.h);
  const cw = from.w / k;
  const ch = from.h / k;
  const img = el.querySelector("img");
  const py = img ? parseFloat(getComputedStyle(img).objectPosition.split(" ")[1] ?? "0") / 100 : 0;
  const ox = (to.w - cw) / 2;
  const oy = (to.h - ch) * (Number.isFinite(py) ? py : 0);
  const right0 = to.w - ox - cw;
  const bottom0 = to.h - oy - ch;
  // transform-origin stays at the centre so the end state matches the CSS transform
  const cx = to.w / 2;
  const cy = to.h / 2;
  const tx = from.x - to.x - cx - k * (ox - cx);
  const ty = from.y - to.y - cy - k * (oy - cy);
  const r = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
  const sign = opts.dir === "rtl" ? -1 : 1;

  const frame: Keyframe[] = [];
  const media: Keyframe[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const e = ease(t);
    // Anchored edge opens first, the directional edge follows
    const first = opts.dir ? ease(Math.min(1, t / (1 - LAG))) : e;
    const second = opts.dir ? ease(Math.max(0, (t - LAG) / (1 - LAG))) : e;
    const left = ox * (1 - (opts.dir === "rtl" ? second : first));
    const right = right0 * (1 - (opts.dir === "rtl" ? first : second));
    const s = k + (1 - k) * e;

    const kf: Keyframe = {
      offset: t,
      transform: i === STEPS ? end : `translate(${tx * (1 - e)}px, ${ty * (1 - e)}px) scale(${s})`,
      clipPath: `inset(${oy * (1 - e)}px ${right}px ${bottom0 * (1 - e)}px ${left}px round ${r / s}px)`,
    };
    if (opts.fade) kf.opacity = 1 - 0.3 * Math.sin(Math.PI * t);
    frame.push(kf);

    if (opts.dir && opts.style === "diagonal") {
      // Angled leading edge, widest mid-flight, straight at both ends
      const sk = 0.16 * to.h * Math.sin(Math.PI * second);
      const x = opts.dir === "rtl" ? left : to.w - right;
      media.push({
        offset: t,
        clipPath:
          opts.dir === "rtl"
            ? `polygon(100% 0px, ${x - sk}px 0px, ${x + sk}px 100%, 100% 100%)`
            : `polygon(0px 0px, ${x + sk}px 0px, ${x - sk}px 100%, 0px 100%)`,
      });
    } else if (opts.dir && opts.style === "drift") {
      const wave = Math.sin(Math.PI * t);
      media.push({ offset: t, opacity: 1 - 0.35 * wave, transform: `translate3d(${sign * 1.5 * wave}%, 0, 0)` });
    }
  }
  return { frame, media: media.length ? media : null };
}

/** An absolutely positioned layer over a grid box, inserted under the pill */
function layer(host: HTMLElement, before: Element | null, box: Box, className: string, z: number) {
  const el = document.createElement("div");
  el.className = className;
  el.setAttribute("aria-hidden", "true");
  Object.assign(el.style, {
    left: `${box.x}px`,
    top: `${box.y}px`,
    width: `${box.w}px`,
    height: `${box.h}px`,
    zIndex: String(z),
  });
  host.insertBefore(el, before);
  return el;
}

function applyMask(el: HTMLElement, mask: { image: string; size: string } | null) {
  if (!mask) return;
  for (const prefix of ["", "-webkit-"]) {
    el.style.setProperty(`${prefix}mask-image`, mask.image);
    el.style.setProperty(`${prefix}mask-size`, mask.size);
    el.style.setProperty(`${prefix}mask-repeat`, "no-repeat");
  }
}

/**
 * Desktop swap: both slots are already in their final state, each covered by a
 * "curtain" (a copy of what it showed before). The curtains are wiped away
 * together from the project's edge with a soft edge, so the large image and the
 * thumbnail change in one synchronized movement. A thin accent light rides the
 * large frame's leading edge.
 * ltr opens from the left edge, rtl from the right.
 */
function curtainFrames(style: SwapStyle, dir: "ltr" | "rtl", w: number, h: number) {
  const ltr = dir === "ltr";
  if (style === "diagonal") {
    // Hard, slanted edge
    const sk = 0.12 * w;
    const poly = (x: number) =>
      ltr
        ? `polygon(${x + sk}px 0px, ${w + sk * 2}px 0px, ${w + sk * 2}px 100%, ${x - sk}px 100%)`
        : `polygon(-${sk * 2}px 0px, ${x - sk}px 0px, ${x + sk}px 100%, -${sk * 2}px 100%)`;
    // Start and end far enough out that the slanted edge fully clears the frame
    const from = ltr ? -2 * sk : w + 2 * sk;
    const to = ltr ? w + 2 * sk : -2 * sk;
    return {
      curtain: [{ clipPath: poly(from) }, { clipPath: poly(to) }],
      edge: { from, to, skew: (Math.atan2(2 * sk, h) * 180) / Math.PI * (ltr ? -1 : 1) },
      mask: null,
    };
  }
  // Soft edge: a px-sized gradient mask slid across the frame
  const e = (style === "drift" ? 0.5 : 0.24) * w;
  const image = ltr
    ? `linear-gradient(90deg, transparent ${w}px, #000 ${w + e}px)`
    : `linear-gradient(90deg, #000 ${w}px, transparent ${w + e}px)`;
  const a = ltr ? -(w + e) : 0;
  const b = ltr ? 0 : -(w + e);
  return {
    curtain: [{ maskPosition: `${a}px 0px` }, { maskPosition: `${b}px 0px` }],
    edge: { from: ltr ? -e / 2 : w + e / 2, to: ltr ? w + e / 2 : -e / 2, skew: 0 },
    mask: { image, size: `${2 * w + e}px 100%` },
  };
}

/**
 * The dark media composition for one project: a large frame, three smaller
 * frames and a metrics panel.
 *
 * Hovering a small frame (or tapping it on touch screens) promotes its image
 * to the large slot while the large image takes the small one's place. Each
 * image keeps its own DOM element and only changes grid slot, so there is no
 * source replacement; a FLIP animation carries both frames between slots.
 *
 * Desktop: a thumbnail swaps after a short hover intent, over SWAP_MS, and
 * the promoted image is revealed from the project's `motion.direction` edge
 * in its `motion.swap` style. Touch: tap to swap, shorter and undirected.
 *
 * Per-project recipe from `project.motion`: reveal style and direction,
 * mouse pan and zoom amounts, optional parallax, edge trace and wash.
 * Clicking the large frame (or any frame with a mouse) opens the fullscreen
 * viewer, which expands from and collapses into the thumbnail.
 */
export default function ProjectShowcase({ project, priority = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const enabled = useRef(false);
  const fine = useRef(false);
  const pointer = useRef<{ x: number; y: number } | null>(null);

  const [slots, setSlots] = useState<ProjectImageRole[]>(INITIAL);
  const slotsRef = useRef(slots);
  const figs = useRef<Partial<Record<ProjectImageRole, HTMLElement | null>>>({});
  const medias = useRef<Partial<Record<ProjectImageRole, HTMLElement | null>>>({});
  const pending = useRef<{
    inRole: ProjectImageRole;
    outRole: ProjectImageRole;
    from: [Box, Box];
    hovered: boolean;
    touch: boolean;
  } | null>(null);
  const intent = useRef<number | null>(null);
  const busy = useRef(false);
  // Last slot the pointer entered: a swap fires only on entering a different one
  const lastSlot = useRef<number | null>(null);
  const [active, setActive] = useState<number | null>(null);

  const { images, motion } = project;

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      fine.current = mq.matches;
      enabled.current = mq.matches && !rm.matches;
    };
    update();
    mq.addEventListener("change", update);
    rm.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      rm.removeEventListener("change", update);
      if (raf.current) cancelAnimationFrame(raf.current);
      if (intent.current) window.clearTimeout(intent.current);
    };
  }, []);

  const clearIntent = () => {
    if (intent.current) window.clearTimeout(intent.current);
    intent.current = null;
  };

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    pointer.current = { x: e.clientX, y: e.clientY };
    if (!enabled.current || !ref.current) return;
    const el = ref.current;
    const { clientX, clientY } = e;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const x = (clientX - r.left) / r.width; // 0..1
      const y = (clientY - r.top) / r.height;
      el.style.setProperty("--mx", (x - 0.5) * 2 + ""); // -1..1
      el.style.setProperty("--my", (y - 0.5) * 2 + "");
      el.style.setProperty("--lx", `${(x * 100).toFixed(2)}%`);
      el.style.setProperty("--ly", `${(y * 100).toFixed(2)}%`);
    });
  }, []);

  const onLeave = useCallback(() => {
    clearIntent();
    pointer.current = null;
    lastSlot.current = null;
    if (!ref.current) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    ref.current.style.setProperty("--mx", "0");
    ref.current.style.setProperty("--my", "0");
  }, []);

  /** Trade the image in `slot` with the large image */
  const promote = useCallback((slot: number, hovered: boolean, touch: boolean) => {
    if (slot <= 0 || busy.current) return;
    const cur = slotsRef.current;
    const inRole = cur[slot];
    const outRole = cur[0];
    const a = figs.current[inRole];
    const b = figs.current[outRole];
    if (!a || !b) return;
    lastSlot.current = slot;
    const next = [...cur];
    next[0] = inRole;
    next[slot] = outRole;
    slotsRef.current = next;
    if (!reducedMotion()) {
      pending.current = { inRole, outRole, from: [boxOf(a), boxOf(b)], hovered, touch };
      busy.current = true;
    }
    setSlots(next);
  }, []);

  /** After a swap, catch up with wherever the pointer went in the meantime */
  const settle = useCallback(() => {
    const pt = pointer.current;
    if (!pt || !fine.current) return;
    const el = document.elementFromPoint(pt.x, pt.y)?.closest<HTMLElement>("[data-slot]");
    const slot = el && ref.current?.contains(el) ? Number(el.dataset.slot) : null;
    if (slot !== null && slot > 0 && slot !== lastSlot.current) promote(slot, true, false);
    else lastSlot.current = slot;
  }, [promote]);

  // FLIP: both frames are already in their new slots; animate them in from the old ones
  useLayoutEffect(() => {
    const p = pending.current;
    if (!p) return;
    pending.current = null;
    const roles = [p.inRole, p.outRole];
    const anims: Animation[] = [];
    const timing = { duration: p.touch ? TAP_SWAP_MS : SWAP_MS, easing: "linear" };
    const layers: HTMLElement[] = [];

    const inEl = figs.current[p.inRole];
    const inMedia = medias.current[p.inRole];
    const outMedia = medias.current[p.outRole];
    const host = inEl?.offsetParent as HTMLElement | null;
    const grid = inEl?.parentElement ?? null;

    if (!p.touch && inEl && inMedia && outMedia && host && grid) {
      // ---- Desktop: directional curtain wipe over the large frame ----
      const [thumb, large] = p.from;
      const ease = { duration: SWAP_MS, easing: EASE };
      // The wipe starts a beat late so the swap reads as a deliberate, slower move
      const wipe = { duration: SWAP_MS - 150, delay: 150, easing: EASE, fill: "backwards" as const };
      const c = curtainFrames(motion.swap, motion.direction, large.w, large.h);

      // The incoming image sits in the large slot under the curtain, drifting
      // in from the side its thumbnail came from
      const side = Math.sign(thumb.x + thumb.w / 2 - (large.x + large.w / 2)) || 1;
      anims.push(
        inMedia.animate(
          [{ transform: `translate3d(${side * 1.5}%, 0, 0) scale(1.05)` }, { transform: "translate3d(0, 0, 0) scale(1)" }],
          ease,
        ),
      );
      inEl.dataset.flight = "in";

      // Curtain: the outgoing image, held in place and wiped away
      const curtain = layer(host, grid, large, styles.ghost, 4);
      curtain.appendChild(outMedia.cloneNode(true));
      applyMask(curtain, c.mask);
      anims.push(curtain.animate(c.curtain as Keyframe[], wipe));
      layers.push(curtain);

      // Accent light riding the leading edge
      const sheen = layer(host, grid, large, styles.ghostSheen, 4);
      const line = document.createElement("span");
      sheen.appendChild(line);
      const skew = c.edge.skew ? ` skewX(${c.edge.skew}deg)` : "";
      anims.push(
        line.animate(
          [
            { transform: `translateX(${c.edge.from}px)${skew}`, opacity: 0 },
            { transform: `translateX(${c.edge.from + (c.edge.to - c.edge.from) * 0.12}px)${skew}`, opacity: 1, offset: 0.08 },
            { transform: `translateX(${c.edge.from + (c.edge.to - c.edge.from) * 0.85}px)${skew}`, opacity: 0.9, offset: 0.45 },
            { transform: `translateX(${c.edge.to}px)${skew}`, opacity: 0 },
          ],
          wipe,
        ),
      );
      layers.push(sheen);

      // The vacated thumbnail keeps showing its image until the old large one lands there
      // The thumbnail changes the same way, in step: its old image is wiped
      // away in the same direction, revealing the previous large image in place.
      // Nothing flies across the grid, so there is no double exposure.
      const t = curtainFrames(motion.swap, motion.direction, thumb.w, thumb.h);
      const stand = layer(host, grid, thumb, styles.ghost, 4);
      stand.appendChild(inMedia.cloneNode(true));
      applyMask(stand, t.mask);
      anims.push(stand.animate(t.curtain as Keyframe[], wipe));
      layers.push(stand);

      const outMedia2 = medias.current[p.outRole];
      if (outMedia2) {
        anims.push(outMedia2.animate([{ transform: "scale(1.05)" }, { transform: "scale(1)" }], ease));
      }
    } else roles.forEach((role, i) => {
      const el = figs.current[role];
      if (!el) return;
      const incoming = i === 0;
      // The outgoing frame lands under the cursor, where the hovered-thumbnail scale applies
      const end = !incoming && p.hovered ? "scale(1.02)" : getComputedStyle(el).transform;
      // Directional reveal for the promoted image on desktop only; the old one shrinks and dims
      const opts = incoming
        ? p.touch
          ? {}
          : { dir: motion.direction, style: motion.swap }
        : { fade: true };
      const f = flight(el, p.from[i], boxOf(el), end, opts);
      el.dataset.flight = incoming ? "in" : "out";
      anims.push(el.animate(f.frame, timing));
      const media = medias.current[role];
      if (f.media && media) anims.push(media.animate(f.media, timing));
    });

    Promise.allSettled(anims.map((a) => a.finished)).then(() => {
      roles.forEach((role) => {
        const el = figs.current[role];
        if (el) delete el.dataset.flight;
      });
      layers.forEach((l) => l.remove());
      busy.current = false;
      settle();
    });
  }, [slots, motion.swap, motion.direction, settle]);

  const onEnterSlot = (slot: number) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !fine.current) return;
    clearIntent();
    if (busy.current || slot === lastSlot.current) return;
    if (slot === 0) {
      lastSlot.current = 0;
      return;
    }
    // Hover intent: passing over a thumbnail on the way somewhere else does nothing
    intent.current = window.setTimeout(() => {
      intent.current = null;
      promote(slot, true, false);
    }, INTENT_MS);
  };

  const onFrameClick = (slot: number, keyboard: boolean) => {
    // Touch tap or keyboard on a small frame promotes it; the large frame opens the viewer.
    // A mouse click on a small frame opens what it shows (hover already promoted).
    if ((!fine.current || keyboard) && slot > 0) {
      const role = slotsRef.current[slot];
      promote(slot, false, !fine.current);
      requestAnimationFrame(() => {
        const el = figs.current[role];
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top < 64 || r.bottom > window.innerHeight) {
          el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
        }
      });
      return;
    }
    setActive(slot);
  };

  // Viewer order follows what is on screen: large image first
  const gallery = slots.map((role) => images[role]);
  const getSource = useCallback((index: number) => medias.current[slotsRef.current[index]] ?? null, []);
  const close = useCallback(() => setActive(null), []);

  return (
    <div
      ref={ref}
      className={styles.showcase}
      data-sweep={project.sweep}
      data-parallax={motion.parallax ? "" : undefined}
      data-edge={motion.edgeTrace ? "" : undefined}
      style={{ "--pan": `${motion.pan}px`, "--zoom": motion.zoom } as React.CSSProperties}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {motion.edgeTrace && <span className={styles.edge} aria-hidden="true" />}
      <span className={styles.light} aria-hidden="true" />

      <div className={styles.grid}>
        {/* Each image keeps one element for life and only changes grid slot */}
        {INITIAL.map((role) => {
          const slot = slots.indexOf(role);
          const image = images[role];
          return (
            <figure
              key={role}
              ref={(el) => {
                figs.current[role] = el;
              }}
              className={`${styles.frame} ${SLOT_CLASS[slot]}`}
              data-slot={slot}
              data-gallery-frame
              onPointerEnter={onEnterSlot(slot)}
              onPointerLeave={clearIntent}
            >
              <Frame
                image={image}
                priority={priority && role === "desktop"}
                mediaRef={(el) => {
                  medias.current[role] = el;
                }}
                label={slot === 0 ? `Enlarge image: ${image.label}` : `${image.label}: show as main image`}
                onClick={(e) => onFrameClick(slot, e.detail === 0)}
              />
            </figure>
          );
        })}

        {/* The live-site pill belongs to the large slot, whichever image is in it */}
        <div className={styles.pillSlot}>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.pill}
            aria-label={`View ${project.name} live`}
          >
            <span>View project</span>
            <i aria-hidden="true">
              <span>↗</span>
            </i>
          </a>
        </div>

        <div className={styles.panel}>
          <p className={`mono ${styles.panelEyebrow}`}>{project.sector}</p>
          <dl className={styles.metrics}>
            {project.metrics.map((m) => (
              <div key={m.label} className={styles.metric}>
                <dd>{m.value}</dd>
                <dt>{m.label}</dt>
              </div>
            ))}
          </dl>
          <p className={styles.panelSource}>{project.metricsSource}</p>
        </div>
      </div>

      <GalleryCursor areaRef={ref} accent={project.accent} />

      <ImageLightbox
        images={gallery}
        index={active}
        title={project.name}
        accent={project.accent}
        getSource={getSource}
        onIndexChange={setActive}
        onClose={close}
      />
    </div>
  );
}

interface FrameProps {
  image: ProjectImage;
  priority?: boolean;
  label: string;
  mediaRef: (el: HTMLElement | null) => void;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function Frame({ image, priority = false, label, mediaRef, onClick }: FrameProps) {
  return (
    <>
      <button type="button" className={styles.zoom} onClick={onClick} aria-label={label} />
      <span ref={mediaRef} className={styles.media}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={SIZES}
          priority={priority}
          quality={90}
          draggable={false}
        />
      </span>
      <span className={styles.sweep} aria-hidden="true" />
      <span className={styles.caption}>
        <b>{image.label}</b>
        <span>{image.caption}</span>
      </span>
    </>
  );
}
