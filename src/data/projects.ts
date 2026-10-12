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
  {
    slug: "amins-consult",
    index: "13",
    name: "Amins Consult",
    client: "Amins Consult",
    sector: "Software engineering consulting · Federal, healthcare & finance",
    headline: "Deep engineering expertise, organised so a buyer can check it.",
    summary:
      "Amins Consult is a Scranton, Pennsylvania software engineering consultancy working across federal, healthcare and finance. Its buyers read for one thing: has this firm worked in my regulatory environment, and can I verify it? We built a site that answers with specifics rather than adjectives, organised by industry, then discipline, then proof.",
    brief:
      "A consulting site read by federal, healthcare and fintech buyers, organised by industry, with named standards a technical evaluator can check.",
    services: ["Digital strategy", "UX / UI", "Web development"],
    built: [
      "Service cards ordered by sector first, each pairing a regulated context with the standard or platform a buyer already searches for, such as FedRAMP, FHIR and ISO 20022.",
      "Security on the first screen and repeated wherever a buyer looks, with AI presented as one engineering discipline among six pillars, not the headline.",
      "A seven-category technology stack a technical evaluator can check, and one labelled door at the end: Partner With Us.",
    ],
    metrics: [
      { value: "6", label: "Service pillars named on the site" },
      { value: "3", label: "Regulated industries, each with its own section" },
      { value: "7", label: "Technology stack categories published" },
      { value: "1", label: "Route to make contact, labelled for the buyer" },
    ],
    metricsSource: "Case study, October 2026 · counts published on the delivered site; no performance data was supplied",
    disclosure:
      "No performance data was supplied. No clients, contracts, certifications, revenue, traffic, rankings or conversion rates are claimed.",
    liveUrl: "https://aminsconsult.com/",
    caseStudyUrl: "/case-studies/amins-consult",
    caseStudyLabel: "Read Case Study",
    accent: "#4d8dff",
    accentSoft: "#a8c6ff",
    dark: "#070d1c",
    sweep: "ltr",
    motion: { swap: "wipe", direction: "ltr", pan: 6, zoom: 1.03, edgeTrace: true },
    images: {
      desktop: img("desktop", "amins-01-desktop.jpg", 1440, 814, "Amins Consult homepage: innovative software solutions, with Explore Services and Contact Us", "Web experience", "Homepage · engineering for regulated industries"),
      mobile: img("mobile", "amins-02-mobile.jpg", 1700, 1100, "Amins Consult mobile screens: homepage, specialized services and the acceleration model", "Mobile experience", "Responsive · services and delivery model"),
      feature: img("feature", "amins-03-feature.jpg", 2200, 848, "Amins Consult specialized services for federal, healthcare and fintech, beside the three-phase acceleration model", "Feature detail", "Services by sector · a three-phase delivery model"),
      secondary: img("secondary", "amins-04-secondary.jpg", 1520, 978, "Amins Consult careers page: join our mission", "Careers", "Join our mission · open leadership roles"),
    },
  },
  {
    slug: "dawg-team-apparel-usa",
    index: "14",
    name: "Dawg Team Apparel USA",
    client: "DAWG Team USA",
    sector: "Local pet care · Grooming & boarding",
    headline: "Four kinds of pet care, one place to book.",
    summary:
      "DAWG Team USA is a Memphis pet-care business in the Crosstown neighbourhood offering boarding, mobile grooming, in-store grooming and a self-serve dog wash. An owner arrives needing one of those, usually on a phone, so the site gives each service its own page, puts the price on the page and the rules before the booking button.",
    brief:
      "Boarding, mobile grooming, in-store grooming and a self-serve wash, each with its own page, its price published and booking one tap away.",
    services: ["Digital strategy", "UX / UI", "Web development"],
    built: [
      "Four services, four pages: the home page's cards are headed with questions, so an owner self-selects in a scroll and lands on the one service that is theirs.",
      "The price is on the page: grooming priced by weight, every add-on priced, boarding by weight and the wash a flat rate, before anyone reaches the booking system.",
      "Rules before the booking button, from vaccinations to drop-off windows, and a book online or call choice at the end of every service page.",
    ],
    metrics: [
      { value: "4", label: "Services, each with a page of its own" },
      { value: "6", label: "Boarding rates published, by weight" },
      { value: "6", label: "Questions answered in the FAQ" },
      { value: "2", label: "Ways to book: online and by phone" },
    ],
    metricsSource: "Case study, October 2026 · counts published on the delivered site; no performance data was supplied",
    disclosure:
      "No performance data was supplied. No bookings, customers, reviews, ratings, revenue, traffic or rankings are claimed.",
    liveUrl: "https://www.dawgteamapparelusa.com/",
    caseStudyUrl: "/case-studies/dawg-team-apparel-usa",
    caseStudyLabel: "Read Case Study",
    accent: "#e0444b",
    accentSoft: "#f4a2a5",
    dark: "#170c0d",
    sweep: "rtl",
    motion: { swap: "wipe", direction: "rtl", pan: 6, zoom: 1.03 },
    images: {
      desktop: img("desktop", "dawgteam-01-desktop.jpg", 1440, 814, "Dawg Team homepage: Memphis dog grooming, mobile grooming and boarding, all in one DAWG Team", "Web experience", "Homepage · four services, one local place"),
      mobile: img("mobile", "dawgteam-02-mobile.jpg", 1700, 1150, "Dawg Team boarding page and its three-step reservation section", "Boarding", "Boarding · dependable care, three steps to book"),
      feature: img("feature", "dawgteam-03-feature.jpg", 1520, 876, "Dawg Team reserve boarding in three simple steps: check availability, complete the requirements, drop off with confidence", "Feature detail", "Three steps · requirements before the booking"),
      secondary: img("secondary", "dawgteam-04-secondary.jpg", 1440, 814, "Dawg Team dependable dog boarding in Memphis, with Check Boarding Availability and Call DAWG Team", "Service page", "Boarding · check availability or call"),
    },
  },
  {
    slug: "em-painting-tx",
    index: "15",
    name: "EM Painting TX",
    client: "E&M Commercial and Residential Painting",
    sector: "Residential & commercial painting · Greater Houston",
    headline: "A broad painting operation, turned into a local search platform.",
    summary:
      "E&M Commercial and Residential Painting is a Houston-area contractor serving homeowners and property managers. Before either picks up the phone they ask three things: do you do my kind of job, do you come to my city, and can I see your work. We gave each question a page: one per kind of job, one per city, and a gallery of the work itself.",
    brief:
      "Five service pages, seven city pages and eighteen named service areas, so a Houston-area buyer finds their job, their city and the work.",
    services: ["Strategy", "UX / UI", "Web", "Local SEO architecture"],
    built: [
      "A page for each kind of job, each with a city in the title and the job in the heading, with exterior prep described in six steps before colour.",
      "Local SEO architecture: city pages written for the place, such as Katy's climate, linking to service pages for that city, and eighteen service areas in every footer.",
      "Two buyers, two burdens of proof: workmanship for the homeowner, named property types for the property manager, and a quote form that asks project type and budget.",
    ],
    metrics: [
      { value: "5", label: "Service pages, one per kind of job" },
      { value: "7", label: "Cities with a page of their own" },
      { value: "18", label: "Service areas named in every footer" },
      { value: "4", label: "Ways to ask for a quote" },
    ],
    metricsSource: "Case study, October 2026 · counts published on the delivered site; no performance data was supplied",
    disclosure:
      "No performance data was supplied. No rankings, project counts, lead volumes or revenue are claimed; experience and accreditation statements are the client's own.",
    liveUrl: "https://empaintingtx.com/",
    caseStudyUrl: "/case-studies/em-painting-tx",
    caseStudyLabel: "Read Case Study",
    accent: "#3f6fe0",
    accentSoft: "#9fb8f2",
    dark: "#0a1430",
    sweep: "ltr",
    motion: { swap: "drift", direction: "ltr", pan: 10, zoom: 1.04 },
    images: {
      desktop: img("desktop", "empainting-01-desktop.jpg", 1440, 814, "EM Painting homepage: providing affordable painting services", "Web experience", "Homepage · residential and commercial painting"),
      mobile: img("mobile", "empainting-02-mobile.jpg", 1200, 1000, "EM Painting mobile screens: the homepage and residential and interior painting services", "Mobile experience", "Responsive · a free quote from every screen"),
      feature: img("feature", "empainting-03-feature.jpg", 1700, 1148, "EM Painting quote form on desktop and mobile, asking contact details, how they heard and project type", "Feature detail", "Quote form · project type before the callback"),
      secondary: img("secondary", "empainting-04-secondary.jpg", 1520, 978, "EM Painting work gallery: residential, interior and commercial painting", "Gallery", "The work · residential, interior, commercial"),
    },
  },
  {
    slug: "royalty-with-a-purpose",
    index: "16",
    name: "Royalty With A Purpose LLC",
    client: "Royalty With a Purpose LLC",
    sector: "Cleaning & contract staffing · Navarre, FL",
    headline: "One front door for three kinds of visitor.",
    summary:
      "Royalty With a Purpose is a Navarre, Florida cleaning company that also places contract workers with hospitality, retail and facilities businesses along the Emerald Coast. A homeowner wants to book, a hotel manager wants staff and a job-seeker wants to apply, so the first screen routes each down a path that never crosses the others again.",
    brief:
      "A cleaning and staffing site whose first screen routes homeowners, businesses needing staff and job-seekers onto three separate paths.",
    services: ["Digital strategy", "UX / UI", "Web development"],
    built: [
      "Three buttons in the first screen: Book Now in the header, Request Staff and Apply for Work in the hero, so each visitor's first click resolves who the site is for.",
      "Home and business cleaning kept apart, with eight services under two headings and four add-ons, so a daycare director never reads about move-out cleaning.",
      "Separation, not integration: three plain routes, a call to book, a staffing request and a job application, that never meet after the first screen.",
    ],
    metrics: [
      { value: "8", label: "Cleaning services, four home and four business" },
      { value: "3", label: "Audiences, each with a route of their own" },
      { value: "10", label: "Roles an applicant can choose" },
      { value: "5", label: "Areas named for staffing requests" },
    ],
    metricsSource: "Case study, October 2026 · counts published on the delivered site; no performance data was supplied",
    disclosure:
      "No performance data was supplied. No bookings, placements, clients, revenue, conversion figures or rankings are claimed.",
    liveUrl: "https://www.royaltywithapurposellc.com/",
    caseStudyUrl: "/case-studies/royalty-with-a-purpose",
    caseStudyLabel: "Read Case Study",
    accent: "#8fa9d8",
    accentSoft: "#c9d6ee",
    dark: "#080b14",
    sweep: "rtl",
    motion: { swap: "diagonal", direction: "rtl", pan: 7, zoom: 1.03 },
    images: {
      desktop: img("desktop", "royalty-01-desktop.jpg", 1440, 814, "Royalty With a Purpose homepage: cleaning services for home and business, with Request Staff and Apply for Work", "Web experience", "Homepage · three paths in the first screen"),
      mobile: img("mobile", "royalty-02-mobile.jpg", 1240, 1000, "Royalty With a Purpose mobile screens: the homepage and hospitality staffing services", "Mobile experience", "Responsive · cleaning and staffing on a phone"),
      feature: img("feature", "royalty-03-feature.jpg", 2200, 848, "Royalty With a Purpose staffing services for hospitality, retail and facilities, beside the request staff form", "Feature detail", "Staffing · services and the request form"),
      secondary: img("secondary", "royalty-04-secondary.jpg", 1200, 1000, "Royalty With a Purpose request staff form on mobile", "Request form", "Request staff · role, workers, message"),
    },
  },
  {
    slug: "safe-travel-charters",
    index: "17",
    name: "Safe Travel Charters",
    client: "Safe Travel Charters",
    sector: "Charter bus rental · Chicago, Milwaukee & Indianapolis",
    headline: "A charter purchase, turned into a path a coordinator can trust.",
    summary:
      "Safe Travel Charters is a charter bus rental company based in North Chicago with offices in Milwaukee and Indianapolis. A coordinator booking a wedding shuttle, a school trip or an airport transfer cannot test-drive the product, so the site matches their trip, shows the real buses and separates a free quote from a reservation.",
    brief:
      "Six trip types, the company's own fleet and fifty-three area pages, so a group coordinator can match their trip and get a quote.",
    services: ["Digital strategy", "UX / UI", "Web", "Local SEO"],
    built: [
      "Six trip types, each published with a one-line promise and an ideal-for tag, so a coordinator sees their kind of trip before reading anything else.",
      "Proof before the ask: the company's own fleet photographs, five mission pillars and three office addresses, then a free quote kept separate from a reservation.",
      "Local SEO architecture: a city in every title and fifty-three area pages across Illinois, Indiana and Wisconsin, each with a town in its heading.",
    ],
    metrics: [
      { value: "6", label: "Trip types, each with ideal-for tags" },
      { value: "3", label: "Offices with a street address" },
      { value: "53", label: "Area pages across Illinois, Indiana and Wisconsin" },
      { value: "10", label: "Blog articles on the first of six pages" },
    ],
    metricsSource: "Case study, October 2026 · counts published on the delivered site; no performance data was supplied",
    disclosure:
      "No performance data was supplied. No fleet size, passenger volume, safety statistics, on-time figures, ratings or rankings are claimed.",
    liveUrl: "https://safetravelcharters.com/",
    caseStudyUrl: "/case-studies/safe-travel-charters",
    caseStudyLabel: "Read Case Study",
    accent: "#4a90e2",
    accentSoft: "#a6c9f2",
    dark: "#0b1626",
    sweep: "ltr",
    motion: { swap: "wipe", direction: "ltr", pan: 7, zoom: 1.03 },
    images: {
      desktop: img("desktop", "safetravel-01-desktop.jpg", 1440, 814, "Safe Travel Charters homepage: your premier charter bus rental in Chicago, with Reserve Your Bus Now", "Web experience", "Homepage · charter bus rental in Chicago"),
      mobile: img("mobile", "safetravel-02-mobile.jpg", 1700, 1100, "Safe Travel Charters mobile screens: trip types, the homepage and the reservation form", "Mobile experience", "Responsive · trip types to reservation"),
      feature: img("feature", "safetravel-03-feature.jpg", 1520, 978, "Safe Travel Charters make a reservation form", "Feature detail", "Reservation · a trip goes in, a quote comes out"),
      secondary: img("secondary", "safetravel-04-secondary.jpg", 2104, 920, "Safe Travel Charters trip types, from corporate and weddings to school trips, beside the fleet page", "Trip types", "Six trip types · and the company's own fleet"),
    },
  },
  {
    slug: "on-top-home-services",
    index: "18",
    name: "On Top Home Services",
    client: "On Top Home Services LLC",
    sector: "Exterior cleaning & home services · Salem, OR",
    headline: "Sixteen services and seventeen cities, one acquisition platform.",
    summary:
      "On Top Home Services is a veteran-owned home services company in Salem, Oregon, from roof and gutter cleaning to soft washing, decks and remodeling. Homeowners search for the problem in their own town, so the site meets each search with its own page, explains the Oregon conditions behind it, and proves the company is real and local.",
    brief:
      "Sixteen services and seventeen Oregon cities, each with its own page, built as a grid that meets every service-in-town search.",
    services: ["Information architecture", "UX / UI", "Web", "Local SEO"],
    built: [
      "The grid is the strategy: a page for every service, every city and the pairings between them, such as roof cleaning in Salem.",
      "Oregon in the content, not only the title: fir needles in gutters, moss lifting shingles and north-wall algae explained, with twenty-two of thirty articles titled for Oregon.",
      "An explainer that prevents the wrong job, soft washing versus pressure washing, and a contact form that pre-selects the service and accepts photographs.",
    ],
    metrics: [
      { value: "16", label: "Services, each with its own page" },
      { value: "17", label: "Oregon cities, each with its own page" },
      { value: "15", label: "Service-in-city pages linked from the Salem hub" },
      { value: "30", label: "Blog articles, 22 titled for Oregon" },
    ],
    metricsSource: "Case study, October 2026 · counts published on the delivered site; no performance data was supplied",
    disclosure:
      "No performance data was supplied. No lead volume, revenue, rankings, traffic, conversion figures or verified review figures are claimed.",
    liveUrl: "https://ontophomeservices.com/",
    caseStudyUrl: "/case-studies/on-top-home-services",
    caseStudyLabel: "Read Case Study",
    accent: "#6b9bff",
    accentSoft: "#b4cbff",
    dark: "#0a1236",
    sweep: "rtl",
    motion: { swap: "drift", direction: "rtl", pan: 9, zoom: 1.035 },
    images: {
      desktop: img("desktop", "ontop-01-desktop.jpg", 1440, 814, "On Top Home Services homepage: home services done the right way, Salem, Oregon", "Web experience", "Homepage · veteran-owned, Salem, Oregon"),
      mobile: img("mobile", "ontop-02-mobile.jpg", 1200, 1000, "On Top Home Services mobile screens: the homepage and services built around your home's needs", "Mobile experience", "Responsive · services on a phone"),
      feature: img("feature", "ontop-03-feature.jpg", 1700, 1148, "On Top Home Services roof rejuvenation service page on desktop and mobile", "Feature detail", "Service page · roof rejuvenation"),
      secondary: img("secondary", "ontop-04-secondary.jpg", 1440, 814, "On Top Home Services services grid: decks, Christmas lights, roof rejuvenation, gutter and roof cleaning, washing", "Services", "Every service · its own page"),
    },
  },
  {
    slug: "jobco-supply",
    index: "19",
    name: "Jobco Supply",
    client: "Jobco Supply, Inc.",
    sector: "Industrial process heating · B2B commerce",
    headline: "A complex heater catalog, turned into a spec-first buying experience.",
    summary:
      "Jobco Supply is an industrial heater and sensor supplier in Fort Smith, Arkansas. Its buyers arrive with a bore diameter, a voltage and a machine that is down, not a part number, so the site narrows by attribute, proves the fit with documentation, and offers three honest routes: a cart for stock, a quote form for custom, and a phone.",
    brief:
      "An industrial heater catalog organised by the specs a buyer already has, with stock to cart, custom to a quote form, and documents that prove the fit.",
    services: ["Information architecture", "UX / UI", "Web", "Technical SEO"],
    built: [
      "Sixteen product families, each split by the attribute that decides it: cartridge heaters by diameter then voltage, band heaters by voltage first.",
      "Part-row tables that do the validating, stock shown before custom, and six custom quote forms, one per heater type, for anything the tables do not cover.",
      "A library of eighty-four guides, data sheets and manuals grouped by family, plus stated shipping times instead of the word fast.",
    ],
    metrics: [
      { value: "16", label: "Product categories on the home page" },
      { value: "7", label: "Cartridge heater diameters, one page each" },
      { value: "6", label: "Custom quote forms, one per heater type" },
      { value: "84", label: "Guides, data sheets and manuals in the library" },
    ],
    metricsSource: "Case study, October 2026 · counts published on the delivered site; no performance data was supplied",
    disclosure:
      "No performance data was supplied. No order volumes, customers, revenue, conversion rates, inventory levels, rankings or company certifications are claimed.",
    liveUrl: "https://jobcosupply.com/",
    caseStudyUrl: "/case-studies/jobco-supply",
    caseStudyLabel: "Read Case Study",
    accent: "#8b7cf6",
    accentSoft: "#c7befb",
    dark: "#100e22",
    sweep: "ltr",
    motion: { swap: "diagonal", direction: "ltr", pan: 6, zoom: 1.03 },
    images: {
      desktop: img("desktop", "jobco-01-desktop.jpg", 1440, 814, "Jobco Supply homepage: product search and heater category tiles, from band and cartridge to silicone heaters", "Web experience", "Homepage · search and sixteen product families"),
      mobile: img("mobile", "jobco-02-mobile.jpg", 1200, 1000, "Jobco Supply cartridge heater product page on mobile", "Mobile experience", "Product page · the spec, the price, the cart"),
      feature: img("feature", "jobco-03-feature.jpg", 2200, 848, "Jobco Supply stock cartridge heater types beside a cartridge heater product page", "Feature detail", "Stock first · then the exact part"),
      secondary: img("secondary", "jobco-04-secondary.jpg", 1700, 1148, "Jobco Supply homepage on desktop and mobile", "Responsive catalog", "The same catalog · desktop and phone"),
    },
  },
  {
    slug: "this-week-in-public-health",
    index: "20",
    name: "This Week in Public Health",
    client: "This Week in Public Health, by PubTrawlr",
    sector: "Public-health research intelligence · Product",
    headline: "A week of journals, turned into research a health official can cite.",
    summary:
      "This Week in Public Health is a research intelligence product made by PubTrawlr, a Lancaster, Pennsylvania company. Its readers face a volume problem, a jargon problem and a credibility problem at once, so the product curates the research, translates it into plain language and keeps every answer tied to a citation.",
    brief:
      "A research digest that monitors, filters and translates public-health studies into plain language, with every finding tied to its source.",
    services: ["Product strategy", "Editorial architecture", "UX / UI", "Web", "SEO/GEO"],
    built: [
      "Four editorial steps made visible, Monitor, Filter, Translate and Deliver, and a library where every entry carries the same fields: source, date, authors, summary and link.",
      "A personalised issue in three dropdowns: work setting, one of eight topics and a role, promising five findings and why they matter.",
      "A clear ladder from a free weekly highlight to a paid digest, with long-form posts that show the evidence standard and a cited assistant for the next question.",
    ],
    metrics: [
      { value: "4", label: "Editorial steps: monitor, filter, translate, deliver" },
      { value: "9", label: "Blog categories of long-form analysis" },
      { value: "8", label: "Topic options in the issue builder" },
      { value: "2", label: "Plans: a free preview and a paid digest" },
    ],
    metricsSource: "Case study, October 2026 · counts published on the delivered site; no performance data was supplied",
    disclosure:
      "No performance data was supplied. No subscriber, user, engagement, traffic or ranking figures are claimed, and no AI model or health outcome is claimed.",
    liveUrl: "https://thisweekinpublichealth.com/",
    caseStudyUrl: "/case-studies/this-week-in-public-health",
    caseStudyLabel: "Read Case Study",
    accent: "#f0893a",
    accentSoft: "#f8c493",
    dark: "#12151d",
    sweep: "rtl",
    motion: { swap: "wipe", direction: "rtl", pan: 6, zoom: 1.03, edgeTrace: true },
    images: {
      desktop: img("desktop", "twiph-01-desktop.jpg", 1440, 814, "This Week in Public Health homepage: stay ahead of the next public health challenge", "Web experience", "Homepage · research, distilled into take-aways"),
      mobile: img("mobile", "twiph-02-mobile.jpg", 1200, 1000, "This Week in Public Health mobile screens: the homepage and the research article library", "Mobile experience", "Responsive · the library on a phone"),
      feature: img("feature", "twiph-03-feature.jpg", 1700, 1148, "This Week in Public Health build your public health issue form on desktop and mobile", "Feature detail", "Build my issue · three dropdowns and an email"),
      secondary: img("secondary", "twiph-04-secondary.jpg", 2104, 955, "This Week in Public Health research articles library beside the subscription plans", "The library", "Research articles · free preview to paid digest"),
    },
  },
  {
    slug: "cfws-llc",
    index: "21",
    name: "CFWS LLC",
    client: "Central Florida Water Solutions, LLC",
    sector: "Residential water treatment · Central Florida",
    headline: "Orange stains, turned into a water test a homeowner will book.",
    summary:
      "Central Florida Water Solutions is a family-owned water treatment company in Lakeland, Florida. Homeowners search for the symptom, spots on the glasses or a sulfur smell, not the system, so the site names the symptom, explains the cause in plain words and offers a free water analysis before it ever names a product.",
    brief:
      "A water-treatment site that leads with the symptom, explains the cause plainly and offers a free water test before naming a system.",
    services: ["Digital strategy", "Content architecture", "UX / UI", "Web", "Local SEO"],
    built: [
      "The symptom in the headline, not the system: service pages written as No More Orange Stains rather than iron filtration, so a visitor recognises their problem.",
      "Softener versus filter explained where the confusion starts, with limits stated beside the claims, such as what UV treatment does not remove.",
      "The site sells a diagnosis, not a product: a free water analysis on every page, and sixteen Central Florida cities each given a line of local knowledge.",
    ],
    metrics: [
      { value: "8", label: "Treatment services, a page each" },
      { value: "16", label: "Central Florida cities named" },
      { value: "6", label: "Parameters in the free water test" },
      { value: "4", label: "Steps from test to ongoing support" },
    ],
    metricsSource: "Case study, October 2026 · counts published on the delivered site; no performance data was supplied",
    disclosure:
      "No performance data was supplied. No lead volume, tests booked, installations, customers, revenue, rankings or review figures are claimed.",
    liveUrl: "https://www.cfwsllc.com/",
    caseStudyUrl: "/case-studies/cfws-llc",
    caseStudyLabel: "Read Case Study",
    accent: "#8fd14f",
    accentSoft: "#c6eb9a",
    dark: "#0a1a24",
    sweep: "ltr",
    motion: { swap: "wipe", direction: "ltr", pan: 7, zoom: 1.03 },
    images: {
      desktop: img("desktop", "cfws-01-desktop.jpg", 1440, 814, "Central Florida Water Solutions homepage: cleaner, safer water for every home and business, with Get a Free Water Analysis", "Web experience", "Homepage · a free water analysis first"),
      mobile: img("mobile", "cfws-02-mobile.jpg", 1700, 1100, "Central Florida Water Solutions mobile screens: services, the homepage and the water analysis form", "Mobile experience", "Responsive · from symptom to free test"),
      feature: img("feature", "cfws-03-feature.jpg", 1520, 978, "Central Florida Water Solutions claim your free water analysis form", "Feature detail", "Free water analysis · what are you noticing?"),
      secondary: img("secondary", "cfws-04-secondary.jpg", 2200, 848, "Central Florida Water Solutions services beside the water filter versus water softener comparison", "Services", "Filter or softener · explained before the sale"),
    },
  },
  {
    slug: "5dccs",
    index: "22",
    name: "5D CCS",
    client: "Construction Containment Services (5DCCS)",
    sector: "Modular containment systems · San Jose",
    headline: "An unknown service, turned into five words a buyer remembers.",
    summary:
      "Construction Containment Services, trading as 5DCCS, rents, installs, sells and removes modular temporary walls for construction inside occupied buildings. Buyers search for how to keep a ward open during demolition, not for modular containment, so the site frames five problems, states its standards carefully and puts the quote one click from every page.",
    brief:
      "Modular temporary walls framed by five problems, Dust, Debris, Decibels, Demolition and Disruption, with a quote one click from every page.",
    services: ["B2B strategy", "Information architecture", "UX / UI", "Web", "Local and technical SEO"],
    built: [
      "The 5 Ds turn a product nobody asked for into five problems everybody has: Dust, Debris, Decibels, Demolition and Disruption.",
      "Four ways of working, full service, self-service, sale and consulting, plus the argument against plastic sheeting and temporary drywall.",
      "Ten sector pages in each sector's own vocabulary, standards stated with care as specified to meet, and a San Jose page that names the permit desk.",
    ],
    metrics: [
      { value: "5", label: "Ds the brand is built on" },
      { value: "4", label: "Ways to work with the company" },
      { value: "10", label: "Sector application pages" },
      { value: "5", label: "Steps from first call to final removal" },
    ],
    metricsSource: "Case study, October 2026 · counts published on the delivered site; no performance data was supplied",
    disclosure:
      "No performance data was supplied. No project count, clients, contract value, revenue, lead volume or ranking is claimed, and no certification of any standard is claimed.",
    liveUrl: "https://5dccs.com/",
    caseStudyUrl: "/case-studies/5dccs",
    caseStudyLabel: "Read Case Study",
    accent: "#f2c230",
    accentSoft: "#f8dd85",
    dark: "#0f1a33",
    sweep: "rtl",
    motion: { swap: "diagonal", direction: "rtl", pan: 7, zoom: 1.035 },
    images: {
      desktop: img("desktop", "5dccs-01-desktop.jpg", 1440, 814, "5DCCS homepage: fast, clean and professional temporary walls, with Get a Free Quote", "Web experience", "Homepage · modular containment specialists"),
      mobile: img("mobile", "5dccs-02-mobile.jpg", 1240, 1000, "5DCCS mobile screens: the homepage and flexible containment for every need", "Mobile experience", "Responsive · a quote from every screen"),
      feature: img("feature", "5dccs-03-feature.jpg", 1700, 1148, "5DCCS full-service containment in five steps, on desktop and mobile", "Feature detail", "Five steps · first call to final removal"),
      secondary: img("secondary", "5dccs-04-secondary.jpg", 1520, 978, "5DCCS flexible containment for every need: full-service and self-service wall rentals", "Ways of working", "Full-service or self-service · four ways in"),
    },
  },
  {
    slug: "nexus-alliance",
    index: "23",
    name: "Nexus Alliance Inc",
    client: "Nexus Alliance Inc.",
    sector: "Government-contract operational support · Federal",
    headline: "Making a supporting role read as the stronger choice.",
    summary:
      "Nexus Alliance supports prime contractors executing federal contracts in operational areas where the prime's own experience is limited. A prime is not looking for a competitor, so the one-page site opens with the prime's own question, defines the role by contrast, names its work in the government's own codes and ends on a conversation, not a quote.",
    brief:
      "A one-page partner site that answers a federal prime contractor's own question: why would bringing Nexus on make my contract stronger?",
    services: ["B2B positioning", "Messaging strategy", "UX / UI", "Web", "SEO/GEO"],
    built: [
      "Open with the prime's own question, set in large type, and answer it: you won the contract, now let's make it work.",
      "Define the role by contrast, pairing every we don't with a we do, and prove it with one anonymised scenario that ends: the prime leads, Nexus strengthens.",
      "Seven NAICS codes where a procurement reader looks, and a contact block that opens with a qualifying question instead of a quote request.",
    ],
    metrics: [
      { value: "1", label: "Page carrying the whole position" },
      { value: "7", label: "NAICS codes listed in the footer" },
      { value: "4", label: "We don't / we do pairs" },
      { value: "3", label: "Policy documents behind the form" },
    ],
    metricsSource: "Case study, October 2026 · counts published on the delivered site; no performance data was supplied",
    disclosure:
      "No performance data was supplied. No federal award, contract value, agency, customer, certification or ranking is claimed; experience statements are the client's own.",
    liveUrl: "https://nexusallianceinc.com/",
    caseStudyUrl: "/case-studies/nexus-alliance",
    caseStudyLabel: "Read Case Study",
    accent: "#86b84f",
    accentSoft: "#c2dd9f",
    dark: "#0f170b",
    sweep: "ltr",
    motion: { swap: "drift", direction: "ltr", pan: 8, zoom: 1.03 },
    images: {
      desktop: img("desktop", "nexus-01-desktop.jpg", 1440, 814, "Nexus Alliance homepage: why would bringing Nexus Alliance on to my team make my contract stronger?", "Web experience", "Homepage · the prime's own question"),
      mobile: img("mobile", "nexus-02-mobile.jpg", 1700, 1100, "Nexus Alliance mobile screens: the homepage, our vision and contact us", "Mobile experience", "Responsive · one page, one position"),
      feature: img("feature", "nexus-03-feature.jpg", 1520, 978, "Nexus Alliance contact form: let's explore the fit", "Feature detail", "Contact · a conversation about fit"),
      secondary: img("secondary", "nexus-04-secondary.jpg", 1440, 814, "Nexus Alliance our vision and experience: a specialized government support partner", "Position", "Our vision · an extension of your team"),
    },
  },
  {
    slug: "fairpath-consultants",
    index: "24",
    name: "Fairpath Consultants",
    client: "FairPath Consultants LLC",
    sector: "Adaptive & assistive devices · Gardena, CA",
    headline: "Assistive devices, made easier to find and understand.",
    summary:
      "FairPath Consultants is a Gardena, California supplier of adaptive and assistive devices, selling a standing bed and a portable bedside shower system to individuals, caregivers and institutional buyers. Someone with a specific need may not share the manufacturer's vocabulary, so the site names each device by what it does and publishes the terms a buyer will be asked for.",
    brief:
      "Two assistive devices named by what they do, with the terms, warranty and standards a caregiver or institutional buyer needs published before the cart.",
    services: ["Product strategy", "Accessibility UX", "Web", "SEO/GEO"],
    built: [
      "Name the device by what it does, so a caregiver can tell what the bathing system does from its name and category label.",
      "Define the words before selling into them: six articles sort adaptive from assistive devices, the vocabulary a buyer may not share.",
      "Answer the buyer's form in public: a fourteen-entry FAQ covering manufacturer, lead times, warranty, delivery and returns, with standards attributed to the product.",
    ],
    metrics: [
      { value: "2", label: "Named products, described by function" },
      { value: "14", label: "FAQ entries answering a buyer's form" },
      { value: "6", label: "Articles defining the category's words" },
      { value: "2", label: "Ways in: a cart and a consultation" },
    ],
    metricsSource: "Case study, October 2026 · counts published on the delivered site; no performance data was supplied",
    disclosure:
      "No performance data was supplied. No sales, users, leads or rankings are claimed, no medical benefit or coverage is claimed, and no accessibility conformance level is asserted.",
    liveUrl: "https://www.fairpathconsultants.com/",
    caseStudyUrl: "/case-studies/fairpath-consultants",
    caseStudyLabel: "Read Case Study",
    accent: "#c2a878",
    accentSoft: "#e2d3b6",
    dark: "#121110",
    sweep: "rtl",
    motion: { swap: "wipe", direction: "rtl", pan: 6, zoom: 1.05 },
    images: {
      desktop: img("desktop", "fairpath-01-desktop.jpg", 1440, 814, "FairPath Consultants homepage with the standing bed", "Web experience", "Homepage · adaptive and assistive devices"),
      mobile: img("mobile", "fairpath-02-mobile.jpg", 1200, 1000, "FairPath Consultants homepage on mobile", "Mobile experience", "Responsive · the same clarity on a phone"),
      feature: img("feature", "fairpath-03-feature.jpg", 1700, 1148, "FairPath Consultants Switle Body portable bedside shower system product page on desktop and mobile", "Feature detail", "Product page · named by what it does"),
      secondary: img("secondary", "fairpath-04-secondary.jpg", 1520, 978, "FairPath Consultants products: the standing bed, the bedside shower system and assistive devices", "Products", "Two devices · and the words that explain them"),
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
