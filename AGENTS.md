# 🤖 AI Agent Coding Guidelines: Taleem360 Project

This file contains critical structural rules, architectural guidelines, and optimization checklists that **MUST** be respected by any AI Coding Agent making modifications, adding modules, or refactoring code within the Taleem360 codebase.

---

## 🚨 Absolute Project Rules

### 1. Port Allocation Constraints
- **Rule**: Port **`3000`** is the ONLY permitted port for the container dev server.
- **Action**: Never reconfigure Vite or Express servers to bind to any other ports. Always listen on `0.0.0.0:3000` for public internet mapping.

### 2. Dual-Persistence Repository Pattern (PostgreSQL + JSON Fallback)
- **Rule**: All state alterations (Daycare, Academy, Nexus) must adhere to the dual-persistence pattern defined in `/repository`. 
- **Action**: Check for database connection state strings first. If missing, immediately falling back to local JSON persistent caches (`users_db.json`, `academy_db.json`, etc.) using standard Node file IO is **MANDATORY**. Do not crash or block the frontend compile if database pools cannot connect during isolated testing.

### 3. Subdomain-Aware Authentication & Branding
- **Rule**: Avoid hardcoding subdomain URLs. 
- **Action**: Always parse subdomains dynamically via the helper utilities (`window.location.hostname` or `req.headers.host`) to automatically determine active school nodes and specific brand color overrides. Reference `VERCEL_SUBDOMAINS_DEVICES_PLAN.md` for proper subdomain processing rules.

### 4. Interactive Theme Integrity
- **Rule**: Maintain the **"Cosmic Slate & Emerald Accent"** styling variables.
- **Action**: All buttons and responsive fields should match the established font pairings (Inter for general UI, JetBrains Mono for receipts or indexes). Ensure strict compliance with mobile touch targets ($44\text{px}$ minimal bounds).

---

## 🛠️ Code Modification Checklist

Before committing any code modifications, check and run:

- [ ] **Import Consistency**: Put all imports at the top-level of files. Use named imports instead of dynamic object destructuring. Do not use `import type` when dealing with Enum variables.
- [ ] **No Unsolicited Theme switchers**: Choose one beautiful high-contrast aesthetic. Allow custom tenant coloring when parsed, but do not code redundant preset buttons unless requested.
- [ ] **No Tech-Larping UI Elements**: Avoid injecting simulated terminal panels, artificial "STATUS: ONLINE" or "PORT: 3000" margin lines to "sandbox" the pages. Keep the cards and forms as the only clean layout assets visible.
- [ ] **Vercel Rewrite Resilience**: When altering route navigation inside `App.tsx` or `index.tsx`, verify that pages are mirrored in `/vercel.json` routing rewrites to prevent 404 page crashes.

---

## 📋 Running Verification

Always trigger the platform verification pipeline after making changes:
```bash
# Verify TypeScript compile & routing trees
npm run lint

# Build full compiled assets
npm run build
```
Any script or linter failures must be fixed immediately.
