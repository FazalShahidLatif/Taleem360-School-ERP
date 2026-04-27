import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Assignment, Submission, Class, Subject, UserRole, AttachedResource } from '../types';
import { useAuth } from '../lib/auth';
import { 
  Plus, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  GraduationCap,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Edit2,
  ChevronRight,
  Send,
  Info,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Assignments: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'closed' | 'submissions'>('active');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    title: '',
    description: '',
    class_id: '',
    subject_id: '',
    due_date: '',
    max_marks: 10,
    attached_resources: []
  });
  const [newResource, setNewResource] = useState<Partial<AttachedResource>>({
    title: '',
    url: '',
    type: 'TEXTBOOK'
  });
  const [submissionData, setSubmissionData] = useState({
    text_answer: '',
    file_url: ''
  });
  const [gradingData, setGradingData] = useState({
    marks: 0,
    feedback: ''
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [asgnRes, classRes, subRes] = await Promise.all([
        api.get('/lms/assignments/'),
        api.get('/classes/'),
        api.get('/subjects/')
      ]);
      setAssignments(asgnRes.data);
      setClasses(classRes.data);
      setSubjects(subRes.data);

      if (user?.role === UserRole.TEACHER || user?.role === UserRole.ADMIN) {
        const submRes = await api.get('/lms/submissions/');
        setSubmissions(submRes.data);
      } else if (user?.role === UserRole.PARENT) {
        const submRes = await api.get('/lms/submissions/');
        setSubmissions(submRes.data);
      }
    } catch (error) {
      console.error('Error fetching LMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/lms/assignments/', {
        ...newAssignment,
        assigned_date: new Date().toISOString().split('T')[0]
      });
      setShowAddModal(false);
      setNewAssignment({
        title: '',
        description: '',
        class_id: '',
        subject_id: '',
        due_date: '',
        max_marks: 10,
        attached_resources: []
      });
      fetchData();
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const handleAddResource = () => {
    if (newResource.title && newResource.url) {
      setNewAssignment({
        ...newAssignment,
        attached_resources: [
          ...(newAssignment.attached_resources || []),
          { ...newResource, id: Date.now().toString() } as AttachedResource
        ]
      });
      setNewResource({ title: '', url: '', type: 'TEXTBOOK' });
    }
  };

  const handleRemoveResource = (id: string) => {
    setNewAssignment({
      ...newAssignment,
      attached_resources: newAssignment.attached_resources?.filter(r => r.id !== id)
    });
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    try {
      await api.post('/lms/submissions/', {
        assignment_id: selectedAssignment.id,
        ...submissionData
      });
      setShowSubmissionModal(false);
      setSubmissionData({ text_answer: '', file_url: '' });
      fetchData();
    } catch (error) {
      console.error('Error submitting assignment:', error);
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    try {
      await api.post(`/lms/submissions/${selectedSubmission.id}/grade/`, gradingData);
      setShowGradeModal(false);
      setGradingData({ marks: 0, feedback: '' });
      fetchData();
    } catch (error) {
      console.error('Error grading submission:', error);
    }
  };

  const filteredAssignments = assignments.filter(a => 
    (a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     a.subject_name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeTab === 'active' ? a.status === 'ACTIVE' : a.status === 'CLOSED')
  );

  const isTeacher = user?.role === UserRole.TEACHER || user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  const isStudent = user?.role === UserRole.PARENT; // In this mock, Parent acts as Student view for their child

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Homework & LMS</h1>
          <p className="text-gray-500 mt-1">
            {isTeacher 
              ? "Manage assignments and track student progress." 
              : "View your homework and access free learning resources."}
          </p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Create Assignment
          </button>
        )}
      </div>

      {/* Dual Mission Banner */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-8 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
        <div>
          <p className="text-sm text-indigo-900 font-medium">
            {isTeacher 
              ? "Tip: Link free Taleem360 books and notes so students never get stuck without resources."
              : "Your school uses Taleem360 so you can access homework and free learning resources in one place."}
          </p>
        </div>
      </div>

      {/* Student Progress Stats */}
      {isStudent && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Completed Homework</p>
            <p className="text-2xl font-bold text-gray-900">
              {submissions.filter(s => s.status === 'GRADED' || s.status === 'PENDING').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Pending Assignments</p>
            <p className="text-2xl font-bold text-yellow-600">
              {assignments.filter(a => a.status === 'ACTIVE' && !submissions.find(s => s.assignment_id === a.id)).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Average Score</p>
            <p className="text-2xl font-bold text-indigo-600">
              {(() => {
                const graded = submissions.filter(s => s.status === 'GRADED' && s.obtained_marks !== undefined);
                if (graded.length === 0) return 'N/A';
                const total = graded.reduce((acc, curr) => {
                  const asgn = assignments.find(a => a.id === curr.assignment_id);
                  return acc + (curr.obtained_marks! / (asgn?.max_marks || 100));
                }, 0);
                return Math.round((total / graded.length) * 100) + '%';
              })()}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'active' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Active Assignments
          {activeTab === 'active' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('closed')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'closed' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Closed/Expired
          {activeTab === 'closed' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
          )}
        </button>
        {isTeacher && (
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'submissions' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Submissions
            {activeTab === 'submissions' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
        )}
      </div>

      {/* Search & Filters */}
      {activeTab !== 'submissions' && (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : activeTab === 'submissions' ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignment</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted At</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Marks</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{sub.student_name}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{sub.assignment_title}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(sub.submitted_at).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sub.status === 'GRADED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {sub.obtained_marks !== undefined ? `${sub.obtained_marks} / ${assignments.find(a => a.id === sub.assignment_id)?.max_marks}` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedSubmission(sub);
                        setGradingData({ marks: sub.obtained_marks || 0, feedback: sub.feedback || '' });
                        setShowGradeModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                    >
                      {sub.status === 'GRADED' ? 'Edit Grade' : 'Grade'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((asgn) => {
            const studentSubmission = submissions.find(s => s.assignment_id === asgn.id);
            return (
              <motion.div
                key={asgn.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {asgn.subject_name}
                    </span>
                    {isTeacher && (
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{asgn.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{asgn.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <GraduationCap className="w-4 h-4" />
                    <span>{asgn.class_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Due: {new Date(asgn.due_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FileText className="w-4 h-4" />
                    <span>Max Marks: {asgn.max_marks}</span>
                  </div>
                </div>

                {asgn.attached_resources.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Resources</h4>
                    <div className="flex flex-wrap gap-2">
                      {asgn.attached_resources.map((res) => (
                        <a
                          key={res.id}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium hover:bg-indigo-100 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {res.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  {isTeacher ? (
                    <>
                      <div className="text-xs text-gray-500">
                        {submissions.filter(s => s.assignment_id === asgn.id).length} Submissions
                      </div>
                      <button
                        onClick={() => {
                          setSelectedAssignment(asgn);
                          setActiveTab('submissions');
                        }}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-1"
                      >
                        View Submissions
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      {studentSubmission ? (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          {studentSubmission.status === 'GRADED' 
                            ? `Graded: ${studentSubmission.obtained_marks}/${asgn.max_marks}`
                            : 'Submitted'}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-yellow-600 text-sm font-medium">
                          <AlertCircle className="w-4 h-4" />
                          Pending
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setSelectedAssignment(asgn);
                          setShowSubmissionModal(true);
                        }}
                        disabled={!!studentSubmission || asgn.status !== 'ACTIVE'}
                        className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                          studentSubmission || asgn.status !== 'ACTIVE'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {studentSubmission ? 'View Submission' : 'Submit Homework'}
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Assignment Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-gray-900">Create New Assignment</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleCreateAssignment} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
                    <input
                      required
                      type="text"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="e.g., Algebra Basics Homework"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      required
                      rows={3}
                      value={newAssignment.description}
                      onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      placeholder="Explain the task and instructions..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select
                      required
                      value={newAssignment.class_id}
                      onChange={(e) => setNewAssignment({ ...newAssignment, class_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="">Select Class</option>
                      {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.section})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                      required
                      value={newAssignment.subject_id}
                      onChange={(e) => setNewAssignment({ ...newAssignment, subject_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      required
                      type="date"
                      value={newAssignment.due_date}
                      onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks</label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={newAssignment.max_marks}
                      onChange={(e) => setNewAssignment({ ...newAssignment, max_marks: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Attach Taleem360 Resources
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Resource Title"
                      value={newResource.title}
                      onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none"
                    />
                    <input
                      type="url"
                      placeholder="Taleem360 URL"
                      value={newResource.url}
                      onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddResource}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
                    >
                      Add Resource
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newAssignment.attached_resources?.map((res) => (
                      <div key={res.id} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                        {res.title}
                        <button type="button" onClick={() => handleRemoveResource(res.id)} className="hover:text-indigo-900">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md"
                  >
                    Create Assignment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submission Modal */}
      <AnimatePresence>
        {showSubmissionModal && selectedAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Submit Homework</h2>
                <button onClick={() => setShowSubmissionModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmitAssignment} className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{selectedAssignment.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{selectedAssignment.subject_name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Answer</label>
                  <textarea
                    required
                    rows={5}
                    value={submissionData.text_answer}
                    onChange={(e) => setSubmissionData({ ...submissionData, text_answer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    placeholder="Type your answer here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File URL (Optional)</label>
                  <input
                    type="url"
                    value={submissionData.file_url}
                    onChange={(e) => setSubmissionData({ ...submissionData, file_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Link to your document (Google Drive, etc.)"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmissionModal(false)}
                    className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    Submit Now
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grade Modal */}
      <AnimatePresence>
        {showGradeModal && selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Grade Submission</h2>
                <button onClick={() => setShowGradeModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Student Answer</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap">
                    {selectedSubmission.text_answer}
                  </div>
                  {selectedSubmission.file_url && (
                    <a
                      href={selectedSubmission.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 text-indigo-600 hover:underline text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Attached File
                    </a>
                  )}
                </div>

                <form onSubmit={handleGradeSubmission} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marks (Max: {assignments.find(a => a.id === selectedSubmission.assignment_id)?.max_marks})
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      max={assignments.find(a => a.id === selectedSubmission.assignment_id)?.max_marks}
                      value={gradingData.marks}
                      onChange={(e) => setGradingData({ ...gradingData, marks: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                    <textarea
                      required
                      rows={3}
                      value={gradingData.feedback}
                      onChange={(e) => setGradingData({ ...gradingData, feedback: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      placeholder="Provide constructive feedback..."
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowGradeModal(false)}
                      className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-md"
                    >
                      Save Grade
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
