import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Heart, 
  Award, 
  CheckCircle, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Smartphone, 
  Download, 
  Star,
  ExternalLink,
  Milestone,
  Moon,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';
import { Footer } from '../components/Footer';

export const Madrasa: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    document.title = 'Madrasa Management Software Pakistan | Islamic School ERP - Taleem360';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Explore Taleem360\'s specialized Madrasa management software in Pakistan. Integrate Arabic/Islamic curriculums, Hifz milestones, boarding controls, and Sadaqah/Zakat double-entry ledgers.');

    // Dynamic schema markup generation for Madrasa software SEO ranking
    const schemaScriptId = 'jsonld-seo-madrasa';
    let schemaScript = document.getElementById(schemaScriptId);
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('id', schemaScriptId);
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }

    const madrasaSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Taleem360 Madrasa ERP & Islamic Education Suite",
      "url": "https://www.taleem360.online/madrasa",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "All",
      "description": "Unified cloud-based Madrasa management software in Pakistan designed to automate Hifz tracking, Islamic curriculum mapping, and donor funding channels.",
      "brand": {
        "@type": "Brand",
        "name": "Taleem360"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "124",
        "ratingCount": "124",
        "bestRating": "5",
        "worstRating": "1"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };

    schemaScript.innerHTML = JSON.stringify(madrasaSchema);

    return () => {
      // Cleanup script on unmount
      const scriptToRemove = document.getElementById(schemaScriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.06),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(79,70,229,0.04),transparent_50%)] pointer-events-none" />

      {/* Navigation Header (Public - Dark Match) */}
      <nav className="bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-emerald-600 p-2 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">Taleem360</span>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/about" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">About</Link>
              <Link to="/pricing" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Pricing</Link>
              <Link to="/support" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Support</Link>
            </div>
            
            {/* Desktop Navigation Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-emerald-400 transition-colors">Sign In</Link>
              <Link to="/onboarding" className="bg-emerald-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-950/50">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-3">
              <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-emerald-400 transition-colors">Sign In</Link>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-all"
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
              className="md:hidden border-t border-slate-800 bg-slate-950"
            >
              <div className="px-4 py-6 space-y-4 flex flex-col">
                <Link 
                  to="/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-slate-300 hover:text-emerald-400 py-2 border-b border-slate-900 transition-colors"
                >
                  About Taleem360
                </Link>
                <Link 
                  to="/pricing" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-slate-300 hover:text-emerald-400 py-2 border-b border-slate-900 transition-colors"
                >
                  Pricing Packages
                </Link>
                <Link 
                  to="/support" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-slate-300 hover:text-emerald-400 py-2 border-b border-slate-900 transition-colors"
                >
                  Support Center
                </Link>
                <Link 
                  to="/onboarding" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center bg-emerald-600 text-white py-3 rounded-xl text-base font-bold hover:bg-emerald-500 transition-all shadow-lg"
                >
                  Get Started Free
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Header Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Moon className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            Specialized Islamic Education Cloud Suite
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Madrasa Management Software</span> in Pakistan
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            The ultimate Islamic school management system. Streamline Hifz memorization charts, Islamic curriculum progress, Sadaqah/Zakat tracking, and secure boarding student databases.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/onboarding" 
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-8 py-4 rounded-full text-sm transition-all shadow-lg shadow-emerald-950/50 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Start Free Madrasa Pilot
            </Link>
            <Link 
              to="/contact" 
              className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold px-8 py-4 rounded-full text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Request Islamic Boarding Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 border-t border-slate-800/60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              A Modern Islamic Education Management Software Framework
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Modern Madrasas, Darul Ulooms, and Hifz academies in Pakistan face a dual-duty: delivering high-standard Islamic teachings while managing complex student logs, boarding registries, and community-driven donor funds.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Our Madrasa ERP system is built from the ground up to support the Islamic academic sector. We empower administrators to map student progresses across Quran memorization milestones while keeping clean, transparent accounting records.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Hifz &amp; Nazra daily progress logs &amp; milestone trackers</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Secure Madrasa boarding house management registry</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Dedicated Zakat, Sadaqah, and donor fund tracking tables</span>
              </div>
            </div>
          </div>

          {/* Core Modules Grid */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Specialized Darul Uloom ERP Modules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <p className="font-bold text-white mb-1">Hifz Tracking</p>
                <p className="text-[10px] text-slate-400">Track dynamic daily Sabqi, Sabq, and Manzil records with milestone awards.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <p className="font-bold text-white mb-1">Donor Management</p>
                <p className="text-[10px] text-slate-400">Log charity funds, generate printable donor receipts, and manage Zakat allocations.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <p className="font-bold text-white mb-1">Boarding &amp; Lodging</p>
                <p className="text-[10px] text-slate-400">Manage hostel rooms, monitor meal schedules, and secure boarding student details.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <p className="font-bold text-white mb-1">Dual-Persistence Cloud</p>
                <p className="text-[10px] text-slate-400">Offline-resilient database storage ensuring continuous operations without internet drops.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Focus Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-slate-800/60">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">Advanced Features of Taleem360 Madrasa ERP</h2>
          <p className="text-slate-400 text-sm mt-3">Combining traditional educational systems with modern SaaS standards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-950/40 border border-slate-800/60 rounded-3xl hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Milestone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Hifz School Management System</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Track student progress as they memorize Surahs and Juzz. Create digital progression reports showing memorization speeds, errors marked, and revision schedules.
            </p>
          </div>

          <div className="p-8 bg-slate-950/40 border border-slate-800/60 rounded-3xl hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Islamic Education Curriculum</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Incorporate Dars-e-Nizami, Tajweed, Arabic linguistics, and Fiqh curriculum maps. Generate analytical score sheets and grading profiles seamlessly.
            </p>
          </div>

          <div className="p-8 bg-slate-950/40 border border-slate-800/60 rounded-3xl hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Parent Alerts &amp; SMS in Urdu</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Keep parents connected through automatic SMS or WhatsApp updates in both English and Urdu. Instantly alert them on attendance statuses and upcoming events.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-slate-800/60">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
          Frequently Asked Questions — Madrasa ERP
        </h2>

        <div className="space-y-6">
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-2">
              Does this software support Urdu reports and SMS?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes! Our Madrasa management software supports bilingual SMS notifications and printable progress reports. You can send updates to parents in both Urdu and English.
            </p>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-2">
              How are donor, Sadaqah, and Zakat funds managed?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our system includes customized cash book tables specifically for Islamic charity types. Administrators can log collections under specific heads (Zakat, Sadaqah, General Donations) and issue print-ready donation receipts instantly.
            </p>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-2">
              Is there a limit to the number of boarding student rooms we can register?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              There are no arbitrary limits! The boarding student housing module lets you register rooms, assign multiple students to specific hostellers, track meals, and manage student security cards without limits on premium tiers.
            </p>
          </div>
        </div>
      </div>

      {/* Action Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 to-indigo-950/40 border-t border-slate-800 py-16 relative z-10 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-white mb-4">Advance Your Madrasa Operations Today</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
            Digitize academic tracking, secure charity audit databases, and modernise communication for your Madrasa.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/onboarding" 
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-8 rounded-full transition-all cursor-pointer shadow-lg hover:scale-105"
            >
              Get Started for Free
            </Link>
            <Link 
              to="/contact" 
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs py-3.5 px-8 rounded-full transition-all cursor-pointer hover:scale-105"
            >
              Talk to Our Team
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
