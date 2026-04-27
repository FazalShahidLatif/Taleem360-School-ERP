import React, { PropsWithChildren } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Students } from './pages/Students';
import { Classes } from './pages/Classes';
import { Attendance } from './pages/Attendance';
import { Finance } from './pages/Finance';
import { AffiliateProgram } from './pages/AffiliateProgram';
import { AffiliateDashboard } from './pages/AffiliateDashboard';
import { PrivacyPolicy } from './pages/legal/PrivacyPolicy';
import { TermsOfService } from './pages/legal/TermsOfService';
import { CookiePolicy } from './pages/legal/CookiePolicy';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { Timetable } from './pages/Timetable';
import { SuperAdminUsers } from './pages/SuperAdminUsers';
import { SchoolSettings } from './pages/SchoolSettings';
import { StaffManagement } from './pages/Staff';
import { Subjects } from './pages/Subjects';
import { Examination } from './pages/Examination';
import { Pricing } from './pages/Pricing';
import { Blog } from './pages/Blog';
import { Tickets } from './pages/Tickets';
import { About } from './pages/About';
import { Onboarding } from './pages/Onboarding';
import { AdminPortal } from './pages/AdminPortal';
import { LessonPlanning } from './pages/LessonPlanning';
import { Accounts } from './pages/Accounts';
import { WhatsApp } from './pages/WhatsApp';
import { AdmissionForm } from './pages/AdmissionForm';
import { IDCardGeneration } from './pages/IDCardGeneration';
import { DataManagement } from './pages/DataManagement';
import { Support } from './pages/Support';
import { Payroll } from './pages/Payroll';
import { ReportCards } from './pages/ReportCards';
import { Library } from './pages/Library';
import { Assignments } from './pages/Assignments';
import Transport from './pages/Transport';
import Landing from './pages/Landing';
import { UserRole } from './types';
import { db } from './lib/storage';

// Initialize mock database
db.init();

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }: PropsWithChildren<{ allowedRoles?: UserRole[] }>) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to onboarding if not completed
  if (!user.onboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Super Admin can access everything
    if (user.role === UserRole.SUPER_ADMIN) {
      return <Layout>{children}</Layout>;
    }
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Helper components to avoid calling useAuth in App component directly
const Home = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user) {
    return user.role === UserRole.SUPER_ADMIN ? <SuperAdminDashboard /> : <Dashboard />;
  }

  return <Landing />;
};

const DashboardPage = () => {
  const { user } = useAuth();
  return user?.role === UserRole.SUPER_ADMIN ? <SuperAdminDashboard /> : <Dashboard />;
};

const AffiliatePage = () => <Layout><AffiliateProgram /></Layout>;
const PrivacyPage = () => <Layout><PrivacyPolicy /></Layout>;
const TermsPage = () => <Layout><TermsOfService /></Layout>;
const CookiePage = () => <Layout><CookiePolicy /></Layout>;
const PricingPage = () => <Layout><Pricing /></Layout>;
const BlogPage = () => <Layout><Blog /></Layout>;
const TicketsPage = () => <Layout><Tickets /></Layout>;
const AboutPage = () => <Layout><About /></Layout>;
const SupportPage = () => <Layout><Support /></Layout>;

const HomeWrapper = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (user) {
    return (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    );
  }
  return <Landing />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          <Route 
            path="/" 
            element={
              <HomeWrapper />
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/students" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <Students />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/staff" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <StaffManagement />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/classes" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <Classes />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/subjects" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <Subjects />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/accounts" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                <Accounts />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/whatsapp" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                <WhatsApp />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admissions" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                <AdmissionForm />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/id-cards" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                <IDCardGeneration />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/data-management" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                <DataManagement />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/payroll" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER]}>
                <Payroll />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/report-cards" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER, UserRole.PARENT]}>
                <ReportCards />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/library" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER]}>
                <Library />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/assignments" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER, UserRole.PARENT]}>
                <Assignments />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/transport" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER, UserRole.PARENT]}>
                <Transport />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/timetable" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.TEACHER]}>
                <Timetable />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/lesson-planning" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.TEACHER]}>
                <LessonPlanning />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/examination" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.TEACHER]}>
                <Examination />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/super-admin/users" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <SuperAdminUsers />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/settings" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                <SchoolSettings />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/finance" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.PARENT]}>
                <Finance />
              </ProtectedRoute>
            } 
          />

          {/* Affiliate Routes */}
          <Route 
            path="/affiliate" 
            element={<AffiliatePage />} 
          />
          <Route 
            path="/affiliate/dashboard" 
            element={
              <ProtectedRoute>
                <AffiliateDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Legal Routes */}
          <Route 
            path="/privacy" 
            element={<PrivacyPage />} 
          />
          <Route 
            path="/terms" 
            element={<TermsPage />} 
          />
          <Route 
            path="/cookies" 
            element={<CookiePage />} 
          />

          <Route 
            path="/pricing" 
            element={<PricingPage />} 
          />

          <Route 
            path="/blog" 
            element={<BlogPage />} 
          />

          <Route 
            path="/about" 
            element={<AboutPage />} 
          />

          <Route 
            path="/tickets" 
            element={
              <ProtectedRoute>
                <TicketsPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/support" 
            element={
              <ProtectedRoute>
                <SupportPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin-portal" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                <AdminPortal />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;