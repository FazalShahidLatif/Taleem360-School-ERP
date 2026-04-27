import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/auth';
import { ReportCard, Student, UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { 
  FileText, 
  Download, 
  Printer, 
  Search, 
  Plus,
  ChevronRight,
  GraduationCap,
  Calendar,
  User as UserIcon
} from 'lucide-react';

export const ReportCards: React.FC = () => {
  const { user } = useAuth();
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateData, setGenerateData] = useState({
    student_id: '',
    term: 'Final Term',
    academic_year: '2025-2026'
  });

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  const isTeacher = user?.role === UserRole.TEACHER;
  const isParent = user?.role === UserRole.PARENT;

  const fetchData = async () => {
    setLoading(true);
    try {
      const reportsRes = await api.get('/academic/report-cards/');
      setReportCards(reportsRes.data);

      if (isAdmin || isTeacher) {
        const studentsRes = await api.get('/students/');
        setStudents(studentsRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch report cards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/academic/report-cards/generate/', generateData);
      setReportCards([...reportCards, res.data]);
      setShowGenerateModal(false);
      setSelectedReport(res.data);
    } catch (error) {
      alert('Failed to generate report card. Ensure student is enrolled and has exam results.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate flex items-center">
            <GraduationCap className="w-8 h-8 mr-3 text-indigo-600" />
            Academic Report Cards
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Generate and view student performance reports.
          </p>
        </div>
        {(isAdmin || isTeacher) && (
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button onClick={() => setShowGenerateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Generate Report Card
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Card List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900 text-sm">Recent Reports</h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {reportCards.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group ${
                    selectedReport?.id === report.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                  }`}
                >
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {report.student_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {report.term} • {report.academic_year}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors ${
                    selectedReport?.id === report.id ? 'text-indigo-500' : ''
                  }`} />
                </button>
              ))}
              {reportCards.length === 0 && !loading && (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No report cards found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Report Card Preview */}
        <div className="lg:col-span-2">
          {selectedReport ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50 no-print">
                <h3 className="font-bold text-gray-900">Report Card Preview</h3>
                <div className="flex space-x-2">
                  <Button variant="secondary" onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="secondary">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>

              <div id="report-card-content" className="p-8 space-y-8 print:p-0">
                {/* Header */}
                <div className="text-center space-y-2 border-b-2 border-indigo-600 pb-6">
                  <h1 className="text-3xl font-black text-indigo-600 uppercase tracking-widest">Taleem360 ERP</h1>
                  <h2 className="text-xl font-bold text-gray-900">ACADEMIC PROGRESS REPORT</h2>
                  <p className="text-gray-500 font-medium">{selectedReport.term} - {selectedReport.academic_year}</p>
                </div>

                {/* Student Info */}
                <div className="grid grid-cols-2 gap-8 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <UserIcon className="w-4 h-4 mr-3 text-indigo-500" />
                      <span className="text-gray-500 w-24">Student Name:</span>
                      <span className="font-bold text-gray-900">{selectedReport.student_name}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <GraduationCap className="w-4 h-4 mr-3 text-indigo-500" />
                      <span className="text-gray-500 w-24">Class:</span>
                      <span className="font-bold text-gray-900">{selectedReport.class_name}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-3 text-indigo-500" />
                      <span className="text-gray-500 w-24">Issue Date:</span>
                      <span className="font-bold text-gray-900">{selectedReport.issue_date}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FileText className="w-4 h-4 mr-3 text-indigo-500" />
                      <span className="text-gray-500 w-24">Attendance:</span>
                      <span className="font-bold text-gray-900">{selectedReport.attendance_percentage}%</span>
                    </div>
                  </div>
                </div>

                {/* Marks Table */}
                <div className="overflow-hidden rounded-2xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Total Marks</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Obtained</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedReport.subjects.map((sub, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{sub.subject_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{sub.total_marks}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-indigo-600">{sub.marks_obtained}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`px-3 py-1 rounded-lg text-xs font-black ${
                              sub.grade === 'A+' || sub.grade === 'A' ? 'bg-green-100 text-green-700' :
                              sub.grade === 'B' || sub.grade === 'C' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {sub.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic">{sub.remarks || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-indigo-600 text-white">
                      <tr>
                        <td className="px-6 py-4 font-black uppercase tracking-wider">Grand Total</td>
                        <td className="px-6 py-4 text-center font-black">{selectedReport.total_marks}</td>
                        <td className="px-6 py-4 text-center font-black">{selectedReport.obtained_marks}</td>
                        <td className="px-6 py-4 text-center font-black">{selectedReport.percentage.toFixed(1)}%</td>
                        <td className="px-6 py-4 text-right font-black">GRADE: {selectedReport.grade}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Footer / Remarks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-gray-900 uppercase">Class Teacher's Remarks</h4>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm italic text-gray-600 min-h-[80px]">
                      {selectedReport.teacher_remarks}
                    </div>
                  </div>
                  <div className="flex flex-col justify-end items-end space-y-8">
                    <div className="w-48 border-b border-gray-900"></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-900">Principal's Signature</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center space-y-4">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No Report Selected</h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                Select a student from the list to view their academic progress report.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Report Card</h3>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                <select
                  required
                  value={generateData.student_id}
                  onChange={(e) => setGenerateData({ ...generateData, student_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Choose a student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.enrollment_number})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
                  <select
                    value={generateData.term}
                    onChange={(e) => setGenerateData({ ...generateData, term: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Mid Term">Mid Term</option>
                    <option value="Final Term">Final Term</option>
                    <option value="First Term">First Term</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                  <select
                    value={generateData.academic_year}
                    onChange={(e) => setGenerateData({ ...generateData, academic_year: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="2025-2026">2025-2026</option>
                    <option value="2024-2025">2024-2025</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="secondary" onClick={() => setShowGenerateModal(false)}>Cancel</Button>
                <Button type="submit">Generate Now</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          #report-card-content {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
