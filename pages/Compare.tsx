import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  X, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Award, 
  Zap, 
  Database, 
  Layers, 
  HelpCircle, 
  Star, 
  MessageSquare,
  Bookmark,
  ChevronRight,
  Globe
} from 'lucide-react';
import { useSEO } from '../lib/seo';
import { Footer } from '../components/Footer';

interface Competitor {
  id: string;
  name: string;
  tagline: string;
  focus: string;
  pros: string[];
  cons: string[];
  pricing: string;
  rating: string;
}

const competitors: Competitor[] = [
  {
    id: 'fedena',
    name: 'Fedena',
    tagline: 'Traditional heavy K-12 ERP',
    focus: 'K-12 School Administration',
    pros: ['Good basic student records', 'Widely used historically'],
    cons: ['Lacks native daycare/Quran tracking modules', 'No local storage offline database fallback', 'Complex & rigid setup required'],
    pricing: 'Expensive custom licensing',
    rating: '4.2/5'
  },
  {
    id: 'procare',
    name: 'Procare',
    tagline: 'US-focused daycare specialist',
    focus: 'Early Childhood & Daycare Centers',
    pros: ['Decent check-in/out log tools', 'Parent messaging features'],
    cons: ['No complex K-12 examination matrices', 'Lacks white-label rebranding features', 'Expensive transactional fee collection'],
    pricing: 'Starts at $79/mo + high card fees',
    rating: '4.4/5'
  },
  {
    id: 'brightwheel',
    name: 'Brightwheel',
    tagline: 'Clean early learning helper',
    focus: 'Daycare & Preschool Centers',
    pros: ['Modern user interface', 'Daily logs and activity share'],
    cons: ['No local multi-tenant SQL database resilience', 'Does not support custom reseller branding', 'No Madrasa/Quran syllabus management'],
    pricing: 'Opaque quotation-based pricing',
    rating: '4.5/5'
  },
  {
    id: 'classdojo',
    name: 'ClassDojo',
    tagline: 'Simple communication app',
    focus: 'Parent-Teacher Communication',
    pros: ['High parental adoption', 'Fun points and badges system'],
    cons: ['No double-entry ledgers or payroll', 'No staff leaves or exam report cards', 'Does not manage physical school settings'],
    pricing: 'Freemium (aggressive parent up-sells)',
    rating: '4.6/5'
  }
];

export const Compare: React.FC = () => {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('fedena');
  const activeComp = competitors.find(c => c.id === selectedCompetitor) || competitors[0];

  const pageSchema = {
    "@type": "Product",
    "name": "Taleem360 ERP vs Competitors",
    "image": "https://www.taleem360.online/logo.png",
    "description": "Programmatic side-by-side technical comparison of Taleem360 against conventional school platforms (Fedena, Procare, Brightwheel, and ClassDojo) highlighting offline resilience and white-label pricing.",
    "brand": {
      "@type": "Brand",
      "name": "Taleem360"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "29",
      "highPrice": "199",
      "offerCount": "3"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "124"
    }
  };

  useSEO({
    title: `Compare Taleem360 vs ${activeComp.name} | Advanced School Management Suite`,
    description: `How does Taleem360 compare with ${activeComp.name}? Compare features including double-entry ledgers, local database offline fallback, white-labeling, Madrasa modules, and transparent pricing.`,
    keywords: `compare school erp, taleem360 vs ${activeComp.name}, school management software comparison, white label lms, offline daycare tracker`,
    schemaMarkup: pageSchema
  });

  const comparisonFeatures = [
    { name: 'Dual-Persistence Architecture (Offline-First Fallback)', t360: true, comp: false, detail: 'Taleem360 continues running locally even if internet connection drops, syncs when online.' },
    { name: 'White-Label Branding (Own Logo, Domains & Branding)', t360: true, comp: false, detail: 'Taleem360 allows full custom domain settings for reselling or private brand identity.' },
    { name: 'Unified Multi-Tenant (K-12, Madrasa, Daycare, Tutors)', t360: true, comp: false, detail: 'Consolidate multiple child centers under one clean corporate admin portal.' },
    { name: 'Double-Entry Fee Ledger & Automated Bank Sync', t360: true, comp: false, detail: 'Comprehensive charts of accounts, automatic invoices, and bank transaction reconciliation.' },
    { name: 'Quran Tracker (Siparah, Surah & Ayat Logs)', t360: true, comp: false, detail: 'Specialized progress tracker for Islamic learning institutions and Madrasas.' },
    { name: 'Daily Activity Logs & PIN Terminals', t360: true, comp: true, detail: 'Secure daycare check-ins, pickup validations, feed and sleep activity trackers.' },
    { name: 'Free Resources & Direct PDF Syllabus Vault', t360: true, comp: false, detail: 'Instantly download state-aligned syllabus binders and administrative assets.' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Navigation Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-black text-white tracking-tight">
              Taleem<span className="text-emerald-400">360</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link 
              to="/free-resources" 
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Free Resources
            </Link>
            <Link 
              to="/login" 
              className="text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-slate-900 px-4 py-2 rounded-xl transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Platform Comparison Engine
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6">
          Compare Taleem360 with <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Traditional Platforms
          </span>
        </h1>
        <p className="text-base text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          See why over 1,400+ progressive academies, Quran schools, daycare centers, and white-label business owners rely on our resilient offline-first design instead of monolithic legacy ERPs.
        </p>

        {/* Competitor Tabs */}
        <div className="flex flex-wrap justify-center gap-2 bg-slate-900/60 p-2 rounded-2xl border border-slate-800/80 max-w-xl mx-auto">
          {competitors.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCompetitor(c.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
                selectedCompetitor === c.id
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              vs {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Core Comparison Visualizer */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Side-by-Side Detailed Card */}
          <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-6 mb-8 gap-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Active Comparison</span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Taleem360 <span className="text-slate-500 text-sm font-normal">vs</span> {activeComp.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{activeComp.tagline}</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                  Taleem360 (4.9★)
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400">
                  {activeComp.name} ({activeComp.rating}★)
                </span>
              </div>
            </div>

            {/* Pros and Cons split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-2xl p-5">
                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Zap className="w-4.5 h-4.5" />
                  Where Taleem360 Dominates:
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>100% Offline Resilience:</strong> Works even if the school loses connection. No lost data.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Full-Suite Versatility:</strong> No need to buy distinct apps for K-12, preschool, or academy.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>True White-Label:</strong> Rebrand completely on custom subdomains to capture brand equity.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <X className="w-4.5 h-4.5 text-amber-500" />
                  Why Customers Migrated from {activeComp.name}:
                </h4>
                <ul className="space-y-3">
                  {activeComp.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-400">
                      <X className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Comparison Table */}
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4">
              Detailed Technical Comparison matrix
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Operational Feature</th>
                    <th className="py-3 text-[11px] font-bold uppercase tracking-wider text-emerald-400 text-center">Taleem360</th>
                    <th className="py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">{activeComp.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {comparisonFeatures.map((f, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-3.5 pr-4">
                        <span className="text-xs font-semibold text-white block">{f.name}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{f.detail}</span>
                      </td>
                      <td className="py-3.5 text-center">
                        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                      </td>
                      <td className="py-3.5 text-center">
                        {f.comp ? (
                          <Check className="w-5 h-5 text-slate-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
              <Award className="w-8 h-8 text-emerald-400 mb-4" />
              <h4 className="text-sm font-bold text-white mb-2">Resilient Dual-Persistence</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Unlike traditional cloud-only tools that block daycare or Quran center access if the connection drops, Taleem360's standard offline architecture allows complete local student records retention and zero-latency parent PIN lookups.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Database className="w-4 h-4" />
                <span>Zero Server Dependencies Offline</span>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
              <TrendingUp className="w-8 h-8 text-emerald-400 mb-4" />
              <h4 className="text-sm font-bold text-white mb-2">Competitive Pricing Gap</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Conventional ERP suites bill you based on arbitrary student headcounts. Taleem360 provides flat-rate regional pricing so schools can scale without penalizing student registration metrics.
              </p>
              <div className="space-y-2 border-t border-slate-800 pt-4 mt-4">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Taleem360 flat tier:</span>
                  <span className="font-bold text-emerald-400">From $29/mo</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{activeComp.name} estimated:</span>
                  <span>{activeComp.pricing}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-emerald-950/20 border border-emerald-900/30 rounded-3xl p-6 text-center">
              <h4 className="text-base font-bold text-white mb-2">Want to Migrate to Taleem360?</h4>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                We provide a **free data onboarding migration concierge** to import your existing student records and fee histories seamlessly.
              </p>
              <Link
                to="/contact?subject=Migrate%20from%20Competitor"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-lg"
              >
                Request Free Migration
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Structured Comparison Schema Section */}
      <section className="bg-slate-900/20 border-t border-slate-900 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-xl font-bold text-white mb-3">Our Transparent Operational Guarantee</h3>
          <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
            All data specifications listed on this comparison engine are audited monthly. We value ethical transparency; if you discover any discrepancy in the comparison records, submit a direct on-call triage ticket to rectify it instantly.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/tickets" className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition-colors">
              Submit Comparison Audit Request
            </Link>
            <Link to="/pricing" className="px-5 py-2.5 bg-emerald-950/40 border border-emerald-900/30 hover:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-400 transition-colors">
              View Active Pricing Plans
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
