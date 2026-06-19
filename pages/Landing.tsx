import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
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
  Bus
} from 'lucide-react';
import { Footer } from '../components/Footer';
import { TaleemEcosystemRoadmap } from '../components/TaleemEcosystemRoadmap';

const Landing: React.FC = () => {
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
              <span className="text-2xl font-black text-slate-900 tracking-tight">Taleem360</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">About</Link>
              <Link to="/pricing" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Pricing</Link>
              <Link to="/free-resources" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Free Resources</Link>
              <Link to="/blog" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Blog</Link>
              <Link to="/support" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Support</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors">Sign In</Link>
              <Link to="/onboarding" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-8 border border-indigo-100"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>The Next Generation School ERP</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]"
            >
              Empowering Schools, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Transforming Futures.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto"
            >
              Taleem360 is a dual-mission platform: A world-class ERP for school management and a social impact engine providing free resources for students in need.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/onboarding" className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2">
                Start Your Free Pilot
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/about" className="w-full sm:w-auto bg-white text-slate-700 border-2 border-slate-100 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Learn Our Mission
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-400/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-400/10 rounded-full blur-[120px]"></div>
        </div>
      </section>

      {/* Dual Mission Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">One Platform, Two Missions</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Taleem360 is built upon a dual-mission philosophy that pairs world-class school management software with a sustainable social impact pledge. We believe that state-of-the-art educational cloud technology should not exclusively belong to the elite, but serve as an equalizer across K-12 school frameworks.
              </p>
              <p className="text-slate-600 mb-10 leading-relaxed">
                By powering commercial administrative rosters, dual-entry accounting systems, offline-supported exam planners, and smart fee invoicing, a percentage of every subscription directly finances our Global Support Pilot program. This initiative supplies free syllabus guides, detailed digital notes, practice exercises, and study outlines to children studying in low-income schools and remote villages.
              </p>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                    <BarChart3 className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Automated Commercial ERP</h3>
                    <p className="text-slate-600 leading-relaxed">A robust, secure cloud ecosystem handling daily staff logs, real-time parent messaging alerts, automated fee invoice printing (including customized monthly/annual fee templates), custom-built student report cards, gradebook modules, and integrated double-entry general ledgers.</p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                    <Heart className="w-7 h-7 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Social Education Impact Engine</h3>
                    <p className="text-slate-600 leading-relaxed">Your school ERP subscription helps us design, host, and deliver free, curriculum-aligned academic lessons. Lower-income students and unprivileged institutions gain instant, zero-cost access to comprehensive study materials without annoying paywalls.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative group">
                <img 
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&h=800&q=80" 
                  alt="High School Students in Modern Digital Classroom" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Financial Integrity</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Professional Double-Entry Bookkeeping Built-In
            </p>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              Taleem360 is the only school management portal with real C-suite compliance. Gone are the days of manually synchronizing disconnected student fee collection registers with offline spreadsheet books.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold mb-6 text-xl">1</div>
              <h4 className="text-lg font-bold text-slate-950 mb-3">Live Trial Balance</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate instant reports displaying all debits and credits across customized account keys. Keep your institutional accounts department operating with absolute transparency.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold mb-6 text-xl">2</div>
              <h4 className="text-lg font-bold text-slate-950 mb-3">Cashless Fee Allocation</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate computerized fee slips and monthly invoices. Each payment records automated ledger adjustments: debiting cash/bank assets and crediting student fee revenue categories.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-bold mb-6 text-xl">3</div>
              <h4 className="text-lg font-bold text-slate-950 mb-3">Detailed Voucher Audits</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Record custom payroll disburse vouchers, fuel expenses, and repair costs. Audited journal entries guarantee zero leakage across campus operations or boarding budgets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything Your School Needs</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">A modular approach to cloud K-12 administration that integrates seamlessly under one database.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Smart attendance", desc: "Real-time tracking with automated parent SMS, chat support, and daily roster reports.", icon: Users, color: "bg-blue-50 text-blue-600" },
              { title: "Fee management", desc: "Computerized invoices, online payment gateways, automated fine systems, and fee balance sheets.", icon: BarChart3, color: "bg-emerald-50 text-emerald-600" },
              { title: "Exam portal & gradebooks", desc: "Prepare terminal templates, register grade scales, print custom report cards, and track students over time.", icon: CheckCircle2, color: "bg-purple-50 text-purple-600" },
              { title: "Library catalogs", desc: "Track digitized books, manage issue states, monitor overdue notifications, and calculate security fines.", icon: BookOpen, color: "bg-orange-50 text-orange-600" },
              { title: "LMS & notes directory", desc: "Deliver curriculum resources, digital syllabus notebooks, lecture plans, and home assignments to portals.", icon: Zap, color: "bg-amber-50 text-amber-600" },
              { title: "Fleet & transit safety", desc: "Manage bus vehicle registration, fuel usage accounts, route rosters, and student boarding logs.", icon: Bus, color: "bg-indigo-50 text-indigo-600" }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 capitalize">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TaleemEcosystemRoadmap />

      {/* Frequently Asked Questions Section (Eliminates Thin Content and Drives SEO Keywords) */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">Get detailed answers about the school ERP cloud software features, pricing tiers, security, and setup guides.</p>
          </div>

          <div className="space-y-6">
            <div className="p-8 rounded-3xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors">
              <h4 className="text-lg font-bold text-slate-950">Is my school's student directory and fee data secure on the cloud?</h4>
              <p className="mt-3 text-slate-600 leading-relaxed text-sm">
                Yes, safety is our top priority. Taleem360 operates on encrypted Cloud Run isolated containers backed by active Firebase security rules. All administrative rosters, parent identity details, and ledger histories are backed up continuously, preventing unauthorized access or accidental record deletion.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors">
              <h4 className="text-lg font-bold text-slate-950">Can we customize our school fee structures or define sibling discount rates?</h4>
              <p className="mt-3 text-slate-600 leading-relaxed text-sm">
                Absolutely! Our system is designed with customizable fee template utilities. School directors can define customized grade-wise fees, issue sibling discount percentages, create special tuition waivers, charge overdue fines, and generate printable challans in a single automated ledger run.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors">
              <h4 className="text-lg font-bold text-slate-950">What does the Social Impact Program include on cheap or pilot tiers?</h4>
              <p className="mt-3 text-slate-600 leading-relaxed text-sm">
                Every commercial subscriber (including Tier 1 and Tier 2) directly helps generate and update our free academic library hosting curriculum chapters, notes, and worksheets. This interactive library helps underprivileged schools operate without digital hurdles, providing their students with equal educational content.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors">
              <h4 className="text-lg font-bold text-slate-950">Does Taleem360 support CSV or Excel importing for existing rosters?</h4>
              <p className="mt-3 text-slate-600 leading-relaxed text-sm">
                Yes, transitioning from spreadsheets is incredibly straightforward. During our interactive onboarding flow, administrators can bulk import existing class setups, teacher profiles, student folders, and initial fee records directly using CSV, reducing manual entry time from weeks to just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-indigo-600 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Ready to Modernize Your School?</h2>
          <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
            Join hundreds of schools already using Taleem360 to streamline operations and improve student outcomes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/onboarding" className="w-full sm:w-auto bg-white text-indigo-600 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-indigo-50 transition-all shadow-xl">
              Start Free Pilot
            </Link>
            <Link to="/tickets" className="w-full sm:w-auto bg-indigo-500 text-white border border-indigo-400 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-indigo-400 transition-all">
              Contact Sales
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
