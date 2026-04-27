import { School, User, Student, Class, Enrollment, Attendance, UserRole, DashboardStats, AuthResponse, ParentDashboardData, FeeCategory, StudentFee, Payment, Affiliate, Referral, TimetableEntry, DayOfWeek, SubscriptionTier, Staff, Subject, Exam, ExamResult, SupportTicket, TicketStatus, TicketPriority, BlogPost, AffiliateStatus, StaffSalary, SalaryStatus, LeaveRequest, ReportCard, ReportCardSubject, Book, LibraryTransaction, Assignment, Submission, Vehicle, Route, PickupPoint, StudentTransportAllocation, TransportStats } from '../types';
import { ai } from './ai';

// Mock Database State (Internal)
interface DBStudent extends Student { school_id: string; created_at: string; is_active: boolean; parent_id?: string; }
interface DBClass extends Class { school_id: string; }
interface DBEnrollment extends Enrollment { school_id: string; }
interface DBAttendance extends Attendance { school_id: string; marked_by: string; }

const SCHOOL_A_ID = 'school-1';
const SCHOOL_B_ID = 'school-2';

const INITIAL_SCHOOLS: School[] = [
  {
    id: SCHOOL_A_ID,
    name: 'Springfield Elementary',
    code: 'SPRINGFIELD_001',
    timezone: 'UTC',
    locale: 'en-US',
    is_active: true,
    subscription_tier: SubscriptionTier.TIER_1,
    student_count: 5,
    max_students: 200,
    created_at: '2023-01-01T00:00:00Z',
    contact_email: 'info@springfield.edu',
    onboarded: true
  },
  {
    id: SCHOOL_B_ID,
    name: 'West Springfield Elementary',
    code: 'WEST_SPRING_002',
    timezone: 'UTC',
    locale: 'en-US',
    is_active: true,
    subscription_tier: SubscriptionTier.PILOT,
    student_count: 2,
    max_students: 30,
    created_at: '2023-02-01T00:00:00Z',
    contact_email: 'contact@westspringfield.edu',
    onboarded: true
  }
];

const INITIAL_USERS: User[] = [
  // Super Admin
  { id: 'u0', email: 'accts.pak@gmail.com', name: 'Super Admin', password: 'super', role: UserRole.SUPER_ADMIN, onboarded: true },
  { id: 'u-sa2', email: 'support@taleem360.online', name: 'Super Admin', password: 'super', role: UserRole.SUPER_ADMIN, onboarded: true },

  // School A Users
  { id: 'u1', email: 'admin@school.com', name: 'Principal Skinner', password: 'admin', role: UserRole.ADMIN, school_id: SCHOOL_A_ID, onboarded: true },
  { id: 'u2', email: 'teacher@school.com', name: 'Edna Krabappel', password: 'teacher', role: UserRole.TEACHER, school_id: SCHOOL_A_ID, onboarded: true },
  { id: 'u3', email: 'teacher2@school.com', name: 'Dewey Largo', password: 'teacher', role: UserRole.TEACHER, school_id: SCHOOL_A_ID, onboarded: true },
  { id: 'u6', email: 'parent@school.com', name: 'Marge Simpson', password: 'parent', role: UserRole.PARENT, school_id: SCHOOL_A_ID, student_id: 's1', onboarded: true }, // Parent of Bart
  
  // School B Users (For Multi-tenant testing)
  { id: 'u4', email: 'admin@b-school.com', name: 'Superintendent Chalmers', password: 'admin', role: UserRole.ADMIN, school_id: SCHOOL_B_ID, onboarded: true },
  { id: 'u5', email: 'teacher@b-school.com', name: 'Elizabeth Hoover', password: 'teacher', role: UserRole.TEACHER, school_id: SCHOOL_B_ID, onboarded: true },
];

const INITIAL_CLASSES: DBClass[] = [
  // School A
  { id: 'c1', name: 'Grade 4', section: 'A', school_id: SCHOOL_A_ID, class_teacher: 'u2' },
  { id: 'c2', name: 'Grade 5', section: 'B', school_id: SCHOOL_A_ID, class_teacher: 'u3' },
  // School B
  { id: 'c3', name: 'Grade 2', section: 'C', school_id: SCHOOL_B_ID, class_teacher: 'u5' },
];

const INITIAL_STUDENTS: DBStudent[] = [
  // School A
  { id: 's1', first_name: 'Bart', last_name: 'Simpson', enrollment_number: 'STD001', school_id: SCHOOL_A_ID, is_active: true, created_at: '2023-09-01', parent_id: 'u6' },
  { id: 's2', first_name: 'Lisa', last_name: 'Simpson', enrollment_number: 'STD002', school_id: SCHOOL_A_ID, is_active: true, created_at: '2023-09-01' },
  { id: 's3', first_name: 'Milhouse', last_name: 'Van Houten', enrollment_number: 'STD003', school_id: SCHOOL_A_ID, is_active: true, created_at: '2023-09-01' },
  { id: 's4', first_name: 'Ralph', last_name: 'Wiggum', enrollment_number: 'STD004', school_id: SCHOOL_A_ID, is_active: true, created_at: '2023-09-01' },
  { id: 's5', first_name: 'Nelson', last_name: 'Muntz', enrollment_number: 'STD005', school_id: SCHOOL_A_ID, is_active: true, created_at: '2023-09-01' },
  // School B
  { id: 's6', first_name: 'Rod', last_name: 'Flanders', enrollment_number: 'B001', school_id: SCHOOL_B_ID, is_active: true, created_at: '2023-09-01' },
  { id: 's7', first_name: 'Todd', last_name: 'Flanders', enrollment_number: 'B002', school_id: SCHOOL_B_ID, is_active: true, created_at: '2023-09-01' },
];

const INITIAL_ENROLLMENTS: DBEnrollment[] = [
  // School A
  { student: 's1', class_obj: 'c1', school_id: SCHOOL_A_ID, academic_year: '2025-2026' },
  { student: 's2', class_obj: 'c1', school_id: SCHOOL_A_ID, academic_year: '2025-2026' },
  { student: 's3', class_obj: 'c1', school_id: SCHOOL_A_ID, academic_year: '2025-2026' },
  { student: 's4', class_obj: 'c1', school_id: SCHOOL_A_ID, academic_year: '2025-2026' },
  { student: 's5', class_obj: 'c1', school_id: SCHOOL_A_ID, academic_year: '2025-2026' },
  // School B
  { student: 's6', class_obj: 'c3', school_id: SCHOOL_B_ID, academic_year: '2025-2026' },
  { student: 's7', class_obj: 'c3', school_id: SCHOOL_B_ID, academic_year: '2025-2026' },
];

// Finance Mock Data
const INITIAL_FEE_CATEGORIES: FeeCategory[] = [
  { id: 'fc1', name: 'Annual Tuition Fee', amount: 1000, description: 'Academic year tuition', school_id: SCHOOL_A_ID },
  { id: 'fc2', name: 'Lab Fee', amount: 150, description: 'Science lab equipment maintenance', school_id: SCHOOL_A_ID },
  { id: 'fc3', name: 'Computer Lab Fee', amount: 200, description: 'Annual computer lab usage fee', school_id: SCHOOL_A_ID },
  { id: 'fc4', name: 'Sports Fee', amount: 100, description: 'Annual sports participation fee', school_id: SCHOOL_A_ID },
  { id: 'fc5', name: 'Mid-Term Fee', amount: 250, description: 'Mid-term examination fee', school_id: SCHOOL_A_ID },
];

const INITIAL_STUDENT_FEES: StudentFee[] = [
  { 
    id: 'sf1', 
    student_id: 's1', 
    category_id: 'fc1', 
    due_date: '2025-10-15', 
    amount: 1000, 
    is_paid: false, 
    school_id: SCHOOL_A_ID 
  },
  { id: 'sf2', student_id: 's1', category_id: 'fc5', due_date: '2025-11-15', amount: 250, is_paid: false, school_id: SCHOOL_A_ID },
  { 
    id: 'sf_paid_1', 
    student_id: 's1', 
    category_id: 'fc2', 
    due_date: '2025-09-15', 
    amount: 150, 
    is_paid: true, 
    paid_on: '2025-09-10',
    school_id: SCHOOL_A_ID 
  },
  { id: 'sf3', student_id: 's2', category_id: 'fc5', due_date: '2025-11-15', amount: 250, is_paid: false, school_id: SCHOOL_A_ID },
  { id: 'sf4', student_id: 's3', category_id: 'fc5', due_date: '2025-11-15', amount: 250, is_paid: false, school_id: SCHOOL_A_ID },
  { id: 'sf5', student_id: 's4', category_id: 'fc5', due_date: '2025-11-15', amount: 250, is_paid: false, school_id: SCHOOL_A_ID },
  { id: 'sf6', student_id: 's5', category_id: 'fc5', due_date: '2025-11-15', amount: 250, is_paid: false, school_id: SCHOOL_A_ID },
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay_init_1',
    fee_id: 'sf_paid_1',
    amount: 150,
    date: '2025-09-10',
    method: 'Credit Card',
    transaction_id: 'txn_initial_001',
    status: 'SUCCESS',
    school_id: SCHOOL_A_ID
  }
];

const INITIAL_TIMETABLE: TimetableEntry[] = [
  // School A - Grade 4 (c1)
  { id: 't1', class_id: 'c1', subject: 'Mathematics', teacher_id: 'u2', teacher_name: 'Edna Krabappel', day: DayOfWeek.MONDAY, start_time: '08:00', end_time: '09:00', room: 'Room 101' },
  { id: 't2', class_id: 'c1', subject: 'English', teacher_id: 'u2', teacher_name: 'Edna Krabappel', day: DayOfWeek.MONDAY, start_time: '09:00', end_time: '10:00', room: 'Room 101' },
  { id: 't3', class_id: 'c1', subject: 'Science', teacher_id: 'u2', teacher_name: 'Edna Krabappel', day: DayOfWeek.TUESDAY, start_time: '08:00', end_time: '09:00', room: 'Lab 1' },
  { id: 't4', class_id: 'c1', subject: 'History', teacher_id: 'u2', teacher_name: 'Edna Krabappel', day: DayOfWeek.WEDNESDAY, start_time: '10:00', end_time: '11:00', room: 'Room 101' },
  
  // School A - Grade 5 (c2)
  { id: 't5', class_id: 'c2', subject: 'Music', teacher_id: 'u3', teacher_name: 'Dewey Largo', day: DayOfWeek.MONDAY, start_time: '11:00', end_time: '12:00', room: 'Music Room' },
  { id: 't6', class_id: 'c2', subject: 'Art', teacher_id: 'u3', teacher_name: 'Dewey Largo', day: DayOfWeek.THURSDAY, start_time: '09:00', end_time: '10:30', room: 'Art Studio' },
];

const INITIAL_STAFF: Staff[] = [
  { id: 'st1', name: 'Edna Krabappel', email: 'teacher@school.com', role: 'TEACHER', designation: 'Senior Teacher', department: 'Academic', joining_date: '2020-01-15', school_id: SCHOOL_A_ID, user_id: 'u2', is_active: true },
  { id: 'st2', name: 'Dewey Largo', email: 'teacher2@school.com', role: 'TEACHER', designation: 'Music Teacher', department: 'Arts', joining_date: '2021-03-10', school_id: SCHOOL_A_ID, user_id: 'u3', is_active: true },
  { id: 'st3', name: 'Groundskeeper Willie', email: 'willie@school.com', role: 'SUPPORT', designation: 'Groundskeeper', department: 'Maintenance', joining_date: '2015-05-20', school_id: SCHOOL_A_ID, is_active: true },
];

const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub1', name: 'Mathematics', code: 'MATH101', school_id: SCHOOL_A_ID },
  { id: 'sub2', name: 'English Literature', code: 'ENG102', school_id: SCHOOL_A_ID },
  { id: 'sub3', name: 'General Science', code: 'SCI103', school_id: SCHOOL_A_ID },
];

const INITIAL_EXAMS: Exam[] = [
  { id: 'e1', name: 'Mid Term 2024', class_id: 'c1', subject_id: 'sub1', exam_date: '2024-06-15', total_marks: 100, passing_marks: 40, school_id: SCHOOL_A_ID },
  { id: 'e2', name: 'Mid Term 2024', class_id: 'c1', subject_id: 'sub2', exam_date: '2024-06-16', total_marks: 100, passing_marks: 40, school_id: SCHOOL_A_ID },
];

const INITIAL_EXAM_RESULTS: ExamResult[] = [
  { id: 'er1', exam_id: 'e1', student_id: 's1', marks_obtained: 85, remarks: 'Excellent', school_id: SCHOOL_A_ID },
  { id: 'er2', exam_id: 'e1', student_id: 's2', marks_obtained: 92, remarks: 'Outstanding', school_id: SCHOOL_A_ID },
];

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 't1',
    school_id: SCHOOL_A_ID,
    school_name: 'Springfield Elementary',
    user_id: 'u1',
    user_name: 'Principal Skinner',
    subject: 'Issue with attendance report',
    description: 'The attendance report for Grade 4 is not loading correctly.',
    status: TicketStatus.OPEN,
    priority: TicketPriority.HIGH,
    category: 'Technical Support',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'How AI is Transforming School Administration',
    slug: 'ai-transforming-school-admin',
    excerpt: 'Discover how artificial intelligence is streamlining workflows and providing deeper insights for school leaders.',
    content: 'Full content here...',
    author: 'Dr. Sarah Ahmed',
    category: 'Technology',
    image_url: 'https://picsum.photos/seed/ai-school/800/400',
    published_at: '2026-03-05',
    is_published: true
  }
];

const INITIAL_BOOKS: Book[] = [
  { id: 'b1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', category: 'Fiction', quantity: 5, available_quantity: 5, location: 'Shelf A1', school_id: SCHOOL_A_ID },
  { id: 'b2', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061120084', category: 'Fiction', quantity: 3, available_quantity: 3, location: 'Shelf A2', school_id: SCHOOL_A_ID },
  { id: 'b3', title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '9780553380163', category: 'Science', quantity: 2, available_quantity: 2, location: 'Shelf B1', school_id: SCHOOL_A_ID },
];

const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'v1', vehicleNumber: 'BUS-001', registrationNumber: 'ABC-123', capacity: 40, type: 'BUS', driverName: 'Otto Mann', driverPhone: '555-0101', status: 'ACTIVE', school_id: SCHOOL_A_ID },
  { id: 'v2', vehicleNumber: 'VAN-002', registrationNumber: 'XYZ-789', capacity: 15, type: 'VAN', driverName: 'Hans Moleman', driverPhone: '555-0102', status: 'ACTIVE', school_id: SCHOOL_A_ID },
];

const INITIAL_ROUTES: Route[] = [
  { 
    id: 'r1', 
    name: 'North Springfield Route', 
    startPoint: 'School Main Gate', 
    endPoint: 'North Sector 7', 
    approximateDistance: '12 km', 
    pickupPoints: [
      { id: 'pp1', routeId: 'r1', name: 'Evergreen Terrace', timeMorning: '07:15', timeAfternoon: '14:30', landmark: 'Near 742 Evergreen Terrace' },
      { id: 'pp2', routeId: 'r1', name: 'Kwik-E-Mart', timeMorning: '07:30', timeAfternoon: '14:45', landmark: 'Main Entrance' }
    ], 
    assignedVehicleId: 'v1', 
    assignedVehicleNumber: 'BUS-001',
    status: 'ACTIVE', 
    school_id: SCHOOL_A_ID 
  }
];

const KEYS = {
  USERS: 'erp_users',
  STUDENTS: 'erp_students',
  CLASSES: 'erp_classes',
  SUBJECTS: 'erp_subjects',
  ENROLLMENTS: 'erp_enrollments',
  ATTENDANCE: 'erp_attendance',
  FEE_CATEGORIES: 'erp_fee_categories',
  STUDENT_FEES: 'erp_student_fees',
  PAYMENTS: 'erp_payments',
  AFFILIATES: 'erp_affiliates',
  REFERRALS: 'erp_referrals',
  TIMETABLE: 'erp_timetable',
  SCHOOLS: 'erp_schools',
  STAFF: 'erp_staff',
  EXAMS: 'erp_exams',
  EXAM_RESULTS: 'erp_exam_results',
  TICKETS: 'erp_tickets',
  BLOG_POSTS: 'erp_blog_posts',
  SALARIES: 'erp_salaries',
  LEAVE_REQUESTS: 'erp_leave_requests',
  REPORT_CARDS: 'erp_report_cards',
  BOOKS: 'erp_books',
  LIBRARY_TRANSACTIONS: 'erp_library_transactions',
  ASSIGNMENTS: 'erp_assignments',
  SUBMISSIONS: 'erp_submissions',
  VEHICLES: 'erp_vehicles',
  ROUTES: 'erp_routes',
  PICKUP_POINTS: 'erp_pickup_points',
  TRANSPORT_ALLOCATIONS: 'erp_transport_allocations',
  INIT: 'erp_initialized_v21'
};

// Internal Helpers
const load = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.warn(`[Storage] Failed to parse key ${key}, resetting to empty array.`, e);
    return [];
  }
};

const save = (key: string, data: any[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`[Storage] Failed to save key ${key}`, e);
  }
};

const delay = () => new Promise(res => setTimeout(res, 300));

// Base64Url encoder for JWT (UTF-8 safe)
const toBase64Url = (str: string) => {
  try {
    const base64 = btoa(unescape(encodeURIComponent(str)));
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    console.error("[Storage] Base64 encoding failed", e);
    return "";
  }
};

const generateToken = (user: User, schoolName?: string) => {
  const payload = {
    user_id: user.id,
    email: user.email,
    name: user.name, 
    role: user.role,
    school_id: user.school_id,
    school_name: schoolName || user.school_name || 'Unknown School',
    student_id: user.student_id,
    onboarded: user.onboarded,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  };

  const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = toBase64Url(JSON.stringify(payload));
  const signature = "mock_signature_xyz";

  return `${header}.${body}.${signature}`;
};

// API Layer
export const db = {
  init: () => {
    const isInit = localStorage.getItem(KEYS.INIT) === 'true_v21';
    const hasUsers = load<User>(KEYS.USERS).length > 0;

    // Re-initialize if version mismatch OR if data is unexpectedly empty
    if (!isInit || !hasUsers) {
      console.log('Initializing Mock Database (v21)...');
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      localStorage.setItem(KEYS.CLASSES, JSON.stringify(INITIAL_CLASSES));
      localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
      localStorage.setItem(KEYS.ENROLLMENTS, JSON.stringify(INITIAL_ENROLLMENTS));
      localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify([]));
      localStorage.setItem(KEYS.FEE_CATEGORIES, JSON.stringify(INITIAL_FEE_CATEGORIES));
      localStorage.setItem(KEYS.STUDENT_FEES, JSON.stringify(INITIAL_STUDENT_FEES));
      localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
      localStorage.setItem(KEYS.AFFILIATES, JSON.stringify([]));
      localStorage.setItem(KEYS.REFERRALS, JSON.stringify([]));
      localStorage.setItem(KEYS.TIMETABLE, JSON.stringify(INITIAL_TIMETABLE));
      localStorage.setItem(KEYS.SCHOOLS, JSON.stringify(INITIAL_SCHOOLS));
      localStorage.setItem(KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
      localStorage.setItem(KEYS.EXAMS, JSON.stringify(INITIAL_EXAMS));
      localStorage.setItem(KEYS.EXAM_RESULTS, JSON.stringify(INITIAL_EXAM_RESULTS));
      localStorage.setItem(KEYS.TICKETS, JSON.stringify(INITIAL_TICKETS));
      localStorage.setItem(KEYS.BLOG_POSTS, JSON.stringify(INITIAL_BLOG_POSTS));
      localStorage.setItem(KEYS.SALARIES, JSON.stringify([]));
      localStorage.setItem(KEYS.LEAVE_REQUESTS, JSON.stringify([]));
      localStorage.setItem(KEYS.REPORT_CARDS, JSON.stringify([]));
      localStorage.setItem(KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
      localStorage.setItem(KEYS.LIBRARY_TRANSACTIONS, JSON.stringify([]));
      localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify([]));
      localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify([]));
      localStorage.setItem(KEYS.VEHICLES, JSON.stringify(INITIAL_VEHICLES));
      localStorage.setItem(KEYS.ROUTES, JSON.stringify(INITIAL_ROUTES));
      localStorage.setItem(KEYS.TRANSPORT_ALLOCATIONS, JSON.stringify([]));
      localStorage.setItem(KEYS.INIT, 'true_v21');
      console.log('Database Initialized.');
    } else {
      console.log('Database already initialized.');
    }
  },

  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      await delay();
      const users = load<User>(KEYS.USERS);
      const schools = load<School>(KEYS.SCHOOLS);
      console.debug(`[Auth] Attempting login for ${email} among ${users.length} users.`);
      
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        console.warn(`[Auth] Login failed for ${email}: Invalid credentials.`);
        throw new Error('Invalid credentials');
      }

      const school = schools.find(s => s.id === user.school_id);
      const token = generateToken(user, school?.name);
      
      return {
        access: token,
        refresh: 'mock_refresh_token_xyz'
      };
    },

    register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
      await delay();
      const users = load<User>(KEYS.USERS);
      if (users.find(u => u.email === email)) {
        throw new Error('User already exists');
      }

      const superAdminEmails = ['accts.pak@gmail.com', 'support@taleem360.online'];
      const role = superAdminEmails.includes(email) ? UserRole.SUPER_ADMIN : UserRole.ADMIN;

      const newUser: User = {
        id: `u-${Date.now()}`,
        email,
        name,
        password,
        role,
        onboarded: false
      };

      users.push(newUser);
      save(KEYS.USERS, users);

      return await db.auth.login(email, password);
    },

    me: async (token: string): Promise<User> => {
      await delay();
      try {
        // Simple decode for mock backend check (doesn't use jwt-decode lib here to avoid deps in storage file)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        
        // Check Expiry (JWT exp is in seconds)
        if (Date.now() >= payload.exp * 1000) throw new Error('Token expired');
        
        return {
          id: payload.user_id,
          email: payload.email,
          name: payload.name,
          role: payload.role,
          school_id: payload.school_id,
          school_name: payload.school_name,
          student_id: payload.student_id,
          onboarded: payload.onboarded
        };
      } catch (e) {
        throw new Error('Invalid token');
      }
    }
  },

  getUsers: (): User[] => load(KEYS.USERS),

  getParentDashboard: async (user: User): Promise<ParentDashboardData> => {
    await delay();
    if (user.role !== UserRole.PARENT || !user.student_id) {
      throw new Error("Unauthorized: Parent access required.");
    }

    const student = load<DBStudent>(KEYS.STUDENTS).find(s => s.id === user.student_id);
    if (!student) throw new Error("Linked student not found.");

    const attendance = load<DBAttendance>(KEYS.ATTENDANCE)
      .filter(a => a.student === user.student_id)
      .map(a => ({ date: a.date, status: a.status }));
    
    attendance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const enrollments = load<DBEnrollment>(KEYS.ENROLLMENTS).filter(e => e.student === user.student_id);
    const classes = load<DBClass>(KEYS.CLASSES);
    const studentClasses = classes
      .filter(c => enrollments.some(e => e.class_obj === c.id))
      .map(c => `${c.name} (${c.section})`);

    return {
      student_name: `${student.first_name} ${student.last_name}`,
      attendance,
      classes: studentClasses
    };
  },

  getDashboardStats: async (user: User): Promise<DashboardStats> => {
    await delay();
    const students = load<DBStudent>(KEYS.STUDENTS).filter(s => s.school_id === user.school_id).length;
    const teachers = load<User>(KEYS.USERS).filter(u => u.school_id === user.school_id && u.role === UserRole.TEACHER).length;
    const classes = load<DBClass>(KEYS.CLASSES).filter(c => c.school_id === user.school_id).length;
    
    return { students, teachers, classes };
  },

  getStudents: async (user: User): Promise<Student[]> => {
    await delay();
    const students = load<DBStudent>(KEYS.STUDENTS).filter(s => s.school_id === user.school_id);
    const users = load<User>(KEYS.USERS);
    
    return students.map(s => {
      const parent = users.find(u => u.id === s.parent_id || u.student_id === s.id);
      return {
        ...s,
        parent_name: parent ? parent.name : 'Not Assigned',
        parent_id: parent ? parent.id : undefined
      };
    });
  },

  addStudent: async (user: User, data: Omit<Student, 'id'>) => {
    await delay();
    const schools = load<School>(KEYS.SCHOOLS);
    const school = schools.find(s => s.id === user.school_id);
    
    if (!school) throw new Error("School not found");
    
    const students = load<DBStudent>(KEYS.STUDENTS);
    const schoolStudents = students.filter(s => s.school_id === user.school_id);
    
    if (schoolStudents.length >= school.max_students) {
      throw new Error(`Student limit reached for your subscription tier (${school.max_students} students). Please upgrade your plan.`);
    }

    const newStudentId = `s${Date.now()}`;
    const newStudent: DBStudent = {
      ...data,
      id: newStudentId,
      school_id: user.school_id,
      created_at: new Date().toISOString(),
      is_active: true
    };
    students.push(newStudent);
    save(KEYS.STUDENTS, students);

    // If parent_id is provided, associate it in the users table too
    if (data.parent_id) {
      const users = load<User>(KEYS.USERS);
      const parentIdx = users.findIndex(u => u.id === data.parent_id);
      if (parentIdx >= 0) {
        users[parentIdx].student_id = newStudentId;
        save(KEYS.USERS, users);
      }
    }
  },

  updateStudent: async (user: User, id: string, data: Partial<Student>) => {
    await delay();
    const students = load<DBStudent>(KEYS.STUDENTS);
    const idx = students.findIndex(s => s.id === id && s.school_id === user.school_id);
    if (idx === -1) throw new Error("Student not found");

    students[idx] = { ...students[idx], ...data };
    save(KEYS.STUDENTS, students);
    return students[idx];
  },

  deleteStudent: async (user: User, id: string) => {
    await delay();
    const students = load<DBStudent>(KEYS.STUDENTS);
    const filtered = students.filter(s => s.id !== id || s.school_id !== user.school_id);
    save(KEYS.STUDENTS, filtered);
  },

  getClasses: async (user: User): Promise<Class[]> => {
    await delay();
    return load<DBClass>(KEYS.CLASSES)
      .filter(c => c.school_id === user.school_id)
      .map(({ id, name, section, class_teacher, school_id }) => ({ id, name, section, class_teacher, school_id }));
  },

  addClass: async (user: User, data: Omit<Class, 'id'>) => {
    await delay();
    const classes = load<DBClass>(KEYS.CLASSES);
    const newClass: DBClass = {
      ...data,
      id: `c${Date.now()}`,
      school_id: user.school_id
    };
    classes.push(newClass);
    save(KEYS.CLASSES, classes);
  },

  updateClass: async (user: User, id: string, data: Partial<Class>) => {
    await delay();
    const classes = load<DBClass>(KEYS.CLASSES);
    const idx = classes.findIndex(c => c.id === id && c.school_id === user.school_id);
    if (idx === -1) throw new Error("Class not found");
    classes[idx] = { ...classes[idx], ...data };
    save(KEYS.CLASSES, classes);
    return classes[idx];
  },

  deleteClass: async (user: User, id: string) => {
    await delay();
    const classes = load<DBClass>(KEYS.CLASSES);
    const filtered = classes.filter(c => c.id !== id || c.school_id !== user.school_id);
    save(KEYS.CLASSES, filtered);
  },

  getAttendance: async (user: User): Promise<Attendance[]> => {
    await delay();
    if (user.role !== UserRole.TEACHER) {
      throw new Error("Permission denied: Teachers only.");
    }

    const classes = load<DBClass>(KEYS.CLASSES).filter(c => c.school_id === user.school_id);
    const classIds = classes.map(c => c.id);

    return load<DBAttendance>(KEYS.ATTENDANCE)
      .filter(a => classIds.includes(a.class_obj))
      .map(({ id, student, class_obj, date, status }) => ({ id, student, class_obj, date, status }));
  },

  saveAttendanceRecord: async (user: User, record: Omit<Attendance, 'id'>) => {
    await delay();
    if (user.role !== UserRole.TEACHER) {
      throw new Error("Permission denied: Teachers only.");
    }

    let attendance = load<DBAttendance>(KEYS.ATTENDANCE);
    const idx = attendance.findIndex(a => 
      a.student === record.student && 
      a.class_obj === record.class_obj && 
      a.date === record.date
    );
    
    const dbRecord: DBAttendance = {
      ...record,
      id: idx >= 0 ? attendance[idx].id : `${record.student}-${record.date}`,
      school_id: user.school_id,
      marked_by: user.id
    };

    if (idx >= 0) {
      attendance[idx] = dbRecord;
    } else {
      attendance.push(dbRecord);
    }
    save(KEYS.ATTENDANCE, attendance);

    // --- AI / Communication Trigger ---
    if (record.status === 'ABSENT') {
      const student = load<DBStudent>(KEYS.STUDENTS).find(s => s.id === record.student);
      const schools = load<School>(KEYS.SCHOOLS);
      const school = schools.find(s => s.id === user.school_id);
      
      if (student && school) {
        // Trigger AI Generation
        ai.generateMessage('attendance_alert', {
          student_name: `${student.first_name} ${student.last_name}`,
          status: 'ABSENT',
          date: record.date,
          school_name: school.name
        }).then(message => {
          console.group(`%c[AI Trigger] Message Generated for ${student.first_name}`, 'color: #8b5cf6; font-weight: bold;');
          console.log(message);
          console.groupEnd();
        });
      }
    }
  },

  getEnrollments: (user: User): Enrollment[] => {
    return load<DBEnrollment>(KEYS.ENROLLMENTS).filter(e => e.school_id === user.school_id);
  },

  getSchoolSettings: async (user: User): Promise<School> => {
    await delay();
    const schools = load<School>(KEYS.SCHOOLS);
    const school = schools.find(s => s.id === user.school_id);
    if (!school) throw new Error("School not found");
    return school;
  },

  updateSchoolSettings: async (user: User, data: Partial<School>) => {
    await delay();
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
      throw new Error("Unauthorized: Admin access required.");
    }
    const schools = load<School>(KEYS.SCHOOLS);
    const idx = schools.findIndex(s => s.id === user.school_id);
    if (idx === -1) throw new Error("School not found");
    
    // Don't allow changing subscription tier or student count via settings
    const { subscription_tier, student_count, max_students, id, code, ...rest } = data as any;
    schools[idx] = { ...schools[idx], ...rest };
    save(KEYS.SCHOOLS, schools);
    return schools[idx];
  },

  enrollStudent: async (user: User, enrollment: Enrollment) => {
    await delay();
    const enrollments = load<DBEnrollment>(KEYS.ENROLLMENTS);
    enrollments.push({ ...enrollment, school_id: user.school_id });
    save(KEYS.ENROLLMENTS, enrollments);
  },
  
  getStudentsByClass: async (user: User, classId: string): Promise<Student[]> => {
    const enrollments = load<DBEnrollment>(KEYS.ENROLLMENTS).filter(e => e.class_obj === classId);
    const students = await db.getStudents(user);
    return students.filter(s => enrollments.some(e => e.student === s.id));
  },

  getClassAnalytics: async (user: User, classId: string) => {
    await delay();
    const classObj = load<DBClass>(KEYS.CLASSES).find(c => c.id === classId);
    if (!classObj || classObj.school_id !== user.school_id) {
      throw new Error("Class not found or access denied.");
    }
    const schools = load<School>(KEYS.SCHOOLS);
    const school = schools.find(s => s.id === user.school_id);

    // Aggregate Data
    const students = await db.getStudentsByClass(user, classId);
    if (students.length === 0) return { summary: "No students enrolled to analyze." };

    const attendanceRecords = load<DBAttendance>(KEYS.ATTENDANCE).filter(a => a.class_obj === classId);
    
    // Calculate Stats
    let totalPossible = 0;
    let totalPresent = 0;
    let atRiskCount = 0;

    students.forEach(s => {
      const sRecords = attendanceRecords.filter(a => a.student === s.id);
      if (sRecords.length > 0) {
        const sPresent = sRecords.filter(a => a.status === 'PRESENT').length;
        const sRate = (sPresent / sRecords.length) * 100;
        
        totalPossible += sRecords.length;
        totalPresent += sPresent;

        if (sRate < 75) atRiskCount++;
      }
    });

    const averageAttendance = totalPossible > 0 ? (totalPresent / totalPossible) * 100 : 0;

    // Call AI Layer
    const summary = await ai.generateClassInsight({
      className: `${classObj.name} (${classObj.section})`,
      totalStudents: students.length,
      averageAttendance,
      atRiskCount,
      schoolName: school?.name || 'School'
    });

    return { summary };
  },

  // --- Finance Module Methods ---

  getFeeCategories: async (user: User): Promise<FeeCategory[]> => {
    await delay();
    return load<FeeCategory>(KEYS.FEE_CATEGORIES).filter(fc => fc.school_id === user.school_id);
  },

  deleteFeeCategory: async (user: User, id: string) => {
    await delay();
    const categories = load<FeeCategory>(KEYS.FEE_CATEGORIES);
    const filtered = categories.filter(c => c.id !== id || c.school_id !== user.school_id);
    save(KEYS.FEE_CATEGORIES, filtered);
  },

  createFeeCategory: async (user: User, data: Omit<FeeCategory, 'id' | 'school_id'>) => {
    await delay();
    const categories = load<FeeCategory>(KEYS.FEE_CATEGORIES);
    categories.push({
      ...data,
      id: `fc${Date.now()}`,
      school_id: user.school_id
    });
    save(KEYS.FEE_CATEGORIES, categories);
  },

  getStudentFees: async (user: User): Promise<StudentFee[]> => {
    await delay();
    const allFees = load<StudentFee>(KEYS.STUDENT_FEES);
    const categories = load<FeeCategory>(KEYS.FEE_CATEGORIES);

    // If Parent, only return own student's fees
    let fees = [];
    if (user.role === UserRole.PARENT && user.student_id) {
      fees = allFees.filter(f => f.student_id === user.student_id);
    } else {
      // Admin sees all fees for school
      fees = allFees.filter(f => f.school_id === user.school_id);
    }

    // Enhance with Category Name
    return fees.map(f => ({
      ...f,
      category_name: categories.find(c => c.id === f.category_id)?.name || 'Unknown Fee'
    }));
  },

  assignFee: async (user: User, data: { student_id: string, category_id: string, due_date: string }) => {
    await delay();
    const category = load<FeeCategory>(KEYS.FEE_CATEGORIES).find(c => c.id === data.category_id);
    if (!category) throw new Error("Category not found");

    const fees = load<StudentFee>(KEYS.STUDENT_FEES);
    fees.push({
      id: `sf${Date.now()}`,
      student_id: data.student_id,
      category_id: data.category_id,
      due_date: data.due_date,
      amount: category.amount,
      is_paid: false,
      school_id: user.school_id
    });
    save(KEYS.STUDENT_FEES, fees);
  },

  processPayment: async (user: User, data: { fee_id: string, method: string }) => {
    await delay(); // Simulate Gateway Latency
    const fees = load<StudentFee>(KEYS.STUDENT_FEES);
    const feeIdx = fees.findIndex(f => f.id === data.fee_id);
    
    if (feeIdx === -1) throw new Error("Fee record not found");
    if (fees[feeIdx].is_paid) throw new Error("Fee already paid");

    // Update Fee Status
    fees[feeIdx].is_paid = true;
    fees[feeIdx].paid_on = new Date().toISOString().split('T')[0];
    save(KEYS.STUDENT_FEES, fees);

    // Record Payment
    const payments = load<Payment>(KEYS.PAYMENTS);
    const transactionId = `txn_${Date.now()}`;
    payments.push({
      id: `pay${Date.now()}`,
      fee_id: data.fee_id,
      amount: fees[feeIdx].amount,
      date: fees[feeIdx].paid_on!,
      method: data.method,
      transaction_id: transactionId,
      status: 'SUCCESS',
      school_id: user.school_id
    });
    save(KEYS.PAYMENTS, payments);

    // Audit Log (Ledger)
    const schools = load<School>(KEYS.SCHOOLS);
    const school = schools.find(s => s.id === user.school_id);
    console.log(`%c[Ledger] Payment Received: $${fees[feeIdx].amount} | TXN: ${transactionId}`, 'color: green; font-weight: bold;');

    // AI Receipt Trigger
    const student = load<DBStudent>(KEYS.STUDENTS).find(s => s.id === fees[feeIdx].student_id);
    const category = load<FeeCategory>(KEYS.FEE_CATEGORIES).find(c => c.id === fees[feeIdx].category_id);

    if (student && category && school) {
      ai.generateMessage('payment_receipt', {
        transaction_id: transactionId,
        amount: fees[feeIdx].amount,
        fee_name: category.name,
        student_name: `${student.first_name} ${student.last_name}`,
        date: fees[feeIdx].paid_on,
        method: data.method,
        school_name: school.name
      }).then(msg => {
        console.group(`%c[AI Trigger] Payment Receipt Sent`, 'color: #8b5cf6; font-weight: bold;');
        console.log(msg);
        console.groupEnd();
      });
    }

    return { success: true, transaction_id: transactionId };
  },

  getPayments: async (user: User): Promise<Payment[]> => {
    await delay();
    const allPayments = load<Payment>(KEYS.PAYMENTS);
    if (user.role === UserRole.PARENT && user.student_id) {
      // Find fees for this student to filter payments
      const studentFees = load<StudentFee>(KEYS.STUDENT_FEES).filter(f => f.student_id === user.student_id);
      const feeIds = studentFees.map(f => f.id);
      return allPayments.filter(p => feeIds.includes(p.fee_id));
    }
    return allPayments.filter(p => p.school_id === user.school_id);
  },

  // Staff Methods
  getStaff: async (user: User): Promise<Staff[]> => {
    await delay();
    return load<Staff>(KEYS.STAFF).filter(s => s.school_id === user.school_id);
  },

  addStaff: async (user: User, data: Omit<Staff, 'id'>) => {
    await delay();
    const staff = load<Staff>(KEYS.STAFF);
    const newStaff: Staff = {
      ...data,
      id: `st${Date.now()}`,
      school_id: user.school_id,
      is_active: true
    };
    staff.push(newStaff);
    save(KEYS.STAFF, staff);
    return newStaff;
  },

  updateStaff: async (user: User, id: string, data: Partial<Staff>) => {
    await delay();
    const staff = load<Staff>(KEYS.STAFF);
    const idx = staff.findIndex(s => s.id === id && s.school_id === user.school_id);
    if (idx === -1) throw new Error("Staff member not found");
    staff[idx] = { ...staff[idx], ...data };
    save(KEYS.STAFF, staff);
    return staff[idx];
  },

  deleteStaff: async (user: User, id: string) => {
    await delay();
    const staff = load<Staff>(KEYS.STAFF);
    const filtered = staff.filter(s => s.id !== id || s.school_id !== user.school_id);
    save(KEYS.STAFF, filtered);
  },

  // Subject Methods
  getSubjects: async (user: User): Promise<Subject[]> => {
    await delay();
    return load<Subject>(KEYS.SUBJECTS).filter(s => s.school_id === user.school_id);
  },

  addSubject: async (user: User, data: Omit<Subject, 'id'>) => {
    await delay();
    const subjects = load<Subject>(KEYS.SUBJECTS);
    const newSubject: Subject = {
      ...data,
      id: `sub${Date.now()}`,
      school_id: user.school_id
    };
    subjects.push(newSubject);
    save(KEYS.SUBJECTS, subjects);
    return newSubject;
  },

  deleteSubject: async (user: User, id: string) => {
    await delay();
    const subjects = load<Subject>(KEYS.SUBJECTS);
    const filtered = subjects.filter(s => s.id !== id || s.school_id !== user.school_id);
    save(KEYS.SUBJECTS, filtered);
  },

  // Exam Methods
  getExams: async (user: User): Promise<Exam[]> => {
    await delay();
    return load<Exam>(KEYS.EXAMS).filter(e => e.school_id === user.school_id);
  },
  addExam: async (user: User, data: Omit<Exam, 'id'>) => {
    await delay();
    const exams = load<Exam>(KEYS.EXAMS);
    const newExam: Exam = { ...data, id: `e${Date.now()}`, school_id: user.school_id };
    exams.push(newExam);
    save(KEYS.EXAMS, exams);
    return newExam;
  },
  deleteExam: async (user: User, id: string) => {
    await delay();
    const exams = load<Exam>(KEYS.EXAMS);
    const filtered = exams.filter(e => e.id !== id || e.school_id !== user.school_id);
    save(KEYS.EXAMS, filtered);
  },

  // Result Methods
  getExamResults: async (user: User, examId: string): Promise<ExamResult[]> => {
    await delay();
    return load<ExamResult>(KEYS.EXAM_RESULTS).filter(r => r.exam_id === examId && r.school_id === user.school_id);
  },
  saveExamResults: async (user: User, examId: string, results: Omit<ExamResult, 'id' | 'school_id'>[]) => {
    await delay();
    let allResults = load<ExamResult>(KEYS.EXAM_RESULTS);
    // Remove existing results for this exam to overwrite
    allResults = allResults.filter(r => r.exam_id !== examId || r.school_id !== user.school_id);
    
    const newResults = results.map(r => ({
      ...r,
      id: `er${Math.random().toString(36).substr(2, 9)}`,
      school_id: user.school_id
    }));
    
    allResults.push(...newResults);
    save(KEYS.EXAM_RESULTS, allResults);
    return newResults;
  },

  // Affiliate Methods
  getAffiliate: async (user: User): Promise<Affiliate | null> => {
    await delay();
    return load<Affiliate>(KEYS.AFFILIATES).find(a => a.user_id === user.id) || null;
  },

  registerAffiliate: async (user: User): Promise<Affiliate> => {
    await delay();
    const affiliates = load<Affiliate>(KEYS.AFFILIATES);
    const existing = affiliates.find(a => a.user_id === user.id);
    if (existing) return existing;

    const newAffiliate: Affiliate = {
      id: `aff_${Date.now()}`,
      user_id: user.id,
      referral_code: `REF${user.id.toUpperCase()}${Math.floor(Math.random() * 1000)}`,
      total_earnings: 0,
      balance: 0,
      referral_count: 0,
      status: AffiliateStatus.PENDING,
      created_at: new Date().toISOString()
    };
    affiliates.push(newAffiliate);
    save(KEYS.AFFILIATES, affiliates);
    return newAffiliate;
  },

  getReferrals: async (user: User): Promise<Referral[]> => {
    await delay();
    const affiliate = load<Affiliate>(KEYS.AFFILIATES).find(a => a.user_id === user.id);
    if (!affiliate) return [];
    return load<Referral>(KEYS.REFERRALS).filter(r => r.affiliate_id === affiliate.id);
  },

  // Super Admin Methods
  getAllUsers: async (user: User): Promise<User[]> => {
    await delay();
    if (user.role !== UserRole.SUPER_ADMIN) {
      throw new Error("Unauthorized: Super Admin access required.");
    }
    const users = load<User>(KEYS.USERS);
    const schools = load<School>(KEYS.SCHOOLS);
    
    return users.map(u => ({
      ...u,
      password: undefined, // Don't send passwords
      school_name: schools.find(s => s.id === u.school_id)?.name
    }));
  },

  getSchools: async (user: User): Promise<School[]> => {
    await delay();
    if (user.role !== UserRole.SUPER_ADMIN) {
      throw new Error("Unauthorized: Super Admin access required.");
    }
    return load<School>(KEYS.SCHOOLS);
  },

  onboardSchool: async (user: User, data: { name: string; code: string; contact_email: string; subscription_tier: SubscriptionTier; max_students: number; admin_name: string; admin_password?: string }) => {
    await delay();
    if (user.role !== UserRole.SUPER_ADMIN) {
      throw new Error("Unauthorized: Super Admin access required.");
    }
    const schools = load<School>(KEYS.SCHOOLS);
    const users = load<User>(KEYS.USERS);
    
    const schoolId = `school-${Date.now()}`;
    const newSchool: School = {
      id: schoolId,
      name: data.name,
      code: data.code,
      contact_email: data.contact_email,
      subscription_tier: data.subscription_tier,
      max_students: data.max_students,
      student_count: 0,
      is_active: true,
      timezone: 'UTC',
      locale: 'en-US',
      created_at: new Date().toISOString()
    };
    
    const newAdmin: User = {
      id: `u-${Date.now()}`,
      email: data.contact_email,
      name: data.admin_name,
      password: data.admin_password || 'admin123',
      role: UserRole.ADMIN,
      school_id: schoolId,
      school_name: data.name
    };
    
    schools.push(newSchool);
    users.push(newAdmin);
    
    save(KEYS.SCHOOLS, schools);
    save(KEYS.USERS, users);
    
    return { school: newSchool, admin: newAdmin };
  },

  getAllAffiliates: async (user: User): Promise<Affiliate[]> => {
    await delay();
    if (user.role !== UserRole.SUPER_ADMIN) {
      throw new Error("Unauthorized: Super Admin access required.");
    }
    const affiliates = load<Affiliate>(KEYS.AFFILIATES);
    const users = load<User>(KEYS.USERS);
    
    return affiliates.map(a => {
      const u = users.find(u => u.id === a.user_id);
      return {
        ...a,
        user_name: u?.name,
        user_email: u?.email
      };
    });
  },

  onboardAffiliate: async (user: User, data: { name: string; email: string; password?: string; referral_code?: string }) => {
    await delay();
    if (user.role !== UserRole.SUPER_ADMIN) {
      throw new Error("Unauthorized: Super Admin access required.");
    }
    const users = load<User>(KEYS.USERS);
    const affiliates = load<Affiliate>(KEYS.AFFILIATES);
    
    const userId = `u-aff-${Date.now()}`;
    const newUser: User = {
      id: userId,
      email: data.email,
      name: data.name,
      password: data.password || 'affiliate123',
      role: UserRole.PARENT, // Using PARENT as a placeholder for affiliate users if no specific role exists
      // Actually, I should probably add an AFFILIATE role if it doesn't exist.
      // Let me check UserRole.
    };
    
    const newAffiliate: Affiliate = {
      id: `aff-${Date.now()}`,
      user_id: userId,
      referral_code: data.referral_code || `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      total_earnings: 0,
      balance: 0,
      referral_count: 0,
      status: AffiliateStatus.ACTIVE,
      created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    affiliates.push(newAffiliate);
    
    save(KEYS.USERS, users);
    save(KEYS.AFFILIATES, affiliates);
    
    return { user: newUser, affiliate: newAffiliate };
  },

  updateAffiliateStatus: async (user: User, id: string, status: AffiliateStatus) => {
    await delay();
    if (user.role !== UserRole.SUPER_ADMIN) {
      throw new Error("Unauthorized: Super Admin access required.");
    }
    const affiliates = load<Affiliate>(KEYS.AFFILIATES);
    const idx = affiliates.findIndex(a => a.id === id);
    if (idx === -1) throw new Error("Affiliate not found");
    
    affiliates[idx].status = status;
    save(KEYS.AFFILIATES, affiliates);
    return affiliates[idx];
  },

  updateSchool: async (user: User, id: string, data: Partial<School>) => {
    await delay();
    if (user.role !== UserRole.SUPER_ADMIN) {
      throw new Error("Unauthorized: Super Admin access required.");
    }
    const schools = load<School>(KEYS.SCHOOLS);
    const idx = schools.findIndex(s => s.id === id);
    if (idx === -1) throw new Error("School not found");
    
    schools[idx] = { ...schools[idx], ...data };
    save(KEYS.SCHOOLS, schools);
    return schools[idx];
  },

  getAllSchoolsStats: async (user: User) => {
    await delay();
    if (user.role !== UserRole.SUPER_ADMIN) {
      throw new Error("Unauthorized: Super Admin access required.");
    }

    const schools = load<School>(KEYS.SCHOOLS);
    const allUsers = load<User>(KEYS.USERS);
    const allStudents = load<DBStudent>(KEYS.STUDENTS);
    const allClasses = load<DBClass>(KEYS.CLASSES);

    return schools.map(school => {
      const schoolStudents = allStudents.filter(s => s.school_id === school.id);
      const schoolStaff = allUsers.filter(u => u.school_id === school.id && (u.role === UserRole.TEACHER || u.role === UserRole.ADMIN));
      const schoolClasses = allClasses.filter(c => c.school_id === school.id);

      return {
        id: school.id,
        name: school.name,
        code: school.code,
        studentCount: schoolStudents.length,
        staffCount: schoolStaff.length,
        classCount: schoolClasses.length,
        isActive: school.is_active,
        subscriptionTier: school.subscription_tier,
        maxStudents: school.max_students
      };
    });
  },

  // Timetable Methods
  getTimetableByClass: async (user: User, classId: string): Promise<TimetableEntry[]> => {
    await delay();
    const timetable = load<TimetableEntry>(KEYS.TIMETABLE);
    const classes = load<DBClass>(KEYS.CLASSES);
    
    // Security check: class must belong to same school
    const classObj = classes.find(c => c.id === classId);
    if (!classObj || classObj.school_id !== user.school_id) {
      throw new Error("Class not found or access denied.");
    }

    return timetable.filter(t => t.class_id === classId);
  },

  getTimetableByTeacher: async (user: User, teacherId: string): Promise<TimetableEntry[]> => {
    await delay();
    const timetable = load<TimetableEntry>(KEYS.TIMETABLE);
    const users = load<User>(KEYS.USERS);
    
    // Security check: teacher must belong to same school
    const teacher = users.find(u => u.id === teacherId);
    if (!teacher || teacher.school_id !== user.school_id) {
      throw new Error("Teacher not found or access denied.");
    }

    return timetable.filter(t => t.teacher_id === teacherId);
  },

  // Support Ticket Methods
  getTickets: async (user: User): Promise<SupportTicket[]> => {
    await delay();
    const tickets = load<SupportTicket>(KEYS.TICKETS);
    if (user.role === UserRole.SUPER_ADMIN) {
      return tickets;
    }
    return tickets.filter(t => t.school_id === user.school_id);
  },

  createTicket: async (user: User, data: Partial<SupportTicket>): Promise<SupportTicket> => {
    await delay();
    const tickets = load<SupportTicket>(KEYS.TICKETS);
    const newTicket: SupportTicket = {
      id: `t${Date.now()}`,
      school_id: user.school_id || '',
      school_name: user.school_name || 'Unknown',
      user_id: user.id,
      user_name: user.name,
      subject: data.subject || '',
      description: data.description || '',
      status: TicketStatus.OPEN,
      priority: data.priority || TicketPriority.MEDIUM,
      category: data.category || 'General',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    tickets.push(newTicket);
    save(KEYS.TICKETS, tickets);
    return newTicket;
  },

  updateTicket: async (user: User, id: string, data: Partial<SupportTicket>): Promise<SupportTicket> => {
    await delay();
    const tickets = load<SupportTicket>(KEYS.TICKETS);
    const idx = tickets.findIndex(t => t.id === id);
    if (idx === -1) throw new Error("Ticket not found");
    
    // Only super admin or the school admin who created it can update
    if (user.role !== UserRole.SUPER_ADMIN && tickets[idx].school_id !== user.school_id) {
      throw new Error("Unauthorized");
    }

    tickets[idx] = { ...tickets[idx], ...data, updated_at: new Date().toISOString() };
    save(KEYS.TICKETS, tickets);
    return tickets[idx];
  },

  // Payroll Methods
  getSalaries: async (user: User): Promise<StaffSalary[]> => {
    await delay();
    const salaries = load<StaffSalary>(KEYS.SALARIES);
    const staff = load<Staff>(KEYS.STAFF);
    
    return salaries
      .filter(s => s.school_id === user.school_id)
      .map(s => ({
        ...s,
        staff_name: staff.find(st => st.id === s.staff_id)?.name || 'Unknown Staff'
      }));
  },

  generateSalaries: async (user: User, month: string) => {
    await delay();
    const staff = load<Staff>(KEYS.STAFF).filter(s => s.school_id === user.school_id && s.is_active);
    const salaries = load<StaffSalary>(KEYS.SALARIES);
    
    staff.forEach(st => {
      // Check if already generated
      const exists = salaries.find(s => s.staff_id === st.id && s.month === month);
      if (!exists) {
        const basic = st.role === 'TEACHER' ? 3000 : 2000;
        salaries.push({
          id: `sal-${Date.now()}-${st.id}`,
          staff_id: st.id,
          staff_name: st.name,
          basic_salary: basic,
          allowances: 200,
          deductions: 0,
          net_salary: basic + 200,
          month,
          status: SalaryStatus.PENDING,
          school_id: user.school_id
        });
      }
    });
    
    save(KEYS.SALARIES, salaries);
  },

  paySalary: async (user: User, id: string, method: string) => {
    await delay();
    const salaries = load<StaffSalary>(KEYS.SALARIES);
    const idx = salaries.findIndex(s => s.id === id && s.school_id === user.school_id);
    if (idx !== -1) {
      salaries[idx].status = SalaryStatus.PAID;
      salaries[idx].paid_date = new Date().toISOString().split('T')[0];
      salaries[idx].payment_method = method;
      save(KEYS.SALARIES, salaries);
    }
  },

  // Leave Methods
  getLeaveRequests: async (user: User): Promise<LeaveRequest[]> => {
    await delay();
    const requests = load<LeaveRequest>(KEYS.LEAVE_REQUESTS);
    const staff = load<Staff>(KEYS.STAFF);
    
    if (user.role === UserRole.TEACHER) {
      const teacherStaff = staff.find(s => s.user_id === user.id);
      return requests.filter(r => r.staff_id === teacherStaff?.id);
    }
    
    return requests
      .filter(r => r.school_id === user.school_id)
      .map(r => ({
        ...r,
        staff_name: staff.find(st => st.id === r.staff_id)?.name || 'Unknown Staff'
      }));
  },

  createLeaveRequest: async (user: User, data: Omit<LeaveRequest, 'id' | 'status' | 'school_id'>) => {
    await delay();
    const staff = load<Staff>(KEYS.STAFF);
    const teacherStaff = staff.find(s => s.user_id === user.id);
    if (!teacherStaff) throw new Error("Staff profile not found");

    const requests = load<LeaveRequest>(KEYS.LEAVE_REQUESTS);
    requests.push({
      ...data,
      id: `lr-${Date.now()}`,
      staff_id: teacherStaff.id,
      staff_name: teacherStaff.name,
      status: 'PENDING',
      school_id: user.school_id
    });
    save(KEYS.LEAVE_REQUESTS, requests);
  },

  updateLeaveStatus: async (user: User, id: string, status: 'APPROVED' | 'REJECTED') => {
    await delay();
    const requests = load<LeaveRequest>(KEYS.LEAVE_REQUESTS);
    const idx = requests.findIndex(r => r.id === id && r.school_id === user.school_id);
    if (idx !== -1) {
      requests[idx].status = status;
      save(KEYS.LEAVE_REQUESTS, requests);
    }
  },

  // Report Card Methods
  getReportCards: async (user: User, studentId?: string): Promise<ReportCard[]> => {
    await delay();
    const reports = load<ReportCard>(KEYS.REPORT_CARDS);
    if (user.role === UserRole.PARENT && user.student_id) {
      return reports.filter(r => r.student_id === user.student_id);
    }
    if (studentId) {
      return reports.filter(r => r.student_id === studentId);
    }
    return reports.filter(r => r.school_id === user.school_id);
  },

  generateReportCard: async (user: User, studentId: string, term: string, academicYear: string) => {
    await delay();
    const students = load<DBStudent>(KEYS.STUDENTS);
    const student = students.find(s => s.id === studentId);
    if (!student) throw new Error("Student not found");

    const enrollments = load<DBEnrollment>(KEYS.ENROLLMENTS);
    const enrollment = enrollments.find(e => e.student === studentId && e.academic_year === academicYear);
    if (!enrollment) throw new Error("Student not enrolled for this academic year");

    const classes = load<DBClass>(KEYS.CLASSES);
    const classObj = classes.find(c => c.id === enrollment.class_obj);

    const exams = load<Exam>(KEYS.EXAMS).filter(e => e.class_id === enrollment.class_obj && e.school_id === user.school_id);
    const results = load<ExamResult>(KEYS.EXAM_RESULTS).filter(r => r.student_id === studentId);
    const subjects = load<Subject>(KEYS.SUBJECTS);

    const reportSubjects: ReportCardSubject[] = [];
    let totalMarks = 0;
    let obtainedMarks = 0;

    exams.forEach(exam => {
      const result = results.find(r => r.exam_id === exam.id);
      const subject = subjects.find(s => s.id === exam.subject_id);
      
      if (result && subject) {
        const percentage = (result.marks_obtained / exam.total_marks) * 100;
        let grade = 'F';
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B';
        else if (percentage >= 60) grade = 'C';
        else if (percentage >= 50) grade = 'D';

        reportSubjects.push({
          subject_id: subject.id,
          subject_name: subject.name,
          marks_obtained: result.marks_obtained,
          total_marks: exam.total_marks,
          grade,
          remarks: result.remarks
        });

        totalMarks += exam.total_marks;
        obtainedMarks += result.marks_obtained;
      }
    });

    const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
    let finalGrade = 'F';
    if (percentage >= 90) finalGrade = 'A+';
    else if (percentage >= 80) finalGrade = 'A';
    else if (percentage >= 70) finalGrade = 'B';
    else if (percentage >= 60) finalGrade = 'C';
    else if (percentage >= 50) finalGrade = 'D';

    const reportCards = load<ReportCard>(KEYS.REPORT_CARDS);
    const newReport: ReportCard = {
      id: `rc-${Date.now()}`,
      student_id: studentId,
      student_name: `${student.first_name} ${student.last_name}`,
      class_id: enrollment.class_obj,
      class_name: classObj ? `${classObj.name} (${classObj.section})` : 'Unknown',
      academic_year: academicYear,
      term,
      subjects: reportSubjects,
      total_marks: totalMarks,
      obtained_marks: obtainedMarks,
      percentage,
      grade: finalGrade,
      attendance_percentage: 95, // Mock attendance
      teacher_remarks: "Good performance, keep it up.",
      issue_date: new Date().toISOString().split('T')[0],
      school_id: user.school_id
    };

    reportCards.push(newReport);
    save(KEYS.REPORT_CARDS, reportCards);
    return newReport;
  },

  // Library Methods
  getBooks: async (user: User): Promise<Book[]> => {
    await delay();
    return load<Book>(KEYS.BOOKS).filter(b => b.school_id === user.school_id);
  },

  addBook: async (user: User, data: Omit<Book, 'id' | 'school_id'>) => {
    await delay();
    const books = load<Book>(KEYS.BOOKS);
    books.push({
      ...data,
      id: `b${Date.now()}`,
      school_id: user.school_id,
      available_quantity: data.quantity
    });
    save(KEYS.BOOKS, books);
  },

  updateBook: async (user: User, id: string, data: Partial<Book>) => {
    await delay();
    const books = load<Book>(KEYS.BOOKS);
    const idx = books.findIndex(b => b.id === id && b.school_id === user.school_id);
    if (idx === -1) throw new Error("Book not found");
    
    // If quantity changed, adjust available_quantity
    if (data.quantity !== undefined) {
      const diff = data.quantity - books[idx].quantity;
      data.available_quantity = books[idx].available_quantity + diff;
    }

    books[idx] = { ...books[idx], ...data };
    save(KEYS.BOOKS, books);
  },

  deleteBook: async (user: User, id: string) => {
    await delay();
    const books = load<Book>(KEYS.BOOKS);
    const filtered = books.filter(b => b.id !== id || b.school_id !== user.school_id);
    save(KEYS.BOOKS, filtered);
  },

  getLibraryTransactions: async (user: User): Promise<LibraryTransaction[]> => {
    await delay();
    const transactions = load<LibraryTransaction>(KEYS.LIBRARY_TRANSACTIONS).filter(t => t.school_id === user.school_id);
    const books = load<Book>(KEYS.BOOKS);
    const students = load<DBStudent>(KEYS.STUDENTS);

    return transactions.map(t => ({
      ...t,
      book_title: books.find(b => b.id === t.book_id)?.title,
      student_name: students.find(s => s.id === t.student_id)?.first_name + ' ' + students.find(s => s.id === t.student_id)?.last_name
    }));
  },

  issueBook: async (user: User, data: { book_id: string, student_id: string, due_date: string }) => {
    await delay();
    const books = load<Book>(KEYS.BOOKS);
    const bookIdx = books.findIndex(b => b.id === data.book_id && b.school_id === user.school_id);
    
    if (bookIdx === -1) throw new Error("Book not found");
    if (books[bookIdx].available_quantity <= 0) throw new Error("Book not available");

    // Update book availability
    books[bookIdx].available_quantity -= 1;
    save(KEYS.BOOKS, books);

    // Create transaction
    const transactions = load<LibraryTransaction>(KEYS.LIBRARY_TRANSACTIONS);
    transactions.push({
      id: `lt${Date.now()}`,
      book_id: data.book_id,
      student_id: data.student_id,
      issue_date: new Date().toISOString().split('T')[0],
      due_date: data.due_date,
      fine_amount: 0,
      status: 'ISSUED',
      school_id: user.school_id
    });
    save(KEYS.LIBRARY_TRANSACTIONS, transactions);
  },

  // LMS Methods
  getAssignments: async (user: User): Promise<Assignment[]> => {
    await delay();
    const assignments = load<Assignment>(KEYS.ASSIGNMENTS).filter(a => a.school_id === user.school_id);
    const subjects = load<Subject>(KEYS.SUBJECTS);
    const classes = load<DBClass>(KEYS.CLASSES);
    const users = load<User>(KEYS.USERS);

    return assignments.map(a => ({
      ...a,
      subject_name: subjects.find(s => s.id === a.subject_id)?.name,
      class_name: classes.find(c => c.id === a.class_id)?.name + ' (' + classes.find(c => c.id === a.class_id)?.section + ')',
      teacher_name: users.find(u => u.id === a.created_by)?.name
    }));
  },

  createAssignment: async (user: User, data: Omit<Assignment, 'id' | 'school_id' | 'created_by' | 'status'>) => {
    await delay();
    const assignments = load<Assignment>(KEYS.ASSIGNMENTS);
    assignments.push({
      ...data,
      id: `asgn${Date.now()}`,
      school_id: user.school_id,
      created_by: user.id,
      status: 'ACTIVE'
    });
    save(KEYS.ASSIGNMENTS, assignments);
  },

  updateAssignment: async (user: User, id: string, data: Partial<Assignment>) => {
    await delay();
    const assignments = load<Assignment>(KEYS.ASSIGNMENTS);
    const idx = assignments.findIndex(a => a.id === id && a.school_id === user.school_id);
    if (idx === -1) throw new Error("Assignment not found");
    assignments[idx] = { ...assignments[idx], ...data };
    save(KEYS.ASSIGNMENTS, assignments);
  },

  deleteAssignment: async (user: User, id: string) => {
    await delay();
    const assignments = load<Assignment>(KEYS.ASSIGNMENTS);
    const filtered = assignments.filter(a => a.id !== id || a.school_id !== user.school_id);
    save(KEYS.ASSIGNMENTS, filtered);
  },

  getSubmissions: async (user: User, assignmentId?: string): Promise<Submission[]> => {
    await delay();
    let submissions = load<Submission>(KEYS.SUBMISSIONS).filter(s => s.school_id === user.school_id);
    if (assignmentId) {
      submissions = submissions.filter(s => s.assignment_id === assignmentId);
    }
    
    // If student, only see their own
    if (user.role === UserRole.PARENT && user.student_id) {
        submissions = submissions.filter(s => s.student_id === user.student_id);
    }

    const students = load<DBStudent>(KEYS.STUDENTS);
    const assignments = load<Assignment>(KEYS.ASSIGNMENTS);

    return submissions.map(s => ({
      ...s,
      student_name: students.find(st => st.id === s.student_id)?.first_name + ' ' + students.find(st => st.id === s.student_id)?.last_name,
      assignment_title: assignments.find(a => a.id === s.assignment_id)?.title
    }));
  },

  submitAssignment: async (user: User, data: { assignment_id: string, text_answer?: string, file_url?: string }) => {
    await delay();
    if (!user.student_id) throw new Error("Only students can submit assignments");

    const submissions = load<Submission>(KEYS.SUBMISSIONS);
    const newSubmission: Submission = {
      id: `subm${Date.now()}`,
      assignment_id: data.assignment_id,
      student_id: user.student_id,
      submitted_at: new Date().toISOString(),
      text_answer: data.text_answer,
      file_url: data.file_url,
      status: 'PENDING',
      school_id: user.school_id
    };
    submissions.push(newSubmission);
    save(KEYS.SUBMISSIONS, submissions);
  },

  gradeSubmission: async (user: User, submissionId: string, data: { marks: number, feedback: string }) => {
    await delay();
    const submissions = load<Submission>(KEYS.SUBMISSIONS);
    const idx = submissions.findIndex(s => s.id === submissionId && s.school_id === user.school_id);
    if (idx === -1) throw new Error("Submission not found");

    submissions[idx] = {
      ...submissions[idx],
      obtained_marks: data.marks,
      feedback: data.feedback,
      status: 'GRADED'
    };
    save(KEYS.SUBMISSIONS, submissions);
  },

  returnBook: async (user: User, transactionId: string) => {
    await delay();
    const transactions = load<LibraryTransaction>(KEYS.LIBRARY_TRANSACTIONS);
    const tIdx = transactions.findIndex(t => t.id === transactionId && t.school_id === user.school_id);
    
    if (tIdx === -1) throw new Error("Transaction not found");
    if (transactions[tIdx].status === 'RETURNED') throw new Error("Book already returned");

    // Update transaction
    transactions[tIdx].status = 'RETURNED';
    transactions[tIdx].return_date = new Date().toISOString().split('T')[0];
    save(KEYS.LIBRARY_TRANSACTIONS, transactions);

    // Update book availability
    const books = load<Book>(KEYS.BOOKS);
    const bookIdx = books.findIndex(b => b.id === transactions[tIdx].book_id);
    if (bookIdx !== -1) {
      books[bookIdx].available_quantity += 1;
      save(KEYS.BOOKS, books);
    }
  },

  // Blog Methods
  getBlogPosts: async (): Promise<BlogPost[]> => {
    await delay();
    return load<BlogPost>(KEYS.BLOG_POSTS).filter(p => p.is_published);
  },

  // --- Transport Methods ---
  getVehicles: async (user: User): Promise<Vehicle[]> => {
    await delay();
    return load<Vehicle>(KEYS.VEHICLES).filter(v => v.school_id === user.school_id);
  },
  addVehicle: async (user: User, data: Omit<Vehicle, 'id' | 'school_id'>) => {
    await delay();
    const vehicles = load<Vehicle>(KEYS.VEHICLES);
    const newVehicle = { ...data, id: `v${Date.now()}`, school_id: user.school_id };
    vehicles.push(newVehicle as Vehicle);
    save(KEYS.VEHICLES, vehicles);
    return newVehicle as Vehicle;
  },
  updateVehicle: async (user: User, id: string, data: Partial<Vehicle>) => {
    await delay();
    const vehicles = load<Vehicle>(KEYS.VEHICLES);
    const idx = vehicles.findIndex(v => v.id === id && v.school_id === user.school_id);
    if (idx === -1) throw new Error("Vehicle not found");
    vehicles[idx] = { ...vehicles[idx], ...data };
    save(KEYS.VEHICLES, vehicles);
  },
  deleteVehicle: async (user: User, id: string) => {
    await delay();
    const vehicles = load<Vehicle>(KEYS.VEHICLES);
    const filtered = vehicles.filter(v => v.id !== id || v.school_id !== user.school_id);
    save(KEYS.VEHICLES, filtered);
  },

  getRoutes: async (user: User): Promise<Route[]> => {
    await delay();
    const routes = load<Route>(KEYS.ROUTES).filter(r => r.school_id === user.school_id);
    const vehicles = load<Vehicle>(KEYS.VEHICLES);
    const staff = load<Staff>(KEYS.STAFF);

    return routes.map(r => ({
      ...r,
      assignedVehicleNumber: vehicles.find(v => v.id === r.assignedVehicleId)?.vehicleNumber,
      inChargeStaffName: staff.find(s => s.id === r.inChargeStaffId)?.name
    }));
  },
  addRoute: async (user: User, data: Omit<Route, 'id' | 'school_id'>) => {
    await delay();
    const routes = load<Route>(KEYS.ROUTES);
    const newRoute = { ...data, id: `r${Date.now()}`, school_id: user.school_id };
    routes.push(newRoute as Route);
    save(KEYS.ROUTES, routes);
    return newRoute as Route;
  },
  updateRoute: async (user: User, id: string, data: Partial<Route>) => {
    await delay();
    const routes = load<Route>(KEYS.ROUTES);
    const idx = routes.findIndex(r => r.id === id && r.school_id === user.school_id);
    if (idx === -1) throw new Error("Route not found");
    routes[idx] = { ...routes[idx], ...data };
    save(KEYS.ROUTES, routes);
  },
  deleteRoute: async (user: User, id: string) => {
    await delay();
    const routes = load<Route>(KEYS.ROUTES);
    const filtered = routes.filter(r => r.id !== id || r.school_id !== user.school_id);
    save(KEYS.ROUTES, filtered);
  },

  getTransportAllocations: async (user: User): Promise<StudentTransportAllocation[]> => {
    await delay();
    const allocations = load<StudentTransportAllocation>(KEYS.TRANSPORT_ALLOCATIONS).filter(a => a.school_id === user.school_id);
    const students = load<DBStudent>(KEYS.STUDENTS);
    const routes = load<Route>(KEYS.ROUTES);
    const enrollments = load<DBEnrollment>(KEYS.ENROLLMENTS);
    const classes = load<DBClass>(KEYS.CLASSES);

    return allocations.map(a => {
      const student = students.find(s => s.id === a.studentId);
      const route = routes.find(r => r.id === a.routeId);
      const enrollment = enrollments.find(e => e.student === a.studentId);
      const classObj = classes.find(c => c.id === enrollment?.class_obj);

      return {
        ...a,
        studentName: student ? `${student.first_name} ${student.last_name}` : 'Unknown Student',
        class_name: classObj ? `${classObj.name} (${classObj.section})` : 'N/A',
        routeName: route?.name,
        pickupPointName: route?.pickupPoints.find(pp => pp.id === a.pickupPointId)?.name
      };
    });
  },
  allocateTransport: async (user: User, data: Omit<StudentTransportAllocation, 'id' | 'school_id'>) => {
    await delay();
    const allocations = load<StudentTransportAllocation>(KEYS.TRANSPORT_ALLOCATIONS);
    const newAllocation = { ...data, id: `ta${Date.now()}`, school_id: user.school_id };
    allocations.push(newAllocation as StudentTransportAllocation);
    save(KEYS.TRANSPORT_ALLOCATIONS, allocations);
    return newAllocation as StudentTransportAllocation;
  },
  updateAllocation: async (user: User, id: string, data: Partial<StudentTransportAllocation>) => {
    await delay();
    const allocations = load<StudentTransportAllocation>(KEYS.TRANSPORT_ALLOCATIONS);
    const idx = allocations.findIndex(a => a.id === id && a.school_id === user.school_id);
    if (idx === -1) throw new Error("Allocation not found");
    allocations[idx] = { ...allocations[idx], ...data };
    save(KEYS.TRANSPORT_ALLOCATIONS, allocations);
  },
  deallocateTransport: async (user: User, id: string) => {
    await delay();
    const allocations = load<StudentTransportAllocation>(KEYS.TRANSPORT_ALLOCATIONS);
    const filtered = allocations.filter(a => a.id !== id || a.school_id !== user.school_id);
    save(KEYS.TRANSPORT_ALLOCATIONS, filtered);
  },

  getTransportStats: async (user: User): Promise<TransportStats> => {
    await delay();
    const vehicles = load<Vehicle>(KEYS.VEHICLES).filter(v => v.school_id === user.school_id);
    const routes = load<Route>(KEYS.ROUTES).filter(r => r.school_id === user.school_id && r.status === 'ACTIVE');
    const allocations = load<StudentTransportAllocation>(KEYS.TRANSPORT_ALLOCATIONS).filter(a => a.school_id === user.school_id);

    return {
      totalVehicles: vehicles.length,
      activeRoutes: routes.length,
      totalStudents: allocations.length,
      subsidizedStudents: allocations.filter(a => a.isSubsidized).length
    };
  },

  onboard: async (user: User, data: { school_name: string; address: string; phone: string; plan: SubscriptionTier }) => {
    await delay();
    const users = load<User>(KEYS.USERS);
    const schools = load<School>(KEYS.SCHOOLS);
    
    const userIdx = users.findIndex(u => u.id === user.id);
    if (userIdx === -1) {
      console.error(`[Onboard] User ${user.id} not found in database.`);
      throw new Error("User session invalid. Please log in again.");
    }

    // Create or update school
    let schoolId = users[userIdx].school_id;
    if (!schoolId) {
      schoolId = `school-${Date.now()}`;
      const newSchool: School = {
        id: schoolId,
        name: data.school_name,
        code: `SCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        contact_email: users[userIdx].email,
        subscription_tier: data.plan,
        max_students: data.plan === SubscriptionTier.PILOT ? 30 : (data.plan === SubscriptionTier.TIER_1 ? 200 : 500),
        student_count: 0,
        is_active: true,
        timezone: 'UTC',
        locale: 'en-US',
        created_at: new Date().toISOString(),
        address: data.address,
        phone: data.phone,
        onboarded: true
      };
      schools.push(newSchool);
    } else {
      const schoolIdx = schools.findIndex(s => s.id === schoolId);
      if (schoolIdx !== -1) {
        schools[schoolIdx] = {
          ...schools[schoolIdx],
          name: data.school_name,
          address: data.address,
          phone: data.phone,
          subscription_tier: data.plan,
          max_students: data.plan === SubscriptionTier.PILOT ? 30 : (data.plan === SubscriptionTier.TIER_1 ? 200 : 500),
          onboarded: true
        };
      }
    }

    users[userIdx].onboarded = true;
    users[userIdx].school_id = schoolId;
    users[userIdx].school_name = data.school_name;

    save(KEYS.USERS, users);
    save(KEYS.SCHOOLS, schools);

    console.log(`[Onboard] Success for user ${users[userIdx].email}, school: ${data.school_name}`);

    // Return new token directly
    const token = generateToken(users[userIdx], data.school_name);
    
    return {
      access: token,
      refresh: 'mock_refresh_token_xyz'
    };
  }
};

db.init();