import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/auth';
import { UserRole, FeeCategory, StudentFee, Student, Payment } from '../types';
import { Button } from '../components/ui/Button';
import { CreditCard, CheckCircle, Clock, Plus, DollarSign, Trash2, History } from 'lucide-react';

export const Finance: React.FC = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [categories, setCategories] = useState<FeeCategory[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedFee, setSelectedFee] = useState<StudentFee | null>(null);

  // Admin Create Category State
  const [showCreateCat, setShowCreateCat] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', amount: '', description: '' });

  // Admin Assign Fee State
  const [showAssignFee, setShowAssignFee] = useState(false);
  const [assignment, setAssignment] = useState({ student_id: '', category_id: '', due_date: '' });

  const isParent = user?.role === UserRole.PARENT;
  const isAdmin = user?.role === UserRole.ADMIN;

  const [showOnlyOutstanding, setShowOnlyOutstanding] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'records'>('overview');

  const filteredFees = showOnlyOutstanding ? fees.filter(f => !f.is_paid) : fees;

  const loadData = async () => {
    try {
      setLoading(true);
      const feeRes = await api.get("/finance/fees/");
      setFees(feeRes.data);
      
      const payRes = await api.get("/finance/payments/");
      setPayments(payRes.data);
      
      if (isAdmin) {
        const catRes = await api.get("/finance/categories/");
        setCategories(catRes.data);
        const studRes = await api.get("/students/");
        setStudents(studRes.data);
      }
    } catch (e) {
      console.error("Failed to load finance data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const handlePay = async (feeId: string) => {
    setPayingId(feeId);
    try {
      await api.post("/finance/pay/", { fee_id: feeId, method: "Credit Card (Simulated)" });
      setPaymentSuccess(true);
      await loadData();
      // Keep success message for 2 seconds before closing
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(false);
        setSelectedFee(null);
      }, 2000);
    } catch (e: any) {
      alert("Payment failed: " + e.message);
    } finally {
      setPayingId(null);
    }
  };

  const openPaymentModal = (fee: StudentFee) => {
    setSelectedFee(fee);
    setShowPaymentModal(true);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name || !newCat.amount) return;
    try {
      await api.post("/finance/categories/", { 
        name: newCat.name, 
        amount: parseFloat(newCat.amount), 
        description: newCat.description 
      });
      setNewCat({ name: '', amount: '', description: '' });
      setShowCreateCat(false);
      await loadData();
    } catch (e) {
      alert("Failed to create category");
    }
  };

  const handleAssignFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment.student_id || !assignment.category_id || !assignment.due_date) return;
    try {
      await api.post("/finance/fees/", assignment);
      setAssignment({ student_id: '', category_id: '', due_date: '' });
      setShowAssignFee(false);
      alert("Fee assigned successfully!");
      await loadData();
    } catch (e) {
      alert("Failed to assign fee");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/finance/categories/${id}/`);
      await loadData();
    } catch (e) {
      alert("Failed to delete category");
    }
  };

  if (loading && fees.length === 0) return <div className="p-8 text-center">Loading Finance Data...</div>;

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {isParent ? "My Fees" : "Financial Management"}
          </h2>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Overview
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('categories')}
              className={`${
                activeTab === 'categories'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Fee Categories
            </button>
          )}
          <button
            onClick={() => setActiveTab('records')}
            className={`${
              activeTab === 'records'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            {isParent ? 'My Fee Records' : 'Student Fee Records'}
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-orange-500">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {isAdmin ? "Total Outstanding (All Students)" : "Outstanding Balance"}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          ${fees.filter(f => !f.is_paid).reduce((acc, f) => acc + f.amount, 0)}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-green-500">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {isAdmin ? "Total Revenue (Collected)" : "Total Paid"}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          ${fees.filter(f => f.is_paid).reduce((acc, f) => acc + f.amount, 0)}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center">
              <History className="w-5 h-5 text-indigo-600 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">Payment History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.length > 0 ? payments.map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{p.transaction_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${p.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.method}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No payment history found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && isAdmin && (
        <div className="animate-in slide-in-from-left-4 duration-300">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Fee Structure Management</h3>
              <Button onClick={() => setShowCreateCat(!showCreateCat)} size="sm" variant="secondary">
                <Plus className="w-4 h-4 mr-2" /> New Category
              </Button>
            </div>

            {showCreateCat && (
              <form onSubmit={handleCreateCategory} className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200 animate-in zoom-in-95 duration-200">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">Category Name</label>
                    <input 
                      placeholder="e.g. Lab Fee" 
                      className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newCat.name}
                      onChange={e => setNewCat({...newCat, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">Amount ($)</label>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newCat.amount}
                      onChange={e => setNewCat({...newCat, amount: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">Description</label>
                    <input 
                      placeholder="Optional details" 
                      className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newCat.description}
                      onChange={e => setNewCat({...newCat, description: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                   <Button type="button" variant="secondary" size="sm" onClick={() => setShowCreateCat(false)}>Cancel</Button>
                   <Button type="submit" size="sm">Create Category</Button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map(cat => (
                 <div key={cat.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start bg-white hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{cat.name}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description || 'No description provided.'}</div>
                      <div className="mt-3 font-bold text-indigo-600 text-lg">${cat.amount}</div>
                    </div>
                    <button 
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-all"
                      title="Delete Category"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
              ))}
              {categories.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  No fee categories defined yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'records' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          {isAdmin && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Assign Fees</h3>
                <Button onClick={() => setShowAssignFee(!showAssignFee)} size="sm" variant="secondary">
                  <Plus className="w-4 h-4 mr-2" /> Assign New Fee
                </Button>
              </div>

              {showAssignFee && (
                <form onSubmit={handleAssignFee} className="mb-8 bg-indigo-50 p-6 rounded-lg border border-indigo-200 animate-in zoom-in-95 duration-200">
                  <h4 className="text-sm font-bold text-indigo-900 mb-4">Assign Fee to Student</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-indigo-700">Student</label>
                      <select 
                        className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={assignment.student_id}
                        onChange={e => setAssignment({...assignment, student_id: e.target.value})}
                        required
                      >
                        <option value="">Select Student</option>
                        {students.map(s => (
                          <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.enrollment_number})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-indigo-700">Fee Category</label>
                      <select 
                        className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={assignment.category_id}
                        onChange={e => setAssignment({...assignment, category_id: e.target.value})}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name} (${c.amount})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-indigo-700">Due Date</label>
                      <input 
                        type="date" 
                        className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={assignment.due_date}
                        onChange={e => setAssignment({...assignment, due_date: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                     <Button type="button" variant="secondary" size="sm" onClick={() => setShowAssignFee(false)}>Cancel</Button>
                     <Button type="submit" size="sm">Assign Fee</Button>
                  </div>
                </form>
              )}
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {isParent ? "Outstanding & Paid Fees" : "Student Fee Records"}
              </h3>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="outstandingOnly" 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={showOnlyOutstanding}
                  onChange={() => setShowOnlyOutstanding(!showOnlyOutstanding)}
                />
                <label htmlFor="outstandingOnly" className="ml-2 text-sm text-gray-700">Outstanding Only</label>
              </div>
            </div>
            <ul className="divide-y divide-gray-200">
              {filteredFees.length > 0 ? filteredFees.map((fee) => (
                <li key={fee.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                        fee.is_paid ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-indigo-600">
                          {fee.category_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Due: {fee.due_date} {isAdmin && <span className="ml-2 text-xs bg-gray-100 px-1.5 py-0.5 rounded">Student ID: {fee.student_id}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-6 text-right">
                        <div className="text-sm font-bold text-gray-900">${fee.amount}</div>
                        <div className={`text-xs inline-flex items-center ${
                          fee.is_paid ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {fee.is_paid ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Paid on {fee.paid_on}</>
                          ) : (
                            <><Clock className="w-3 h-3 mr-1" /> Pending</>
                          )}
                        </div>
                      </div>
                      
                      {(isParent || isAdmin) && !fee.is_paid && (
                        <Button 
                          onClick={() => openPaymentModal(fee)} 
                          size="sm"
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              )) : (
                <li className="px-4 py-12 text-center text-gray-500">
                  No fee records found.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}


      {/* Simulated Payment Gateway Modal */}
      {showPaymentModal && selectedFee && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              {paymentSuccess ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                  <p className="text-gray-500">Your payment has been processed successfully. A receipt has been generated and sent to your email.</p>
                </div>
              ) : (
                <>
                  <div>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                      <CreditCard className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Secure Payment Gateway</h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          You are paying <span className="font-bold text-gray-900">${selectedFee.amount}</span> for <span className="font-bold text-gray-900">{selectedFee.category_name}</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); handlePay(selectedFee.id); }} className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Card Number</label>
                      <input type="text" placeholder="xxxx xxxx xxxx xxxx" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input type="text" placeholder="MM/YY" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">CVV</label>
                        <input type="text" placeholder="xxx" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 flex space-x-3">
                      <Button
                        type="button"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => setShowPaymentModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        loading={payingId === selectedFee.id}
                      >
                        Confirm Payment
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};