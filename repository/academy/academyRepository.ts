import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;
const ACADEMY_DB_PATH = path.join(process.cwd(), 'academy_db.json');

// Interface mapping to academy_schema.sql tables
export interface AcademyTenant {
  tenant_id?: string;
  business_name: string;
  subdomain_mapping?: string;
  base_currency: string;
  custom_branding_json?: string; // stored as stringified JSON or object
  created_at?: string;
}

export interface AcademyCourse {
  course_id?: string;
  tenant_id: string;
  course_title: string;
  course_category: string;
  duration_weeks: number;
  total_tuition_fee: number;
  certification_enabled: boolean;
  created_at?: string;
}

export interface AcademyEnrollment {
  enrollment_id?: string;
  tenant_id: string;
  course_id: string;
  t360_user_id: string;
  payment_plan_type: string;
  current_progress_percentage: number;
  enrollment_status: string;
  enrolled_at?: string;
}

export interface AcademySubmission {
  submission_id?: string;
  enrollment_id: string;
  course_id: string;
  assignment_title: string;
  student_submission_payload: string;
  ai_evaluation_status?: 'pending' | 'evaluated' | 'failed';
  ai_raw_feedback?: any;
  created_at?: string;
}

// Memory database fallback for local previews
interface LocalAcademyDB {
  tenants: AcademyTenant[];
  courses: AcademyCourse[];
  enrollments: AcademyEnrollment[];
  submissions: AcademySubmission[];
}

let localDb: LocalAcademyDB = {
  tenants: [],
  courses: [],
  enrollments: [],
  submissions: []
};

// Safety load helper
function loadLocalDb() {
  try {
    if (fs.existsSync(ACADEMY_DB_PATH)) {
      const data = fs.readFileSync(ACADEMY_DB_PATH, 'utf-8');
      localDb = JSON.parse(data);
    } else {
      saveLocalDb();
    }
  } catch (err) {
    console.error('[Academy Repository fallback DB error] In-memory active fallback active:', err);
  }
}

function saveLocalDb() {
  try {
    fs.writeFileSync(ACADEMY_DB_PATH, JSON.stringify(localDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Academy Repository save error] Could not persist to json local store:', err);
  }
}

loadLocalDb();

// Postgres Pool Connection Lifecycle
let dbPool: pg.Pool | null = null;
if (process.env.ACADEMY_DATABASE_URL) {
  try {
    dbPool = new Pool({
      connectionString: process.env.ACADEMY_DATABASE_URL
    });
  } catch (err) {
    console.error('[Academy Repository] Failed to create postgres Pool connection:', err);
  }
}

/**
 * ----------------------------------------------------
 * Tenant Multi-tenant Registration Management
 * ----------------------------------------------------
 */
export async function createTenant(tenant: AcademyTenant): Promise<AcademyTenant> {
  const tenantId = tenant.tenant_id || 'tnt-' + Math.random().toString(36).substring(2, 9);
  const newTenant: AcademyTenant = {
    ...tenant,
    tenant_id: tenantId,
    created_at: new Date().toISOString()
  };

  localDb.tenants.push(newTenant);
  saveLocalDb();

  if (dbPool) {
    const insertQuery = `
      INSERT INTO academy_tenants (tenant_id, business_name, subdomain_mapping, base_currency, custom_branding_json)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    try {
      const res = await dbPool.query(insertQuery, [
        tenantId,
        newTenant.business_name,
        newTenant.subdomain_mapping || null,
        newTenant.base_currency || 'PKR',
        newTenant.custom_branding_json ? JSON.stringify(newTenant.custom_branding_json) : null
      ]);
      return res.rows[0];
    } catch (err) {
      console.error('[Database Query Fault] Failed executing tenant registration in postgres pool:', err);
    }
  }

  return newTenant;
}

export async function fetchTenants(): Promise<AcademyTenant[]> {
  if (dbPool) {
    try {
      const res = await dbPool.query('SELECT * FROM academy_tenants;');
      return res.rows;
    } catch (err) {
      console.error('[Database Query Fault] Failed getting tenants:', err);
    }
  }
  return localDb.tenants;
}

/**
 * ----------------------------------------------------
 * High-performance courses and skill catalogues
 * ----------------------------------------------------
 */
export async function createCourse(course: AcademyCourse): Promise<AcademyCourse> {
  const courseId = course.course_id || 'crs-' + Math.random().toString(36).substring(2, 9);
  const newCourse: AcademyCourse = {
    ...course,
    course_id: courseId,
    created_at: new Date().toISOString()
  };

  localDb.courses.push(newCourse);
  saveLocalDb();

  if (dbPool) {
    const insertQuery = `
      INSERT INTO academy_courses (course_id, tenant_id, course_title, course_category, duration_weeks, total_tuition_fee, certification_enabled)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    try {
      const res = await dbPool.query(insertQuery, [
        courseId,
        newCourse.tenant_id,
        newCourse.course_title,
        newCourse.course_category,
        newCourse.duration_weeks,
        newCourse.total_tuition_fee,
        newCourse.certification_enabled
      ]);
      return res.rows[0];
    } catch (err) {
      console.error('[Database Query Fault] Course registration sql failure:', err);
    }
  }
  return newCourse;
}

export async function getTenantCourses(tenantId: string): Promise<AcademyCourse[]> {
  if (dbPool) {
    try {
      const res = await dbPool.query('SELECT * FROM academy_courses WHERE tenant_id = $1;', [tenantId]);
      return res.rows;
    } catch (err) {
      console.error('[Database Query Fault] Fetch courses sql failure:', err);
    }
  }
  return localDb.courses.filter(c => c.tenant_id === tenantId);
}

/**
 * ----------------------------------------------------
 * Isolated Student Enrollment tracking
 * ----------------------------------------------------
 */
export async function enrollStudent(enrollment: AcademyEnrollment): Promise<AcademyEnrollment> {
  const enrollmentId = enrollment.enrollment_id || 'enr-' + Math.random().toString(36).substring(2, 9);
  const newEnrollment: AcademyEnrollment = {
    ...enrollment,
    enrollment_id: enrollmentId,
    enrolled_at: new Date().toISOString()
  };

  localDb.enrollments.push(newEnrollment);
  saveLocalDb();

  if (dbPool) {
    const insertQuery = `
      INSERT INTO academy_enrollments_isolated (enrollment_id, tenant_id, course_id, t360_user_id, payment_plan_type, current_progress_percentage, enrollment_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    try {
      const res = await dbPool.query(insertQuery, [
        enrollmentId,
        newEnrollment.tenant_id,
        newEnrollment.course_id,
        newEnrollment.t360_user_id,
        newEnrollment.payment_plan_type,
        newEnrollment.current_progress_percentage || 0,
        newEnrollment.enrollment_status || 'active'
      ]);
      return res.rows[0];
    } catch (err) {
      console.error('[Database Query Fault] Enrollment tracking failure in postgres:', err);
    }
  }
  return newEnrollment;
}

/**
 * ----------------------------------------------------
 * High-fidelity child assignments submissions and AI Evaluation states
 * ----------------------------------------------------
 */
export async function submitAssignment(submission: AcademySubmission): Promise<AcademySubmission> {
  const submissionId = submission.submission_id || 'sub-' + Math.random().toString(36).substring(2, 9);
  const newSubmission: AcademySubmission = {
    ...submission,
    submission_id: submissionId,
    ai_evaluation_status: submission.ai_evaluation_status || 'pending',
    created_at: new Date().toISOString()
  };

  localDb.submissions.push(newSubmission);
  saveLocalDb();

  if (dbPool) {
    const insertQuery = `
      INSERT INTO academy_submissions_isolated (submission_id, enrollment_id, course_id, assignment_title, student_submission_payload, ai_evaluation_status, ai_raw_feedback)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    try {
      const res = await dbPool.query(insertQuery, [
        submissionId,
        newSubmission.enrollment_id,
        newSubmission.course_id,
        newSubmission.assignment_title,
        newSubmission.student_submission_payload,
        newSubmission.ai_evaluation_status,
        newSubmission.ai_raw_feedback ? JSON.stringify(newSubmission.ai_raw_feedback) : null
      ]);
      return res.rows[0];
    } catch (err) {
      console.error('[Database Query Fault] Assignment submission tracking failure in postgres:', err);
    }
  }
  return newSubmission;
}

export async function finishAIEvaluation(submissionId: string, feedback: any): Promise<boolean> {
  const localIndex = localDb.submissions.findIndex(s => s.submission_id === submissionId);
  if (localIndex !== -1) {
    localDb.submissions[localIndex].ai_evaluation_status = 'evaluated';
    localDb.submissions[localIndex].ai_raw_feedback = feedback;
    saveLocalDb();
  }

  if (dbPool) {
    const updateQuery = `
      UPDATE academy_submissions_isolated
      SET ai_evaluation_status = 'evaluated', ai_raw_feedback = $1
      WHERE submission_id = $2;
    `;
    try {
      await dbPool.query(updateQuery, [JSON.stringify(feedback), submissionId]);
      return true;
    } catch (err) {
      console.error('[Database Query Fault] Failed applying AI evaluation update:', err);
    }
  }
  return true;
}
