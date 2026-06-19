// tests/daycare/kioskBilling.test.ts
import request from 'supertest';
import express from 'express';
import { processKioskCheckOutSecure } from '../../controllers/daycare/kioskController';
import * as lateFeeEngine from '../../services/daycare/lateFeeEngine';
import * as billingRepository from '../../repository/daycare/billingRepository';

// Initialize a clean Express instance for testing
const app = express();
app.use(express.json());
app.post('/api/daycare/kiosk/checkout', processKioskCheckOutSecure);

// Spy and mock internal service modules to isolate the tests completely
jest.mock('../../services/daycare/lateFeeEngine');
jest.mock('../../repository/daycare/billingRepository');

describe('🛡️ Daycare Kiosk & Late Fee System Integration Tests (Rule 1 Compliant)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation for tracking mutations safely
    jest.spyOn(billingRepository, 'applyLateFeeToLedger').mockResolvedValue(true);
  });

  it('❌ Should immediately reject malformed terminal PIN strings (under 4 digits)', async () => {
    const response = await request(app)
      .post('/api/daycare/kiosk/checkout')
      .send({
        inputPin: '12', // Invalid short code
        facilityId: 'islamabad-g11',
        daycareChildId: 'c123-uuid'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Malformed request. PIN and required entities missing.');
  });

  it('❌ Should immediately reject non-numeric characters inside the terminal PIN', async () => {
    const response = await request(app)
      .post('/api/daycare/kiosk/checkout')
      .send({
        inputPin: '12A45', // Contains an alphabetical character
        facilityId: 'islamabad-g11',
        daycareChildId: 'c123-uuid'
      });

    expect(response.status).toBe(400);
  });

  it('✅ Should process on-time checkouts with 0 penalty units and run seamlessly', async () => {
    // Force the late-fee computation tool to return 0 (parent arrived on time)
    jest.spyOn(lateFeeEngine, 'evaluateLatePickUpPenalty').mockResolvedValue(0.00);

    const response = await request(app)
      .post('/api/daycare/kiosk/checkout')
      .send({
        inputPin: '123456',
        facilityId: 'islamabad-g11',
        daycareChildId: 'c123-uuid'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.eventMetadata.lateFeeIncurred).toBe(0.00);
    
    // Ensure the database ledger record wasn't updated since no late fees occurred
    expect(billingRepository.applyLateFeeToLedger).not.toHaveBeenCalled();
  });

  it('🔥 Should capture late pick-up penalties and trigger the isolated ledger upsert engine', async () => {
    // Force the engine to evaluate a penalty of 150.00 PKR/USD due to an overstay
    const mockPenalty = 150.00;
    jest.spyOn(lateFeeEngine, 'evaluateLatePickUpPenalty').mockResolvedValue(mockPenalty);

    const response = await request(app)
      .post('/api/daycare/kiosk/checkout')
      .send({
        inputPin: '987654',
        facilityId: 'london-central',
        daycareChildId: 'child-global-uuid'
      });

    expect(response.status).toBe(200);
    expect(response.body.eventMetadata.lateFeeIncurred).toBe(mockPenalty);

    // Verify that the background process macro-task schedules the database write
    await new Promise((resolve) => process.nextTick(resolve)); 
    expect(billingRepository.applyLateFeeToLedger).toHaveBeenCalledWith(
      expect.objectContaining({
        daycareChildId: 'child-global-uuid',
        penaltyAmount: mockPenalty
      })
    );
  });
});
