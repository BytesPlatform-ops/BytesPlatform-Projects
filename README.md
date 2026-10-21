# BytesPlatform — Projects / Case Studies

Production-ready Projects page built with **Next.js 15 (App Router) + TypeScript + CSS Modules**.
No UI libraries, no animation libraries: the whole hover system is CSS, plus ~40 lines of JS for
mouse parallax and scroll reveal.
   
## Run. 
  
```bash. 
npm install. 
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Structure. 

```
src/lib/site.ts                         brand, public URLs and main-site routes
src/app/layout.tsx                      global shell: Geist fonts, brand intro, header, footer
src/app/page.tsx                        the Projects page (hero, at a glance, about, numbers, capabilities, case studies)
src/app/projects.module.css
src/components/PageIntro.tsx            brand curtain on first entry (CSS timeline, once per session)
src/components/ShowcaseCanvas.tsx       "At a glance": layered real screens, rotating phones, industry ticker
src/components/AboutSection.tsx         About copy and the regional footprint (Denton → Middle East, Africa)
src/components/ByTheNumbers.tsx         company figures that count up once, with symbolic illustrations
src/components/CapabilityExplorer.tsx   capability list with one live preview (accordion on phones)
src/lib/useReveal.ts                    one-shot entrance state shared by the sections above
src/components/ProjectArticle.tsx       one project: header, showcase, copy, services, CTAs
src/components/ProjectShowcase.tsx      dark media composition + parallax (client)
src/components/ProjectShowcase.module.css   the hover system
src/components/GalleryCursor.tsx        floating "View Gallery ↗" cursor pill (fine pointers)
src/components/ImageLightbox.tsx        fullscreen gallery; expands from / collapses into the thumbnail
src/components/SiteHeader.tsx / SiteFooter.tsx
src/components/RevealObserver.tsx       scroll reveal (no-JS and reduced-motion safe)
src/data/projects.ts                    ALL content: copy, metrics, images, accent colours, per-project `motion` recipe
public/images/projects/                 project images (4 per project)
public/images/montage/                  phone screens cropped from the mobile composites
```

## Deploying at portfolio.bytesplatform.com

The app is served at the root of its own subdomain (`basePath` is empty in `src/lib/site.ts`).
Deploy it as a standalone Next.js app (e.g. Vercel) and point a `portfolio` CNAME record at it.

Canonical and Open Graph URLs point at `https://portfolio.bytesplatform.com` (`PROJECTS_URL`).
Header, footer and capability links that belong to the main website point at its existing routes
on `https://bytesplatform.com` (`main` in `site.ts`).

## Editing content

Everything lives in `src/data/projects.ts`. Each project has an `accent`, `dark` and `sweep`
(`ltr` / `rtl`) value that drive the project-specific colour and hover direction. Metrics and
copy are taken verbatim from the case-study PDFs; `disclosure` carries each study's own caveat.
Replace `caseStudyUrl` with `/case-studies/<file>.pdf` if you host the PDFs in `public/`.
