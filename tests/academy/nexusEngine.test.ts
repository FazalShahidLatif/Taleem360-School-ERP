// tests/academy/nexusEngine.test.ts
import request from 'supertest';
import express from 'express';
import nexusRouter from '../../routes/academy/nexusRoutes';

const app = express();
app.use(express.json());
app.use(nexusRouter);

describe('🟢 Taleem360 Isolated Nexus Web3 Quiz & Payout Ledger Engine Tests', () => {
  const testWallet = '0xTestWalletAddress1234567890abcdef123';

  describe('Questions Retrieval (GET /api/public/nexus/questions)', () => {
    it('✅ Should fetch public indexed quiz block entries', async () => {
      const response = await request(app)
        .get('/api/public/nexus/questions');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.questions)).toBe(true);
      expect(response.body.questions.length).toBeGreaterThan(0);
    });
  });

  describe('Session Initialization (POST /api/nexus/session)', () => {
    it('✅ Should establish a new play session for a valid wallet address', async () => {
      const response = await request(app)
        .post('/api/nexus/session')
        .send({ wallet_address: testWallet });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.session).toBeDefined();
      expect(response.body.session.wallet_address).toBe(testWallet);
    });

    it('❌ Should reject session requests missing a wallet address parameter', async () => {
      const response = await request(app)
        .post('/api/nexus/session')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('Reward Allocation & Limit Enforcement (POST /api/nexus/reward)', () => {
    it('✅ Should log reward and generate a verified blockchain receipt', async () => {
      const response = await request(app)
        .post('/api/nexus/reward')
        .send({
          wallet_address: testWallet,
          qa_id: 'qa-1-uuid',
          token_amount: 1.25
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.payout).toBeDefined();
      expect(response.body.payout.token_amount).toBe(1.25);
      expect(response.body.payout.blockchain_hash).toMatch(/^0x/);
    });

    it('❌ Should block payout transactions missing core allocation parameters', async () => {
      const response = await request(app)
        .post('/api/nexus/reward')
        .send({ wallet_address: testWallet });

      expect(response.status).toBe(400);
    });
  });

  describe('User-Generated Q&A Ingestion (POST /api/nexus/submit-question)', () => {
    it('✅ Should ingest custom Q&As and generate compliant long-tail SEO URL slugs', async () => {
      const questionPayload = {
        user_interest_topic: 'ZK rollups',
        question_text: 'What scalability element do ZK rollups batch off-chain?',
        question_type: 'multiple_choice',
        correct_answer: 'Transaction execution data states',
        json_options: ['CPU cycles', 'Physical memory registers', 'Transaction execution data states']
      };

      const response = await request(app)
        .post('/api/nexus/submit-question')
        .send(questionPayload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.question).toBeDefined();
      expect(response.body.question.seo_slug).toContain('zk-rollups');
    });

    it('❌ Should reject custom Q&As missing core topics or text blocks', async () => {
      const response = await request(app)
        .post('/api/nexus/submit-question')
        .send({ user_interest_topic: 'Solidity Code' });

      expect(response.status).toBe(400);
    });
  });

  describe('Payout Ledger Tracking (GET /api/nexus/payouts)', () => {
    it('✅ Should fetch recent payout logs associated with specific wallets', async () => {
      const response = await request(app)
        .get(`/api/nexus/payouts?wallet_address=${encodeURIComponent(testWallet)}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.payouts)).toBe(true);
    });
  });
});
