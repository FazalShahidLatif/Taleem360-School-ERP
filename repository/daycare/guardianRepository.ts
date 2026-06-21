import pg from 'pg';
const { Pool } = pg;
import { addDaycareGuardian, getDaycareGuardians, verifyDaycarePIN } from '../../api/auth/db_store.js';

let dbPool: pg.Pool | null = null;
if (process.env.DAYCARE_DATABASE_URL) {
  try {
    dbPool = new Pool({
      connectionString: process.env.DAYCARE_DATABASE_URL
    });
  } catch (err) {
    console.error('[Guardian Repository] Failed to initialize Pool:', err);
  }
}

export interface DaycareGuardian {
  guardian_id?: string;
  daycare_child_id: string;
  guardian_name: string;
  relationship_to_child: string;
  cnic_or_passport?: string;
  secure_pin_hash: string;
  is_active: boolean;
  created_at?: string;
}

/**
 * Register a new authorized guardian for a daycare child, saving securely to both fallback store and active DB.
 */
export async function registerGuardian(guardian: DaycareGuardian): Promise<DaycareGuardian | null> {
  const { daycare_child_id, guardian_name, relationship_to_child, cnic_or_passport, secure_pin_hash, is_active } = guardian;

  const insertQuery = `
    INSERT INTO daycare_authorized_guardians (
      daycare_child_id,
      guardian_name,
      relationship_to_child,
      cnic_or_passport,
      secure_pin_hash,
      is_active
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  // Always write to local JSON state for frontend rendering fallbacks
  let localResult: DaycareGuardian | null = null;
  try {
    const freshRecord = {
      guardian_id: guardian.guardian_id || 'gdn-' + Math.random().toString(36).substring(2, 9),
      daycare_child_id,
      guardian_name,
      relationship_to_child,
      cnic_or_passport,
      secure_pin_hash,
      is_active: is_active ?? true,
      created_at: new Date().toISOString()
    };
    addDaycareGuardian(freshRecord);
    localResult = freshRecord;
    console.log(`[Local JSON Store] Registered guardian:`, freshRecord);
  } catch (localErr) {
    console.error(`[Guardian Repository] Failed to write local JSON storage:`, localErr);
  }

  if (dbPool) {
    try {
      const dbResponse = await dbPool.query(insertQuery, [
        daycare_child_id,
        guardian_name,
        relationship_to_child,
        cnic_or_passport || null,
        secure_pin_hash,
        is_active ?? true
      ]);
      console.log('[Database Sync Engine] Guardian registered successfully in Postgres.');
      return dbResponse.rows[0];
    } catch (dbErr) {
      console.error('[Database Query Fault] Failed to register guardian in PostgreSQL:', dbErr);
      return localResult;
    }
  }

  return localResult;
}

/**
 * Fetch authorized guardians for a specific child ID.
 */
export async function getGuardiansOfChild(childId: string): Promise<DaycareGuardian[]> {
  const selectQuery = `
    SELECT * FROM daycare_authorized_guardians
    WHERE daycare_child_id = $1 AND is_active = TRUE;
  `;

  let localFallback: DaycareGuardian[] = [];
  try {
    localFallback = getDaycareGuardians(childId) as DaycareGuardian[];
  } catch (err) {
    console.error('[Local Db Store Query Error] Could not query local guardians:', err);
  }

  if (dbPool) {
    try {
      const dbResponse = await dbPool.query(selectQuery, [childId]);
      return dbResponse.rows;
    } catch (dbErr) {
      console.error('[Database Query Fault] Failed to grab guardians from Postgres:', dbErr);
      return localFallback;
    }
  }

  return localFallback;
}

/**
 * Verify unique PIN at checkout entrance kiosk terminals.
 */
export async function verifyKioskPIN(pinHash: string): Promise<DaycareGuardian | null> {
  const selectQuery = `
    SELECT * FROM daycare_authorized_guardians
    WHERE secure_pin_hash = $1 AND is_active = TRUE;
  `;

  let localFallback: DaycareGuardian | null = null;
  try {
    const verified = verifyDaycarePIN(pinHash);
    localFallback = verified ? (verified as DaycareGuardian) : null;
  } catch (err) {
    console.error('[Local Db Store Query Error] Could not verify PIN locally:', err);
  }

  if (dbPool) {
    try {
      const dbResponse = await dbPool.query(selectQuery, [pinHash]);
      if (dbResponse.rows.length > 0) {
        return dbResponse.rows[0];
      }
      return null;
    } catch (dbErr) {
      console.error('[Database Query Fault] PIN verification query failed in Postgres:', dbErr);
      return localFallback;
    }
  }

  return localFallback;
}
