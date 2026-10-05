# AGENTS.md — project conventions

## Project
- Name: Vacations on Wheels website (RV service, parts, warranty and insurance-claim repairs; 1841 Hwy 7, Concord, ON)
- Client: Paul Buro (Vacations on Wheels Inc., sister business of RV Farm on the same lot). Developer: James (Kim Consultant)
- Stack: Astro 7 (static output) + React 19 islands + Tailwind 4; services as typed JSON via Astro content collections (Zod); images via astro:assets/sharp; forms POST to Web3Forms
- Seeded from `../buro-rvfarm-web` at `8a90ab7` (files copied, not history). Fixes there don't reach this repo automatically; port them by hand
- Hosting: Railway, Dockerfile (Caddy serving `dist/`). Nothing deploys without James's approval.
- Repo: github.com/HamesInFlames/vow-web. Work on `dev`; James merges to `main`.
- Brief: `docs/plan.md` (approved Oct 5, 2026). Current-site record: `docs/site-capture/vow-site-capture.md`. Research and client facts live in the vault `../Buro Enterprise` (read-only from here, except `30-worklog.md`).

## Code conventions
- TypeScript strict; ESM only
- Astro components for static UI; React islands only where state is needed (the booking, part-request and claim forms)
- CSS for hover/accordion; everything off under `prefers-reduced-motion` or `html[data-motion="reduce"]`
- Tailwind 4 with tokens in `src/styles/global.css` `@theme` (colours from the VOW logo); no raw hex in components
- NAP, hours, phones, email and the Google rating come only from `src/data/business.json`; services only from `src/content/services/`; unverified claims only through `src/data/claims.json` and `<Claim>`

## Content rules (non-negotiable)
- Real client facts only (vault `research/existing-sites-audit.md`, `docs/site-capture/`); unverified facts carry `[confirm]` and are hidden in production builds
- No price unless Paul confirmed it: "From $X + HST" when confirmed, otherwise "Quote after inspection". Never "Call for price"
- No OMVIC or dealer-act wording; no motorhome-brokerage copy until a lawyer has looked. Never "new owner"
- Google rating as a plain linked line from `business.json`, never a badge widget. No invented reviews, staff, numbers, awards, certifications or insurer names
- Real photos only (watermarked derivatives); otherwise a sand "Photo coming: [what]" block. No AI or stock imagery. `015-vow.jpg` and `018-image-7.png` are unconfirmed and stay out until Rae confirms them
- No customer PII in the repo. Forms never ask for SIN, DOB or banking
- Banned copy: unlock, elevate, seamless, empower, effortless, leverage, streamline, journey, robust, cutting-edge, next-level, "it's not just X", "look no further"
- Readability: body 17–18 px, 7:1 contrast target, 44–48 px targets, labels above fields, phone in text on every screen. No Inter/Geist, no dark mode, no sliders, no smooth-scroll, no parallax on text, no entry modals

## File structure
- /src/pages — routes
- /src/layouts/Base.astro — document shell, meta, fonts, reduced-motion flag
- /src/components/astro — static components; /src/components/islands — React islands
- /src/data — `business.json`, `claims.json` (reviews and services added in Phase 1)
- /src/lib — `hours.ts`, `seo.ts` (AutoRepair JSON-LD), `format.ts`, `site.ts` (nav, review mode)
- /src/assets/brand — VOW logo (raster; vector still an open ask)
- /src/styles/global.css — Tailwind `@theme` tokens
- /scripts — `contrast.mjs`, `content-check.mjs`, `confirm-report.mjs`
- /tests — Playwright: link crawl, axe, tap targets, font size, reduced motion, screenshots; unit tests for lib
- /docs — `plan.md`, `site-capture/`, `confirm-report.md` (generated); /tasks — todo, status, decisions

## Workflow
- Read tasks/todo.md and tasks/status.md before starting work
- Update tasks/status.md after each session; log decisions in tasks/decisions.md
- `npm run verify` (build + checks) must pass before committing
- Scope: do what the task asks; don't fix, optimize or extend unrelated code in the same change

## Do NOT
- Install packages that aren't in tasks/decisions.md without asking James (log the reason there)
- Push, deploy, connect a domain or contact the client without James's approval
- Delete .env files or edit .claude/settings.json / .claude/hooks
