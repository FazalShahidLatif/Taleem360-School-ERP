import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building2, 
  Sparkles,
  HelpCircle,
  MessageSquareCode
} from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  React.useEffect(() => {
    document.title = 'Contact Us - Taleem360 ERP Ecosystem';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Get in touch with Taleem360. Reach our Karachi Cantt offices or send us an inquiry regarding our School, Academy, Daycare, and Private Tutor modules.');

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', 'https://www.taleem360.online/contact');
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API storage roundtrip
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'general',
        message: ''
      });
    }, 1200);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full text-emerald-800 text-xs font-bold mb-4 ring-2 ring-emerald-500/10">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
            <span>CONNECT WITH OUR GLOBAL TEAMS</span>
          </div>
          <h1 className="text-3.5xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Let's Start a <span className="text-emerald-600 font-extrabold">Conversation</span>
          </h1>
          <p className="mt-3 text-slate-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Have questions about our multi-tenant structures, custom subdomains, or integrated billing gates? Reach out below and our support coordinators will resolve your inquiries promptly.
          </p>
        </div>

        {/* 2-Column Main Contact & Map Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column A: Interactive Inquiries Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-150 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <MessageSquareCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Custom Inquiry dispatch</h3>
                  <p className="text-xs text-slate-400">Your information is logged securely within our dual-persistence repository rules.</p>
                </div>
              </div>

              {submitSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 my-8"
                >
                  <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Inquiry Received Successfully</h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                      Thank you for contacting Taleem360 support! A corresponding ticket has been initialized and assigned to our on-call coordinator.
                    </p>
                  </div>
                  <button 
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Your Full Name
                      </label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        placeholder="e.g. Dr. Fawad Ahmed"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-white block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        placeholder="name@institution.edu"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-white block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Phone (Optional)
                      </label>
                      <input 
                        type="text" 
                        name="phone"
                        placeholder="e.g. +92 (332) 213 7898"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-white block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Target Department
                      </label>
                      <select 
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="bg-white block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                      >
                        <option value="general">General Support & Sales</option>
                        <option value="academy">Skills Academies & Bootcamps</option>
                        <option value="daycare">Daycare Center ERP</option>
                        <option value="tutors">Private Tutor Spaces</option>
                        <option value="billing">Billing & Manual Activation Requests</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Your Message Body
                    </label>
                    <textarea 
                      name="message"
                      required
                      rows={4}
                      placeholder="Detail your institution size, active concerns, or configuration queries..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="bg-white block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Logging Inquiry...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Transmit Inquiry
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                Response index within 3 hours guaranteed.
              </span>
              <span className="font-mono text-[10px]">T360-CONTACT-ROUTE</span>
            </div>
          </div>

          {/* Column B: Physical Location Details & Mock Map (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            
            {/* Contact details Card */}
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-5">
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                OFFICIAL LOCALE
              </span>
              <h3 className="text-lg font-black text-slate-900 leading-tight">Headquarter Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Registered Address</h4>
                    <p className="text-xs text-slate-600 mt-1 font-mono leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                      26/792 Cantt Bazar, Drigh Road, Karaci -75350
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Direct Phone</h4>
                    <p className="text-xs text-slate-600 mt-1 font-semibold">
                      +92 (332) 213 7898
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Electronic Inbound</h4>
                    <p className="text-xs text-slate-600 mt-1 font-semibold hover:text-emerald-600 transition">
                      <a href="mailto:support@taleem360.online">support@taleem360.online</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Office Hours</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Monday – Friday: 9:00 AM – 6:00 PM (PKT)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Vector Map of Cantt Karachi */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-md flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-black tracking-widest text-emerald-400 uppercase block mb-1">COORDINATE RADAR</span>
                <h3 className="text-base font-black text-white">Karachi Cantt Office Sandbox</h3>
              </div>

              {/* Vector design representing streets and pinpoint */}
              <div className="my-4 h-32 relative bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
                {/* Simulated Street grid */}
                <div className="absolute inset-0 opacity-15">
                  <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-white"></div>
                  <div className="absolute top-0 bottom-0 left-2/3 w-0.5 bg-white"></div>
                  <div className="absolute left-0 right-0 top-1/4 h-0.5 bg-white"></div>
                  <div className="absolute left-0 right-0 top-2/3 h-0.5 bg-white"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-emerald-500 rotate-12"></div>
                </div>

                {/* Pinpoint radar */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center animate-ping absolute"></div>
                  <div className="w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center relative border-2 border-white">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <span className="bg-emerald-900/90 border border-emerald-500/30 text-emerald-300 text-[8px] font-bold px-2 py-0.5 rounded-md mt-1 shadow-sm font-mono tracking-wider">
                    26/792 Cantt Bazar
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                <p className="leading-normal flex items-start gap-1">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Located at Cantt Bazar, Drigh Road, Karaci. Easily reachable via main airport artery.</span>
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
