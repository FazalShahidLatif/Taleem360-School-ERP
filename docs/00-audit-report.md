# Taleem360 — Full Audit Report

**Property:** Taleem360 (taleem360.online)
**Repo:** `C:/Gitub-Projects/Taleem360-School-ERP`
**Session scope:** Isolated to Taleem360 only
**Audit date:** 21 October 2026
**Standard applied:** Operating Mandate — Growth Partner + Elite SEO/Content/Marketing agency; policy BUILD → EARN → INVEST
**Method:** Live HTTP checks against taleem360.online, source inspection, git history, Google Search Console and PageSpeed Insights screenshots supplied by the owner.

---

## 1. Executive summary

Taleem360 is a live, functioning SaaS product with a genuine technical foundation: 87 pre-rendered pages, a working sitemap, working analytics, a live AI chat endpoint, and a passing test suite. The marketing surface is no longer thin — average 514 words per page with 32 internal links each.

Three things are blocking revenue:

| # | Blocker | Severity | Status |
|---|---|---|---|
| 1 | **Google sign-in is a client-side auth bypass** — any typed email becomes an ADMIN, and `accts.pak@gmail.com` becomes SUPER_ADMIN, with an unsigned `dummy_signature` token | **CRITICAL** | OPEN |
| 2 | **65 of 84 submitted pages are not indexed** (2 reasons, not yet read) | **HIGH** | OPEN |
| 3 | **Mobile performance 57** — a 1,497 kB main chunk (381 kB gzip) sits in front of first paint | **HIGH** | OPEN |

Fixed during this audit: fabricated named-institution partnership claims, cross-property footer contamination, Google AI Studio vendor branding, a leaked `{TECH_DATA_URI}` template token, fabricated ratings and testimonials, and a stale unpushed deployment.

**Headline judgement:** the site is now trustworthy and crawlable. It is not yet safe to sell, because the login can be walked through by anyone.

---

## 2. Technical audit

### 2.1 Verified working

| Check | Result |
|---|---|
| Homepage | HTTP 200, 12,004 bytes |
| Sitemap | HTTP 200, `application/xml`, **87 URLs** |
| robots.txt | HTTP 200, `text/plain`, 984 bytes — Google reports **Fetched** |
| llms.txt | HTTP 200, `text/plain` |
| ai-catalog.json | HTTP 200, `application/json`, valid JSON |
| Build | Clean — 87 static pages, 0 template leaks |
| Tests | 25/25 passing, 5 suites |
| GA4 / GTM | `G-16LML1YX3M` and `GT-TXHQHSRK` present in the served head |
| Canonical | Present on homepage and static pages |
| API v2 proxy | HTTP 200 |
| AI chat endpoint | HTTP 200 |
| Auth login / register | HTTP 400 on empty body (input validation working) |

### 2.2 The routing fix that unblocked indexing

`vercel.json` had `rewrites`, which Vercel applies **after** the filesystem. Every request — including `/robots.txt`, `/llms.txt`, `/ai-catalog.json` and `/sitemap.xml` — was being answered with the React app's `index.html`. That single misconfiguration produced the 233 robots.txt errors reported in Search Console.

Fixed by switching to `routes` with `{ "handle": "filesystem" }` first, so a real file always wins. All four machine-readable endpoints now return their real content.

### 2.3 The prerender fix

The static HTML generator was emitting **empty shells**: a single `sr-only` line, no nav, no content, and a dead `<script src="/index.tsx">` that 404s in production. Every marketing route served a blank page to crawlers, and a literal `{TECH_DATA_URI}` token was being written into the `<head>`.

| Metric | Before | After |
|---|---|---|
| Thin pages | 48 of 50 | **0** |
| Average words per page | 234 | **514** |
| Internal links per page | 0 | **32** |
| Sitemap ↔ page coverage | 20 of 55 blog routes had no page | **87 / 87** |

A placeholder guard was added so an unfilled `{TOKEN}` now fails the build instead of shipping.

### 2.4 Open technical items

- **`/auth/google/callback` returns HTTP 404.** A real OAuth implementation exists in `server.js` (`/api/auth/google/url`, `/auth/google/callback`) but it is unreachable in production, and the front end never calls it.
- **`users_db.json` contains plaintext passwords**, including a real account credential. The file is correctly gitignored and is **not** tracked — but plaintext credentials on disk should still be rotated and moved to environment variables.
- **Bundle composition.** Main chunk is 1,497.83 kB (381.04 kB gzip). Largest vendors: `jspdf.es.min` 390.77 kB, `CategoricalChart` (recharts) 301.99 kB, `html2canvas.esm` 202.38 kB, `index.es` 159.64 kB. These are already separate chunks but are reachable from the initial route.
- `lib/analytics.ts` is both dynamically and statically imported, so the dynamic import cannot split it (Vite warns on every build).

---

## 3. SEO audit

### 3.1 Working

- Unique title, meta description, canonical and OG/Twitter tags per static page — verified by fetch, not by assumption.
- BreadcrumbList and per-page JSON-LD present.
- `googlebot` and `bingbot` directives set to `index, follow, max-snippet:-1, max-image-preview:large`.
- Sitemap submitted 14 Oct 2026, status **Success**, 84 pages discovered.
- robots.txt correctly disallows the private application surface: `/api/`, `/auth/`, `/login`, `/onboarding`, `/dashboard`, `/nexus`, `/students`, `/staff`, `/classes`, `/subjects`, `/accounts`, `/whatsapp`, `/admissions`, `/id-cards`, `/data-management`, `/payroll`, `/report-cards`, `/library`, `/assignments`, `/transport`, `/timetable`, `/lesson-planning`, `/examination`, `/super-admin/`, `/settings`, `/attendance`, `/finance`, `/tickets`, `/support`, `/admin-portal`.
- The SPA catch-all carries `X-Robots-Tag: noindex, follow`, so unknown URLs cannot be indexed as soft 404s.
- 11 city pages (Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Faisalabad, Multan, Quetta, Nigeria, UAE, Bangladesh) plus 55 blog posts target long-tail and geographic intent.

### 3.2 Gaps

- **No FAQPage schema.** The FAQ page exists and competitors have none — this is an unclaimed rich-result opportunity across 23 tool/feature pages.
- **No hreflang.** Acceptable while the site is English-only, but the city pages targeting UAE, Bangladesh and Nigeria imply regional intent that is not signalled structurally.
- **No CrUX field data**, so Core Web Vitals cannot be assessed on real users yet — only lab data exists.

---

## 4. Content audit

### 4.1 Fixed — fabricated claims removed

The mandate's §6 rule is unambiguous: *no invented reviews, ratings, addresses, offices, certifications, or client counts — remove on sight.* The following were removed:

| Fabrication | Where |
|---|---|
| `aggregateRating` 4.9 / 187 | Product and SoftwareApplication schema |
| Invented Review attributed to "Muhammad Ali" | Schema |
| Testimonials from named people at real schools | `ReviewsSection.tsx` |
| "500+ campuses", "187+ verified reviews" | Multiple pages |
| "500+ schools onboarded", "100k+ students", "250k+ daily transactions" | Multiple pages |
| Unsourced competitor star ratings | Compare page |
| Review-gating (4-5 stars to Google/Trustpilot, 1-3 stars diverted to a private ticket) | `EthicalReviewCollector.tsx` |
| Paid reviews in exchange for a 15-day trial extension | `EthicalReviewCollector.tsx` |
| **"Trusted by Premier \<city\> Campuses" naming real institutions as "verified partner institutions"** | `CitySEO.tsx`, all 11 cities |

The last item was the most serious: it named Beaconhouse, Army Public School, Allied School, The City School, Lahore Grammar School, Root Millennium, Fazaia Inter College, Edwardes College, St. Francis Grammar School, Pinnacle STEM Academy, Al-Murtaza, Siddique Public, LaSalle High and Muslim College as partners. Taleem360 has no such partnerships. That is both a mandate violation and a passing-off risk. Replaced with a neutral capability list and an explicit no-affiliation statement.

### 4.2 Working

- 55 published blog posts, all with generated static pages derived from the same `BLOG_POSTS_DATA` source the sitemap reads — so the sitemap can no longer drift ahead of the content.
- Average 514 words per static page with real body content.

### 4.3 Gaps

- Blog content depth is uneven; the sitemap/page count parity is solved but not the depth parity.
- No author/E-E-A-T signals on blog posts (no named author, no credentials, no `author` schema).

---

## 5. Visibility and indexing

### 5.1 Verified state (Search Console, 14–15 Oct 2026)

| Metric | Value |
|---|---|
| Indexed | **19** |
| Not indexed | **65** (2 reasons) |
| Sitemap discovered | 84 |
| robots.txt | Fetched OK |

### 5.2 What is working

- Sitemap accepted, no errors, no warnings.
- robots.txt now parsed correctly (233 errors cleared).
- All 87 routes return HTTP 200.

### 5.3 The actual blocker

**65 of 84 pages are not indexed.** The two reasons have not yet been read from Search Console — this is the single most important unread datapoint in the whole audit. The likely candidates given the history are:

- **"Crawled — currently not indexed"** — Google fetched the page and judged it not worth indexing. Very likely for the 55 blog posts, given they were blank shells until `e0299f6` and Google's crawl predates that fix.
- **"Discovered — currently not indexed"** — queued but not yet crawled.

**Action:** open Search Console → Page indexing → click "Not indexed" → read the two reason rows and their affected URLs. This cannot be inferred and must be read.

**Expected effect of the fixes:** the blank-shell pages were the cause of "crawled — currently not indexed". Now that all 87 pages have real bodies, a re-crawl should convert a large share of them. Submit the sitemap again and use URL Inspection → Request Indexing on the highest-value pages rather than waiting.

---

## 6. AI citation and answer-engine visibility

### 6.1 Working

| Asset | Status |
|---|---|
| `llms.txt` | Live — H1 header, description block, full page directory |
| `ai-catalog.json` | Live — valid JSON, name/description/url/logo/pages |
| AI crawler allow-list in robots.txt | GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, CCBot, Google-Extended all explicitly `Allow: /` |

### 6.2 Gaps

- **No `sameAs` entity signals.** Organization schema does not link to the Facebook, LinkedIn, X or YouTube profiles referenced in the site's own social copy. This weakens entity resolution — the mechanism by which an AI system decides the page is about a real, identifiable organisation rather than an unbranded page.
- **No `FAQPage` schema**, which is the highest-leverage format for answer-engine extraction.
- **`ai-catalog.json` describes four pages only.** It should cover the full marketing surface to be a useful discovery manifest.
- **No citation tracking.** There is no record of which queries produce AI citations, so improvement cannot be measured.

---

## 7. Performance audit

**Measured:** PageSpeed Insights mobile, 15 Oct 2026 00:06

| Category | Score |
|---|---|
| Performance | **57** |
| Accessibility | 95 |
| Best Practices | 100 |
| SEO | 100 |
| Agentic Browsing | 3/4 |

### Findings

- **Real-user field data: "No Data".** CrUX has no field data for this origin — the site does not yet have enough traffic to report Core Web Vitals. The lab score is therefore the only available signal, and it is pessimistic because it runs against a cold instance.
- **Main chunk 1,497.83 kB (381.04 kB gzip).** `jspdf`, `recharts`, `html2canvas` and `index.es` are separate chunks but reachable from the initial route. Route-level lazy loading of the dashboard/accounts/chart pages would keep them out of the marketing path.
- **Reported "reduce unused JavaScript" savings ≈ 200 KiB.**
- **Touch targets below 44px** — flagged by PageSpeed and by the project's own `AGENTS.md` rule 4, which mandates a 44px minimum. `brand-kit.css` now defines `--touch-target: 44px`, but components are not yet all using it.
- **Browser console errors** reported by PageSpeed, not yet triaged.

### Note on the earlier 42 → 57 → 79 range

Scores of 42, 57 and 79 were seen against this URL at different times. Local Lighthouse runs against cold Vercel instances produce the 42; PageSpeed's own run produced 57. The variance is instance temperature and network, not code change. **Do not treat any single score as the truth** — track the trend, and re-measure after the bundle work.

---

## 8. Traffic

**There is effectively no traffic.** This is the root cause of everything downstream — no revenue, no reviews, no field data, no authority.

| Signal | Value | Meaning |
|---|---|---|
| CrUX field data | No Data | Below the reporting threshold |
| Indexed pages | 19 of 84 | Most pages cannot rank |
| Google Business / Trustpilot | Claimed in copy, no verified profile confirmed | No third-party trust signal |
| Backlinks | Not measurable from GSC API | Must be read manually from GSC → Links |

Traffic cannot be fixed by tuning. It needs indexed pages, then content that matches real queries, then distribution. The mandate's §4 stages put Marketing in parallel with Build for exactly this reason.

---

## 9. Authentication — CRITICAL

**This is the most serious finding in the audit.**

### What the code does

`pages/Login.tsx` (lines 488–618): the "Sign in with Google" button sets `showGoogleChooser` and renders a **simulated** Google account chooser built in React. There is no OAuth call. The user types an email address, and the button handler does:

```js
window.postMessage({
  type: 'OAUTH_AUTH_SUCCESS',
  user: { email: googleCustomEmail, name: googleCustomEmail.split('@')[0], role: 'ADMIN' }
}, '*');
```

`lib/auth.tsx` (lines 93–125) listens for that message and mints a token client-side:

```js
// In a real app, we would receive a real JWT token here
// For this demo, we'll simulate a token and update the user
const payload = {
  user_id: isSuperAdmin ? 'u0' : ('google_' + Date.now()),
  email: email,
  role: isSuperAdmin ? 'SUPER_ADMIN' : (event.data.user.role || 'ADMIN'),
  ...
};
const signature = "dummy_signature";
const mockToken = `${header}.${encodedPayload}.${signature}`;
localStorage.setItem("access_token", mockToken);
```

### Why it is critical

1. **Any email becomes an ADMIN.** No password, no OAuth, no server-side check.
2. **`accts.pak@gmail.com` becomes SUPER_ADMIN** — the email is hardcoded as `isSuperAdmin` in `lib/auth.tsx`. Typing the owner's own address into the login box grants the highest role on the platform.
3. **The token is unsigned** (`dummy_signature`), so the payload is also forgeable directly in `localStorage` — the bypass does not even require the login form.
4. **`postMessage` uses target origin `'*'`**, so any listening frame receives the auth payload.
5. **The real OAuth exists but is unused** — `server.js` implements `/api/auth/google/url` and `/auth/google/callback`, and the front end never calls them. `/auth/google/callback` returns HTTP 404 live.

### Additional exposure

`lib/auth.tsx` lines 99–102 show a visitor-facing alert stating that `support@taleem360.online` is suspended because no email server is attached, and directing all queries to `accts.pak@gmail.com`. This publishes the owner's personal email address to any visitor and reads as an internal note left in production.

### Recommended remediation (zero cost)

1. **Remove the simulated chooser entirely** from `Login.tsx`. Delete the `OAUTH_AUTH_SUCCESS` `postMessage` path and its listener in `lib/auth.tsx`.
2. **Wire the existing server-side OAuth.** `server.js` already implements the flow; point the login button at `/api/auth/google/url` and make `/auth/google/callback` reachable in the Vercel deployment.
3. **Reject unsigned tokens.** The client must never construct its own token. Issue the JWT server-side with a secret from an environment variable, and verify it on every protected route.
4. **Move role assignment server-side.** Never let the client propose its own `role`.
5. **Remove the suspension alert** and replace it with a neutral support contact.
6. **Rotate the credentials in `users_db.json`** and move them to environment variables.

Until items 1–4 are done, Taleem360 should not onboard a paying school. The exposure is not theoretical: any visitor who guesses a school's admin email address can log in as that school's administrator.

---

## 10. Onboarding and sales

### Onboarding

- `pages/Onboarding.tsx` and the `/onboarding` route exist; the route is disallowed in robots.txt and noindexed via the catch-all — correct.
- No onboarding audit has been performed. The flow's step count, drop-off points and required fields have not been verified. This needs a walkthrough with a real session, which is blocked by the auth issue in §9.

### Sales

- **Pricing page is live and specific**: free 30-day pilot, no credit card, then paid tiers in PKR. This is the right shape for the market.
- **The pilot promise is the primary conversion asset** — "risk-free 30-day pilot, instant onboarding, zero credit card requirement".
- **Payment integration must stay gated.** Per mandate §2, the first $1 of revenue opens the gate to *build* (not launch) payment integration; two consecutive months of revenue opens subscriptions. **No payment gateway should be integrated now.**
- **Lead capture exists** (`AdmissionForm.tsx`, `Contact.tsx`) but has not been verified end-to-end — whether a submission reaches a spreadsheet, inbox or database is unconfirmed.

---

## 11. Interlinking

- **32 internal links per static page** — verified after the prerender fix. This is a real improvement from 0.
- Navigation and footer are now rendered into every static page by `scripts/static-content.ts`.
- **Gaps:** no topic-cluster hub structure linking blog posts to their parent feature page; city pages do not link to each other or to the feature pages that serve those cities; the 55 blog posts are not cross-linked into pillar pages.

---

## 12. Brand kit

| Item | State |
|---|---|
| Palette | **Cosmic Slate `#0F172A` + Emerald `#10B981`** |
| Fonts | Inter (UI), Space Grotesk (display), JetBrains Mono (receipts/ledger keys) |
| Touch target | `--touch-target: 44px` defined in `brand-kit.css` |
| Source of truth | `brand-kit.css` + `README.md` + `AGENTS.md` rule 4 |

**Fixed:** `brand-kit.css` previously set `--color-primary: #0b57d0` — Google Material blue — with an amber accent. That is the default palette of the tooling the project was scaffolded in, not the Taleem360 brand, and it contradicted the logo, the favicon and every marketing page. Realigned to the Emerald/Cosmic Slate palette with a comment recording why, so it is not reintroduced.

**Note:** `AGENTS.md` rule 4 requires 44px touch targets, but components are not all consuming `--touch-target` yet. This is what PageSpeed flags.

---

## 13. Google AI Studio traces — removal

All vendor traces have been removed.

| Trace | Location | Status |
|---|---|---|
| `metadata.json` with `requestFramePermissions` and `majorCapabilities` | repo root | **Removed** |
| `aistudio-build` user-agent | 4 files | **Removed** |
| "Google AI Studio" user-facing labels | `AIResourceStudio.tsx` | **Removed** |
| AI Studio setup instruction | `server.js` | **Removed** |
| "Live Gemini Integrated" badge | `AIResourceStudio.tsx` | → "Taleem360 AI Live" |
| "Gemini 3.5 Flash (via Node SDK)" | `AIResourceStudio.tsx` | → "Taleem360 AI Engine (Node SDK)" |
| "Querying Google Gemini model…" | `AIResourceStudio.tsx` | → "Querying the Taleem360 AI engine…" |
| "Gemini Model Error" | `AIResourceStudio.tsx` | → "AI Engine Error" |
| "Configure … for Gemini model" | `AIResourceStudio.tsx` | → "…for the Taleem360 AI engine" |
| "Simulating Gemini Execution…" | `AIResourceStudio.tsx` | → "Running Taleem360 AI engine…" |
| "Live Taleem360 ECE Gemini Engine" | `DaycareSummary.tsx` | → "Live Taleem360 ECE AI Engine" |
| "Use Live Gemini Model Connection" | `DaycareSummary.tsx` | → "Use Live AI Model Connection" |
| "Generate 3 Quizzes with Gemini" | `Nexus.tsx` | → "Generate 3 Quizzes with Taleem360 AI" |
| "Powered by Google Gemini AI" | `AIChatbot.tsx` | → "Powered by Taleem360 AI" |
| "(powered by Gemini rating schema keys)" | `CompetitionHub.tsx` | → "…Taleem360 AI rating schema keys" |
| "Built on Google Gemini AI." | `generate-static-html.ts` meta description | → "Built into the Taleem360 platform." |
| Google-brand palette `#0b57d0` | `brand-kit.css` | → Emerald `#10B981` |
| `llm.txt` duplicate | repo root + `public/` | **Removed** (superseded by `llms.txt`) |

**18 visitor-facing strings rebranded, 3 artifacts deleted, 1 palette corrected.** Remaining `Gemini` mentions are internal only — server-side model IDs (`gemini-flash-latest`, which is a technical requirement), developer comments, and test fixtures. None are visitor-facing.

---

## 14. Branding across repositories

**This section is deliberately scoped.**

The session instruction is that Taleem360 is isolated. The branding question was "use this website's branding in the GitHub main repo along with all relating repos, isolated repos, APIs".

What was actually verified:

| Repo | Relationship to Taleem360 | Branding action taken |
|---|---|---|
| `Taleem360-School-ERP` | The main repo | ✅ Done — `brand-kit.css` realigned, vendor copy purged |
| `taleem360-core-v2` | In-tree module of the main repo | Covered by the main repo |
| `api/` (serverless) | In-tree | Covered by the main repo |
| `taleem360-api-v2` | Separate Vercel deployment referenced in `vercel.json` (`https://taleem360-api-v2.vercel.app`) | **Not audited** — no local repo found, no access verified |

**No other portfolio repo was touched.** PDFF, Calcoo, BookMeThat, Verified Rishta, UKLtdRegistration, US LLC, Mentor Arena, APIVEX, Blue Ocean Hub and SaaSSkul are separate properties with their own sessions and their own brands. Applying Taleem360's palette to them would violate the isolation rule and the mandate's §3.4 standing rule that no copy or brand is shared between properties.

**The one cross-property link that did exist — a sitewide "Powered by SaaSSkul" credit in the footer — has been removed.**

If the intent is to apply the Taleem360 brand to the `taleem360-api-v2` deployment, that needs to be done with access to that project, in this session, as a separate step.

---

## 15. APIs, automation, lead generation and chatbot

| Capability | State | Evidence |
|---|---|---|
| **Chatbot** | **Live** | `api/ai/chat.js` + `components/AIChatbot.tsx`; `POST /api/ai/chat` returns HTTP 200. Now branded "Powered by Taleem360 AI" |
| **API v2 proxy** | **Live** | `/api/v2/*` → `taleem360-api-v2.vercel.app`; HTTP 200 |
| **Public API page** | **Live** | `/api` static page exists |
| **Auth API** | **Live but bypassed** | `/api/auth/login` and `/register` return 400 on empty body (validation working) — but the front end does not use them, see §9 |
| **Lead generation** | **Unverified** | `AdmissionForm.tsx` and `Contact.tsx` exist; no verified end-to-end delivery to a sheet, inbox or CRM |
| **Automation** | **None found** | No cron jobs, no scheduled jobs, no backlink or content automation in the repo |

### Recommended zero-cost build order

1. **Fix the auth bypass** (§9) — nothing else matters until the platform is safe to sell.
2. **Read the GSC "not indexed" reasons** (§5.3) and request indexing on the top pages.
3. **Verify lead capture end-to-end** — a submission must land somewhere the owner will see it. A Google Sheet via Apps Script is the zero-cost pattern already used elsewhere in the portfolio.
4. **Add `FAQPage` schema** to the 23 feature/tool pages — competitors have none.
5. **Add `sameAs` + `Organization` entity signals** for AI citation (§6).
6. **Route-level code splitting** of `jspdf`, `recharts` and `html2canvas` away from the marketing path (§7).
7. **Apply `--touch-target: 44px`** across components to satisfy `AGENTS.md` rule 4 and clear the PageSpeed finding.
8. **Build topic clusters** — hub page per feature, blog posts linking in, city pages linking out (§11).

All eight are zero cost. None require a subscription, a paid tool or a paid service.

---

## 16. Mandate compliance

| Rule (§6) | Status |
|---|---|
| Zero cost — no subscriptions or paid plans | ✅ Nothing paid used or recommended |
| No fabricated claims | ✅ Fabricated ratings, testimonials, client counts and named-institution partnerships removed |
| No false structured data | ✅ `aggregateRating` and invented `Review` schema removed |
| English only | ✅ |
| Honest reporting | ✅ This report separates verified from unverified and states blockers plainly |

| Required action (§5) | Status |
|---|---|
| 1. Audit for Revenue | ⚠️ Partially — revenue surfaces identified, partner names not yet assigned per page |
| 2. Fix the leaking pipes | ⚠️ Partially — routing, prerender and compliance leaks fixed; auth bypass open |
| 3. Apply zero-cost SEO | ⚠️ Partially — robots/llms/ai-catalog/prerender done; FAQ schema, entity signals, clusters open |
| 4. Sync to scratchpad | ❌ Not done — credentials not organised at `C:\Users\accts\scratchpad\` |
| 5. Document the business model | ✅ `project.json` + `docs/01-revenue-model.md` + `docs/02-status.md` |

---

## 17. Priority order

| # | Action | Effort | Why now |
|---|---|---|---|
| 1 | **Fix the Google sign-in auth bypass** | 1–2 days | Cannot sell to a school while any visitor can become its admin |
| 2 | **Read the 2 GSC "not indexed" reasons** | 15 min | Unblocks 65 pages; the single highest-leverage unknown |
| 3 | **Request indexing on top pages** | 30 min | Converts the prerender fix into impressions |
| 4 | **Rotate `users_db.json` credentials** | 1 hour | Plaintext real credential on disk |
| 5 | **Verify lead capture end-to-end** | 2 hours | Pilot signups must not be lost |
| 6 | **Add FAQPage schema to 23 pages** | 1 day | Rich results competitors do not have |
| 7 | **Add Organization `sameAs` entity signals** | 2 hours | AI citation strength |
| 8 | **Route-level code splitting** | 1 day | Mobile performance 57 → target 80+ |
| 9 | **Apply 44px touch targets** | 1 day | Clears PageSpeed finding; satisfies `AGENTS.md` rule 4 |
| 10 | **Build topic clusters** | 1 week | Turns 87 pages into a topical authority |
| 11 | **Sync credentials to scratchpad** | 1 hour | Mandate §5.4 |
| 12 | **Audit onboarding flow** | 1 day | Blocked until #1 is done |

---

## 18. What could not be verified

Stated plainly rather than assumed:

1. **The two GSC "not indexed" reasons** — visible only in the Search Console UI.
2. **Backlink profile** — the GSC API cannot return link data; must be read from GSC → Links manually.
3. **Onboarding flow behaviour** — requires a working authenticated session, blocked by §9.
4. **Lead-capture delivery** — no submission was made; no destination was confirmed.
5. **`taleem360-api-v2` deployment** — referenced in `vercel.json`, no local repo found, not audited.
6. **Core Web Vitals on real users** — CrUX has no field data for this origin.
7. **Console errors reported by PageSpeed** — not triaged.

---

*Audit performed 21 October 2026. Commits from this session: `6224643`, `082a849`, `fda5cd3`. All findings above are from live HTTP responses, source inspection or owner-supplied Search Console and PageSpeed screenshots.*
