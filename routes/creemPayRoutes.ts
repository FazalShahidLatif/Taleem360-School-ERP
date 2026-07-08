import express from 'express';
import { creemPayAuthMiddleware } from '../middleware/creemPayAuth.ts';
import { initiatePayment, processRefund } from '../controllers/creemPayController.ts';

const router = express.Router();

/**
 * @route   POST /api/payment/initiate
 * @desc    Initiates a multi-tenant payment checkout session across ERP, Tutors, Academies, or Daycare via Creem.
 * @access  Secure (Guarded by Creem body validators and API schema handlers)
 */
router.post('/api/payment/initiate', creemPayAuthMiddleware as any, initiatePayment as any);

/**
 * @route   POST /api/payment/refund
 * @desc    Processes order reversals or payment disputes on behalf of parents/students.
 * @access  Secure (Guarded by Creem body validators and API schema handlers)
 */
router.post('/api/payment/refund', creemPayAuthMiddleware as any, processRefund as any);

export default router;
