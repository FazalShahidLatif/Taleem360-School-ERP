import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/auth';
import { Class, User } from '../types';
import { Button } from '../components/ui/Button';
import { Plus, Sparkles, X, Edit2, Trash2, Save } from 'lucide-react';

export const Classes: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  
  // AI Modal State
  const [analyticsClass, setAnalyticsClass] = useState<Class | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', section: '', teacherId: '' });

  const loadData = async () => {
    if (user) {
      try {
        const [clsRes, teachRes] = await Promise.all([
          api.get("/classes/"),
          api.get("/users/teachers/"), 
        ]);
        setClasses(clsRes.data);
        setTeachers(teachRes.data);
      } catch (e) {
        console.error("Error loading class data", e);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.section.trim()) return;

    try {
      if (editingClass) {
        await api.patch(`/classes/${editingClass.id}/`, {
          name: formData.name,
          section: formData.section,
          class_teacher: formData.teacherId || undefined
        });
      } else {
        await api.post("/classes/", {
          name: formData.name,
          section: formData.section,
          class_teacher: formData.teacherId || undefined
        });
      }

      await loadData();
      closeModal();
    } catch (e) {
      alert("Failed to save class");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await api.delete(`/classes/${id}/`);
        await loadData();
      } catch (e) {
        alert("Failed to delete class");
      }
    }
  };

  const openModal = (cls?: Class) => {
    if (cls) {
      setEditingClass(cls);
      setFormData({
        name: cls.name,
        section: cls.section,
        teacherId: cls.class_teacher || ''
      });
    } else {
      setEditingClass(null);
      setFormData({ name: '', section: '', teacherId: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
    setFormData({ name: '', section: '', teacherId: '' });
  };

  const handleViewAnalytics = async (cls: Class) => {
    setAnalyticsClass(cls);
    setAiSummary('');
    setLoadingAi(true);
    try {
      const res = await api.get(`/ai/class-summary/${cls.id}/`);
      setAiSummary(res.data.summary);
    } catch (e) {
      setAiSummary("Failed to generate insights. Please try again.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Academic Classes</h2>
          <p className="mt-1 text-sm text-gray-500">Manage grade levels, sections, and class teachers.</p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Create Class
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => {
          const teacherName = teachers.find(t => t.id === cls.class_teacher)?.name || 'Unassigned';
          
          return (
            <div key={cls.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-lg leading-6 font-bold text-gray-900">{cls.name} <span className="text-indigo-600">({cls.section})</span></h3>
                   <div className="flex space-x-2">
                      <button onClick={() => openModal(cls)} className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cls.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>
                <div className="text-sm text-gray-500 mb-6">
                  <p className="flex items-center">
                    <span className="font-medium text-gray-700 mr-2">Class Teacher:</span> 
                    {teacherName}
                  </p>
                </div>
                
                <button 
                  onClick={() => handleViewAnalytics(cls)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-purple-200 shadow-sm text-sm font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Insights
                </button>
              </div>
            </div>
          );
        })}
        {classes.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            No classes created yet.
          </div>
        )}
      </div>

      {/* Create/Edit Class Modal */}
      {isModalOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
          <div className="bg-white rounded-lg shadow-xl z-10 w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">{editingClass ? 'Edit Class' : 'Create New Class'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Class Name *</label>
                <input
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="e.g. Grade 10"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Section *</label>
                <input
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="e.g. A"
                  value={formData.section}
                  onChange={e => setFormData({...formData, section: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Class Teacher</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.teacherId}
                  onChange={e => setFormData({...formData, teacherId: e.target.value})}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="secondary" type="button" onClick={closeModal}>Cancel</Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {editingClass ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Analytics Modal */}
      {analyticsClass && (
        <div className="fixed z-50 inset-0 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setAnalyticsClass(null)}></div>
          <div className="bg-white rounded-lg shadow-xl z-10 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-purple-50">
              <h3 className="text-lg font-bold text-purple-900 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Insights: {analyticsClass.name}
              </h3>
              <button onClick={() => setAnalyticsClass(null)} className="text-gray-400 hover:text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {loadingAi ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                  <p className="text-sm text-gray-500">Analyzing attendance patterns...</p>
                </div>
              ) : (
                <div className="prose prose-purple prose-sm max-w-none whitespace-pre-line text-gray-700">
                  {aiSummary}
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button variant="secondary" onClick={() => setAnalyticsClass(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
