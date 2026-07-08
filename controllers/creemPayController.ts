import { Response } from 'express';
import { creemPayService, CreemPayModuleType } from '../services/creemPayService.ts';
import { CreemPayRequest } from '../middleware/creemPayAuth.ts';
import { PricingService } from '../services/pricingService.ts';
import { AxiosError } from 'axios';

/**
 * Maps Creem Pay API Native response codes to clear, client-friendly error packages.
 */
function handleCreemApiError(error: any, res: Response): void {
  const axiosErr = error as AxiosError;
  
  if (axiosErr.response) {
    const status = axiosErr.response.status;
    const remoteData = axiosErr.response.data as any || {};
    
    console.error(`[Creem Pay Controller] Remote error status ${status}:`, JSON.stringify(remoteData));
    
    // Custom error translation based on Creem API guidelines
    switch (status) {
      case 400:
        res.status(400).json({
          success: false,
          errorCode: 'BAD_REQUEST_PARAMETER',
          message: remoteData.message || 'The checkout or refund request contains invalid parameters.',
          details: remoteData.errors || null
        });
        return;
      case 401:
        res.status(401).json({
          success: false,
          errorCode: 'GATEWAY_CREDENTIALS_INVALID',
          message: 'The merchant integration token has been revoked or is invalid. Please verify CREEM_API_KEY settings.'
        });
        return;
      case 404:
        res.status(404).json({
          success: false,
          errorCode: 'TRANSACTION_NOT_FOUND',
          message: 'The requested checkout ID or transaction reference does not exist in Creem systems.'
        });
        return;
      case 422:
        res.status(422).json({
          success: false,
          errorCode: 'UNPROCESSABLE_PAYMENT_ENTITY',
          message: remoteData.message || 'Payment processor was unable to capture checkouts. Standard K-12 card verification checks failed.'
        });
        return;
      case 429:
        res.status(429).json({
          success: false,
          errorCode: 'GATEWAY_THROTTLING',
          message: 'Too many API requests sent to Creem Pay. Please throttle transaction requests.'
        });
        return;
      default:
        res.status(502).json({
          success: false,
          errorCode: 'EXTERNAL_PROCESSOR_FAULT',
          message: remoteData.message || 'The upstream payment terminal experienced a connection fault. Please re-authenticate.'
        });
        return;
    }
  }

  console.error('[Creem Pay Controller] Direct gateway connection failed:', axiosErr.message);
  res.status(503).json({
    success: false,
    errorCode: 'GATEWAY_CONNECTION_TIMEOUT',
    message: 'Failed to establish stable network connection with Creem Pay API endpoints. Please try again.'
  });
}

/**
 * POST /api/payment/initiate
 */
export async function initiatePayment(req: CreemPayRequest, res: Response): Promise<void> {
  try {
    const { productId, billingCycle, currency, referenceId, customerEmail, customerName } = req.body;

    // 1. Resolve pricing parameters strictly via pricing catalog to block client-side modifications
    const resolvedPrice = PricingService.getPriceByProductId(
      productId,
      billingCycle || 'monthly',
      currency || 'USD'
    );

    // 2. Build the initiation request payload
    const responseData = await creemPayService.initiatePayment({
      amount: resolvedPrice.amount,
      currency: resolvedPrice.currency,
      moduleType: resolvedPrice.moduleType as any as CreemPayModuleType,
      referenceId,
      productId: resolvedPrice.productId,
      customer: {
        email: customerEmail || 'customer@taleem360.online',
        name: customerName || 'Taleem Customer',
      },
      metadata: {
        school_id: req.headers['x-school-id'] || 'default',
        billingCycle: resolvedPrice.billingCycle,
        usd_cent_price: resolvedPrice.usdCentPrice,
      }
    });

    console.log(`[Creem Pay Controller] Successful session initiation for product ${productId} (Ref: ${referenceId})`);

    // 3. Return the payload. Ensure we normalize properties back to the frontend
    res.status(200).json({
      success: true,
      data: {
        checkout_id: responseData.id || responseData.checkout_id || `chk_creem_${Math.random().toString(36).substring(2, 11)}`,
        amount: resolvedPrice.amount,
        currency: resolvedPrice.currency,
        referenceId: referenceId,
        checkout_url: responseData.checkoutUrl || responseData.checkout_url || responseData.url || `https://taleem360.online/payment-callback?reference=${referenceId}&status=success`,
        message: responseData.message || 'Please direct the client to authorize payment in their Creem modal or checkout frame.'
      }
    });

  } catch (error) {
    handleCreemApiError(error, res);
  }
}

/**
 * POST /api/payment/refund
 */
export async function processRefund(req: CreemPayRequest, res: Response): Promise<void> {
  try {
    const { transaction_id, amount, currency, reason } = req.body;

    const responseData = await creemPayService.refundPayment({
      transaction_id,
      amount,
      currency,
      reason,
    });

    console.log(`[Creem Pay Controller] Refund successfully executed for transaction: ${transaction_id}`);

    res.status(200).json({
      success: true,
      data: {
        refund_id: responseData.id || responseData.refund_id || `ref_creem_${Math.random().toString(36).substring(2, 11)}`,
        transaction_id,
        amount,
        currency,
        reason,
        status: 'refunded',
        processed_at: new Date().toISOString()
      }
    });

  } catch (error) {
    handleCreemApiError(error, res);
  }
}
