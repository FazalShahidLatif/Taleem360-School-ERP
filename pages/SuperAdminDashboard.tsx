import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { SubscriptionTier, Affiliate, AffiliateStatus } from '../types';
import { 
  School as SchoolIcon, 
  Users, 
  UserCheck, 
  TrendingUp, 
  Activity, 
  Plus, 
  X, 
  Check, 
  Shield, 
  LayoutDashboard,
  Users as UsersIcon,
  Briefcase,
  ExternalLink,
  Mail,
  Lock,
  UserPlus
} from 'lucide-react';

interface SchoolStats {
  id: string;
  name: string;
  code: string;
  studentCount: number;
  staffCount: number;
  classCount: number;
  isActive: boolean;
  subscriptionTier: SubscriptionTier;
  maxStudents: number;
}

const TIER_CONFIG = {
  [SubscriptionTier.PILOT]: { label: 'Pilot Project', max: 30, price: 'Free' },
  [SubscriptionTier.TIER_1]: { label: 'Tier 1 (0-200)', max: 200, price: '$99/mo' },
  [SubscriptionTier.TIER_2]: { label: 'Tier 2 (201-500)', max: 500, price: '$249/mo' },
  [SubscriptionTier.TIER_3]: { label: 'Tier 3 (501+)', max: 5000, price: '$499/mo' },
};

type Tab = 'SCHOOLS' | 'AFFILIATES';

export const SuperAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('SCHOOLS');
  const [stats, setStats] = useState<SchoolStats[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // School Onboarding State
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [newSchool, setNewSchool] = useState({
    name: '',
    code: '',
    contact_email: '',
    subscription_tier: SubscriptionTier.PILOT,
    admin_name: '',
    admin_password: ''
  });

  // Affiliate Onboarding State
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [newAffiliate, setNewAffiliate] = useState({
    name: '',
    email: '',
    password: '',
    referral_code: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, affiliatesRes] = await Promise.all([
        api.get('/super-admin/stats/'),
        api.get('/super-admin/affiliates/')
      ]);
      setStats(statsRes.data);
      setAffiliates(affiliatesRes.data);
    } catch (error) {
      console.error('Failed to fetch super admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOnboardSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const max_students = TIER_CONFIG[newSchool.subscription_tier].max;
      await api.post('/super-admin/schools/', { ...newSchool, max_students });
      setShowSchoolModal(false);
      setNewSchool({
        name: '',
        code: '',
        contact_email: '',
        subscription_tier: SubscriptionTier.PILOT,
        admin_name: '',
        admin_password: ''
      });
      fetchData();
    } catch (error) {
      alert('Failed to onboard school');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOnboardAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/super-admin/affiliates/', newAffiliate);
      setShowAffiliateModal(false);
      setNewAffiliate({
        name: '',
        email: '',
        password: '',
        referral_code: ''
      });
      fetchData();
    } catch (error) {
      alert('Failed to onboard affiliate');
    } finally {
      setSubmitting(false);
    }
  };

  const updateAffiliateStatus = async (id: string, status: AffiliateStatus) => {
    try {
      await api.patch(`/super-admin/affiliates/${id}/`, { status });
      fetchData();
    } catch (error) {
      alert('Failed to update affiliate status');
    }
  };

  const toggleSchoolStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/super-admin/schools/${id}/`, { is_active: !currentStatus });
      fetchData();
    } catch (error) {
      alert('Failed to update school status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const totalSchools = stats.length;
  const totalStudents = stats.reduce((acc, curr) => acc + curr.studentCount, 0);
  const totalAffiliates = affiliates.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Oversight Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage institutional onboarding and partner programs.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
            <Activity className="w-4 h-4 text-green-500" />
            <span>System Status: Optimal</span>
          </div>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 gap-5">
        <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="bg-indigo-500 rounded-xl p-3">
              <SchoolIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Schools</p>
              <p className="text-2xl font-bold text-gray-900">{totalSchools}</p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="bg-emerald-500 rounded-xl p-3">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Global Students</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="bg-amber-500 rounded-xl p-3">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Affiliates</p>
              <p className="text-2xl font-bold text-gray-900">{totalAffiliates}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50/50">
          <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('SCHOOLS')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'SCHOOLS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              School Management
            </button>
            <button
              onClick={() => setActiveTab('AFFILIATES')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'AFFILIATES' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Affiliate Program
            </button>
          </div>
          <button
            onClick={() => activeTab === 'SCHOOLS' ? setShowSchoolModal(true) : setShowAffiliateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            {activeTab === 'SCHOOLS' ? 'Onboard School' : 'Onboard Affiliate'}
          </button>
        </div>

        <div className="p-0">
          {activeTab === 'SCHOOLS' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Institution</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tier</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {stats.map((school) => (
                    <tr key={school.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <SchoolIcon className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900">{school.name}</div>
                            <div className="text-xs text-gray-500 font-mono">{school.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {school.studentCount} / <span className="text-gray-400">{school.maxStudents}</span>
                        </div>
                        <div className="w-24 bg-gray-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full rounded-full" 
                            style={{ width: `${Math.min((school.studentCount / school.maxStudents) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {TIER_CONFIG[school.subscriptionTier].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-lg border ${
                          school.isActive 
                            ? 'bg-green-50 text-green-700 border-green-100' 
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                          {school.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => toggleSchoolStatus(school.id, school.isActive)}
                          className={`font-bold ${
                            school.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'
                          }`}
                        >
                          {school.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Partner</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Referral Code</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Performance</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {affiliates.map((aff) => (
                    <tr key={aff.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                            <UserCheck className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900">{aff.user_name}</div>
                            <div className="text-xs text-gray-500">{aff.user_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm font-bold text-gray-700">
                          {aff.referral_code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-bold">{aff.referral_count} Referrals</div>
                        <div className="text-xs text-emerald-600 font-medium">${aff.total_earnings.toLocaleString()} Earned</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-lg border ${
                          aff.status === AffiliateStatus.ACTIVE 
                            ? 'bg-green-50 text-green-700 border-green-100' 
                            : aff.status === AffiliateStatus.PENDING
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-100'
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                          {aff.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          {aff.status === AffiliateStatus.PENDING && (
                            <button
                              onClick={() => updateAffiliateStatus(aff.id, AffiliateStatus.ACTIVE)}
                              className="text-green-600 hover:text-green-700 font-bold"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => updateAffiliateStatus(aff.id, aff.status === AffiliateStatus.ACTIVE ? AffiliateStatus.SUSPENDED : AffiliateStatus.ACTIVE)}
                            className={`font-bold ${
                              aff.status === AffiliateStatus.ACTIVE ? 'text-red-600 hover:text-red-700' : 'text-indigo-600 hover:text-indigo-700'
                            }`}
                          >
                            {aff.status === AffiliateStatus.ACTIVE ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* School Onboarding Modal */}
      {showSchoolModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" onClick={() => setShowSchoolModal(false)}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full p-8 overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setShowSchoolModal(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex items-center mb-8">
                <div className="bg-indigo-100 p-3 rounded-2xl mr-4">
                  <Shield className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Onboard Institution</h3>
                  <p className="text-sm text-gray-500">Register a new school and its primary administrator.</p>
                </div>
              </div>

              <form onSubmit={handleOnboardSchool} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="col-span-1">
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">School Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SchoolIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={newSchool.name}
                        onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g. Springfield Academy"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">School Code</label>
                    <input
                      type="text"
                      required
                      value={newSchool.code}
                      onChange={(e) => setNewSchool({ ...newSchool, code: e.target.value.toUpperCase() })}
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                      placeholder="SPRING_001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Subscription Tier</label>
                    <select
                      value={newSchool.subscription_tier}
                      onChange={(e) => setNewSchool({ ...newSchool, subscription_tier: e.target.value as SubscriptionTier })}
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      {Object.entries(TIER_CONFIG).map(([tier, config]) => (
                        <option key={tier} value={tier}>{config.label} ({config.price})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center">
                    <UserPlus className="w-4 h-4 mr-2 text-indigo-600" />
                    Admin Account Details
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newSchool.admin_name}
                        onChange={(e) => setNewSchool({ ...newSchool, admin_name: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Principal Skinner"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                      <input
                        type="email"
                        required
                        value={newSchool.contact_email}
                        onChange={(e) => setNewSchool({ ...newSchool, contact_email: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="admin@school.com"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Initial Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          required
                          value={newSchool.admin_password}
                          onChange={(e) => setNewSchool({ ...newSchool, admin_password: e.target.value })}
                          className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSchoolModal(false)}
                    className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-200"
                  >
                    {submitting ? 'Onboarding...' : 'Complete Onboarding'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Affiliate Onboarding Modal */}
      {showAffiliateModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" onClick={() => setShowAffiliateModal(false)}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setShowAffiliateModal(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex items-center mb-8">
                <div className="bg-amber-100 p-3 rounded-2xl mr-4">
                  <Briefcase className="h-8 w-8 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Onboard Partner</h3>
                  <p className="text-sm text-gray-500">Register a new affiliate partner.</p>
                </div>
              </div>

              <form onSubmit={handleOnboardAffiliate} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAffiliate.name}
                    onChange={(e) => setNewAffiliate({ ...newAffiliate, name: e.target.value })}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newAffiliate.email}
                    onChange={(e) => setNewAffiliate({ ...newAffiliate, email: e.target.value })}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Initial Password</label>
                  <input
                    type="password"
                    required
                    value={newAffiliate.password}
                    onChange={(e) => setNewAffiliate({ ...newAffiliate, password: e.target.value })}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Custom Referral Code (Optional)</label>
                  <input
                    type="text"
                    value={newAffiliate.referral_code}
                    onChange={(e) => setNewAffiliate({ ...newAffiliate, referral_code: e.target.value.toUpperCase() })}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                    placeholder="PARTNER_2026"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAffiliateModal(false)}
                    className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 disabled:opacity-50 transition-colors shadow-lg shadow-amber-200"
                  >
                    {submitting ? 'Onboarding...' : 'Confirm Partner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
