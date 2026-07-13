import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  CheckCircle, 
  Sparkles, 
  Smartphone, 
  Layers, 
  Globe, 
  Palette, 
  Users, 
  ArrowRight, 
  ChevronRight, 
  Award,
  PhoneCall,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import { Footer } from '../components/Footer';

export const WhiteLabel: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'White Label School Management Software | Custom Branded School ERP';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Launch your own EdTech business with Pakistan\'s leading white-label school management software and rebrandable school ERP. Dynamic subdomain routing, customized domain branding, and robust reseller programs.');

    // Schema Markup for White Label Product
    const schemaScriptId = 'jsonld-whitelabel-seo';
    let schemaScript = document.getElementById(schemaScriptId);
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('id', schemaScriptId);
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }

    const whiteLabelSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Taleem360 White-Label School ERP",
      "operatingSystem": "All Cloud Platforms",
      "applicationCategory": "EducationalBusinessApplication",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "84"
      },
      "offers": {
        "@type": "Offer",
        "price": "129.00",
        "priceCurrency": "USD"
      },
      "description": "Premium white-label school management software and rebrandable school ERP platform with custom subdomains, custom logo integration, and specialized developer API support."
    };

    schemaScript.innerHTML = JSON.stringify(whiteLabelSchema);

    return () => {
      const scriptToRemove = document.getElementById(schemaScriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.06),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(79,70,229,0.05),transparent_50%)] pointer-events-none" />

      {/* Navigation Header */}
      <nav className="bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-emerald-600 p-2 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">Taleem360</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/about" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">About</Link>
              <Link to="/pricing" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Pricing</Link>
              <Link to="/free-resources" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Free Printables</Link>
              <Link to="/blog" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Blog</Link>
              <Link to="/support" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Support</Link>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-emerald-400 transition-colors">Sign In</Link>
              <Link to="/onboarding" className="bg-emerald-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-950/50">
                Get Started
              </Link>
            </div>

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
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-slate-300 hover:text-emerald-400 py-2 border-b border-slate-900 transition-colors">About Taleem360</Link>
                <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-slate-300 hover:text-emerald-400 py-2 border-b border-slate-900 transition-colors">Pricing Packages</Link>
                <Link to="/free-resources" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-slate-300 hover:text-emerald-400 py-2 border-b border-slate-900 transition-colors">Free Worksheets</Link>
                <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-slate-300 hover:text-emerald-400 py-2 border-b border-slate-900 transition-colors">Educational Blog</Link>
                <Link to="/support" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-slate-300 hover:text-emerald-400 py-2 border-b border-slate-900 transition-colors">Support Center</Link>
                <Link to="/onboarding" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center bg-emerald-600 text-white py-3 rounded-xl text-base font-bold hover:bg-emerald-500 transition-all shadow-lg">Get Started Free</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Launch Your Own EdTech Platform
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            White Label <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">School Management Software</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Own the most comprehensive, rebrandable school ERP system in Pakistan. Deliver custom logo branding, subdomains, and tailored parent-teacher portals under your own business name.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/onboarding" 
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-8 py-4 rounded-full text-sm transition-all shadow-lg shadow-emerald-950/50 hover:scale-105 active:scale-95"
            >
              Start Reseller Trial
            </Link>
            <Link 
              to="/contact" 
              className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold px-8 py-4 rounded-full text-sm transition-all hover:scale-105 active:scale-95"
            >
              Contact Our Sales Team
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 border-t border-slate-800/60">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">Fully Brandable &amp; Feature-Rich Infrastructure</h2>
          <p className="text-slate-400 text-sm mt-3">Rebrand the core engine to perfectly match your agency identity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-950/40 border border-slate-800/60 rounded-3xl hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-6">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Custom Domain &amp; Logo Branding</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Provision custom domains or dynamic subdomains for every school client. Replace all Taleem360 traces with your company logo, custom primary colors, and footer copyrights.
            </p>
          </div>

          <div className="p-8 bg-slate-950/40 border border-slate-800/60 rounded-3xl hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-6">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Vercel Subdomain Routing</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Highly scalable tenant mapping system automatically parses domain or subdomain prefixes to render school-specific assets, fee gates, and custom biometric dashboard settings.
            </p>
          </div>

          <div className="p-8 bg-slate-950/40 border border-slate-800/60 rounded-3xl hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Multi-Tenant School ERP Engine</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Uncontested private label school management system. Manage K-12 private school franchises, vocational academies, daycare hubs, and madrasas within a singular admin control panel.
            </p>
          </div>
        </div>
      </div>

      {/* Reseller Program Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-slate-800/60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              School Software Reseller Program for Developers &amp; Agencies
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Are you an IT consultancy, local software dealer, or independent developer in Pakistan? With our private-label school management system, you can resell state-of-the-art educational tech to school networks in Karachi, Lahore, Islamabad, and globally. Keep 100% of your retail margins while we manage the cloud database performance.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Completely rebrandable school lms and student database packages</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Zero setup fee for reseller partners with white-label packages</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Custom database isolation options for enterprise local school hubs</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              White-Label Partnership Model
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="text-xs font-bold text-emerald-400 mb-1">Step 1: Onboard Your Brand</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Provide your company logo, subdomains, brand colors, and support telephone contacts.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="text-xs font-bold text-emerald-400 mb-1">Step 2: Custom Client Provisioning</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Easily register unlimited schools, daycares, or academies via your reseller cockpit dashboard in seconds.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="text-xs font-bold text-emerald-400 mb-1">Step 3: Collect Revenue</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Charge clients directly using your localized invoicing (JazzCash, EasyPaisa, or bank challans). We charge you a simple flat reseller wholesale rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-slate-800/60">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
          Frequently Asked Questions — White Label School ERP
        </h2>

        <div className="space-y-6">
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-2">
              Is the source code of the white-label school management software provided?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No. Our white-label school software is a cloud-hosted (SaaS) private label platform. This ensures we can provide automated security updates, continuous biometric attendance integration improvements, and keep the databases of your clients highly resilient and backed up daily.
            </p>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-2">
              Can my clients use their own domain name (e.g., erp.schoolname.com)?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes! Our rebrandable school ERP system supports custom domain mapping. Your clients can register their own custom domains, and our Vercel reverse proxy setup will dynamically route them to their localized student portal.
            </p>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-2">
              How do we get customer support for technical issues?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We provide priority SLA support for all our reseller program partners. While you act as the primary contact for your schools, daycares, or academies, our senior tech team handles all backend, server, and API-level queries behind the scenes.
            </p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-emerald-950/60 to-indigo-950/40 border-t border-slate-800 py-16 relative z-10 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-white mb-4">Launch Your White-Label Agency Today</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
            Create high-value cash flows by providing local private schools with customizable domain branding, biometric attendance sync, and mobile payment portals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/onboarding" 
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-8 rounded-full transition-all cursor-pointer shadow-lg"
            >
              Sign Up As Partner
            </Link>
            <a 
              href="tel:+923001234567" 
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs py-3.5 px-8 rounded-full transition-all cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              Reseller Hotline
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
