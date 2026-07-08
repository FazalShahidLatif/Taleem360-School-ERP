import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { creemPayService } from '../services/creemPayService.ts';
import { PRODUCT_CATALOG } from '../services/pricingService.ts';

// Extend Express Request type locally for clean integration support
export interface CreemPayRequest extends ExpressRequest {
  creemToken?: string;
  body: any;
  path: string;
  headers: any;
}

/**
 * Creem Pay Authorization & Pre-validation Middleware.
 * Validates requests payload parameters such as productId, billingCycle, currency, and referenceId.
 */
export async function creemPayAuthMiddleware(
  req: CreemPayRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Perform fundamental payload sanity checks based on target path
    if (req.path === '/initiate' || req.path === '/api/payment/initiate') {
      const { productId, billingCycle, currency, referenceId } = req.body;

      if (!productId || typeof productId !== 'string') {
        res.status(400).json({
          success: false,
          errorCode: 'INVALID_PRODUCT_ID',
          message: 'A valid productId string is required in the request body.'
        });
        return;
      }

      if (!PRODUCT_CATALOG[productId]) {
        res.status(400).json({
          success: false,
          errorCode: 'PRODUCT_NOT_FOUND',
          message: `The specified productId "${productId}" does not exist in the centralized product catalog.`
        });
        return;
      }

      if (billingCycle && !['monthly', 'yearly'].includes(billingCycle)) {
        res.status(400).json({
          success: false,
          errorCode: 'INVALID_BILLING_CYCLE',
          message: 'Billing cycle must be either "monthly" or "yearly".'
        });
        return;
      }

      if (currency && !['USD', 'AED', 'PKR'].includes(currency)) {
        res.status(400).json({
          success: false,
          errorCode: 'INVALID_CURRENCY',
          message: 'Currency must be one of the supported regional currencies: USD, AED, or PKR.'
        });
        return;
      }

      if (!referenceId || typeof referenceId !== 'string' || referenceId.trim().length === 0) {
        res.status(400).json({
          success: false,
          errorCode: 'INVALID_REFERENCE_ID',
          message: 'A unique reference ID string is required to map the ledger invoice.'
        });
        return;
      }
    } else if (req.path === '/refund' || req.path === '/api/payment/refund') {
      const { transaction_id, amount, currency, reason } = req.body;

      if (!transaction_id || typeof transaction_id !== 'string' || transaction_id.trim().length === 0) {
        res.status(400).json({
          success: false,
          errorCode: 'INVALID_TRANSACTION_ID',
          message: 'Transaction ID is required to initiate an order refund reversal.'
        });
        return;
      }

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        res.status(400).json({
          success: false,
          errorCode: 'INVALID_AMOUNT',
          message: 'A valid refund amount greater than zero is required.'
        });
        return;
      }

      if (!currency || typeof currency !== 'string' || currency.trim().length !== 3) {
        res.status(400).json({
          success: false,
          errorCode: 'INVALID_CURRENCY',
          message: 'A valid 3-letter currency code is required.'
        });
        return;
      }

      if (!reason || typeof reason !== 'string' || reason.trim().length < 5) {
        res.status(400).json({
          success: false,
          errorCode: 'INVALID_REASON',
          message: 'A detailed explanation (at least 5 characters) is required for dispute audits.'
        });
        return;
      }
    }

    next();
  } catch (err: any) {
    console.error('[Creem Pay Middleware] Failed to validate token/payload:', err.message);
    res.status(401).json({
      success: false,
      errorCode: 'UNAUTHORIZED_INTEGRATION_GATEWAY',
      message: 'Failed to authenticate secure credentials with the Creem Pay gateway servers.'
    });
  }
}
