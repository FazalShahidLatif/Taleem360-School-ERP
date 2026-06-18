import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, GraduationCap, Home, BookOpen, DollarSign, UserPlus } from 'lucide-react';
import { Footer } from '../components/Footer';

export const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = '404 - Classroom Not Found | Taleem360 School Cloud ERP';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'The page you are looking for on Taleem360 is not cached or indexed. Use our directory to return to the school management system dashboards.');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">Taleem360</span>
          </Link>
          <Link to="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Go Back Home
          </Link>
        </div>
      </nav>

      {/* Main Error Illustration and Content Panel */}
      <main className="flex-grow flex items-center justify-center p-6 md:p-12">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl text-center space-y-8 relative overflow-hidden">
          {/* Subtle design elements */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-32 h-32 bg-indigo-50 rounded-full blur-2xl"></div>
          
          <div className="relative">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
              <HelpCircle className="w-12 h-12" />
            </div>
            <span className="absolute -bottom-2 right-1/2 translate-x-12 bg-rose-100 text-rose-800 text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full tracking-wider border border-rose-200 shadow-sm">
              Error 404
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Classroom Not Found</h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
              Our academic digital map couldn't locate this page. It might have migrated to other operational rosters or been de-indexed after configuration audits.
            </p>
          </div>

          {/* Structured Directory Links for SEO / GEO Recovery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <Link 
              to="/about" 
              className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-2xl transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-xs border border-slate-100 text-indigo-600">
                <Home className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-slate-800 group-hover:text-indigo-900">About Our Portal</span>
                <span className="block text-[10px] text-slate-400">Read our dual-mission pledge</span>
              </div>
            </Link>

            <Link 
              to="/pricing" 
              className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-2xl transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-xs border border-slate-100 text-emerald-600">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-slate-800 group-hover:text-emerald-900">Flexible Pricing</span>
                <span className="block text-[10px] text-slate-400">Affordable K-12 cloud portal tiers</span>
              </div>
            </Link>

            <Link 
              to="/blog" 
              className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-2xl transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-xs border border-slate-100 text-purple-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-slate-800 group-hover:text-purple-900">Research Vault</span>
                <span className="block text-[10px] text-slate-400">SEO education audit guides</span>
              </div>
            </Link>

            <Link 
              to="/onboarding" 
              className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-2xl transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-xs border border-slate-100 text-pink-600">
                <UserPlus className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-slate-800 group-hover:text-pink-900">Get Started</span>
                <span className="block text-[10px] text-slate-400">Apply for a free pilot setup</span>
              </div>
            </Link>
          </div>

          <div className="pt-2">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center w-full px-6 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
            >
              Return to Institutional Homepage
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
