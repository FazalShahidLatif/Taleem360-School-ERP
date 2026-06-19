import { getOperatingHours } from '../../api/auth/db_store.js';

interface CheckoutSession {
  childId: string;
  checkOutTimeUtc: string; // ISO String from Kiosk
  facilityId: string;
}

export async function evaluateLatePickUpPenalty(session: CheckoutSession): Promise<number> {
  try {
    // 1. Fetch facility configuration rules from your isolated daycare DB branch
    const rules = getOperatingHours(session.facilityId) || {
      closing_time_utc: '13:00:00', // 1:00 PM UTC (which is 6:00 PM PKT)
      late_fee_per_minute: 5.00   // 5 units (PKR/USD) per minute overstayed
    };

    const actualCheckout = new Date(session.checkOutTimeUtc);
    
    // Create a boundary object using the same date context but with closing hours
    const closingBoundary = new Date(actualCheckout);
    const [hours, minutes, seconds] = rules.closing_time_utc.split(':').map(Number);
    closingBoundary.setUTCHours(hours, minutes, seconds, 0);

    // 2. Compute the exact difference in minutes
    const overstayMs = actualCheckout.getTime() - closingBoundary.getTime();
    const overstayMinutes = Math.floor(overstayMs / 1000 / 60);

    if (overstayMinutes <= 0) {
      return 0.00; // The parent arrived on time; no penalty incurred.
    }

    // 3. Compute final balance due
    const totalPenaltyFee = overstayMinutes * rules.late_fee_per_minute;
    
    console.log(`[Billing Engine] Overtime Detected: ${overstayMinutes} mins late. Penalty Bill: ${totalPenaltyFee}`);
    return totalPenaltyFee;

  } catch (error) {
    console.error('[Billing Engine Exception] Failed to evaluate late calculations safely:', error);
    return 0.00; // Fail safe by defaulting to zero penalty to avoid blocking the workflow
  }
}
