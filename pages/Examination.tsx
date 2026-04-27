import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/auth';
import { Class, Subject, Exam, ExamResult, Student, UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { Plus, Search, Edit2, Trash2, X, Save, ClipboardList, Award, ChevronRight, User as UserIcon } from 'lucide-react';

export const Examination: React.FC = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  
  const [view, setView] = useState<'list' | 'marks' | 'results'>('list');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Exam>>({
    name: '',
    class_id: '',
    subject_id: '',
    exam_date: new Date().toISOString().split('T')[0],
    total_marks: 100,
    passing_marks: 40
  });

  const [marksData, setMarksData] = useState<Record<string, { marks: number; remarks: string }>>({});

  const loadInitialData = async () => {
    if (!user) return;
    try {
      const [examRes, classRes, subjectRes] = await Promise.all([
        api.get("/exams/"),
        api.get("/classes/"),
        api.get("/subjects/")
      ]);
      setExams(examRes.data);
      setClasses(classRes.data);
      setSubjects(subjectRes.data);
    } catch (e) {
      console.error("Failed to load examination data", e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [user]);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/exams/", formData);
      await loadInitialData();
      setIsModalOpen(false);
      setFormData({
        name: '',
        class_id: '',
        subject_id: '',
        exam_date: new Date().toISOString().split('T')[0],
        total_marks: 100,
        passing_marks: 40
      });
    } catch (e) {
      alert("Failed to create exam");
    }
  };

  const handleDeleteExam = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await api.delete(`/exams/${id}/`);
        await loadInitialData();
      } catch (e) {
        alert("Failed to delete exam");
      }
    }
  };

  const openMarksEntry = async (exam: Exam) => {
    setSelectedExam(exam);
    try {
      const [studentRes, resultRes] = await Promise.all([
        api.get(`/students/by_class/?class_id=${exam.class_id}`),
        api.get(`/exams/${exam.id}/results/`)
      ]);
      setStudents(studentRes.data);
      
      const initialMarks: Record<string, { marks: number; remarks: string }> = {};
      studentRes.data.forEach((s: Student) => {
        const existing = resultRes.data.find((r: ExamResult) => r.student_id === s.id);
        initialMarks[s.id] = {
          marks: existing ? existing.marks_obtained : 0,
          remarks: existing ? existing.remarks || '' : ''
        };
      });
      setMarksData(initialMarks);
      setView('marks');
    } catch (e) {
      console.error("Failed to load students or results", e);
    }
  };

  const handleSaveMarks = async () => {
    if (!selectedExam) return;
    try {
      const resultsToSave = Object.keys(marksData).map((studentId) => ({
        exam_id: selectedExam.id,
        student_id: studentId,
        marks_obtained: marksData[studentId].marks,
        remarks: marksData[studentId].remarks
      }));
      
      await api.post(`/exams/${selectedExam.id}/results/`, { results: resultsToSave });
      alert("Marks saved successfully!");
      setView('list');
      setSelectedExam(null);
    } catch (e) {
      alert("Failed to save marks");
    }
  };

  const viewResults = async (exam: Exam) => {
    setSelectedExam(exam);
    try {
      const [studentRes, resultRes] = await Promise.all([
        api.get(`/students/by_class/?class_id=${exam.class_id}`),
        api.get(`/exams/${exam.id}/results/`)
      ]);
      setStudents(studentRes.data);
      setResults(resultRes.data);
      setView('results');
    } catch (e) {
      console.error("Failed to load results", e);
    }
  };

  const getClassName = (id: string) => {
    const cls = classes.find(c => c.id === id);
    return cls ? `${cls.name} (${cls.section})` : 'Unknown';
  };

  const getSubjectName = (id: string) => {
    const sub = subjects.find(s => s.id === id);
    return sub ? sub.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate flex items-center">
            <ClipboardList className="w-8 h-8 mr-3 text-indigo-600" />
            Examinations
          </h2>
          <p className="mt-1 text-sm text-gray-500">Manage exams, schedules, and student marks.</p>
        </div>
        {view === 'list' && (
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Exam
            </Button>
          </div>
        )}
        {view !== 'list' && (
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button variant="secondary" onClick={() => { setView('list'); setSelectedExam(null); }}>
              Back to List
            </Button>
          </div>
        )}
      </div>

      {view === 'list' && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleDeleteExam(exam.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{exam.name}</h3>
                <div className="space-y-2 text-sm text-gray-500 mb-6">
                  <p><span className="font-medium text-gray-700">Class:</span> {getClassName(exam.class_id)}</p>
                  <p><span className="font-medium text-gray-700">Subject:</span> {getSubjectName(exam.subject_id)}</p>
                  <p><span className="font-medium text-gray-700">Date:</span> {exam.exam_date}</p>
                  <p><span className="font-medium text-gray-700">Marks:</span> {exam.total_marks} (Pass: {exam.passing_marks})</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" size="sm" onClick={() => viewResults(exam)}>
                    View Results
                  </Button>
                  <Button size="sm" onClick={() => openMarksEntry(exam)}>
                    Enter Marks
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {exams.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              No examinations scheduled yet.
            </div>
          )}
        </div>
      )}

      {view === 'marks' && selectedExam && (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-indigo-900">Marks Entry: {selectedExam.name}</h3>
              <p className="text-sm text-indigo-700">{getSubjectName(selectedExam.subject_id)} - {getClassName(selectedExam.class_id)}</p>
            </div>
            <div className="text-sm font-medium text-indigo-900">
              Total Marks: {selectedExam.total_marks}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks Obtained</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-xs">
                          {student.first_name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{student.first_name} {student.last_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.enrollment_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        max={selectedExam.total_marks}
                        className="w-24 border border-gray-300 rounded-md p-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={marksData[student.id]?.marks || 0}
                        onChange={(e) => setMarksData({
                          ...marksData,
                          [student.id]: { ...marksData[student.id], marks: parseInt(e.target.value) || 0 }
                        })}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Optional remarks"
                        value={marksData[student.id]?.remarks || ''}
                        onChange={(e) => setMarksData({
                          ...marksData,
                          [student.id]: { ...marksData[student.id], remarks: e.target.value }
                        })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setView('list')}>Cancel</Button>
            <Button onClick={handleSaveMarks}>
              <Save className="w-4 h-4 mr-2" />
              Save All Marks
            </Button>
          </div>
        </div>
      )}

      {view === 'results' && selectedExam && (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-green-50 border-b border-green-100 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-green-900">Exam Results: {selectedExam.name}</h3>
              <p className="text-sm text-green-700">{getSubjectName(selectedExam.subject_id)} - {getClassName(selectedExam.class_id)}</p>
            </div>
            <div className="text-sm font-medium text-green-900">
              Passing Marks: {selectedExam.passing_marks} / {selectedExam.total_marks}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => {
                  const result = results.find(r => r.student_id === student.id);
                  const marks = result ? result.marks_obtained : 0;
                  const percentage = ((marks / selectedExam.total_marks) * 100).toFixed(1);
                  const isPassed = marks >= selectedExam.passing_marks;
                  
                  return (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.first_name} {student.last_name}</div>
                        <div className="text-xs text-gray-500">{student.enrollment_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {marks} / {selectedExam.total_marks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {percentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isPassed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic">
                        {result?.remarks || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      {isModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Schedule New Exam</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateExam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mid Term 2024"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Class *</label>
                    <select
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.class_id}
                      onChange={(e) => setFormData({...formData, class_id: e.target.value})}
                    >
                      <option value="">Select Class</option>
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject *</label>
                    <select
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.subject_id}
                      onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam Date *</label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.exam_date}
                    onChange={(e) => setFormData({...formData, exam_date: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Marks *</label>
                    <input
                      type="number"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.total_marks}
                      onChange={(e) => setFormData({...formData, total_marks: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Passing Marks *</label>
                    <input
                      type="number"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.passing_marks}
                      onChange={(e) => setFormData({...formData, passing_marks: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Schedule Exam
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
