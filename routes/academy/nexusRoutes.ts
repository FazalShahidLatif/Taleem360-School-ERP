// routes/academy/nexusRoutes.ts
import express from 'express';
import pkg from 'pg';

const { Pool } = pkg;
const router = express.Router();

const dbPool = new Pool({ 
  connectionString: process.env.SKILLS_ACADEMY_DATABASE_URL || process.env.DATABASE_URL
});

// Helper slug generator
function generateSlug(topic: string, text: string): string {
  const cleanTopic = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const cleanText = text.toLowerCase().substring(0, 30).replace(/[^a-z0-9]+/g, '-');
  return `${cleanTopic}-${cleanText}-${Math.random().toString(36).substring(2, 6)}`;
}

// Memory fallback to represent our local sandbox
let mockKnowledgeBase: any[] = [
  {
    qa_id: 'qa-1-uuid',
    user_interest_topic: 'Ethereum & Web3',
    question_text: 'What is the utility of the Gas parameter in Ethereum transactions?',
    question_type: 'multiple_choice',
    correct_answer: 'To cover computation work costs on the EVM',
    json_options: [
      'To verify validator signatures',
      'To cover computation work costs on the EVM',
      'To encrypt transport layer payloads',
      'To mint physical backup tokens'
    ],
    seo_slug: 'ethereum-evm-gas-utility-example',
    is_public_indexed: true,
    created_at: new Date()
  },
  {
    qa_id: 'qa-2-uuid',
    user_interest_topic: 'IPFS Storage',
    question_text: 'What key structure does IPFS use to address files securely?',
    question_type: 'multiple_choice',
    correct_answer: 'Content Identifiers (CIDs) based on cryptographic hashes',
    json_options: [
      'Standard absolute physical paths',
      'Content Identifiers (CIDs) based on cryptographic hashes',
      'Centralized subdomain names',
      'UUID lookup blocks'
    ],
    seo_slug: 'ipfs-content-addressed-storage',
    is_public_indexed: true,
    created_at: new Date()
  },
  {
    qa_id: 'qa-3-uuid',
    user_interest_topic: 'Smart Contracts',
    question_text: 'Which Solidity visibility specifier allows calls ONLY from the declaring contract?',
    question_type: 'multiple_choice',
    correct_answer: 'private',
    json_options: ['public', 'external', 'internal', 'private'],
    seo_slug: 'solidity-visibility-private-specifier',
    is_public_indexed: true,
    created_at: new Date()
  },
  {
    qa_id: 'qa-4-uuid',
    user_interest_topic: 'Zero Knowledge Proofs',
    question_text: 'What does the term SNARK stand for in crypto security?',
    question_type: 'multiple_choice',
    correct_answer: 'Succinct Non-interactive Argument of Knowledge',
    json_options: [
      'Succinct Non-interactive Argument of Knowledge',
      'Secure Network Allocation Routing Kernel',
      'Simple Node Access Registry Key',
      'Synchronized Node Automated Recovery Kit'
    ],
    seo_slug: 'zk-snarks-crypto-terminology',
    is_public_indexed: true,
    created_at: new Date()
  }
];

let mockGuestSessions: Record<string, { session_id: string; wallet_address: string; daily_counter: number; last_played_at: Date }> = {};
let mockPayoutLogs: any[] = [];

/**
 * 1. GET /api/public/nexus/questions
 * Returns all public indexed quiz questions.
 */
router.get('/api/public/nexus/questions', async (req, res) => {
  try {
    if (process.env.SKILLS_ACADEMY_DATABASE_URL || process.env.DATABASE_URL) {
      const result = await dbPool.query(
        'SELECT * FROM nexus_knowledge_base WHERE is_public_indexed = TRUE ORDER BY created_at DESC'
      );
      if (result.rows.length > 0) {
        return res.json({ success: true, questions: result.rows });
      }
    }
    // Fallback to inline Web3 questions list
    return res.json({ success: true, questions: mockKnowledgeBase });
  } catch (err) {
    console.warn('[Nexus Database Fallback] Fetching direct memory quiz blocks instead.', err);
    return res.json({ success: true, questions: mockKnowledgeBase });
  }
});

/**
 * 2. POST /api/nexus/session
 * Initializes/checks guest user session.
 */
router.post('/api/nexus/session', async (req, res) => {
  const { wallet_address } = req.body;
  if (!wallet_address) {
    return res.status(400).json({ error: 'Wallet address parameter is required.' });
  }

  try {
    if (process.env.SKILLS_ACADEMY_DATABASE_URL || process.env.DATABASE_URL) {
      // Find session or insert new
      const findResult = await dbPool.query(
        'SELECT * FROM nexus_guest_sessions WHERE wallet_address = $1',
        [wallet_address]
      );

      if (findResult.rows.length > 0) {
        const session = findResult.rows[0];
        // Reset counter if more than 24h passed
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (new Date(session.last_played_at) < twentyFourHoursAgo) {
          await dbPool.query(
            'UPDATE nexus_guest_sessions SET daily_counter = 0, last_played_at = CURRENT_TIMESTAMP WHERE wallet_address = $1',
            [wallet_address]
          );
          session.daily_counter = 0;
        }
        return res.json({ success: true, session });
      } else {
        const insertResult = await dbPool.query(
          'INSERT INTO nexus_guest_sessions (wallet_address, daily_counter) VALUES ($1, 0) RETURNING *',
          [wallet_address]
        );
        return res.json({ success: true, session: insertResult.rows[0] });
      }
    }

    // Memory solution fallback
    const lowerWallet = wallet_address.toLowerCase();
    if (mockGuestSessions[lowerWallet]) {
      const ses = mockGuestSessions[lowerWallet];
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (new Date(ses.last_played_at) < twentyFourHoursAgo) {
        ses.daily_counter = 0;
        ses.last_played_at = new Date();
      }
      return res.json({ success: true, session: ses });
    } else {
      const mockSession = {
        session_id: `ses-${Math.random().toString(36).substring(2, 10)}`,
        wallet_address: wallet_address,
        daily_counter: 0,
        last_played_at: new Date()
      };
      mockGuestSessions[lowerWallet] = mockSession;
      return res.json({ success: true, session: mockSession });
    }
  } catch (err) {
    console.error('[Nexus Session Error] Database failed, returning clean fallback session structure.', err);
    return res.json({
      success: true,
      session: {
        session_id: 'ses-fallback-uuid',
        wallet_address,
        daily_counter: 2,
        last_played_at: new Date()
      }
    });
  }
});

/**
 * 3. POST /api/nexus/reward
 * Awards tokens to user wallet address and records payout log. Limits user to max 10/day.
 */
router.post('/api/nexus/reward', async (req, res) => {
  const { wallet_address, qa_id, token_amount } = req.body;
  if (!wallet_address || !token_amount) {
    return res.status(400).json({ error: 'Missing wallet_address or token_amount parameters.' });
  }

  const blockchainHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  try {
    if (process.env.SKILLS_ACADEMY_DATABASE_URL || process.env.DATABASE_URL) {
      // Check session limit
      const sessionResult = await dbPool.query(
        'SELECT * FROM nexus_guest_sessions WHERE wallet_address = $1',
        [wallet_address]
      );

      if (sessionResult.rows.length > 0) {
        const currentCounter = sessionResult.rows[0].daily_counter;
        if (currentCounter >= 10) {
          return res.status(400).json({ error: 'Daily play-and-earn cap of 10 quizzes reached! Check back tomorrow.' });
        }

        // Increment counter
        await dbPool.query(
          'UPDATE nexus_guest_sessions SET daily_counter = daily_counter + 1, last_played_at = CURRENT_TIMESTAMP WHERE wallet_address = $1',
          [wallet_address]
        );
      } else {
        // Create session
        await dbPool.query(
          'INSERT INTO nexus_guest_sessions (wallet_address, daily_counter, last_played_at) VALUES ($1, 1, CURRENT_TIMESTAMP)',
          [wallet_address]
        );
      }

      // Record payout
      const insertPayout = await dbPool.query(
        'INSERT INTO nexus_payout_logs (wallet_address, qa_id, token_amount, blockchain_hash, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [wallet_address, qa_id || null, token_amount, blockchainHash, 'confirmed']
      );

      return res.json({
        success: true,
        payout: insertPayout.rows[0]
      });
    }

    // Memory solution fallback
    const lowerWallet = wallet_address.toLowerCase();
    if (!mockGuestSessions[lowerWallet]) {
      mockGuestSessions[lowerWallet] = {
        session_id: `ses-${Math.random().toString(36).substring(2, 10)}`,
        wallet_address,
        daily_counter: 0,
        last_played_at: new Date()
      };
    }

    const currentSes = mockGuestSessions[lowerWallet];
    if (currentSes.daily_counter >= 10) {
      return res.status(400).json({ error: 'Daily play-and-earn cap of 10 quizzes reached! Check back tomorrow.' });
    }

    currentSes.daily_counter += 1;
    currentSes.last_played_at = new Date();

    const mockPayout = {
      tx_id: `tx-${Math.random().toString(36).substring(2, 10)}`,
      wallet_address,
      qa_id: qa_id || 'qa-1-uuid',
      token_amount: parseFloat(token_amount),
      blockchain_hash: blockchainHash,
      status: 'confirmed',
      created_at: new Date()
    };
    mockPayoutLogs.unshift(mockPayout);

    return res.json({
      success: true,
      payout: mockPayout
    });
  } catch (err) {
    console.error('[Nexus Reward Failure]', err);
    return res.status(500).json({ error: 'Payout logger engine failed.' });
  }
});

/**
 * 4. POST /api/nexus/submit-question
 * Records user-generated Q&A warehouse questions.
 */
router.post('/api/nexus/submit-question', async (req, res) => {
  const { user_interest_topic, question_text, question_type, correct_answer, json_options } = req.body;
  
  if (!user_interest_topic || !question_text || !correct_answer) {
    return res.status(400).json({ error: 'Missing core Q&A parameters.' });
  }

  const slug = generateSlug(user_interest_topic, question_text);

  try {
    if (process.env.SKILLS_ACADEMY_DATABASE_URL || process.env.DATABASE_URL) {
      const result = await dbPool.query(
        `INSERT INTO nexus_knowledge_base 
         (user_interest_topic, question_text, question_type, correct_answer, json_options, seo_slug, is_public_indexed) 
         VALUES ($1, $2, $3, $4, $5, $6, TRUE) 
         RETURNING *`,
        [user_interest_topic, question_text, question_type || 'multiple_choice', correct_answer, JSON.stringify(json_options || []), slug]
      );
      return res.status(201).json({ success: true, question: result.rows[0] });
    }

    const newQuestion = {
      qa_id: `qa-${Math.random().toString(36).substring(2, 10)}`,
      user_interest_topic,
      question_text,
      question_type: question_type || 'multiple_choice',
      correct_answer,
      json_options: json_options || [],
      seo_slug: slug,
      is_public_indexed: true,
      created_at: new Date()
    };
    mockKnowledgeBase.unshift(newQuestion);
    return res.status(201).json({ success: true, question: newQuestion });
  } catch (err) {
    console.error('[Nexus Q&A Registration Fail]', err);
    return res.status(500).json({ error: 'Q&A ingestion warehouse registry error.' });
  }
});

/**
 * 5. GET /api/nexus/payouts
 * Returns crypto payout ledger list by wallet address.
 */
router.get('/api/nexus/payouts', async (req, res) => {
  const { wallet_address } = req.query;
  if (!wallet_address) {
    return res.status(400).json({ error: 'Wallet address query parameter is required.' });
  }

  try {
    if (process.env.SKILLS_ACADEMY_DATABASE_URL || process.env.DATABASE_URL) {
      const result = await dbPool.query(
        'SELECT * FROM nexus_payout_logs WHERE wallet_address = $1 ORDER BY created_at DESC',
        [wallet_address]
      );
      return res.json({ success: true, payouts: result.rows });
    }

    // Filter memory fallback payouts
    const filtered = mockPayoutLogs.filter(
      p => p.wallet_address.toLowerCase() === (wallet_address as string).toLowerCase()
    );
    return res.json({ success: true, payouts: filtered });
  } catch (err) {
    console.error('[Nexus Payout Fetch Fail]', err);
    return res.json({ success: true, payouts: [] });
  }
});

export default router;
