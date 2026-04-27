import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/auth';
import { Class, TimetableEntry, DayOfWeek, UserRole } from '../types';
import { Calendar, Clock, MapPin, User as UserIcon } from 'lucide-react';

export const Timetable: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'class' | 'teacher'>(user?.role === UserRole.TEACHER ? 'teacher' : 'class');

  const days = Object.values(DayOfWeek);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await api.get('/classes/');
        setClasses(res.data);
        if (res.data.length > 0 && !selectedClassId) {
          setSelectedClassId(res.data[0].id);
        }
      } catch (e) {
        console.error('Failed to load classes', e);
      }
    };

    if (user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER) {
      loadClasses();
    }
  }, [user]);

  useEffect(() => {
    const loadTimetable = async () => {
      if (!user) return;
      setLoading(true);
      try {
        let res;
        if (viewMode === 'teacher') {
          res = await api.get(`/timetable/teacher/${user.id}/`);
        } else if (selectedClassId) {
          res = await api.get(`/timetable/class/${selectedClassId}/`);
        }
        
        if (res) {
          setTimetable(res.data);
        }
      } catch (e) {
        console.error('Failed to load timetable', e);
      } finally {
        setLoading(false);
      }
    };

    loadTimetable();
  }, [selectedClassId, viewMode, user]);

  const getEntriesForDay = (day: DayOfWeek) => {
    return timetable
      .filter(entry => entry.day === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-indigo-600" />
            Class Timetable
          </h2>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex p-1 bg-gray-100 rounded-lg w-fit">
            <button
              onClick={() => setViewMode('class')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                viewMode === 'class' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Class-wise
            </button>
            {user?.role === UserRole.TEACHER && (
              <button
                onClick={() => setViewMode('teacher')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'teacher' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Schedule
              </button>
            )}
          </div>

          {viewMode === 'class' && (
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Select Class:</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-w-[150px]"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.section}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            Loading timetable...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {days.slice(0, 5).map((day) => {
              const entries = getEntriesForDay(day);
              return (
                <div key={day} className="flex flex-col h-full">
                  <div className="bg-indigo-50 border-b-2 border-indigo-200 p-3 rounded-t-lg">
                    <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider text-center">
                      {day}
                    </h3>
                  </div>
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-b-lg p-3 space-y-3 min-h-[400px]">
                    {entries.length > 0 ? (
                      entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-indigo-500 hover:shadow-md transition-shadow"
                        >
                          <div className="font-bold text-gray-900 mb-1">{entry.subject}</div>
                          <div className="space-y-2">
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1.5 text-indigo-400" />
                              {entry.start_time} - {entry.end_time}
                            </div>
                            {viewMode === 'class' && (
                              <div className="flex items-center text-xs text-gray-500">
                                <UserIcon className="w-3 h-3 mr-1.5 text-indigo-400" />
                                {entry.teacher_name}
                              </div>
                            )}
                            {entry.room && (
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPin className="w-3 h-3 mr-1.5 text-indigo-400" />
                                {entry.room}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">
                        No classes scheduled
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
