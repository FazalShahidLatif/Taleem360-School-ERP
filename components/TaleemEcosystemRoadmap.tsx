import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { School, Baby, GraduationCap, Users, Sparkles, ArrowRight } from 'lucide-react';

export const TaleemEcosystemRoadmap = () => {
  const [email, setEmail] = useState('');
  const [selectedModule, setSelectedModule] = useState('Solo Pro Tutors');
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Lead Captured: ${email} for Module: ${selectedModule}`);
    setSubmitted(true);
  };

  const modules = [
    {
      title: "School & College ERP",
      status: "Live in Production",
      desc: "Complete academic management, grading matrix workflows, transport, and cashless fee structures.",
      icon: <School className="w-6 h-6 text-blue-600" />,
      badgeColor: "bg-blue-100 text-blue-800 font-bold",
      route: "/login",
      actionText: "Launch ERP Portal"
    },
    {
      title: "Solo Pro & Private Tutors",
      status: "Active & Deployed",
      desc: "Personal tutor mini-websites, instant availability matrices, automatic Paddle checkouts, and student logs tracking.",
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      badgeColor: "bg-emerald-100 text-emerald-800 font-bold ring-2 ring-emerald-500/10",
      route: "/private-tutors",
      actionText: "Launch Tutor Space Sandbox"
    },
    {
      title: "Skills Academies & Bootcamps",
      status: "Active & Deployed",
      desc: "White-label multi-tenant LMS for IT, technical, and vocational institutes with Paddle split-installment plans.",
      icon: <GraduationCap className="w-6 h-6 text-purple-600" />,
      badgeColor: "bg-purple-100 text-purple-800 font-bold ring-2 ring-purple-500/10",
      route: "/skills-academy",
      actionText: "Launch Academy Sandbox"
    },
    {
      title: "Daycare Center Hub",
      status: "Active & Deployed",
      desc: "Real-time child care tracking, secure kiosk PIN terminals, UTC late-fee engines, and automatic billing ledger sync.",
      icon: <Baby className="w-6 h-6 text-amber-600" />,
      badgeColor: "bg-amber-100 text-amber-800 font-semibold ring-2 ring-amber-500/10",
      route: "/daycare",
      actionText: "Open Daycare Hub Sandbox"
    },
    {
      title: "Global Student Competition Hub",
      status: "Live Now • Pre-K to 10th",
      desc: "Local, regional, and global competitions after nominal $1/$2 entry fee supporting transparent 100-student giveaway cash prizes.",
      icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
      badgeColor: "bg-indigo-100 text-indigo-800 font-bold ring-2 ring-indigo-500/25",
      route: "/free-resources",
      actionText: "Open Student Competition Hub"
    }
  ];

  return (
    <section className="py-16 bg-gray-50 border-t border-b border-gray-200" id="taleem-ecosystem-roadmap">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
            Global Expansion Roadmap
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-3">
            The Unified Future of Education Tech
          </h2>
          <p className="text-gray-500 mt-4 text-base sm:text-lg">
            Whether you manage a premium school network, a high-volume daycare center, an independent IT institute, or operate as a private tutor, Taleem360 is scaling to unify your operations globally.
          </p>
        </div>

        {/* 2x2 Feature Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {modules.map((mod, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between transition hover:shadow-md hover:border-slate-200">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-slate-50 rounded-xl">{mod.icon}</div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${mod.badgeColor}`}>
                    {mod.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{mod.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{mod.desc}</p>
              </div>
              
              {mod.route ? (
                <Link 
                  to={mod.route}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 hover:text-indigo-800 bg-indigo-50/50 hover:bg-indigo-100/80 px-4 py-2.5 rounded-xl transition w-fit"
                >
                  <span>{mod.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : !mod.status.includes("Live") && !mod.status.includes("Active") ? (
                <button 
                  onClick={() => { setSelectedModule(mod.title); setSubmitted(false); }}
                  className="mt-6 text-sm font-semibold text-indigo-600 inline-flex items-center gap-1 hover:text-indigo-700 w-fit cursor-pointer"
                >
                  Pre-register for early access <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          ))}
        </div>

        {/* Dynamic Marketing Waitlist Capture Card */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-2xl p-8 text-white text-center md:text-left md:flex md:items-center md:justify-between shadow-xl">
          <div className="max-w-xl mb-6 md:mb-0">
            <h3 className="text-xl font-bold inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Secure Your Priority Beta Seat
            </h3>
            <p className="text-indigo-200 text-sm mt-2">
              Our micro-services are built in absolute isolation and launching across 2026–2027. Join our global pre-registration wave to lock in early adopter subscription tiers.
            </p>
          </div>

          <div className="md:w-96">
            {!submitted ? (
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  required
                  placeholder="Enter email or WhatsApp number"
                  className="px-4 py-2 rounded-lg text-gray-900 text-sm focus:outline-none w-full border-none bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="bg-amber-500 text-indigo-950 font-semibold px-4 py-2 rounded-lg text-sm transition hover:bg-amber-400 whitespace-nowrap cursor-pointer">
                  Join Waitlist
                </button>
              </form>
            ) : (
              <div className="p-3 bg-indigo-950 rounded-lg text-amber-400 text-sm font-medium border border-amber-500/20">
                🎉 Spot secured! We will alert you the moment the {selectedModule} module sandbox opens.
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
