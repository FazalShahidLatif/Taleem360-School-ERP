# Taleem360 Isolated Repository Architectural Guide

This document presents the feedback, complete implementation map, state workflows, and execution guide for the **Daycare, Academy, and Nexus isolated production repositories**.

---

## 1. Structural Map of Completed Repositories

The repositories have been fully implemented with a dual-layer approach: **High-Performance Production PostgreSQL Pool Querying** when live database environment connection strings are active, combined with **Zero-Config File-Persistence Fallbacks** using isolated local database caches (`users_db.json`, `academy_db.json`, `nexus_db.json`). Both models compile with zero warnings or errors.

```
/repository
├── daycare/
│   ├── billingRepository.ts        <-- Core student late fees, dues & ERP sync state controllers
│   ├── guardianRepository.ts       <-- Authorized pickup personnel & secure terminal PIN keys
│   └── operatingHoursRepository.ts <-- Dynamic facility open/closing & auto-penalty schedules
├── academy/
│   └── academyRepository.ts        <-- Tenant brands, skill courses, enrollment ledger, AI grading
└── nexus/
    └── nexusRepository.ts         <-- Privacy sessions, crypto-faucet throttles, Q&A base, payout receipts
```

---

## 2. Core Feedback & Assessment

### Isolatability (Why it works)
1. **Dynamic Scaling**: By separating each database connection string (`DAYCARE_DATABASE_URL`, `ACADEMY_DATABASE_URL`, `NEXUS_DATABASE_URL`), the system can run as a unified full-stack server but fetch query streams from distinct geo-located, serverless instances or multi-tenant database clusters.
2. **Offline Simulation Resilience**: If the target production databases are offline or undergoing migrations, the fallback engines update JSON stores, allowing full interface previews and checkout kiosks to work during offline stages.
3. **Audit Readiness**: Recording student details (school, city, country, grade level) with a loose matching key against unified globally verified authentication accounts guarantees compliance with global standards.

---

## 3. Step-by-Step State Machines (Operational States)

To activate, verify, or sync records, the modules cycle through distinct lifecycle phases.

```
                  ┌──────────────────────────────┐
                  │   STAGE 1: BOOTSTRAP         │
                  │   Verify environment-vars    │
                  └──────────────┬───────────────┘
                                 │
                  ┌──────────────▼───────────────┐
                  │   STAGE 2: CONNECTION POOL   │
                  │   Fall back or connect live  │
                  └──────────────┬───────────────┘
                                 │
                  ┌──────────────▼───────────────┐
                  │   STAGE 3: MUTATION LEDGER   │
                  │   Atomic upserts + local DB  │
                  └──────────────┬───────────────┘
                                 │
                  ┌──────────────▼───────────────┐
                  │   STAGE 4: SYNC DISPATCH     │
                  │   Flush un-synced entries    │
                  └──────────────────────────────┘
```

### Stage 1: Bootstrap & Detection
- **Check**: Checks for `DATABASE_URL` strings on load.
- **Fail Safe**: Logs `[Repository] Failed to initialize Pool` gracefully without throwing terminal errors, switching the application's pointer to local reactive state files.

### Stage 2: Connection Pool Integration
- **Postgres active**: Uses the imported `pg` node pools to run connection tests.
- **In-memory active**: Boots file streams using standard node `fs` functions and loads active collections into memory.

### Stage 3: Atomic Mutation Ledger
- When children checked out late, or a student enrolls:
  - Repositories apply atomic upserts matching table constraint structures (`ON CONFLICT (daycare_child_id, billing_period_start)`).
  - Repositories write to local fallback lists to make visual tools responsive.

### Stage 4: Sync & Dispatch Loops
- The primary ERP periodically scrapes repositories via the `synced_to_main_erp = FALSE` indicator flag and locks down processed records using `markLedgerAsSynced(invoiceId)`.

---

## 4. How to Activate and Verify (Developer Steps)

1. **Provide Environment Secrets**:
   Copy or append variables into `.env`:
   ```bash
   DAYCARE_DATABASE_URL=postgresql://user:pass@host:port/daycare_db
   ACADEMY_DATABASE_URL=postgresql://user:pass@host:port/academy_db
   NEXUS_DATABASE_URL=postgresql://user:pass@host:port/nexus_db
   ```
2. **Execute Migration Scripts**:
   Generate production schemas by piping the corresponding SQL structure files into target databases:
   ```bash
   psql $DAYCARE_DATABASE_URL -f daycare_schema.sql
   psql $ACADEMY_DATABASE_URL -f academy_schema.sql
   psql $NEXUS_DATABASE_URL -f nexus_schema.sql
   ```
3. **Verify API Routes & Integrations**:
   The repositories export robust TypeScript methods:
   - `registerGuardian(...)`, `getGuardiansOfChild(...)`, `verifyKioskPIN(...)`
   - `createTenant(...)`, `createCourse(...)`, `submitAssignment(...)`
   - `getOrCreateGuestSession(...)`, `incrementQuizCounter(...)`, `logCryptoPayout(...)`
