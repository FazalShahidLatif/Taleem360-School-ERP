import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Coins, 
  Award, 
  ShieldCheck, 
  Globe, 
  MapPin, 
  Send, 
  HelpCircle, 
  Info,
  Search,
  Check,
  Sparkles,
  HelpCircleIcon
} from 'lucide-react';

export interface CompetitionSubmission {
  id: string;
  studentName: string;
  grade: string;
  schoolName: string;
  city: string;
  country: string;
  category: 'writing' | 'art' | 'code' | 'idea';
  title: string;
  payloadSnippet: string;
  feePaid: number;
  txnHash: string;
  status: 'Evaluated' | 'Approved' | 'Winner';
  prizeDetails?: string;
  timestamp: string;
}

export const CompetitionHub: React.FC = () => {
  // Calculator States
  const [entrantCount, setEntrantCount] = useState<number>(2450);
  const [feeChoice, setFeeChoice] = useState<number>(2); // $2 default

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'writing' | 'art' | 'code' | 'idea'>('all');

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('Grade 5');
  const [school, setSchool] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [formCategory, setFormCategory] = useState<'writing' | 'art' | 'code' | 'idea'>('art');
  const [title, setTitle] = useState('');
  const [payload, setPayload] = useState('');
  const [formFee, setFormFee] = useState<number>(2);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [txnResult, setTxnResult] = useState('');

  // Initial High-Fidelity Dataset
  const [submissions, setSubmissions] = useState<CompetitionSubmission[]>([
    {
      id: 'sub-comp-01',
      studentName: 'Zainab Fatima',
      grade: 'Grade 5',
      schoolName: 'The City School Capital Campus',
      city: 'Islamabad',
      country: 'Pakistan',
      category: 'art',
      title: 'Water Colors of Margalla Hills sunrise',
      payloadSnippet: 'An active watercolor painting tracing solar rise gradients over Islamabad mountains utilizing geometric space perspectives with lovely violet tones.',
      feePaid: 2,
      txnHash: '0x3dfa7f8c12a02b11e9a',
      status: 'Winner',
      prizeDetails: 'Rank 1 ($271.50 Prize Pot distributed!)',
      timestamp: '2026-06-20T09:12:00Z'
    },
    {
      id: 'sub-comp-02',
      studentName: 'Ayaan Ahmed',
      grade: 'Grade 10 / O Levels',
      schoolName: 'Roots Millennium School',
      city: 'Peshawar',
      country: 'Pakistan',
      category: 'code',
      title: 'Taleem Solar Tracker Python Simulator',
      payloadSnippet: 'A light-weight python algorithm simulating solar panel orbit alignment ratios using visual pandas & numpy coordinates for grade optimization.',
      feePaid: 2,
      txnHash: '0x6e31c89f2a00bde48c2',
      status: 'Winner',
      prizeDetails: 'Rank 2 ($181.00 Prize Pot distributed!)',
      timestamp: '2026-06-19T14:45:00Z'
    },
    {
      id: 'sub-comp-03',
      studentName: 'Sarah Jenkins',
      grade: 'Grade 8',
      schoolName: 'Central High School',
      city: 'London',
      country: 'United Kingdom',
      category: 'writing',
      title: 'The Future of Green Energy in Classrooms',
      payloadSnippet: 'A 600-word descriptive essay mapping the carbon footprint optimizations achievable via standard kinetic desk rotations and energy metrics analysis.',
      feePaid: 1,
      txnHash: '0x99a2cddf889ef191b0f',
      status: 'Winner',
      prizeDetails: 'Rank 3 ($90.50 Prize Pot distributed!)',
      timestamp: '2026-06-18T11:30:00Z'
    },
    {
      id: 'sub-comp-04',
      studentName: 'Haris Khan',
      grade: 'Grade 4',
      schoolName: 'Beaconhouse School System',
      city: 'Lahore',
      country: 'Pakistan',
      category: 'art',
      title: 'Futuristic Eco-Friendly School Bus Design',
      payloadSnippet: 'A digital sketch showcasing wind turbines on student double-decker electric transit, finished with bright yellow and solar paneled accents.',
      feePaid: 2,
      txnHash: '0xfa11cc3aa882df23924',
      status: 'Approved',
      timestamp: '2026-06-21T08:15:00Z'
    },
    {
      id: 'sub-comp-05',
      studentName: 'Clara Oswald',
      grade: 'Grade 9',
      schoolName: 'Maplewood Prep',
      city: 'Toronto',
      country: 'Canada',
      category: 'writing',
      title: 'Why coding will save our oceans',
      payloadSnippet: 'A reflective essay studying drone mapping optimization metrics that track plastic trash currents globally using simple standard algorithms.',
      feePaid: 1,
      txnHash: '0xbb82c12fedbb9010492',
      status: 'Approved',
      timestamp: '2026-06-21T02:40:00Z'
    },
    {
      id: 'sub-comp-06',
      studentName: 'Muhammad Rehan',
      grade: 'Grade 7',
      schoolName: 'Fazaia Intermediate College',
      city: 'Karachi',
      country: 'Pakistan',
      category: 'idea',
      title: 'Self-Purifying Desk Filter System',
      payloadSnippet: 'A conceptual design for magnetic static filters attached under study desks to dynamically filter chalk and dust particles.',
      feePaid: 2,
      txnHash: '0xdff3a48eef92ccab819',
      status: 'Evaluated',
      timestamp: '2026-06-21T10:05:00Z'
    }
  ]);

  // Giveaway Math Core Logic (Exactly matching user rules)
  const totalCollected = entrantCount * feeChoice;
  const prizePot = totalCollected * 0.50; // Max 50% split as giveaway
  const rank1Prize = prizePot * 0.15; // 15% of Margin Pot
  const rank2Prize = prizePot * 0.10; // 10% of Margin Pot
  const rank3Prize = prizePot * 0.05; // 5% of Margin Pot
  const splitPotRemaining = prizePot * 0.70; // 70% shared equally among 97
  const singleRestPrize = splitPotRemaining / 97;
  
  const socialAllocation = totalCollected * 0.15; // 15% margin to village kits
  const infraAllocation = totalCollected * 0.35; // 35% standard system fee + gateways

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;

    setIsSubmitting(true);
    
    // Simulate payment merchant verification (Paddle / PCI compliance mock flow)
    setTimeout(() => {
      const generatedTxn = '0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('');
      const generatedId = 'sub-comp-' + Math.random().toString(36).substring(2, 9);
      
      const newRecord: CompetitionSubmission = {
        id: generatedId,
        studentName: name,
        grade,
        schoolName: school,
        city,
        country,
        category: formCategory,
        title,
        payloadSnippet: payload,
        feePaid: formFee,
        txnHash: generatedTxn,
        status: 'Approved',
        timestamp: new Date().toISOString()
      };

      setSubmissions(prev => [newRecord, ...prev]);
      setTxnResult(generatedTxn);
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1800);
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setSchool('');
    setCity('');
    setTitle('');
    setPayload('');
    setSubmitSuccess(false);
    setTermsAccepted(false);
  };

  const filteredEntries = submissions.filter(item => {
    const matchesSearch = item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-12 no-print">
      
      {/* Contest Overview Brief Heading Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-amber-400 text-amber-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              Active Global Series
            </span>
            <span className="text-slate-400 text-xs font-medium font-mono">
              Series Period: June 15 – Oct 15, 2026
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Taleem360 Global Talent Spot & Innovation Competitions
          </h2>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Giving classroom pupils up to <strong>10th Grade / O-Levels</strong> a transparent, globally indexed stage to submit drawings, essays, and coding matrices. With an democratic entry layout, 50% of nominal submissions directly fund the Student Prize Pool, while 15% is spent gifting hardware and textbook resources to remote rural classrooms.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/50">
              <span className="text-amber-400 font-extrabold uppercase tracking-wide block mb-1">Nominal Entry</span>
              <span className="text-slate-300">Choose between a $1.00 USD or $2.00 USD fee on Checkout.</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/50">
              <span className="text-indigo-400 font-extrabold uppercase tracking-wide block mb-1">Guaranteed Payout</span>
              <span className="text-slate-300">Exactly 100 students selected per series get financial distributions.</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/50">
              <span className="text-emerald-400 font-extrabold uppercase tracking-wide block mb-1">Peer Governance</span>
              <span className="text-slate-300">Public double-blind score charts & receipts matching live blockchain hashes.</span>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 font-black text-9xl transform translate-x-20 translate-y-20 select-none text-slate-100">🏆</div>
      </div>

      {/* Dynamic 50% Pot Pool Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Coins className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-black text-slate-800">Giveaway Pot Pool Calculator</h3>
            </div>
            
            <p className="text-slate-500 text-xs leading-relaxed mb-6">
              Simulate total registration cycles to verify precisely how the 100-student giveaway cash margin operates. True compliance requires objective public transparency rules.
            </p>

            {/* Simulated Sliders */}
            <div className="space-y-5">
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Simulated Total Entrants</span>
                  <span className="text-indigo-600 font-mono font-black">{entrantCount.toLocaleString()} Students</span>
                </label>
                <input 
                  type="range" 
                  min="200" 
                  max="10000" 
                  step="50"
                  value={entrantCount} 
                  onChange={(e) => setEntrantCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Average Entry Fee Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2].map((val) => (
                    <button
                      key={val}
                      onClick={() => setFeeChoice(val)}
                      className={`py-2 text-xs font-extrabold rounded-xl border transition-all ${
                        feeChoice === val
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ${val}.00 Entry Fee
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 bg-slate-50 p-4 rounded-2xl">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs font-bold text-slate-600">Collected Pool Sum:</span>
              <span className="text-slate-950 font-mono font-bold">${totalCollected.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between items-baseline text-indigo-700 font-black">
              <span className="text-xs uppercase tracking-wider">50% Giveaway Pot Pool:</span>
              <span className="text-lg font-mono">${prizePot.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Margin Distribution Breakdowns */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">100-Selected Student Distribution Matrix</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xs shadow-xs">1</span>
                <div>
                  <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Rank #1 (Champion)</span>
                  <span className="text-base font-mono font-black text-slate-900">${rank1Prize.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/40 border border-amber-100/50 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-xs">2</span>
                <div>
                  <span className="text-[10px] text-slate-700 font-bold uppercase tracking-wider block">Rank #2 (Runner-Up)</span>
                  <span className="text-base font-mono font-black text-slate-900">${rank2Prize.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-orange-50/40 border border-orange-100/50 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-xs shadow-xs">3</span>
                <div>
                  <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Rank #3 (Bronze Medal)</span>
                  <span className="text-base font-mono font-black text-slate-900">${rank3Prize.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">97</span>
                <div>
                  <span className="text-[10px] text-indigo-800 font-bold uppercase tracking-wider block">Remaining 97 Selected Patients</span>
                  <span className="text-sm font-mono font-bold text-indigo-950">${singleRestPrize.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span className="text-[10px] text-slate-400 font-normal">each</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 mt-6 text-[11px] leading-relaxed text-slate-500">
            <div>
              <span className="font-extrabold text-emerald-700 block mb-0.5">🌱 15% Social Impact Fund: <span className="font-mono text-slate-900">${socialAllocation.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}</span></span>
              <span>Spent purchasing sequence study materials and physical pencil boards packaged and routed to remote schools.</span>
            </div>
            <div>
              <span className="font-extrabold text-slate-800 block mb-0.5">⚡ 35% Infra & Platform Fees: <span className="font-mono text-slate-900">${infraAllocation.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}</span></span>
              <span>Covers dynamic Cloud Run container scale-ups, double-blind LLM screening, and general server maintenance metrics.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form and Verified entries Gallery */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Interactive Masterpiece Submission Form - Spans 5 cols */}
        <div id="comp-sub-form-card" className="xl:col-span-5 bg-gradient-to-b from-indigo-950 to-slate-950 text-white p-6 rounded-3xl border border-indigo-900 shadow-xl">
          {!submitSuccess ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-2 pb-3 border-b border-indigo-900/60">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base text-slate-100">Submit Your Project Entry</h3>
              </div>
              
              <p className="text-indigo-200 text-xs leading-relaxed mb-4">
                Fill in precise academic parameters. Submissions qualify for evaluation under standard age groupings upto 10th grade.
              </p>

              <div>
                <label className="text-[10px] font-bold font-mono uppercase tracking-wider text-indigo-300 block mb-1">Pupil Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Bilal Qureshi" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-indigo-900 focus:outline-none focus:border-indigo-500 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold font-mono uppercase tracking-wider text-indigo-300 block mb-1">Student/Parent Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g., parent@mail.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-indigo-900 focus:outline-none focus:border-indigo-500 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold font-mono uppercase tracking-wider text-indigo-300 block mb-1">Grade Level</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-indigo-900 focus:outline-none focus:border-indigo-500 text-slate-100 cursor-pointer"
                  >
                    <option value="Pre-K">Pre-Kindergarten</option>
                    <option value="Kindergarten">Kindergarten</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10 / O Levels">Grade 10 / O Levels</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold font-mono uppercase tracking-wider text-indigo-300 block mb-1">School Affiliation Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Beaconhouse G11 Branch" 
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-indigo-900 focus:outline-none focus:border-indigo-500 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold font-mono uppercase tracking-wider text-indigo-300 block mb-1">City</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Rawalpindi" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-indigo-900 focus:outline-none focus:border-indigo-500 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold font-mono uppercase tracking-wider text-indigo-300 block mb-1">Country</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Pakistan" 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-indigo-900 focus:outline-none focus:border-indigo-500 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="text-[10px] font-bold font-mono uppercase tracking-wider text-indigo-300 block mb-1">Submission Category</label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { id: 'art', label: 'Illustration' },
                      { id: 'writing', label: 'Article, Essay' },
                      { id: 'code', label: 'STEM Code' },
                      { id: 'idea', label: 'Idea Pitch' }
                    ].map((catObj) => (
                      <button
                        key={catObj.id}
                        type="button"
                        onClick={() => setFormCategory(catObj.id as any)}
                        className={`py-1.5 px-1 rounded-lg text-[9px] font-extrabold border leading-none ${
                          formCategory === catObj.id
                            ? 'bg-amber-500 text-indigo-950 border-amber-500 shadow'
                            : 'bg-slate-900 text-slate-300 border-indigo-900 hover:bg-slate-800'
                        }`}
                      >
                        {catObj.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold font-mono uppercase tracking-wider text-indigo-300 block mb-1">Project Entry Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., My Hydroelectric Class Toy model" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-indigo-900 focus:outline-none focus:border-indigo-500 text-slate-100"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold font-mono uppercase tracking-wider text-indigo-300 block mb-1">Submission Description / Text Content</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Describe your design, write your essay text, or paste your simplified software coordinates here..." 
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-indigo-900 focus:outline-none focus:border-indigo-500 text-slate-100 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold font-mono uppercase tracking-wider text-indigo-300 block mb-1">Choose Registration Checkout Fee</label>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2].map((feeNum) => (
                    <button
                      key={feeNum}
                      type="button"
                      onClick={() => setFormFee(feeNum)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                        formFee === feeNum
                          ? 'bg-white text-indigo-950 border-white shadow-md font-black'
                          : 'bg-indigo-950 text-indigo-200 border-indigo-900 hover:bg-indigo-900'
                      }`}
                    >
                      <span>${feeNum}.00</span>
                      <span className="text-[9px] opacity-70">Contribution</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="terms-check"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded cursor-pointer accent-indigo-600 focus:ring-0"
                />
                <label htmlFor="terms-check" className="text-[10px] text-slate-300 select-none cursor-pointer leading-tight">
                  I agree that this project belongs to the student, satisfies academic integrity, and complies with fully transparent checkout rules.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !termsAccepted}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-indigo-950 font-black text-xs rounded-xl transition duration-150 shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-indigo-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Simulating Checkout Router...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit & Proceed to Checkout (${formFee}.00)</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-5"
            >
              <div className="w-16 h-16 bg-amber-500 text-indigo-950 rounded-full flex items-center justify-center text-4xl shadow-md mx-auto">🎉</div>
              <h3 className="font-bold text-lg text-amber-400">Entry Registered Successfully!</h3>
              <p className="text-slate-300 text-xs px-2leading-relaxed">
                Thank you! Your submission has been securely committed to our database ledgers. AI screening check was finished under standard rating matrices.
              </p>
              
              <div className="bg-slate-900 border border-indigo-900 rounded-2xl p-4 text-left space-y-2 font-mono text-[10px] text-indigo-300">
                <div className="flex justify-between">
                  <span>Entry Hash Identifier:</span>
                  <span className="text-slate-100 font-bold">{txnResult.substring(0, 14)}...</span>
                </div>
                <div className="flex justify-between">
                  <span>Registered Name:</span>
                  <span className="text-slate-100 font-bold">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status State:</span>
                  <span className="text-emerald-400 font-extrabold uppercase">Verified & Approved</span>
                </div>
              </div>

              <button 
                onClick={handleResetForm}
                className="text-xs bg-slate-900 border border-indigo-900 py-2 px-4 rounded-xl text-indigo-200 hover:text-white hover:bg-indigo-900 cursor-pointer"
              >
                Register Another Entry
              </button>
            </motion.div>
          )}
        </div>

        {/* Live Submissions Gallery Section - Spans 7 cols */}
        <div className="xl:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="sm:flex sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg font-black text-slate-800">Verified participant Gallery</h3>
              <p className="text-xs text-slate-400 mt-1">Real-time entries stream matching verified educational branches.</p>
            </div>
            
            {/* Category selection filters */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'art', label: 'Illustration' },
                { id: 'writing', label: 'Article/Essay' },
                { id: 'code', label: 'STEM Code' },
                { id: 'idea', label: 'Ideas' }
              ].map((filterTab) => (
                <button
                  key={filterTab.id}
                  onClick={() => setCategoryFilter(filterTab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition ${
                    categoryFilter === filterTab.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs font-extrabold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {filterTab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar inside ledger */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Filter by pupil, school, country, or project keywords..." 
              value={compSearch}
              onChange={(e) => setCompSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-slate-900 border border-slate-200 focus:outline-none focus:border-indigo-600 text-xs"
            />
          </div>

          {/* Verified Participants Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEntries.length === 0 ? (
              <div className="col-span-2 py-10 text-center text-slate-400 text-xs">
                No verified academic projects matched your active search filters.
              </div>
            ) : (
              filteredEntries.map((item) => (
                <div key={item.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-xs transition">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[8px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-full ${
                        item.category === 'art' ? 'bg-rose-100 text-rose-800' :
                        item.category === 'writing' ? 'bg-amber-100 text-amber-800' :
                        item.category === 'code' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.category === 'art' ? '🎨 Art' :
                         item.category === 'writing' ? '✍️ Writing' :
                         item.category === 'code' ? '💻 STEM Code' : '💡 Idea'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {item.id}</span>
                    </div>

                    <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-1 line-clamp-3">{item.payloadSnippet}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 text-[9px] text-slate-500 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-800">{item.studentName} ({item.grade})</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-slate-300" />
                        {item.city}, {item.country}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[8px] font-semibold text-slate-400">
                      <span>{item.schoolName}</span>
                      <span>Paid: ${item.feePaid}.00</span>
                    </div>

                    <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded-lg border border-slate-200/50 mt-1 font-mono text-[9px]">
                      <span className="text-[8px] text-slate-400 select-all">Receipt: {item.txnHash.substring(0, 10)}...</span>
                      {item.status === 'Winner' ? (
                        <span className="text-amber-600 font-extrabold flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded uppercase text-[7px]" title={item.prizeDetails}>
                          🏆 Winner
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded uppercase text-[7px]">
                          ✓ Evaluated
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center pt-2">
            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              Showing active entries from {new Set(submissions.map(s => s.country)).size} countries and {new Set(submissions.map(s => s.city)).size} school networks.
            </p>
          </div>

        </div>
      </div>

      {/* Governance & Anti-Plagiarism Quality Criteria */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/60">
        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          Transparency Governance & Evaluation Rubric
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <span>●</span> Double-Blind Evaluation Phase
            </h4>
            <p>
              To eliminate teacher or network brand bias, all student portfolios are scrubbed of name and school markers when transmitted to our **Automatic AI Evaluation Engine** (powered by Gemini rating schema keys). High-scores are then processed by a human verification jury containing O-Level curriculum checkers based in London and Islamabad to secure final rankings.
            </p>
            <p className="bg-white p-3 rounded-xl border border-slate-100 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>We match historical IPs and wallet signatures to guarantee anti-abuse. Strictly limited to only organic students. No robot accounts or automated software scripting is permitted.</span>
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <span>●</span> Prize Pot Giveaway Verification Rules
            </h4>
            <p>
              Prize pots are distributed transparently directly to candidate parent/teacher bank ledgers or verified international digital options on verification of ID and School Registration Cards.
            </p>
            <p>
              Every distribution receipt generates a permanent public record identifier on our digital dashboard ledger, backed by cryptographic checkout keys. A full audited balance sheet is downloadable within 7 days of active rounds completion.
            </p>
            <div className="pt-2 border-t border-slate-200">
              <span className="font-semibold block text-indigo-600 mb-0.5">Participating age cohorts:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                <li>Cohort A: Ages 3 – 5 (Elementary Illustrations and coloring shapes)</li>
                <li>Cohort B: Ages 6 – 9 (Writing & primary design models)</li>
                <li>Cohort C: Ages 10 – 16 (High School essays, prototype ideas, Python/JS scripts)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
