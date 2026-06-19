// tests/academy/assignmentEvaluation.test.ts
import request from 'supertest';
import express from 'express';

// Define the Postgres mock factory inside the hoisted scope so it is fully populated at import time
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
  (global as any)._mockQuery = mQuery;
  (global as any)._mockConnect = mConnect;

  return {
    default: {
      Pool: jest.fn(() => mPool)
    },
    Pool: jest.fn(() => mPool)
  };
});

// Import controllers AFTER mocking database drivers
import { submitAssignment, getSubmissionEvaluation, getSubmissionHistory } from '../../controllers/academy/submissionController';

// Mock modern @google/genai SDK to prevent actual API pricing calls
const mockGenerateContent = jest.fn();
const mockGoogleGenAI = jest.fn();

jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation((...args: any[]) => {
      mockGoogleGenAI(...args);
      return {
        models: {
          generateContent: (...args: any[]) => mockGenerateContent(...args)
        }
      };
    }),
    Type: {
      OBJECT: 'OBJECT',
      STRING: 'STRING',
      ARRAY: 'ARRAY',
      INTEGER: 'INTEGER'
    }
  };
});

// Configure test Express routing stack
const app = express();
app.use(express.json());

// Set up fake tenant context middleware manually for the router execution
app.use((req: any, res, next) => {
  req.tenant = {
    id: 'test-tenant-uuid',
    businessName: 'Vertex Academy Labs',
    currency: 'PKR',
    branding: {}
  };
  next();
});

app.post('/api/academy/submissions', submitAssignment);
app.get('/api/academy/submissions/:submission_id', getSubmissionEvaluation);
app.get('/api/academy/submissions', getSubmissionHistory);

describe('🎓 Taleem360 Skills Academy Assignment Evaluator System tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = ''; // start with missing key
    process.env.SKILLS_ACADEMY_DATABASE_URL = 'postgres://mock_user:mock_pass@127.0.0.1:5432/mock_db';
    
    // Re-bind the query mock implementation so it returns expected structure
    const mClient = {
      query: (global as any)._mockQuery,
      release: jest.fn(),
    };
    (global as any)._mockConnect.mockResolvedValue(mClient);
  });

  it('❌ Should reject submissions that miss any crucial metadata parameters', async () => {
    const response = await request(app)
      .post('/api/academy/submissions')
      .send({
        // Missing enrollment_id, course_id, assignment_title, or student_submission_payload
        assignment_title: 'Introduction to Node.js Streams API'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Missing required parameters');
  });

  it('🔒 Should process evaluation with high-fidelity fallback when GEMINI_API_KEY is not defined', async () => {
    // Declarative query dispatcher to bypass txn keywords safely
    (global as any)._mockQuery.mockImplementation((sql: string) => {
      const sqlUpper = sql.toUpperCase();
      if (sqlUpper.includes('INSERT')) {
        return Promise.resolve({
          rows: [{ submission_id: 'sub-1234-uuid' }]
        });
      }
      return Promise.resolve({ rows: [] });
    });

    const response = await request(app)
      .post('/api/academy/submissions')
      .send({
        enrollment_id: 'enr-999-uuid',
        course_id: 'crs-101-uuid',
        assignment_title: 'TypeScript Generics Workshop',
        student_submission_payload: 'export type Queue<T> = { elements: T[]; push(val: T): void; }'
      });

    expect(response.status).toBe(200);
    expect(response.body.submission_id).toBe('sub-1234-uuid');
    expect(response.body.ai_evaluation_status).toBe('evaluated');
    expect(response.body.evaluation).toBeDefined();
    expect(response.body.evaluation.numerical_score_percentage).toBe(85);
    
    // Check that we didn't invoke the live AI client (as no key existed)
    expect(mockGoogleGenAI).not.toHaveBeenCalled();
  });

  it('⚡ Should execute the full evaluation stream and return valid JSON when GEMINI_API_KEY is available', async () => {
    process.env.GEMINI_API_KEY = 'valid-aistudio-key-xxx';

    // Declarative query dispatcher to bypass txn keywords safely
    (global as any)._mockQuery.mockImplementation((sql: string) => {
      const sqlUpper = sql.toUpperCase();
      if (sqlUpper.includes('INSERT')) {
        return Promise.resolve({
          rows: [{ submission_id: 'ai-sub-uuid-555' }]
        });
      }
      return Promise.resolve({ rows: [] });
    });

    // Mock Gemini API text evaluation output matching target JSON Schema
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify({
        numerical_score_percentage: 98,
        executive_summary: "Incredible submission with top-grade functional execution.",
        strengths: ["Clean declarative architecture", "Exhaustive error handling logic"],
        identified_gaps: ["No minor gaps found"],
        actionable_remediation_steps: ["Prepare repository for production release"]
      })
    });

    const response = await request(app)
      .post('/api/academy/submissions')
      .send({
        enrollment_id: 'enr-777-uuid',
        course_id: 'crs-202-uuid',
        assignment_title: 'Full-Stack Software Architecture',
        student_submission_payload: 'const server = express(); server.listen(3000);'
      });

    expect(response.status).toBe(200);
    expect(response.body.submission_id).toBe('ai-sub-uuid-555');
    
    // Validate we invoked Gemini correctly
    expect(mockGenerateContent).toHaveBeenCalled();
    const evaluation = response.body.evaluation;
    expect(evaluation.numerical_score_percentage).toBe(98);
    expect(evaluation.strengths).toContain('Clean declarative architecture');
  });

  it('🔍 Should fetch detailed assessment results for a specific submission ID successfully', async () => {
    (global as any)._mockQuery.mockImplementation((sql: string) => {
      const sqlUpper = sql.toUpperCase();
      if (sqlUpper.includes('SELECT')) {
        return Promise.resolve({
          rows: [{
            submission_id: 'sub-789-uuid',
            assignment_title: 'Data-structures Quiz',
            ai_evaluation_status: 'evaluated',
            ai_raw_feedback: { numerical_score_percentage: 90 }
          }]
        });
      }
      return Promise.resolve({ rows: [] });
    });

    const response = await request(app)
      .get('/api/academy/submissions/sub-789-uuid');

    expect(response.status).toBe(200);
    expect(response.body.submission_id).toBe('sub-789-uuid');
    expect(response.body.ai_raw_feedback.numerical_score_percentage).toBe(90);
  });
});
