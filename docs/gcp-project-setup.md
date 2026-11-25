# GCP Project Creation & Service Account Setup Guide — Taleem360

**Project:** `taleem360` (new, from scratch)
**Repo:** `C:/Gitub-Projects/Taleem360-School-ERP`
**Target URL:** `https://taleem360.online`
**Owner:** Project owner account (accts.pak@gmail.com)
**Date:** 2026-11-26

---

## Part 1: Delete the Old Project (if you haven't already)

1. Go to `console.cloud.google.com`
2. Click the project selector dropdown (top left, near "Google Cloud")
3. Select `gen-lang-client-0365303633` from the list
4. Click **Project settings** (gear icon) or **IAM & Admin → Settings**
5. Scroll to **Delete a project** at the bottom
6. In the confirmation box, type: `gen-lang-client-0365303633`
7. Click **Delete**
8. Wait for confirmation (projects may take a few minutes to fully delete)

---

## Part 2: Create the New `taleem360` GCP Project

1. From the project selector dropdown, click **+ Select a project**
2. Click **New Project** at the top
3. **Project name:** `taleem360`
4. **Organization:** `No organization` (or select your org)
5. Click **Create**
6. Wait for the green checkmark → Click **Select** to open the new project

---

## Part 3: Enable Required APIs

1. Go to **APIs & Services → Library** (left sidebar)
2. Search each API and click **Enable**:

| Search Term | API Name | Purpose |
|---|---|---|
| Google Sheets API | Google Sheets API | Lead capture → Sheets |
| Google Drive API | Google Drive API | File storage |
| Gmail API | Gmail API | Email automation |
| Cloud SQL | Cloud SQL Admin API | MySQL/PostgreSQL database (free tier) |
| Cloud Firestore | Cloud Firestore API | NoSQL / real-time data |
| Cloud Storage | Cloud Storage API | File uploads / assets |
| Vertex AI | Vertex AI API | AI models (Gemini) |
| Cloud Integration | Cloud Integration API | For future integrations |

---

## Part 4: Configure OAuth Consent Screen

1. Go to **APIs & Services → OAuth consent screen** (left sidebar)
2. User type: **External**
3. Click **Create**
4. App name: `Taleem360`
5. User support email: `accts.pak@gmail.com`
6. Developer contact email: `accts.pak@gmail.com`
7. Click **Save and Continue**
8. Scopes:
   - Click **Add or Remove Scopes**
   - Select:
     - `.../auth/spreadsheets` (Google Sheets)
     - `.../auth/gmail.send` (Gmail)
     - `.../auth/drive.file` (Google Drive)
     - `.../auth/cloud-platform` (Cloud Platform)
     - `.../auth/userinfo.email` (Email)
     - `.../auth/userinfo.profile` (Profile)
   - Click **Update** → **Save**
9. Testing: Click **Add Users** → add `accts.pak@gmail.com` as test user
10. Click **Save and Continue** → **Back to Dashboard**

---

## Part 5: Create the Service Account

1. Go to **IAM & Admin → Service Accounts** (left sidebar)
2. Click **+ Create Service Account**
3. **Service account name:** `taleem360`
4. Click **Create and Continue**
5. **Grant this service account access to project:**
   - Role: `Project Owner` (or individual roles)
   - Click **Done**
6. Click **Done** (skip the "Grant users access to this service account" step)
7. Click on the newly created `taleem360` service account
8. Go to **Keys → Add Key → Create new key**
9. Format: **JSON** → Click **Create**
10. Download the JSON file and save it as:
    `C:/Users/accts/scratchpad/taleem360-service-account.json`

11. **Note the service account email:**
    `taleem360@taleem360.iam.gserviceaccount.com`

---

## Part 6: Set Up Database (Cloud SQL Free Tier)

1. Go to **SQL** (bottom left → **SQL**)
2. Click **Create Instance**
3. **Choose engine:** MySQL (or PostgreSQL)
4. **Machine type:** Burstable (3.1 GB) — free tier
5. **Region:** `us-central1` (free tier)
6. **Database version:** MySQL 8.0 (or PostgreSQL 14)
7. Click **Allow this instance to be authorized from any IP address** (for Vercel)
8. Set root password — save it:
   `Taleem360!Dev2026` (example, use a strong random one)
9. Click **Create**
10. Note:
    - Connection name: `projects/taleem360/instances/taleem360`
    - Public IP: (shown in instance details)
    - Root password: (you set this)

---

## Part 7: Set Up Cloud Storage

1. Go to **Cloud Storage → Buckets**
2. Click **Create**
3. **Bucket name:** `taleem360-assets` (must be globally unique)
4. **Location:** `us-central1` (free tier)
5. **Storage class:** Standard
6. Click **Create**
7. Note the bucket name for later

---

## Part 8: Create the Lead Capture Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet named `Taleem360 Leads`
3. In the sheet, add these column headers:
   ```
   Timestamp | Name | Email | Phone | Country | State | Business Type | Package | Source | Notes
   ```
4. Get the Sheet ID:
   - Open the sheet → URL bar
   - Copy the ID between `/d/` and `/edit`
   - Example: `1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T`
5. Share the sheet with the service account:
   - Click **Share** → **Advanced**
   - Enter: `taleem360@taleem360.iam.gserviceaccount.com`
   - Role: **Editor**
   - Click **Share**

---

## Part 9: Create OAuth Client ID (for Login)

1. Go to **APIs & Services → Credentials** (left sidebar)
2. Click **+ Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Name: `Taleem360 Web`
5. **Authorized redirect URIs:**
   - `https://taleem360.online/auth/google/callback`
   - `http://localhost:3000/auth/google/callback`
6. Click **Create**
7. Copy the **Client ID**:
   `1234567890-ab12c3d4e5f6g7h8i9j0k1l@example.com`
8. Copy the **Client Secret**:
   `GOCSPX-abcdef1234567890`

---

## Part 10: Vercel Environment Variables

Go to **Vercel → Project → Settings → Environment Variables** and add:

| Variable | Value | Notes |
|---|---|---|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Paste the full JSON content | From Part 5 step 10 |
| `LEAD_SHEET_ID` | Your sheet ID | From Part 8 step 4 |
| `GOOGLE_CLIENT_ID` | OAuth client ID | From Part 9 |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret | From Part 9 |
| `JWT_SECRET` | Random 32+ char string | Generate with: `openssl rand -base64 32` |
| `DATABASE_URL` | PostgreSQL connection string | From Part 6 |
| `DB_HOST` | Cloud SQL IP or proxy | From Part 6 |
| `DB_USER` | Root or app user | From Part 6 |
| `DB_PASSWORD` | Your root password | From Part 6 |
| `DB_NAME` | Database name | Created in Cloud SQL |
| `GCS_BUCKET_NAME` | `taleem360-assets` | From Part 7 |

---

## Part 11: Verify Everything Works

1. Redeploy Vercel: `vercel --prod`
2. Test sign-in: Visit `https://taleem360.online` → click **Sign in with Google**
3. Test lead capture: Fill out a lead form → verify it appears in the Sheet
4. Test GA4: Visit the site → check GA4 real-time report
5. Test Cloud Storage: Upload a file via the app → verify in Cloud Storage bucket

---

## Part 12: Cleanup

1. Delete `C:/Users/accts/Downloads/*.json` (10 files mixed across projects)
2. Remove the old `gen-lang-client-0365303633` project (already done in Part 1)
3. Update `.env.example` with new variable names
4. Commit and push to GitHub

---

## Quick Reference: File & Variable Names

| Item | Value |
|---|---|
| GCP Project | `taleem360` |
| Service Account | `taleem360@taleem360.iam.gserviceaccount.com` |
| Service Account Key | `C:/Users/accts/scratchpad/taleem360-service-account.json` |
| Cloud Storage Bucket | `taleem360-assets` |
| Sheet ID | (You'll create this) |
| OAuth Client ID | (You'll create this) |
| OAuth Client Secret | (You'll create this) |

---

## Troubleshooting

| Issue | Fix |
|---|---|
| "OAuth client not authorized" | Add your email as a test user in OAuth consent screen |
| "Service account not authorized" | Grant Editor role on the Sheet for the SA |
| "Database connection failed" | Check Cloud SQL IP allowlist or use Cloud SQL Auth Proxy |
| "GCS 403 Forbidden" | Grant roles/storage.objectAdmin to the SA |
| "Gmail API 403" | Enable Gmail API in API Library, grant Delegated Access to your mailbox |
