import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../lib/auth';
import { Button } from '../components/ui/Button';
import { Users, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';

export const AffiliateProgram: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAffiliate, setIsAffiliate] = useState(false);

  useEffect(() => {
    const checkAffiliate = async () => {
      if (!user) return;
      try {
        const res = await api.get('/affiliate/');
        if (res.data) {
          setIsAffiliate(true);
        }
      } catch (e) {
        console.error("Failed to check affiliate status", e);
      }
    };
    checkAffiliate();
  }, [user]);

  const handleJoin = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      await api.post('/affiliate/register/');
      setIsAffiliate(true);
      navigate('/affiliate/dashboard');
    } catch (e) {
      alert("Failed to join affiliate program");
    } finally {
      setLoading(true);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-indigo-600 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Taleem360 Affiliate Program
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
            Partner with the leading School ERP provider and earn generous commissions for every school you refer.
          </p>
          <div className="mt-10">
            {isAffiliate ? (
              <Button onClick={() => navigate('/affiliate/dashboard')} size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
                Go to Dashboard
              </Button>
            ) : (
              <Button onClick={handleJoin} size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50" loading={loading}>
                Join Now & Start Earning
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50 overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
          <div className="relative">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why Join Our Affiliate Program?
            </h2>
          </div>

          <div className="relative mt-12 lg:mt-24 grid grid-cols-1 gap-8">
            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="mt-5 text-center">
                <h3 className="text-lg font-medium text-gray-900">High Commissions</h3>
                <p className="mt-2 text-base text-gray-500">
                  Earn up to 20% commission on every successful school subscription you refer.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="mt-5 text-center">
                <h3 className="text-lg font-medium text-gray-900">Recurring Earnings</h3>
                <p className="mt-2 text-base text-gray-500">
                  Get paid as long as the school remains a Taleem360 customer.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <div className="mt-5 text-center">
                <h3 className="text-lg font-medium text-gray-900">Dedicated Support</h3>
                <p className="mt-2 text-base text-gray-500">
                  Access marketing materials and a dedicated affiliate manager to help you succeed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-16 bg-white overflow-hidden lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">How it Works</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Three Simple Steps to Success
            </p>
          </div>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 text-2xl font-bold mb-4">1</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Up</h3>
                <p className="text-gray-500">Join our program for free and get your unique referral link.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 text-2xl font-bold mb-4">2</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Promote</h3>
                <p className="text-gray-500">Share Taleem360 with schools, educators, and administrators.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 text-2xl font-bold mb-4">3</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Earn</h3>
                <p className="text-gray-500">Receive commissions for every school that signs up using your link.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start earning?</span>
            <span className="block">Join the affiliate program today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join hundreds of partners who are already earning with Taleem360.
          </p>
          <Button onClick={handleJoin} size="lg" className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto" loading={loading}>
            Sign up for free
          </Button>
        </div>
      </div>
    </div>
  );
};
