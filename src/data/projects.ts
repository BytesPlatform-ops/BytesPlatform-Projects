/**
 * Project / case-study data for the BytesPak Projects page.
 *
 * Every figure, technology and client fact below is taken from the
 * case-study PDFs in the "BytesPlatform Images / Case Studies" folder.
 * Nothing is estimated. If a case study does not support a claim it is
 * left out (see `disclosure` on each project).
 */

export type ProjectImageRole = "desktop" | "mobile" | "feature" | "secondary";

export interface ProjectImage {
  role: ProjectImageRole;
  src: string;
  width: number;
  height: number;
  alt: string;
  label: string;
  caption: string;
}

/**
 * How an image is revealed as it lands in the large slot after a thumbnail
 * swap. Every style opens from the edge given by `ProjectMotion.direction`.
 *  - wipe:     straight leading edge
 *  - diagonal: angled leading edge, like a print being pulled across
 *  - drift:    straight edge plus a soft dissolve and slight pan
 */
export type SwapStyle = "wipe" | "diagonal" | "drift";

/** Per-project interaction recipe, so no two projects move the same way. */
export interface ProjectMotion {
  /** Signature reveal when a thumbnail is promoted to the large slot */
  swap: SwapStyle;
  /** Edge the reveal opens from. Independent of `sweep`, which mirrors the grid. */
  direction: "ltr" | "rtl";
  /** Mouse-direction image pan in px (5–10) */
  pan: number;
  /** Hover zoom (1.02–1.05) */
  zoom: number;
  /** Frames drift at different depths with the cursor */
  parallax?: boolean;
  /** Accent segment travels around the showcase border */
  edgeTrace?: boolean;
  /** Stronger project-colour wash behind the whole article */
  wash?: boolean;
}

/** Where the product can be used, shown in the project metadata */
export interface ProjectAccess {
  /** One short line, supported by the case study */
  note: string;
  website: string;
  /** Store links, one button each. Omitted when there is no app to link to. */
  apps?: { platform: "iOS" | "Android"; href: string }[];
  /** "app": the app CTAs lead (mobile is core). "even": website first. */
  emphasis: "app" | "even";
}

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  index: string;
  name: string;
  client: string;
  sector: string;
  headline: string;
  summary: string;
  /** 2–3 line version of `summary` for phones, condensed from it with no new claims */
  brief: string;
  services: string[];
  built: string[];
  metrics: ProjectMetric[];
  metricsSource: string;
  disclosure?: string;
  liveUrl: string;
  access?: ProjectAccess;
  /** Internal URL of the case-study PDF (public/case-studies/<slug>.pdf), opened in a new tab */
  caseStudyUrl: string;
  caseStudyLabel: string;
  accent: string;
  accentSoft: string;
  dark: string;
  /** Hover sweep direction. Alternates per project. */
  sweep: "ltr" | "rtl";
  motion: ProjectMotion;
  images: {
    desktop: ProjectImage;
    mobile: ProjectImage;
    feature: ProjectImage;
    secondary: ProjectImage;
  };
}

const img = (
  role: ProjectImageRole,
  file: string,
  width: number,
  height: number,
  alt: string,
  label: string,
  caption: string,
): ProjectImage => ({
  role,
  src: `/images/projects/${file}`,
  width,
  height,
  alt,
  label,
  caption,
});

export const projects: Project[] = [
  {
    slug: "quantiva-hq",
    index: "01",
    name: "Quantiva HQ",
    client: "Quantiva Nexus LLC",
    sector: "FinTech · Trading platform",
    headline: "One trading terminal for crypto and equities.",
    summary:
      "Quantiva HQ links a trader's own exchange and brokerage accounts by API, never takes custody, scores live market signals and places the order from the screen it appeared on. We designed and engineered the product from onboarding to billing, and it shipped complete: KYC, risk controls, VC Pools, an on-chain rewards token on Base and a nine-SKU subscription system all live in version 1.0.",
    brief:
      "Links a trader's own exchange and brokerage accounts by API, scores live market signals and places the order from the same screen. Designed and engineered from onboarding to billing.",
    services: ["Product strategy", "UI / UX", "Mobile & web engineering", "API integrations", "KYC & billing"],
    built: [
      "66 mobile screens across 39 flows, resolved into four persistent surfaces: Trades, AI Insights, VC Pool and Profile.",
      "One connection flow for Binance, Bybit, KuCoin, Bitget, Interactive Brokers, Alpaca and Robinhood, with a Crypto / Stocks switch that swaps the data model while the interface stays identical.",
      "A resumable four-step KYC pipeline on SumSub, session-level security, and four entitlement tiers enforced per feature inside the product.",
    ],
    metrics: [
      { value: "66", label: "Mobile screens across 39 flows" },
      { value: "8", label: "Market connectivity sources" },
      { value: "9", label: "Subscription SKUs live on the stores" },
      { value: "2", label: "App stores approved at launch" },
    ],
    metricsSource: "Public store listings and the running application · figures read 15–16 September 2026",
    disclosure:
      "Quantiva HQ is a recent release. Download volume, ratings, revenue, signal accuracy and strategy returns are deliberately not claimed.",
    liveUrl: "https://www.quantivahq.com/",
    // Case study: "Live on the App Store and Google Play as v1.0.1"; quantivahq.com is the product website
    access: {
      note: "Live trading platform on iOS and Android (v1.0.1), alongside its web experience at quantivahq.com.",
      website: "https://www.quantivahq.com/",
      apps: [
        { platform: "iOS", href: "https://apps.apple.com/us/app/quantiva-hq/id6762023500" },
        { platform: "Android", href: "https://play.google.com/store/apps/details?id=com.quantivahq" },
      ],
      emphasis: "app",
    },
    caseStudyUrl: "/case-studies/quantiva-hq",
    caseStudyLabel: "Read Case Study",
    accent: "#ff8a1f",
    accentSoft: "#ffb766",
    dark: "#0b0d12",
    sweep: "ltr",
    motion: { swap: "wipe", direction: "ltr", pan: 6, zoom: 1.03 },
    images: {
      desktop: img("desktop", "quantiva-01-desktop.jpg", 2656, 1660, "Quantiva HQ web landing experience with AI-powered insights headline", "Web experience", "Landing · AI-powered trading across crypto and stocks"),
      mobile: img("mobile", "quantiva-02-app.jpg", 1400, 826, "Quantiva HQ app screens: open trade ideas, portfolio dashboard with holdings and market, and the buy / sell order ticket", "App experience", "Trades · dashboard · order ticket"),
      feature: img("feature", "quantiva-03-feature.jpg", 1400, 1050, "Quantiva HQ feature screens: exchange connections, live market intelligence, recommendations and order execution", "Feature detail", "Exchange connections · signals · order ticket"),
      secondary: img("secondary", "quantiva-04-secondary.jpg", 1300, 731, "Quantiva HQ app live on iOS and Android announcement", "Proof", "Live on the App Store and Google Play"),
    },
  },
  {
    slug: "intellimaint-ai",
    index: "02",
    name: "IntelliMaint AI",
    client: "IntelliMaint AI",
    sector: "AI product · Industrial & defence maintenance",
    headline: "Turn a shelf of equipment manuals into field-ready answers.",
    summary:
      "IntelliMaint AI is a virtual mechanic. A technician photographs a failing unit, asks a question out loud or types the symptom, and gets repair guidance retrieved from that equipment's own documentation rather than improvised from general knowledge. We designed and built the product, from the interface to the retrieval workflow behind it.",
    brief:
      "A virtual mechanic: technicians photograph, speak or type the problem and get repair guidance retrieved from that equipment's own documentation.",
    services: ["AI product build", "Product design", "RAG retrieval", "Voice & vision"],
    built: [
      "Retrieval first, generation second: documents are chunked, embedded and indexed on upload; the LLM is the fallback, not the source of truth.",
      "Input parity for gloved hands: typing, speaking and photographing are equivalent ways to ask, on a dark, high-contrast interface built for a plant room at night.",
      "Identity decides what the assistant can read: civilian, military (.mil verified, isolated knowledge base) and student accounts, across four plan tiers from free to enterprise.",
    ],
    metrics: [
      { value: "4", label: "Capability pillars: documents, manual library, vision, voice" },
      { value: "3", label: "Identity types with separate knowledge boundaries" },
      { value: "4", label: "Plan tiers, free to enterprise" },
      { value: "9", label: "Screens built, sign-up to password reset" },
    ],
    metricsSource: "Product review, September 2026 · built on Next.js and hosted on Render",
    disclosure:
      "A capability engagement at the pre-measurement stage. No user counts, revenue, diagnostic accuracy or repair-time figures are claimed.",
    liveUrl: "https://intellimaint-ai.onrender.com/",
    // Case study: "Responsive web application"; questions typed, spoken or photographed,
    // answered from the equipment's own documentation. No store app exists, so no app link.
    access: {
      note: "Responsive AI maintenance app: diagnose by text, voice or photo, grounded in the equipment's own documentation.",
      website: "https://intellimaint-ai.onrender.com/",
      emphasis: "even",
    },
    caseStudyUrl: "/case-studies/intellimaint-ai",
    caseStudyLabel: "Read Case Study",
    accent: "#3ad3ff",
    accentSoft: "#8fe7ff",
    dark: "#06111f",
    sweep: "rtl",
    motion: { swap: "wipe", direction: "rtl", pan: 8, zoom: 1.025, parallax: true, edgeTrace: true },
    images: {
      desktop: img("desktop", "intellimaint-01-desktop.jpg", 2656, 1660, "IntelliMaint AI web landing page: your troubleshooting assistant", "Web experience", "Landing · ask, don't search"),
      mobile: img("mobile", "intellimaint-02-app.jpg", 1448, 1086, "IntelliMaint AI app screens: recent history of equipment photos, the Resolve. Repair. Reinforce. welcome screen, and document upload", "App experience", "History · welcome · document upload"),
      feature: img("feature", "intellimaint-03-feature.jpg", 1400, 1050, "IntelliMaint AI core capabilities: document analysis, manual library, visual diagnostics and hands-free support", "Feature detail", "Four capabilities · documents, manuals, vision, voice"),
      secondary: img("secondary", "intellimaint-04-secondary.jpg", 1300, 812, "IntelliMaint AI pricing: free, pro, military and enterprise plans", "Proof", "Four tiers priced against three distinct buyers"),
    },
  },
  {
    slug: "aegis-creek",
    index: "03",
    name: "Aegis Creek",
    client: "Aegis Creek",
    sector: "B2B · Government funding advisory",
    headline: "Make deep expertise visible before the first sales call.",
    summary:
      "Aegis Creek helps deep-tech companies raise non-dilutive government capital, and almost none of that expertise was visible to the founders who needed it. We built a repeatable content engine, a LinkedIn publishing rhythm and a paid video campaign that put the firm's core argument in front of a quarter of a million professional feeds.",
    brief:
      "A content engine, LinkedIn publishing rhythm and paid video campaign that put the firm's non-dilutive funding expertise in front of a quarter of a million professional feeds.",
    services: ["Brand positioning", "LinkedIn content strategy", "Thought leadership", "LinkedIn video ads"],
    built: [
      "Positioning on the outcome, not the paperwork: non-dilutive capital, named sectors in the H1, practitioners first.",
      "Nine Insights articles on live federal funding vehicles (DARPA, BARDA, DCSA, Army Corps of Engineers, Navy T&E, NIH SBIR/STTR), each published to the feed and republished on the firm's own domain as owned, indexable pages for long-term search visibility.",
      "Three escalating video creatives built on one argument, carried by a LinkedIn video-views campaign targeted by role, seniority and industry.",
    ],
    metrics: [
      { value: "261,101", label: "Paid impressions delivered" },
      { value: "249,266", label: "Video views recorded" },
      { value: "22.62s", label: "Average dwell time" },
      { value: "$269.21", label: "Total campaign spend" },
    ],
    metricsSource: "LinkedIn Campaign Manager export · 20 August – 18 September 2026",
    disclosure:
      "No leads, revenue, pipeline or ROI are claimed; conversion tracking was not in place during the period.",
    liveUrl: "https://aegiscreek.com/",
    caseStudyUrl: "/case-studies/aegis-creek",
    caseStudyLabel: "Read Case Study",
    accent: "#d14bff",
    accentSoft: "#5ee1ff",
    dark: "#0a0b24",
    sweep: "ltr",
    motion: { swap: "drift", direction: "ltr", pan: 6, zoom: 1.03, wash: true },
    images: {
      desktop: img("desktop", "aegis-01-desktop.jpg", 2880, 1800, "Aegis Creek website positioning: raising government funds for AI, cleantech and semi", "Positioning", "Named sectors in the H1 · non-dilutive capital"),
      mobile: img("mobile", "aegis-02-mobile.jpg", 1200, 1000, "Aegis Creek mobile screens: positioning and contact with Calendly booking", "Mobile experience", "Conversion path · form and Calendly"),
      feature: img("feature", "aegis-03-feature.jpg", 1400, 1050, "Aegis Creek strategic expertise and non-dilutive capital service areas", "Feature detail", "Expertise made explicit · grant strategy to contract pursuit"),
      secondary: img("secondary", "aegis-04-secondary.jpg", 1440, 812, "Aegis Creek Insights library of federal funding articles", "Proof", "Owned Insights library · nine indexable articles"),
    },
  },
  {
    slug: "team-smith-logistics",
    index: "04",
    name: "Team Smith Logistics",
    client: "Team Smith Logistics LLC",
    sector: "Logistics · Website + local SEO",
    headline: "Turn specialised logistics services into search demand.",
    summary:
      "A twenty-year Southern California transport company ran mobile EV charging, EV fire response, container hauling and dealership fleet moves that most towing operators can't match, and none of it was visible online. A seven-page site built around how buyers actually search, with the client's own fleet in every photograph, reached page one in its first quarter.",
    brief:
      "A seven-page site built around how buyers actually search, with the client's own fleet in every photograph, reached page one of Google in its first quarter.",
    services: ["Website design", "Development", "Local SEO architecture", "Content strategy", "UX & information architecture"],
    built: [
      "Service-page architecture: seven pages with one job each and ten titled service blocks, each opening on the customer's situation and each its own search entry point, with a Call Now action in every header, hero and footer.",
      "Positioned as transport and logistics while keeping the head terms, then widened to specialist terms no competitor targets: mobile EV charging, shipping container transport, container hauling.",
      "Local SEO and search-driven content: a seven-question FAQ written for answer engines, a six-post blog cluster, and Los Angeles, Riverside County and San Bernardino named in body copy, Areas We Serve and every footer.",
    ],
    metrics: [
      { value: "8.9", label: "Average Google position across tracked queries" },
      { value: "+70%", label: "Indexed pages, 30 → 51 in one quarter" },
      { value: "1,810", label: "Search impressions in seven days (≈7,800/month)" },
      { value: "148ms", label: "Average server response, 98% of crawl requests OK" },
    ],
    metricsSource: "Google Search Console · 1 January – 26 March 2026, first quarter after launch",
    liveUrl: "https://teamsmithlogistics.com/",
    caseStudyUrl: "/case-studies/team-smith-logistics",
    caseStudyLabel: "Read Case Study",
    accent: "#4f8dff",
    accentSoft: "#9ec2ff",
    dark: "#0a1326",
    sweep: "rtl",
    motion: { swap: "diagonal", direction: "ltr", pan: 7, zoom: 1.03 },
    images: {
      desktop: img("desktop", "team-smith-01-desktop.jpg", 2560, 1600, "Team Smith Logistics homepage: mobile EV charging, wherever you need it", "Web experience", "Homepage · the client's own fleet, no stock imagery"),
      mobile: img("mobile", "team-smith-02-mobile.jpg", 1200, 1000, "Team Smith Logistics mobile screens: dealership transport and fleet gallery", "Mobile experience", "Mobile-first · a phone call from every screen"),
      feature: img("feature", "team-smith-03-feature.jpg", 1400, 1050, "Team Smith Logistics services: dealership transport, emergency towing, mobile EV charging, EV fire cleanup", "Feature detail", "Ten services, ten separate answers"),
      secondary: img("secondary", "team-smith-04-secondary.jpg", 1300, 1040, "Team Smith Logistics gallery of real fleet work across Southern California", "Proof", "Gallery · real jobs, real trucks"),
    },
  },
  {
    slug: "the-benavente-group",
    index: "05",
    name: "The Benavente Group",
    client: "The Benavente Group LLC",
    sector: "Commercial real estate appraisal · Search authority",
    headline: "Turn valuation expertise into a search-driven authority platform.",
    summary:
      "Honolulu-based MAI- and SRA-designated appraisers with defensible valuations across six Pacific regions since 2017, known only to the attorneys and lenders who already used them. A five-page platform and a definition-led content engine now rank the firm for the technical vocabulary its buyers actually search.",
    brief:
      "A five-page platform and definition-led content engine that ranks MAI- and SRA-designated appraisers for the technical terms their buyers search.",
    services: ["Website design", "Development", "SEO architecture", "Content strategy", "UX strategy", "Weekly search reporting"],
    built: [
      "Five pages, each carrying one burden of proof: can they do this work, are they credible, have they done it before, do they understand my problem, how do I reach them discreetly.",
      "MAI and SRA credentials in the hero and beside every name; a portfolio of eleven filterable asset classes in the firm's own photography; coverage named jurisdiction by jurisdiction, which also carries the search signal into body copy.",
      "Search-driven content, not a blog: every article follows “What is [technical term]? A guide for Hawai‘i [professional audience]”, answering the valuation terms buyers search mid-problem, with weekly Search Console reporting on performance and indexing.",
    ],
    metrics: [
      { value: "9.92K", label: "Search impressions in 60+ days" },
      { value: "61", label: "Pages indexed, up from 54" },
      { value: "9 of 14", label: "Ranking queries are educational valuation terms" },
      { value: "5 of 10", label: "Highest-click pages are blog articles" },
    ],
    metricsSource: "Google Search Console · 60+ days to 10 September 2026",
    liveUrl: "https://benaventegroup.com/",
    caseStudyUrl: "/case-studies/the-benavente-group",
    caseStudyLabel: "Read Case Study",
    accent: "#d4b068",
    accentSoft: "#efd9a4",
    dark: "#0e1f3a",
    sweep: "ltr",
    motion: { swap: "drift", direction: "rtl", pan: 10, zoom: 1.04 },
    images: {
      desktop: img("desktop", "benavente-01-desktop.jpg", 2656, 1660, "The Benavente Group homepage: real estate valuation and consultancy over Honolulu", "Web experience", "Homepage · credentials before sales language"),
      mobile: img("mobile", "benavente-02-mobile.jpg", 1200, 1000, "The Benavente Group mobile screens: homepage and selected projects", "Mobile experience", "Responsive · portfolio by asset class"),
      feature: img("feature", "benavente-03-feature.jpg", 1240, 930, "The Benavente Group portfolio filtered by asset class with the firm's own photography", "Feature detail", "Eleven filterable asset classes · the firm's own archive"),
      secondary: img("secondary", "benavente-04-secondary.jpg", 1360, 735, "The Benavente Group: a trusted name in Pacific real estate", "Proof", "Pacific coverage, named jurisdiction by jurisdiction"),
    },
  },
];

export const disciplines = [
  {
    index: "01",
    title: "Product strategy",
    body: "Positioning, scope and sequencing decided before a screen is drawn, so the first release is the right release.",
  },
  {
    index: "02",
    title: "UI / UX",
    body: "Interfaces designed around what the user is doing in a session, from a trader's order ticket to a technician's gloved hands.",
  },
  {
    index: "03",
    title: "Web & mobile engineering",
    body: "Production systems across iOS, Android and the web: integrations, identity, billing and the infrastructure behind them.",
  },
  {
    index: "04",
    title: "AI & automation",
    body: "Retrieval-grounded assistants, signal engines and automated workflows built to be right, not just fluent.",
  },
  {
    index: "05",
    title: "Growth & SEO",
    body: "Search architecture, content systems and paid distribution, instrumented so impact can be proved rather than asserted.",
  },
];
