import { Request, Response } from 'express';
import crypto from 'crypto';
import TenantModel, { TenantPersona } from '../../../models/Tenant.js';
import SubscriptionModel, { SubscriptionTier, SubscriptionStatus } from '../../../models/Subscription.js';

/**
 * Configure Vercel serverless function to prevent automatic body parsing.
 * This is crucial for retrieving the exact, unaltered raw buffer body required
 * to securely perform HMAC-SHA256 signature verification.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Robust helper to match incoming string tier levels to SubscriptionTier Enum.
 */
function mapTierString(tierStr?: string): SubscriptionTier {
  switch (tierStr?.toUpperCase()) {
    case 'STARTER':
      return SubscriptionTier.STARTER;
    case 'GROWTH':
      return SubscriptionTier.GROWTH;
    case 'ENTERPRISE':
      return SubscriptionTier.ENTERPRISE;
    default:
      return SubscriptionTier.FREE;
  }
}

/**
 * Dynamic mapping of Tier to strict functional structural quotas.
 */
function getQuotasForTier(tier: SubscriptionTier) {
  switch (tier) {
    case SubscriptionTier.STARTER:
      return {
        maxStudents: 100,
        maxCampuses: 1,
        maxStorageBytes: 53687091200, // 50GB
        maxCourseCount: 10,
        videoAllowed: true,
      };
    case SubscriptionTier.GROWTH:
      return {
        maxStudents: 1000,
        maxCampuses: 3,
        maxStorageBytes: 536870912000, // 500GB
        maxCourseCount: 50,
        videoAllowed: true,
      };
    case SubscriptionTier.ENTERPRISE:
      return {
        maxStudents: 999999, // Practically Unlimited
        maxCampuses: 25,
        maxStorageBytes: 5368709120000, // 5TB
        maxCourseCount: 1000,
        videoAllowed: true,
      };
    default:
      return {
        maxStudents: 50,
        maxCampuses: 1,
        maxStorageBytes: 10737418240, // 10GB
        maxCourseCount: 3,
        videoAllowed: false,
      };
  }
}

/**
 * Helper to consolidate Stream chunks to retrieve the Raw Body string.
 */
async function getRawBody(req: any): Promise<string> {
  const chunks: Array<any> = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

/**
 * paddleWebhookProcessor
 * Secure serverless function to process incoming billing, lifecycle, and access provisions.
 */
export default async function paddleWebhookProcessor(req: Request, res: Response) {
  // 1. Enforce Webhook Method Safety
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const rawBody = await getRawBody(req);
    const signatureHeader = req.headers['paddle-signature'] as string;
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('[Webhooks Gateway CONFIG ERROR] Secret env is unconfigured.');
      return res.status(500).json({ error: 'Webhook integration secret not configured in env parameters' });
    }

    // 2. CRYPTOGRAPHIC INTEGRITY VERIFICATION (Paddle v2 Signature Header Validation)
    if (!signatureHeader) {
      return res.status(401).json({ error: 'Missing secure Paddle-Signature authorization header.' });
    }

    // Extract ts and h1 components from "ts=169000000;h1=hash" format
    const parts = signatureHeader.split(';');
    let tsStr = '';
    let hashStr = '';

    for (const part of parts) {
      const [key, value] = part.split('=');
      if (key === 'ts') tsStr = value;
      if (key === 'h1') hashStr = value;
    }

    if (!tsStr || !hashStr) {
      return res.status(400).json({ error: 'Malformed Paddle-Signature authorization format.' });
    }

    // Protection against Replay Threats (Timestamp drift must not exceed 5 minutes)
    const timestamp = parseInt(tsStr, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    const DRIFT_LIMIT_SECONDS = 300; // 5 minutes

    if (Math.abs(currentTime - timestamp) > DRIFT_LIMIT_SECONDS) {
      console.warn(`[REPLAY DETECTED] Drift time delta of ${currentTime - timestamp}s exceeded thresholds.`);
      return res.status(403).json({ error: 'Cryptographic security threshold: Timestamp drift validation failed.' });
    }

    // Compute expected HMAC hash over signature payload: "timestamp:rawBodyString"
    const hmacSource = `${tsStr}:${rawBody}`;
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const computedHash = hmac.update(hmacSource).digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(computedHash, 'utf-8'), Buffer.from(hashStr, 'utf-8'))) {
      console.error('[SECURE TAMPER CHECK] Calculated signature did not match.');
      return res.status(401).json({ error: 'Cryptographic verification failed: Signature mismatch.' });
    }

    // 3. SECURE PAYLOAD ANALYSIS
    const payload = JSON.parse(rawBody);
    const eventType = payload.event_type; // e.g. "subscription.created", "subscription.updated", "subscription.canceled"
    const subscriptionData = payload.data;

    console.log(`[PADDLE WEBHOOK] Authenticating secure webhook event type: ${eventType}`);

    // Skip events on unrelated billing objects
    if (!eventType || !eventType.startsWith('subscription.')) {
      return res.status(200).json({ status: 'ignored', reason: 'Unprocessed object entity type' });
    }

    // Custom Customer Metadata Payload mapping parameters from transaction custom_data
    const customData = subscriptionData.custom_data || {};
    const tenantId = customData.tenant_id;
    const tierLevelStr = customData.tier_level;
    const userId = customData.user_id;

    if (!tenantId) {
      console.warn(`[PAYLOAD EXCEPTION] Missing critical 'tenant_id' inside custom_data payload map:`, customData);
      return res.status(422).json({ error: "Unprocessable billing metadata: Missing 'tenant_id' inside custom_data" });
    }

    const mappedTier = mapTierString(tierLevelStr);
    const determinedQuotas = getQuotasForTier(mappedTier);

    // 4. TRANSACTION ENGINE STATE EVOLUTION
    const paddleSubId = subscriptionData.id;
    const paddleCustomerId = subscriptionData.customer_id;
    const pStatus = subscriptionData.status as SubscriptionStatus;
    const billingCycleVal = subscriptionData.billing_cycle?.interval === 'year' ? 'yearly' : 'monthly';
    
    // Parse times
    const trialEnds = subscriptionData.trial_period?.ends_at ? new Date(subscriptionData.trial_period.ends_at) : undefined;
    const trialStarts = subscriptionData.trial_period?.starts_at ? new Date(subscriptionData.trial_period.starts_at) : undefined;
    const nextBill = subscriptionData.next_billed_at ? new Date(subscriptionData.next_billed_at) : undefined;
    const cancelled = subscriptionData.canceled_at ? new Date(subscriptionData.canceled_at) : undefined;
    const paused = subscriptionData.paused_at ? new Date(subscriptionData.paused_at) : undefined;

    const baseAmount = parseFloat(subscriptionData.recurring_transaction_details?.totals?.subtotal || '0') / 100;

    switch (eventType) {
      case 'subscription.created':
      case 'subscription.updated': {
        // Build or upgrade subscription allocation rules
        const subscriptionRecord = await SubscriptionModel.findOneAndUpdate(
          { tenantId },
          {
            $set: {
              tenantId,
              paddleSubscriptionId: paddleSubId,
              paddleCustomerId,
              priceId: subscriptionData.items?.[0]?.price?.id || 'price_default',
              tier: mappedTier,
              status: pStatus,
              billingCycle: billingCycleVal,
              priceAmount: baseAmount,
              currency: subscriptionData.recurring_transaction_details?.currency_code || 'USD',
              quotas: determinedQuotas,
              trialStartsAt: trialStarts,
              trialEndsAt: trialEnds,
              nextBillAt: nextBill,
              cancelledAt: cancelled,
              pausedAt: paused,
            },
          },
          { upsert: true, new: true }
        );

        // Map lifecycle provisioning options to Parent Tenant document
        await TenantModel.findOneAndUpdate(
          { accountId: tenantId },
          {
            $set: {
              isActive: pStatus === SubscriptionStatus.ACTIVE || pStatus === SubscriptionStatus.TRIALING,
              'studentConsumerSettings.streamingQuotaLimitBytes': determinedQuotas.maxStorageBytes,
            },
            $push: {
              'metadata.billingEvents': {
                event: eventType,
                tier: mappedTier,
                status: pStatus,
                timestamp: new Date(),
              },
            },
          }
        );

        console.log(`[PROVISION SUCCESS] Tenant ID '${tenantId}' mapped with Sub ID '${paddleSubId}' set active status.`);
        break;
      }

      case 'subscription.canceled': {
        // Graceful access limitations
        await SubscriptionModel.findOneAndUpdate(
          { tenantId },
          {
            $set: {
              status: SubscriptionStatus.CANCELLED,
              cancelledAt: cancelled || new Date(),
            },
          }
        );

        // Demote Tenant operational authorizations
        await TenantModel.findOneAndUpdate(
          { accountId: tenantId },
          {
            $set: {
              isActive: false, // Cancel immediately or track grace (handled at application validation check)
            },
            $push: {
              'metadata.billingEvents': {
                event: eventType,
                status: SubscriptionStatus.CANCELLED,
                timestamp: new Date(),
              },
            },
          }
        );

        console.log(`[REVOCATION SUCCESS] Sub ID ${paddleSubId} marked Cancelled. Access downgraded for Tenant: ${tenantId}`);
        break;
      }

      default:
        console.log(`[PADDLE WEBHOOK IGNORED] Unprocessed specific transaction state cycle: ${eventType}`);
    }

    // Respond with state compliance 200 OK
    return res.status(200).json({
      status: 'processed',
      event: eventType,
      processedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error(`[CRITICAL EXCEPTION WEBHOOK ROUTE]:`, error);
    return res.status(500).json({
      error: 'CRITICAL SECURE WEBHOOK ENGINE EXCEPTION',
      message: error.message,
    });
  }
}
