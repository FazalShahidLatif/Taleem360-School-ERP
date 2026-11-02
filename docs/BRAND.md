# Taleem360 — Brand Kit Tracking

Brand tracking and design system reference for the Taleem360 project. This file
documents the brand identity so future work stays consistent and on-brand.

## Brand identity

- **Name:** Taleem360 (Taleem = education in Urdu; 360 = all-encompassing suite)
- **Full name:** Taleem360 Unified Education Suite
- **Domain:** taleem360.online
- **Tagline:** a unified school cloud ERP & LMS suite for Pakistani schools
- **Audience:** K-12 schools, daycares, academies, private tutors and multi-campus
  school groups in Pakistan.

## Visual identity

### Colours
| Role | Hex | Usage |
| --- | --- | --- |
| Cosmic Slate (primary) | `#0F172A` | Backgrounds, headers, primary text |
| Emerald (primary accent) | `#10B981` | CTAs, active states, brand highlights |
| Mint (secondary accent) | `#34D399` | Subtle tints, gradients |
| Slate-900 / Slate-800 | `#0F172A` / `#1E293B` | Card backgrounds, dark sections |
| Slate-500 | `#64748B` | Secondary text, borders |

### Typography
- Body: **Inter** (readable on mobile, matches the agency's design system)
- Headings / receipts / indexes: **JetBrains Mono**
- Both are set in the Vite/tailwind config; brand colours come from
  `brand-kit.css`.

### Logo
- **Primary mark:** graduation cap with a small orbit ring, "TALEEM360" wordmark.
- Logo file set: `public/taleem_logo.png` (primary), `public/icon-192.png`,
  `public/icon-512.png`, `apple-touch-icon.png`, `favicon-16.png`,
  `favicon-32.png`, `favicon.ico`, `public/og-image.png` (social card, 1200x630).
- The favicon SVG (`public/favicon.svg`) is the fallback; PNG rasters are the
  lead images for iOS/Android and crawlers.

### Iconography
- Lucide React icons, sized consistently (w-4/h-4 in the widget, w-6/h-6 in the
  brand button).
- `MessageCircle` remains the WhatsApp icon; `Sparkles` is used for AI features,
  and `Gift` for free/pilot messaging.

## Voice & tone
- **Professional and clear** — schools are time-poor; answer directly.
- **Educational, not salesy** — explain features and outcomes, never hype.
- **Decision-ready** — lead with the answer, then the facts (price, pilot, steps).
- **Honest** — if a question is outside the data, say so; never fabricate prices,
  ratings or partnerships.
- **English only** — no Hinglish or Urdu mixed into site-facing copy.

## Assets
| Asset | File |
| --- | --- |
| Brand logo (PNG) | `public/taleem_logo.png` |
| Social card (1200x630) | `public/og-image.png` |
| Favicon/icon set | `favicon-16.png`, `favicon-32.png`, `icon-192.png`, `icon-512.png`, `favicon.ico` |
| Manifest | `public/manifest.json` |
| Legal pages | `/privacy`, `/terms`, `/cookies`, `/refund-policy`, `/legal` |

## Compliance notes (must-keep)
- Never claim or fabricate capabilities (campus counts, ratings, testimonials).
- Every price is real and stated; custom scope is quoted individually.
- AI-generated content is consent-gated and lead-capturing, not a free-support
  channel.
- Pricing pages show the single published price (USD 49/month for up to 200 active
  student profiles); larger schools, multi-campus and white-label are quoted.
