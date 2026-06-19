// routes/academy/submissionRoutes.ts
import express from 'express';
import { resolveTenantContext } from '../../middleware/daycare/tenantResolver';
import { 
  submitAssignment, 
  getSubmissionEvaluation, 
  getSubmissionHistory 
} from '../../controllers/academy/submissionController';

const router = express.Router();

// Mount the domain resolver middleware universally across your skills academy app endpoints
router.use(resolveTenantContext);

/**
 * Endpoint to submit a student assignment and trigger the AI evaluation engine
 * POST /api/academy/submissions
 */
router.post('/api/academy/submissions', submitAssignment);

/**
 * Endpoint to secure details and AI feedback of a specific submission evaluation
 * GET /api/academy/submissions/:submission_id
 */
router.get('/api/academy/submissions/:submission_id', getSubmissionEvaluation);

/**
 * Endpoint to list all submission evaluations for a given enrollment identity
 * GET /api/academy/submissions
 */
router.get('/api/academy/submissions', getSubmissionHistory);

export default router;
