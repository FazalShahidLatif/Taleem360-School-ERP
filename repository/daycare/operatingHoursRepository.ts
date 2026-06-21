import pg from 'pg';
const { Pool } = pg;
import { getOperatingHours, saveOperatingHours } from '../../api/auth/db_store.js';

let dbPool: pg.Pool | null = null;
if (process.env.DAYCARE_DATABASE_URL) {
  try {
    dbPool = new Pool({
      connectionString: process.env.DAYCARE_DATABASE_URL
    });
  } catch (err) {
    console.error('[Operating Hours Repository] Failed to initialize Pool:', err);
  }
}

export interface DaycareOperatingHours {
  config_id?: string;
  facility_id: string; // e.g. 'islamabad-g11', 'london-central'
  timezone_name: string; // e.g. 'Asia/Karachi'
  closing_time_utc: string; // e.g. '13:00:00'
  late_fee_per_minute: number; // e.g. 5.00
  created_at?: string;
}

/**
 * Configure or Update standard operating hours & late fee calculation matrices for a facility branch.
 */
export async function upsertOperatingHours(hours: DaycareOperatingHours): Promise<DaycareOperatingHours | null> {
  const { facility_id, timezone_name, closing_time_utc, late_fee_per_minute } = hours;

  const upsertQuery = `
    INSERT INTO daycare_operating_hours (
      facility_id,
      timezone_name,
      closing_time_utc,
      late_fee_per_minute
    )
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (facility_id)
    DO UPDATE SET
      timezone_name = EXCLUDED.timezone_name,
      closing_time_utc = EXCLUDED.closing_time_utc,
      late_fee_per_minute = EXCLUDED.late_fee_per_minute
    RETURNING *;
  `;

  // Standard fallback local JSON storage
  let localResult: DaycareOperatingHours | null = null;
  try {
    const updatedRecord = {
      config_id: hours.config_id || 'cfg-' + Math.random().toString(36).substring(2, 9),
      facility_id,
      timezone_name,
      closing_time_utc,
      late_fee_per_minute,
      created_at: new Date().toISOString()
    };
    saveOperatingHours(updatedRecord);
    localResult = updatedRecord;
    console.log(`[Local JSON Store] Updated operating hours configuration:`, updatedRecord);
  } catch (localErr) {
    console.error(`[Operating Hours Repository] Failed to update local JSON database:`, localErr);
  }

  if (dbPool) {
    try {
      const dbResponse = await dbPool.query(upsertQuery, [
        facility_id,
        timezone_name,
        closing_time_utc,
        late_fee_per_minute
      ]);
      console.log('[Database Sync Engine] Operating configuration synchronized successfully to Postgres.');
      return dbResponse.rows[0];
    } catch (dbErr) {
      console.error('[Database Query Fault] Failed to execute configuration update in Postgres:', dbErr);
      return localResult;
    }
  }

  return localResult;
}

/**
 * Retrieve operating configurations for a facility branch.
 */
export async function getFacilityOperatingHours(facilityId: string): Promise<DaycareOperatingHours | null> {
  const selectQuery = `
    SELECT * FROM daycare_operating_hours
    WHERE facility_id = $1;
  `;

  let localFallback: DaycareOperatingHours | null = null;
  try {
    const records = getOperatingHours(facilityId);
    localFallback = records ? (records as DaycareOperatingHours) : null;
  } catch (err) {
    console.error('[Local Db Store Query Error] Could not load operating rules locally:', err);
  }

  if (dbPool) {
    try {
      const dbResponse = await dbPool.query(selectQuery, [facilityId]);
      if (dbResponse.rows.length > 0) {
        return dbResponse.rows[0];
      }
      return null;
    } catch (dbErr) {
      console.error('[Database Query Fault] Failed to obtain operating rules from Postgres:', dbErr);
      return localFallback;
    }
  }

  return localFallback;
}
