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
  {
    slug: "cascadia-health",
    index: "06",
    name: "Cascadia Health",
    client: "Cascadia Health LLC",
    sector: "Healthcare staffing · Workforce & care",
    headline: "One domain, three sides of care, each with its own way in.",
    summary:
      "Cascadia Health is a human-led healthcare staffing company and care-support partner. A hospital coordinator with an unfilled shift, a clinician deciding where to register and a family arranging care at home all arrive at the same domain. We built the architecture that gives each of them a route of their own without fracturing a single brand.",
    brief:
      "A healthcare staffing site that sorts facilities, clinicians and families in the first screen, each with its own pathway and its own seven-step intake.",
    services: ["Strategy", "UX / UI", "Web", "Service architecture"],
    built: [
      "Segmentation first: the homepage opens on three doors, Request Staff, Join the Talent Team and Request Family Support, with healthcare advisory reached from navigation and footer.",
      "Six services arranged as one ladder, from immediate per-diem cover to workforce partnership: start with one shift, stay for the partnership.",
      "Three seven-step intakes sharing one pattern, each opening with the lightest possible ask, and eleven clinical disciplines named on both sides of the market.",
    ],
    metrics: [
      { value: "4", label: "Distinct pathways, each with its own named action" },
      { value: "3", label: "Seven-step intakes, one per audience" },
      { value: "11", label: "Clinical disciplines named on both sides of the market" },
      { value: "19", label: "Facility types routed in the staffing request" },
    ],
    metricsSource: "Case study, October 2026 · counts from the delivered site; no performance data was supplied",
    disclosure:
      "No performance metrics were supplied for this engagement. No staffing volumes, placements, fill rates, response times, revenue or conversion figures are claimed.",
    liveUrl: "https://cascadiahealthllc.com/",
    caseStudyUrl: "/case-studies/cascadia-health",
    caseStudyLabel: "Read Case Study",
    accent: "#c27aa3",
    accentSoft: "#e6b9d2",
    dark: "#1a1524",
    sweep: "rtl",
    motion: { swap: "wipe", direction: "ltr", pan: 6, zoom: 1.03 },
    images: {
      desktop: img("desktop", "cascadia-01-desktop-hero.jpg", 1440, 814, "Cascadia Health homepage: the right care team, right when it matters, with Request Staff, Join the Talent Team and Find Care for a Loved One", "Web experience", "Homepage · three audiences declared in the first screen"),
      mobile: img("mobile", "cascadia-02-mobile.jpg", 1200, 1000, "Cascadia Health mobile screens: the homepage and the facility staffing request", "Mobile experience", "Responsive · homepage and staffing request"),
      feature: img("feature", "cascadia-03-feature.jpg", 1440, 814, "Cascadia Health facility staffing request, step 1 of 7: facility and coordinator details", "Feature detail", "Facility staffing request · step 1 of 7"),
      secondary: img("secondary", "cascadia-04-secondary.jpg", 2104, 1006, "Cascadia Health pages for families and for healthcare professionals", "Audience pathways", "Families and professionals · each with its own page"),
    },
  },
  {
    slug: "goldway-capital",
    index: "07",
    name: "Goldway Capital",
    client: "Goldway Capital LLC",
    sector: "Senior financial services · Georgia",
    headline: "A regulated conversation, made easy to follow.",
    summary:
      "Goldway Capital is a Georgia senior solutions company working across Medicare, final expense, probate property and investment lending: four regulatory regimes aimed at the same family. We built one brand with separated pathways, forms and disclosures, so the site stays truthful at every step and is still easy for a 64-year-old reading it with their daughter to know what to do next.",
    brief:
      "One brand, four regulated services: separate pathways, forms and per-page disclosures, with entry by the visitor's situation rather than by product.",
    services: ["Strategy", "UX / UI", "Web", "Content"],
    built: [
      "Entry by situation, not by product: the home page opens on Where You Are Today, with four questions such as Turning 65? and Need Flexible Financing?",
      "Five audience-specific forms, each asking only what is needed to prepare a conversation and telling the visitor what not to send.",
      "A disclosure written per page, three licences published where a sceptical adult child will find them, and 28 plain-language articles before any request for a phone number.",
    ],
    metrics: [
      { value: "10", label: "Pages published, none more than one level deep" },
      { value: "5", label: "Audience-specific request forms" },
      { value: "28", label: "Plain-language educational articles" },
      { value: "3", label: "Licences published, so a sceptic can check them" },
    ],
    metricsSource: "Case study, October 2026 · counts from the delivered site; no performance data was supplied",
    disclosure:
      "No performance data was supplied. No clients, consultations, enrolments, policies, loans, traffic or rankings are claimed, and nothing here is financial, insurance or legal advice.",
    liveUrl: "https://goldwaycapital.com/",
    caseStudyUrl: "/case-studies/goldway-capital",
    caseStudyLabel: "Read Case Study",
    accent: "#c9a24a",
    accentSoft: "#e6cf8f",
    dark: "#0d1b33",
    sweep: "ltr",
    motion: { swap: "wipe", direction: "rtl", pan: 7, zoom: 1.03 },
    images: {
      desktop: img("desktop", "goldway-01-desktop-hero.jpg", 1440, 814, "Goldway Capital homepage: helping seniors navigate important life decisions, with Medicare and senior solutions consultation buttons", "Web experience", "Homepage · senior solutions in Georgia"),
      mobile: img("mobile", "goldway-02-mobile.jpg", 1200, 1000, "Goldway Capital homepage on mobile with two consultation buttons", "Mobile experience", "Large type · two clear consultation paths"),
      feature: img("feature", "goldway-03-feature.jpg", 1700, 1150, "Goldway Capital Medicare options page on desktop and mobile: Medicare Advantage, Part D, Medicare Supplement and Final Expense", "Feature detail", "Medicare options · explained, never ranked"),
      secondary: img("secondary", "goldway-04-secondary.jpg", 1440, 814, "Goldway Capital Medicare consultation request form, asking visitors not to include medical or enrolment details", "Request form", "Medicare request · says what not to send"),
    },
  },
  {
    slug: "trident-foundation-systems",
    index: "08",
    name: "Trident Foundation Systems",
    client: "Trident Foundation Systems",
    sector: "Foundation & structural engineering · Brand experience",
    headline: "Connect the crack you can see to the engineering you can't.",
    summary:
      "Trident Foundation Systems sells work nobody will ever see, in a trade where every site looks the same. We built a single continuous experience organised around translation rather than persuasion: it starts with the symptom a homeowner already has, explains the condition below grade, and presents the systems that answer it as one engineered sequence.",
    brief:
      "A single-page experience that teaches homeowners to read the damage they can see, then explains the below-grade engineering that answers it.",
    services: ["Brand experience", "UX / UI", "Development", "Technical storytelling"],
    built: [
      "Four symptoms decoded in the visitor's own words, from stair-step cracking to floors that dip, bounce or cup, each translated into the condition it points to.",
      "Four systems named with verbs, Stabilize, Reinforce, Protect and Restore, and framed as one engineered sequence rather than a menu to choose from.",
      "Below-grade work shown with six numbered callouts, and a six-field evaluation form with Not sure as an issue type, so nobody has to self-diagnose to ask for help.",
    ],
    metrics: [
      { value: "4", label: "Symptoms decoded into the conditions they indicate" },
      { value: "4", label: "Systems presented as one engineered sequence" },
      { value: "6", label: "Numbered below-grade callouts over the real work" },
      { value: "1", label: "Continuous page, because the argument is cumulative" },
    ],
    metricsSource: "Case study, October 2026 · counts from the delivered site; no performance data was supplied",
    disclosure:
      "No enquiry, project-value, conversion or search figures were supplied and none are claimed. Credentials are the client's own statements.",
    liveUrl: "https://tridentxyz.netlify.app/",
    caseStudyUrl: "/case-studies/trident-foundation-systems",
    caseStudyLabel: "Read Case Study",
    accent: "#c8794a",
    accentSoft: "#e8b08c",
    dark: "#15110e",
    sweep: "rtl",
    motion: { swap: "diagonal", direction: "ltr", pan: 7, zoom: 1.035 },
    images: {
      desktop: img("desktop", "trident-01-desktop-hero.jpg", 1440, 814, "Trident Foundation Systems hero: what holds everything above, over a modern home", "Web experience", "Hero · what holds everything above"),
      mobile: img("mobile", "trident-02-mobile.jpg", 1300, 1000, "Trident Foundation Systems mobile screens: helical piles below grade, and stair-step cracking explained", "Mobile experience", "Responsive · symptom first, then the evaluation"),
      feature: img("feature", "trident-03-feature.jpg", 1440, 814, "Trident Foundation Systems Protect stage: drainage and membrane, one step of the engineered sequence", "Feature detail", "Protect · one stage of an engineered sequence"),
      secondary: img("secondary", "trident-04-secondary.jpg", 1440, 814, "Trident Foundation Systems: the damage starts quietly, decoding stair-step cracking and movement in block", "Symptoms decoded", "What you can see · four symptoms, translated"),
    },
  },
  {
    slug: "gilbert-and-sons",
    index: "09",
    name: "Gilbert & Sons",
    client: "Gilbert & Sons Roofing and Stucco",
    sector: "Roofing & stucco · Website + local SEO",
    headline: "Built for the moment someone finds water on their ceiling.",
    summary:
      "Roofing is bought in a hurry, locally, by people who have never hired a roofer. Gilbert & Sons has worked in Las Cruces since 2010, and we built it a site structured around exactly that moment: a page for every roofing service, trust signals a homeowner can check, and call, text or estimate one tap away on every screen.",
    brief:
      "Nine roofing service pages, thirteen Southern New Mexico markets named, and call, text or estimate one tap away on every screen.",
    services: ["UX / UI", "Development", "Local SEO architecture", "Conversion strategy"],
    built: [
      "Service-page architecture: nine roofing services at their own URLs, from repairs and emergency roofing to tile and silicone restoration, each written for a different search.",
      "Local SEO with the place in the title, not just the footer: a Las Cruces page written for the climate, and thirteen Southern New Mexico markets named.",
      "Call, text and estimate side by side at every decision point, a six-field estimate form, and sixteen question-led articles for the research stage.",
    ],
    metrics: [
      { value: "9", label: "Roofing service pages, each at its own URL" },
      { value: "13", label: "Southern New Mexico markets named" },
      { value: "16", label: "Question-led articles for the research stage" },
      { value: "3", label: "Ways to make contact, side by side" },
    ],
    metricsSource: "Case study, October 2026 · counts from the delivered site; no performance data was supplied",
    disclosure:
      "No performance data was supplied. No leads, calls, traffic, rankings, conversion rates or revenue are claimed; licensing and accreditation are the client's own statements.",
    liveUrl: "https://gilbertandsonsroofingandstucco.com/",
    caseStudyUrl: "/case-studies/gilbert-and-sons",
    caseStudyLabel: "Read Case Study",
    accent: "#d6403f",
    accentSoft: "#f19a92",
    dark: "#160f0f",
    sweep: "ltr",
    motion: { swap: "diagonal", direction: "rtl", pan: 6, zoom: 1.03 },
    images: {
      desktop: img("desktop", "gilbert-01-desktop-hero.jpg", 1440, 814, "Gilbert & Sons homepage: roofing that stands up to the elements, with an estimate form beside the hero", "Web experience", "Homepage · an estimate form in the first screen"),
      mobile: img("mobile", "gilbert-02-mobile.jpg", 1200, 1000, "Gilbert & Sons mobile screens with Call Now and Estimate buttons fixed to every screen", "Mobile experience", "Call or estimate · one tap on every screen"),
      feature: img("feature", "gilbert-03-feature.jpg", 1440, 814, "Gilbert & Sons roofing services: installations, repairs, replacements and inspections", "Feature detail", "Every roofing service · its own page"),
      secondary: img("secondary", "gilbert-04-secondary.jpg", 1440, 814, "Gilbert & Sons recent work: underlayment staged on site, ready to go up", "Recent work", "Built in the field · materials staged on site"),
    },
  },
  {
    slug: "rob-does-it",
    index: "10",
    name: "Rob Does It",
    client: "ROB DOES IT",
    sector: "Entertainment · Events & media",
    headline: "A website that moves the way the night does.",
    summary:
      "Rob is a host, interviewer and professional crowd mover working events across Los Angeles and Hollywood. A conventional portfolio would have shown the footage and lost the reason anyone books him, so we built a site that behaves like the night: fast, loud, in motion, and never more than one tap from booking.",
    brief:
      "Host, interviewer and professional crowd mover: a site that shows the energy before explaining it, with booking never more than one tap away.",
    services: ["Creative direction", "UX / UI", "Booking experience", "Web", "Content"],
    built: [
      "Show the energy before explaining it: poster-scale type, real rooms above the fold, and copy written the way Rob talks, with Watch Rob and Book Rob open at once.",
      "A feed, not a gallery: 31 published clips tagged with their platform, and nine filters that turn one library into audience-specific showreels.",
      "Three access levels priced openly with counted deliverables, and a five-step availability check framed as a conversation, not paperwork.",
    ],
    metrics: [
      { value: "31", label: "Clips published in the library" },
      { value: "9", label: "Filters on the watch page" },
      { value: "3", label: "Access levels, priced openly" },
      { value: "5", label: "Steps to check availability" },
    ],
    metricsSource: "Case study, October 2026 · counts from the delivered site; no performance data was supplied",
    disclosure: "No views, followers, bookings, enquiries, revenue or traffic are claimed. None were supplied.",
    liveUrl: "https://itsrobdoesit.com/",
    caseStudyUrl: "/case-studies/rob-does-it",
    caseStudyLabel: "Read Case Study",
    accent: "#e2b33c",
    accentSoft: "#f1d68a",
    dark: "#0e0d0b",
    sweep: "rtl",
    motion: { swap: "drift", direction: "ltr", pan: 10, zoom: 1.04 },
    images: {
      desktop: img("desktop", "rob-01-desktop-hero.jpg", 1440, 814, "Rob Does It homepage: host, interviewer, professional crowd mover, Hollywood, let's get it", "Web experience", "Homepage · Watch Rob and Book Rob, side by side"),
      mobile: img("mobile", "rob-02-mobile.jpg", 1300, 1000, "Rob Does It mobile screens: check availability and the homepage", "Mobile experience", "Booking flow · five quick steps"),
      feature: img("feature", "rob-03-feature.jpg", 1440, 814, "Rob Does It booking: check availability, step 1 of 5, choosing the event type", "Feature detail", "Check availability · step 1 of 5"),
      secondary: img("secondary", "rob-04-secondary.jpg", 1440, 814, "Rob Does It top-viewed clips, each tagged with the platform it was published on", "The library", "Top viewed · clips tagged by platform"),
    },
  },
  {
    slug: "weisz-sports-management",
    index: "11",
    name: "Weisz Sports Management",
    client: "Weisz Sports Management",
    sector: "Professional sports · Athlete representation",
    headline: "A digital home for athletes, and the families behind them.",
    summary:
      "Weisz Sports Management represents baseball players, amateur, drafted and professional, and the families standing behind them. The site is read by a nineteen-year-old and a parent at the same time, so it answers the scope question once and completely, puts real people with checkable histories in front of the reader early, and makes first contact feel like an introduction rather than an application.",
    brief:
      "An agency site written for two readers at once, athlete and parent: nine services on one screen, named people, and an introduction instead of an application.",
    services: ["Digital strategy", "UX / UI", "Web", "High-trust design"],
    built: [
      "Nine services with one-line descriptions settle the scope question on one screen, from draft preparation and NIL to financial and family guidance.",
      "Three named leaders with titles and full histories, and a roster kept small on purpose, presented as the reason to sign.",
      "An FAQ on NCAA eligibility and agent certification, and a contact form that accepts a file, so the first message can carry video or a resume.",
    ],
    metrics: [
      { value: "9", label: "Services published, each with a one-line description" },
      { value: "3", label: "People named on the team page, with full biographies" },
      { value: "2", label: "FAQ answers, on NCAA eligibility and agent certification" },
      { value: "5", label: "Destinations in the navigation, no maze" },
    ],
    metricsSource: "Case study, October 2026 · counts from the delivered site; no performance data was supplied",
    disclosure:
      "No athletes, contract values, signings, client count, traffic or revenue are claimed. Experience and certification are the client's own statements.",
    liveUrl: "https://weiszsports.com/",
    caseStudyUrl: "/case-studies/weisz-sports-management",
    caseStudyLabel: "Read Case Study",
    accent: "#4a73ff",
    accentSoft: "#a3b8ff",
    dark: "#0a1128",
    sweep: "ltr",
    motion: { swap: "wipe", direction: "ltr", pan: 7, zoom: 1.03, edgeTrace: true },
    images: {
      desktop: img("desktop", "weisz-01-desktop-hero.jpg", 1440, 814, "Weisz Sports Management homepage: take your career to the next level", "Web experience", "Homepage · representation, relationships, results"),
      mobile: img("mobile", "weisz-02-mobile.jpg", 1200, 1000, "Weisz Sports Management homepage on mobile", "Mobile experience", "Responsive · the same promise on a phone"),
      feature: img("feature", "weisz-04-secondary.jpg", 1700, 1150, "Weisz Sports Management full-service agency page on desktop and mobile, listing draft preparation and contract negotiation", "Feature detail", "Full-service agency · every stage of a career"),
      secondary: img("secondary", "weisz-03-feature.jpg", 1440, 814, "Weisz Sports Management account login page", "Account access", "Login · access your Weisz Sports account"),
    },
  },
  {
    slug: "sqush-llc",
    index: "12",
    name: "SQUSH LLC",
    client: "SQUSH LLC",
    sector: "Courier & concierge · Las Vegas",
    headline: "Turning local courier requests into jobs ready to run.",
    summary:
      "SQUSH LLC runs local courier, transportation and concierge services across Las Vegas and North Las Vegas. A delivery business loses money on requests that arrive incomplete, so we separated the demands before designing the inputs: four pathways, a three-step request flow and forms that capture route, contents and deadline before a person reads them.",
    brief:
      "Four service pathways and a three-step request flow that captures route, contents and deadline before a person reads the request.",
    services: ["Strategy", "UX / UI", "Web", "Workflow design"],
    built: [
      "Four kinds of demand, four separate doors: courier, concierge, priority and federal, each with its own form, so the click itself is routing information.",
      "Every field is an operational question: both locations and a needed-by date required, item type as a short list, and an optional Your Offer field.",
      "Two cities stated on every page, and a federal inquiry route kept entirely out of the delivery queue.",
    ],
    metrics: [
      { value: "4", label: "Service pathways, each with its own door" },
      { value: "3", label: "Steps to send a request, about a minute" },
      { value: "12", label: "Fields on the priority form, 8 of them required" },
      { value: "2", label: "Cities in the service area, stated everywhere" },
    ],
    metricsSource: "Case study, October 2026 · counts from the delivered site; no performance data was supplied",
    disclosure: "No deliveries, response times, pricing, contracts, clients or metrics are claimed. None were supplied.",
    liveUrl: "https://squshllc.com/",
    caseStudyUrl: "/case-studies/sqush-llc",
    caseStudyLabel: "Read Case Study",
    accent: "#e9b334",
    accentSoft: "#f5d98e",
    dark: "#17140d",
    sweep: "rtl",
    motion: { swap: "wipe", direction: "rtl", pan: 6, zoom: 1.05 },
    images: {
      desktop: img("desktop", "sqush-01-desktop-hero.jpg", 1440, 814, "SQUSH LLC homepage: local courier and concierge services in Las Vegas and North Las Vegas", "Web experience", "Homepage · two cities, stated up front"),
      mobile: img("mobile", "sqush-02-mobile.jpg", 1200, 1000, "SQUSH LLC homepage on mobile with Request a Service and call buttons", "Mobile experience", "Request or call · from the first screen"),
      feature: img("feature", "sqush-03-feature.jpg", 1700, 1056, "SQUSH LLC request status page on desktop and mobile, showing each stage of a delivery", "Feature detail", "Status page · each stage of a request"),
      secondary: img("secondary", "sqush-04-secondary.jpg", 1440, 814, "SQUSH LLC request flow, step 1 of 3: courier, concierge or federal contracts", "Request flow", "Step 1 of 3 · choose the service"),
    },
  },
];

/**
 * Capabilities listed in the About section. Descriptions state what the work
 * covers, never a credential: no accreditation, contractor status or
 * eInvoicing ASP status is claimed.
 */
export const capabilities = [
  { title: "AI Automation & Intelligent Workflows", body: "Repetitive operations turned into reliable, monitored automated workflows." },
  { title: "AI Agents & Business Assistants", body: "Assistants grounded in your own documents, data and processes." },
  { title: "Custom SaaS & Product Development", body: "Software products taken from first release through to scale." },
  { title: "Web & Mobile App Development", body: "Production apps for iOS, Android and the web." },
  { title: "CRM & ERP Systems", body: "Customer and operations platforms configured around how your teams work." },
  { title: "Government Opportunity & Proposal Technology", body: "Tools for finding, qualifying and responding to public-sector opportunities." },
  { title: "Public-Sector Digital Solutions", body: "Accessible, secure digital services for public-sector organisations." },
  { title: "UAE eInvoicing & Business System Integration", body: "eInvoicing integration, ERP readiness, data mapping and business-system implementation." },
];
