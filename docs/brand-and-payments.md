# Brand and payments — Taleem360

**Updated:** 21 October 2026

---

## 1. Where the brand lives

| Layer | Location | Applies to |
|---|---|---|
| **App UI tokens** | `brand-kit.css` (this repo) | The React application and its components |
| **Payment documents** | `C:/Users/accts/brand-kit/` (portable kit) | Invoices, receipts, payment pages, payment emails |

Both draw on the same values, so a customer sees one identity whether they are using the product or paying for it.

---

## 2. Taleem360 brand tokens

| Token | Value | Use |
|---|---|---|
| `--brand-primary` | `#10B981` Emerald 500 | Buttons, links, totals |
| `--brand-primary-dark` | `#059669` Emerald 600 | Hover / active |
| `--brand-primary-tint` | `#ECFDF5` Emerald 50 | Table headers, tinted panels |
| `--brand-ink` | `#0F172A` Cosmic Slate | Mastheads, dark surfaces |
| `--brand-ink-soft` | `#1E293B` Slate 800 | Secondary dark |
| `--brand-font-display` | Space Grotesk | Headings only |
| `--font-body` | Inter | Body copy |
| `--font-money` | JetBrains Mono | Amounts, references, ledger values |

**Prohibited:** the Google Material blue `#0b57d0` that previously sat in `brand-kit.css`. It is the default palette of the tooling the project was scaffolded in, not the Taleem360 brand. A comment in `brand-kit.css` records why, so it is not reintroduced.

**Fixed across every property, not brandable:** status colours. Green means paid, amber means due, red means overdue — always. A brand accent must never be used to mean overdue.

---

## 3. The payment documents

The portable kit at `C:/Users/accts/brand-kit/` contains:

| File | Purpose |
|---|---|
| `README.md` | How to use it, and how to add a property |
| `tokens.css` | The token contract + neutral defaults |
| `payment-kit.css` | Invoice / receipt / payment-page styles |
| `SAFEPAY.md` | The payment flow, gate status, and Safepay specifics |
| `properties/taleem360.css` | Taleem360's tokens and entity details |
| `templates/invoice.html` | Print-ready invoice |
| `templates/receipt.html` | Payment receipt |
| `templates/payment-link.html` | Branded page that hosts a Safepay link |
| `templates/payment-email.html` | Email carrying the payment link |
| `examples/taleem360-invoice-demo.html` | A filled invoice, to check layout |

**Why the templates are separate from this repo:** the same document structure serves every property in the portfolio, while each keeps its own logo, colours and name. The mandate requires that no brand or copy is shared between properties — so the *structure* is shared and the *identity* is not. Putting the templates in this repo would imply they are Taleem360-only.

---

## 4. Payment collection — Safepay

**Gateway:** Safepay, free tier. No setup fee, no monthly fee, no security deposit. Domestic rate 2.9% + Rs 30 per successful charge; international cards +0.3%. Methods include cards, PayFast, Raast, MPGS and CyberSource.

### ⛔ The gate applies

The mandate: *"Until there is EARNING, no investment, no subscriptions, and no paid services are to be implemented."* Payment integration is gated on the first $1 of revenue.

| | Status |
|---|---|
| Branded invoices + Safepay payment links | ✅ **Allowed now** — zero cost, no code |
| Safepay merchant account | ✅ Free tier |
| **API integration** (`@sfpy/node-core`, webhooks) | ⛔ **GATED** — do not build until revenue exists |

Send invoices with payment links and collect by hand. That is the mandate working as intended, and it tells you what schools will actually pay before you spend engineering on a checkout.

### 🔴 Safepay ownership is unresolved

Existing Safepay credentials in the scratchpad belong to **UK LTD Registration**, not Taleem360:

```
C:/Users/accts/scratchpad/safepay-sandbox-api.txt
# Property: UK LTD Registration
```

**Taleem360 must not reuse them.** Either open a separate Safepay merchant account for Taleem360, or share one account with a per-property reference scheme that keeps settlement traceable. See `SAFEPAY.md` for both options and the reference format.

---

## 5. Open items before the first invoice

| # | Item | Why it blocks |
|---|---|---|
| 1 | **Tax identifier (NTN)** | None exists. **Do not invent one.** An invoice without it is acceptable; an invoice with a fabricated number is a false document. |
| 2 | **A monitored support mailbox** | The live site currently describes `support@taleem360.online` as *"suspended"*, and the pricing page published a personal Gmail address until it was removed. An invoice must carry a working address. |
| 3 | **Safepay account decision** | Separate account, or shared with per-property references. |
| 4 | **Reference scheme agreed** | A payment that cannot be matched to an invoice is a support ticket. |

---

## 6. Consistency rules

1. **The document and the website must state the same price.** The published price is in `lib/pricingCatalog.ts`. Nothing in the payment kit may contradict it.
2. **Never state a price the site does not state.**
3. **No fabricated legal or tax data** — no invented registration numbers, addresses, or company forms.
4. **No personal email addresses** on customer-facing documents.
5. **Amounts in ISO currency codes** alongside symbols: `PKR 13,647`, not `Rs 13,647` alone.
6. **Receipts only after Safepay confirms.** A receipt is evidence; evidence issued early is worthless.
7. **Adding another property's tokens happens in that property's session**, never from here.

---

*Companion documents: `docs/00-audit-report.md`, `docs/01-revenue-model.md`, `docs/02-status.md`, `docs/lead-capture-setup.md`. Credential inventory: `C:/Users/accts/scratchpad/taleem360-credentials.md`.*
