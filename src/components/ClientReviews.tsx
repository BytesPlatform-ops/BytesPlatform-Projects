"use client";

import { useRef, type CSSProperties } from "react";
import { useReveal } from "@/lib/useReveal";
import styles from "./ClientReviews.module.css";

/**
 * Client reviews, quoted as published on Trustpilot. Two columns of quiet
 * cards on hairlines; they rise in turn as the section comes into view.
 */

const TRUSTPILOT_URL = "https://www.trustpilot.com/review/bytesplatform.com";

/** The Trustpilot star */
const TP_STAR = "M12 2l2.6 7.4H22l-6 4.5 2.3 7.6L12 16.9l-6.3 4.6L8 13.9 2 9.4h7.4z";

interface Review {
  title: string;
  quote: string;
  name: string;
  role: string;
  /** Month of the review, ISO (YYYY-MM) and as shown */
  date: string;
  dateLabel: string;
  /** The reviewer's Trustpilot profile */
  url: string;
}

const reviews: Review[] = [
  {
    title: "Hands down the best",
    quote:
      "Matt has been helping me with my company’s website and the team has knocked it out of the park. Not only did they do my company’s website but they took on my company’s social media and excelled. Now I am giving them all of my other ventures.",
    name: "Robert Gilbert",
    role: "Business owner",
    date: "2026-09",
    dateLabel: "Sep 2026",
    url: "https://www.trustpilot.com/users/6ad2919170b39bb32ffb36aa",
  },
  {
    title: "Professional, responsive, and committed",
    quote:
      "They have taken the time to understand what we are trying to build rather than simply completing a list of technical tasks. Building a custom system from the ground up requires collaboration, flexibility, and trust, and so far Bytesplatform has demonstrated all three.",
    name: "Brenda Gatoru",
    role: "Custom platform client",
    date: "2026-09",
    dateLabel: "Sep 2026",
    url: "https://www.trustpilot.com/users/6a9c1302186db6423b39911b",
  },
  {
    title: "A true technology partner",
    quote:
      "Their team transformed our vision into powerful, professional digital platforms. Their commitment went beyond simply completing a project — they approached the work as a true technology partner invested in our success.",
    name: "George Wrighster",
    role: "Founder, QuantivaHQ",
    date: "2026-08",
    dateLabel: "Aug 2026",
    url: "https://www.trustpilot.com/users/6a91e13becc1642aeb0833ab",
  },
  {
    title: "Concept to finished product, faster than expected",
    quote:
      "Communication was constant. He grasped the objective early and translated it into a working product without losing the intent behind it, and the turnaround from concept to finished deliverable was faster than I planned for.",
    name: "John Glamdon",
    role: "GovCon software platform",
    date: "2026-08",
    dateLabel: "Aug 2026",
    url: "https://www.trustpilot.com/users/6a900903ecc1642aeb0557ed",
  },
];

function Stars() {
  return (
    <span className={styles.stars} role="img" aria-label="Rated 5 out of 5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
        </svg>
      ))}
    </span>
  );
}

export default function ClientReviews() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { threshold: 0.15 });

  return (
    <section ref={ref} className={`container ${styles.section}`} id="reviews" aria-labelledby="reviews-title">
      <div className={styles.head}>
        <h2 id="reviews-title" className={`mono ${styles.eyebrow}`}>
          <span className={styles.rule} aria-hidden="true" />
          Client reviews
        </h2>
      </div>

      <ol className={styles.list}>
        {reviews.map((r, i) => (
          <li key={r.name} className={styles.review} style={{ "--i": i } as CSSProperties}>
            <a
              className={styles.reviewLink}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${r.title}, review by ${r.name} on Trustpilot (opens in a new tab)`}
            >
              <article>
                <div className={styles.top}>
                  <Stars />
                  <time className={`mono ${styles.date}`} dateTime={r.date}>
                    {r.dateLabel}
                  </time>
                </div>
                <div className={styles.titleRow}>
                  <h3 className={styles.title}>{r.title}</h3>
                  {/* Trustpilot mark: white star on its green tile */}
                  <span className={styles.tpMark} aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d={TP_STAR} />
                    </svg>
                  </span>
                </div>
                <blockquote className={styles.quote}>
                  <p>“{r.quote}”</p>
                </blockquote>
                <p className={styles.author}>
                  <strong>{r.name}</strong>
                  <span>{r.role}</span>
                </p>
              </article>
            </a>
          </li>
        ))}
      </ol>

      <a className={styles.trustpilot} href={TRUSTPILOT_URL} target="_blank" rel="noopener noreferrer">
        <span>Read all reviews on</span>
        <span className={styles.tpBrand}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={TP_STAR} />
          </svg>
          Trustpilot
        </span>
        <i aria-hidden="true">↗</i>
      </a>
    </section>
  );
}
