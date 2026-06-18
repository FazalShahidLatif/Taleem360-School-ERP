# Taleem360 Next-Generation Multitenant API Core (`taleem360-core-v2`)

Welcome to the development blueprint and repository for the next-generation, decoupled multitenant architecture of **Taleem360**. 

This system represents a major pivot from a traditional school management utility into a universal, multi-tenant B2B and B2C educational ecosystem. Built on a serverless microservices framework, it implements a highly flexible database model that easily caters to five distinct target personas through a single, unified database schema:

1. **Conventional K12 Schools & Colleges** (Detailed administrative campuses, classes, sections, and complex fee structures).
2. **Kindergartens & Daycares** (Daily student activity logs, nap times, meal tracker, and instant parent notifications).
3. **Private Solo-preneurs & freelance Tutors** (Public Calendly-style online scheduling widgets, hourly pricing, and direct pay/booking channels).
4. **Educational Entrepreneurs & Commercial Bootcamps** (Asynchronous video courses, student progress reporting, marketing landing hooks).
5. **Students & Consumers** (Paid video subscription courses, quizzes, global billing portals).

---

## SECTION 1: SYSTEM ARCHITECTURE & DATA FLOWS

To achieve 100% isolation from the live, legacy production codebase during rollout, we utilize the **Strangler Fig Pattern**. Below are the diagrams mapping traffic routing, database polymorphism, and automated payment delivery pathways.

### 1. The Edge Routing Network
Cloudflare edge routes matching requests (`/api/v2/*`) directly to our decoupled Vercel microservices cluster. All other traffic is seamlessly routed to the legacy system without interruption.

```text
                        ┌────────────────────────────────────────┐
                        │      HTTP Clients / Mobile App         │
                        └───────────────────┬────────────────────┘
                                            │
                                            ▼
                        ┌────────────────────────────────────────┐
                        │         Cloudflare Protection          │
                        │     (SSL, DDoS & Edge Request Cache)   │
                        └───────────────────┬────────────────────┘
                                            │
                        ┌───────────────────┴────────────────────┐
                        │        Legacy Router (Vercel Core)     │
                        │            - vercel.json rewrites      │
                        └─────────┬───────────────────┬──────────┘
                                  │                   │
                     (Default)    │                   │ (/api/v2/* Route)
                     Traditional  │                   │ Decoupled
                     Standard App │                   │ microservices proxy
                                  ▼                   ▼
                     ┌────────────┴───┐       ┌───────┴───────────────┐
                     │   Legacy       │       │  Next-Gen             │
                     │  Taleem ERP    │       │  taleem360-core-v2    │
                     │  Environment   │       │  Serverless Backend   │
                     └────────────────┘       └───────────────────────┘
```

---

### 2. The Modular Polymorphic Database Schema
Rather than replicating complex table hierarchies for every school, we consolidate structures into a modular, polymorphic mapping pattern using loose Schema Documents.

```text
                  ┌─────────────────────────────────────────────────────────┐
                  │                 Tenant Model (NoSQL Document)           │
                  ├─────────────────────────────────────────────────────────┤
                  │  - accountId: String (PK/Index)                         │
                  │  - name: String                                         │
                  │  - persona: TenantPersona [K12 | DAYCARE | TUTOR | ...]  │
                  │  - isActive: Boolean                                    │
                  │  - localization: { timezone, currency, locale }         │
                  └───────────┬─────────────────────────────────┬───────────┘
                              │                                 │
                              ▼ (Settings Mapped by Persona)    ▼ (Billing Mapping ID)
         ┌────────────────────┴────────────────────┐  ┌─────────┴──────────────────────┐
         │ Polymorphic Persona Parameters Map:     │  │   Subscription Document        │
         ├─────────────────────────────────────────┤  ├────────────────────────────────┤
         │ • k12Settings:                          │  │ - tenantId: String (Ref)       │
         │   [campuses, boardAffiliation, grade]  │  │ - paddleSubscriptionId (Idx)   │
         │ • daycareSettings:                     │  │ - tier: SubscriptionTier       │
         │   [napTracking, mealLogging, graces]    │  │ - status: SubscriptionStatus   │
         │ • soloTutorSettings:                    │  │ - billingCycle: String         │
         │   [bookingSlug, availability, hourly]   │  │ - quotas:                      │
         │ • bootcampSettings:                     │  │   { maxStudents, maxStorage }  │
         │   [courseCatalog, marketingFunnelUrl]   │  └────────────────────────────────┘
         │ • studentConsumerSettings:              │
         │   [enrolledCourses, streamingQuotaBytes]│
         └─────────────────────────────────────────┘
```

---

### 3. Asymmetric Billing & Video Streaming Pipeline
When a student triggers a purchase, Paddle securely processes metadata. On completion, webhooks automate access provisioning, unlocking dynamic streaming pathways immediately.

```text
┌──────────────┐     Payment Completed      ┌───────────────┐
│              ├───────────────────────────►│               │
│ Standard UI/ │                            │    Paddle     │
│ Mobile User  │◄───────────────────────────┤    Billing    │
└──────┬───────┘      Provides secure       └───────┬───────┘
       │              Checkout Portal               │
       │                                            │ Triggers cryptographically
       │ Unlocks adaptive                           │ signed Webhook event
       │ secure player token                        ▼
┌──────▼───────┐                            ┌───────────────┐
│  Cloudflare  │   Secured state checks     │  Vercel Hook  │
│  LMS Video   │◄───────────────────────────┤   Listener    │
│  Streaming   │                            │ (api/v2/hook) │
└──────────────┘                            └───────┬───────┘
                                                    │ Updates database
                                                    │ profiles dynamically
                                                    ▼
                                            ┌───────────────┐
                                            │    MongoDB    │
                                            │ Database Pool │
                                            └───────────────┘
```

---

## SECTION 2: FILE SPECIFICATIONS & REUSABLE MODULES

All generated modules reside inside the `/taleem360-core-v2` path of our workspace:

### 1. `vercel.json` (Main Codebase Rewrite Adapter)
Deploy this adapter file inside your main legacy codebase root to establish the proxy bridge.
```json
{
  "rewrites": [
    { "source": "/api/v2/:path*", "destination": "https://taleem360-api-v2.vercel.app/api/v2/:path*" }
  ]
}
```

### 2. `models/Tenant.ts`
The polymorphic model file that decouples system configurations from a standard monolithic "school" template into highly distinct configurations.

### 3. `models/Subscription.ts`
Holds quotas, allowances, and billing histories tracked dynamically on the database level.

### 4. `api/v2/paddle/webhook.ts`
A complete Vercel serverless script written in TypeScript. It prevents memory forgery by capturing raw request strings, validates signatures, defends against timestamp-replay threats, and provisions access states across profiles.

---

## SECTION 3: LOCAL WORKSPACE DEVELOPMENT & INSTALLATION

Follow this guide to host, run, and test this architecture locally:

### 1. Prerequisites
- **Node.js**: v18 or v20+ recommended
- **Database**: Active MongoDB Connection URI (such as Atlas cloud clustering)
- **Tooling**: Package manager (`npm`) installed

### 2. Local Installation Steps
Create an isolated development directory locally and pull down the setup files:

```bash
# Initialize clean development path
mkdir taleem360-core-v2
cd taleem360-core-v2

# Scaffold package.json
npm init -y

# Install dependencies
npm install express mongoose dotenv
npm install --save-dev typescript @types/node @types/express tsx
```

### 3. Environment Configurations (`.env`)
Create a `.env` file in the root of your newly created repository:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<dbusername>:<dbpassword>@cluster0.abc.mongodb.net/taleem360_v2?retryWrites=true&w=majority
PADDLE_WEBHOOK_SECRET=pwh_your_cryptographic_verification_key_here
```

---

## SECTION 4: LOCAL DESKTOP TESTING & SIG-VALIDATION RECIPE

To test signature validations locally without launching live Paddle checkout subscriptions, use this Node.js testing script to formulate correct cryptographic `Paddle-Signature` header hashes.

### 1. Create a Signature Mocking Script (`generateMockWebhook.js`)
Create this file locally to output genuine cryptographic hashes matching your testing payload:

```javascript
import crypto from 'crypto';

// Use same simulated webhook secret as defined in your local .env configuration module
const WEBHOOK_SECRET = "pwh_your_cryptographic_verification_key_here";

// Exact Webhook JSON Payload to simulate
const rawPayload = JSON.stringify({
  event_id: "evt_01h67f89abcde1234567890fgh",
  event_type: "subscription.created",
  occurred_at: new Date().toISOString(),
  data: {
    id: "sub_mock_123456",
    customer_id: "ctm_mock_78910",
    status: "active",
    custom_data: {
      tenant_id: "usr_partner_001",
      tier_level: "growth",
      user_id: "usr_tutor_999"
    },
    billing_cycle: { interval: "month", frequency: 1 },
    recurring_transaction_details: {
      currency_code: "USD",
      totals: { subtotal: "5900" } // equivalent to $59.00
    }
  }
});

const timestamp = Math.floor(Date.now() / 1000);
const hmacSource = `${timestamp}:${rawPayload}`;

// Generate SHA256 HMAC
const calculatedHmac = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(hmacSource)
  .digest('hex');

const mockSignatureHeader = `ts=${timestamp};h1=${calculatedHmac}`;

console.log("----- LOCAL WEBHOOK SIMULATION DETAILS -----");
console.log("HTTP HEADER:");
console.log(`Paddle-Signature: ${mockSignatureHeader}`);
console.log("\nRAW PAYLOAD BODY:");
console.log(rawPayload);
console.log("--------------------------------------------");
```

### 2. Run Simulated Local Integrations
1. Fire up your mock signature application:
   ```bash
   node generateMockWebhook.js
   ```
2. Copy the resulting `Paddle-Signature` line.
3. Open Postman or run a terminal `cURL` test pointing locally:

```bash
curl -X POST http://localhost:3000/api/v2/paddle/webhook \
  -H "Content-Type: application/json" \
  -H "Paddle-Signature: ts=1718698000;h1=generated_hex_string_here" \
  -d '{"event_type": "subscription.created", "data": { ... }}'
```

---

## SECTION 5: ZERO-DOWNTIME ROLLOUT PROTOCOL

To release these changes to your user base without any operational interruptions, follow these structured steps:

1. **Step 1: Database Coexistence**
   Deploy the new Mongo database structure while leaving the traditional PostgreSQL databases completely operational. They will run in parallel, and user operations will proceed identically.

2. **Step 2: Deploy New Backend Microservice**
   Host your `taleem360-core-v2` project on Vercel as an independent platform application, fully configured with separate secure API secrets (`PADDLE_WEBHOOK_SECRET`, `MONGODB_URI`).

3. **Step 3: Point Webhooks**
   In the active Paddle Developer Dashboard, register a new Webhook destination pointing directly to your new endpoint:
   `https://taleem360-api-v2.vercel.app/api/v2/paddle/webhook`.

4. **Step 4: Enable Edge Rewrites**
   Upstream your root `vercel.json` modifications into the main live repository. Future user requests hitting `/api/v2/*` on the primary portal are routed smoothly to the secondary platform, establishing a clean, modular, and safe Strangler Fig deployment!
