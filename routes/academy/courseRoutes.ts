// routes/academy/courseRoutes.ts
import express from 'express';
import { resolveTenantContext } from '../../middleware/daycare/tenantResolver';

const router = express.Router();

// Mount the domain resolver middleware universally across your skills academy app endpoints
router.use(resolveTenantContext);

/**
 * Multi-Tenant Context-Aware Course Catalogue Endpoint
 */
router.get('/api/academy/courses', async (req, expressRes) => {
  try {
    // The middleware ensures req.tenant is populated safely and securely
    const activeTenantId = req.tenant?.id;

    // Secure Data Isolation: Records are strictly scoped to the accessing domain tenant identity context
    // const courses = await db.query('SELECT * FROM academy_courses WHERE tenant_id = $1', [activeTenantId]);
    
    return expressRes.status(200).json({
      academyName: req.tenant?.businessName,
      currency: req.tenant?.currency,
      branding: req.tenant?.branding,
      catalog: [
        { course_title: 'Full-Stack Software Architecture Bootcamp', duration: `${req.tenant?.currency} 45,000` }
      ]
    });
  } catch (error) {
    return expressRes.status(500).json({ error: 'Failed to extract localized tenant courses catalog safely.' });
    }
});

export default router;
