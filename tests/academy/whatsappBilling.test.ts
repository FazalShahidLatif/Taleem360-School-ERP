// tests/academy/whatsappBilling.test.ts
import request from 'supertest';
import express from 'express';
import whatsappRouter from '../../routes/academy/whatsappWebhook';
import * as whatsappService from '../../services/notifications/whatsappBillingService';

const app = express();
app.use(express.json());
app.use(whatsappRouter);

jest.mock('../../services/notifications/whatsappBillingService');

describe('🟢 Taleem360 Isolated WhatsApp Notification & Webhook Engine Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Verification Verification (GET /api/academy/webhooks/whatsapp)', () => {
    it('✅ Should pass Meta verification checks cleanly if tokens match', async () => {
      const response = await request(app)
        .get('/api/academy/webhooks/whatsapp')
        .query({
          'hub.mode': 'subscribe',
          'hub.verify_token': 'taleem360_secure_token',
          'hub.challenge': 'CHALLENGE_ACCEPTED'
        });

      expect(response.status).toBe(200);
      expect(response.text).toBe('CHALLENGE_ACCEPTED');
    });

    it('❌ Should reject handshake requests with a 403 status if token is wrong', async () => {
      const response = await request(app)
        .get('/api/academy/webhooks/whatsapp')
        .query({
          'hub.mode': 'subscribe',
          'hub.verify_token': 'malicious_invalid_token',
          'hub.challenge': 'BLOCKED'
        });

      expect(response.status).toBe(403);
    });
  });

  describe('Real-time Event Reception (POST /api/academy/webhooks/whatsapp)', () => {
    it('✅ Should process delivery indicators smoothly and respond with a 200 status', async () => {
      const mockMetaPayload = {
        object: "whatsapp_business_account",
        entry: [{
          id: "WABA_ID",
          changes: [{
            value: {
              messaging_product: "whatsapp",
              metadata: { display_phone_number: "16505551111", phone_number_id: "123456" },
              statuses: [{
                id: "wamid.HBgLOTIzMDAxMjM0NTY3FQIAERgSRDMwQ", // Message SID
                status: "read", // Status update type
                timestamp: "1694600000",
                recipient_id: "923001234567"
              }]
            },
            field: "messages"
          }]
        }]
      };

      const response = await request(app)
        .post('/api/academy/webhooks/whatsapp')
        .send(mockMetaPayload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('✅ Should handle unexpected event structures gracefully without crashing execution threads', async () => {
      const response = await request(app)
        .post('/api/academy/webhooks/whatsapp')
        .send({ wrong_property: "malformed_data" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('Ignored non-status tracking payload entry.');
    });
  });
});
