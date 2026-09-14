import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scan, Camera, Fingerprint, QrCode, 
  AlertTriangle, Clock, CheckCircle, ArrowRight,
  Shield, BarChart3, Smartphone, Wifi
} from 'lucide-react';

// ─── FAQ Data ───────────────────────────────────────────────
const ATTENDANCE_FAQ = [
  {
    q: 'How does biometric attendance work for schools?',
    a: 'Taleem360 connects to standard USB biometric scanners or fingerprint readers at your school gate. When a student scans their fingerprint, the system matches it against the student database and records attendance in under 1 second. No internet connection is required at the gate — the device syncs to the cloud when connectivity is available.'
  },
  {
    q: 'What hardware do I need for biometric attendance?',
    a: 'Taleem360 works with any standard USB biometric fingerprint scanner compatible with Windows or Android. No proprietary hardware is required. You can also use QR code student ID cards scanned via a smartphone camera, or RFID smart cards. Most schools start with QR codes (zero hardware cost) and upgrade to biometric scanners as budget allows.'
  },
  {
    q: 'Is biometric attendance expensive for small schools?',
    a: 'Not with Taleem360. QR code attendance is completely free — you print student ID cards with QR codes and scan them with any smartphone. Biometric scanners cost approximately Rs. 3,000-8,000 one-time per gate. The Taleem360 software itself is included in your subscription — no separate attendance module fee.'
  },
  {
    q: 'Can biometric attendance send parent alerts?',
    a: 'Yes. When a student is marked absent, Taleem360 immediately sends an automated WhatsApp message and SMS to the parent\'s registered phone number. This happens within seconds of the attendance recording. Parents also receive fee reminders, event notices, and daily attendance summaries via WhatsApp.'
  },
  {
    q: 'Can I track attendance on a bus or remote location?',
    a: 'Yes. Taleem360\'s dual-persistence architecture means attendance can be recorded offline at bus gates, remote campuses, or anywhere without internet. The data syncs to the cloud automatically when the device reconnects. Administrators see a unified attendance dashboard regardless of where the scan happened.'
  },
  {
    q: 'How accurate is the attendance data?',
    a: 'Taleem360 records attendance in under 1 second per student with sub-second gate check-in throughput. The system eliminates manual roll-call errors, prevents buddy-punching (students marking attendance for absent friends), and produces auditable attendance logs that can be exported as compliance reports.'
  },
  {
    q: 'Does Taleem360 work with existing school databases?',
    a: 'Taleem360 is a complete school database management system — it includes the student information system, attendance module, fee management, and more in one platform. If you\'re migrating from another system, student data can be imported via CSV. The attendance module works with the student database natively.'
  },
  {
    q: 'Can teachers mark attendance from their phone?',
    a: 'Yes. Taleem360\'s teacher mobile app allows teachers to mark attendance from their smartphone — either by scanning QR codes, using the fingerprint scanner connected to their device, or manually entering attendance for classrooms where hardware isn\'t available. All records sync in real time to the central dashboard.'
  }
];

// ─── 4-Step Setup Guide ─────────────────────────────────────
const SETUP_STEPS = [
  {
    step: '01',
    title: 'Issue Smart ID Cards',
    description: 'Generate unique QR code ID cards for every student directly from your Taleem360 student database. Print on standard card stock — no special equipment needed. Each card contains the student\'s unique identifier and photo.',
    icon: QrCode,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  },
  {
    step: '02',
    title: 'Connect Your Scanner',
    description: 'Plug in your USB biometric scanner at the gate, or use a smartphone with the Taleem360 teacher app to scan QR codes. The system auto-detects standard scanners. No driver installation or IT configuration needed for most devices.',
    icon: Camera,
    color: 'bg-sky-50 text-sky-600 border-sky-200'
  },
  {
    step: '03',
    title: 'Set Up Parent Alerts',
    description: 'Enter parent phone numbers during student enrollment. Taleem360 automatically sends WhatsApp messages and SMS when a student is marked absent. Customize alert templates, quiet hours, and which events trigger notifications.',
    icon: Smartphone,
    color: 'bg-amber-50 text-amber-600 border-amber-200'
  },
  {
    step: '04',
    title: 'Monitor from One Dashboard',
    description: 'Access the live attendance dashboard from any device. View daily attendance rates, spot truancy patterns, generate compliance reports, and drill down by class, date, or student. All data exports to PDF, Excel, or CSV.',
    icon: BarChart3,
    color: 'bg-purple-50 text-purple-600 border-purple-200'
  }
];

// ─── Feature Cards ───────────────────────────────────────────
const FEATURES = [
  {
    title: 'QR Code ID Cards',
    description: 'Generate and print student ID cards with unique QR codes from your database. Zero hardware cost. Scan with any smartphone camera.',
    icon: QrCode,
    highlight: 'No extra hardware needed'
  },
  {
    title: 'Biometric Fingerprint Scanners',
    description: 'Connect any standard USB biometric scanner. Fingerprint matching in under 1 second. Works offline and syncs when online.',
    icon: Fingerprint,
    highlight: 'Sub-second check-in'
  },
  {
    title: 'RFID Smart Cards',
    description: 'Issue RFID student cards for tap-and-go attendance. Ideal for high-volume gates. Compatible with standard RFID readers.',
    icon: Scan,
    highlight: 'Tap-and-go speed'
  },
  {
    title: 'Teacher Mobile App',
    description: 'Teachers mark attendance from their phone — QR scan, biometric, or manual entry. Real-time sync to the central dashboard.',
    icon: Smartphone,
    highlight: 'Any device, any classroom'
  },
  {
    title: 'Instant Parent Alerts',
    description: 'Absent students trigger automatic WhatsApp and SMS alerts to parents within seconds. Customizable templates and quiet hours.',
    icon: AlertTriangle,
    highlight: 'WhatsApp + SMS'
  },
  {
    title: 'Offline-First Architecture',
    description: 'Record attendance at bus gates, remote campuses, or anywhere without internet. Dual-persistence syncs data automatically.',
    icon: Wifi,
    highlight: 'Works without internet'
  },
  {
    title: 'Live Dashboard',
    description: 'Real-time attendance rates, truancy alerts, class-level breakdowns, and compliance reports. Export to PDF, Excel, CSV.',
    icon: BarChart3,
    highlight: 'One screen, full picture'
  },
  {
    title: 'Compliance Reports',
    description: 'Generate attendance reports for board examinations, government compliance, and parent-teacher meetings. Audit-ready logs.',
    icon: CheckCircle,
    highlight: 'Board-ready reports'
  }
];

// ─── Component ───────────────────────────────────────────────
const BiometricAttendance: React.FC = () => {
  useEffect(() => {
    document.title = 'Biometric Attendance System for Schools Pakistan | Taleem360';
    
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    
    setMeta('description', 'Automate student attendance with Taleem360: biometric fingerprint scanners, QR code ID cards, RFID, and teacher mobile apps. Records attendance in under 1 second with instant WhatsApp/SMS parent alerts. Start free pilot.');
    
    const setOG = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', prop);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    
    setOG('og:title', 'Biometric Attendance System for Schools — Pakistan | Taleem360');
    setOG('og:description', 'Automate student attendance with biometric scanners, QR codes, and RFID. Sub-second check-in, instant parent alerts via WhatsApp/SMS. 30-day free pilot.');
    setOG('og:type', 'website');
    setOG('og:url', 'https://www.taleem360.online/biometric-attendance');
    setOG('og:image', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&h=630&q=80');
    
    const setTwitter = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    
    setTwitter('twitter:card', 'summary_large_image');
    setTwitter('twitter:title', 'Biometric Attendance System for Schools — Pakistan | Taleem360');
    setTwitter('twitter:description', 'Automate student attendance with biometric scanners, QR codes, and RFID. Sub-second check-in, instant parent alerts via WhatsApp/SMS.');
    setTwitter('twitter:image', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&h=630&q=80');
    
    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://www.taleem360.online/biometric-attendance');
    
    // FAQPage Schema
    const schemaScript = document.createElement('script');
    schemaScript.setAttribute('type', 'application/ld+json');
    schemaScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": ATTENDANCE_FAQ.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    });
    document.head.appendChild(schemaScript);
    
    return () => {
      if (schemaScript.parentNode) schemaScript.parentNode.removeChild(schemaScript);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Hero */}
      <section className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-2xl -ml-20 -mb-20"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full mb-4">
                <Fingerprint className="w-3.5 h-3.5" /> Automated Attendance
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                Biometric Attendance System for Schools
              </h1>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
                Automate student attendance with biometric fingerprint scanners, QR code ID cards, or RFID. 
                Taleem360 records attendance in under 1 second and sends instant WhatsApp/SMS alerts to parents 
                when a student is absent.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link to="/pricing" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/25">
                  Start Free 30-Day Pilot
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/attendance" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all border border-white/20">
                  See Full Attendance Module
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 w-full md:w-80">
              <div className="text-center">
                <div className="text-4xl font-black text-emerald-400 mb-1">&lt;1s</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Attendance Recorded</div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-2xl font-bold text-white">Instant</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Parent Alert via WhatsApp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Setup Guide */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
              How Automated Attendance Works in 4 Steps
            </h2>
            <p className="text-slate-500 text-base">
              No complex setup. No dedicated IT staff. Most schools are recording automated attendance within the first day.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SETUP_STEPS.map((s) => (
              <div key={s.step} className="relative bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 transition-all group">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border ${s.color} mb-4`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Step {s.step}</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Methods Comparison */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
              Choose Your Attendance Method
            </h2>
            <p className="text-slate-500 text-base">
              Every school is different. Taleem360 supports all major attendance methods — use one or mix and match.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                method: 'QR Code ID Cards',
                tag: 'Zero Hardware Cost',
                tagColor: 'bg-emerald-100 text-emerald-700',
                description: 'Print student ID cards with unique QR codes from your Taleem360 database. Scan with any smartphone camera. Ideal for schools starting with automated attendance — no extra investment needed.',
                pros: ['Free to implement', 'Works with any phone', 'Easy to deploy day one', 'Student photo on card'],
                icon: QrCode,
                color: 'bg-emerald-50 border-emerald-200 text-emerald-600'
              },
              {
                method: 'Biometric Fingerprint',
                tag: 'Sub-Second Check-In',
                tagColor: 'bg-sky-100 text-sky-700',
                description: 'Connect a standard USB biometric scanner at your gate. Students place their finger — attendance recorded in under 1 second. Best for schools with high student volume and gate traffic.',
                pros: ['Under 1 second per student', 'Prevents buddy-punching', 'Works offline', 'Standard USB scanners'],
                icon: Fingerprint,
                color: 'bg-sky-50 border-sky-200 text-sky-600'
              },
              {
                method: 'RFID Smart Cards',
                tag: 'Tap-and-Go',
                tagColor: 'bg-amber-100 text-amber-700',
                description: 'Issue RFID student cards. Students tap their card at the gate reader — attendance recorded instantly. Ideal for schools that already use smart card systems or want the fastest throughput.',
                pros: ['Fastest throughput', 'Durability (no damaged cards)', 'Works in all weather', 'Standard RFID readers'],
                icon: Scan,
                color: 'bg-amber-50 border-amber-200 text-amber-600'
              }
            ].map((m, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 ${m.color}`}>
                  <m.icon className="w-5 h-5" />
                </div>
                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${m.tagColor} mb-3`}>
                  {m.tag}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{m.method}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{m.description}</p>
                <ul className="space-y-1.5">
                  {m.pros.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-slate-500">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
              Everything You Need for Automated Attendance
            </h2>
            <p className="text-slate-500 text-base">
              From hardware setup to parent communication — Taleem360 covers the full attendance workflow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-emerald-200 hover:shadow-sm transition-all group">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex items-center justify-center w-9 h-9 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-200 transition-colors">
                    <f.icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{f.title}</h4>
                    <p className="text-xs text-emerald-600 font-medium mt-0.5">{f.highlight}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Schools section */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl ml-20 mb-20"></div>
        
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
                Built for Pakistani Schools — Not Western Imports
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                Taleem360\'s attendance system understands how Pakistani schools actually operate:
              </p>
              <ul className="space-y-3">
                {[
                  'QR code attendance works with any smartphone — no expensive hardware required',
                  'Biometric scanners that work with standard USB devices — no proprietary hardware',
                  'WhatsApp alerts in Urdu and English — the way Pakistani parents actually communicate',
                  'Offline attendance recording for bus routes, remote campuses, and low-connectivity areas',
                  'Dual-persistence architecture — records attendance even when the internet is down',
                  'Fee reminders via WhatsApp — reduces fee defaults without awkward conversations',
                  'Works with the Pakistani school calendar — summer breaks, Ramadan schedules, board exam periods'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="text-center">
                <div className="text-5xl font-black text-emerald-400 mb-2">81</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Position for "school biometric attendance system" — before optimization</div>
                <div className="mt-4 pt-4 border-t border-white/10 text-center">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full">
                    <Clock className="w-3 h-3" /> Target: Top 10 within 90 days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm">
              Everything you need to know about automated attendance for schools.
            </p>
          </div>
          
          <div className="space-y-4">
            {ATTENDANCE_FAQ.map((faq, i) => (
              <details key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
                <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors list-none">
                  <span className="pr-4">{faq.q}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-emerald-50 border-y border-emerald-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
            Ready to Automate Attendance at Your School?
          </h2>
          <p className="text-slate-600 text-base mb-6">
            Start with a 30-day free pilot. No credit card required. Full student database access. 
            See how automated attendance works before you commit.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/pricing" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-base transition-all shadow-lg shadow-emerald-500/25">
              Start Free Pilot
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/attendance" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-medium px-6 py-3 rounded-xl text-base transition-all border border-slate-200">
              Explore Full Attendance Module
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BiometricAttendance;
