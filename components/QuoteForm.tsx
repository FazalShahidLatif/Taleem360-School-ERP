import React, { useState } from 'react';
import { Check } from 'lucide-react';

/**
 * Quote request form for the in-app pricing screen.
 *
 * Posts to /api/leads/quote, the same endpoint the prerendered form on
 * /pricing uses, so both paths deliver into the same pipeline.
 *
 * Deliberately does NOT report success optimistically. The contact form this
 * replaces faked its submission with a setTimeout and threw every enquiry away.
 * If the endpoint cannot deliver, the visitor is told so and given an address
 * that works — a school that believes it has been heard and never hears back is
 * a lost customer, and a worse outcome than a visible failure.
 */

interface QuoteFormState {
  institutionName: string;
  institutionType: string;
  studentCount: string;
  campusCount: string;
  country: string;
  city: string;
  contactName: string;
  phone: string;
  email: string;
  currentSystem: string;
  message: string;
  whiteLabel: boolean;
  website: string; // honeypot — humans never see it
}

const INSTITUTION_TYPES = [
  'K-12 school',
  'School group / multi-campus',
  'Madrasa',
  'Daycare / early years',
  'Academy / vocational training',
  'Private tutor',
  'Other',
];

const EMPTY: QuoteFormState = {
  institutionName: '',
  institutionType: INSTITUTION_TYPES[0],
  studentCount: '',
  campusCount: '',
  country: '',
  city: '',
  contactName: '',
  phone: '',
  email: '',
  currentSystem: '',
  message: '',
  whiteLabel: false,
  website: '',
};

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500';
const labelClass = 'block text-xs font-bold text-slate-700 mb-1.5';

export const QuoteForm: React.FC = () => {
  const [form, setForm] = useState<QuoteFormState>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = <K extends keyof QuoteFormState>(key: K, value: QuoteFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    const missing: string[] = [];
    if (!form.institutionName.trim()) missing.push('school or institution name');
    if (!form.contactName.trim()) missing.push('your name');
    if (!form.email.trim()) missing.push('email');
    if (!form.studentCount.trim()) missing.push('number of active students');
    if (missing.length) {
      setStatus('error');
      setError(`Please provide: ${missing.join(', ')}.`);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      setStatus('error');
      setError('Please enter a valid email address.');
      return;
    }

    setStatus('sending');
    setError('');

    try {
      const res = await fetch('/api/leads/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, whiteLabel: form.whiteLabel }),
      });
      const body = await res.json().catch(() => ({}));

      if (res.ok && body?.ok) {
        setStatus('sent');
        setForm(EMPTY);
        return;
      }

      setStatus('error');
      setError(
        body?.detail ||
          'We could not send your request. Please email support@taleem360.online and we will reply directly.'
      );
    } catch {
      setStatus('error');
      setError('Network error. Please email support@taleem360.online and we will reply directly.');
    }
  };

  if (status === 'sent') {
    return (
      <div className="mt-6 max-w-2xl rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <div className="flex items-start gap-3">
          <div className="bg-emerald-600 text-white rounded-lg p-1.5 flex-shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-900">Request received</h4>
            <p className="mt-1 text-sm text-emerald-800">
              We will review your school's numbers and reply by email with a quote, usually within one
              working day. Invoiced in your local currency — PKR, AED, SAR, BDT, NGN or USD.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-2xl" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <div className="mb-4">
          <label className={labelClass} htmlFor="qf-institution">
            School or institution name <span aria-hidden="true">*</span>
          </label>
          <input
            id="qf-institution"
            className={inputClass}
            value={form.institutionName}
            onChange={(e) => set('institutionName', e.target.value)}
            maxLength={200}
            autoComplete="organization"
          />
        </div>
        <div className="mb-4">
          <label className={labelClass} htmlFor="qf-type">
            Institution type
          </label>
          <select
            id="qf-type"
            className={inputClass}
            value={form.institutionType}
            onChange={(e) => set('institutionType', e.target.value)}
          >
            {INSTITUTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className={labelClass} htmlFor="qf-students">
            Active student profiles <span aria-hidden="true">*</span>
          </label>
          <input
            id="qf-students"
            type="number"
            min={1}
            max={200000}
            inputMode="numeric"
            placeholder="e.g. 450"
            className={inputClass}
            value={form.studentCount}
            onChange={(e) => set('studentCount', e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className={labelClass} htmlFor="qf-campuses">
            Number of campuses
          </label>
          <input
            id="qf-campuses"
            type="number"
            min={1}
            max={500}
            inputMode="numeric"
            placeholder="e.g. 2"
            className={inputClass}
            value={form.campusCount}
            onChange={(e) => set('campusCount', e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className={labelClass} htmlFor="qf-country">
            Country
          </label>
          <input
            id="qf-country"
            className={inputClass}
            value={form.country}
            onChange={(e) => set('country', e.target.value)}
            maxLength={80}
            autoComplete="country-name"
          />
        </div>
        <div className="mb-4">
          <label className={labelClass} htmlFor="qf-city">
            City
          </label>
          <input
            id="qf-city"
            className={inputClass}
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
            maxLength={80}
            autoComplete="address-level2"
          />
        </div>
        <div className="mb-4">
          <label className={labelClass} htmlFor="qf-name">
            Your name <span aria-hidden="true">*</span>
          </label>
          <input
            id="qf-name"
            className={inputClass}
            value={form.contactName}
            onChange={(e) => set('contactName', e.target.value)}
            maxLength={120}
            autoComplete="name"
          />
        </div>
        <div className="mb-4">
          <label className={labelClass} htmlFor="qf-phone">
            Phone or WhatsApp
          </label>
          <input
            id="qf-phone"
            type="tel"
            className={inputClass}
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            maxLength={40}
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className={labelClass} htmlFor="qf-email">
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="qf-email"
          type="email"
          className={inputClass}
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          maxLength={200}
          autoComplete="email"
        />
      </div>

      <div className="mb-4">
        <label className={labelClass} htmlFor="qf-current">
          What do you use today?
        </label>
        <input
          id="qf-current"
          className={inputClass}
          value={form.currentSystem}
          onChange={(e) => set('currentSystem', e.target.value)}
          maxLength={200}
          placeholder="Spreadsheets, another ERP, paper registers…"
        />
      </div>

      <div className="mb-4">
        <label className={labelClass} htmlFor="qf-message">
          Anything else we should know?
        </label>
        <textarea
          id="qf-message"
          rows={4}
          className={`${inputClass} min-h-[96px]`}
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          maxLength={2000}
        />
      </div>

      <div className="mb-4 flex items-start gap-3">
        <input
          id="qf-white-label"
          type="checkbox"
          className="mt-1 h-4 w-4 flex-shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          checked={form.whiteLabel}
          onChange={(e) => set('whiteLabel', e.target.checked)}
        />
        <label htmlFor="qf-white-label" className="text-sm text-slate-700">
          I am interested in <strong>white label</strong> — running the platform under our own brand and
          domain.
        </label>
      </div>

      {/* Honeypot: hidden from humans and assistive tech. Bots fill it. */}
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="qf-website">Website</label>
        <input
          id="qf-website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => set('website', e.target.value)}
        />
      </div>

      <p className="text-xs text-slate-500 mb-3">
        We reply with a quote by email. Your details are used only to prepare that quote.
      </p>

      {status === 'error' && error && (
        <p role="status" aria-live="polite" className="mb-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-progress transition-colors"
      >
        {status === 'sending' ? 'Sending…' : 'Request a quote'}
      </button>
    </form>
  );
};

export default QuoteForm;
