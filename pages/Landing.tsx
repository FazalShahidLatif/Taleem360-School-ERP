import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Shield, 
  Users, 
  BarChart3, 
  Globe, 
  Zap, 
  ArrowRight, 
  CheckCircle2,
  Play,
  Heart,
  BookOpen,
  Bus,
  Menu,
  X,
  Calendar,
  Database,
  QrCode,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Download,
  Clock,
  Smartphone,
  Cpu,
  Award,
  Check
} from 'lucide-react';
import { Footer } from '../components/Footer';
import { TaleemEcosystemRoadmap } from '../components/TaleemEcosystemRoadmap';
import { ReviewsSection } from '../components/ReviewsSection';
import { useSEO } from '../lib/seo';

const Landing: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useSEO({
    title: 'Taleem360 - Unified School Cloud ERP & LMS Suite',
    description: "Taleem 360 is the unified cloud based school ERP, LMS suite, and automated timetable generator for K-12 schools, colleges, and academies. Features real-time student attendance tracking, double-entry financial accounting, and exam result card generation.",
    keywords: 'taleem360, taleem 360, unified school cloud erp & lms suite, school erp, school management system, automated school timetable generator cloud app, cloud based school database management system features, how to automate student attendance tracking cloud, school exam result card generator software free download, student information system, educational cloud suite',
    schemaMarkup: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          '@id': 'https://www.taleem360.online/#software',
          name: 'Taleem360 - Unified School Cloud ERP & LMS Suite',
          alternateName: ['Taleem 360', 'Taleem360 Cloud ERP', 'Taleem360 LMS'],
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'Web, Android, iOS, Windows, macOS, Linux',
          url: 'https://www.taleem360.online/',
          image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&h=630&q=80',
          description: "Unified school cloud ERP and learning management suite offering automated timetable generation, real-time biometric and QR attendance tracking, double-entry financial ledgers, and digital exam report cards.",
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'USD',
            lowPrice: '0',
            highPrice: '129',
            offerCount: '4',
            offers: [
              { '@type': 'Offer', name: 'Pilot Free Trial', price: '0', priceCurrency: 'USD' },
              { '@type': 'Offer', name: 'Tier 1 Standard', price: '49', priceCurrency: 'USD' },
              { '@type': 'Offer', name: 'Tier 2 Professional', price: '129', priceCurrency: 'USD' },
              { '@type': 'Offer', name: 'Tier 3 Enterprise', price: 'Custom', priceCurrency: 'USD' }
            ]
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            bestRating: '5',
            worstRating: '1',
            ratingCount: '520',
            reviewCount: '187',
          },
          author: {
            '@type': 'Organization',
            name: 'Taleem 360',
            url: 'https://www.taleem360.online/',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.taleem360.online/logo.png',
            },
          },
        },
        {
          '@type': 'FAQPage',
          '@id': 'https://www.taleem360.online/#faq',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How does the automated school timetable generator cloud app resolve scheduling conflicts?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The automated timetable generator in Taleem 360 evaluates teacher workload, subject requirements, room availability, and classroom capacity using mathematical optimization algorithms to eliminate double-booking in seconds.'
              }
            },
            {
              '@type': 'Question',
              name: 'What are the primary cloud based school database management system features in Taleem 360?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Taleem 360 features include centralized student records, computerized fee challans, double-entry accounting ledgers, QR code and biometric attendance, digital report cards, teacher payroll, and parent communication channels.'
              }
            },
            {
              '@type': 'Question',
              name: 'How does Taleem 360 automate student attendance tracking in the cloud?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Institutions can connect standard biometric fingerprint hardware or scan student QR codes at gates. Attendance logs are recorded in real-time with instant absentee SMS alerts sent to parents.'
              }
            },
            {
              '@type': 'Question',
              name: 'How can educational institutions start a free pilot on Taleem 360?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Schools can initiate an immediate 30-day risk-free Pilot trial from the onboarding portal with zero credit card requirement or server installation.'
              }
            }
          ]
        }
      ]
    },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header (Public) */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">Taleem 360</span>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">About</Link>
              <Link to="/pricing" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Pricing</Link>
              <Link to="/blog" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Guides &amp; Articles</Link>
              <Link to="/support" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Support</Link>
            </div>
            
            {/* Desktop Navigation Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors">Sign In</Link>
              <Link to="/onboarding" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                Get Started Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-3">
              <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors">Sign In</Link>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-indigo-600 transition-all"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-100 bg-white"
            >
              <div className="px-4 py-6 space-y-4 flex flex-col">
                <Link 
                  to="/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-50 transition-colors"
                >
                  About Taleem 360
                </Link>
                <Link 
                  to="/pricing" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-50 transition-colors"
                >
                  Pricing Plans
                </Link>
                <Link 
                  to="/blog" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-50 transition-colors"
                >
                  Educational Guides
                </Link>
                <Link 
                  to="/support" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-50 transition-colors"
                >
                  Support Center
                </Link>
                <div className="pt-4 flex flex-col gap-3">
                  <Link 
                    to="/onboarding" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center bg-indigo-600 text-white py-3 rounded-xl text-base font-bold hover:bg-indigo-700 transition-all shadow-lg"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section with Semantic Keyword & Search Intent Optimization */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs sm:text-sm font-bold mb-6 border border-indigo-100 uppercase tracking-wider"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>#1 Cloud Based School Database Management System &amp; Timetable Generator</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-[1.15]"
            >
              Automated School Timetable Generator Cloud App &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800">
                Cloud Based School Database Management System
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto"
            >
              <strong>Taleem 360</strong> is an all-in-one, <strong>user friendly</strong> <strong>management software</strong> built for modern <strong>educational institutions</strong>. Effortlessly generate any <strong>school schedule</strong>, manage <strong>student information</strong> records in <strong>real time</strong>, learn <strong>how to automate student attendance tracking cloud</strong> with QR codes and biometrics, and access our <strong>school exam result card generator software free download</strong> pilot.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/onboarding" data-cta="click_start_pilot" className="w-full sm:w-auto bg-indigo-600 text-white px-9 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Start Free Pilot / Download
              </Link>
              <Link to="/compare" data-cta="click_learn_features" className="w-full sm:w-auto bg-white text-slate-700 border-2 border-slate-200 px-9 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Explore Database Features
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Quick Intent Badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Conflict-Free Timetable Generator
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Real-Time Attendance QR / Biometric
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Printable Exam Marksheet &amp; Report Cards
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Offline-First Dual-Persistence
              </span>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-400/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-400/10 rounded-full blur-[120px]"></div>
        </div>
      </section>

      {/* SERP INTENT 1 & 2: Core Capability Pillars */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
              Cloud Based School Database Management System Features
            </h2>
            <p className="text-slate-600 mt-4 text-base sm:text-lg leading-relaxed">
              Everything your <strong>school administration</strong> requires in a unified, <strong>cloud based</strong> <strong>management system</strong> that bridges <strong>students and parents</strong> with teachers and campus directors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Keyword Pillar 1: Automated School Timetable Generator Cloud App */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Automated School Timetable Generator Cloud App
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Create conflict-free <strong>school timetable</strong> grids and dynamic <strong>school schedule</strong> models in seconds. Our <strong>cloud based</strong> optimization engine balances teacher availability, classroom capacity, and elective rotations across all grade levels.
                </p>
              </div>
              <Link 
                to="/blog/machine-learning-school-timetable-scheduling-conflicts"
                className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-3 border-t border-slate-100"
              >
                Read Timetable Guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {/* Keyword Pillar 2: Cloud Based School Database Management System Features */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Database className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Cloud Based School Database Management System
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Centralize all <strong>student information</strong>, enrollment files, parent contact logs, and staff records in a high-speed <strong>school database management system</strong>. Access fast data lookups, double-entry financial ledgers, and secure role-based permissions.
                </p>
              </div>
              <Link 
                to="/blog/school-it-infrastructure-modernization-cloud-erp"
                className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-3 border-t border-slate-100"
              >
                Explore Database Specs <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {/* Keyword Pillar 3: How to Automate Student Attendance Tracking Cloud */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <QrCode className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  How to Automate Student Attendance Tracking Cloud
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Discover <strong>how to automate student attendance tracking cloud</strong> using <strong>qr code</strong> student ID cards, RFID scanners, and biometrics. Our <strong>automated attendance tracking</strong> engine <strong>records attendance</strong> in <strong>real time</strong> and delivers instant absence alerts.
                </p>
              </div>
              <Link 
                to="/blog/real-time-attendance-tracking-parent-peace-of-mind"
                className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-3 border-t border-slate-100"
              >
                View Attendance Setup <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {/* Keyword Pillar 4: School Exam Result Card Generator Software Free Download */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  School Exam Result Card Generator Software Free Download
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Generate professional marksheet templates, weighted grading breakdowns, and customizable <strong>report card</strong> printouts. Start with our <strong>school exam result card generator software free download</strong> pilot to evaluate term exams effortlessly.
                </p>
              </div>
              <Link 
                to="/blog/optimizing-student-report-cards-formative-assessments"
                className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-3 border-t border-slate-100"
              >
                Report Card Guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {/* Keyword Pillar 5: Taleem 360 All-in-One Management Software */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Layers className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Taleem 360 Unified Management Software
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Built specifically for <strong>educational institutions</strong>, <strong>Taleem 360</strong> unites academies, K-12 schools, daycares, and multi-campus networks. Empower your <strong>school administration</strong> with unified billing, payroll, LMS, and parent communication.
                </p>
              </div>
              <Link 
                to="/blog/streamlining-school-operations-ultimate-erp-guide"
                className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-3 border-t border-slate-100"
              >
                ERP Blueprint <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {/* Pillar 6: Real Time Attendance Data & Communication */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Attendance Data &amp; Parent Notifications
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Comprehensive <strong>attendance management</strong> tools provide administrators with weekly <strong>attendance data</strong> dashboards. Keep <strong>students and parents</strong> informed through automated WhatsApp notices, fee reminders, and event broadcasts.
                </p>
              </div>
              <Link 
                to="/blog"
                className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-3 border-t border-slate-100"
              >
                Browse All Guides <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* SERP INTENT 3 HOW-TO SECTION: "How to Automate Student Attendance Tracking Cloud" */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
              Step-by-Step Guide
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
              How to Automate Student Attendance Tracking Cloud
            </h2>
            <p className="text-slate-600 mt-4 text-base sm:text-lg leading-relaxed">
              Eliminate paper roll-calls. Follow our 4-step workflow to <strong>automate attendance</strong> across your classrooms, school buses, and campus gates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-3xl relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mb-5">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Issue Smart ID Cards</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Assign a unique student <strong>qr code</strong> badge or RFID smart card generated directly from your <strong>student information</strong> directory in <strong>Taleem 360</strong>.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-3xl relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center mb-5">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Scan &amp; Record in Real Time</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Connect biometric gates, QR kiosks, or teacher mobile apps. The <strong>attendance systems</strong> engine <strong>records attendance</strong> in less than 1 second to the cloud database.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-3xl relative">
              <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white font-black text-xl flex items-center justify-center mb-5">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Parent Alerts</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Automated absentee triggers notify <strong>students and parents</strong> immediately via SMS and WhatsApp, providing instant reassurance and curbing truancy habits.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-3xl relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-black text-xl flex items-center justify-center mb-5">
                4
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Analyze Attendance Data</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong>School administration</strong> accesses live <strong>attendance data</strong> dashboards, term summaries, and automated compliance reports in one <strong>user friendly</strong> screen.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link 
              to="/blog/real-time-attendance-tracking-parent-peace-of-mind"
              className="inline-flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-700 text-sm"
            >
              Read Full Technical Guide: How to Automate Student Attendance Tracking Cloud <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SERP INTENT 1 & 4 HIGHLIGHT: Automated Timetable Generator & Report Card Generator */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Timetable Generator Focus */}
            <div className="bg-slate-800/80 border border-slate-700 p-8 sm:p-10 rounded-3xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Intelligent Scheduling</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 mb-4">
                Automated School Timetable Generator Cloud App
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Building a master <strong>school schedule</strong> manually takes weeks. Our <strong>automated school timetable generator cloud app</strong> processes room capacities, teacher subject qualifications, and student cohort constraints to generate conflict-free schedules in minutes.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Eliminates double-booking of teachers and science laboratories</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Supports multi-week rotating block <strong>school timetable</strong> matrices</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Syncs in <strong>real time</strong> with teacher calendars and student portals</span>
                </li>
              </ul>
              <Link 
                to="/onboarding"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg"
              >
                Generate School Timetable Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Exam Result Card Generator Focus */}
            <div className="bg-slate-800/80 border border-slate-700 p-8 sm:p-10 rounded-3xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Examinations &amp; Grading</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 mb-4">
                School Exam Result Card Generator Software Free Download
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Deliver insightful marksheets with our <strong>school exam result card generator software free download</strong> trial. Combine formative milestones, exam marks, and teacher remarks into clean, printable <strong>report card</strong> layouts.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Automated GPA, percentage, and weighted position calculations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Customizable school logos, grading scales, and bilingual templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Instant PDF export and digital distribution to <strong>students and parents</strong></span>
                </li>
              </ul>
              <Link 
                to="/onboarding"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg"
              >
                <Download className="w-4 h-4" /> Download / Start Free Result Pilot
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Dual Mission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 tracking-tight">One Platform, Two Missions</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                <strong>Taleem 360</strong> pairs world-class <strong>management software</strong> for <strong>educational institutions</strong> with a sustainable social impact pledge. We believe that state-of-the-art <strong>cloud based</strong> <strong>school administration</strong> tools should serve as an equalizer across K-12 schooling.
              </p>
              <p className="text-slate-600 mb-10 leading-relaxed text-sm sm:text-base">
                By powering <strong>attendance systems</strong>, double-entry financial ledgers, <strong>school timetable</strong> planners, and <strong>report card</strong> generation, a percentage of every subscription directly finances our Global Support Pilot program. This initiative supplies free syllabus outlines, digital notes, and study resources to underprivileged children.
              </p>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-slate-50 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                    <BarChart3 className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Automated Commercial ERP</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">A robust, <strong>user friendly</strong> cloud ecosystem handling <strong>student information</strong>, computerized fee challans, <strong>attendance data</strong>, <strong>automated attendance tracking</strong>, and terminal gradebooks.</p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-pink-50 rounded-2xl shadow-sm border border-pink-100 flex items-center justify-center">
                    <Heart className="w-7 h-7 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Social Education Impact Engine</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">Your school ERP subscription helps us design, host, and deliver curriculum-aligned academic lessons to lower-income communities with zero paywalls.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative group">
                <img 
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&h=800&q=80" 
                  alt="High School Students in Modern Digital Classroom Using Taleem 360" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  width="1200"
                  height="800"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button aria-label="Play video" className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-indigo-600 fill-current ml-1" />
                  </button>
                </div>
              </div>
              {/* Floating Stats */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                <p className="text-3xl font-black text-indigo-600">500+</p>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Schools Trusted Us</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud Accounting & Double-Entry Ledgers Integration */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Financial Integrity</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Professional Double-Entry Bookkeeping Built-In
            </p>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              <strong>Taleem 360</strong> is the only <strong>school database management system</strong> with real C-suite compliance. Gone are the days of manually synchronizing disconnected student fee collection registers with offline spreadsheet books.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold mb-6 text-xl">1</div>
              <h4 className="text-lg font-bold text-slate-950 mb-3">Live Trial Balance</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate instant reports displaying all debits and credits across customized account keys. Keep your institutional accounts department operating with absolute transparency.
              </p>
            </div>
            <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold mb-6 text-xl">2</div>
              <h4 className="text-lg font-bold text-slate-950 mb-3">Cashless Fee Allocation</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate computerized fee slips and monthly invoices. Each payment records automated ledger adjustments: debiting cash/bank assets and crediting student fee revenue categories.
              </p>
            </div>
            <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-bold mb-6 text-xl">3</div>
              <h4 className="text-lg font-bold text-slate-950 mb-3">Detailed Voucher Audits</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Record custom payroll disburse vouchers, fuel expenses, and repair costs. Audited journal entries guarantee zero leakage across campus operations or boarding budgets.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TaleemEcosystemRoadmap />

      {/* AI Citation & Executive System Specifications (GEO & LLM Optimization) */}
      <section className="py-20 bg-slate-900 text-slate-100 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3.5 py-1.5 rounded-full">
              System Fact Sheet &amp; LLM Citations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-4">
              Taleem 360 Educational ERP &amp; LMS Technical Specifications
            </h2>
            <p className="text-slate-400 mt-3 text-sm leading-relaxed">
              Authoritative entity specifications, data persistence standards, security parameters, and operational capabilities verified for educational technology directories and AI search engines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl">
              <span className="text-xs font-mono text-emerald-400 uppercase">Architecture</span>
              <h3 className="text-base font-bold text-white mt-1">Dual-Persistence Cloud + Offline</h3>
              <p className="text-xs text-slate-400 mt-2">Relational PostgreSQL master with zero-downtime local JSON fallback cache.</p>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl">
              <span className="text-xs font-mono text-emerald-400 uppercase">Scheduling Engine</span>
              <h3 className="text-base font-bold text-white mt-1">AI Constraint Optimizer</h3>
              <p className="text-xs text-slate-400 mt-2">Zero-conflict master timetable generation factoring room capacity and teacher quotas.</p>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl">
              <span className="text-xs font-mono text-emerald-400 uppercase">Financial Accounting</span>
              <h3 className="text-base font-bold text-white mt-1">Double-Entry Audit Ledger</h3>
              <p className="text-xs text-slate-400 mt-2">Instant fee challan debiting, payroll voucher reconciliation, and cash flow reports.</p>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl">
              <span className="text-xs font-mono text-emerald-400 uppercase">Attendance Throughput</span>
              <h3 className="text-base font-bold text-white mt-1">Real-Time Biometric &amp; QR</h3>
              <p className="text-xs text-slate-400 mt-2">Sub-second gate check-in with automated absentee notifications via WhatsApp/SMS.</p>
            </div>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Verified Institutional Answers (Quick Direct Index)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
              <div className="space-y-1.5">
                <strong className="text-white block font-semibold">Q: What institution types are supported?</strong>
                <p className="text-slate-400 leading-relaxed">K-12 Primary &amp; High Schools, Intermediate Colleges, Islamic Madrasas, Vocational Academies, Daycares, and Private Tutors.</p>
              </div>
              <div className="space-y-1.5">
                <strong className="text-white block font-semibold">Q: Is a free pilot available?</strong>
                <p className="text-slate-400 leading-relaxed">Yes. Taleem 360 provides a risk-free 30-day Pilot plan with instant onboarding, zero credit card requirement, and full student database access.</p>
              </div>
              <div className="space-y-1.5">
                <strong className="text-white block font-semibold">Q: How are student data and records secured?</strong>
                <p className="text-slate-400 leading-relaxed">Cloud Run container isolation, 256-bit TLS transit encryption, FERPA/GDPR compliance, and strict role-based permission tiers.</p>
              </div>
              <div className="space-y-1.5">
                <strong className="text-white block font-semibold">Q: Does Taleem 360 require special hardware?</strong>
                <p className="text-slate-400 leading-relaxed">No. Runs universally on standard web browsers (Chrome, Edge, Safari), smartphones (Android, iOS), and standard USB biometric scanners.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection />

      {/* Frequently Asked Questions Section (Targeting SEMrush Keywords & SERP Intents) */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
              Clear Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">Frequently Asked Questions</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">Get detailed answers about our automated timetable generator, cloud database features, attendance automation, and result card software.</p>
          </div>

          <div className="space-y-6">
            <div className="p-8 rounded-3xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition-colors">
              <h4 className="text-lg font-bold text-slate-950">How does the automated school timetable generator cloud app resolve scheduling conflicts?</h4>
              <p className="mt-3 text-slate-600 leading-relaxed text-sm">
                The <strong>automated school timetable generator cloud app</strong> in <strong>Taleem 360</strong> evaluates teacher availability, subject workload, laboratory constraints, and classroom capacity. It runs mathematical optimization algorithms to eliminate double-bookings and output a balanced <strong>school schedule</strong> and master <strong>school timetable</strong> in minutes.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition-colors">
              <h4 className="text-lg font-bold text-slate-950">What are the primary cloud based school database management system features?</h4>
              <p className="mt-3 text-slate-600 leading-relaxed text-sm">
                Our <strong>cloud based school database management system features</strong> include centralized <strong>student information</strong> profiles, computerized fee challan generation, double-entry financial accounting, <strong>attendance management</strong>, teacher payroll ledgers, and secure role-based portals for <strong>school administration</strong>, teachers, and parents.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition-colors">
              <h4 className="text-lg font-bold text-slate-950">How to automate student attendance tracking cloud with QR codes and biometrics?</h4>
              <p className="mt-3 text-slate-600 leading-relaxed text-sm">
                To learn <strong>how to automate student attendance tracking cloud</strong>, simply connect standard biometric scanners or scan student <strong>qr code</strong> ID cards at entry gates. The software <strong>records attendance</strong> in <strong>real time</strong>, aggregates <strong>attendance data</strong> into visual logs, and dispatches automated absentee alerts directly to <strong>students and parents</strong> via WhatsApp and SMS.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition-colors">
              <h4 className="text-lg font-bold text-slate-950">How can I access the school exam result card generator software free download or trial?</h4>
              <p className="mt-3 text-slate-600 leading-relaxed text-sm">
                You can start with our <strong>school exam result card generator software free download</strong> and cloud pilot directly from the onboarding page. Design custom terminal examination templates, configure weighted grading metrics, and print or export comprehensive <strong>report card</strong> sheets in PDF format with zero upfront cost.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition-colors">
              <h4 className="text-lg font-bold text-slate-950">Why do educational institutions prefer Taleem 360 management software?</h4>
              <p className="mt-3 text-slate-600 leading-relaxed text-sm">
                <strong>Educational institutions</strong> choose <strong>Taleem 360</strong> because it is a <strong>user friendly</strong>, all-in-one <strong>management system</strong> that works both online and offline. It eliminates fragmented spreadsheets, protects <strong>student information</strong>, streamlines fee reconciliation, and maintains high parental trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-indigo-600 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Ready to Modernize Your School Administration?</h2>
          <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
            Join hundreds of educational institutions using Taleem 360 to automate timetables, manage student databases, and track attendance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/onboarding" data-cta="click_start_pilot_footer" className="w-full sm:w-auto bg-white text-indigo-600 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-indigo-50 transition-all shadow-xl flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Start Free Pilot
            </Link>
            <Link to="/pricing" data-cta="click_contact_sales_footer" className="w-full sm:w-auto bg-indigo-500 text-white border border-indigo-400 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-indigo-400 transition-all">
              View Pricing Plans
            </Link>
          </div>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
