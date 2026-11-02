/**
 * PublicAIChatbot - consent-gated, lead-capture AI assistant for Taleem360.
 *
 * Free-tier (zero-cost) design (mandate: BUILD -> EARN -> INVEST).
 *
 * Flow (answer first, ask second):
 *   1. Greeting.
 *   2. User asks -> free Solar model answers via /api/ai/chat-free.
 *      Quick-reply chips guide the conversation.
 *   3. Intent detection: when pricing / pilot / buying shows, offer a
 *      low-friction capture form (school, students, email, contact, time).
 *   4. On capture, POST to /api/leads/quote for the Taleem360 Leads sheet.
 *      Never blocks on webhook failure; failures are reported honestly.
 *
 * CONSENT GATING (mandate: no false structured data; GDPR-style consent):
 *   - General knowledge works without consent.
 *   - Personalised questions (pricing, pilot, buy, support) require consent to
 *     the Privacy Policy & Terms of Service. Flag stored in localStorage and
 *     forwarded to /api/ai/chat-free.
 */
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Bot, X, Minimize2, Send, AlertCircle } from 'lucide-react';

export interface QuickReply {
  label: string;
  intent: 'info' | 'pricing' | 'pilot' | 'buy' | 'support' | 'other';
  emoji?: string;
}

export interface LeadCaptureStep {
  key: 'origin' | 'students' | 'email' | 'contact' | 'time' | 'submit';
  label: string;
  question: string;
  placeholder: string;
  type: 'radio' | 'text' | 'email' | 'number' | 'select';
  options?: string[];
}

export function useConsent(): [boolean, () => void, () => void] {
  const [consented, setConsented] = useState<boolean>(() => {
    try { return localStorage.getItem('taleem360-consent') === 'yes'; } catch { return false; }
  });
  const consent = () => {
    try { localStorage.setItem('taleem360-consent', 'yes'); } catch { /* noop */ }
    setConsented(true);
  };
  const revoke = () => {
    try { localStorage.removeItem('taleem360-consent'); } catch { /* noop */ }
    setConsented(false);
  };
  return [consented, consent, revoke];
}

export const PublicAIChatbot: React.FC = () => {
  const [consented, consent, revoke] = useConsent();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [botMessages, setBotMessages] = useState<{ id: string; text: string }[]>([
    { id: 'greeting', text: 'Hello! I\'m Taleem360\'s free AI assistant — 24/7, zero-cost. Ask me about features, pricing, modules, or the pilot.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [leadStep, setLeadStep] = useState<LeadCaptureStep | null>(null);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConsent, setShowConsent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { scrollToBottom(); }, [botMessages, leadStep, leadSubmitted]);

  const QUICK_REPLIES: QuickReply[] = [
    { label: 'Pricing', intent: 'pricing', emoji: '₹' },
    { label: 'Free pilot', intent: 'pilot', emoji: '🚀' },
    { label: 'Features', intent: 'info', emoji: '📋' },
    { label: 'Support', intent: 'support', emoji: '🛠️' },
    { label: 'About', intent: 'info', emoji: 'ℹ️' },
  ];

  const stepsFor = (intent: QuickReply['intent']): LeadCaptureStep[] => {
    const base: LeadCaptureStep[] = [
      { key: 'origin', label: 'Where are you based?', question: 'Are you a US-based school or based outside the US?', placeholder: 'Select…', type: 'radio', options: ['USA', 'Outside USA'] },
      { key: 'students', label: 'Approx. number of students', question: 'How many active student profiles do you have now?', placeholder: 'e.g. 1200', type: 'number' },
      { key: 'email', label: 'Email', question: 'What\'s the best email to reach you?', placeholder: 'you@example.com', type: 'email' },
      { key: 'contact', label: 'Contact method', question: 'How would you prefer we reach you?', placeholder: 'Email / WhatsApp / Call', type: 'select', options: ['Email', 'WhatsApp', 'Call'] },
      { key: 'time', label: 'Preferred time', question: 'Best time for us to reach out?', placeholder: 'e.g. weekday mornings', type: 'text' },
      { key: 'submit', label: 'Request a quote', question: 'Send me a tailored quote — no obligation, free pilot available.', placeholder: 'Your full name', type: 'text' },
    ];
    // non-pricing: drop the price-specific fields but keep a short capture.
    if (intent === 'info' || intent === 'support') {
      return base.slice(0, 4);
    }
    return base;
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    setError(null);
    const botId = `b-${Date.now()}`;
    setBotMessages(prev => [...prev, { id: botId, text: 'Thinking…' }]);
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/chat-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, userIntent: detectIntent(text), consentGiven: consented }),
      });
      const data = await res.json().catch(() => ({}));
      setBotMessages(prev => prev.map(m => m.id === botId ? { id: botId, text: (data.answer || 'I\'m not sure I understood that. Could you rephrase?') } : m));
      if (data.intent === 'pricing' || data.intent === 'pilot' || data.intent === 'buy' || data.intent === 'support') {
        setLeadStep(stepsFor(data.intent)[0]);
        setBotMessages(prev => prev.map(m => m.id === botId ? { id: botId, text: (data.answer || 'Great — tell me a little about your school so I can point you to the right plan.') } : m))
        setShowConsent(false);
      } else {
        setLeadStep(null);
      }
      if (data.leadCaptureNeeded) {
        setBotMessages(prev => prev.map(m => m.id === botId ? { id: botId, text: (data.leadCaptureMessages || data.answer || 'Let me help you get started.').slice(0, 400) } : m))
      }
    } catch (err: any) {
      console.error('[PublicAIChatbot] AI error:', err);
      setBotMessages(prev => prev.map(m => m.id === botId ? { id: botId, text: 'Sorry — I hit a snag. Please email support@taleem360.online and we will help.' } : m))
      setError('The assistant is temporarily unavailable. Please email support@taleem360.online');
    } finally {
      setIsLoading(false);
      if (!leadStep) setError(null);
    }
  };

  const detectIntent = (text: string): QuickReply['intent'] => {
    const t = text.toLowerCase();
    if (t.includes('pilot') || t.includes('free')) return 'pilot';
    if (t.includes('buy') || t.includes('start') || t.includes('subscribe') || t.includes('price') || t.includes('49') || t.includes('dollar')) return 'buy';
    if (t.includes('support') || t.includes('help') || t.includes('problem') || t.includes('issue')) return 'support';
    if (t.includes('price') || t.includes('quote') || t.includes('cost')) return 'pricing';
    return 'info';
  };

  const updateForm = (key: string, value: string) => setFormValues(prev => ({ ...prev, [key]: value }));

  const nextStep = () => {
    if (!leadStep) return;
    const keys = stepsFor(leadStep.key ?? 'info').map(s => s.key);
    const i = keys.indexOf(leadStep.key);
    setLeadStep(stepsFor(leadStep.key ?? 'info')[i + 1] || null);
  };

  const submitLead = async () => {
    if (!leadStep) return;
    const required = ['origin', 'email', 'students', 'contact', 'submit'];
    const missing = required.filter(k => !formValues[k]);
    if (missing.length) { setError('Please complete: ' + missing.join(', ') + '.'); return; }
    const payload = {
      leadSource: 'public-chat',
      formType: /^\d+$/.test(formValues.students || '') ? 'quote' : 'contact',
      institutionName: formValues.students ? `School with ${formValues.students} student profiles` : formValues.origin,
      contactName: formValues['submit'] || formValues.origin || '',
      email: formValues.email || '',
      phone: '',
      country: formValues.origin === 'USA' ? 'US' : 'PK',
      city: formValues.time || '',
      institutionType: 'School group / multi-campus',
      studentCount: formValues.students || '',
      campusCount: '',
      currentSystem: '',
      message: formValues.contact === 'WhatsApp' ? 'Prefers WhatsApp' : (formValues.time ? `Contact: ${formValues.contact}; preferred time: ${formValues.time}` : 'Contact: ' + formValues.contact),
      whiteLabel: false,
    };
    try {
      const res = await fetch('/api/leads/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (data.ok) { setLeadSubmitted(true); setLeadStep(null); setError(null); }
      else { setError(data.detail || 'Could not save your enquiry. Please email support@taleem360.online instead.'); }
    } catch (e: any) { setError('Could not save your enquiry. Please email support@taleem360.online instead.'); }
  };

  const stepList = leadStep ? stepsFor(leadStep.key ?? 'info') : [];
  const stepIdx = leadStep ? stepList.findIndex(s => s.key === leadStep.key) : -1;
  const isLast = leadStep ? stepIdx === stepList.length - 1 : false;
  const currentStep = leadStep ? stepList[stepIdx] : null;

  const StepForm: React.FC = () => {
    if (!currentStep) return null;
    const renderInput = () => {
      if (currentStep.type === 'radio') return <div className="flex gap-3">{currentStep.options!.map(opt => <label key={opt} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer"><input type="radio" name="origin" value={opt} checked={formValues['origin'] === opt} onChange={() => updateForm('origin', opt)} className="accent-indigo-600" />{opt}</label>)}</div>;
      if (currentStep.type === 'select') return <select value={formValues[currentStep.key] || ''} onChange={e => updateForm(currentStep.key, e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"><option value="">{currentStep.placeholder}</option>{currentStep.options!.map(o => <option key={o} value={o}>{o}</option>)}</select>;
      return <input value={formValues[currentStep.key] || ''} onChange={e => updateForm(currentStep.key, e.target.value)} placeholder={currentStep.placeholder} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white" />;
    };
    return (
      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-700">{currentStep.question}</label>
        {renderInput()}
        <div className="flex gap-2">
          {isLast ? <button onClick={submitLead} className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700">Send</button> :
            <><button onClick={nextStep} className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700">Next</button><button type="button" onClick={nextStep} className="text-xs text-gray-500 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50">Skip</button></>}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {!isOpen ? (
        <div className="relative group/btn">
          <button onClick={() => { setIsOpen(true); if (!consented && !leadSubmitted) setShowConsent(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center justify-center group" aria-label="Open AI assistant">
            <Sparkles className="w-6 h-6 mr-2 group-hover:animate-pulse" />
            <span className="font-semibold text-sm">Ask AI</span>
          </button>
          <button type="button" onClick={() => setIsOpen(false)} className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white p-1 rounded-full shadow-md invisible group-hover/btn:visible hover:scale-110 transition-all flex items-center justify-center" title="Dismiss"><X className="w-3 h-3" /></button>
        </div>
      ) : (
        <>
          <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 ${isMinimized ? 'h-16 w-72' : 'h-[480px] w-96'}`}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-slate-700 rounded-t-2xl text-white">
              <div className="flex items-center gap-2.5">
                <div className="bg-white/20 p-1.5 rounded-lg"><Bot className="w-5 h-5" /></div>
                <div><h3 className="font-bold text-sm tracking-tight">Taleem360 AI</h3><p className="text-[10px] text-indigo-100">Free · 24/7 · Answers wait</p></div>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-medium text-indigo-200 bg-white/10 px-2 py-0.5 rounded-full"><Sparkles className="w-3 h-3" /> free-tier</span>
                <button onClick={() => setIsMinimized(!isMinimized)} className="hover:bg-white/10 p-1 rounded transition-colors" aria-label="Minimize"><Minimize2 className="w-4 h-4" /></button>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors" aria-label="Close"><X className="w-4 h-4" /></button>
              </div>
            </div>
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/40">
                  {botMessages.map(msg => <div key={msg.id} className={`flex ${msg.id.startsWith('u-') ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.id.startsWith('u-') ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>{msg.text}</div></div>)}
                  {isLoading && <div className="flex justify-start"><div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.15s]" /><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.3s]" /></div></div>}
                  {error && <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-2 mx-1">{error}</div>}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
                  <div className="relative flex gap-2">
                    <input value={input} onChange={e => { setInput(e.target.value); if (error) setError(null); }} placeholder="Ask about pricing, pilot, features…" className="flex-1 min-w-0 px-4 py-3 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white placeholder:text-gray-400" disabled={isLoading} />
                    <button type="submit" disabled={!input.trim() || isLoading} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors" aria-label="Send"><Send className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">{QUICK_REPLIES.map(q => <button key={q.intent} type="button" onClick={() => { setInput(q.label); handleSend(); }} className="text-[11px] bg-gray-100 hover:bg-indigo-50 text-gray-700 border border-gray-200 hover:border-indigo-300 px-2.5 py-1.5 rounded-xl transition-colors">{q.emoji} {q.label}</button>)}</div>
                  <p className="text-[9px] text-gray-400 mt-2 text-center">Free-tier AI · answers may be delayed during peak</p>
                </form>
              </>
            )}
          </div>

          {currentStep && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setLeadStep(null)}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-3"><h4 className="text-sm font-bold text-gray-800">Request a quote</h4><button onClick={() => setLeadStep(null)} className="text-gray-400 hover:text-gray-700" aria-label="Close"><X className="w-4 h-4" /></button></div>
                <StepForm />
                <p className="text-[10px] text-gray-400 mt-3 text-center">We will reply within 1 business day. No spam, ever.</p>
              </div>
            </div>
          )}

          {(!consented && !leadSubmitted) && (
            <div className="fixed bottom-24 right-6 z-50 w-80 bg-white border border-amber-200 rounded-2xl shadow-xl p-4 text-sm text-amber-800">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-amber-900">Privacy & consent</p>
                  <p className="text-[11px] text-amber-700 mt-0.5">Personal questions (pricing, pilot, support) need your consent. Accept our <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a> &amp; <a href="/terms" className="underline underline-offset-2">Terms of Service</a>.</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={consent} className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors">I accept</button>
                    <button onClick={() => setShowConsent(false)} className="text-xs text-amber-700 border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors">Maybe later</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PublicAIChatbot;
