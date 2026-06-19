// tests/tutors/bookingEngine.test.ts
import request from 'supertest';
import express from 'express';

// Mock postgreSQL database pool structure completely
jest.mock('pg', () => {
  const mQuery = jest.fn();
  const mConnect = jest.fn();
  const mClient = {
    query: mQuery,
    release: jest.fn(),
  };
  mConnect.mockResolvedValue(mClient);
  const mPool = {
    connect: mConnect,
    query: mQuery,
    end: jest.fn(),
  };
  
  // Expose these mocked references to the global namespace safely so tests can assert them
  (global as any)._tutorMockQuery = mQuery;
  (global as any)._tutorMockConnect = mConnect;

  return {
    default: {
      Pool: jest.fn(() => mPool)
    },
    Pool: jest.fn(() => mPool)
  };
});

// Import controllers AFTER mocking database drivers
import { processPrivateSessionBooking } from '../../controllers/tutors/bookingController';

// Configure test Express routing stack
const app = express();
app.use(express.json());

// Set up fake tenant context middleware manually
app.use((req: any, res, next) => {
  req.tenant = {
    id: 'test-tenant-uuid',
    businessName: 'Vertex Academy Labs',
    currency: 'USD',
    branding: {}
  };
  next();
});

app.post('/api/academy/tutors/bookings', processPrivateSessionBooking);

describe('🎓 Taleem360 Skills Academy Tutor Booking Engine tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SKILLS_ACADEMY_DATABASE_URL = ''; // Start without live DB url (trigger fallback)
    
    // Re-bind the query mock implementation so it returns expected structure
    const mClient = {
      query: (global as any)._tutorMockQuery,
      release: jest.fn(),
    };
    (global as any)._tutorMockConnect.mockResolvedValue(mClient);
  });

  it('❌ Should reject bookings that miss any crucial scheduling parameter', async () => {
    const response = await request(app)
      .post('/api/academy/tutors/bookings')
      .send({
        tutorId: 'tutor-123',
        // missing studentUserId, slotId, and timestamp
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Missing critical parameters');
  });

  it('🔒 Should process slot selection with in-memory fallback when database url is not configured', async () => {
    const response = await request(app)
      .post('/api/academy/tutors/bookings')
      .send({
        tutorId: 'tutor-mem-test',
        studentUserId: 'student-999',
        slotId: 'slot-mem-active',
        appointmentTimestampUtc: '2026-06-25T14:00:00Z'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.appointmentId).toBeDefined();
    expect(response.body.message).toContain('Private slot securely locked down');
  });

  it('⚡ Should reject already booked slots under the in-memory fallback flow', async () => {
    // Book a slot once
    await request(app)
      .post('/api/academy/tutors/bookings')
      .send({
        tutorId: 'tutor-clash-test',
        studentUserId: 'student-111',
        slotId: 'slot-duplicate-lock',
        appointmentTimestampUtc: '2026-06-25T15:00:00Z'
      });

    // Attempt booking same slot again
    const secondResponse = await request(app)
      .post('/api/academy/tutors/bookings')
      .send({
        tutorId: 'tutor-clash-test',
        studentUserId: 'student-222',
        slotId: 'slot-duplicate-lock',
        appointmentTimestampUtc: '2026-06-25T15:00:00Z'
      });

    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body.error).toContain('already been reserved');
  });

  it('🔥 Should execute database lock queries and allocate appointments when SKILLS_ACADEMY_DATABASE_URL is active', async () => {
    process.env.SKILLS_ACADEMY_DATABASE_URL = 'postgres://tutor_db_usr:pass@localhost:5432/tutor';

    // Mock query chain:
    // Query 1: BEGIN txn
    // Query 2: SELECT is_booked FROM tutor_availability_slots (slot open)
    // Query 3: UPDATE tutor_availability_slots
    // Query 4: INSERT INTO private_appointments_isolated RETURNING appointment_id
    // Query 5: COMMIT txn
    (global as any)._tutorMockQuery.mockImplementation((sql: string) => {
      const sqlUpper = sql.toUpperCase();
      if (sqlUpper.includes('SELECT')) {
        return Promise.resolve({
          rows: [{ is_booked: false }] // Available slot
        });
      }
      if (sqlUpper.includes('INSERT')) {
        return Promise.resolve({
          rows: [{ appointment_id: 'db-app-999-uuid' }]
        });
      }
      return Promise.resolve({ rows: [] });
    });

    const response = await request(app)
      .post('/api/academy/tutors/bookings')
      .send({
        tutorId: 'tutor-db-test-id',
        studentUserId: 'student-db-test-id',
        slotId: 'slot-db-test-id',
        appointmentTimestampUtc: '2026-06-25T18:00:00Z'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.appointmentId).toBe('db-app-999-uuid');
  });

  it('🛑 Should rollback active transaction if database query encounters unexpected allocation failure', async () => {
    process.env.SKILLS_ACADEMY_DATABASE_URL = 'postgres://tutor_db_usr:pass@localhost:5432/tutor';

    // Force query failure on checkSlot query
    (global as any)._tutorMockQuery.mockRejectedValueOnce(new Error('Deadlock detected or server crash simulation'));

    const response = await request(app)
      .post('/api/academy/tutors/bookings')
      .send({
        tutorId: 'tutor-fail',
        studentUserId: 'student-fail',
        slotId: 'slot-fail',
        appointmentTimestampUtc: '2026-06-25T19:00:00Z'
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toContain('Tutor booking controller encountered an allocation fault');
  });
});
