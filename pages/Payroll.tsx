import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/auth';
import { StaffSalary, LeaveRequest, SalaryStatus, UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Plus,
  Download,
  Filter,
  Briefcase
} from 'lucide-react';

export const Payroll: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'payroll' | 'leaves'>('payroll');
  const [salaries, setSalaries] = useState<StaffSalary[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [newLeave, setNewLeave] = useState({
    leave_type: 'CASUAL' as const,
    start_date: '',
    end_date: '',
    reason: ''
  });

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'payroll') {
        const res = await api.get('/payroll/salaries/');
        setSalaries(res.data);
      } else {
        const res = await api.get('/hr/leaves/');
        setLeaves(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleGeneratePayroll = async () => {
    try {
      await api.post('/payroll/generate/', { month: selectedMonth });
      fetchData();
    } catch (error) {
      alert('Failed to generate payroll');
    }
  };

  const handlePaySalary = async (id: string) => {
    try {
      await api.post(`/payroll/pay/${id}/`, { method: 'Bank Transfer' });
      fetchData();
    } catch (error) {
      alert('Failed to process payment');
    }
  };

  const handleUpdateLeave = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.patch(`/hr/leaves/${id}/`, { status });
      fetchData();
    } catch (error) {
      alert('Failed to update leave status');
    }
  };

  const handleCreateLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/hr/leaves/', newLeave);
      setShowLeaveModal(false);
      setNewLeave({ leave_type: 'CASUAL', start_date: '', end_date: '', reason: '' });
      fetchData();
    } catch (error) {
      alert('Failed to submit leave request');
    }
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate flex items-center">
            <Briefcase className="w-8 h-8 mr-3 text-indigo-600" />
            Payroll & HR Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage staff salaries, payslips, and leave requests.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'payroll' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            Payroll
          </div>
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'leaves' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Leave Management
          </div>
        </button>
      </div>

      {activeTab === 'payroll' ? (
        <div className="space-y-6">
          {isAdmin && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <Button onClick={handleGeneratePayroll}>
                  Generate Payroll for {selectedMonth}
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          )}

          <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salaries.map((salary) => (
                  <tr key={salary.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          {salary.staff_name?.[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{salary.staff_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{salary.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${salary.basic_salary}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${salary.net_salary}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        salary.status === SalaryStatus.PAID ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {salary.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900" title="View Payslip">
                          <FileText className="w-5 h-5" />
                        </button>
                        {isAdmin && salary.status === SalaryStatus.PENDING && (
                          <button 
                            onClick={() => handlePaySalary(salary.id)}
                            className="text-emerald-600 hover:text-emerald-900" 
                            title="Process Payment"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {salaries.length === 0 && !loading && (
              <div className="py-12 text-center text-gray-500">
                No payroll records found for the selected period.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Filter className="w-4 h-4" />
              <span>Filter by Status</span>
            </div>
            {!isAdmin && (
              <Button onClick={() => setShowLeaveModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Request Leave
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {leaves.map((leave) => (
              <div key={leave.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${
                    leave.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                    leave.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{leave.leave_type} Leave</h3>
                    <p className="text-sm text-gray-500">{leave.staff_name} • {leave.start_date} to {leave.end_date}</p>
                    <p className="text-sm text-gray-600 mt-2 italic">"{leave.reason}"</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    leave.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                    leave.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {leave.status}
                  </span>
                  {isAdmin && leave.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleUpdateLeave(leave.id, 'APPROVED')}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={() => handleUpdateLeave(leave.id, 'REJECTED')}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {leaves.length === 0 && !loading && (
              <div className="py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
                No leave requests found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leave Request Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Request Leave</h3>
            <form onSubmit={handleCreateLeave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select
                  value={newLeave.leave_type}
                  onChange={(e) => setNewLeave({ ...newLeave, leave_type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="ANNUAL">Annual Leave</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newLeave.start_date}
                    onChange={(e) => setNewLeave({ ...newLeave, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newLeave.end_date}
                    onChange={(e) => setNewLeave({ ...newLeave, end_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  required
                  rows={3}
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Briefly explain the reason for leave..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="secondary" onClick={() => setShowLeaveModal(false)}>Cancel</Button>
                <Button type="submit">Submit Request</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
