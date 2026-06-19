// controllers/academy/installmentWebhookController.ts
import { Request, Response } from 'express';
import pkg from 'pg';
const { Pool } = pkg;

const dbPool = new Pool({ connectionString: process.env.SKILLS_ACADEMY_DATABASE_URL });

export async function handlePaddleInstallmentWebhook(req: Request, res: Response) {
  // Extract custom parameters injected during the initial checkout generation
  const { event_type, data } = req.body || {};

  if (event_type !== 'transaction.completed') {
    return res.status(200).json({ status: 'Ignored non-transaction event safely' });
  }

  const { plan_id, installment_number } = data?.custom_data || {};

  if (!plan_id || !installment_number) {
    return res.status(200).json({ status: 'Ignored non-installment checkout data' });
  }

  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');

    // 1. Mark the individual ledger step as paid
    const updateLedgerQuery = `
      UPDATE academy_installment_ledgers 
      SET payment_status = 'paid', paid_at = CURRENT_TIMESTAMP, paddle_invoice_id = $1
      WHERE plan_id = $2 AND installment_number = $3
      RETURNING plan_id;
    `;
    await client.query(updateLedgerQuery, [data.id, plan_id, installment_number]);

    // 2. Increment the total installments paid on the master scheduling plan
    const updatePlanQuery = `
      UPDATE academy_installment_plans 
      SET installments_paid = installments_paid + 1,
          next_billing_date = CURRENT_DATE + INTERVAL '1 month',
          status = CASE WHEN installments_paid + 1 >= total_installments THEN 'completed' ELSE 'active' END
      WHERE plan_id = $1
      RETURNING enrollment_id, status;
    `;
    const planResult = await client.query(updatePlanQuery, [plan_id]);
    
    await client.query('COMMIT');
    console.log(`[Installment Processing Engine] Successfully recorded step ${installment_number} for Plan ID: ${plan_id}`);
    
    return res.status(200).json({ success: true });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[Billing Transaction Error] Installment engine failed to roll update:', error);
    return res.status(500).json({ error: 'Failed to update multi-tenant ledger parameters securely.' });
  } finally {
    client.release();
  }
}
