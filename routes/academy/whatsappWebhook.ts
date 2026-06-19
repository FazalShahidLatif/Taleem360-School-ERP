// routes/academy/whatsappWebhook.ts
import express from 'express';
import pkg from 'pg';

const { Pool } = pkg;
const router = express.Router();
const dbPool = new Pool({ connectionString: process.env.SKILLS_ACADEMY_DATABASE_URL });

/**
 * 1. GET Verification Endpoint: Required by Meta to validate your webhook URL.
 * Enter a custom token string inside your Meta Developer Dashboard to match your .env configuration.
 */
router.get('/api/academy/webhooks/whatsapp', (req, res) => {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'taleem360_secure_token';
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[WhatsApp Webhook] Handshake verified successfully with Meta.');
    return res.status(200).send(challenge);
  }
  return res.status(403).json({ error: 'Webhook verification token mismatch.' });
});

/**
 * 2. POST Event Handler: Intercepts real-time message statuses (sent, delivered, read, failed).
 */
router.post('/api/academy/webhooks/whatsapp', async (req, res) => {
  const body = req.body;

  // Validate incoming structure safety parameters
  if (!body.object || !body.entry?.[0]?.changes?.[0]?.value?.statuses?.[0]) {
    return res.status(200).json({ status: 'Ignored non-status tracking payload entry.' });
  }

  const statusUpdate = body.entry[0].changes[0].value.statuses[0];
  const messageSid = statusUpdate.id;     // Matches your unique whatsapp_message_sid
  const currentStatus = statusUpdate.status; // 'sent', 'delivered', 'read', or 'failed'

  try {
    if (process.env.SKILLS_ACADEMY_DATABASE_URL) {
      // Atomically execute a write-through state query on your isolated log table
      const updateQuery = `
        UPDATE tutor_whatsapp_logs 
        SET delivery_status = $1 
        WHERE whatsapp_message_sid = $2;
      `;
      
      await dbPool.query(updateQuery, [currentStatus, messageSid]);
      console.log(`[WhatsApp Sync Engine] Tracker SID ${messageSid} updated status to: ${currentStatus}`);
    } else {
      console.log(`[WhatsApp Sandbox Engine] Local offline session: Tracker SID ${messageSid} status updated to: ${currentStatus}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[WhatsApp Webhook Fault] Background ledger write failed safely:', error);
    return res.status(200).json({ status: 'Logged internally but responded with 200 to satisfy Meta gateway rules.' });
  }
});

export default router;
