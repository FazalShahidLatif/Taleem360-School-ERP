import React, { PropsWithChildren, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import { AuthProvider, useAuth } from './lib/auth';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Students } from './pages/Students';
import { Classes } from './pages/Classes';
import { Attendance } from './pages/Attendance';
import { Finance } from './pages/Finance';
import { PrivacyPolicy } from './pages/legal/PrivacyPolicy';
import { TermsOfService } from './pages/legal/TermsOfService';
import { CookiePolicy } from './pages/legal/CookiePolicy';
import { RefundPolicy } from './pages/legal/RefundPolicy';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { Timetable } from './pages/Timetable';
import { SuperAdminUsers } from './pages/SuperAdminUsers';
import { SchoolSettings } from './pages/SchoolSettings';
import { StaffManagement } from './pages/Staff';
import { Subjects } from './pages/Subjects';
import { Examination } from './pages/Examination';
import { Pricing } from './pages/Pricing';
import { Blog } from './pages/Blog';
import { BlogPostDetail } from './pages/BlogPostDetail';
import { Tickets } from './pages/Tickets';
import { About } from './pages/About';
import { FreeResources } from './pages/free-resources';
import { Onboarding } from './pages/Onboarding';
import { NotFound } from './pages/NotFound';
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

const PrivacyPage = () => <Layout><PrivacyPolicy /></Layout>;
const TermsPage = () => <Layout><TermsOfService /></Layout>;
const CookiePage = () => <Layout><CookiePolicy /></Layout>;
const RefundPage = () => <Layout><RefundPolicy /></Layout>;
const PricingPage = () => <Layout><Pricing /></Layout>;
const BlogPage = () => <Layout><Blog /></Layout>;
const BlogPostDetailPage = () => <Layout><BlogPostDetail /></Layout>;
const TicketsPage = () => <Layout><Tickets /></Layout>;
const AboutPage = () => <Layout><About /></Layout>;
const FreeResourcesPage = () => <Layout><FreeResources /></Layout>;
const SupportPage = () => <Layout><Support /></Layout>;
const NotFoundPage = () => <NotFound />;

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

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window
    window.scrollTo(0, 0);
    // Scroll all layout elements that might be scroll containers
    const scrollableElements = document.querySelectorAll('.overflow-y-auto, main');
    scrollableElements.forEach(el => {
      el.scrollTop = 0;
    });
  }, [pathname]);

  return null;
};

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      let scrollTop = window.scrollY;
      
      if (target && target !== document as any) {
        scrollTop = target.scrollTop || window.scrollY;
      } else {
        const mainEl = document.querySelector('main');
        const scrollEl = document.querySelector('.overflow-y-auto');
        scrollTop = window.scrollY || (mainEl?.scrollTop) || (scrollEl?.scrollTop) || 0;
      }

      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { capture: true });
    
    const interval = setInterval(() => {
      const mainEl = document.querySelector('main');
      const scrollEl = document.querySelector('.overflow-y-auto');
      const scrollTop = window.scrollY || (mainEl?.scrollTop) || (scrollEl?.scrollTop) || 0;
      setIsVisible(scrollTop > 300);
    }, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      clearInterval(interval);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const scrollableElements = document.querySelectorAll('.overflow-y-auto, main');
    scrollableElements.forEach(el => {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Go to top"
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all focus:outline-none"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
};

const App: React.FC = () => {
  React.useEffect(() => {
    // Detect legacy HashRouter paths in URL (e.g., /#/blog or /#/pricing) and redirect to clean paths
    const hash = window.location.hash;
    if (hash && hash.startsWith('#/')) {
      const cleanPath = hash.substring(2); // Remove '#/'
      window.location.replace('/' + cleanPath);
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <ScrollToTopButton />
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
            path="/refund-policy" 
            element={<RefundPage />} 
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
            path="/blog/:slug" 
            element={<BlogPostDetailPage />} 
          />

          <Route 
            path="/about" 
            element={<AboutPage />} 
          />

          <Route 
            path="/free-resources" 
            element={<FreeResourcesPage />} 
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
            element={<SupportPage />} 
          />
          
          <Route 
            path="/admin-portal" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                <AdminPortal />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;