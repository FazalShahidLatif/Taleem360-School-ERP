import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Upload, 
  Download, 
  RefreshCw, 
  Languages, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  FileSpreadsheet,
  Globe,
  HardDrive,
  Cloud,
  Zap
} from 'lucide-react';

export const DataManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'backup' | 'import' | 'languages'>('backup');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('English');
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Simulate IP-based language detection
  useEffect(() => {
    const timer = setTimeout(() => {
      setDetectedLanguage('Urdu'); // Simulated detection for Pakistan IP
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => setIsBackingUp(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Management & Systems</h1>
          <p className="text-gray-500">Manage backups, data imports, and regional settings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'backup' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center">
            <Database className="w-4 h-4 mr-2" />
            Backup & Recovery
          </div>
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'import' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            CSV Import
          </div>
        </button>
        <button
          onClick={() => setActiveTab('languages')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'languages' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center">
            <Languages className="w-4 h-4 mr-2" />
            Regional Settings
          </div>
        </button>
      </div>

      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Backup Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-emerald-500" />
                Data Integrity & Backup Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                  <div className="flex items-center justify-between mb-2">
                    <Cloud className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-600 uppercase">Online</span>
                  </div>
                  <p className="text-sm text-indigo-900 font-bold">Cloud Sync Active</p>
                  <p className="text-xs text-indigo-700 mt-1">Last synced: 2 minutes ago</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center justify-between mb-2">
                    <HardDrive className="w-5 h-5 text-amber-600" />
                    <span className="text-xs font-bold text-amber-600 uppercase">Offline</span>
                  </div>
                  <p className="text-sm text-amber-900 font-bold">Local Backup Enabled</p>
                  <p className="text-xs text-amber-700 mt-1">Ensures data safety during power failure</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-4">
                      <Download className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Full System Backup</p>
                      <p className="text-xs text-gray-500">Download a complete snapshot of your institution's data</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleBackup}
                    disabled={isBackingUp}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                  >
                    {isBackingUp ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                    Generate Backup
                  </button>
                </div>
              </div>
            </div>

            {/* Backup Logs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Recent Backup Logs</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { type: 'Automatic', status: 'Success', size: '12.4 MB', time: 'Today, 09:00 AM' },
                  { type: 'Manual', status: 'Success', size: '12.2 MB', time: 'Yesterday, 04:30 PM' },
                  { type: 'Automatic', status: 'Success', size: '12.1 MB', time: 'Yesterday, 09:00 AM' },
                ].map((log, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{log.type} Backup</p>
                        <p className="text-xs text-gray-500">{log.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{log.size}</p>
                      <p className="text-xs text-emerald-600 font-bold uppercase">{log.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-rose-600 mr-3" />
                <h3 className="font-bold text-rose-900">Power Failure Protection</h3>
              </div>
              <p className="text-sm text-rose-800 mb-4">
                Our system uses advanced local caching to ensure no data is lost during sudden power outages. All unsynced changes are stored locally and uploaded automatically once power and internet are restored.
              </p>
              <div className="flex items-center text-xs font-bold text-rose-700 uppercase tracking-wider">
                <div className="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-pulse" />
                Real-time Protection Active
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'import' && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileSpreadsheet className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Import Previous Data via CSV</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Quickly upload your existing student, staff, or financial records using our standardized CSV templates.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button className="p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group">
                <div className="flex items-center mb-2">
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 mr-2" />
                  <span className="text-sm font-bold text-gray-900">Student Template</span>
                </div>
                <p className="text-xs text-gray-500">Download the format for student bulk upload</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group">
                <div className="flex items-center mb-2">
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 mr-2" />
                  <span className="text-sm font-bold text-gray-900">Staff Template</span>
                </div>
                <p className="text-xs text-gray-500">Download the format for staff bulk upload</p>
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 hover:border-indigo-500 transition-all cursor-pointer group">
              <Upload className="w-12 h-12 text-gray-300 group-hover:text-indigo-500 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop CSV file</p>
              <p className="text-xs text-gray-400 mt-1">Maximum file size: 10MB</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'languages' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mr-4">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Regional Language Settings</h3>
                  <p className="text-sm text-gray-500">Customize the application language based on your region</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full flex items-center">
                <Zap className="w-3 h-3 mr-1" />
                IP-Based Detection Active
              </div>
            </div>

            {detectedLanguage && detectedLanguage !== selectedLanguage && (
              <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center">
                  <Languages className="w-5 h-5 text-indigo-600 mr-3" />
                  <p className="text-sm text-indigo-900">
                    We detected your location. Would you like to switch to <span className="font-bold">{detectedLanguage}</span>?
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedLanguage(detectedLanguage)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
                >
                  Switch to {detectedLanguage}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'English', native: 'English', code: 'en' },
                { name: 'Urdu', native: 'اردو', code: 'ur' },
                { name: 'Sindhi', native: 'سنڌي', code: 'sd' },
                { name: 'Punjabi', native: 'پنجابی', code: 'pa' },
                { name: 'Pashto', native: 'پښتو', code: 'ps' },
                { name: 'Balochi', native: 'بلوچی', code: 'bal' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.name)}
                  className={`p-4 border rounded-xl flex items-center justify-between transition-all ${
                    selectedLanguage === lang.name 
                    ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100' 
                    : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">{lang.name}</p>
                    <p className="text-xs text-gray-500">{lang.native}</p>
                  </div>
                  {selectedLanguage === lang.name && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Automatic Translation</h4>
                  <p className="text-xs text-gray-500">Automatically translate system labels and messages</p>
                </div>
                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-indigo-600">
                  <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
