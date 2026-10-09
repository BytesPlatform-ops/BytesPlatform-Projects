# BytesPak — Projects / Case Studies

Production-ready Projects page built with **Next.js 15 (App Router) + TypeScript + CSS Modules**.
No UI libraries, no animation libraries: the whole hover system is CSS, plus ~40 lines of JS for
mouse parallax and scroll reveal.

## Run

```bash
npm install
npm run dev      # http://localhost:3000  (/ redirects to /projects)
npm run build && npm start
```

## Structure. 

```
src/app/layout.tsx                      global shell: Geist fonts, header, footer
src/app/projects/page.tsx               the Projects page (hero, BytesPak intro, 5 case studies)
src/app/projects/projects.module.css
src/components/ProjectArticle.tsx       one project: header, showcase, copy, services, CTAs
src/components/ProjectShowcase.tsx      dark media composition + parallax (client)
src/components/ProjectShowcase.module.css   the hover system
src/components/GalleryCursor.tsx        floating "View Gallery ↗" cursor pill (fine pointers)
src/components/ImageLightbox.tsx        fullscreen gallery; expands from / collapses into the thumbnail
src/components/SiteHeader.tsx / SiteFooter.tsx
src/components/RevealObserver.tsx       scroll reveal (no-JS and reduced-motion safe)
src/data/projects.ts                    ALL content: copy, metrics, images, accent colours, per-project `motion` recipe
public/images/projects/                 20 project images (4 per project)
```

## Integrating into an existing BytesPak Next.js site

1. Copy `src/app/projects/`, `src/components/Project*.tsx|css`, `src/components/RevealObserver.tsx`,
   `src/data/projects.ts` and `public/images/projects/` into the site.
2. Keep the site's own header/footer; drop `SiteHeader`/`SiteFooter` from `layout.tsx`.
3. Merge the `:root` tokens from `src/styles/globals.css` (`--ease`, `--pad`, `--line`, font vars) into
   the site's global stylesheet, or keep the file.
4. Remove the `/` → `/projects` redirect in `next.config.ts` if the site already has a home page.

## Editing content

Everything lives in `src/data/projects.ts`. Each project has an `accent`, `dark` and `sweep`
(`ltr` / `rtl`) value that drive the project-specific colour and hover direction. Metrics and
copy are taken verbatim from the case-study PDFs; `disclosure` carries each study's own caveat.
Replace `caseStudyUrl` with `/case-studies/<file>.pdf` if you host the PDFs in `public/`.
