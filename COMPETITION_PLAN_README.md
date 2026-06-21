# Taleem360-School ERP: Global Competition & Student Hub Blueprint
## 6-Month Review Slate: Active Target (December 21, 2026)

This document establishes the strategic, financial, and technical architecture for the **Taleem360 student talent hub and micro-competition module**. It is engineered specifically for students up to 10th Grade / O Level across Local, Regional, and Global scales.

---

## 1. Executive Summary & Vision

Taleem360 aims to bridge the gap between classroom academics and global extracurricular showcase portfolios. By introducing a central node for students to share **drawings, essays/articles, computer code, and scientific ideas**, we establish a verified record of accomplishment matched against school, city, and country. 

As a future extension, a self-sustaining showcase architecture enables student micro-competitions. Participants pay a nominal entry fee of **$1.00 to $2.00 USD**, generating a prize pot of which **exactly 50% is distributed to 100 selected winners**, and the remaining 50% is retained for server maintenance, moderation, transaction fees, and system-wide improvements. 

---

## 2. Hub Registration & Submission Architecture

For credibility and academic record integrity, every submission must map to verified school records.

### Database Schema Draft (Student Artifact Ledger)
```sql
-- Core student participant registry
CREATE TABLE student_participants (
    student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(128) NOT NULL,
    parent_email VARCHAR(256) NOT NULL, -- Core contact and COPPA compliance node
    grade_level VARCHAR(32) NOT NULL,   -- e.g., "Grade 4", "O-Level Year 1"
    school_name VARCHAR(256) NOT NULL,
    city VARCHAR(128) NOT NULL,
    country VARCHAR(128) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Submission artifacts
CREATE TABLE submissions (
    submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student_participants(student_id),
    category VARCHAR(64) NOT NULL,      -- "ART", "WRITING", "CODE", "IDEA"
    title VARCHAR(256) NOT NULL,
    description TEXT,
    artifact_url VARCHAR(512) NOT NULL, -- Secure S3 / Cloud Storage pointer
    status VARCHAR(32) DEFAULT 'PENDING', -- PENDING, APPROVED, FLAGGLING, REJECTED
    competitions_entered INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Verification Pipeline
1. **Academic Endorsement**: A school email verification step, parent approval, or simple school principal verification request increases submission credibility score.
2. **Plagiarism & AI Check**: Code, ideas, and text are routed through lightweight static checks and LLM-assisted verification to ensure original child authorship relative to their grade level.

---

## 3. Financial Pot Model ($1 - $2 Entry)

To promote accessibility in emerging markets (Asia, Africa, Latin America), the transaction entry fee stays at a hard price point of **$1 to $2 USD**. 

### The 50% Allocation Math
- **Total Entry Fee**: $E$
- **Total Collected Pool**: $P_{total} = N \times E$ (where $N = $ total valid participants)
- **Giveaway Distribution Pool**: $D_{pool} = P_{total} \times 0.50$
- **Taleem360 Platform Yield**: $P_{yield} = P_{total} \times 0.50$

The giveaway pool is strictly divided among **100 selected students**:
1. **Top 1-3 Tier (Grand Prizes)**: Split **30%** of the $D_{pool}$.
   - **First Place**: 15% of $D_{pool}$
   - **Second Place**: 10% of $D_{pool}$
   - **Third Place**: 5% of $D_{pool}$
2. **Runner-Up Tier (97 Students)**: Equally share the remaining **70%** of the $D_{pool}$.
   - **Each Runner-Up**: $D_{pool} \times 0.70 / 97$

### Worked Simulation (10,000 Participants @ $1.50 Fee)
- **Total Pool Collected ($P_{total}$)**: $15,000 USD
- **Giveaway Distribution ($D_{pool}$)**: $7,500 USD (50%)
- **Platform Maintenance ($P_{yield}$)**: $7,500 USD (50%)

#### Award Payout Chart:
| Rank | Winner Count | Percentage of Dist. Pool | Individual Payout |
| :--- | :--- | :--- | :--- |
| **Rank 1** | 1 | 15.0% | **$1,125.00** |
| **Rank 2** | 1 | 10.0% | **$750.00** |
| **Rank 3** | 1 | 5.0% | **$375.00** |
| **Ranks 4-100** | 97 | 70.0% (Equally Split) | **$54.12** each |

---

## 4. Evaluation and Transparency Matrix

To guarantee fair outcomes and eliminate claims of bias, the competition enforces structured, open-source criteria:

1. **Age-Group Adjustments (Grade Normalization)**:
   - Evaluators judge submissions based on standard developmental capabilities relative to four bands: **K-Grade 2**, **Grades 3-5**, **Grades 6-8**, and **Grades 9-10/O-Levels**.
2. **Public Ledger Protocol**:
   - A public ledger display outlines all participating school networks, count of submissions, and lists the winners with redacted emails (for security / COPPA privacy) but explicit School, City, and Country attribution.
   - An open gallery showcases the visual projects, code repository links, or articles of the top 100 students.

---

## 5. Governance & Review Board Schedule
### Target Date for Board Action: December 21, 2026 (6 Months Anniversary)

This plan is held in a development cycle. The administrators must perform a formal assessment on or before **December 21, 2026** to dictate the transition from planning to active implementation.

### Current Initiative Status: `ON HOLD / PLANNING`
*Review Board options: `APPROVED`, `DISAPPROVED`, `ON HOLD`.*

---

## 6. Review Checklist for Administrators

The Board must authenticate the following variables during the 6-month evaluation checkpoint:

- [ ] **Regulatory Clarity**: Ensure international gaming, lottery, and giveaway laws are respected (since a minor fee is charged, we classify this under a "Skill-Based Competition" to avoid "lottery" categorizations, which are heavily restricted).
- [ ] **COPPA & GDPR Compliance**: Finalize robust parental signature and contact collection flow in compliance with COPPA children privacy guidelines.
- [ ] **Payment Ingress**: Establish multi-currency gateway support (Stripe, bKash, JazzCash) that allows micropayments without eating the entry fee in static transaction costs (micro-processing rates).
- [ ] **Moderation Team**: Recruit or build automated vision filters to weed out toxic, copyright-infringed, or computer-generated adult content before public display.

---

### Suggested Automated Reminders Workflow
To assure compliance with this 6-month review, engineers should integrate a trigger in the administrative backend or schedule a calendar action.

Here is a Cron trigger syntax example to alert the administration:
```bash
# Triggers on Dec 21, 2026 at 09:00 AM to dispatch urgent planning update notification to Slack / Email
0 9 21 12 * [ $(date +\%Y) -eq 2026 ] && curl -X POST -H 'Content-type: application/json' --data '{"text":"🚨 Taleem360 Governance Notice: 6-Month Mark reached. Please review, and update /COMPETITION_PLAN_README.md"}' https://hooks.slack.com/services/T360/ALERT/TOKEN
```
