import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CalendarCheck, 
  LogOut, 
  Menu, 
  X,
  School as SchoolIcon,
  CreditCard,
  Calendar,
  ClipboardList,
  Award,
  Tag,
  MessageSquare,
  Newspaper,
  Facebook,
  Twitter,
  Linkedin,
  FileText,
  BarChart3,
  MessageCircle,
  Gift,
  UserPlus,
  IdCard,
  Database,
  Languages,
  Upload,
  LifeBuoy,
  Briefcase,
  GraduationCap,
  Bus,
  Book as BookIcon,
  Baby,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';
import { AIChatbot } from './AIChatbot';
import { Footer } from './Footer';
import FreeResourceBanner from './FreeResourceBanner';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = user?.role === UserRole.ADMIN;
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  const isParent = user?.role === UserRole.PARENT;

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, current: location.pathname === '/' },
    { name: 'Nexus Web3 Quiz', href: '/nexus', icon: Sparkles, current: location.pathname === '/nexus' },
    ...(isSuperAdmin ? [
      { name: 'Users', href: '/super-admin/users', icon: Users, current: location.pathname === '/super-admin/users' },
    ] : []),
    ...(isSuperAdmin || isAdmin ? [
      { name: 'Students', href: '/students', icon: Users, current: location.pathname === '/students' },
      { name: 'Staff', href: '/staff', icon: Users, current: location.pathname === '/staff' },
      { name: 'Classes', href: '/classes', icon: BookOpen, current: location.pathname === '/classes' },
      { name: 'Subjects', href: '/subjects', icon: BookOpen, current: location.pathname === '/subjects' },
      { name: 'Accounts', href: '/accounts', icon: BarChart3, current: location.pathname === '/accounts' },
      { name: 'Payroll & HR', href: '/payroll', icon: Briefcase, current: location.pathname === '/payroll' },
      { name: 'WhatsApp', href: '/whatsapp', icon: MessageCircle, current: location.pathname === '/whatsapp' },
      { name: 'Admissions', href: '/admissions', icon: UserPlus, current: location.pathname === '/admissions' },
      { name: 'ID Cards', href: '/id-cards', icon: IdCard, current: location.pathname === '/id-cards' },
      { name: 'Data Management', href: '/data-management', icon: Database, current: location.pathname === '/data-management' },
      { name: 'Settings', href: '/settings', icon: SchoolIcon, current: location.pathname === '/settings' },
    ] : []),
    { name: 'Timetable', href: '/timetable', icon: Calendar, current: location.pathname === '/timetable' },
    { name: 'Lesson Planning', href: '/lesson-planning', icon: FileText, current: location.pathname === '/lesson-planning' },
    { name: 'Examination', href: '/examination', icon: ClipboardList, current: location.pathname === '/examination' },
    { name: 'Report Cards', href: '/report-cards', icon: GraduationCap, current: location.pathname === '/report-cards' },
    { name: 'Library', href: '/library', icon: BookIcon, current: location.pathname === '/library' },
    { name: 'Homework & LMS', href: '/assignments', icon: BookOpen, current: location.pathname === '/assignments' },
    { name: 'Transport & Fleet', href: '/transport', icon: Bus, current: location.pathname === '/transport' },
    { name: 'Pricing', href: '/pricing', icon: Tag, current: location.pathname === '/pricing' },
    { name: 'Free Resources', href: '/free-resources', icon: Gift, current: location.pathname === '/free-resources' },
    { name: 'Blog', href: '/blog', icon: Newspaper, current: location.pathname.startsWith('/blog') },
    { name: 'About', href: '/about', icon: Award, current: location.pathname === '/about' },
    { name: 'Support', href: '/support', icon: LifeBuoy, current: location.pathname.startsWith('/support') },
    { name: 'Attendance', href: '/attendance', icon: CalendarCheck, current: location.pathname.startsWith('/attendance') },
    { name: 'Daycare Daily Summary', href: '/daycare', icon: Baby, current: location.pathname === '/daycare' },
    // Finance visible to Admin (Management) and Parent (Payment)
    ...((isSuperAdmin || isAdmin || isParent) ? [
      { name: 'Finance', href: '/finance', icon: CreditCard, current: location.pathname.startsWith('/finance') }
    ] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <FreeResourceBanner />
      <div className="flex flex-1 w-full relative">
      {/* Mobile Sidebar Overlay */}
      {user && sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r border-gray-200">
             <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
               <div className="flex items-center font-bold text-xl text-indigo-600">
                 <GraduationCap className="w-8 h-8 mr-2 text-indigo-600" />
                 Taleem360
               </div>
               <button onClick={() => setSidebarOpen(false)}>
                 <X className="w-6 h-6 text-gray-500" />
               </button>
             </div>
             <nav className="flex-1 px-2 py-4 space-y-1">
               {navigation.map((item) => (
                 <Link
                   key={item.name}
                   to={item.href}
                   onClick={() => setSidebarOpen(false)}
                   className={`${
                     item.current ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                   } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                 >
                   <item.icon className={`${
                     item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                   } mr-3 flex-shrink-0 h-6 w-6`} />
                   {item.name}
                 </Link>
               ))}
             </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {user && (
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-5 lg:pb-4">
          <div className="flex items-center flex-shrink-0 px-6">
            <GraduationCap className="w-8 h-8 text-indigo-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">
              {isSuperAdmin ? 'Taleem360 HQ' : 'Taleem360'}
            </span>
          </div>
          <div className="mt-6 flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 space-y-1">
               {navigation.map((item) => (
                 <Link
                   key={item.name}
                   to={item.href}
                   className={`${
                     item.current ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                   } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                 >
                   <item.icon className={`${
                     item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                   } mr-3 flex-shrink-0 h-6 w-6 transition-colors`} />
                   {item.name}
                 </Link>
               ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 flex items-center">
                    {user?.name}
                    {isSuperAdmin && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                        Super Admin
                      </span>
                    )}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">{user?.role}</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`${user ? 'lg:pl-64' : 'w-full'} flex flex-col flex-1 w-0 overflow-hidden`}>
        {user && (
          <div className="lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        )}
        {!user && (
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-indigo-600 p-2 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tight">Taleem360</span>
              </Link>
              <div className="flex items-center space-x-6">
                <nav className="flex items-center space-x-6">
                  <Link to="/pricing" className="text-gray-600 hover:text-indigo-600 text-sm font-bold transition-colors">Pricing</Link>
                  <Link to="/about" className="text-gray-600 hover:text-indigo-600 text-sm font-bold transition-colors">About</Link>
                </nav>
                <div className="h-5 w-px bg-gray-200" aria-hidden="true" />
                <Link to="/login" className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-black rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-md active:scale-95 transition-all">
                  Sign In
                </Link>
              </div>
            </div>
          </header>
        )}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6 min-h-screen flex flex-col">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex-1">
              {children}
            </div>
            
            <Footer />
            <AIChatbot />
          </div>
        </main>
      </div>
     </div>
    </div>
  );
};
