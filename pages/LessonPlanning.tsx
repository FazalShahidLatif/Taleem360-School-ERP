import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Calendar, 
  BookOpen, 
  Clock,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  CheckCircle2,
  Clock3
} from 'lucide-react';

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  class: string;
  date: string;
  duration: string;
  status: 'draft' | 'published' | 'archived';
}

const mockLessonPlans: LessonPlan[] = [
  { id: '1', title: 'Introduction to Photosynthesis', subject: 'Biology', class: 'Grade 9-A', date: '2026-03-15', duration: '45 mins', status: 'published' },
  { id: '2', title: 'Quadratic Equations Part 1', subject: 'Mathematics', class: 'Grade 10-B', date: '2026-03-16', duration: '60 mins', status: 'draft' },
  { id: '3', title: 'The Industrial Revolution', subject: 'History', class: 'Grade 8-C', date: '2026-03-14', duration: '50 mins', status: 'published' },
  { id: '4', title: 'Chemical Bonding Basics', subject: 'Chemistry', class: 'Grade 11-A', date: '2026-03-18', duration: '90 mins', status: 'draft' },
];

export const LessonPlanning: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlans = mockLessonPlans.filter(plan => 
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lesson Planning</h1>
          <p className="text-gray-500">Create and manage your educational content</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Plus className="w-4 h-4 mr-2" />
          New Lesson Plan
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search lesson plans..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
              <option>All Subjects</option>
              <option>Mathematics</option>
              <option>Biology</option>
              <option>History</option>
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
              <option>All Status</option>
              <option>Draft</option>
              <option>Published</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-semibold">Lesson Title</th>
                <th className="px-6 py-3 font-semibold">Subject & Class</th>
                <th className="px-6 py-3 font-semibold">Scheduled Date</th>
                <th className="px-6 py-3 font-semibold">Duration</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-900">{plan.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-900">{plan.subject}</div>
                      <div className="text-gray-500">{plan.class}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {plan.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {plan.duration}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      plan.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 
                      plan.status === 'draft' ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-700'
                    }`}>
                      {plan.status === 'published' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock3 className="w-3 h-3 mr-1" />}
                      {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
