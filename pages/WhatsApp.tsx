import React, { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  Users, 
  Megaphone, 
  FileText, 
  Calendar, 
  Gift, 
  Settings, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Bot
} from 'lucide-react';

interface BroadcastLog {
  id: string;
  type: 'Circular' | 'Announcement' | 'Event';
  message: string;
  recipients: string;
  status: 'sent' | 'pending' | 'failed';
  timestamp: string;
}

const mockLogs: BroadcastLog[] = [
  { id: '1', type: 'Circular', message: 'Final Exam Schedule for Grade 10', recipients: 'Parents (Grade 10)', status: 'sent', timestamp: '2026-03-10 10:30 AM' },
  { id: '2', type: 'Announcement', message: 'School closed tomorrow due to weather', recipients: 'All Staff & Students', status: 'sent', timestamp: '2026-03-09 04:15 PM' },
  { id: '3', type: 'Event', message: 'Annual Sports Day Invitation', recipients: 'All Parents', status: 'sent', timestamp: '2026-03-08 09:00 AM' },
];

export const WhatsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'birthday'>('broadcast');
  const [isAgentEnabled, setIsAgentEnabled] = useState(true);
  const [broadcastType, setBroadcastType] = useState<'Circular' | 'Announcement' | 'Event'>('Announcement');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState('All Students');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">WhatsApp Messaging</h1>
          <p className="text-gray-500">Broadcast announcements and manage automated messaging agents</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('broadcast')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'broadcast' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center">
            <Megaphone className="w-4 h-4 mr-2" />
            Broadcast
          </div>
        </button>
        <button
          onClick={() => setActiveTab('birthday')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'birthday' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center">
            <Gift className="w-4 h-4 mr-2" />
            Birthday Agent
          </div>
        </button>
      </div>

      {activeTab === 'broadcast' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Composer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-indigo-600" />
                Compose Broadcast
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Broadcast Type</label>
                    <select 
                      value={broadcastType}
                      onChange={(e) => setBroadcastType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>Circular</option>
                      <option>Announcement</option>
                      <option>Event</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                    <select 
                      value={recipientType}
                      onChange={(e) => setRecipientType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>All Students</option>
                      <option>All Staff</option>
                      <option>All Parents</option>
                      <option>Grade 10 Parents</option>
                      <option>Grade 9 Parents</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your WhatsApp message here..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-400">Emojis are supported. Message will be sent via official WhatsApp API.</p>
                </div>
                <div className="flex justify-end">
                  <button className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    <Send className="w-4 h-4 mr-2" />
                    Send Broadcast
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Logs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Broadcast History</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Type</th>
                      <th className="px-6 py-3 font-semibold">Message</th>
                      <th className="px-6 py-3 font-semibold">Recipients</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold">Sent At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.type === 'Circular' ? 'bg-blue-50 text-blue-700' : 
                            log.type === 'Announcement' ? 'bg-purple-50 text-purple-700' : 'bg-orange-50 text-orange-700'
                          }`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900 truncate max-w-xs">{log.message}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{log.recipients}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center text-emerald-600 text-sm">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Sent
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg shadow-indigo-100">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold">WhatsApp API Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Connection</span>
                  <span className="font-medium">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Daily Limit</span>
                  <span className="font-medium">5,000 / 10,000</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div className="bg-white h-2 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Broadcasting Tips</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 mt-0.5" />
                  Keep messages concise and clear.
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 mt-0.5" />
                  Use emojis to make messages engaging.
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 mt-0.5" />
                  Include links for detailed circulars.
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Config */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mr-4">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Auto Birthday Wishing Agent</h3>
                    <p className="text-sm text-gray-500">Automatically sends personalized wishes on birthdays</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAgentEnabled(!isAgentEnabled)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isAgentEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isAgentEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500 mr-2" />
                        <span className="text-sm text-gray-600">Students</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500 mr-2" />
                        <span className="text-sm text-gray-600">Staff Members</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Send Time</label>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <input type="time" defaultValue="09:00" className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message Template</label>
                  <textarea
                    rows={4}
                    defaultValue="Happy Birthday, {name}! 🎂 Wishing you a wonderful day filled with joy and success. From Taleem360 Team."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200 cursor-pointer hover:bg-gray-200">{'{name}'}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200 cursor-pointer hover:bg-gray-200">{'{role}'}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200 cursor-pointer hover:bg-gray-200">{'{school_name}'}</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>

            {/* Today's Birthdays */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Today's Birthdays (Sent)</h3>
              <div className="space-y-4">
                {[
                  { name: 'Ahmed Khan', role: 'Student (Grade 8)', time: '09:00 AM' },
                  { name: 'Sarah Wilson', role: 'Teacher (Mathematics)', time: '09:01 AM' },
                  { name: 'Zainab Ali', role: 'Student (Grade 10)', time: '09:02 AM' },
                ].map((bday, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 border border-gray-200">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{bday.name}</p>
                        <p className="text-xs text-gray-500">{bday.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-emerald-600 font-medium flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Sent
                      </span>
                      <p className="text-[10px] text-gray-400">{bday.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Gift className="w-6 h-6 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Agent Stats</span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-emerald-800 opacity-80">Wishes Sent (This Month)</p>
                  <p className="text-2xl font-bold text-emerald-900">142</p>
                </div>
                <div>
                  <p className="text-sm text-emerald-800 opacity-80">Success Rate</p>
                  <p className="text-2xl font-bold text-emerald-900">99.8%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
                Agent Skills
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 mr-2" />
                  Automatic daily scan of database.
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 mr-2" />
                  Personalized name replacement.
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 mr-2" />
                  Multi-role support (Staff/Students).
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 mr-2" />
                  Time-scheduled delivery.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
