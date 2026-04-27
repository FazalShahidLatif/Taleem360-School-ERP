import React, { useState } from 'react';
import { UserPlus, Save, X, Camera, FileText, Users, Phone, Home, Book } from 'lucide-react';

export const AdmissionForm: React.FC = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Student Admission</h1>
          <p className="text-gray-500">Register a new student to the institution</p>
        </div>
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step === s ? 'bg-indigo-600 text-white' : 
                step > s ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Form Header */}
        <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">
            {step === 1 && 'Personal Information'}
            {step === 2 && 'Guardian Details'}
            {step === 3 && 'Academic & Documents'}
          </h3>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Step {step} of 3</span>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-500 hover:text-indigo-500 cursor-pointer transition-all">
                    <Camera className="w-8 h-8 mb-2" />
                    <span className="text-[10px] font-medium uppercase">Upload Photo</span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500">
                      <option>A+</option>
                      <option>B+</option>
                      <option>O+</option>
                      <option>AB+</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" defaultValue="Pakistani" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Islam" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                  <textarea rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Street address, City, State, Zip"></textarea>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Occupation</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Phone Number</label>
                  <input type="tel" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="+92 3XX XXXXXXX" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Person</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admission Class</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    <option>Grade 1</option>
                    <option>Grade 2</option>
                    <option>Grade 3</option>
                    <option>Grade 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Previous School (if any)</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Required Documents (Upload)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Birth Certificate / B-Form',
                    'Previous School Leaving Certificate',
                    'Father\'s CNIC Copy',
                    'Passport Size Photographs (4)'
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-gray-50">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-xs text-gray-600">{doc}</span>
                      </div>
                      <button className="text-indigo-600 text-xs font-bold hover:underline">Upload</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-between">
          <button 
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            Back
          </button>
          <div className="flex space-x-3">
            <button className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              Cancel
            </button>
            {step < 3 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
              >
                Continue
              </button>
            ) : (
              <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-colors flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Complete Admission
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
