# 🏫 Taleem360: Universal Multi-Tenant Educational Ecosystem

Welcome to the **Taleem360** codebase—a highly scalable, high-performance, and resilient multi-tenant school, daycare, and tutor management ecosystem engineered for modern global learning.

Taleem360 features a decoupled frontend-heavy design that easily transforms into a durable, full-stack Postgres-backed ecosystem. Under offline or development environments, it seamlessly leverages dynamic JSON-persistence and in-memory fallbacks to maintain smooth customer and workspace interactions.

---

## 🎨 Creative Brand Kit & User Experience (UX)

Taleem360 is sculpted around a cohesive, high-performance **"Cosmic Slate & Emerald Accent"** brand identity. This system is designed to convey institutional credibility, professional administrative control, and global modern learning.

### 1. Interactive Visual Theme Colors

| Color Role | Color Swatch | HEX Code | RGB Code | Tailwind Utility | Brand Application |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **Cosmic Slate** (Primary Dark) | ⬛ | `#0F172A` | `rgb(15, 23, 42)` | `bg-slate-900` | Primary dark background, rich admin cards, high-contrast panels, and display headings. |
| **Slate Hover** (Secondary Dark) | ⬛ | `#1E293B` | `rgb(30, 41, 59)` | `bg-slate-800` | Secondary backdrops, table headers, sidebar lists, and active states. |
| **Emerald Accent** (Interactive Highlight) | 🟩 | `#10B981` | `rgb(16, 185, 129)` | `text-emerald-500` | Primary interactive widgets, transaction status badges, success rings, and primary CTAs. |
| **Emerald Hover** (Active Accent) | 🟩 | `#059669` | `rgb(5, 150, 105)` | `bg-emerald-600` | Hover micro-interactions, custom button transitions, and key active elements. |
| **Light Slate** (Soft Accent) | ⬜ | `#F8FAFC` | `rgb(248, 250, 252)` | `bg-slate-50` | Main client-side workspace canvas, report details, and dashboard card backgrounds. |

### 2. Sophisticated Typography (Font Pairings)

To maintain clean analytical presentation paired with premium display structure, Taleem360 implements strict typography configurations:
- **Primary UI & Body (Sans-Serif)**: `Inter`
  - *Setup*: Google Fonts `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap')`
  - *Usage*: High-contrast lists, forms, parent notifications, and layout text. Extreme legibility at low-resolution and mobile displays.
- **Display & Section Headings (Tech-Forward)**: `Space Grotesk` or `Outfit`
  - *Setup*: Google Fonts `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap')`
  - *Usage*: Main page titles, dashboard numbers, analytics titles, and white-labeled academy branding.
- **Indices, Receipts & Logs (Monospace)**: `JetBrains Mono`
  - *Setup*: Google Fonts `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap')`
  - *Usage*: Payment status receipts (`0x...`), ledger keys, database indexes, late-fee calculation slips, and raw statistics.

### 3. Official Vector Logo Representation

The official **Taleem360** brand emblem combines an academic graduate-cap/book shape with a dynamic, cosmic emerald orbit ring. Below is the responsive SVG source:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="100%" height="auto">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="cosmic-slate-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#1E293B" />
    </linearGradient>
    <linearGradient id="emerald-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="100%" stop-color="#10B981" />
    </linearGradient>
    <linearGradient id="accent-white-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
  </defs>
  
  <rect width="100%" height="100%" rx="16" fill="url(#cosmic-slate-grad)" />
  
  <!-- Logo Emblem: Graduation Cap + Orbit Ring -->
  <g transform="translate(60, 45)">
    <!-- Cosmic Emerald Orbit Ring (Outer Ellipse) -->
    <ellipse cx="55" cy="55" rx="50" ry="18" fill="none" stroke="url(#emerald-grad)" stroke-width="4.5" transform="rotate(-25 55 55)" opacity="0.85" />
    
    <!-- Graduate Cap Book Hybrid (Emblem) -->
    <polygon points="55,20 92,38 55,56 18,38" fill="url(#accent-white-grad)" stroke="#059669" stroke-width="1.5" />
    <path d="M55,38 L32,48 L32,62" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="32" cy="62" r="3" fill="#10B981" />
    <path d="M30,46 L30,68 C30,73 50,78 55,78 C60,78 80,73 80,68 L80,46" fill="none" stroke="url(#accent-white-grad)" stroke-width="4.5" stroke-linecap="round" />
    <path d="M30,46 L30,65 C30,70 50,75 55,75 C60,75 80,70 80,65 L80,46" fill="none" stroke="url(#emerald-grad)" stroke-width="1.5" />
  </g>
  
  <!-- Logo Wordmark: Taleem360 -->
  <g transform="translate(195, 115)">
    <text font-family="'Inter', 'Space Grotesk', sans-serif" font-size="52" font-weight="900" fill="#FFFFFF" letter-spacing="-1">Taleem<tspan fill="url(#emerald-grad)">360</tspan></text>
    <text font-family="'JetBrains Mono', monospace" font-size="14" font-weight="500" fill="#94A3B8" letter-spacing="4" x="2" y="32">UNIVERSAL LEARNING ERP</text>
  </g>
</svg>
```

### 4. Downloadable Product & Pricing CSV Catalog (ZIP Pack)

To provide developers, integration partners, and academic board auditors with clear, offline-ready subscription models, we provide a complete products and pricing ledger downloadable in a single compressed ZIP format:

📥 **[Download Pricing Catalog CSV ZIP Pack](/taleem360_pricing.zip)** (Place directly under `/public/taleem360_pricing.zip` in your sandbox or deployment context)

The ZIP package contains the following structured files:
1. `products_usd_pricing.csv`: Master USD list of all school modules (SchoolERP, DaycareHub, PrivateTutors, SkillsAcademy), tiers, price matrices (monthly/yearly), capacity bounds, and detailed product feature listings.
2. `products_regional_pricing.csv`: Real-time converted pricing conversions in UAE Dirhams (**AED**) and Pakistan Rupees (**PKR**), matched precisely against our float-safe scaling multipliers (`3673` and `278500`) to guarantee transaction consistency.
3. `README_pricing.txt`: Documentation detailing regional conversion methodologies, integer-math scaling, and active tier setups.

To rebuild or refresh this downloadable package locally, run:
```bash
npm run export-pricing
```

---

## 🏛️ Platform Architecture & Personas

Taleem360 is built to handle five specialized educational workflows:

1. **Conventional K12 Schools & Colleges (ERP)**: Includes comprehensive grade matrices, scheduling timetables, cashless fee collection setups, and centralized administration portals.
2. **Daycare Center Hub (ECE)**: Focuses on quick, secure kiosk PIN terminal check-ins, authorized pickup guardian tracking, and dynamic penalty motors for late check-outs.
3. **Solo Pro & Private Tutors**: Empowers independent teachers with dedicated public booking slots, availability matrices, and integrated payment checkouts.
4. **Skills Academies & Bootcamps**: Offers a white-labeled Learning Management System (LMS) with progress charts and multi-installment invoice tracking.
5. **Global Student Competition Hub**: Provides a democratized, transparent series panel rewarding creative drawings, essays, and computer code submissions.

---

## 📦 Isolated Production Repositories

The codebase has been designed with strict domain boundaries inside the `/repository` namespace. Each domain utilizes standard PostgreSQL pooling interfaces when dynamic live connections are set, with automatic seamless file fallbacks when running standalone:

- **`daycare/`**: Manages operational hours, pickup permissions, and billing ledgers:
  - `operatingHoursRepository.ts`: Evaluates dynamic school closures and computes late fees.
  - `guardianRepository.ts`: Validates terminal PIN checks and maps emergency pickup rights.
  - `billingRepository.ts`: Updates child balances and commits transactions to JSON caches.
- **`academy/`**: Orchesrates course registrations, multi-tenant academic branding, student profiles, and LLM grading pipelines.
- **`nexus/`**: Drives single-sign-on (SSO) sessions, educational Q&A repositories, and micro-giveaway ledgers.

---

## 🌐 Vercel Wildcard Routing (`*.taleem360.online`)

To support instant micro-sites for private tutors and independent school systems, Taleem360 supports **Wildcard Subdomains** on Vercel:
- Visit any subdomain (e.g., `beaconhouse.taleem360.online`, `k12-academy.taleem360.online`) to view customized brand styling, theme overlays, and isolated school logins instantly without requiring additional code deployments.
- Subdomain configurations, fallback scripts, and wildcard DNS mappings are fully documented in `VERCEL_SUBDOMAINS_DEVICES_PLAN.md`.

---

## 🏆 Deployed Module: Global Student Competition Hub

Launched on **June 21, 2026**, the Global Competition Hub allows classroom pupils up to 10th Grade / O Levels to register portfolios across four categories: **Art, Writing, STEM Programming, and Innovations**:
- **50% Giveaway Pot Pool**: An interactive sliding-scale calculator simulates total student sign-ups to showcase transparent payout splits.
- **Secure Registration Checkout**: Backed by a parent/teacher consent flow and nominal $1/$2 USD entry tier.
- **Cryptographic Live Ledger**: Every project is committed to visual listings complete with transaction receipts (`0x...`) and verified status medals.
- Access it live through the main navigation menu or by visiting `/free-resources` and toggling the **Global Student Competition Hub** tab!

---

## 🚀 Setup & Verification Guide

### 1. Environment Secrets Setup
Create `.env` at the root and append:
```bash
# Isolated Repository Database Connections
DAYCARE_DATABASE_URL=postgresql://user:password@host:port/daycare_db
ACADEMY_DATABASE_URL=postgresql://user:password@host:port/academy_db
NEXUS_DATABASE_URL=postgresql://user:password@host:port/nexus_db
```

### 2. Standalone Verification
If live database strings are omitted, the repositories will log a fallback message on start and auto-route operations to local JSON caches (`users_db.json`, `daycare_schema.sql`, etc.) to guarantee zero-friction local testing.

### 3. Application Commands
```bash
# Install dependencies
npm install

# Run Vite local development server (bound on port 3000)
npm run dev

# Run project linter checks
npm run lint

# Build production bundle
npm run build
```

---

## 📑 Complete Repository Document Index

Explore specialized plans and architectural guidelines in the workspace:
1. `TALEEM360_TECHNICAL_BRIEF.md` - Core multi-tenant topology & transaction isolation guidelines.
2. `REPOSITORIES_ARCHITECTURE.md` - Technical workflows, status matrices, and PostgreSQL database sync scripts.
3. `VERCEL_SUBDOMAINS_DEVICES_PLAN.md` - Edge middleware and sub-domain branding routing setups.
4. `COMPETITION_PLAN_README.md` - Mathematical breakdown of the 100-student giveaway and COPPA legal compliance.
