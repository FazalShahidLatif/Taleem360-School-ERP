import axios from "axios";
import { db } from "./storage";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    if (config.headers.set) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// --- MOCK ADAPTER START ---
// This adapter simulates the Backend responses using lib/storage.ts
// Remove this block when connecting to a real Django backend.
api.defaults.adapter = async (config) => {
  let { url, method, data, headers } = config;
  
  // Strip baseURL if present to make matching easier
  if (url && url.startsWith(api.defaults.baseURL || "")) {
    url = url.replace(api.defaults.baseURL || "", "");
  }
  
  let body: any = {};
  try {
    body = data ? (typeof data === 'string' ? JSON.parse(data) : data) : {};
  } catch (e) {
    console.warn("[Mock API] Failed to parse request body", e);
  }
  
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 400));

  const getUserFromToken = async () => {
    let authHeader: any = headers?.Authorization || headers?.authorization;
    
    // Handle AxiosHeaders object if present
    if (!authHeader && headers && typeof (headers as any).get === 'function') {
      authHeader = (headers as any).get('Authorization') || (headers as any).get('authorization');
    }

    // Fallback to localStorage if header is missing (useful for mock debugging)
    if (!authHeader) {
      const localToken = localStorage.getItem("access_token");
      if (localToken) {
        console.debug(`[Mock API] Header missing for ${url}, using token from localStorage`);
        return await db.auth.me(localToken);
      }
      console.warn(`[Mock API] No token provided for protected route: ${method?.toUpperCase()} ${url}`);
      throw new Error("No token provided");
    }

    const token = authHeader.toString().split(" ")[1];
    return await db.auth.me(token);
  };

  try {
    let responseData;

    // Auth Routes
    if (url === "/auth/login/" && method === "post") {
      console.log(`[Mock API] Login Request for: ${body.email}`);
      responseData = await db.auth.login(body.email, body.password);
    } 
    // Dashboard
    else if (url === "/dashboard/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getDashboardStats(user);
    }
    // Parent Dashboard (Step 6)
    else if (url === "/parent-dashboard/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getParentDashboard(user);
    }
    else if (url === "/school/settings/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getSchoolSettings(user);
    }
    else if (url === "/school/settings/" && method === "patch") {
      const user = await getUserFromToken();
      responseData = await db.updateSchoolSettings(user, body);
    }
    // Students
    else if (url === "/students/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getStudents(user);
    }
    else if (url === "/students/" && method === "post") {
      const user = await getUserFromToken();
      await db.addStudent(user, body);
      responseData = { success: true };
    }
    else if (url?.startsWith("/students/") && method === "patch") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      responseData = await db.updateStudent(user, id, body);
    }
    else if (url?.startsWith("/students/") && method === "delete") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      await db.deleteStudent(user, id);
      responseData = { success: true };
    }
    // Classes
    else if (url === "/classes/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getClasses(user);
    }
    else if (url === "/classes/" && method === "post") {
      const user = await getUserFromToken();
      await db.addClass(user, body);
      responseData = { success: true };
    }
    else if (url?.startsWith("/classes/") && method === "patch") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      responseData = await db.updateClass(user, id, body);
    }
    else if (url?.startsWith("/classes/") && method === "delete") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      await db.deleteClass(user, id);
      responseData = { success: true };
    }
    // Attendance
    else if (url === "/attendance/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getAttendance(user);
    }
    else if (url === "/attendance/" && method === "post") {
      const user = await getUserFromToken();
      // Handle bulk update simulation or single entry
      if (Array.isArray(body)) {
        for (const record of body) await db.saveAttendanceRecord(user, record);
      } else {
        await db.saveAttendanceRecord(user, body);
      }
      responseData = { success: true };
    }
    // AI Routes (Step 7)
    else if (url?.includes("/ai/class-summary/") && method === "get") {
      const user = await getUserFromToken();
      // Extract ID from URL /api/ai/class-summary/{id}/
      const parts = url.split('/');
      const classId = parts[parts.length - 2]; 
      const safeClassId = classId || parts[parts.length - 1];
      responseData = await db.getClassAnalytics(user, safeClassId);
    }
    // Finance Routes (Step 8)
    else if (url === "/finance/categories/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getFeeCategories(user);
    }
    else if (url === "/finance/categories/" && method === "post") {
      const user = await getUserFromToken();
      await db.createFeeCategory(user, body);
      responseData = { success: true };
    }
    else if (url?.startsWith("/finance/categories/") && method === "delete") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      await db.deleteFeeCategory(user, id);
      responseData = { success: true };
    }
    else if (url === "/finance/fees/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getStudentFees(user);
    }
    else if (url === "/finance/fees/" && method === "post") {
      const user = await getUserFromToken();
      await db.assignFee(user, body);
      responseData = { success: true };
    }
    else if (url === "/finance/pay/" && method === "post") {
      const user = await getUserFromToken();
      responseData = await db.processPayment(user, body);
    }
    else if (url === "/finance/payments/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getPayments(user);
    }
    // Staff
    else if (url === "/staff/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getStaff(user);
    }
    else if (url === "/staff/" && method === "post") {
      const user = await getUserFromToken();
      responseData = await db.addStaff(user, body);
    }
    else if (url?.startsWith("/staff/") && method === "patch") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      responseData = await db.updateStaff(user, id, body);
    }
    else if (url?.startsWith("/staff/") && method === "delete") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      await db.deleteStaff(user, id);
      responseData = { success: true };
    }
    // Subjects
    else if (url === "/subjects/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getSubjects(user);
    }
    else if (url === "/subjects/" && method === "post") {
      const user = await getUserFromToken();
      responseData = await db.addSubject(user, body);
    }
    else if (url?.startsWith("/subjects/") && method === "delete") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      await db.deleteSubject(user, id);
      responseData = { success: true };
    }
    // Exams
    else if (url === "/exams/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getExams(user);
    }
    else if (url === "/exams/" && method === "post") {
      const user = await getUserFromToken();
      responseData = await db.addExam(user, body);
    }
    else if (url?.startsWith("/exams/") && url?.includes("/results/") && method === "get") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const examId = parts[parts.length - 3] || parts[parts.length - 2];
      responseData = await db.getExamResults(user, examId);
    }
    else if (url?.startsWith("/exams/") && url?.includes("/results/") && method === "post") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const examId = parts[parts.length - 3] || parts[parts.length - 2];
      responseData = await db.saveExamResults(user, examId, body.results);
    }
    else if (url?.startsWith("/exams/") && method === "delete") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      await db.deleteExam(user, id);
      responseData = { success: true };
    }
    // Helpers for UI
    else if (url === "/users/teachers/" && method === "get") {
      const user = await getUserFromToken();
      const allUsers = db.getUsers();
      responseData = allUsers.filter(u => u.role === "TEACHER" && u.school_id === user.school_id);
    }
    else if (url === "/users/parents/" && method === "get") {
      const user = await getUserFromToken();
      const allUsers = db.getUsers();
      responseData = allUsers.filter(u => u.role === "PARENT" && u.school_id === user.school_id);
    }
    else if (url?.includes("/students/by_class/") && method === "get") {
      const user = await getUserFromToken();
      const classId = url.split("?class_id=")[1];
      responseData = await db.getStudentsByClass(user, classId);
    }
    // Affiliate Routes
    else if (url === "/affiliate/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getAffiliate(user);
    }
    else if (url === "/affiliate/register/" && method === "post") {
      const user = await getUserFromToken();
      responseData = await db.registerAffiliate(user);
    }
    else if (url === "/affiliate/referrals/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getReferrals(user);
    }
    else if (url === "/super-admin/stats/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getAllSchoolsStats(user);
    }
    else if (url === "/super-admin/users/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getAllUsers(user);
    }
    else if (url === "/super-admin/schools/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getSchools(user);
    }
    else if (url === "/super-admin/schools/" && method === "post") {
      const user = await getUserFromToken();
      responseData = await db.onboardSchool(user, body);
    }
    else if (url === "/super-admin/affiliates/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getAllAffiliates(user);
    }
    else if (url === "/super-admin/affiliates/" && method === "post") {
      const user = await getUserFromToken();
      responseData = await db.onboardAffiliate(user, body);
    }
    else if (url?.startsWith("/super-admin/affiliates/") && method === "patch") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      responseData = await db.updateAffiliateStatus(user, id, body.status);
    }
    else if (url?.startsWith("/super-admin/schools/") && method === "patch") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      responseData = await db.updateSchool(user, id, body);
    }
    // Timetable Routes
    else if (url?.includes("/timetable/class/") && method === "get") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const classId = parts[parts.length - 2] || parts[parts.length - 1];
      responseData = await db.getTimetableByClass(user, classId);
    }
    else if (url?.includes("/timetable/teacher/") && method === "get") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const teacherId = parts[parts.length - 2] || parts[parts.length - 1];
      responseData = await db.getTimetableByTeacher(user, teacherId);
    }
    // Support Ticket Routes
    else if (url === "/support/tickets/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getTickets(user);
    }
    else if (url === "/support/tickets/" && method === "post") {
      const user = await getUserFromToken();
      responseData = await db.createTicket(user, body);
    }
    else if (url?.startsWith("/support/tickets/") && method === "patch") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      responseData = await db.updateTicket(user, id, body);
    }
    // Payroll Routes
    else if (url === "/payroll/salaries/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getSalaries(user);
    }
    else if (url === "/payroll/generate/" && method === "post") {
      const user = await getUserFromToken();
      await db.generateSalaries(user, body.month);
      responseData = { success: true };
    }
    else if (url?.startsWith("/payroll/pay/") && method === "post") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      await db.paySalary(user, id, body.method);
      responseData = { success: true };
    }
    // Leave Routes
    else if (url === "/hr/leaves/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getLeaveRequests(user);
    }
    else if (url === "/hr/leaves/" && method === "post") {
      const user = await getUserFromToken();
      await db.createLeaveRequest(user, body);
      responseData = { success: true };
    }
    else if (url?.startsWith("/hr/leaves/") && method === "patch") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      await db.updateLeaveStatus(user, id, body.status);
      responseData = { success: true };
    }
    // Library Routes
    else if (url === "/library/books/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getBooks(user);
    }
    else if (url === "/library/books/" && method === "post") {
      const user = await getUserFromToken();
      await db.addBook(user, body);
      responseData = { success: true };
    }
    else if (url?.startsWith("/library/books/") && method === "patch") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      await db.updateBook(user, id, body);
      responseData = { success: true };
    }
    else if (url?.startsWith("/library/books/") && method === "delete") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      await db.deleteBook(user, id);
      responseData = { success: true };
    }
    else if (url === "/library/transactions/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getLibraryTransactions(user);
    }
    else if (url === "/library/issue/" && method === "post") {
      const user = await getUserFromToken();
      await db.issueBook(user, body);
      responseData = { success: true };
    }
    else if (url?.startsWith("/library/return/") && method === "post") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      await db.returnBook(user, id);
      responseData = { success: true };
    }
    // LMS Routes
    else if (url === "/lms/assignments/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getAssignments(user);
    }
    else if (url === "/lms/assignments/" && method === "post") {
      const user = await getUserFromToken();
      await db.createAssignment(user, body);
      responseData = { success: true };
    }
    else if (url?.startsWith("/lms/assignments/") && method === "patch") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      await db.updateAssignment(user, id, body);
      responseData = { success: true };
    }
    else if (url?.startsWith("/lms/assignments/") && method === "delete") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      await db.deleteAssignment(user, id);
      responseData = { success: true };
    }
    else if (url === "/lms/submissions/" && method === "get") {
      const user = await getUserFromToken();
      const assignmentId = url.split("?assignment_id=")[1];
      responseData = await db.getSubmissions(user, assignmentId);
    }
    else if (url === "/lms/submissions/" && method === "post") {
      const user = await getUserFromToken();
      await db.submitAssignment(user, body);
      responseData = { success: true };
    }
    else if (url?.startsWith("/lms/submissions/") && url?.includes("/grade/") && method === "post") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 3] || parts[parts.length - 2];
      await db.gradeSubmission(user, id, body);
      responseData = { success: true };
    }
    // Report Card Routes
    else if (url === "/academic/report-cards/" && method === "get") {
      const user = await getUserFromToken();
      const studentId = url.split("?student_id=")[1];
      responseData = await db.getReportCards(user, studentId);
    }
    else if (url === "/academic/report-cards/generate/" && method === "post") {
      const user = await getUserFromToken();
      responseData = await db.generateReportCard(user, body.student_id, body.term, body.academic_year);
    }
    // Transport Routes
    else if (url === "/transport/vehicles/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getVehicles(user);
    }
    else if (url === "/transport/vehicles/" && method === "post") {
      const user = await getUserFromToken();
      responseData = await db.addVehicle(user, body);
    }
    else if (url?.startsWith("/transport/vehicles/") && method === "patch") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      responseData = await db.updateVehicle(user, id, body);
    }
    else if (url?.startsWith("/transport/vehicles/") && method === "delete") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      await db.deleteVehicle(user, id);
      responseData = { success: true };
    }
    else if (url === "/transport/routes/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getRoutes(user);
    }
    else if (url === "/transport/routes/" && method === "post") {
      const user = await getUserFromToken();
      responseData = await db.addRoute(user, body);
    }
    else if (url?.startsWith("/transport/routes/") && method === "patch") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      responseData = await db.updateRoute(user, id, body);
    }
    else if (url?.startsWith("/transport/routes/") && method === "delete") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      await db.deleteRoute(user, id);
      responseData = { success: true };
    }
    else if (url === "/transport/allocations/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getTransportAllocations(user);
    }
    else if (url === "/transport/allocations/" && method === "post") {
      const user = await getUserFromToken();
      responseData = await db.allocateTransport(user, body);
    }
    else if (url?.startsWith("/transport/allocations/") && method === "patch") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      responseData = await db.updateAllocation(user, id, body);
    }
    else if (url?.startsWith("/transport/allocations/") && method === "delete") {
      const user = await getUserFromToken();
      const parts = url.split('/');
      const id = parts[parts.length - 2] || parts[parts.length - 1];
      await db.deallocateTransport(user, id);
      responseData = { success: true };
    }
    else if (url === "/transport/stats/" && method === "get") {
      const user = await getUserFromToken();
      responseData = await db.getTransportStats(user);
    }
    // Blog Routes
    else if (url === "/blog/posts/" && method === "get") {
      responseData = await db.getBlogPosts();
    }
    else if (url === "/onboard/" && method === "post") {
      const user = await getUserFromToken();
      responseData = await db.onboard(user, body);
    }
    else if (url === "/auth/register/" && method === "post") {
      responseData = await db.auth.register(body.name, body.email, body.password);
    }
    else {
      throw new Error(`404 Not Found: ${url}`);
    }

    return {
      data: responseData,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  } catch (error: any) {
    console.error("Mock API Error", error);
    return Promise.reject({
      response: {
        status: error.message.includes("Permission") ? 403 : 400,
        data: { detail: error.message }
      }
    });
  }
};
// --- MOCK ADAPTER END ---

export default api;