import axios, { AxiosError } from 'axios';

/**
 * Creem Pay Core Product Categories supported on Taleem360.
 */
export type CreemPayModuleType = 'SchoolERP' | 'PrivateTutors' | 'SkillsAcademy' | 'DaycareHub';

export interface CreemPayInitiatePayload {
  amount: number;
  currency: string;
  moduleType: CreemPayModuleType;
  referenceId: string;
  productId: string;
  customer?: {
    email?: string;
    phone?: string;
    name?: string;
  };
  metadata?: Record<string, any>;
}

export interface CreemPayRefundPayload {
  transaction_id: string;
  amount: number;
  currency: string;
  reason: string;
}

class CreemPayService {
  private getApiKey(): string {
    const key = process.env.CREEM_API_KEY;
    if (!key) {
      throw new Error('CREEM_API_KEY environment variable is missing.');
    }
    return key;
  }

  private getApiUrl(): string {
    return process.env.CREEM_API_URL || 'https://api.creem.io/v1';
  }

  /**
   * Initiates a payment session with Creem
   */
  public async initiatePayment(payload: CreemPayInitiatePayload): Promise<any> {
    const apiUrl = this.getApiUrl();
    let apiKey: string;
    try {
      apiKey = this.getApiKey();
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Creem Pay Service] API key absent. Provisioning stable demo mock session...');
        return {
          id: 'mock_creem_checkout_session_' + Math.random().toString(36).substring(7),
          checkoutUrl: `https://taleem360.online/payment-callback?reference=${payload.referenceId}&status=success`,
          message: 'Demo Mock session generated because CREEM_API_KEY is not configured.'
        };
      }
      throw err;
    }

    const metadata = {
      platform: 'Taleem360',
      domain_context: 'https://taleem360.online',
      module: payload.moduleType,
      reference_id: payload.referenceId,
      productId: payload.productId,
      processed_at: new Date().toISOString(),
      ...(payload.metadata || {}),
    };

    const requestBody = {
      productId: payload.productId,
      customerEmail: payload.customer?.email || '',
      successUrl: `https://taleem360.online/payment-callback?reference=${payload.referenceId}&status=success`,
      cancelUrl: `https://taleem360.online/payment-callback?reference=${payload.referenceId}&status=cancelled`,
      metadata,
    };

    try {
      console.log(`[Creem Pay Service] Requesting Creem checkout session for ${payload.moduleType} (Ref: ${payload.referenceId}, Product: ${payload.productId})`);
      
      const response = await axios.post(
        `${apiUrl}/checkouts`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      const axiosErr = error as AxiosError;
      console.error('[Creem Pay Service] Creem payment initiation error:', axiosErr.response?.data || axiosErr.message);
      
      // Fallback to mock behavior for testing environments if requested or connection failed
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Creem Pay Service] API Connection failed. Falling back to stable demo mock session...');
        return {
          id: 'mock_creem_checkout_session_' + Math.random().toString(36).substring(7),
          checkoutUrl: `https://taleem360.online/payment-callback?reference=${payload.referenceId}&status=success`,
          message: 'Connection failed; stable mock session initiated.'
        };
      }
      throw error;
    }
  }

  /**
   * Performs an order reversal or payment refund dispute request
   */
  public async refundPayment(payload: CreemPayRefundPayload): Promise<any> {
    const apiUrl = this.getApiUrl();
    let apiKey: string;
    try {
      apiKey = this.getApiKey();
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Creem Pay Service] API key absent. Provisioning stable demo mock refund...');
        return {
          id: 'mock_creem_refund_' + Math.random().toString(36).substring(7),
          refunded: true,
          message: 'Demo Mock refund executed.'
        };
      }
      throw err;
    }

    const requestBody = {
      transactionId: payload.transaction_id,
      amount: payload.amount,
      currency: payload.currency,
      reason: payload.reason,
      refunded_at: new Date().toISOString(),
    };

    try {
      console.log(`[Creem Pay Service] Requesting payment refund for transaction: ${payload.transaction_id}`);
      
      const response = await axios.post(
        `${apiUrl}/refunds`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      const axiosErr = error as AxiosError;
      console.error('[Creem Pay Service] Creem refund processing error:', axiosErr.response?.data || axiosErr.message);
      
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Creem Pay Service] Connection failed. Falling back to stable mock refund...');
        return {
          id: 'mock_creem_refund_id_' + Math.random().toString(36).substring(7),
          refunded: true,
          message: 'Mock refund completed successfully.'
        };
      }
      throw error;
    }
  }
}

export const creemPayService = new CreemPayService();
