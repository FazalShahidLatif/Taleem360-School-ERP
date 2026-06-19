// routes/academy/bookingRoutes.ts
import express from 'express';
import { resolveTenantContext } from '../../middleware/daycare/tenantResolver';
import { processPrivateSessionBooking } from '../../controllers/tutors/bookingController';

const router = express.Router();

// Mount the domain resolver middleware universally across your skills academy app endpoints
router.use(resolveTenantContext);

/**
 * Endpoint to securely allocate a private tutoring session slot
 * POST /api/academy/tutors/bookings
 */
router.post('/api/academy/tutors/bookings', processPrivateSessionBooking);

export default router;
