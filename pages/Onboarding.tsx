import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import api from '../lib/api';
import { SubscriptionTier, SchoolType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  School as SchoolIcon, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  CreditCard,
  Rocket,
  Zap,
  Building2,
  Award
} from 'lucide-react';
import { Footer } from '../components/Footer';
import { analytics } from '../lib/analytics';
import { useSEO } from '../lib/seo';

export const Onboarding: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    school_name: '',
    address: '',
    phone: '',
    plan: SubscriptionTier.PILOT,
    institution_type: SchoolType.SCHOOL_COLLEGE,
    client_ip: ''
  });

  useSEO({
    title: 'Establish Your School Cloud Portal | Taleem360 Onboarding',
    description: "Initiate your custom institutional subdomain, configure your initial database repository, and select your subscription tier to access Taleem360.",
    keywords: 'establish your school cloud portal, taleem360 onboarding, school registration, institutional cloud setup, school erp cloud pilot, k12 onboarding',
    canonicalUrl: 'https://www.taleem360.online/onboarding',
    schemaMarkup: {
      '@type': 'WebPage',
      name: 'Establish Your School Cloud Portal | Taleem360 Onboarding',
      description: 'Institutional onboarding workflow to provision a dedicated school database and select deployment tier.',
      url: 'https://www.taleem360.online/onboarding',
      potentialAction: {
        '@type': 'RegisterAction',
        target: 'https://www.taleem360.online/onboarding',
        name: 'Provision School Cloud Instance'
      }
    }
  });

  useEffect(() => {
    if (user?.onboarded) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Fetch public client IP for anti-abuse 365-day tracking
    const fetchIp = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      try {
        const response = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
        const data = await response.json();
        if (data && data.ip) {
          setFormData(prev => ({ ...prev, client_ip: data.ip }));
          clearTimeout(timeoutId);
          return;
        }
      } catch (err) {
        console.warn('Failed to retrieve public IP address, falling back to persistent client footprint.', err);
      } finally {
        clearTimeout(timeoutId);
      }
      
      // Fallback
      let fingerprint = localStorage.getItem('t360_device_fingerprint');
      if (!fingerprint) {
        fingerprint = 'fp-' + Math.random().toString(36).substring(2, 15) + '-' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('t360_device_fingerprint', fingerprint);
      }
      setFormData(prev => ({ ...prev, client_ip: fingerprint }));
    };
    fetchIp();
  }, []);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handlePlanSelect = (plan: SubscriptionTier) => {
    setFormData({ ...formData, plan });
    handleNext();
  };

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    setError(null);
    try {
      // Subscriptions are managed manually by the Super Admin after approval.
      
      const res = await api.post('/onboard/', formData);
      
      // Dispatch conversion analytics signal
      analytics.trackEvent('lead_submission', 'complete_onboarding', formData.school_name);
      
      // Re-login to update the user object with the new token
      // In our mock, the onboard endpoint returns the new token data
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      
      // Refresh user state and navigate
      refreshUser();
      navigate('/');
    } catch (err: any) {
      const detail = err.response?.data?.detail || err.message || 'Failed to complete onboarding';
      setError(detail);
      setLoading(false);
    }
  };

  const handlePayment = (plan: SubscriptionTier) => {
    if (plan === SubscriptionTier.PILOT) {
      // Free plan, skip payment
      handlePlanSelect(plan);
      return;
    }

    alert(`Direct paid onboarding for ${plan} is restricted on this workspace. Please select the 'Pilot Trial' for a free 30-day evaluation, or contact accts.pak@gmail.com to request manual activation & administrative approval.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-400 border border-gray-200'
                  }`}>
                    {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                  </div>
                  <span className={`text-xs mt-2 font-bold uppercase tracking-wider ${step >= s ? 'text-indigo-600' : 'text-gray-400'}`}>
                    {s === 1 ? 'School Info' : s === 2 ? 'Select Plan' : 'Confirmation'}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: '0%' }}
                animate={{ width: `${((step - 1) / 2) * 100}%` }}
                className="h-full bg-indigo-600"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100"
              >
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Taleem360</h1>
                  <p className="text-gray-500">Let's set up your school profile to get started.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">School Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SchoolIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.school_name}
                        onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                        className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="e.g. International School of Excellence"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Street, City, Country"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Institution Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { type: SchoolType.SCHOOL_COLLEGE, label: 'School / College', desc: 'Max 30 students limit. Grade 1-5 (age 5-10 years only)' },
                        { type: SchoolType.DAYCARE, label: 'Daycare Center', desc: 'Max 10 students limit. Age under 5 years only' },
                        { type: SchoolType.VOCATIONAL, label: 'Vocational Training', desc: 'Max 5 students limit. Age 15+ years only' },
                        { type: SchoolType.PRIVATE_TUTOR, label: 'Private Tutor', desc: 'Max 3-5 students limit. No age restrictions' },
                      ].map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => setFormData({ ...formData, institution_type: item.type })}
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${
                            formData.institution_type === item.type 
                              ? 'border-indigo-600 bg-indigo-50/40 text-indigo-900 shadow-sm' 
                              : 'border-gray-200 hover:border-indigo-200 text-gray-700 bg-white'
                          }`}
                        >
                          <span className="font-bold text-sm block">{item.label}</span>
                          <span className="text-xs text-gray-500 block mt-1 leading-relaxed">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={!formData.school_name || !formData.address || !formData.phone || !formData.institution_type}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center shadow-lg shadow-indigo-200"
                  >
                    Continue to Plans
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Subscription</h1>
                  <p className="text-gray-500">Select a plan that fits your school's size.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { 
                      tier: SubscriptionTier.PILOT, 
                      name: 'Pilot Trial', 
                      price: 'Free (30 days)', 
                      profiles: formData.institution_type === SchoolType.SCHOOL_COLLEGE ? 'Up to 30' :
                                formData.institution_type === SchoolType.DAYCARE ? 'Up to 10' :
                                formData.institution_type === SchoolType.VOCATIONAL ? 'Up to 5' : 'Up to 5', 
                      icon: Building2,
                      color: 'bg-gray-50 text-gray-600 border-gray-200'
                    },
                    { 
                      tier: SubscriptionTier.TIER_1, 
                      name: 'Essential', 
                      price: '$49/mo', 
                      profiles: 'Up to 200', 
                      icon: Rocket,
                      color: 'bg-blue-50 text-blue-600 border-blue-200'
                    },
                    { 
                      tier: SubscriptionTier.TIER_2, 
                      name: 'Professional', 
                      price: '$129/mo', 
                      profiles: 'Up to 500', 
                      icon: Zap,
                      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
                    },
                    { 
                      tier: SubscriptionTier.TIER_3, 
                      name: 'Enterprise', 
                      price: 'Custom', 
                      profiles: '501+', 
                      icon: Award,
                      color: 'bg-amber-50 text-amber-600 border-amber-200'
                    }
                  ].map((plan) => (
                    <motion.div 
                      key={plan.tier}
                      whileHover={{ y: -5 }}
                      className={`bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer ${
                        formData.plan === plan.tier ? 'border-indigo-600 shadow-xl' : 'border-gray-100 hover:border-indigo-200'
                      }`}
                      onClick={() => setFormData({ ...formData, plan: plan.tier })}
                    >
                      <div className={`w-12 h-12 rounded-2xl ${plan.color} flex items-center justify-center mb-6`}>
                        <plan.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                      <p className="text-2xl font-black text-gray-900 mb-4">{plan.price}</p>
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-center text-sm text-gray-500">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
                          {plan.profiles} Active Profiles
                        </li>
                        <li className="flex items-center text-sm text-gray-500">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
                          AI Analytics
                        </li>
                        <li className="flex items-center text-sm text-gray-500">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
                          24/7 Support
                        </li>
                      </ul>
                      <button 
                        onClick={() => handlePayment(plan.tier)}
                        className={`w-full py-3 rounded-xl font-bold transition-all ${
                          formData.plan === plan.tier 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {plan.tier === SubscriptionTier.PILOT ? 'Select Pilot' : 'Manual Upgrade Only'}
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Onboarding Notice for Multi-School Institutions */}
                <div className="mt-8 bg-slate-50 border border-slate-200/60 rounded-2xl p-5 text-left text-sm text-slate-600 max-w-4xl mx-auto">
                  <span className="font-bold text-slate-800 block mb-1">🏫 Multi-School / Multi-Campus Networks Notice:</span>
                  A Custom Subscription Model is designed for multi-school campus setups and can be negotiated with our accounts department before generating any contract or charging any subscription fee. Schools with up to 1000 active profiles should subscribe to the Tier 3 subscription.
                </div>

                <div className="mt-10 flex justify-between">
                  <button
                    onClick={handleBack}
                    className="px-8 py-4 bg-white text-gray-600 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center"
                  >
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Back
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">You're All Set!</h1>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We've configured your school profile and subscription. Click below to enter your new dashboard.
                </p>

                <div className="bg-gray-50 rounded-2xl p-6 mb-10 text-left max-w-md mx-auto border border-gray-100">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500 text-sm">School:</span>
                    <span className="font-bold text-gray-900">{formData.school_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Plan:</span>
                    <span className="font-bold text-indigo-600">{formData.plan}</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleCompleteOnboarding}
                  disabled={loading}
                  className="w-full max-w-md py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center shadow-lg shadow-indigo-200"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Enter Dashboard
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
};
