# Vercel Wildcard Subdomains Integration Guide (`*.taleem360.online`)

This document presents the recommendation, setup guidelines, and step-by-step production checklist to successfully deploy and activate wildcard subdomains (**`*.taleem360.online`**) on **Vercel** for Taleem360 Multi-Tenant ERP, Daycare, and Academy hubs.

---

## 1. Do We Recommend This? (Expert Assessment)
**Yes, we highly recommend the wildcard subdomain (`*.taleem360.online`) architecture on Vercel.**

### Key Advantages:
1. **True Multi-Tenancy**: Every school branch, daycare branch, or skills academy gets a professional, isolated subdomain link (e.g., `beaconhouse.taleem360.online`, `islamabad-daycare.taleem360.online`, `nexus-hub.taleem360.online`) without needing separate codebases or multiple manual Vercel deployments.
2. **Instant Provisioning**: When a user registers a new school, the database registers their desired subdomain mapping instantly. The user can visit their unique URL immediately; **no DNS updates are required** because the wildcard DNS is already active!
3. **SSO and Cookies Sharing**: It allows you to share user sessions and cross-subdomain cookies (using a cookie domain of `.taleem360.online`), enabling single-sign-on (SSO) between your different portals (Main Landing, Student Hub, Nexus, Daycare, and School ERPs).
4. **Vercel's Edge Redirect Network**: Vercel handles SSL/TLS certificates on-the-fly dynamically using Let's Encrypt for all resolving subdomains under the wildcard automatically.

---

## 2. Dynamic High-Performance Routing Model

Here is how the request flow is processed seamlessly from the browser down to the database:

```
                            [ User visits: beaconhouse.taleem360.online ]
                                                 │
                                                 ▼
                                     [ DNS Wildcard (* Record) ]
                                                 │
                                                 ▼
                                      [ Vercel Edge Router ]
                                                 │
                                                 ▼
                              [ Taleem360 Server / React Frontend ]
                                        /                  \
                                       /                    \
              [ Frontend Check: window.location ]    [ Backend Check: req.headers.host ]
                                     │                                │
                                     ▼                                ▼
                         Parse "beaconhouse" host            Query: academy_tenants
                                     │                        WHERE subdomain = 'beaconhouse'
                                     ▼                                │
                        Load Brand Accent Colors                      ▼
                           & Specific ERP Node               Return Isolated Records
```

---

## 3. Step-by-Step Vercel Configuration & Deployment Guide

To activate this, follow these three simple stages:

### Step 1: Configure Wildcards in your Vercel Project Dashboards
1. Navigate to your project on the **Vercel Dashboard** (https://vercel.com).
2. Go to **Settings** > **Domains**.
3. Under the "Add Domain" input, register:
   ```
   *.taleem360.online
   ```
4. Vercel will prompt you to set up your domain records.

---

### Step 2: Configure your Registrar DNS Records (Cloudflare, GoDaddy, Namecheap etc.)
Create the following records in your DNS manager to route all traffic to Vercel:

| Type | Name | Value / Target | TTL | Note |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (Apex) | `76.76.21.21` | Auto / 1 Hour | Points your main Apex domain to Vercel |
| **CNAME** | `www` | `cname.vercel-dns.com.` | Auto / 1 Hour | Redirects www traffic |
| **CNAME** | `*` (Wildcard) | `cname.vercel-dns.com.` | Auto / 1 Hour | **Re-routes all subdomains automatically** |

---

### Step 3: Frontend Hostname Context Parser (React SPA)
Our frontend checks the subdomain mapping on load and routes users dynamically. Add this helper file or component to resolve brand themes:

```typescript
// src/utils/subdomain.ts
export function getSubdomainContext() {
  if (typeof window === 'undefined') return null;
  const hostname = window.location.hostname;
  
  // Exclude root and standard apex routing
  if (
    hostname === 'taleem360.online' || 
    hostname === 'www.taleem360.online' || 
    hostname === 'localhost' || 
    hostname.endsWith('.gitbook.io') ||
    hostname.endsWith('.vercel.app')
  ) {
    return null; // Main ERP Root landing
  }
  
  // Extract first label: e.g. "beaconhouse.taleem360.online" -> "beaconhouse"
  const parts = hostname.split('.');
  if (parts.length >= 3) {
    return parts[0];
  }
  return null;
}
```

---

## 4. Architectural Summary

By implementing:
- Dynamic node middlewares to parse headers in the backend (`/middleware/daycare/tenantResolver.ts`).
- Standard React host checking in the frontend (`/pages/Login.tsx`).
- Solid single-page rewriting configuration inside `/vercel.json`.

**Taleem360 is 100% production-ready for global multi-tenant wildcards!**
