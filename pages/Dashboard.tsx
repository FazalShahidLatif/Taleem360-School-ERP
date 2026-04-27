import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import api from '../lib/api';
import { UserRole, DashboardStats, ParentDashboardData } from '../types';
import { Users, BookOpen, UserCheck, School, CheckCircle, XCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    students: 0,
    teachers: 0,
    classes: 0,
  });
  const [parentData, setParentData] = useState<ParentDashboardData | null>(null);

  useEffect(() => {
    if (user) {
      if (user.role === UserRole.PARENT) {
        api.get("/parent-dashboard/")
          .then(res => setParentData(res.data))
          .catch(console.error);
      } else {
        api.get("/dashboard/")
          .then(res => setStats(res.data))
          .catch(console.error);
      }
    }
  }, [user]);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-3 rounded-md ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-3xl font-semibold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {user?.role === UserRole.ADMIN 
            ? 'Admin Dashboard' 
            : user?.role === UserRole.PARENT 
              ? 'Parent Portal'
              : `Welcome, ${user?.name}`}
        </h1>
        {user?.school_name && (
          <p className="mt-1 flex items-center text-sm text-gray-500">
            <School className="w-4 h-4 mr-1.5" />
            {user.school_name}
          </p>
        )}
      </div>

      {user?.role === UserRole.ADMIN && (
        <div className="grid grid-cols-1 gap-5 mb-8">
          <StatCard 
            title="Total Students" 
            value={stats.students} 
            icon={Users} 
            color="bg-indigo-500" 
          />
          <StatCard 
            title="Total Teachers" 
            value={stats.teachers} 
            icon={UserCheck} 
            color="bg-green-500" 
          />
          <StatCard 
            title="Active Classes" 
            value={stats.classes} 
            icon={BookOpen} 
            color="bg-orange-500" 
          />
        </div>
      )}

      {user?.role === UserRole.PARENT && parentData && (
        <div className="space-y-6">
          <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Student Profile</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Student Name</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{parentData.student_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Enrolled Classes</dt>
                <dd className="mt-1 text-sm text-gray-900 flex flex-wrap gap-2">
                  {parentData.classes.map((cls, idx) => (
                    <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">
                      {cls}
                    </span>
                  ))}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Attendance</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {parentData.attendance.length > 0 ? parentData.attendance.map((record, index) => (
                <li key={index} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{record.date}</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${
                    record.status === 'PRESENT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {record.status === 'PRESENT' ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <XCircle className="w-3 h-3 mr-1" />
                    )}
                    {record.status}
                  </span>
                </li>
              )) : (
                <li className="px-4 py-4 text-sm text-gray-500">No attendance records found.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {user?.role !== UserRole.PARENT && (
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">System Status</h3>
          <p className="mt-2 text-sm text-gray-600">
            Connected to Taleem360 API at <code>{api.defaults.baseURL}</code>.
            Authorization via JWT Bearer token.
            <span className="block mt-2 font-medium text-indigo-600">
              Current Tenant: {user?.school_name} (ID: {user?.school_id})
            </span>
          </p>
        </div>
      )}
    </div>
  );
};