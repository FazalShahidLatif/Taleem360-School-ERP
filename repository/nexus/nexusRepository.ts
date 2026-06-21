import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;
const NEXUS_DB_PATH = path.join(process.cwd(), 'nexus_db.json');

export interface NexusGuestSession {
  session_id?: string;
  wallet_address: string;
  daily_counter: number;
  last_played_at?: string;
}

export interface NexusKnowledgeBase {
  qa_id?: string;
  user_interest_topic: string;
  question_text: string;
  question_type: string;
  correct_answer: string;
  json_options?: any;
  seo_slug?: string;
  is_public_indexed: boolean;
  created_at?: string;
}

export interface NexusPayoutLog {
  tx_id?: string;
  wallet_address: string;
  qa_id: string;
  token_amount: number;
  blockchain_hash?: string;
  status?: 'pending' | 'confirmed' | 'failed';
  created_at?: string;
}

interface LocalNexusDB {
  sessions: NexusGuestSession[];
  questions: NexusKnowledgeBase[];
  payouts: NexusPayoutLog[];
}

let localDb: LocalNexusDB = {
  sessions: [],
  questions: [],
  payouts: []
};

function loadLocalDb() {
  try {
    if (fs.existsSync(NEXUS_DB_PATH)) {
      const data = fs.readFileSync(NEXUS_DB_PATH, 'utf-8');
      localDb = JSON.parse(data);
    } else {
      saveLocalDb();
    }
  } catch (err) {
    console.error('[Nexus Repository Fallback error]: ', err);
  }
}

function saveLocalDb() {
  try {
    fs.writeFileSync(NEXUS_DB_PATH, JSON.stringify(localDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Nexus Repository Save Error]: ', err);
  }
}

loadLocalDb();

// Postgres Pool Connection Lifecycle
let dbPool: pg.Pool | null = null;
if (process.env.NEXUS_DATABASE_URL) {
  try {
    dbPool = new Pool({
      connectionString: process.env.NEXUS_DATABASE_URL
    });
  } catch (err) {
    console.error('[Nexus Repository] Failed to create postgres Pool connection:', err);
  }
}

/**
 * ----------------------------------------------------
 * Guest Sessions & Crypto-faucet Anti-Abuse Gas Throttles
 * ----------------------------------------------------
 */
export async function getOrCreateGuestSession(walletAddress: string): Promise<NexusGuestSession> {
  const normalizedAddress = walletAddress.trim().toLowerCase();
  
  let foundSession = localDb.sessions.find(s => s.wallet_address.toLowerCase() === normalizedAddress);
  if (!foundSession) {
    foundSession = {
      session_id: 'ses-' + Math.random().toString(36).substring(2, 9),
      wallet_address: normalizedAddress,
      daily_counter: 0,
      last_played_at: new Date().toISOString()
    };
    localDb.sessions.push(foundSession);
    saveLocalDb();
  }

  if (dbPool) {
    const query = `
      INSERT INTO nexus_guest_sessions (wallet_address, daily_counter, last_played_at)
      VALUES ($1, 0, CURRENT_TIMESTAMP)
      ON CONFLICT (wallet_address)
      DO UPDATE SET wallet_address = EXCLUDED.wallet_address
      RETURNING *;
    `;
    try {
      const res = await dbPool.query(query, [normalizedAddress]);
      return res.rows[0];
    } catch (err) {
      console.error('[Database Query Fault] Failed creating guest session in postgres:', err);
    }
  }

  return foundSession;
}

export async function incrementQuizCounter(walletAddress: string): Promise<boolean> {
  const normalizedAddress = walletAddress.trim().toLowerCase();
  const sessionIndex = localDb.sessions.findIndex(s => s.wallet_address.toLowerCase() === normalizedAddress);
  if (sessionIndex !== -1) {
    localDb.sessions[sessionIndex].daily_counter += 1;
    localDb.sessions[sessionIndex].last_played_at = new Date().toISOString();
    saveLocalDb();
  }

  if (dbPool) {
    const query = `
      UPDATE nexus_guest_sessions
      SET daily_counter = daily_counter + 1, last_played_at = CURRENT_TIMESTAMP
      WHERE LOWER(wallet_address) = $1;
    `;
    try {
      await dbPool.query(query, [normalizedAddress]);
      return true;
    } catch (err) {
      console.error('[Database Query Fault] Failed incrementing quiz limit counter:', err);
    }
  }
  return true;
}

/**
 * ----------------------------------------------------
 * High-performance SEO indexing and Knowledge Base Q&A
 * ----------------------------------------------------
 */
export async function saveQuestionToKnowledgeBase(qa: NexusKnowledgeBase): Promise<NexusKnowledgeBase> {
  const qaId = qa.qa_id || 'qa-' + Math.random().toString(36).substring(2, 9);
  const newQa: NexusKnowledgeBase = {
    ...qa,
    qa_id: qaId,
    seo_slug: qa.seo_slug || qa.user_interest_topic.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6),
    created_at: new Date().toISOString()
  };

  localDb.questions.push(newQa);
  saveLocalDb();

  if (dbPool) {
    const query = `
      INSERT INTO nexus_knowledge_base (qa_id, user_interest_topic, question_text, question_type, correct_answer, json_options, seo_slug, is_public_indexed)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    try {
      const res = await dbPool.query(query, [
        qaId,
        newQa.user_interest_topic,
        newQa.question_text,
        newQa.question_type,
        newQa.correct_answer,
        newQa.json_options ? JSON.stringify(newQa.json_options) : null,
        newQa.seo_slug,
        newQa.is_public_indexed
      ]);
      return res.rows[0];
    } catch (err) {
      console.error('[Database Query Fault] Failed saving QA to Postgres database:', err);
    }
  }
  return newQa;
}

/**
 * ----------------------------------------------------
 * Cryptographic payout tracing
 * ----------------------------------------------------
 */
export async function logCryptoPayout(payout: NexusPayoutLog): Promise<NexusPayoutLog> {
  const txId = payout.tx_id || 'txl-' + Math.random().toString(36).substring(2, 9);
  const newPayout: NexusPayoutLog = {
    ...payout,
    tx_id: txId,
    status: payout.status || 'pending',
    created_at: new Date().toISOString()
  };

  localDb.payouts.push(newPayout);
  saveLocalDb();

  if (dbPool) {
    const query = `
      INSERT INTO nexus_payout_logs (tx_id, wallet_address, qa_id, token_amount, blockchain_hash, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    try {
      const res = await dbPool.query(query, [
        txId,
        newPayout.wallet_address,
        newPayout.qa_id,
        newPayout.token_amount,
        newPayout.blockchain_hash || null,
        newPayout.status
      ]);
      return res.rows[0];
    } catch (err) {
      console.error('[Database Query Fault] Payout transaction ledger sync failed:', err);
    }
  }
  return newPayout;
}
