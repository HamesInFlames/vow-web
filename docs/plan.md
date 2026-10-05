# Vacations on Wheels website: competitive brief and build plan

Stage 1 (no code). Written Oct 5, 2026 for James. Approving this plan approves the package list in §4 and the seeding approach in §3a.

Sources (vault paths unless noted): `20-decisions.md` (the latest entry wins), `40-mock-sites-plan.md` ("`40`"), `research/existing-sites-audit.md` ("audit"), `research/competitor-rv-dealer-patterns.md` ("CP", Part 3 and 4.5–4.7), `60-meeting-2026-09-22.md`, `80-meeting-2026-09-29.md`, `90-ops-plan-2026-10-01.md`, `91-discovery-questionnaire.md`, `92-domains-2026-10-02.md`, `PHOTOS-TO-ENHANCE/`. New: **`docs/site-capture/vow-site-capture.md`** in this repo, a capture of 18 of the live site's 37 pages taken Oct 5 (the September audit only had the homepage). The RV Farm build (`../buro-rvfarm-web`, `docs/plan.md`, `tasks/decisions.md`) is the template.

---

## 0. What VOW is, in one paragraph

Vacations on Wheels Inc. is the RV service and parts shop at 1841 Hwy 7, Concord, on the same lot as RV Farm. Phone 905-738-1253; the only published email is vacationsonwheel@gmail.com (About page). Google profile 4.4–4.5★ on ~140 reviews, the best online asset either brand has. The shop does repairs, maintenance, winterizing, inspections, warranty and insurance-claim repairs, pick-up of units, and sells parts (an NTP catalogue link and nine Onan generators). It also sells Global Warranty extended-warranty plans (the "Warranty" page is that brochure, not warranty-repair info). The current Turnkey site has RV Farm's sales copy on the home page, a deposit FAQ that belongs to a dealer, dealer boilerplate privacy and terms, dead "Helpful Links", two empty pages and no H1s. It is a separate brand from RV Farm, and Paul rejected a merged site (`90` §3.3).

The site sells three things (`40` §0): **book service, request a part, start an insurance claim.**

---

## 1. Competitive scorecard

Service and parts sites only (CP Part 3, the dealer service pages in Part 1, and 4.5–4.7).

| # | Convention or best-in-class detail | Who does it best | What VOW will do | How it matches or beats them |
|---|---|---|---|---|
| 1 | Phone and "open today until 5" in the top bar | Bucars (phone, toll-free, text, hours) | Utility row from RV Farm: live open/closed in Toronto time, tap-to-call 905-738-1253, address. Phone in text on every screen | Same as the best; already built and tested on RV Farm |
| 2 | Sticky Call · Text · Directions · Book bar on phones | Few do it (CP 4.7 #5) | Sticky bar: Call · Directions · **Book**. "Text" appears only if a text line is confirmed | Beats every Ontario service page in the research |
| 3 | Priced packages | Campkin's (Spring $289 / $599 / $899–1,149 + à-la-carte), Can-Am (winterize $109.95, LP $69.95) | `services.json` has a `fromPriceCad` per service. Any price Paul confirms shows as "From $X + HST". Unconfirmed prices show "Quote after inspection", never "Call for price" | Matches Campkin's once Paul gives even one price (winterizing is the obvious one). Without prices, VOW is level with 417RV and Owasco, and the page still says what's included |
| 4 | Service catalogue: card → page per service | Owasco (14 cards), Bucars (category → page) | `/services` with tiles, one page per service: what's included, price or "quote after inspection", time it usually takes `[confirm]`, what to bring, related services, three FAQs, a pre-filled booking link | Deeper than any Ontario competitor; each page answers what a phone call would |
| 5 | One booking form, few fields | CP 4.5 union; Owasco's "bought here?" checkbox | One `/book` form (≤8 visible fields): name, phone, email (optional), preferred contact, vehicle (type, year, make, model), service (multi-select, pre-filled from the page), drop-off or pick-up, preferred week, notes. "I bought it at RV Farm" checkbox. "This is a request, not a confirmed booking. We'll call you to confirm." | Fewer fields than Fraserway and Owasco; no confirm-email or mandatory postal code (CP 4.7 #3) |
| 6 | Certified brands listed | Owasco (Winnebago, Jayco…), 417RV (Keystone, Forest River, Coachmen) | A brands row only from confirmed facts. Today that's nothing verified: the Dometic locator listing (audit) isn't mentioned on the current site, and the eight "supplier" logos include RV Farm sales brands. All `[confirm]` | Honest by default; matches Owasco once Rae confirms |
| 7 | "We handle insurance claims" | 417RV, CampMart (one line each) | A full `/insurance-claims` page: the steps from damage to repair, what to photograph, what to have ready (insurer, claim number), and a claim form | No competitor in the research explains the process; this is a differentiator (§2) |
| 8 | Parts without a full store | Can-Am (rvflipbook catalogue + "email us year/make/model, VIN, part #"), Bucars (category tiles + request form) | `/parts`: category tiles, the NTP catalogue link VOW already has, "Request a part" form (vehicle, part name or number, quantity, contact). `/parts/generators` only if the Onan stock is confirmed | Matches Can-Am and Bucars; fixes "orphaned parts" (CP 4.7 bonus) |
| 9 | Google rating and real reviews near the top | Bucars (4.5★ with owner replies) | Rating line "4.4★ on Google, ~140 reviews" linked to the profile, value and date in one config field `[confirm at launch]`. 3–6 real Google reviews quoted with first name and date, chosen by James/Rae | Real reviews only; no rating badge widget, no invented quotes. The site's own "4.3/5, thousands of happy owners" claim is dropped (unsourced) |
| 10 | Mobile service and transport | Traveling RV Technicians (Rates page), Mobile RV Tech Services | `/pick-up-and-delivery`: the shop picks up and returns units (the current site's Pick-up form); radius and fee `[confirm]`; mobile on-site service only if Paul confirms it | Few Ontario shop sites offer pick-up at all |
| 11 | Map, address, hours on a store page | Can-Am (hours Mon–Fri 9–6, Sat 9–5) | `/contact`: map link, address, hours table with today highlighted, phone, email, the RV Farm next-door card | Same as RV Farm, already built |
| 12 | Plain labels, breadcrumbs, printable | CP 4.6 #10 | "Book service", "Request a part", "Insurance claims"; breadcrumbs; print styles | Already built on RV Farm |

**The five things service pages do badly (CP 4.7), and VOW's fix:**

| Problem | VOW today | Fix |
|---|---|---|
| Stale or empty content | Empty `/Parts` and `/Service` pages; dealer deposit FAQ; RV Farm sales copy on the home page | One data file per fact; empty sections don't render; content grep for dealer words |
| Hidden prices | "Contact for price" on every service | "From $X + HST" where confirmed, otherwise "Quote after inspection" plus what's included |
| Form sprawl | Five forms (Parts, Service, Pick up, Contact, Accessibility) plus "Request More Info" | Three forms: book, part request, insurance claim. Contact is phone, map and the booking form |
| Pages that describe but don't sell | Service items are a paragraph and a button | Each service page ends in a booking link with the service pre-selected |
| Weak mobile | Hours in a modal, no sticky bar | Sticky bar, hours in the utility row |

---

## 2. Differentiators VOW can own

Each one is grounded in a real fact; the ones that need Rae carry `[confirm]` and are hidden in production until confirmed.

1. **Next door to RV Farm.** Buy at RV Farm, get it serviced at VOW, same address. The booking form has "I bought it at RV Farm", and RV Farm's unit pages already link to VOW. (`20` Sept 22, RV Farm site)
2. **Insurance claims explained step by step.** The current site says VOW handles claims; nobody in the research explains how. A clear 5-step page plus a claim form is cheap and earns trust. The exact steps `[confirm]` with Paul (who calls the insurer, who pays the deductible, how long approval takes).
3. **We pick it up.** The current site has a pick-up request form and "convenient pickup and delivery of serviced units". Radius and fee `[confirm]`.
4. **Spanish-speaking technicians.** Three diesel techs (handoff, `40` §2). Shown as "Spanish-speaking technicians" on the service pages; "Hablamos español" in the header only if someone answering the phone speaks Spanish `[confirm]`.
5. **The Google rating.** 4.4★ on ~140 reviews is VOW's strongest asset and stronger than RV Farm's. It's shown as a plain line with a link, never a badge, and the figure is updated at launch.

Possible sixth, if Paul confirms it: **"No work beyond the estimate without your OK."** Several low-star reviews are about surprise charges (audit §6). A written process (inspect, estimate, call to approve, then repair) answers that directly. Only if it's how the shop actually works.

---

## 3. Reconciled plan

### 3a. Overrides of `40` and where they come from

| # | Override | Replaces | Source |
|---|---|---|---|
| V1 | **Seed from `buro-rvfarm-web` at `8a90ab7` by copying files**, not degit with history (RV Farm's history carries 55 MB of photos). Keep the infrastructure, delete inventory, add services | `40` §8 `npx degit ../buro-rvfarm-web` | RV Farm repo size; this plan |
| V2 | **Hosting: Railway**, Dockerfile + Caddy, a new service in the RV Farm Railway project ("empowering-wholeness"), branch `dev` as the review build. Nothing deploys without James | `40` D2 Cloudflare | RV Farm decision 2026-10-05 |
| V3 | **Colours from the VOW logo**: black/charcoal and the badge red, on cool grey surfaces. RV Farm keeps warm sand, red and orange. Same fonts and layout, so the two read as one family without being confused | `40` §2 steel navy `#1F3A5F` | `60` §3 "re-derive tokens from VOW's logo"; logo is red/black/white |
| V4 | **No OMVIC or dealer-act wording**; **no motorhome-brokerage copy** until a lawyer looks | `40` footer "OMVIC #—" | `20` 2026-09-29; `60` §4 |
| V5 | **Services: 8 from the current site + 4 from the handoff**, the 4 `[confirm]`. Vehicle range beyond RVs (cars, trucks, boats, ATVs, semis, heavy equipment) `[confirm]` and hidden until confirmed | `40` §4's 12 as fact | Capture; `91` V3 |
| V6 | **Warranty page splits in two meanings**: warranty *repair* (manufacturer warranty work, brands `[confirm]`) and Global Warranty *extended plans* VOW sells. Brochure copy is not reproduced; the page links to the provider | `40` `/warranty-repair` | Capture: Warranty page is Global Warranty's brochure |
| V7 | **Seasonal pages only when real**: `/services/winterizing` is built now (it's October). Spring packages wait for Paul's tiers and prices; no placeholder price tables | `40` `/winterizing` + `/spring-packages` with "confirm" prices | `20` content honesty |
| V8 | **Generators page only if the Onan stock is confirmed**; the 9 item pages weren't captured (firewall) and have no prices | `40` `/parts/generators` | Capture |
| V9 | **No photo upload in forms at launch.** Web3Forms file uploads need a paid plan; the forms ask customers to email photos instead (or text, if a text line is confirmed) | `40` `/book` photo upload | Web3Forms pricing `[confirm]` |
| V10 | **Watermark: VOW logo** on VOW photos, same pipeline as RV Farm | `20` Oct 1 (logo v2 = RV Farm's) | `20` 2026-10-01 |
| V11 | **Photos: almost none are confirmed real.** `015-vow.jpg` (a "Retreat" trailer having a slide rebuilt) has no recorded source; `018-image-7.png` (motorhome on red column lifts) looks like stock. Both `[confirm]`. Everything else uses the sand "Photo coming: [what]" block until Martin's shoot | `40` hero `HeroKenBurns` on a real bay photo | `10` §1 "No bay, staff or building photography exists"; AGENTS rules |
| V12 | **Booking note names no person**: "We'll call you to confirm." (Lisa is leaving; Steve moved to operations; Rae is Paul's assistant) | `40` "Rae confirms by phone" | `60` §3 |
| V13 | **No interim page by default.** The domain can't move until Turnkey changes the registrant (`92`), so a VOW interim page has nowhere to go yet. If the domain frees up before the full site is approved, a one-page interim (1 h, same as RV Farm's) is built then | `20` 2026-09-29 (both sites to interim) | `92` |
| V14 | **Dropped unsourced claims** from the current site: "100 years of combined experience", "4.3/5… thousands of happy RV owners", "certified technicians", "decades of expertise", "all major insurance companies", "we guarantee all our workmanship", "insured transport fleet". Each one goes in `claims.json` as `[confirm]` and shows only if Rae confirms it | Current site copy | AGENTS content rules |

### 3b. Sitemap

**Header:** VOW logo → `/`. Nav: **Services** (panel: every service with a page · Winterizing) · **Book service** (red button) · **Parts** (panel: Parts · Request a part · Generators if confirmed) · **Insurance claims** · **Warranty** · **About** (panel: About us · Reviews · Contact). Phone shown on desktop. Phones: logo · Call · Menu, and the sticky bar.

**Utility row:** open/closed now · 1841 Hwy 7, Concord · 905-738-1253 · "RV Farm (sales) is next door ↗".

**Footer:** services list, parts and claims, the shop (about, reviews, contact), hours table, contact block, RV Farm card, legal links, © Vacations on Wheels Inc. `[confirm legal name]`, motion toggle.

| Route | Content |
|---|---|
| `/` | 1. Hero: H1 "RV repair, parts and insurance claims in Concord"; deck from confirmed facts only; **Book service** / **Call 905-738-1253**. Photo only if `015` is confirmed, otherwise a split hero with a sand block. 2. Google rating line + "Open today until 5" + "We pick up your RV" `[confirm]`. 3. Service tiles (only services with pages). 4. Winterizing band (Sept–Nov; swaps to spring when it's built). 5. Insurance claims and warranty, side by side, each with 3 steps. 6. Parts band (catalogue + request). 7. Pick-up band. 8. Three Google reviews `[confirm selection]`. 9. "Buying? RV Farm is next door" band. 10. Map and hours |
| `/services` | All service tiles; filter chips by vehicle type only once types are confirmed (V5) |
| `/services/[slug]` | ×8–12. What's included, price line, usual turnaround `[confirm]`, what to bring, related services, 3 FAQs, Book this service |
| `/book` | The booking form (§1 row 5). No-JS POST, error summary, focus management (RV Farm's LeadForm) |
| `/insurance-claims` | Steps, what to photograph, what to have ready, claim form (insurer, claim #, vehicle, what happened, contact) |
| `/warranty` | Warranty repair (brands `[confirm]`) and extended plans (Global Warranty, link out, plans by name only) |
| `/pick-up-and-delivery` | What it is, radius and fee `[confirm]`, pick-up request through `/book` with "Pick up" selected |
| `/parts` | Category tiles, NTP catalogue link, phone, "we quote by phone", request link |
| `/parts/request` | Part request form |
| `/parts/generators` | Only if confirmed (V8) |
| `/about` | Confirmed facts only: the shop, the lot it shares with RV Farm, Spanish-speaking techs `[confirm]`, staff count and bays `[confirm]`; photo blocks |
| `/reviews` | Rating line, 6 real Google reviews, "Leave a review on Google" |
| `/contact` | Map, address, hours, phone, email `[confirm]`, booking link |
| `/thanks`, `/privacy`, `/terms`, `/accessibility`, `/sitemap`, `/404`, `robots.txt` | As RV Farm. Privacy and terms rewritten for a service shop (the current ones are Turnkey dealer boilerplate), drafts for the lawyer |

About 30 pages. Not built: blog (the two 2025 posts are generic), spring packages (V7), storage (`91` V9, unconfirmed), motorhome brokerage (V4).

### 3c. Data

- `src/data/business.json` (RV Farm's `dealership.json` shape): legalName, brandName, address ("1841 Hwy 7" vs "Hwy 7 W" `[confirm]`), phones {main, tollFree: null, sms: null}, email `[confirm]`, hours (site: Mon–Sat 9–5, Sun closed; Google says Mon–Fri 9–6 `[confirm]`), languages, social (the site's links are empty; `facebook.com/vacationsonwheels` and `instagram.com/vacationsonwheelsinc` from the audit `[confirm]`), google {rating, count, url, asOf}, sibling {RV Farm, url, phone}, `confirm[]`.
- `src/content/services/*.json` (content collection, Zod): slug, name, summary, vehicleTypes[], fromPriceCad?, priceNote, turnaround?, includes[], bring[], faq[], related[], season?, confirmed (bool), confirm[]. Unconfirmed services are hidden in production.
- `src/data/claims.json`, `src/data/reviews.json` (same mechanism as RV Farm: shown in production only when `confirmed`).
- No fees, no inventory, no price lib.

### 3d. Design tokens (V3)

Sampled from `016-Vacation_Logo.png` in Phase 0 and checked with `npm run contrast` at the same targets (7:1 body text). Starting point: charcoal ink for headings and the header band, the logo red as the action and accent colour (darkened for text if needed, as RV Farm's was), cool light grey surfaces instead of RV Farm's sand, white cards. Same fonts (Barlow Condensed display, Public Sans body), same type scale, radii and spacing. The "Photo coming" block stays sand on both sites so it reads as a placeholder.

A vector logo is still an open ask (`70` §5 #12). The raster badge is 392×375; it's fine at header size and for the watermark. The header uses the badge, not a cropped wordmark (no separate wordmark exists).

### 3e. Components

- **Reused as is (from RV Farm):** `Base.astro`, `UtilityRow`, `StickyBar`, `Footer` (retargeted), `HoursTable`, `Confirm`, `Claim`, `Placeholder`, `PageIntro`, `Breadcrumbs`, `LegalPage`, `lib/hours.ts`, `lib/format.ts`, `lib/site.ts`, `lib/seo.ts` (AutoRepair instead of AutoDealer), `scripts/contrast.mjs`, `content-check.mjs`, `confirm-report.mjs`, `photos.mjs` (VOW watermark), Dockerfile, Caddyfile, Playwright suites (links, a11y, motion, screenshots, review-fixes where relevant), Lighthouse CI, `.claude/` guardrails.
- **Adapted:** `Header` (VOW nav), `LeadForm.tsx` → one form island with three configurations (book, part request, insurance claim), `ContactForm`.
- **New:** `ServiceTile`, `ServicePage` layout, `RatingLine`, `ReviewQuote`, `StepList` (claims, warranty), `SeasonBand`.
- **Deleted:** inventory pages and components, `UnitCard`, `InventoryFilter`, `Gallery`, `Lightbox`, `PaymentEstimator`, `PricePanel`, `SpecTable`, `price.ts`, `fees.json`, filter and price tests.

### 3f. Animation

Same budget as RV Farm: CSS hover and accordion only, a reveal on at most a few elements per screen, nothing under reduced motion or the footer toggle. The optional "what winterizing includes" step reveal from `40` §7 is a CSS-only list. No carousel (the current site has a one-slide one), no Ken Burns.

### 3g. Phases and hours

| Phase | Work | Hours | Done when |
|---|---|---|---|
| **0 Seed** | Copy RV Farm infrastructure (V1), strip inventory, rename, `git init`, `init-project.sh`, AGENTS/CLAUDE/tasks for VOW, guardrails, tokens from the logo + contrast, header/footer/utility row/sticky bar with `business.json` | 3 | `npm run verify` green on a home page shell; screenshots 1440/375 |
| **1 Services + booking** | `services.json` from the capture (8 + 4 `[confirm]`), `/services`, service pages, `/book`, `/thanks`, home | 6 | Every service page builds; booking form passes no-JS and JS tests; content grep clean |
| **2 Other pages** | Insurance claims, warranty, pick-up, parts, part request, about, reviews, contact, legal drafts, sitemap, 404, robots, `docs/confirm-report.md`, VOW photo pipeline (if any photo is confirmed) | 5 | Link crawl and axe green; confirm report lists every open item |
| **3 QA** | Lighthouse on every page type, emulated Android pass, print, `/code-review high` in a fresh session, fixes | 2 | Same gate as RV Farm, results in `tasks/status.md` |
| **4 Review** | Rae/Paul walkthrough, alongside RV Farm's (James) | 1 | Corrections logged |
| | **Total** | **17 h** | `40` had 12 h. The extra is the claims and warranty pages, the honest-claims mechanism, and QA at RV Farm's level. The seed saves more than it costs |

Model use per RV Farm: Opus for Phase 0 and the form island, Sonnet subagents for the services data and repeated pages, Opus high for Phase 3 review.

---

## 4. Packages and setup

**Packages:** the RV Farm approved list (`buro-rvfarm-web/tasks/decisions.md` 2026-10-02), unchanged: astro, @astrojs/react + react + react-dom (form island), tailwindcss + @tailwindcss/vite, @astrojs/sitemap, sharp, @astrojs/check, typescript, @playwright/test, @axe-core/playwright, @lhci/cli, @types/react(-dom). `motion` only if the form island uses it, as on RV Farm. Nothing new.

**Guardrails:** RV Farm's `.claude/settings.json`, `.claude/hooks/guard.ps1` (your current working copy, including the uncommitted change, so tell me if that change isn't meant to carry over) and `.claude/agents/Explore.md`. Same consequence: pushes to `main` are blocked, James merges.

**Repo:** local `C:\Users\xoxok\Projects\buro-vow-web`, branch `dev`. GitHub `HamesInFlames/vow-web` (private, collaborator Cheezahh) **only after James says so**. Railway service only after James says so.

**Housekeeping:** `docs/site-capture/` stays in the repo as the source record (raw HTML is ~1 MB; the helper scripts and `__pycache__` get deleted in Phase 0).

---

## 5. `[confirm]` list for Rae and Paul

Added to the walkthrough sheet as a VOW section, so it's one meeting.

1. **Legal name** (Vacations on Wheels Inc.?) and address form (Hwy 7 vs Hwy 7 W).
2. **Hours:** site Mon–Sat 9–5 vs Google Mon–Fri 9–6. Holidays.
3. **Email to publish:** vacationsonwheel@gmail.com, or a new one on the domain?
4. **Phones:** 905-738-1253 only? A text line? (Priya's phone split, `60` §3.)
5. **Who calls customers back** about bookings, now that Lisa is leaving? Where should form leads go?
6. **Services:** are all 8 current ones right? Do you also do engine and electrical, and on-site mobile service? Which vehicles do you take (cars, trucks, boats, ATVs, semis, heavy equipment)? Any you refuse?
7. **Prices:** at least winterizing (and the hourly rate, inspection, spring packages if you want them shown). "Quote after inspection" otherwise.
8. **Insurance claims:** the real steps, which insurers you work with often, who handles the paperwork, how the deductible is paid.
9. **Warranty:** which manufacturers you're authorized to do warranty repairs for (Dometic?), and is Global Warranty the extended plan you sell? (This may also answer RV Farm's open warranty-provider question.)
10. **Pick-up:** radius, fee, and whether delivery back is included. Is there mobile on-site repair?
11. **Parts:** is the NTP catalogue link current? Are the nine Onan generators in stock, with prices? Which brands do you actually stock (the eight logos on the current site include RV Farm sales brands)?
12. **Claims:** which of these are true as written: certified technicians (which certification?), workmanship guarantee (terms?), "100 years combined experience", insured transport fleet, years in business.
13. **Staff:** bays, number of techs, Spanish-speaking techs, and whether anyone at the counter or on the phone speaks Spanish. Consent before naming anyone.
14. **Photos:** is `015-vow.jpg` (Retreat trailer, slide rebuild) VOW's own bay? Is `018-image-7.png` (motorhome on red lifts)? A date for Martin's shoot (bays, counter, parts room, pick-up truck, staff).
15. **Reviews:** OK to quote 3–6 Google reviews by first name and date? James picks them from the profile.
16. **Logo:** a vector file. Any brand colours on file?
17. **Social:** are `facebook.com/vacationsonwheels` and `instagram.com/vacationsonwheelsinc` VOW's, and used?
18. **Domain and email** (already in the walkthrough sheet, Part 4): the Turnkey agreement and the registrant change for vacationsonwheels.ca.
19. **Google profile:** access for James, the address, the old-location photos (`60` §3).

---

## 6. Risks and how each is handled

1. **Very few confirmed facts.** Most of VOW's useful content (prices, brands, insurers, steps, staff) isn't confirmed. *Mitigation:* the confirm mechanism from RV Farm: review builds show yellow tags, production hides them, `confirm-report --strict` gates launch. The site is honest and useful even with every item hidden: services, booking, parts request, phone, hours, map.
2. **No real photos.** *Mitigation:* sand "Photo coming" blocks, designed so the page doesn't look broken; push Martin's shoot. Never use `015` or `018` until confirmed.
3. **Winterizing season is now (Sept–Nov), but the domain is held by Turnkey.** The site can be review-ready in about two weeks of James's time, but it can't go on vacationsonwheels.ca until the registrant change (`92`). *Mitigation:* none on our side beyond being ready; James raises the Turnkey timing with Paul.
4. **Reputation.** Low-star reviews cite surprise charges and disputes. Quoting the 4.4★ invites people to read them. *Mitigation:* the rating line links to Google honestly; the estimate-approval process (§2 #6) only if true. Replying to reviews is Rae's job on the Google profile, not the site's.
5. **Two copies of the same code drifting.** RV Farm fixes won't reach VOW automatically. *Mitigation:* copy at a known commit (`8a90ab7`), log the seed commit in `tasks/decisions.md`, and port fixes by hand; a shared package isn't worth it for two small sites.
6. **The live site's firewall** blocked this machine's IP after 18 pages (Oct 5, "temporarily blocked"). The item pages (generators, service details, blogs) weren't captured. *Mitigation:* not needed for the plan; retry later with cookies if the generator specs matter.

**Verification at every phase:** `npm run verify` (contrast, unit tests, `astro check`, build, content grep, confirm report, Playwright: link crawl, axe at 1440 and 375, tap targets, font size, reduced motion), screenshots at 1440 and 375 that I look at, Lighthouse mobile ≥ 90 on every page type in Phase 3.
