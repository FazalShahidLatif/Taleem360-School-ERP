import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/auth';
import { Class, Student, AttendanceStatus, UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { Check, X, AlertCircle } from 'lucide-react';

export const Attendance: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      if (user) {
        if (user.role !== UserRole.TEACHER) {
           setError("Access Denied: Attendance Management is for Teachers only.");
           return;
        }

        try {
          const res = await api.get("/classes/");
          // Filter logic could be moved to backend, but we filter here for now as per previous logic
          const teacherClasses = res.data.filter((c: Class) => c.class_teacher === user.id);
          setClasses(teacherClasses);
          
          if (teacherClasses.length > 0) {
            setSelectedClass(teacherClasses[0].id);
          }
        } catch (e: any) {
          setError("Failed to fetch classes: " + e.message);
        }
      }
    };
    init();
  }, [user]);

  useEffect(() => {
    const loadState = async () => {
      if (selectedClass && user) {
        try {
          // Fetch students in this class
          const studRes = await api.get(`/students/by_class/?class_id=${selectedClass}`);
          setStudents(studRes.data);
          
          // Fetch existing attendance
          const attRes = await api.get("/attendance/");
          const existing = attRes.data.filter((a: any) => a.class_obj === selectedClass && a.date === attendanceDate);
          
          const state: Record<string, AttendanceStatus> = {};
          studRes.data.forEach((s: Student) => {
            const record = existing.find((e: any) => e.student === s.id);
            state[s.id] = record ? record.status : 'PRESENT';
          });
          setAttendanceState(state);
        } catch (e: any) {
          setError("Failed to load data: " + e.message);
        }
      }
    };
    loadState();
  }, [selectedClass, attendanceDate, user]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    setLoading(true);
    try {
      const records = Object.entries(attendanceState).map(([studentId, status]) => ({
        student: studentId,
        class_obj: selectedClass,
        date: attendanceDate,
        status: status as AttendanceStatus
      }));

      await api.post("/attendance/", records);
      alert('Attendance saved successfully!');
    } catch (e: any) {
      alert(`Error saving attendance: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900">No classes assigned</h3>
        <p className="mt-1 text-sm text-gray-500">You need to be assigned to a class to mark attendance.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">Mark Attendance</h2>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <input 
            type="date" 
            className="border rounded-md px-3 py-2 text-sm"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
          <Button onClick={saveAttendance} loading={loading}>
            Save Attendance
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg mb-6 p-4">
        <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select 
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => {
                const newState = { ...attendanceState };
                students.forEach(s => newState[s.id] = 'PRESENT');
                setAttendanceState(newState);
              }}
              disabled={students.length === 0}
            >
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Mark All Present
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => {
                const newState = { ...attendanceState };
                students.forEach(s => newState[s.id] = 'ABSENT');
                setAttendanceState(newState);
              }}
              disabled={students.length === 0}
            >
              <X className="w-4 h-4 mr-2 text-red-600" />
              Mark All Absent
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {students.map((student) => (
            <li key={student.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                  {student.first_name.charAt(0)}
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-indigo-600">{student.first_name} {student.last_name}</div>
                  <div className="text-sm text-gray-500">ID: {student.enrollment_number}</div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusChange(student.id, 'PRESENT')}
                  className={`inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-full ${
                    attendanceState[student.id] === 'PRESENT' 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Check className="w-3 h-3 mr-1" /> Present
                </button>
                <button
                  onClick={() => handleStatusChange(student.id, 'ABSENT')}
                  className={`inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-full ${
                    attendanceState[student.id] === 'ABSENT' 
                      ? 'bg-red-100 text-red-800 border-red-200' 
                      : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <X className="w-3 h-3 mr-1" /> Absent
                </button>
              </div>
            </li>
          ))}
          {students.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No students enrolled in this class yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};