# Taleem360 — Revenue Model Audit

**Property:** Taleem360 (taleem360.online)
**Session:** taleem360 — isolated
**Primary business model:** SaaS / platform — recurring school subscription or licence
**Secondary angles:** White-label licensing, API access, institutional pilot conversions
**Audit date:** 21 October 2026

---

## 1. Revenue model

Per the Operating Mandate §3.2, Taleem360 is the portfolio's **SaaS / platform** property: recurring subscription or licence.

| Stream | Mechanism | Status |
|---|---|---|
| **School subscription** | Per-school recurring fee after the 30-day pilot | PRIMARY — gate not open |
| **White-label licence** | Institutions rebrand the platform (`/white-label`) | Secondary — gate not open |
| **API access** | Developer/integration access (`/api`) | Secondary — gate not open |
| **Institutional pilot → paid conversion** | 30-day free pilot, no credit card, then paid tiers in PKR | PRIMARY funnel |
| **Social-impact pledge** | A percentage of every subscription funds free curriculum notes for underprivileged children | Differentiator, not a revenue line |

**Published pricing claim:** free 30-day pilot, no credit card required, then paid tiers in PKR. The pilot is the conversion asset.

---

## 2. The gate — BUILD → EARN → INVEST

> **Until there is EARNING, no investment, no subscriptions, and no paid services are to be implemented.**

**Earning** means money that has actually arrived. A subscription is not earning — it is a cost centre until it has paying subscribers.

| Gate | Unlocks | Current |
|---|---|---|
| First $1 of revenue | Payment integration may be **built** (not launched) | **NOT MET** |
| Revenue for 2 consecutive months | Subscription tiers, paid services, paid tools | **NOT MET** |
| Consistent revenue + proven demand | Paid tooling, ad budget, hiring, domains beyond defensive registration | **NOT MET** |

### What this forbids right now

- ❌ No payment gateway integration (Safepay, Stripe, or otherwise)
- ❌ No paid marketing, ads or sponsorship
- ❌ No paid tooling, SaaS subscriptions or premium APIs
- ❌ No paid domains beyond defensive registration
- ❌ No paid review, PR or backlink services

### What this permits right now (all zero cost)

- ✅ Zero-cost SEO: schema, entity signals, internal linking, topic clusters
- ✅ Content: deepen blog posts, build pillar pages
- ✅ Distribution: social posting, community answers, outreach
- ✅ Lead capture and verification
- ✅ Fixing the auth bypass so the product is safe to sell
- ✅ Answer-engine optimisation (llms.txt, ai-catalog.json already live)

---

## 3. Current revenue measurement

**There is no revenue, and effectively no traffic.** This is the honest starting position.

| Metric | Value | Source |
|---|---|---|
| Revenue | **$0** | No payment path exists |
| CrUX field data | No Data | Below Google's reporting threshold |
| Indexed pages | 19 of 84 | Search Console |
| Not indexed | 65 | Search Console |
| Backlinks | Not measurable via API | Read manually from GSC → Links |

**The chain:** no indexed pages → no impressions → no traffic → no pilots → no revenue. Every action in the priority list attacks the first link.

---

## 4. Revenue surfaces in the product

Where money can legitimately be made once the gate opens, and where lead capture should sit today:

| Surface | Route | Today | When the gate opens |
|---|---|---|---|
| Pricing page | `/pricing` | Lead capture only | Checkout |
| Free pilot signup | `/onboarding` | Lead capture — **unverified delivery** | Same, instrumented |
| Contact | `/contact` | Lead capture — **unverified delivery** | Same |
| Admission enquiry | `/admissions` | In-app form | Same |
| White-label enquiry | `/white-label` | Lead capture | Licensing contract |
| API access request | `/api` | Documentation only | Paid tiers |
| Support | `/support`, `/tickets` | In-app | Retention lever |

**The immediate revenue task is not to add payment — it is to make sure a pilot enquiry is never lost.** Lead-capture delivery is currently unverified. A lost enquiry is the most expensive kind of waste because it was already earned.

---

## 5. Zero-cost revenue actions, in order

| # | Action | Cost | Why it moves revenue |
|---|---|---|---|
| 1 | Fix the Google sign-in auth bypass | $0 | The platform cannot be sold to a school while any visitor can become its admin |
| 2 | Read the 2 GSC "not indexed" reasons | $0 | Unblocks 65 pages — the traffic precondition for everything else |
| 3 | Request indexing on the top 20 pages | $0 | Converts the prerender fix into impressions |
| 4 | Verify lead capture end-to-end | $0 | Pilot enquiries currently may be lost |
| 5 | Add FAQPage schema to 23 feature pages | $0 | Rich results competitors do not have |
| 6 | Add Organization `sameAs` entity signals | $0 | Strengthens AI citation and brand entity |
| 7 | Build topic clusters (hub + posts + city pages) | $0 | Converts 87 pages into topical authority |
| 8 | Route-level code splitting | $0 | Mobile performance 57 → target 80+, which affects conversion |
| 9 | Post to owned and earned channels | $0 | Distribution is part of the job, not a later phase |

---

## 6. Compliance checklist (mandate §6)

- [x] **Zero cost** — no paid tooling, subscription or service used or recommended; every action above is free
- [x] **No fabricated claims** — fabricated ratings (4.9/187), invented reviews, "500+ campuses", "100k+ students", "250k+ daily transactions" and named-institution partnership claims removed
- [x] **No false structured data** — `aggregateRating` and invented `Review` schema removed
- [x] **English only** — all docs, code and replies
- [x] **Honest reporting** — this document states $0 revenue and no traffic plainly rather than projecting

---

## 7. What would change this model

- **If pilots convert:** the gate opens at the first $1 and payment integration may be built. Subscription tiers unlock after two consecutive months of revenue.
- **If pilots do not convert:** the constraint is the pilot experience, not the price. The onboarding flow has not been audited and cannot be until the auth bypass is fixed — that audit is the prerequisite to any pricing conclusion.
- **If traffic arrives but does not convert:** the constraint is the landing page and the pilot promise, not the acquisition channel.

**Do not conclude anything about pricing or conversion until the auth bypass is fixed and the onboarding flow has been walked through with a real session.**

---

*Created 21 October 2026. Companion documents: `project.json`, `docs/00-audit-report.md`, `docs/02-status.md`.*
