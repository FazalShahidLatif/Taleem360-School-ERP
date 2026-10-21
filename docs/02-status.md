# Taleem360 — Status Report

**Property:** Taleem360 (taleem360.online)
**Session:** taleem360 — **isolated**
**Repo:** `C:/Gitub-Projects/Taleem360-School-ERP`
**GitHub:** https://github.com/FazalShahidLatif/Taleem360-School-ERP
**Updated:** 21 October 2026
**Owner:** Fazal Shahid Latif

---

## 1. Session isolation — confirmed

This session covers **Taleem360 and taleem360.online only**. Nothing in this repo references another portfolio property.

**Scan performed:** `pdff.online`, `calcoo`, `bookmethat`, `verifiedrishta`, `ukltdregistration`, `us llc`, `mentor arena`, `apivex`, `blue ocean`, `saasskul`, `txlify`, `linkharrow`, `freeonlinecalculator`, `book me that` — searched across all source, config, HTML, CSS, SQL and markdown files.

| Finding | Status |
|---|---|
| `components/Footer.tsx` — sitewide "Powered by SaaSSkul" credit + outbound link | **Removed** (commit `fda5cd3`) |

**One finding, now zero.** The repo is isolated.

**Note on the inverse direction:** PDFF's `project.json` records 7 links from `calcoo.online` and 12 from `linkharrow.xyz` pointing at PDFF. Those are other properties' records and are out of scope for this session — they were not touched.

---

## 2. Mandate structure compliance

The three-artifact standard (mandate §7):

| Artifact | Status |
|---|---|
| `project.json` | ✅ Created 21 Oct 2026 |
| `docs/01-revenue-model.md` | ✅ Created 21 Oct 2026 |
| `docs/02-status.md` | ✅ This file |
| `docs/00-audit-report.md` | ✅ Full audit report |

---

## 3. Gate status

| Gate | Status |
|---|---|
| First $1 of revenue | **NOT MET** |
| Revenue for 2 consecutive months | **NOT MET** |
| Consistent revenue + proven demand | **NOT MET** |

**Current standing:** $0 revenue, no payment integration, no paid services. All monetisation is gated per mandate §2.

---

## 4. Work completed this session

### Deployment unblocked
`e0299f6` existed only locally, so the live site was serving a stale build containing a literal `{TECH_DATA_URI}` token and the fabricated ratings. Pushed.

### Routing fixed — 233 GSC errors cleared
`vercel.json` used `rewrites`, which Vercel applies *after* the filesystem, so every request including `/robots.txt`, `/llms.txt`, `/ai-catalog.json` and `/sitemap.xml` was answered with the React app's `index.html`. Switched to `routes` with `{ "handle": "filesystem" }` first. All four endpoints now serve real content; Google reports robots.txt **Fetched**.

### Prerender fixed — thin pages eliminated
Static pages were empty shells with a dead `<script src="/index.tsx">` that 404s in production.

| Metric | Before | After |
|---|---|---|
| Thin pages | 48 of 50 | **0** |
| Avg words per page | 234 | **514** |
| Internal links per page | 0 | **32** |
| Sitemap ↔ page coverage | 35 blog URLs had no page | **87 / 87** |

### Fabricated claims removed (mandate §6)
`aggregateRating` 4.9/187, an invented Review attributed to "Muhammad Ali", testimonials from named people at real schools, "500+ campuses", "187+ verified reviews", "500+ schools onboarded", "100k+ students", "250k+ daily transactions", unsourced competitor ratings, a review-gating flow that diverted 1–3 star ratings to a private ticket, and paid reviews in exchange for a trial extension.

### Named-institution claims removed — passing-off risk
`CitySEO.tsx` rendered real school brands under "Trusted by Premier \<city\> Campuses" with the footnote "verified partner institutions". 14 named institutions across 11 city datasets. Taleem360 has no such partnerships. Replaced with a neutral capability list plus an explicit no-affiliation statement.

### Google AI Studio traces purged
`metadata.json` deleted, `aistudio-build` user-agent removed, "Google AI Studio" labels removed, 18 visitor-facing vendor strings rebranded to Taleem360 AI, and `brand-kit.css` realigned from Google Material blue `#0b57d0` to Emerald `#10B981` / Cosmic Slate `#0F172A`.

### Repo hygiene
`disavow.txt` (placeholder domains `spammydomain.com`, `badlink.net`), `llm.txt` (duplicate of `llms.txt`) and the empty `migrated_prompt_history/` directory removed.

### Verified
Build clean — 87 static pages, 0 template leaks. Tests 25/25 passing across 5 suites.

**Commits:** `6224643`, `082a849`, `fda5cd3` (all pushed to main).

---

## 5. Open blockers

| # | Blocker | Severity | Detail |
|---|---|---|---|
| 1 | **Google sign-in is a client-side auth bypass** | **CRITICAL** | `pages/Login.tsx` opens a simulated account chooser; typing any email fires `postMessage({type:'OAUTH_AUTH_SUCCESS', user:{...,role:'ADMIN'}}, '*')`. `lib/auth.tsx` mints a client-side mock JWT signed `dummy_signature` and stores it in `localStorage`. `accts.pak@gmail.com` is hardcoded to grant SUPER_ADMIN. The real OAuth in `server.js` is never called; `/auth/google/callback` returns HTTP 404 live. |
| 2 | **65 of 84 submitted pages not indexed** | **HIGH** | 2 reasons, not yet read from Search Console |
| 3 | **Mobile performance 57** | **HIGH** | Main chunk 1,497.83 kB (381.04 kB gzip); jspdf 390.77 kB, recharts 301.99 kB, html2canvas 202.38 kB reachable from the initial route |
| 4 | **Suspension alert leaks the owner's personal email** | **MEDIUM** | `lib/auth.tsx` alerts visitors that `support@taleem360.online` is suspended and to contact `accts.pak@gmail.com` |
| 5 | **`users_db.json` holds plaintext passwords** | **MEDIUM** | Includes a real account credential. File is gitignored and NOT tracked — but should be rotated and moved to environment variables |
| 6 | **Lead capture unverified** | **MEDIUM** | `AdmissionForm.tsx` and `Contact.tsx` exist; no end-to-end delivery confirmed |
| 7 | **No CrUX field data** | LOW | Traffic below Google's reporting threshold |
| 8 | **Credentials not synced to scratchpad** | LOW | Mandate §5.4 not yet done |
| 9 | **`taleem360-api-v2` not audited** | LOW | Referenced in `vercel.json`; no local repo found |

---

## 6. Compliance status (mandate §6)

| Rule | Status |
|---|---|
| Zero cost | ✅ No paid tooling, subscription or service used or recommended |
| No fabricated claims | ✅ Ratings, testimonials, client counts and named-institution partnerships removed |
| No false structured data | ✅ `aggregateRating` and invented `Review` schema removed |
| English only | ✅ |
| Honest reporting | ✅ Verified and unverified items are separated; blockers stated plainly |

---

## 7. Required actions per mandate §5

| # | Action | Status |
|---|---|---|
| 1 | Audit for Revenue | ⚠️ Partially — surfaces identified in `docs/01-revenue-model.md`; partner names not yet assigned per page |
| 2 | Fix the leaking pipes | ⚠️ Partially — routing, prerender and compliance leaks fixed; **auth bypass still open** |
| 3 | Apply zero-cost SEO | ⚠️ Partially — robots/llms/ai-catalog/prerender done; FAQ schema, entity signals, topic clusters open |
| 4 | Sync to scratchpad | ❌ Not done |
| 5 | Document the business model | ✅ `project.json` + `docs/01-revenue-model.md` |

---

## 8. Next actions, in order

1. **Fix the Google sign-in auth bypass** — remove the simulated chooser, wire the existing server-side OAuth, reject unsigned tokens, move role assignment server-side. Nothing else matters until this is done.
2. **Read the 2 GSC "not indexed" reasons** and request indexing on the top pages.
3. **Rotate the `users_db.json` credentials** and move them to environment variables.
4. **Remove the suspension alert** that publishes the owner's personal email.
5. **Verify lead capture end-to-end.**
6. **Add FAQPage schema** to 23 feature pages.
7. **Add Organization `sameAs`** entity signals.
8. **Route-level code splitting** for jspdf / recharts / html2canvas.
9. **Apply 44px touch targets** per `AGENTS.md` rule 4.
10. **Build topic clusters** linking hub pages, blog posts and city pages.
11. **Sync credentials to scratchpad.**
12. **Audit the onboarding flow** — blocked until #1 is done.

Every item is zero cost.

---

## 9. Standing rules for this session

- **Isolation:** no reference to any other portfolio property may enter this repo or this session.
- **Brand:** Cosmic Slate `#0F172A` + Emerald `#10B981`; Inter / Space Grotesk / JetBrains Mono; 44px minimum touch target. `brand-kit.css` is the source of truth.
- **No vendor branding:** no Google AI Studio, Gemini or Material-palette references in visitor-facing copy.
- **No fabricated claims:** no invented reviews, ratings, client counts, named-institution partnerships or certifications. Remove on sight.
- **Gate:** no payment integration, no paid tooling, no subscriptions until the earning gate opens.

---

*Created 21 October 2026. Companion documents: `project.json`, `docs/00-audit-report.md`, `docs/01-revenue-model.md`.*
