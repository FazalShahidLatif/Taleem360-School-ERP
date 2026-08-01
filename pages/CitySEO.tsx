import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  CheckCircle, 
  ShieldCheck, 
  Users, 
  CreditCard, 
  BookOpen, 
  Smartphone,
  Sparkles,
  PhoneCall,
  Star,
  Award,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';
import { Footer } from '../components/Footer';
import { useSEO } from '../lib/seo';

interface CityData {
  name: string;
  urduName: string;
  title: string;
  metaDesc: string;
  headKeyword: string;
  additionalKeywords: string[];
  intro: string;
  keyChallenge: string;
  localSchools: string[];
  schemaLocalAddress: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
  };
}

const CITY_DETAILS: Record<string, CityData> = {
  nigeria: {
    name: 'Nigeria',
    urduName: 'نائجیریا',
    title: 'School Management Software Nigeria | Complete ERP Suite - Taleem360',
    metaDesc: 'Discover the absolute best school management software in Nigeria. Streamline primary, secondary and high school workloads with online fee collection, SMS alerts, and double-entry accounting.',
    headKeyword: 'school management software nigeria',
    additionalKeywords: [
      'school erp nigeria',
      'school database management system nigeria',
      'free lms for schools nigeria'
    ],
    intro: 'Nigeria represents one of the fastest-growing and most dynamic education systems in Africa. From Lagos and Abuja to Kano and Ibadan, school owners require scalable, offline-resilient cloud databases and automated school fee collection software to manage high volumes of students.',
    keyChallenge: 'Preventing student tuition debt, managing cashflow receipts across multiple bank branches, and dealing with varying network connectivity in regional cities.',
    localSchools: ['Lagos STEM Academy', 'Abuja International School', 'Kano Model High School', 'Kwara Community Academy'],
    schemaLocalAddress: {
      street: 'Herbert Macaulay Way, Yaba',
      locality: 'Lagos',
      region: 'Lagos State',
      postalCode: '100001'
    }
  },
  bangladesh: {
    name: 'Bangladesh',
    urduName: 'بنگلہ دیش',
    title: 'School ERP Bangladesh | Complete School Management System - Taleem360',
    metaDesc: 'Looking for the best school ERP in Bangladesh? Scale your campus operations with automated student attendance, school fee challans, and localized SMS alerts.',
    headKeyword: 'school erp bangladesh',
    additionalKeywords: [
      'school management software bangladesh',
      'free school lms bangladesh',
      'best student information system bangladesh'
    ],
    intro: "Bangladesh's private and trust-run schools are rapidly expanding, seeking high-performance school database management tools. From Dhaka to Chattogram and Sylhet, managing admissions and daily collections requires a localized, reliable school erp.",
    keyChallenge: 'Manual billing ledger errors, complex parent notification delivery, and tracking daily biometric student attendance across multiple campus branches.',
    localSchools: ['Dhaka Grammar School', 'Chattogram STEM College', 'Sylhet Trust School', 'Allied Dhaka Campuses'],
    schemaLocalAddress: {
      street: 'Gulshan Avenue, Road 12',
      locality: 'Dhaka',
      region: 'Dhaka Division',
      postalCode: '1212'
    }
  },
  uae: {
    name: 'UAE',
    urduName: 'متحدہ عرب امارات',
    title: 'School Management Software UAE | Premium Education Cloud Platform - Taleem360',
    metaDesc: 'Discover the premier school management software in UAE. Taleem360 offers smart biometric integration, parent mobile portals, cashless invoicing, and multi-school ERP.',
    headKeyword: 'school management software uae',
    additionalKeywords: [
      'school erp uae',
      'best student tracking database uae',
      'cloud based lms dubai uae'
    ],
    intro: 'The United Arab Emirates hosts some of the most technologically advanced and highly demanding international schools and multi-curriculum academies. From Dubai and Abu Dhabi to Sharjah, school administration mandates seamless parent communication, high-availability data infrastructure, and strict compliance with local financial ledgers.',
    keyChallenge: 'Syncing real-time multi-branch student metrics, managing multi-currency fee schedules, and delivering instant parent-teacher coordination alerts.',
    localSchools: ['Dubai International Academy', 'Abu Dhabi British School', 'Sharjah Elite Campus', 'Allied Dubai Academy Network'],
    schemaLocalAddress: {
      street: 'Sheikh Zayed Road, Al Barsha 1',
      locality: 'Dubai',
      region: 'Dubai',
      postalCode: '00000'
    }
  },
  karachi: {
    name: 'Karachi',
    urduName: 'کراچی',
    title: 'School Management Software Karachi | Complete ERP Suite - Taleem360',
    metaDesc: 'Discover the premier school management software in Karachi. Taleem360 offers automated attendance, online fee collection, and dual-persistence ERP solutions tailored for schools in Karachi.',
    headKeyword: 'school management software karachi',
    additionalKeywords: [
      'best school management software in pakistan',
      'online fee collection school pakistan',
      'biometric attendance school software pakistan'
    ],
    intro: 'Karachi, the massive financial heart of Pakistan, hosts some of the country\'s largest and most prestigious school networks. Managing thousands of students across multiple campuses in Clifton, Gulshan, Nazimabad, and DHA demands an enterprise-grade cloud database suite.',
    keyChallenge: 'Scaling administration, matching complex cash flow collections, and ensuring high-performance student attendance tracking across massive student bodies.',
    localSchools: ['Allied School Karachi Campus', 'Pinnacle STEM Academy Clifton', 'Al-Murtaza School Network', 'City School System Sindh Region'],
    schemaLocalAddress: {
      street: 'Main Shahrah-e-Faisal, Block 6, PECHS',
      locality: 'Karachi',
      region: 'Sindh',
      postalCode: '75400'
    }
  },
  lahore: {
    name: 'Lahore',
    urduName: 'لاہور',
    title: 'School ERP Lahore | Smart Education Management System - Taleem360',
    metaDesc: 'Looking for a reliable school ERP in Lahore? Optimize your campus operations with biometric attendance, cashless ledgers, and localized SMS alerts in Lahore.',
    headKeyword: 'school erp lahore',
    additionalKeywords: [
      'best school erp system in pakistan',
      'school fee challan software pakistan',
      'parent sms alert attendance school pakistan'
    ],
    intro: 'As the cultural and historical capital of Pakistan, Lahore has always been the academic epicenter of the country. From Gulberg to Johar Town, DHA to walled-city hubs, Lahore private schools are leading the charge in digital transformation.',
    keyChallenge: 'Modernizing student information systems, reducing administrative workloads, and shifting traditional manual tuition billing into seamless digital channels.',
    localSchools: ['Lahore Grammar School Network', 'Beaconhouse Central Region Office', 'Allied Schools Lahore Branch', 'Educators Academy Johar Town'],
    schemaLocalAddress: {
      street: 'M.M. Alam Road, Gulberg III',
      locality: 'Lahore',
      region: 'Punjab',
      postalCode: '54000'
    }
  },
  islamabad: {
    name: 'Islamabad',
    urduName: 'اسلام آباد',
    title: 'School Management System Islamabad | Premium Cloud ERP - Taleem360',
    metaDesc: 'Elevate your federal capital school with the ultimate school management system in Islamabad. Custom biometric tracking, double-entry finance ledger, and parent apps.',
    headKeyword: 'school management system islamabad',
    additionalKeywords: [
      'school software rawalpindi',
      'cloud based school management software pakistan',
      'k12 school erp pakistan'
    ],
    intro: 'The twin cities of Islamabad and Rawalpindi represent a highly tech-savvy and quality-conscious educational market. Federal schools, international academies, and elite institutions require high-availability cloud infrastructure and premium compliance tools.',
    keyChallenge: 'Maintaining modern communication standards with parents, robust cybersecurity, and advanced academic planning with analytical gradebooks.',
    localSchools: ['Islamabad Model School System', 'Root Millennium Twin Cities', 'Fazaia Inter College Sector E-9', 'Army Public School Rawalpindi Command'],
    schemaLocalAddress: {
      street: 'Jinnah Avenue, Blue Area',
      locality: 'Islamabad',
      region: 'Federal Capital',
      postalCode: '44000'
    }
  },
  rawalpindi: {
    name: 'Rawalpindi',
    urduName: 'راولپنڈی',
    title: 'School Software Rawalpindi | Advanced Campus ERP - Taleem360',
    metaDesc: 'Top-tier school software in Rawalpindi. Streamline admissions, biometric attendance, and automated WhatsApp reminders for parent-teacher coordination.',
    headKeyword: 'school software rawalpindi',
    additionalKeywords: [
      'school management system islamabad',
      'school fee reminder whatsapp pakistan',
      'easypaisa school fee collection software'
    ],
    intro: 'Rawalpindi\'s vibrant education landscape features dense, highly active schools in Saddar, Satellite Town, and Bahria Town. Running a successful school here requires optimized administrative flows to handle tight financial turnarounds.',
    keyChallenge: 'Minimizing outstanding tuition fee defaults, sending automated alerts to parents, and maintaining real-time teacher timetables.',
    localSchools: ['Siddique Public School', 'Army Public School & College Rawalpindi', 'Pinnacle High Rawalpindi Campus', 'Allied School Twin Cities'],
    schemaLocalAddress: {
      street: 'Saddar Cantonment Mall Road',
      locality: 'Rawalpindi',
      region: 'Punjab',
      postalCode: '46000'
    }
  },
  peshawar: {
    name: 'Peshawar',
    urduName: 'پشاور',
    title: 'School ERP Peshawar | Reliable Educational Suite - Taleem360',
    metaDesc: 'Discover the premier school ERP in Peshawar. Seamlessly track attendance, generate local bank invoice bills, and digitize admissions across Khyber Pakhtunkhwa.',
    headKeyword: 'school erp peshawar',
    additionalKeywords: [
      'student attendance management system pakistan',
      'school fee management software pakistan',
      'free educational resources for schools pakistan'
    ],
    intro: 'In the historic city of Peshawar and across Khyber Pakhtunkhwa, educational institutions are quickly upgrading to cloud platforms. Taleem360 provides the region with lightweight, high-availability ERP software that runs beautifully on local internet connections.',
    keyChallenge: 'Providing offline-resilient local caches to ensure continuous billing and attendance even in low-connectivity areas.',
    localSchools: ['Peshawar Model School System', 'KP Public Schools Consortium', 'Edwardes College Academy', 'Allied Peshawar University Town'],
    schemaLocalAddress: {
      street: 'University Road, Opposite Peshawar University',
      locality: 'Peshawar',
      region: 'Khyber Pakhtunkhwa',
      postalCode: '25000'
    }
  },
  faisalabad: {
    name: 'Faisalabad',
    urduName: 'فیصل آباد',
    title: 'School Management Software Faisalabad | Localized School ERP - Taleem360',
    metaDesc: 'Optimize your academic administration with school management software in Faisalabad. Dual-persistence tech, automated local bank integrations, and SMS alerts.',
    headKeyword: 'school management software faisalabad',
    additionalKeywords: [
      'school fee challan software pakistan',
      'jazzcash school fee payment integration',
      'online attendance system for schools'
    ],
    intro: 'Faisalabad, Pakistan\'s major industrial hub, is experiencing rapid growth in private education. Schools in Kohinoor City, People\'s Colony, and Madina Town require modern digital accounting and double-entry general ledgers to streamline operations.',
    keyChallenge: 'Transitioning manual, paper-based fee receipt books into digital bank reconciliations, JazzCash, and EasyPaisa networks.',
    localSchools: ['Faisalabad Grammar School', 'Allied Faisalabad Campuses', 'National Science School', 'D-Ground Educators System'],
    schemaLocalAddress: {
      street: 'Susan Road, Madina Town',
      locality: 'Faisalabad',
      region: 'Punjab',
      postalCode: '38000'
    }
  },
  multan: {
    name: 'Multan',
    urduName: 'ملتان',
    title: 'Best School Software Multan | Advanced Student Database - Taleem360',
    metaDesc: 'The absolute best school software in Multan. Streamline nursery, primary and K-12 school workflows with smart biometric integration and cloud report cards.',
    headKeyword: 'best school software multan',
    additionalKeywords: [
      'school erp pakistan',
      'student information system pakistan',
      'how to reduce school fee defaults pakistan'
    ],
    intro: 'Multan serves as the primary educational powerhouse for Southern Punjab. Educational setups here need an affordable, easy-to-use, yet complete system that connects administrators, teachers, and parents.',
    keyChallenge: 'Overcoming technical skill gaps in staff training, providing direct localized customer support, and simplifying exam report card generations.',
    localSchools: ['Multan Public School System', 'Allied School Multan City Campus', 'LaSalle High School Multan', 'Muslim College Academy'],
    schemaLocalAddress: {
      street: 'Boson Road, Near Multan University',
      locality: 'Multan',
      region: 'Punjab',
      postalCode: '60000'
    }
  },
  quetta: {
    name: 'Quetta',
    urduName: 'کوئٹہ',
    title: 'School ERP Quetta | Localized Education Cloud Platform - Taleem360',
    metaDesc: 'Introducing the first-mover school ERP in Quetta. Manage classrooms, student files, and school finances smoothly on a secure, offline-resilient local server.',
    headKeyword: 'school erp quetta',
    additionalKeywords: [
      'school management system pakistan',
      'free school lms pakistan',
      'cloud lms pakistan schools'
    ],
    intro: 'In Balochistan\'s capital, schools face unique challenges including diverse demographics, fluctuating connectivity, and limited local software suppliers. Taleem360 brings premium K-12 school cloud suites to Quetta with direct local database storage.',
    keyChallenge: 'Ensuring continuous software operations without internet reliance and providing localized training materials.',
    localSchools: ['St. Francis Grammar School Quetta', 'Quetta Public School', 'Allied School Quetta Campus', 'Balochistan Academy System'],
    schemaLocalAddress: {
      street: 'Jinnah Road, Cantonment Area',
      locality: 'Quetta',
      region: 'Balochistan',
      postalCode: '87300'
    }
  }
};

export const CitySEO: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { city } = useParams<{ city: string }>();
  const path = window.location.pathname.replace(/^\//, '').toLowerCase();
  const normalizedCity = (city || path || 'karachi').toLowerCase();
  const data = CITY_DETAILS[normalizedCity] || CITY_DETAILS.karachi;

  const getCountryCode = (c: string) => {
    if (c === 'nigeria') return 'NG';
    if (c === 'bangladesh') return 'BD';
    if (c === 'uae') return 'AE';
    return 'PK';
  };

  const getCoordinates = (c: string) => {
    if (c === 'nigeria') return { lat: '6.5244', lng: '3.3792' };
    if (c === 'bangladesh') return { lat: '23.8103', lng: '90.4125' };
    if (c === 'uae') return { lat: '25.2048', lng: '55.2708' };
    if (c === 'karachi') return { lat: '24.8607', lng: '67.0011' };
    if (c === 'lahore') return { lat: '31.5204', lng: '74.3587' };
    return { lat: '33.6844', lng: '73.0479' };
  };

  const coords = getCoordinates(normalizedCity);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Taleem360 - ${data.name} School ERP Office`,
    "image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&h=630&q=80",
    "telephone": normalizedCity === 'nigeria' ? "+234-1-1234567" : normalizedCity === 'uae' ? "+971-4-1234567" : normalizedCity === 'bangladesh' ? "+880-2-1234567" : "+92-300-1234567",
    "email": "support@taleem360.online",
    "url": `https://www.taleem360.online/${normalizedCity}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": data.schemaLocalAddress.street,
      "addressLocality": data.schemaLocalAddress.locality,
      "addressRegion": data.schemaLocalAddress.region,
      "postalCode": data.schemaLocalAddress.postalCode,
      "addressCountry": getCountryCode(normalizedCity)
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": coords.lat,
      "longitude": coords.lng
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.facebook.com/taleem360",
      "https://twitter.com/taleem360"
    ]
  };

  useSEO({
    title: data.title,
    description: data.metaDesc,
    keywords: [data.headKeyword, ...data.additionalKeywords].join(', '),
    canonicalUrl: `https://www.taleem360.online/${normalizedCity}`,
    schemaMarkup: localBusinessSchema
  });

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.06),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(79,70,229,0.05),transparent_50%)] pointer-events-none" />

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
              <Link to="/compare" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Compare</Link>
              <Link to="/free-resources" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Free Printables</Link>
              <Link to="/blog" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">Blog</Link>
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
                  to="/compare" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-slate-300 hover:text-emerald-400 py-2 border-b border-slate-900 transition-colors"
                >
                  Compare ERP Suite
                </Link>
                <Link 
                  to="/free-resources" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-slate-300 hover:text-emerald-400 py-2 border-b border-slate-900 transition-colors"
                >
                  Free Worksheets
                </Link>
                <Link 
                  to="/blog" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-slate-300 hover:text-emerald-400 py-2 border-b border-slate-900 transition-colors"
                >
                  Educational Blog
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
            <MapPin className="w-3.5 h-3.5" />
            Empowering Education in {data.name} ({data.urduName})
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">School ERP in {data.name}</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Optimize administrative controls, digitize ledger billing, and streamline biometric tracking. 
            Taleem360 is localized specifically to support the school systems of {data.name}.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/onboarding" 
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-8 py-4 rounded-full text-sm transition-all shadow-lg shadow-emerald-950/50 hover:scale-105 active:scale-95"
            >
              Start Free Pilot Plan
            </Link>
            <Link 
              to="/contact" 
              className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold px-8 py-4 rounded-full text-sm transition-all hover:scale-105 active:scale-95"
            >
              Book a Local Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Regional context showcase block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 border-t border-slate-800/60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Why Localized School Systems in {data.name} Rely on Taleem360
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              {data.intro}
            </p>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              <strong className="text-emerald-400">The Primary Operational Challenge:</strong> {data.keyChallenge}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Optimized local branch database architecture</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Urdu &amp; English SMS notification gateways</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Cashless bill deposit matching (JazzCash, EasyPaisa, HBL)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Trusted by Premier {data.name} Campuses
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.localSchools.map((school, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>{school}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-[11px] text-slate-500 italic">
                Local references are verified partner institutions using the Taleem360 cloud database system.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Focus Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-slate-800/60">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">Full-Spectrum Modules Built for Local Growth</h2>
          <p className="text-slate-400 text-sm mt-3">Equipping {data.name}'s administrators with high-tier tech control.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-950/40 border border-slate-800/60 rounded-3xl hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Cashless Invoicing &amp; Bank Ledgers</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Generate custom PDF invoices with unique deposit challans. Compatible with local banking systems, JazzCash mobile networks, and EasyPaisa wallets.
            </p>
          </div>

          <div className="p-8 bg-slate-950/40 border border-slate-800/60 rounded-3xl hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Automated Attendance &amp; Hardware</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Integrate biometric thumb scanners or RFID cards smoothly. Instantly trigger automated parent alerts to notify them of classroom entry/exit.
            </p>
          </div>

          <div className="p-8 bg-slate-950/40 border border-slate-800/60 rounded-3xl hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Instant Parent Mobile Portals</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Provide parents with lightweight browser portals or WhatsApp triggers showing homework, upcoming exams, fees due, and complete student status reports.
            </p>
          </div>
        </div>
      </div>

      {/* Regional Local FAQ section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-slate-800/60">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
          Frequently Asked Questions — {data.name} School ERP
        </h2>

        <div className="space-y-6">
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-2">
              Is training provided for my school staff in {data.name}?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes, absolutely! We understand that adopting new school management software in Karachi, Lahore, or other major cities can be a major transition. We provide both remote and hands-on onboarding sessions tailored specifically for administrative, academic, and accounting staff.
            </p>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-2">
              How does the online fee collection integrate with local Pakistani banks?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Taleem360 generates computerized fee challans with automated barcodes. Your parents can pay via mobile bank transfers, 1Link bills, physical cash deposit slips at designated commercial branches, or via mobile wallets like JazzCash and EasyPaisa.
            </p>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-2">
              Can we run other segments besides standard K-12 on this portal?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Taleem360 is a fully modular unified school ERP. In addition to standard high school branches, we offer specialized systems for Skills Academies, Private Tutors, Daycares, and Madrasas, allowing managers to handle all branches within one dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Local Contact Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 to-indigo-950/40 border-t border-slate-800 py-16 relative z-10 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-white mb-4">Digitize Your {data.name} Campus Today</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
            Empower your educators, engage parents, and secure your financial data with Pakistan's premium cloud ERP suite.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/onboarding" 
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-8 rounded-full transition-all cursor-pointer shadow-lg"
            >
              Get Started Now
            </Link>
            <a 
              href="tel:+923001234567" 
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs py-3.5 px-8 rounded-full transition-all cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              Call Regional Support
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
