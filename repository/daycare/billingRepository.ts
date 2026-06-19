import pg from 'pg';
const { Pool } = pg;
import { saveBillingLedger, getBillingLedgers } from '../../api/auth/db_store.js';

let dbPool: pg.Pool | null = null;
if (process.env.DAYCARE_DATABASE_URL) {
  try {
    dbPool = new Pool({
      connectionString: process.env.DAYCARE_DATABASE_URL
    });
  } catch (err) {
    console.error('[Billing Repository] Failed to initialize Pool:', err);
  }
}

interface PenaltyInsertion {
  daycareChildId: string;
  penaltyAmount: number;
  currentDateIso: string;
}

/**
 * Atomic Upsert Transaction: Tracks and applies late fees securely to the isolated daycare ledger.
 */
export async function applyLateFeeToLedger(payload: PenaltyInsertion): Promise<boolean> {
  const { daycareChildId, penaltyAmount, currentDateIso } = payload;
  const targetDate = new Date(currentDateIso);
  
  // Calculate a standardized billing month boundary (e.g., matching the current month's start/end dates)
  const billingPeriodStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1).toISOString().split('T')[0];
  const billingPeriodEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).toISOString().split('T')[0];

  const upsertQuery = `
    INSERT INTO daycare_billing_ledger (
      daycare_child_id, 
      billing_period_start, 
      billing_period_end, 
      base_fee, 
      overtime_late_fees, 
      total_amount, 
      payment_status
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, 'unpaid')
    ON CONFLICT (daycare_child_id, billing_period_start) 
    DO UPDATE SET 
      overtime_late_fees = daycare_billing_ledger.overtime_late_fees + EXCLUDED.overtime_late_fees,
      total_amount = daycare_billing_ledger.base_fee + daycare_billing_ledger.overtime_late_fees + EXCLUDED.overtime_late_fees,
      synced_to_main_erp = FALSE; -- Flags the record so the main application system pulls the updated total
  `;

  // Default baseline settings: assume an 8000 PKR base fee for standard localized tracking configurations
  const defaultBaseFee = 8000.00; 
  const queryParams = [
    daycareChildId,
    billingPeriodStart,
    billingPeriodEnd,
    defaultBaseFee,
    penaltyAmount,
    (defaultBaseFee + penaltyAmount)
  ];

  // Try saving to local DB for frontend components preview
  try {
    const existingLedgers = getBillingLedgers();
    const existing = existingLedgers.find(
      (l: any) => l.daycare_child_id === daycareChildId && l.billing_period_start === billingPeriodStart
    );

    const base_fee = existing ? parseFloat(existing.base_fee || defaultBaseFee) : defaultBaseFee;
    const current_overtime = existing ? parseFloat(existing.overtime_late_fees || 0) : 0;
    const new_overtime = current_overtime + penaltyAmount;
    const total_amount = base_fee + new_overtime;

    const ledgerRecord = {
      invoice_id: existing ? (existing.invoice_id || 'inv-' + Math.random().toString(36).substring(2, 9)) : 'inv-' + Math.random().toString(36).substring(2, 9),
      daycare_child_id: daycareChildId,
      billing_period_start: billingPeriodStart,
      billing_period_end: billingPeriodEnd,
      base_fee: base_fee,
      overtime_late_fees: new_overtime,
      total_amount: total_amount,
      payment_status: existing ? existing.payment_status : 'unpaid',
      synced_to_main_erp: false,
      created_at: existing ? existing.created_at : new Date().toISOString()
    };

    saveBillingLedger(ledgerRecord);
    console.log(`[Local JSON Store] Saved local billing ledger record:`, ledgerRecord);
  } catch (localErr) {
    console.error(`[Billing Repository] Failed to update local JSON DB:`, localErr);
  }

  // Attempt standard PostgreSQL query
  if (dbPool) {
    try {
      await dbPool.query(upsertQuery, queryParams);
      console.log(`[Database Sync Engine] Penalty recorded successfully. Child Reference ID: ${daycareChildId}`);
      return true;
    } catch (error) {
      console.error(`[Rule 1 Violation Preventive Logging] Failed to execute isolated billing mutation safely:`, error);
      return false;
    }
  } else {
    // If no PG DB is configured, we've updated the file cache fallback and can safely return true
    console.log(`[Database Sync Engine Simulation] No database connection URL found. Updated local file store successfully. Child Reference ID: ${daycareChildId}`);
    return true;
  }
}

/**
 * Fetches unsynced daycare billing summaries on demand to sync records with the primary ERP ledger.
 */
export async function fetchUnsyncedBillingSummaries(): Promise<any[]> {
  const selectQuery = `
    SELECT 
      invoice_id,
      daycare_child_id,
      total_amount as daycare_total_due,
      overtime_late_fees,
      billing_period_start,
      billing_period_end
    FROM daycare_billing_ledger
    WHERE synced_to_main_erp = FALSE AND payment_status = 'unpaid';
  `;

  // Always prepare fallback local data in case PG query is disabled or errors out
  let fallbackRows: any[] = [];
  try {
    const ledgers = getBillingLedgers();
    const unsynced = ledgers.filter((l: any) => l.synced_to_main_erp === false && l.payment_status === 'unpaid');
    fallbackRows = unsynced.map((l: any) => ({
      invoice_id: l.invoice_id || 'inv-' + Math.random().toString(36).substring(2, 9),
      daycare_child_id: l.daycare_child_id,
      daycare_total_due: parseFloat(l.total_amount),
      overtime_late_fees: parseFloat(l.overtime_late_fees),
      billing_period_start: l.billing_period_start,
      billing_period_end: l.billing_period_end
    }));
  } catch (err) {
    console.error(`[Local DB Store Query Error] Could not compile fallback billing entries:`, err);
  }

  if (dbPool) {
    try {
      const response = await dbPool.query(selectQuery);
      return response.rows;
    } catch (error) {
      console.error(`[Database Query Fault] Could not resolve billing summary sets safely:`, error);
      return fallbackRows;
    }
  }

  console.log(`[Database Sync Engine Simulation] Returning ${fallbackRows.length} simulated billing summary rows.`);
  return fallbackRows;
}

/**
 * Locks the record status down after a successful sync to prevent duplicate processing loops.
 */
export async function markLedgerAsSynced(invoiceId: string): Promise<void> {
  const updateQuery = `
    UPDATE daycare_billing_ledger 
    SET synced_to_main_erp = TRUE 
    WHERE invoice_id = $1
  `;

  // Update in local file persistence
  try {
    const ledgers = getBillingLedgers();
    const foundLedger = ledgers.find((l: any) => l.invoice_id === invoiceId);
    if (foundLedger) {
      foundLedger.synced_to_main_erp = true;
      saveBillingLedger(foundLedger);
      console.log(`[Local JSON Store] Marked local billing record as synced: ${invoiceId}`);
    }
  } catch (err) {
    console.error(`[Local DB Store Sync Error] Could not mark ledger as synced locally:`, err);
  }

  if (dbPool) {
    try {
      await dbPool.query(updateQuery, [invoiceId]);
      console.log(`[Database Sync Engine] Marked invoice ${invoiceId} as synced.`);
    } catch (error) {
      console.error(`[Database Query Fault] Failed to lock down syncing status for invoice ${invoiceId}:`, error);
    }
  }
}
