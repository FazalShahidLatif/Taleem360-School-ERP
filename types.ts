export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT'
}

export enum SubscriptionTier {
  PILOT = 'PILOT', // 0-30 students
  TIER_1 = 'TIER_1', // 0-200 students
  TIER_2 = 'TIER_2', // 201-500 students
  TIER_3 = 'TIER_3'  // 501+ students
}

export interface School {
  id: string;
  name: string;
  code: string;
  timezone: string;
  locale: string;
  is_active: boolean;
  subscription_tier: SubscriptionTier;
  student_count: number;
  max_students: number;
  created_at: string;
  contact_email: string;
  phone?: string;
  address?: string;
  onboarded?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string; // UI convenience, mostly derived or separate profile
  password?: string;
  role: UserRole;
  school_id?: string; // Optional for SUPER_ADMIN
  school_name?: string; // For UI display
  student_id?: string; // For PARENT role: links to their child
  onboarded?: boolean;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  enrollment_number: string;
  parent_id?: string;
  parent_name?: string;
  school_id: string;
  date_of_birth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  phone?: string;
  email?: string;
  blood_group?: string;
  admission_date?: string;
  previous_school?: string;
  academic_history?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'TEACHER' | 'SUPPORT';
  designation: string;
  department?: string;
  joining_date: string;
  school_id: string;
  user_id?: string;
  is_active: boolean;
}

export interface Class {
  id: string;
  name: string;
  section: string;
  class_teacher?: string; // ID of the teacher
  school_id: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  school_id: string;
}

export interface Enrollment {
  student: string; // ID
  class_obj: string; // ID (ForeignKey to Class)
  academic_year: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT';

export interface Attendance {
  id: string;
  student: string; // ID
  class_obj: string; // ID
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  // marked_by is not in the read serializer fields
}

export interface DashboardStats {
  students: number;
  teachers: number;
  classes: number;
}

export interface ParentDashboardData {
  student_name: string;
  attendance: { date: string; status: AttendanceStatus }[];
  classes: string[];
}

// --- Finance Module Types ---

export interface FeeCategory {
  id: string;
  name: string;
  amount: number;
  description?: string;
  school_id: string;
}

export interface StudentFee {
  id: string;
  student_id: string;
  category_id: string; // Link to FeeCategory
  category_name?: string; // For UI convenience
  due_date: string;
  amount: number; // Snapshot of amount at time of assignment
  is_paid: boolean;
  paid_on?: string;
  school_id: string;
}

export interface Payment {
  id: string;
  fee_id: string;
  amount: number;
  date: string;
  method: string;
  transaction_id: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  school_id: string;
}

// --- Affiliate Program Types ---

export enum AffiliateStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface Affiliate {
  id: string;
  user_id: string;
  user_name?: string; // For UI display
  user_email?: string; // For UI display
  referral_code: string;
  total_earnings: number;
  balance: number;
  referral_count: number;
  status: AffiliateStatus;
  created_at: string;
}

export interface Referral {
  id: string;
  affiliate_id: string;
  referred_school_id: string;
  referred_school_name: string;
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED';
  commission_earned: number;
  date: string;
}

// --- Timetable Types ---

export enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday'
}

export interface TimetableEntry {
  id: string;
  class_id: string;
  subject: string;
  teacher_id: string;
  teacher_name?: string;
  day: DayOfWeek;
  start_time: string; // HH:MM
  end_time: string;   // HH:MM
  room?: string;
}

// --- Examination Types ---

export interface Exam {
  id: string;
  name: string;
  class_id: string;
  subject_id: string;
  exam_date: string;
  total_marks: number;
  passing_marks: number;
  school_id: string;
}

export interface ExamResult {
  id: string;
  exam_id: string;
  student_id: string;
  marks_obtained: number;
  remarks?: string;
  school_id: string;
}

// --- Support Ticket Types ---

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface SupportTicket {
  id: string;
  school_id: string;
  school_name: string;
  user_id: string;
  user_name: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  user_name: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

// --- Blog Types ---

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  image_url: string;
  published_at: string;
  is_published: boolean;
}

// --- AI Chat Types ---

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

// --- Payroll & HR Types ---

export enum SalaryStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export interface StaffSalary {
  id: string;
  staff_id: string;
  staff_name?: string;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  month: string; // YYYY-MM
  status: SalaryStatus;
  paid_date?: string;
  payment_method?: string;
  school_id: string;
}

export interface LeaveRequest {
  id: string;
  staff_id: string;
  staff_name?: string;
  leave_type: 'SICK' | 'CASUAL' | 'ANNUAL' | 'OTHER';
  start_date: string;
  end_date: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  school_id: string;
}

// --- Report Card Types ---

export interface ReportCardSubject {
  subject_id: string;
  subject_name: string;
  marks_obtained: number;
  total_marks: number;
  grade: string;
  remarks?: string;
}

export interface ReportCard {
  id: string;
  student_id: string;
  student_name: string;
  class_id: string;
  class_name: string;
  academic_year: string;
  term: string; // e.g., "Mid Term", "Final Term"
  subjects: ReportCardSubject[];
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  grade: string;
  attendance_percentage: number;
  teacher_remarks: string;
  principal_remarks?: string;
  issue_date: string;
  school_id: string;
}

// --- Library Management Types ---

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  quantity: number;
  available_quantity: number;
  location?: string;
  school_id: string;
}

export interface LibraryTransaction {
  id: string;
  book_id: string;
  book_title?: string;
  student_id: string;
  student_name?: string;
  issue_date: string;
  due_date: string;
  return_date?: string;
  fine_amount: number;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE';
  school_id: string;
}

// --- LMS (Homework & Assignments) Types ---

export interface AttachedResource {
  id: string;
  title: string;
  url: string;
  type: 'TEXTBOOK' | 'NOTES' | 'PAST_PAPER' | 'OTHER';
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject_id: string;
  subject_name?: string;
  class_id: string;
  class_name?: string;
  assigned_date: string;
  due_date: string;
  max_marks: number;
  attached_resources: AttachedResource[];
  created_by: string; // teacher_id
  teacher_name?: string;
  status: 'ACTIVE' | 'CLOSED' | 'EXPIRED';
  school_id: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  assignment_title?: string;
  student_id: string;
  student_name?: string;
  submitted_at: string;
  file_url?: string;
  text_answer?: string;
  obtained_marks?: number;
  feedback?: string;
  status: 'PENDING' | 'GRADED' | 'LATE';
  school_id: string;
}

// --- Transport & Fleet Management Types ---

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  registrationNumber: string;
  capacity: number;
  type: 'BUS' | 'VAN' | 'CAR' | 'OTHER';
  driverName: string;
  driverPhone: string;
  helperName?: string;
  helperPhone?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  school_id: string;
}

export interface PickupPoint {
  id: string;
  routeId: string;
  name: string;
  timeMorning: string; // HH:MM
  timeAfternoon: string; // HH:MM
  landmark?: string;
}

export interface Route {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  approximateDistance: string; // e.g., "15 km"
  pickupPoints: PickupPoint[];
  assignedVehicleId?: string;
  assignedVehicleNumber?: string;
  inChargeStaffId?: string;
  inChargeStaffName?: string;
  status: 'ACTIVE' | 'INACTIVE';
  school_id: string;
}

export interface StudentTransportAllocation {
  id: string;
  studentId: string;
  studentName?: string;
  class_name?: string;
  routeId: string;
  routeName?: string;
  pickupPointId: string;
  pickupPointName?: string;
  transportFee: number;
  isSubsidized: boolean;
  remarks?: string;
  school_id: string;
}

export interface TransportStats {
  totalVehicles: number;
  activeRoutes: number;
  totalStudents: number;
  subsidizedStudents: number;
}
