import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/auth';
import { Subject } from '../types';
import { Button } from '../components/ui/Button';
import { Plus, Search, Trash2, X, Save, Book } from 'lucide-react';

export const Subjects: React.FC = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Subject>>({
    name: '',
    code: ''
  });

  const loadSubjects = async () => {
    if (user) {
      try {
        const res = await api.get("/subjects/");
        setSubjects(res.data);
      } catch (e) {
        console.error("Failed to load subjects", e);
      }
    }
  };

  useEffect(() => {
    loadSubjects();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/subjects/", formData);
      await loadSubjects();
      closeModal();
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to save subject");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await api.delete(`/subjects/${id}/`);
        await loadSubjects();
      } catch (e) {
        alert("Failed to delete subject");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', code: '' });
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Subjects</h2>
          <p className="mt-1 text-sm text-gray-500">Manage academic subjects and course codes.</p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Subject
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
            placeholder="Search by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredSubjects.map((subject) => (
          <div key={subject.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Book className="w-6 h-6" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-bold text-gray-900">{subject.name}</h3>
                  <p className="text-xs text-gray-500 font-mono">{subject.code}</p>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-gray-50">
                <button onClick={() => handleDelete(subject.id)} className="text-red-600 hover:text-red-900 text-sm flex items-center">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredSubjects.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            No subjects found.
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Add New Subject</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mathematics"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MATH101"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Save Subject
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
