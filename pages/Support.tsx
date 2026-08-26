import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  HelpCircle, 
  Book, 
  Phone, 
  Mail, 
  Video, 
  FileText,
  ChevronRight,
  LifeBuoy,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useSEO } from '../lib/seo';

export const Support: React.FC = () => {
  useSEO({
    title: 'Institutional Cloud Support Center | Taleem360 School Cloud ERP',
    description: "Institutional cloud support center for Taleem360 school ERP. Access 24/7 priority SLA ticket dispatch, technical knowledge base, user setup guides, and administrative onboarding assistance.",
    keywords: 'institutional cloud support center, taleem360 school cloud erp support, school erp help desk, school database technical assistance, automated timetable troubleshooting',
    canonicalUrl: 'https://www.taleem360.online/support',
    schemaMarkup: {
      '@type': 'ContactPage',
      name: 'Institutional Cloud Support Center | Taleem360 School Cloud ERP',
      description: 'Dedicated institutional help desk and SLA response portal for Taleem360 school management software administrators.',
      url: 'https://www.taleem360.online/support',
      mainEntity: {
        '@type': 'EducationalOrganization',
        name: 'Taleem 360',
        url: 'https://www.taleem360.online/',
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+92-332-213-7898',
            contactType: 'technical support',
            email: 'support@taleem360.online',
            availableLanguage: ['English', 'Urdu'],
            hoursAvailable: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              opens: '09:00',
              closes: '18:00'
            }
          }
        ]
      }
    }
  });

  const supportCategories = [
    {
      title: 'Support Tickets & Helpdesk',
      description: 'Submit priority inquiries, bug reports, or database restoration requests.',
      icon: MessageSquare,
      link: '/tickets',
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      title: 'Knowledge Vault & Docs',
      description: 'Step-by-step documentation on fee challans, timetable optimization, and SIS configuration.',
      icon: Book,
      link: '/blog',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Institutional Onboarding',
      description: 'Fast-track cloud instance provisioning and campus subdomain mapping.',
      icon: Video,
      link: '/onboarding',
      color: 'bg-rose-50 text-rose-600'
    },
    {
      title: 'Subscription & Invoicing',
      description: 'Review SLA tier allowances, seat additions, and multi-campus agreements.',
      icon: HelpCircle,
      link: '/pricing',
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-12">
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100/60 mb-2">
          <LifeBuoy className="w-8 h-8" />
        </div>
        <div className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-xs font-bold uppercase tracking-wider block mx-auto w-fit">
          24/7 SLA Institutional Assistance
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Institutional Cloud Support Center</h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Our dedicated educational solutions engineering team is on standby to support school principals, IT coordinators, and bursars with zero-latency resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supportCategories.map((category, i) => (
          <Link 
            key={i} 
            to={category.link}
            className="group bg-white p-6 rounded-3xl shadow-xs border border-slate-200/80 hover:border-indigo-500 hover:shadow-md transition-all flex items-start space-x-4"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${category.color}`}>
              <category.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base">{category.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{category.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors self-center" />
          </Link>
        ))}
      </div>

      {/* SLA Matrix Table (GEO Citation & Commercial Trust Factor) */}
      <div className="bg-slate-950 text-white rounded-3xl p-8 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Service Level Agreements</span>
            <h3 className="text-xl font-bold text-white mt-1">Guaranteed Response Commitments</h3>
          </div>
          <Link 
            to="/tickets" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors w-fit"
          >
            Open Ticket <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left text-xs">
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
              <Clock className="w-4 h-4" />
              Critical (Campus Down)
            </div>
            <p className="text-slate-300 font-semibold text-sm">&lt; 1 Hour Response</p>
            <p className="text-slate-400 mt-1">Immediate direct engineering intervention for fee collections or gate attendance lockouts.</p>
          </div>
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-300 font-bold mb-1">
              <Clock className="w-4 h-4" />
              Standard Inquiries
            </div>
            <p className="text-slate-300 font-semibold text-sm">&lt; 6 Hours Response</p>
            <p className="text-slate-400 mt-1">Grade sheet adjustments, timetable re-runs, and student roster imports.</p>
          </div>
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              Dedicated Account Manager
            </div>
            <p className="text-slate-300 font-semibold text-sm">Tier 3 Enterprise</p>
            <p className="text-slate-400 mt-1">Direct private telephone and WhatsApp VIP channel for multi-branch administrators.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 p-8">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Direct Institutional Contact Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex items-center text-indigo-600 font-bold mb-2 text-sm">
              <Mail className="w-5 h-5 mr-2" />
              Email Helpdesk
            </div>
            <p className="text-xs text-slate-500">Official written correspondence &amp; ticket logging</p>
            <a href="mailto:support@taleem360.online" className="text-xs font-semibold text-slate-900 hover:text-indigo-600 block">
              support@taleem360.online
            </a>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-emerald-600 font-bold mb-2 text-sm">
              <Phone className="w-5 h-5 mr-2" />
              Institutional Hotline
            </div>
            <p className="text-xs text-slate-500">Mon-Sat, 9:00 AM – 6:00 PM PKT</p>
            <a href="tel:+923322137898" className="text-xs font-semibold text-slate-900 hover:text-indigo-600 block">
              +92 (332) 213 7898
            </a>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-rose-600 font-bold mb-2 text-sm">
              <FileText className="w-5 h-5 mr-2" />
              Research Knowledge Base
            </div>
            <p className="text-xs text-slate-500">Deep architectural articles and guides</p>
            <Link to="/blog" className="text-xs font-semibold text-slate-900 hover:text-indigo-600 block">
              Explore Articles →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
