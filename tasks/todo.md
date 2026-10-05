# Tasks — Vacations on Wheels website

Plan: `docs/plan.md` (§3g phases). Approved Oct 5, 2026.

## In progress
- [ ] Phase 1 — `services` content collection (Zod) from `docs/site-capture/` (8 current services + engine/electrical, warranty repair, insurance claims, mobile service and transport, the last four `[confirm]`); `/services`, `/services/[slug]`, `/book` (form island adapted from RV Farm's LeadForm), `/thanks`; home sections 3–9 (plan §3b)
- [ ] Phase 2 — `/insurance-claims`, `/warranty`, `/pick-up-and-delivery`, `/parts`, `/parts/request`, `/about`, `/reviews`, `/contact`, legal drafts for a service shop (privacy, terms, accessibility), confirm report; photo pipeline only once a photo is confirmed (RV Farm's `scripts/photos.mjs` with the VOW watermark)
- [ ] Phase 3 — Lighthouse on every page type, emulated Android pass, print, `/code-review high` in a fresh session
- [ ] Phase 4 — walkthrough with Paul and Rae (James), alongside RV Farm's (`../buro-rvfarm-web/docs/walkthrough-paul-rae.md` Part 5 has the VOW questions)

## Blocked / waiting on James
- [ ] Rae's answers to the VOW questions (walkthrough sheet Part 5; plan §5)
- [ ] Web3Forms access key for VOW forms (`PUBLIC_WEB3FORMS_KEY`); until then forms show a call block
- [ ] Railway service for the review build (not approved yet)
- [ ] vacationsonwheels.ca is registered to Turnkey; nothing launches on it until the registrant is Paul's company (vault `92`)
- [ ] A vector VOW logo (the badge is a 392 px raster)

## Completed
- [x] Phase 0 — seeded from `buro-rvfarm-web` at `8a90ab7`, inventory removed, VOW tokens from the logo, `business.json`, header/footer/utility row/sticky bar, favicons, home shell, AGENTS/CLAUDE/tasks, guardrails (Oct 5)
- [x] Stage 1 — `docs/plan.md`, live-site capture `docs/site-capture/` (18 of 37 pages) (Oct 5)
