import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Layers, 
  DollarSign, 
  Calculator, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  Percent,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';

interface CourseSyllabus {
  id: string;
  module: string;
  duration: string;
  concepts: string[];
}

const SYLLABUS_PRESETS: CourseSyllabus[] = [
  {
    id: "module-1",
    module: "Full-Stack Web Engineering & Cloud Ingress",
    duration: "Weeks 1-4",
    concepts: ["React 18+ Architecture", "Vite Development Server Bundling", "Express Middleware Routing", "Drizzle SQL migrations"]
  },
  {
    id: "module-2",
    module: "Decentralized Systems & Cryptography Sandbox",
    duration: "Weeks 5-8",
    concepts: ["EVM Wallet Integration", "Solidity Smart Contract Security Reentrancy Guard", "$NEXUS Payout Ledger Rules", "Decentralized IPFS knowledge warehouse"]
  },
  {
    id: "module-3",
    module: "Enterprise Database Scalability & Replication",
    duration: "Weeks 9-12",
    concepts: ["PostgreSQL Schema Alterations", "Dual-Persistence Fallback Repository Pattern", "Nginx Reverse Proxy port-mapping", "Docker isolated testing runtimes"]
  }
];

export const SkillsAcademy: React.FC = () => {
  // Calculator States
  const [bootcampPrice, setBootcampPrice] = useState<number>(1500);
  const [installmentDuration, setInstallmentDuration] = useState<number>(3); // Months
  const [interestRate, setInterestRate] = useState<number>(4); // Annual percentage fee
  
  // Custom Syllabus Generator States
  const [selectedPreset, setSelectedPreset] = useState<string>("module-1");
  const [customCourseTitle, setCustomCourseTitle] = useState('');
  const [customDuration, setCustomDuration] = useState('8 Weeks');
  const [customConcepts, setCustomConcepts] = useState('');
  const [customSyllabi, setCustomSyllabi] = useState<CourseSyllabus[]>([]);

  // Calculate installment streams
  const calculateInstallments = () => {
    const principal = bootcampPrice;
    const rateDecimal = interestRate / 100;
    const totalWithInterest = principal * (1 + rateDecimal * (installmentDuration / 12));
    const monthlyPayment = totalWithInterest / installmentDuration;
    
    return {
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      totalBillable: parseFloat(totalWithInterest.toFixed(2)),
      financeCharge: parseFloat((totalWithInterest - principal).toFixed(2))
    };
  };

  const results = calculateInstallments();

  const handleCreateCustomSyllabus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCourseTitle) return;
    
    const newModule: CourseSyllabus = {
      id: `custom-${Date.now()}`,
      module: customCourseTitle,
      duration: customDuration,
      concepts: customConcepts ? customConcepts.split(',').map(item => item.trim()) : ["Interactive classroom discussion", "Weekly evaluation assignments"]
    };

    setCustomSyllabi(prev => [...prev, newModule]);
    setCustomCourseTitle('');
    setCustomConcepts('');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 rounded-full text-purple-800 text-xs font-bold mb-4">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>WHITE-LABEL LMS PAKISTAN</span>
          </div>
          <h1 className="text-3.5xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Taleem360 <span className="text-indigo-600 font-extrabold">Skills Academy Management Software</span>
          </h1>
          <p className="mt-3 text-slate-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            The premier IT institute management software Pakistan. Empower your center with a modern vocational training management system, coaching academy software pakistan, online tutor management software, integrated tutor booking system pakistan, and a fully customizable white label lms pakistan.
          </p>
        </div>

        {/* 2-Column Main Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column A: Interactive Installment Sandbox (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Split-Installment Payment Simulator</h3>
                  <p className="text-xs text-slate-400">Calculate flexible tuition structures natively matched by academic billing records.</p>
                </div>
              </div>

              {/* Sliders and controls */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">Base Tuition Fee</label>
                    <span className="text-sm font-bold text-indigo-600 font-mono">${bootcampPrice} USD</span>
                  </div>
                  <input 
                    type="range" 
                    min="300" 
                    max="6000" 
                    step="100"
                    value={bootcampPrice} 
                    onChange={(e) => setBootcampPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>$300</span>
                    <span>$3,000</span>
                    <span>$6,000</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Installment Cycles (Months)</label>
                    <select 
                      value={installmentDuration}
                      onChange={(e) => setInstallmentDuration(Number(e.target.value))}
                      className="bg-white block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    >
                      <option value={2}>2 Monthly Installments</option>
                      <option value={3}>3 Monthly Installments</option>
                      <option value={6}>6 Monthly Installments</option>
                      <option value={12}>12 Monthly Installments</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Processing Interest Margin (%)</label>
                    <div className="flex items-center gap-2">
                      <select 
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="bg-white block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                      >
                        <option value={0}>0% Interest (Zero-Fee)</option>
                        <option value={1.5}>1.5% Custom Rate</option>
                        <option value={3}>3.0% Custom Rate</option>
                        <option value={4}>4.0% Standard Processing</option>
                        <option value={5.5}>5.5% Premium Grade</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Calculation Outputs */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mt-4">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-3">Live Simulated Billing Metrics</span>
                  
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Monthly Charge</span>
                      <span className="text-lg font-black text-slate-800 font-mono">${results.monthlyPayment}</span>
                      <span className="block text-[8px] text-slate-400 mt-0.5">x {installmentDuration} installments</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Total Billable</span>
                      <span className="text-lg font-black text-indigo-600 font-mono">${results.totalBillable}</span>
                      <span className="block text-[8px] text-slate-400 mt-0.5">Includes rate margin</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Rate Costs</span>
                      <span className="text-lg font-black text-rose-500 font-mono">${results.financeCharge}</span>
                      <span className="block text-[8px] text-slate-400 mt-0.5">Annualised charge</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-200/60">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure Manual / Cash Invoice Tracking</span>
                    <button 
                      onClick={() => {
                        alert(`INSTALLMENT PLAN LOGGED\nTuition plan with monthly installments of $${results.monthlyPayment} logged successfully in the student enrollment ledger.`);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] tracking-wide transition active:scale-95 cursor-pointer"
                    >
                      Record Tuition Installment Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Syllabus & Outline Builder */}
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Custom Syllabus & Program Outliner</h3>
                  <p className="text-xs text-slate-400">Design your institutional curriculum segments dynamically below.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {SYLLABUS_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset.id)}
                    className={`p-3 text-left rounded-xl border text-xs transition cursor-pointer ${
                      selectedPreset === preset.id
                        ? 'border-indigo-600 bg-indigo-50/20 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="block text-[10px] font-extrabold text-slate-400 mb-1">{preset.duration}</span>
                    <span className="font-bold text-slate-800 line-clamp-1">{preset.module}</span>
                  </button>
                ))}
              </div>

              {/* Presets Details */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
                {SYLLABUS_PRESETS.filter(p => p.id === selectedPreset).map(p => (
                  <div key={p.id}>
                    <p className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">{p.duration} Segment Blueprint</p>
                    <h4 className="text-sm font-black text-slate-800 mt-1 mb-3">{p.module}</h4>
                    <ul className="space-y-1.5 list-none pl-0">
                      {p.concepts.map((concept, index) => (
                        <li key={index} className="text-xs text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{concept}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Form to build own course module */}
              <form onSubmit={handleCreateCustomSyllabus} className="space-y-3 pt-3 border-t border-slate-150">
                <p className="text-xs font-bold text-slate-800">Add Custom Academy Module</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    required
                    placeholder="Module Title (e.g. Masterclass Capstone)"
                    value={customCourseTitle}
                    onChange={(e) => setCustomCourseTitle(e.target.value)}
                    className="bg-white block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                  <input 
                    type="text" 
                    placeholder="Duration (e.g. Week 13-14)"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    className="bg-white block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <input 
                  type="text" 
                  placeholder="Concepts (comma-separated, e.g. JWT signing, custom auth filters)"
                  value={customConcepts}
                  onChange={(e) => setCustomConcepts(e.target.value)}
                  className="bg-white block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />

                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="bg-slate-950 font-bold text-white px-4 py-2 rounded-lg text-xs hover:bg-slate-850 transition active:scale-95 cursor-pointer"
                  >
                    Add Syllabus Module
                  </button>
                </div>
              </form>

              {customSyllabi.length > 0 && (
                <div className="mt-4 space-y-2 pt-3 border-t border-slate-150">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Your Dynamically Appended Modules</span>
                  {customSyllabi.map((module) => (
                    <div key={module.id} className="p-3 bg-purple-50/50 border border-purple-100 rounded-lg text-xs">
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-purple-800">{module.module}</span>
                        <span className="text-slate-400">{module.duration}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">{module.concepts.join(' • ')}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* Column B: Benefits & Key Features Checklist (5 Cols) */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            
            {/* Direct Solutions Cards */}
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-4">
              <span className="text-[10px] font-extrabold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full uppercase">
                COHORT METRICS
              </span>
              <h3 className="text-lg font-bold text-slate-900">Why Academies Trust Taleem360?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 text-slate-800 rounded-lg mt-0.5 font-mono text-xs font-black">
                    01
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Dynamic Multi-Tenant Structure</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Every academy receives a custom subdomain node (e.g. `techschool.taleem360.online`) with dynamic brand identity templates and custom CSS assets compiled on mount.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 text-slate-800 rounded-lg mt-0.5 font-mono text-xs font-black">
                    02
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Escrow Split & Revenue Routing</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Natively divide payouts between multiple master administrators, faculty members, and infrastructure accounts manually within the dashboard following Super Admin verification. Fully transparent ledgers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 text-slate-800 rounded-lg mt-0.5 font-mono text-xs font-black">
                    03
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Dual-Persistence Database Resilient</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      All academic transcripts, grades, class matrices, and syllabus plans survive standard downtime via local JSON persistence files paired to Postgres pools smoothly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Badge */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10">
                <Award className="w-32 h-32 text-indigo-100 -mr-6 -mt-6" />
              </div>
              
              <span className="text-[9px] font-black tracking-widest text-indigo-300 uppercase block mb-1">GLOBAL OUTCOME REPORT</span>
              <h3 className="text-base font-black text-white">Ecosystem Launch Metrics</h3>
              
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800">
                <div>
                  <span className="block text-[10px] text-slate-400">Average Setup Time</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">14 Minutes</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">Total Grads Managed</span>
                  <span className="text-lg font-bold font-mono text-white">12,450+</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">Payout Integrity Rate</span>
                  <span className="text-lg font-bold font-mono text-white">100% Cryptographic</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">Active Academies</span>
                  <span className="text-lg font-bold font-mono text-white">48 Nodes</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
