import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/auth';
import { Student, User } from '../types';
import { Button } from '../components/ui/Button';
import { Plus, Search, Edit2, Trash2, Eye, X, Save } from 'lucide-react';

export const Students: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  
  const [formData, setFormData] = useState<Partial<Student>>({
    first_name: '',
    last_name: '',
    enrollment_number: '',
    parent_id: '',
    date_of_birth: '',
    gender: 'MALE',
    address: '',
    phone: '',
    email: '',
    blood_group: '',
    admission_date: new Date().toISOString().split('T')[0],
    previous_school: '',
    academic_history: ''
  });

  const loadStudents = async () => {
    if (user) {
      try {
        const [studentRes, parentRes] = await Promise.all([
          api.get("/students/"),
          api.get("/users/parents/")
        ]);
        setStudents(studentRes.data);
        setParents(parentRes.data);
      } catch (e) {
        console.error("Failed to load students or parents", e);
      }
    }
  };

  useEffect(() => {
    loadStudents();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await api.patch(`/students/${editingStudent.id}/`, formData);
      } else {
        await api.post("/students/", formData);
      }
      await loadStudents();
      closeModal();
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to save student");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await api.delete(`/students/${id}/`);
        await loadStudents();
      } catch (e) {
        alert("Failed to delete student");
      }
    }
  };

  const openModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        first_name: student.first_name,
        last_name: student.last_name,
        enrollment_number: student.enrollment_number,
        parent_id: student.parent_id || '',
        date_of_birth: student.date_of_birth || '',
        gender: student.gender || 'MALE',
        address: student.address || '',
        phone: student.phone || '',
        email: student.email || '',
        blood_group: student.blood_group || '',
        admission_date: student.admission_date || '',
        previous_school: student.previous_school || '',
        academic_history: student.academic_history || ''
      });
    } else {
      setEditingStudent(null);
      setFormData({
        first_name: '',
        last_name: '',
        enrollment_number: '',
        parent_id: '',
        date_of_birth: '',
        gender: 'MALE',
        address: '',
        phone: '',
        email: '',
        blood_group: '',
        admission_date: new Date().toISOString().split('T')[0],
        previous_school: '',
        academic_history: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const filteredStudents = students.filter(s => 
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.enrollment_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Student Management</h2>
          <p className="mt-1 text-sm text-gray-500">Manage student records, personal info, and academic history.</p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search by name or enrollment number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      {student.first_name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{student.first_name} {student.last_name}</div>
                      <div className="text-sm text-gray-500">{student.email || 'No email'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {student.enrollment_number}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.parent_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.admission_date || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => setViewingStudent(student)} className="text-gray-400 hover:text-gray-600 mr-3">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button onClick={() => openModal(student)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No students found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name *</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Enrollment Number *</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.enrollment_number}
                      onChange={(e) => setFormData({...formData, enrollment_number: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Admission Date</label>
                    <input
                      type="date"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.admission_date}
                      onChange={(e) => setFormData({...formData, admission_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent / Guardian</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.parent_id}
                      onChange={(e) => setFormData({...formData, parent_id: e.target.value})}
                    >
                      <option value="">Select Parent</option>
                      {parents.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                    <input
                      type="text"
                      placeholder="e.g. A+"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.blood_group}
                      onChange={(e) => setFormData({...formData, blood_group: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    rows={2}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Academic History / Notes</label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.academic_history}
                    onChange={(e) => setFormData({...formData, academic_history: e.target.value})}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    {editingStudent ? 'Update Student' : 'Save Student'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingStudent && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setViewingStudent(null)}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-8 overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-bold">
                    {viewingStudent.first_name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{viewingStudent.first_name} {viewingStudent.last_name}</h3>
                    <p className="text-gray-500">Enrollment: {viewingStudent.enrollment_number}</p>
                  </div>
                </div>
                <button onClick={() => setViewingStudent(null)} className="text-gray-400 hover:text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 border-b pb-2">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">Gender:</span>
                    <span className="text-gray-900">{viewingStudent.gender}</span>
                    <span className="text-gray-500">Date of Birth:</span>
                    <span className="text-gray-900">{viewingStudent.date_of_birth || 'N/A'}</span>
                    <span className="text-gray-500">Blood Group:</span>
                    <span className="text-gray-900">{viewingStudent.blood_group || 'N/A'}</span>
                    <span className="text-gray-500">Phone:</span>
                    <span className="text-gray-900">{viewingStudent.phone || 'N/A'}</span>
                    <span className="text-gray-500">Email:</span>
                    <span className="text-gray-900">{viewingStudent.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Address:</span>
                    <p className="text-sm text-gray-900">{viewingStudent.address || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 border-b pb-2">Academic Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">Admission Date:</span>
                    <span className="text-gray-900">{viewingStudent.admission_date || 'N/A'}</span>
                    <span className="text-gray-500">Parent Name:</span>
                    <span className="text-gray-900">{viewingStudent.parent_name}</span>
                    <span className="text-gray-500">Previous School:</span>
                    <span className="text-gray-900">{viewingStudent.previous_school || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Academic History:</span>
                    <p className="text-sm text-gray-900 italic">{viewingStudent.academic_history || 'No history recorded.'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button onClick={() => setViewingStudent(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
