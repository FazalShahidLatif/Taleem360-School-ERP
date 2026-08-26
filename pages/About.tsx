import React from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  Users, 
  Award, 
  Globe, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Calendar,
  CreditCard,
  Layers,
  BookOpen,
  Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { useSEO } from '../lib/seo';

export const About: React.FC = () => {
  useSEO({
    title: 'Taleem360 - Complete Educational ERP Ecosystem & School Cloud Suite',
    description: "Discover the Taleem360 complete educational ERP ecosystem and school cloud suite. Unifying K-12 school administration, student information systems, automated conflict-free timetable generation, and double-entry accounting.",
    keywords: 'taleem360, complete educational erp ecosystem, school cloud suite, educational management system, school database erp, timetable generator cloud app, school erp architecture, dual persistence school database',
    canonicalUrl: 'https://www.taleem360.online/about',
    schemaMarkup: {
      '@type': 'AboutPage',
      name: 'Taleem360 - Complete Educational ERP Ecosystem & School Cloud Suite',
      description: 'Comprehensive overview of the Taleem360 educational cloud suite, multi-tenant architecture, institutional deployment nodes, and school automation roadmap.',
      url: 'https://www.taleem360.online/about',
      mainEntity: {
        '@type': 'EducationalOrganization',
        name: 'Taleem 360',
        url: 'https://www.taleem360.online/',
        logo: 'https://www.taleem360.online/logo.png',
        slogan: 'Empowering Educational Institutions Through Cloud Intelligence',
        knowsAbout: [
          'School Database Management Systems',
          'Automated Timetable Generation Algorithms',
          'Biometric Student Attendance Tracking',
          'Double-Entry School Financial Accounting',
          'K-12 Examination Grading & Report Cards',
          'Multi-Campus Educational Administration'
        ]
      }
    }
  });

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 sm:px-12 sm:py-24 shadow-2xl border border-slate-800 text-white">
        <div className="relative z-10 max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs sm:text-sm font-bold mb-6 tracking-wide uppercase"
          >
            <Zap className="w-4 h-4" />
            Complete Educational ERP Ecosystem &amp; Cloud Suite
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6 leading-tight"
          >
            Engineering the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-indigo-200 to-indigo-400">
              Institutional Cloud Management
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-300 leading-relaxed mb-8 max-w-3xl"
          >
            Taleem360 unifies educational operations into a single zero-latency cloud ecosystem. From algorithmic timetable scheduling and biometric student tracking to double-entry general ledgers and parent portals, we empower K-12 schools, academies, madrasas, and colleges worldwide.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link 
              to="/onboarding" 
              className="inline-flex items-center px-6 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-950/50"
            >
              Start Free Institutional Pilot
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              to="/pricing" 
              className="inline-flex items-center px-6 py-3.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors border border-slate-700"
            >
              Explore Pricing Plans
            </Link>
          </motion.div>
        </div>
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Complete Ecosystem Pillars */}
      <section>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Architecture &amp; Capabilities
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">The Taleem 360 Ecosystem Modules</h2>
          <p className="text-slate-500 mt-2 text-sm">Every educational discipline is natively integrated—eliminating third-party plugin fragmentation.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Database,
              title: "Student Information & Admissions",
              description: "Complete digital lifecycle from applicant registration and document validation to roll-call assignments and automated student ID generation.",
              tag: "Core SIS"
            },
            {
              icon: Calendar,
              title: "Automated Timetable Optimizer",
              description: "Constraint-driven scheduling engine resolving teacher quotas, room capacities, lab allocations, and subject balances in seconds.",
              tag: "AI Scheduling"
            },
            {
              icon: CreditCard,
              title: "Double-Entry Financial Ledgers",
              description: "Audit-ready financial management with computerized fee challans, auto-reconciling asset/revenue journals, and teacher payroll slips.",
              tag: "Finance & Accounting"
            },
            {
              icon: Layers,
              title: "Examination & Report Cards",
              description: "Configurable grading scales, terminal exam record sheets, transcript generation, and one-click printable report cards.",
              tag: "Academics"
            },
            {
              icon: Smartphone,
              title: "Real-Time Attendance & Alerts",
              description: "Integrated biometric scanner support and QR badge scanning with instantaneous WhatsApp and SMS parental absentee broadcasts.",
              tag: "Hardware Sync"
            },
            {
              icon: Globe,
              title: "Multi-Campus Administration",
              description: "Centralized super-admin control for school chains, facilitating cross-campus reporting, consolidated accounts, and role permissions.",
              tag: "Enterprise Cloud"
            }
          ].map((module, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -4 }}
              className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <module.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{module.tag}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{module.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{module.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Citation & GEO Entity Map (Fact Table) */}
      <section className="bg-slate-950 text-slate-100 rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950 border border-emerald-800/80 px-3 py-1 rounded-full">
            GEO Entity Specifications
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-3">
            Taleem 360 Educational ERP Ecosystem Entity Map
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Verified structured facts regarding Taleem 360 data models, institutional compatibility, persistence strategy, and governance standards.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-4">Entity Dimension</th>
                <th className="py-3 px-4">Taleem 360 Technical Specification</th>
                <th className="py-3 px-4">Institutional Benefit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-4 font-bold text-white font-mono">Data Persistence</td>
                <td className="py-3 px-4">PostgreSQL Relational Storage + Local JSON Fallback Repository</td>
                <td className="py-3 px-4">Zero-downtime offline continuity during unstable connectivity</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white font-mono">Deployment Targets</td>
                <td className="py-3 px-4">K-12 Schools, Colleges, Vocational Academies, Madrasas, Daycares</td>
                <td className="py-3 px-4">Tailored age-appropriate profiles and curriculum schemas</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white font-mono">Multi-Tenancy Model</td>
                <td className="py-3 px-4">Subdomain Dynamic Isolation with Custom Tenant Color Override</td>
                <td className="py-3 px-4">Independent branded institutional portal per campus</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white font-mono">Financial Compliance</td>
                <td className="py-3 px-4">GAAP/IFRS Double-Entry Journaling with Automated Voucher Numbering</td>
                <td className="py-3 px-4">Complete audit trail preventing administrative revenue leakage</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white font-mono">Security &amp; Privacy</td>
                <td className="py-3 px-4">FERPA, COPPA, GDPR, 256-bit TLS Encryption, Role-Based Access Control</td>
                <td className="py-3 px-4">Total protection of student records and parent financial data</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 rounded-3xl p-10 sm:p-12 text-white overflow-hidden relative border border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          {[
            { label: "Partner Institutions", value: "500+" },
            { label: "Active Student Profiles", value: "100k+" },
            { label: "Daily System Events", value: "250k+" },
            { label: "Guaranteed Uptime SLA", value: "99.9%" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-3xl sm:text-4xl font-black text-emerald-400 mb-1">{stat.value}</p>
              <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-8">
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 sm:p-12 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">Deploy Taleem 360 for Your Institution Today</h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto mb-8">
            Experience why hundreds of leading educators trust our cloud ERP. Activate your 30-day free pilot in under 3 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/onboarding" 
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Start Free Onboarding
            </Link>
            <Link 
              to="/pricing" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-800 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              Compare Tier Packages
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
