import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Code2, 
  Cpu, 
  Webhook, 
  Key, 
  BookOpen, 
  CheckCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  ChevronRight, 
  PhoneCall,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import { Footer } from '../components/Footer';

export const APIDocs: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'School ERP REST API & Integrations | Taleem360 Developers';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Unlock Pakistan\'s first unified school management API. Integrate student records, attendance triggers, and school fee payment APIs (JazzCash, EasyPaisa) into custom applications.');

    // Schema Markup for Developer API
    const schemaScriptId = 'jsonld-api-seo';
    let schemaScript = document.getElementById(schemaScriptId);
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('id', schemaScriptId);
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }

    const apiSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      "name": "Taleem360 Unified School ERP API",
      "targetProduct": {
        "@type": "SoftwareApplication",
        "name": "Taleem360 School Management Software",
        "applicationCategory": "EducationalBusinessApplication"
      },
      "codeRepository": "https://github.com/taleem360/schoolerp-core",
      "programmingLanguage": "TypeScript",
      "runtimePlatform": "Node.js",
      "description": "Developer-first school management software REST API and webhooks. Easily integrate student profiles, biometric records, and Easypaisa/Jazzcash tuition billing."
    };

    schemaScript.innerHTML = JSON.stringify(apiSchema);

    return () => {
      const scriptToRemove = document.getElementById(schemaScriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const codeSnippets = {
    fetchStudents: `// Fetch Active Students from SIS Database
const response = await fetch('https://api.taleem360.online/v2/students?status=active', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'X-School-Tenant': 'clifton-stem-academy'
  }
});
const data = await response.json();
console.log(\`Retrieved \${data.students.length} student records.\`);`,
    webhookHandler: `// Express.js Webhook Endpoint for Automatic Fee Collections
app.post('/webhooks/taleem-payments', express.json(), (req, res) => {
  const signature = req.headers['x-taleem-signature'];
  const event = req.body;

  if (verifySignature(event, signature)) {
    if (event.type === 'payment.challan_paid') {
      const { challanNo, amount, paymentMethod } = event.data;
      console.log(\`Fee challan #\${challanNo} cleared via \${paymentMethod}!\`);
      // Update local accounting database
    }
    res.status(200).send({ received: true });
  } else {
    res.status(400).send('Invalid signature');
  }
});`
  };

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

      {/* Hero Header Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Terminal className="w-3.5 h-3.5" />
            Developer-First EdTech Integration
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">School ERP REST API</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Connect our high-performance school database management system with custom mobile applications, proprietary portals, biometric terminal hardware, and localized payment rails.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#endpoints" 
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-8 py-4 rounded-full text-sm transition-all shadow-lg shadow-emerald-950/50 hover:scale-105 active:scale-95"
            >
              Explore API Endpoints
            </a>
            <Link 
              to="/contact" 
              className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold px-8 py-4 rounded-full text-sm transition-all hover:scale-105 active:scale-95"
            >
              Request sandbox key
            </Link>
          </div>
        </div>
      </div>

      {/* Core Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 border-t border-slate-800/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-950/40 border border-slate-800/60 rounded-3xl hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-6">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Restful JSON Architecture</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Fully structured RESTful endpoints with standard JWT-bearer token authentication, schema-validated JSON bodies, and detailed rate-limit signaling in the headers.
            </p>
          </div>

          <div className="p-8 bg-slate-950/40 border border-slate-800/60 rounded-3xl hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-6">
              <Webhook className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-Time Webhooks</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Don't poll. Get push event payloads triggered on tuition challan creation, successful JazzCash and EasyPaisa fee deposits, or instant biometric terminal logins.
            </p>
          </div>

          <div className="p-8 bg-slate-950/40 border border-slate-800/60 rounded-3xl hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Hardware-Friendly Triggers</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Push real-time biometric terminal scans straight into our cloud ledger, automatically setting student attendance states and launching parent SMS reminders.
            </p>
          </div>
        </div>
      </div>

      {/* Code Showcase Panel */}
      <div id="endpoints" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-slate-800/60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Easy Integration with Simple Endpoints</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Taleem360's API enables modern developers and system administrators to synchronize local databases (like Student Information Systems or custom fee systems) with our robust cloud platform. Avoid complex configurations — get up and running in minutes.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-emerald-950 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">GET</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">/v2/students</h4>
                  <p className="text-[11px] text-slate-500">List and filter student profiles, active courses, enrollment status, and parent numbers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-indigo-950 text-indigo-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">POST</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">/v2/attendance</h4>
                  <p className="text-[11px] text-slate-500">Record check-in logs from external biometric thumb scanners or proximity RFID cards.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-indigo-950 text-indigo-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">POST</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">/v2/finance/challan</h4>
                  <p className="text-[11px] text-slate-500">Generate structured tuition invoices with computerized EasyPaisa and JazzCash barcodes.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Student Snippet */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex justify-between items-center">
                <span className="text-[11px] font-mono text-slate-400 font-bold">fetch-students.js</span>
                <button 
                  onClick={() => handleCopy(codeSnippets.fetchStudents, 'students')} 
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center gap-1.5 text-[11px]"
                >
                  {copiedText === 'students' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <pre className="p-6 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
                <code>{codeSnippets.fetchStudents}</code>
              </pre>
            </div>

            {/* Webhook Snippet */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex justify-between items-center">
                <span className="text-[11px] font-mono text-slate-400 font-bold">fee-webhook.js</span>
                <button 
                  onClick={() => handleCopy(codeSnippets.webhookHandler, 'webhook')} 
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center gap-1.5 text-[11px]"
                >
                  {copiedText === 'webhook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <pre className="p-6 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
                <code>{codeSnippets.webhookHandler}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Developer FAQ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-slate-800/60">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
          Developer Integration FAQ
        </h2>

        <div className="space-y-6">
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-2">
              How do we request an API key for our school or agency?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              API key generation is fully integrated into the school admin settings. Navigate to **School Settings &gt; Developer API Options** inside your school administrator dashboard to provision custom keys and verify authorization scopes.
            </p>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-2">
              Are there built-in libraries for popular payment gateways (like EasyPaisa)?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes, our fee management module REST API abstracts all underlying communication with EasyPaisa, JazzCash, and local retail banking systems. Once a parent deposits tuition fees, a payment webhook trigger clears the challan status automatically.
            </p>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-2">
              What are the standard rate limits for API keys?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard plans allow up to 100 requests per minute. Custom white-label or multi-campus ERP licenses support customizable rate boundaries depending on enrollment volumes and biometric concurrency requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Sales CTA */}
      <div className="bg-gradient-to-r from-emerald-950/60 to-indigo-950/40 border-t border-slate-800 py-16 relative z-10 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-white mb-4">Integrate Taleem360 with Your Ecosystem</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
            Create high-value custom portals, leverage biometric automated hardware integrations, and build custom mobile applications with our premium API solutions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/onboarding" 
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-8 rounded-full transition-all cursor-pointer shadow-lg"
            >
              Get API Sandbox Key
            </Link>
            <a 
              href="tel:+923001234567" 
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs py-3.5 px-8 rounded-full transition-all cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              Developer Support Line
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
