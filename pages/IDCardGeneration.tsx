import React, { useState } from 'react';
import { IdCard, Printer, Download, Search, Filter, User, School as SchoolIcon, QrCode } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  class: string;
  rollNo: string;
  photo: string;
  bloodGroup: string;
  validUntil: string;
}

const mockStudents: Student[] = [
  { id: '1', name: 'Zaid Ahmed', class: 'Grade 10-A', rollNo: '2026-1001', photo: 'https://picsum.photos/seed/student1/100/100', bloodGroup: 'O+', validUntil: 'Mar 2027' },
  { id: '2', name: 'Fatima Noor', class: 'Grade 9-B', rollNo: '2026-0902', photo: 'https://picsum.photos/seed/student2/100/100', bloodGroup: 'A-', validUntil: 'Mar 2027' },
  { id: '3', name: 'Ali Raza', class: 'Grade 8-C', rollNo: '2026-0805', photo: 'https://picsum.photos/seed/student3/100/100', bloodGroup: 'B+', validUntil: 'Mar 2027' },
];

export const IDCardGeneration: React.FC = () => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleStudent = (id: string) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ID Card Generation</h1>
          <p className="text-gray-500">Generate and print professional ID cards for students and staff</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2 text-gray-400" />
            Download PDF
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <Printer className="w-4 h-4 mr-2" />
            Print Selected ({selectedStudents.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selection List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {mockStudents.map((student) => (
                <div 
                  key={student.id}
                  onClick={() => toggleStudent(student.id)}
                  className={`p-4 border-b border-gray-50 cursor-pointer transition-colors flex items-center justify-between ${
                    selectedStudents.includes(student.id) ? 'bg-indigo-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <img src={student.photo} alt={student.name} className="w-10 h-10 rounded-full border border-gray-200 mr-3" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.class}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedStudents.includes(student.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                  }`}>
                    {selectedStudents.includes(student.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[600px] flex flex-col items-center justify-center">
            {selectedStudents.length === 0 ? (
              <div className="text-center text-gray-400">
                <IdCard className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Select students from the list to preview ID cards</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {mockStudents.filter(s => selectedStudents.includes(s.id)).map((student) => (
                  <div key={student.id} className="w-[300px] h-[480px] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col relative">
                    {/* Header */}
                    <div className="bg-indigo-600 p-4 text-white text-center">
                      <div className="flex items-center justify-center mb-1">
                        <SchoolIcon className="w-5 h-5 mr-2" />
                        <span className="text-sm font-bold tracking-wider uppercase">Taleem360 School</span>
                      </div>
                      <p className="text-[10px] opacity-80">Empowering Future Generations</p>
                    </div>
                    
                    {/* Photo */}
                    <div className="flex-1 flex flex-col items-center pt-8 px-6 text-center">
                      <div className="w-28 h-28 rounded-2xl border-4 border-indigo-50 overflow-hidden mb-4 shadow-md">
                        <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{student.name}</h3>
                      <p className="text-sm font-medium text-indigo-600 mb-6 uppercase tracking-widest">Student</p>
                      
                      <div className="w-full space-y-3 text-left">
                        <div className="flex justify-between border-b border-gray-100 pb-1">
                          <span className="text-[10px] text-gray-400 uppercase">Roll Number</span>
                          <span className="text-xs font-bold text-gray-700">{student.rollNo}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-1">
                          <span className="text-[10px] text-gray-400 uppercase">Class</span>
                          <span className="text-xs font-bold text-gray-700">{student.class}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-1">
                          <span className="text-[10px] text-gray-400 uppercase">Blood Group</span>
                          <span className="text-xs font-bold text-gray-700">{student.bloodGroup}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-1">
                          <span className="text-[10px] text-gray-400 uppercase">Valid Until</span>
                          <span className="text-xs font-bold text-gray-700">{student.validUntil}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-[8px] text-gray-400 uppercase">Authorized Signature</p>
                        <div className="h-6 w-20 border-b border-gray-300 mt-1" />
                      </div>
                      <QrCode className="w-10 h-10 text-gray-700" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
