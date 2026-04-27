import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SubscriptionTier } from '../types';
import { useAuth } from '../lib/auth';
import { openCheckout } from '../lib/paddle';

export const Pricing: React.FC = () => {
  const { user } = useAuth();
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
        'Up to 500 students',
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
      description: 'Enterprise-grade solution for large school networks.',
      features: [
        'Unlimited students',
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
                    alert('Pilot plan selected. This is a free plan.');
                    return;
                  }
                  openCheckout(priceIds[tier.id], user?.email || '', () => {
                    alert(`Successfully subscribed to ${tier.name}!`);
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

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            All prices are in USD. Need a custom plan? <a href="#" className="text-indigo-600 font-medium hover:text-indigo-500">Talk to us</a>.
          </p>
        </div>
    </div>
  );
};
