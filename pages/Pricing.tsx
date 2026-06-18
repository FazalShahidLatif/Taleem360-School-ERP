import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SubscriptionTier } from '../types';
import { useAuth } from '../lib/auth';
import { openCheckout } from '../lib/paddle';

export const Pricing: React.FC = () => {
  const { user } = useAuth();
  const [notification, setNotification] = React.useState<{ type: 'success' | 'info'; message: string } | null>(null);

  React.useEffect(() => {
    document.title = 'Taleem360 ERP Suite Pricing Plans - K-12 Cloud Portal';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Choose the perfect Taleem360 pricing package for your institute. Pilot plan is free, with Premium Tier 1 and Tier 2 plans offering K-12 gradebook software, cashless billing, attendance, and support.');

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', 'https://taleem360.online/pricing');
  }, []);

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
      name: 'Pilot',
      id: SubscriptionTier.PILOT,
      price: 'Free',
      description: 'Perfect for small schools or testing the platform.',
      features: [
        'Up to 30 students',
        'Basic student management',
        'Attendance tracking',
        'Class management',
        'Standard support',
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
        'Up to 200 students',
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
      price: '$99',
      description: 'Comprehensive features for mid-sized institutions.',
      features: [
        'Up to 450 students',
        'Everything in Tier 1',
        'Examination module',
        'AI insights & analytics',
        'Parent portal access',
        '24/7 Chat support',
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
        'Up to 1000 students',
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
        <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Pricing</h2>
        <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Plans for every school size
        </p>
        <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
          Choose the perfect plan to streamline your school operations and enhance learning experiences.
        </p>
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
                  const priceIds: Record<string, string> = {
                    [SubscriptionTier.PILOT]: 'pri_pilot_123',
                    [SubscriptionTier.TIER_1]: 'pri_tier1_456',
                    [SubscriptionTier.TIER_2]: 'pri_tier2_789',
                    [SubscriptionTier.TIER_3]: 'pri_tier3_012'
                  };
                  if (tier.id === SubscriptionTier.PILOT) {
                    setNotification({
                      type: 'info',
                      message: 'Pilot plan selected. This is our Free plan containing all essential administrative rosters setup and timetable controls.'
                    });
                    return;
                  }
                  if (tier.id === SubscriptionTier.TIER_3) {
                    setNotification({
                      type: 'info',
                      message: 'Enterprise proposal requested. Our sales team has received a notification and will connect with your academic director within 2 hours.'
                    });
                    return;
                  }
                  openCheckout(priceIds[tier.id], user?.email || '', () => {
                    setNotification({
                      type: 'success',
                      message: `Congratulations! Your payment authorized successfully. You are now subscribed to the Taleem360 ${tier.name} Package.`
                    });
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
        <div id="multi-school-notice-box" className="mt-14 max-w-4xl mx-auto bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-2xl border border-slate-200/60 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-5">
            <div className="bg-indigo-600 text-white rounded-xl p-3 shadow-md flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Multi-School & Multi-Campus Networks</h4>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                For complete educational conglomerates and multi-campus institutes, a dedicated <strong>Custom Subscription Model</strong> is designed. This model can be negotiated directly before generating any binding contract or charging any subscription fee, ensuring a customized budget alignment for your board of directors.
              </p>
              <div className="mt-4 flex items-center space-x-2 text-xs font-semibold text-indigo-700">
                <span className="bg-indigo-100 px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider">Note</span>
                <span>Single-campus institutions with up to 1000 active student records can instantly subscribe online to Tier 3.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            All prices are in USD. Need a custom plan? <Link to="/tickets" className="text-indigo-600 font-medium hover:text-indigo-500">Talk to us</Link>.
          </p>
        </div>
    </div>
  );
};
