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
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Footer } from '../components/Footer';

export const About: React.FC = () => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-indigo-600 px-6 py-16 sm:px-12 sm:py-24 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/30 text-indigo-100 text-sm font-bold mb-6 backdrop-blur-sm border border-indigo-400/20"
          >
            Our Mission
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold text-white tracking-tight mb-6"
          >
            Empowering Education Through <span className="text-indigo-200">Intelligence</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-indigo-100 leading-relaxed mb-8"
          >
            Taleem360 is more than just an ERP. We are a team of educators and technologists 
            dedicated to bridging the gap between traditional management and modern, AI-driven 
            educational excellence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              to="/pricing" 
              className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Join Our Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-20"></div>
      </section>

      {/* Core Values */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">The Values That Drive Us</h2>
          <p className="text-gray-500">We believe that every school deserves access to world-class technology, regardless of its size or location.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "Precision Management",
              description: "Eliminating administrative friction so educators can focus on what matters most: teaching.",
              color: "bg-blue-50 text-blue-600"
            },
            {
              icon: Users,
              title: "Community First",
              description: "Building bridges between parents, teachers, and students for a holistic learning experience.",
              color: "bg-emerald-50 text-emerald-600"
            },
            {
              icon: Zap,
              title: "AI Innovation",
              description: "Leveraging cutting-edge intelligence to provide insights that drive student success.",
              color: "bg-amber-50 text-amber-600"
            }
          ].map((value, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl ${value.color} flex items-center justify-center mb-6`}>
                <value.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-500 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 rounded-3xl p-12 text-white overflow-hidden relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          {[
            { label: "Schools Onboarded", value: "500+" },
            { label: "Active Students", value: "100k+" },
            { label: "Daily Transactions", value: "250k+" },
            { label: "Uptime Guarantee", value: "99.9%" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-4xl font-bold mb-2">{stat.value}</p>
              <p className="text-gray-400 text-sm uppercase tracking-wider font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Institutions Trust Taleem360</h2>
          <div className="space-y-6">
            {[
              "Enterprise-grade security and data encryption",
              "Seamless integration with existing school workflows",
              "Real-time analytics and performance tracking",
              "Dedicated 24/7 support for all institutions",
              "Affordable pricing tiers for every budget",
              "Regular updates with new AI-driven features"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start">
                <div className="mt-1 flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="ml-3 text-gray-600 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative max-w-lg mx-auto w-full">
          <div className="aspect-square rounded-3xl bg-gray-100 overflow-hidden shadow-inner flex items-center justify-center p-8 md:p-12">
             <div className="grid grid-cols-2 gap-4 w-full h-full">
                <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-center items-center text-center">
                   <Award className="w-10 h-10 text-amber-500 mb-4" />
                   <p className="font-bold text-gray-900">Excellence</p>
                </div>
                <div className="bg-indigo-600 rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center text-center text-white">
                   <Globe className="w-10 h-10 mb-4" />
                   <p className="font-bold">Global Reach</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-center items-center text-center">
                   <ShieldCheck className="w-10 h-10 text-emerald-500 mb-4" />
                   <p className="font-bold text-gray-900">Security</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-center items-center text-center">
                   <Users className="w-10 h-10 text-indigo-600 mb-4" />
                   <p className="font-bold text-gray-900">Community</p>
                </div>
             </div>
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center space-x-3">
             <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Zap className="w-5 h-5" />
             </div>
             <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Powered by</p>
                <p className="text-sm font-bold text-gray-900">Advanced AI</p>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Transform Your School?</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            to="/pricing" 
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Get Started Today
          </Link>
          <Link 
            to="/tickets" 
            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            Contact Sales
          </Link>
        </div>
      </section>
    </div>
  );
};
