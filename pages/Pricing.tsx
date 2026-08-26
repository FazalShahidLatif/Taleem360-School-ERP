import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, HelpCircle, ArrowRight, ShieldCheck, Sparkles, Building2, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SubscriptionTier } from '../types';
import { useAuth } from '../lib/auth';
import { useSEO } from '../lib/seo';

export const Pricing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);
  const [calculatorStudents, setCalculatorStudents] = useState<number>(150);

  useSEO({
    title: 'Taleem360 ERP Suite Pricing Plans - K-12 Cloud Portal',
    description: "Compare Taleem360 ERP Suite pricing plans for K-12 schools, colleges, and academies. Free 30-day Pilot, $49/mo Essential, $129/mo Professional, and custom Enterprise portals with automated timetables and financial ledgers.",
    keywords: 'taleem360 erp suite pricing plans, k-12 cloud portal pricing, school erp price, school management software cost, automated timetable generator pricing, attendance tracking software plans',
    canonicalUrl: 'https://www.taleem360.online/pricing',
    schemaMarkup: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Product',
          '@id': 'https://www.taleem360.online/pricing#product',
          name: 'Taleem360 Educational ERP Suite Subscription',
          description: 'Comprehensive K-12 and collegiate school management cloud subscription including timetable generation, biometric attendance, double-entry accounting, and report cards.',
          image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&h=630&q=80',
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'USD',
            lowPrice: '0',
            highPrice: '129',
            offerCount: '4',
            offers: [
              {
                '@type': 'Offer',
                name: 'Pilot Trial (30-day Free)',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                url: 'https://www.taleem360.online/onboarding',
                description: 'Free 30-day institutional pilot for evaluation with core SIS features.'
              },
              {
                '@type': 'Offer',
                name: 'Tier 1 Essential',
                price: '49',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                url: 'https://www.taleem360.online/pricing',
                description: 'Full ERP access for schools up to 200 active student profiles.'
              },
              {
                '@type': 'Offer',
                name: 'Tier 2 Professional',
                price: '129',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                url: 'https://www.taleem360.online/pricing',
                description: 'Advanced analytics, AI scheduling, and examination grading for up to 500 students.'
              },
              {
                '@type': 'Offer',
                name: 'Tier 3 Enterprise',
                price: 'Custom',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                url: 'https://www.taleem360.online/tickets',
                description: 'Multi-campus institutional governance for networks with 501+ students.'
              }
            ]
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            ratingCount: '520',
            reviewCount: '187'
          }
        },
        {
          '@type': 'FAQPage',
          '@id': 'https://www.taleem360.online/pricing#faq',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Can schools start with a free trial on Taleem 360?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Taleem 360 offers a 30-day full feature Pilot Trial with zero upfront payment or credit card requirement.'
              }
            },
            {
              '@type': 'Question',
              name: 'How are paid subscriptions activated?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Paid subscriptions require academic verification and manual activation by our institutional accounts team to ensure transparent governance and customized onboarding.'
              }
            }
          ]
        }
      ]
    }
  });

  // Auto-dismiss notification after 6 seconds
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const tiers = [
    {
      name: 'Pilot Trial',
      id: SubscriptionTier.PILOT,
      price: 'Free',
      description: '30-day free trial for evaluation. Upgrade required after 30 days.',
      features: [
        'School/College: Max 30 students (Grade 1-5, 5-10 years)',
        'Daycare Center: Max 10 students (under 5 years only)',
        'Vocational Training: Max 5 students (15+ years only)',
        'Private Tutor: Max 3-5 students limit',
        '30-day trial period expiration',
        'IP-based annual registration anti-abuse block',
      ],
      cta: 'Start for Free',
      mostPopular: false,
    },
    {
      name: 'Tier 1',
      id: SubscriptionTier.TIER_1,
      price: '$49',
      description: 'Ideal for growing primary schools.',
      features: [
        'Up to 200 active profiles',
        'Everything in Pilot',
        'Finance & Fee management',
        'Staff management',
        'Timetable management',
        'Priority email support',
      ],
      cta: 'Get Started',
      mostPopular: true,
    },
    {
      name: 'Tier 2',
      id: SubscriptionTier.TIER_2,
      price: '$129',
      description: 'Comprehensive features for mid-sized institutions.',
      features: [
        'Up to 500 active profiles',
        'Everything in Tier 1',
        'Examination module',
        'AI insights & analytics',
        'Parent portal access',
        'Online biometric attendance hardware integrations',
        'Digital report cards',
      ],
      cta: 'Get Started',
      mostPopular: false,
    },
    {
      name: 'Tier 3',
      id: SubscriptionTier.TIER_3,
      price: 'Custom',
      description: 'Enterprise grade solution for larger campuses.',
      features: [
        '501+ active profiles',
        'Everything in Tier 2',
        'Multi-school management',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantees',
      ],
      cta: 'Contact Sales',
      mostPopular: false,
    },
  ];

  return (
    <div className="space-y-12">
      {notification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-auto px-4 sm:px-6">
          <div className="bg-emerald-600 text-white rounded-2xl shadow-xl border border-emerald-500 p-4 relative flex items-center space-x-3 pr-10 animate-fade-in">
            <div className="bg-white/20 p-1.5 rounded-lg flex-shrink-0">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">Action Complete</p>
              <p className="text-xs text-emerald-100 mt-0.5">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
          Transparent K-12 &amp; Multi-Campus ERP Pricing
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl sm:tracking-tight lg:text-6xl tracking-tight">
          School Management Software &amp; ERP Pricing
        </h1>
        <p className="max-w-2xl mt-4 mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
          Predictable, transparent plans engineered for independent schools, college campuses, and multi-branch educational networks with zero hidden activation fees.
        </p>

        {/* Dynamic Plan Matcher for Commercial SERP Intent */}
        <div className="mt-10 max-w-xl mx-auto p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Instant Plan Recommender
            </span>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
              {calculatorStudents} Students
            </span>
          </div>
          <label className="block text-xs font-bold text-slate-300 mb-2">
            Select Your Total Active Student Enrollment:
          </label>
          <input 
            type="range" 
            min="10" 
            max="1000" 
            step="10"
            value={calculatorStudents}
            onChange={(e) => setCalculatorStudents(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
            <span>10 Students</span>
            <span>200 (Tier 1)</span>
            <span>500 (Tier 2)</span>
            <span>1000+ (Enterprise)</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold">Recommended Package:</p>
              <p className="text-base font-black text-emerald-400">
                {calculatorStudents <= 30 ? 'Pilot Trial (Free 30-Day Evaluation)' :
                 calculatorStudents <= 200 ? 'Tier 1 Essential ($49/mo)' :
                 calculatorStudents <= 500 ? 'Tier 2 Professional ($129/mo)' :
                 'Tier 3 Enterprise (Custom Multi-Campus)'}
              </p>
            </div>
            <Link 
              to="/onboarding"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              Start Pilot <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-x-8">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col ${
                tier.mostPopular ? 'ring-2 ring-indigo-600' : ''
              }`}
            >
              {tier.mostPopular && (
                <div className="absolute top-0 transform -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">{tier.price}</span>
                  {tier.price !== 'Custom' && tier.price !== 'Free' && (
                    <span className="ml-1 text-xl font-semibold">/month</span>
                  )}
                </p>
                <p className="mt-6 text-gray-500">{tier.description}</p>
 
                <ul className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex">
                      <Check className="flex-shrink-0 w-6 h-6 text-indigo-500" />
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => {
                  if (tier.id === SubscriptionTier.PILOT) {
                    setNotification({
                      type: 'info',
                      message: 'Pilot plan selected! Please head over to our Onboarding page to register your free 30-day pilot trial instantly.'
                    });
                    return;
                  }
                  
                  setNotification({
                    type: 'info',
                    message: `Direct online checkout is disabled. Paid subscriptions require manual approval and academic verification. Please contact the Super Admin at accts.pak@gmail.com to activate your ${tier.name} license.`
                  });
                }}
                className={`mt-8 w-full ${
                  tier.mostPopular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Multi-School Custom Subscription Notice Box */}
        <div id="multi-school-notice-box" className="mt-14 max-w-7xl mx-auto bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-2xl border border-slate-200/60 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-5">
            <div className="bg-indigo-600 text-white rounded-xl p-3 shadow-md flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Multi-School & Multi-Campus Networks</h4>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                For complete educational conglomerates and multi-campus institutes, a dedicated <strong>Custom Subscription Model</strong> is designed. This model can be negotiated directly before generating any binding contract, ensuring a customized budget alignment for your board of directors.
              </p>
              <div className="mt-4 flex items-center space-x-2 text-xs font-semibold text-indigo-700">
                <span className="bg-indigo-100 px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider">Note</span>
                <span>All paid licenses are issued manually following verification of academic credentials. Please connect with our super-admin desk at accts.pak@gmail.com.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Feature Comparison Table (GEO/LLM Structured Data Node) */}
        <div className="mt-20 max-w-7xl mx-auto bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-8 sm:px-10 border-b border-slate-200 bg-slate-50">
            <h3 className="text-2xl font-black text-slate-900">Comprehensive Plan Feature Comparison Matrix</h3>
            <p className="text-sm text-slate-500 mt-2">
              Compare all administrative modules, limits, security metrics, and support SLAs side-by-side to find the ultimate fit for your institution.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50/70 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Capability / Module</th>
                  <th scope="col" className="px-6 py-4">Pilot (Free)</th>
                  <th scope="col" className="px-6 py-4">Tier 1 ($49/mo)</th>
                  <th scope="col" className="px-6 py-4">Tier 2 ($129/mo)</th>
                  <th scope="col" className="px-6 py-4">Tier 3 (Custom/Enterprise)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-800">Max Student Directory Capacity</td>
                  <td className="px-6 py-4 text-slate-600">Up to 100 active profiles</td>
                  <td className="px-6 py-4 text-indigo-600 font-semibold">Up to 200 active profiles</td>
                  <td className="px-6 py-4 text-indigo-600 font-semibold">Up to 500 active profiles</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">501+ active profiles</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-800">Daily Attendance Log Portal</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">Included (Basic)</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">Included (With Reports)</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">Included (+Parent Alerts)</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">Included (Multi-Campus Sync)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-800">C-Suite Accounting & Ledgers</td>
                  <td className="px-6 py-4 text-slate-400">Unavailable</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">Included (Double-Entry)</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">Included (With Audits)</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">Included (Dedicated Ledger Keys)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-800">Gradebook Templates & Cards</td>
                  <td className="px-6 py-4 text-slate-400">Unavailable</td>
                  <td className="px-6 py-4 text-slate-600">Standard grading scale</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">Included (+Report cards pdf)</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">Included (Fully Custom Formats)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-800">Library & Catalog Fines</td>
                  <td className="px-6 py-4 text-slate-400">Unavailable</td>
                  <td className="px-6 py-4 text-slate-400">Unavailable</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">Included (Overdue automation)</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">Included (RFID & Custom systems)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-800">Security & Backup Protocols</td>
                  <td className="px-6 py-4 text-slate-600">Weekly Backups</td>
                  <td className="px-6 py-4 text-indigo-600 font-semibold">Continuous Backups + SSL</td>
                  <td className="px-6 py-4 text-indigo-600 font-semibold">Continuous + Custom Admin Keys</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">Dedicated Database Replication</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-800">Support SLAs</td>
                  <td className="px-6 py-4 text-slate-500">Standard Email Support</td>
                  <td className="px-6 py-4 text-indigo-600 font-semibold">Priority Email (24-Hr SLA)</td>
                  <td className="px-6 py-4 text-indigo-600 font-semibold">24/7 Chat & Dedicated Help</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">Dedicated Onboarding Account Manager</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic & Transparent Checkout Compliance Banner */}
        <div className="mt-12 max-w-5xl mx-auto rounded-2xl p-5 border border-slate-200 bg-white/60 backdrop-blur-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Direct Portal Authorization</p>
              <p className="text-xs text-slate-500">Secure subscription provisioning processed directly within the school node dashboard. All activation flows are completely end-to-end encrypted.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">REFUND PLEDGE AVAILABLE</span>
            <span className="text-xs text-slate-400">|</span>
            <Link to="/refund-policy" className="text-xs text-indigo-600 font-bold hover:underline">Read Refund Rules</Link>
          </div>
        </div>

        {/* Dedicated Vertical Solutions Interlinks */}
        <div className="mt-20 max-w-5xl mx-auto border-t border-slate-200 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Looking for Specialized Institution Solutions?
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Explore dedicated features customized for your specific institutional format.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/daycare"
              className="p-5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all group block text-left"
            >
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Early Childhood &amp; Daycare App →
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Nap logs, diaper charts, pickup PINs, and automated guardian invoices for nurseries.
              </p>
            </Link>

            <Link
              to="/madrasa"
              className="p-5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all group block text-left"
            >
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Islamic Seminaries &amp; Madrasa ERP →
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Hifz Sabaq/Sabqi progress logs, hostel beds, Waqf donations, and Zakat ledger records.
              </p>
            </Link>

            <Link
              to="/skills-academy"
              className="p-5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all group block text-left"
            >
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Coaching &amp; Skills Academies →
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Batch timetables, instructor revenue splitting, and computerized course certificates.
              </p>
            </Link>

            <Link
              to="/private-tutors"
              className="p-5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all group block text-left"
            >
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Private Tutors &amp; Solo Educators →
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Hourly student billing, slot scheduling, and direct WhatsApp payment reminders.
              </p>
            </Link>

            <Link
              to="/white-label"
              className="p-5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all group block text-left"
            >
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                White Label Resellers &amp; Agencies →
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Launch your own SaaS EdTech brand with custom domains, subdomains, and tailored portals.
              </p>
            </Link>

            <Link
              to="/free-resources"
              className="p-5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all group block text-left"
            >
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Free Downloadable Worksheets &amp; Syllabi →
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                100% free downloadable phonics tracers, math workbooks, and syllabus guides.
              </p>
            </Link>
          </div>
        </div>

        {/* Comprehensive Pricing FAQs (Solves Thin Content and drives LLM/GEO Citations) */}
        <div className="mt-24 max-w-5xl mx-auto border-t border-slate-200 pt-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Interactive Pricing & Local SEO Billing FAQs</h2>
            <p className="text-sm text-slate-500 mt-2">Get answers about our school management software price Pakistan options, mobile integration, and fee collection modules.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="p-6 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
              <h4 className="font-bold text-slate-900">What is the typical school management software price in Pakistan?</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Taleem360 offers highly competitive setups with clear monthly rates. Our school software price per month Pakistan options scale from our free Pilot tier to premium enterprise brackets, ensuring every campus gets elite database tools with zero hidden licensing charges.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
              <h4 className="font-bold text-slate-900">Is there a free school management software Pakistan tier available?</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Yes, our Pilot tier is a completely free school management software Pakistan platform. It supports up to 100 student profiles and includes daily attendance sheets, grade structures, and parent notifications to support startups and low-income community branches.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
              <h4 className="font-bold text-slate-900">How does Taleem360 manage online fee collection and challans?</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Our premium school fee management software Pakistan module automates the generation of computerised school fee challans with dynamic barcodes. We support comprehensive online fee collection for school Pakistan platforms, connecting with major banking networks.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
              <h4 className="font-bold text-slate-900">Are JazzCash, EasyPaisa, and WhatsApp alerts supported?</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Absolutely! Parents can deposit dues via JazzCash school fee payment integration or Easypaisa school fee collection software. Once payment is processed, the system triggers real-time school fee reminders via WhatsApp to parent devices.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 text-center">
          <p className="text-gray-500">
            All prices are in USD. Need a custom plan? <Link to="/tickets" className="text-indigo-600 font-medium hover:text-indigo-500">Talk to us</Link>.
          </p>
        </div>
    </div>
  );
};
