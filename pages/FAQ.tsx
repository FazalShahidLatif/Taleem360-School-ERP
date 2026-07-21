import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  BookOpen, 
  GraduationCap, 
  ShieldCheck, 
  Coins, 
  Wrench, 
  LifeBuoy,
  MessageSquare,
  Sparkles,
  FileText
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const FAQ: React.FC = () => {
  useEffect(() => {
    document.title = 'Frequently Asked Questions (FAQ) | Taleem360 ERP Cloud';
    
    // Set meta tags for high-quality SEO presence
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Explore our comprehensive frequently asked questions. Learn how Taleem360 manages AI diagnostics, Web3 reward distributions, private tutor scheduling, and institutional daycare billing systems.');

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', 'https://www.taleem360.online/faq');
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All FAQs', icon: HelpCircle },
    { id: 'general', label: 'General & Setup', icon: GraduationCap },
    { id: 'nexus', label: 'Play-to-Earn Quiz', icon: Coins },
    { id: 'tutor-booking', label: 'Private Tutors', icon: BookOpen },
    { id: 'billing', label: 'Billing & Refund', icon: FileText },
    { id: 'security', label: 'Security & Role SLA', icon: ShieldCheck }
  ];

  const faqData: FAQItem[] = [
    // General & Setup
    {
      id: 'gen-1',
      category: 'general',
      question: 'What is Taleem360 and who is it designed for?',
      answer: 'Taleem360 is a fully enterprise-grade, integrated School ERP and Learning Management System designed for modern educational institutions, private academies, childcare centers, and online tutoring cooperatives. It brings administrative automation (admissions, attendance, payroll, lesson planning, timetable optimization), academic workflows, and sandbox environments under one unified roof.'
    },
    {
      id: 'gen-2',
      category: 'general',
      question: 'How do users transition between role-specific dashboards?',
      answer: 'Taleem360 enforces safe, rule-based authentication protocols. Permissions are partitioned into granular roles: Super Admin, School Admin, Teacher, Student, Parent, and Daycare Assistant. Upon login, our centralized dashboard middleware dynamically evaluates role hierarchies to configure custom menu panels, security rules, and workspace tools.'
    },
    {
      id: 'gen-3',
      category: 'general',
      question: 'Does the system integrate with existing third-party platforms?',
      answer: 'Yes. Taleem360 provides built-in RESTful gateway wrappers, webhook receivers, and API endpoints for WhatsApp (automated fee alerts), local bookkeeping platforms, and Ethereum-compatible EVM transaction chains for modular ledger validation operations.'
    },

    // Play-to-Earn Quiz (Nexus)
    {
      id: 'nx-1',
      category: 'nexus',
      question: 'What is the Nexus Play-to-Earn Quiz Hub?',
      answer: 'The Nexus Hub is our dedicated GameFi educational training lounge. Registered users or guests who authenticate themselves using Web3 EVM wallets can answer conceptual technical questions on CS, blockchain, smart contracts, and Web3 security. Correct answers reward the player with $NEXUS micro-incentives.'
    },
    {
      id: 'nx-2',
      category: 'nexus',
      question: 'Are there strict limits on daily play earnings?',
      answer: 'Yes. To protect the economy against algorithmic bot spam, each authenticated wallet address is capped at a maximum of 10 played quizzes per solar 24-hour cycle. When you exceed this daily count, the payout router will decline further allocation records.'
    },
    {
      id: 'nx-3',
      category: 'nexus',
      question: 'How do I submit my own custom questions?',
      answer: 'Any educator or ecosystem enthusiast can contribute to our decentralized knowledge warehouse! Navigate to the "Ingest Q&A" tab inside the Nexus dashboard, define your topic, formulation text, correct answer choice, and secondary distractors. Once saved, our schema generator compiles custom long-tail SEO URL endpoints automatically to raise organic search exposure.'
    },

    // Tutor Booking
    {
      id: 'tb-1',
      category: 'tutor-booking',
      question: 'How does the private tutor booking calendar execute bookings without conflicts?',
      answer: 'Our scheduler implements precise transaction locking mechanism boundaries. When a student requests a session, the system queries the target tutor’s state using in-memory caches and SQL constraint triggers. If another reservation transaction overlaps, a soft-lock rollback triggers immediately, preventing double-bookings.'
    },
    {
      id: 'tb-2',
      category: 'tutor-booking',
      question: 'Are parents and students notified when lesson slots are confirmed?',
      answer: 'Absolutely. On confirmation, our event emitter dispatches an offline simulated sandbox API ping to the registered WhatsApp numbers, logging complete metadata alerts containing schedule timestamps and tuition billing figures.'
    },

    // Billing & Refunds
    {
      id: 'bill-1',
      category: 'billing',
      question: 'How are recurring subscriptions and checkouts handled?',
      answer: 'All institutional plan registrations and custom packages are handled on a manual verification and administrative approval model directly via the Super Admin at accts.pak@gmail.com. We do not support direct online checkouts or credit card processing on this workspace.'
    },
    {
      id: 'bill-2',
      category: 'billing',
      question: 'What is the refund policy for active school plans?',
      answer: 'Taleem360 operates on a manual administrative approval model. Refund requests or custom licensing adjustments are processed manually. To submit a billing query, please email the Super Admin at accts.pak@gmail.com. The previous support@taleem360.online email has been suspended.'
    },
    {
      id: 'bill-3',
      category: 'billing',
      question: 'How do daycare billing schemas handle late checkout penalty events?',
      answer: 'Center parents are allocated custom checkout grace periods in the kiosk configuration. If a pickup timestamp occurs past authorization hours, our kiosk database logic automatically injects flat late-pickup penalty ledgers (e.g., 150 units) to the master child account immediately.'
    },

    // Security & Enterprise SLAs
    {
      id: 'sec-1',
      category: 'security',
      question: 'How does Taleem360 protect institutional databases?',
      answer: 'We configure rigorous security boundary conditions. API routes filter sensitive payload blocks, database parameters utilize parameterized queries to prohibit SQL injections, and sensitive data relies on industry-standard TLS encryption protocols.'
    },
    {
      id: 'sec-2',
      category: 'security',
      question: 'Where can I access operational platform status tracking?',
      answer: 'We maintain reliable system operational state metrics under the Taleem360 support matrix. For urgent inquiries or custom Service Level Agreement (SLA) tickets, our dedicated team is reachable 24/7 at support@taleem360.online.'
    }
  ];

  // Filtering criteria
  const filteredFAQs = faqData.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Build JSON-LD FAQ Schema Markup dynamically
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqData.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:px-8 bg-slate-50 min-h-screen">
      
      {/* Dynamic SEO JSON-LD Script Injected */}
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>

      {/* FAQ Landing Page Header */}
      <div className="bg-slate-900 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-2xl border-b-4 border-indigo-600">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-2xl -ml-20 -mb-20"></div>

        <div className="relative text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-3">
            <span className="bg-indigo-600 text-xs text-white font-bold tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Institutional Hub
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-sans tracking-tight mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Have questions about dashboard access, Web3 play rewards, billing integrations, or late-pickup penalties? Search our comprehensive knowledge catalog or reach out to our support engineers.
          </p>

          {/* Search Bar Input */}
          <div className="mt-8 relative max-w-lg mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveCategory('all'); // Expand search across categories
              }}
              className="bg-white text-slate-800 placeholder-slate-400 block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Category Selection Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setExpandedId(null);
              }}
              className={`flex items-center gap-2 py-2 px-4 rounded-full text-xs font-bold transition-all border ${
                activeCategory === cat.id
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Accordions List Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 max-w-4xl mx-auto mb-10">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-16">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-600">No matching FAQs discovered</p>
            <p className="text-xs text-slate-400 mt-1">Try refining search parameters or browsing specific category lists.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredFAQs.map((item, index) => {
              const isExpanded = expandedId === item.id;
              return (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex justify-between items-center text-left py-2 font-bold text-slate-800 hover:text-indigo-600 transition-colors text-sm md:text-base gap-4 focus:outline-none"
                  >
                    <span>{item.question}</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-400 group-hover:text-indigo-500 shrink-0"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 pb-3 text-slate-600 text-xs md:text-sm leading-relaxed border-t border-slate-50 mt-2">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Customer CTA Center */}
      <div className="bg-slate-100/50 rounded-2xl p-6 md:p-8 mt-12 max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-200/80">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-white rounded-xl text-indigo-600 border border-slate-200">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm md:text-base">Still have questions?</h3>
            <p className="text-xs text-slate-500 mt-1">Our support specialists can assist you with your personalized enterprise setups.</p>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <a
            href="mailto:support@taleem360.online"
            className="flex-1 text-center bg-slate-900 text-white font-bold py-2.5 px-5 rounded-xl text-xs hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4" /> Email support
          </a>
        </div>
      </div>

    </div>
  );
};
