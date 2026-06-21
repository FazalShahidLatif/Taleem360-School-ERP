# 🏫 Taleem360: Universal Multi-Tenant Educational Ecosystem

Welcome to the **Taleem360** codebase—a highly scalable, high-performance, and resilient multi-tenant school, daycare, and tutor management ecosystem engineered for modern global learning.

Taleem360 features a decoupled frontend-heavy design that easily transforms into a durable, full-stack Postgres-backed ecosystem. Under offline or development environments, it seamlessly leverages dynamic JSON-persistence and in-memory fallbacks to maintain smooth customer and workspace interactions.

---

## 🎨 Creative Theme & User Experience (UX)

Taleem360 has been sculpted around a **"Cosmic Slate & Emerald Accent"** visual identity:
- **Sophisticated Typography**: Uses clear display structures paired with monospace tags matching database indexes to project institutional confidence and analytical rigor.
- **Micro-Animations**: All sections include subtle, purposeful layout transitions and micro-hover states powered by `motion/react` to highlight core interactions.
- **Responsive Fluidity**: Engineered desktop-first for precise admin boards, while maintaining complete touch-target compliance ($44\text{px}+$) for kindergarten checkers, solo tutors, and pupils accessing materials on mobile devices.

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
