// middleware/daycare/tenantResolver.ts
import { Request, Response, NextFunction } from 'express';
import pkg from 'pg';
const { Pool } = pkg;

let dbPool: pkg.Pool | null = null;
if (process.env.SKILLS_ACADEMY_DATABASE_URL) {
  try {
    dbPool = new Pool({
      connectionString: process.env.SKILLS_ACADEMY_DATABASE_URL
    });
  } catch (err) {
    console.error('[Multi-Tenant] Database Pool initialization failed:', err);
  }
}

// Extend the Express Request interface typescript type definitions safely
declare global {
  namespace Express {
    interface Request {
      tenant?: {
        id: string;
        businessName: string;
        currency: string;
        branding: any;
      };
    }
  }
}

/**
 * High-performance, edge-ready middleware that extracts the white-label tenant context
 * from the request hostname completely dynamically without hardcoding subdomains.
 */
export async function resolveTenantContext(req: Request, res: Response, next: NextFunction) {
  const hostname = req.headers.host || ''; // Captures 'vertex-tech.taleem360.online' or '://londoncoding.com'
  const sanitizedHost = hostname.toLowerCase().trim();

  // High-fidelity fallback tenant for local dev, demo environments, or empty database states
  const fallbackTenant = {
    id: 'default-tenant-uuid',
    businessName: 'Taleem360 Skills Academy',
    currency: 'PKR',
    branding: {
      theme: 'ocean',
      primary_color: '#3b82f6',
      logo_url: '/logo.png',
      custom_domain: sanitizedHost || 'localhost'
    }
  };

  if (!dbPool) {
    // Graceful offline fallback when no database connection pool is initialized
    req.tenant = fallbackTenant;
    return next();
  }

  try {
    // High-speed index query looking up the mapped domain or default subdomain matching properties
    const tenantQuery = `
      SELECT tenant_id, business_name, base_currency, custom_branding_json 
      FROM academy_tenants 
      WHERE subdomain_mapping = $1 OR custom_branding_json->>'custom_domain' = $1 
      LIMIT 1;
    `;
    
    // In production, wrap this specific db pool hit inside a high-utility Cloudflare KV or Redis cache layer!
    const result = await dbPool.query(tenantQuery, [sanitizedHost]);

    if (result.rows.length === 0) {
      // If db resolves but subdomain is not pre-registered, fall back to our high-fidelity default tenant 
      // instead of hard-failing with a 404 so that the live preview is always responsive.
      req.tenant = fallbackTenant;
      return next();
    }

    const tenantRow = result.rows[0];

    // Inject the tenant profile payload parameter directly into the request loop thread context
    req.tenant = {
      id: tenantRow.tenant_id,
      businessName: tenantRow.business_name,
      currency: tenantRow.base_currency,
      branding: tenantRow.custom_branding_json
    };

    return next(); // Pass verification checks cleanly over to your controllers
  } catch (error) {
    // Log the error for diagnostic tracking
    console.warn(`[Multi-Tenant Context Warning] Database query failed (e.g. offline, connection refused, or relation table missing). Resolving with mock tenant fallback safely:`, (error as Error).message);
    
    // Fall back gracefully to keep the application 100% online
    req.tenant = fallbackTenant;
    return next();
  }
}
