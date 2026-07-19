import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../lib/auth';
import { 
  Camera, 
  FileText, 
  Check, 
  Trash2, 
  Save, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  User,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup: string;
  nationality: string;
  religion: string;
  address: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  phone: string;
  emergencyContact: string;
  admissionClass: string;
  previousSchool: string;
}

export const AdmissionForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [classes, setClasses] = useState<any[]>([]);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE',
    bloodGroup: 'A+',
    nationality: 'Pakistani',
    religion: 'Islam',
    address: '',
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    phone: '',
    emergencyContact: '',
    admissionClass: '',
    previousSchool: ''
  });

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [successData, setSuccessData] = useState<any | null>(null);

  // Load classes for the admission dropdown
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/classes/');
        setClasses(res.data || []);
        if (res.data && res.data.length > 0) {
          setFormData(prev => ({ ...prev, admissionClass: res.data[0].id || res.data[0].name }));
        }
      } catch (err) {
        console.error("Failed to load classes", err);
      }
    };
    fetchClasses();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocuments(prev => ({
        ...prev,
        [docName]: file.name
      }));
    }
  };

  const handleRemoveDocument = (docName: string) => {
    setDocuments(prev => {
      const copy = { ...prev };
      delete copy[docName];
      return copy;
    });
  };

  const validateStep = (currentStep: number): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.firstName.trim()) errors.firstName = 'First name is required';
      if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
      if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
      if (!formData.address.trim()) errors.address = 'Residential address is required';
    } else if (currentStep === 2) {
      if (!formData.fatherName.trim()) errors.fatherName = "Father's name is required";
      if (!formData.phone.trim()) {
        errors.phone = 'Guardian phone number is required';
      } else if (!/^\+?[\d\s-]{7,15}$/.test(formData.phone.trim())) {
        errors.phone = 'Please enter a valid phone number';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleCompleteAdmission = async () => {
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);
    const enrollmentNumber = `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      enrollment_number: enrollmentNumber,
      parent_name: formData.fatherName,
      date_of_birth: formData.dateOfBirth,
      gender: formData.gender,
      address: formData.address,
      phone: formData.phone,
      blood_group: formData.bloodGroup,
      admission_date: new Date().toISOString().split('T')[0],
      previous_school: formData.previousSchool || 'N/A',
      academic_history: `Class: ${formData.admissionClass}`,
      avatar_url: photoUrl || undefined,
      uploaded_documents: Object.keys(documents).map(key => ({ name: key, file_name: documents[key] }))
    };

    try {
      await api.post('/students/', payload);
      setSuccessData({
        enrollmentNumber,
        fullName: `${formData.firstName} ${formData.lastName}`,
        admissionClass: formData.admissionClass,
        dateOfBirth: formData.dateOfBirth,
        fatherName: formData.fatherName
      });
    } catch (error: any) {
      alert(error.message || 'Failed to register student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'MALE',
      bloodGroup: 'A+',
      nationality: 'Pakistani',
      religion: 'Islam',
      address: '',
      fatherName: '',
      fatherOccupation: '',
      motherName: '',
      phone: '',
      emergencyContact: '',
      admissionClass: classes[0]?.id || classes[0]?.name || 'Grade 1',
      previousSchool: ''
    });
    setPhotoUrl(null);
    setDocuments({});
    setStep(1);
    setSuccessData(null);
    setValidationErrors({});
  };

  if (successData) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden text-center p-8 sm:p-12">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm animate-bounce">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Admission Completed Successfully!</h2>
          <p className="text-sm text-emerald-700 bg-emerald-50 rounded-full px-4 py-1.5 inline-block font-semibold mb-8">
            Roll Number Assigned: {successData.enrollmentNumber}
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Student Profile Receipt</h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm font-sans">
              <div>
                <span className="block text-xs text-gray-400">Full Name</span>
                <span className="font-bold text-gray-800">{successData.fullName}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400">Class Assigned</span>
                <span className="font-bold text-gray-800">{successData.admissionClass}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400">Guardian Name</span>
                <span className="font-bold text-gray-800">{successData.fatherName}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400">Date of Birth</span>
                <span className="font-bold text-gray-800">{new Date(successData.dateOfBirth).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleResetForm}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Register Another Student
            </button>
            <button
              onClick={() => navigate('/students')}
              className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Go to Student Directory
            </button>
          </div>
        </div>
      </div>
    );
  }

  const docTypes = [
    'Birth Certificate / B-Form',
    'Previous School Leaving Certificate',
    'Father\'s CNIC Copy',
    'Passport Size Photographs (4)'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">New Student Admission</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Register a new student to the institution</p>
        </div>
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step === s ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 
                step > s ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Form Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">
            {step === 1 && 'Personal Information'}
            {step === 2 && 'Guardian Details'}
            {step === 3 && 'Academic & Documents'}
          </h3>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Step {step} of 3</span>
        </div>

        <div className="p-6 sm:p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-500 hover:text-indigo-500 cursor-pointer transition-all overflow-hidden group">
                    {photoUrl ? (
                      <>
                        <img src={photoUrl} className="w-full h-full object-cover" alt="Student profile" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-medium">
                          <Camera className="w-6 h-6 mb-1" />
                          Change
                        </div>
                      </>
                    ) : (
                      <>
                        <Camera className="w-8 h-8 mb-2" />
                        <span className="text-[10px] font-medium uppercase text-center px-2">Upload Photo</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handlePhotoUpload} 
                    />
                  </div>
                  {photoUrl && (
                    <button 
                      type="button" 
                      onClick={() => setPhotoUrl(null)} 
                      className="mt-2 text-[10px] text-red-500 font-medium hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove Photo
                    </button>
                  )}
                </div>
                
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">First Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className={`w-full px-4 py-2.5 border rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        validationErrors.firstName ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'
                      }`} 
                      placeholder="e.g. Ali" 
                    />
                    {validationErrors.firstName && (
                      <p className="mt-1 text-[10px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {validationErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Last Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className={`w-full px-4 py-2.5 border rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        validationErrors.lastName ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'
                      }`} 
                      placeholder="e.g. Khan" 
                    />
                    {validationErrors.lastName && (
                      <p className="mt-1 text-[10px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {validationErrors.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Date of Birth <span className="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className={`w-full px-4 py-2.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        validationErrors.dateOfBirth ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'
                      }`} 
                    />
                    {validationErrors.dateOfBirth && (
                      <p className="mt-1 text-[10px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {validationErrors.dateOfBirth}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Gender</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Blood Group</label>
                  <select 
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option>A+</option>
                    <option>B+</option>
                    <option>O+</option>
                    <option>AB+</option>
                    <option>A-</option>
                    <option>B-</option>
                    <option>O-</option>
                    <option>AB-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nationality</label>
                  <input 
                    type="text" 
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Nationality" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Religion</label>
                  <input 
                    type="text" 
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="e.g. Islam" 
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Residential Address <span className="text-red-500">*</span></label>
                  <textarea 
                    rows={2} 
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      validationErrors.address ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'
                    }`} 
                    placeholder="Street address, City, State, Zip"
                  ></textarea>
                  {validationErrors.address && (
                    <p className="mt-1 text-[10px] text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {validationErrors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Father's Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      validationErrors.fatherName ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'
                    }`} 
                    placeholder="Father's Full Name"
                  />
                  {validationErrors.fatherName && (
                    <p className="mt-1 text-[10px] text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {validationErrors.fatherName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Father's Occupation</label>
                  <input 
                    type="text" 
                    value={formData.fatherOccupation}
                    onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="e.g. Business, Engineer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Mother's Name</label>
                  <input 
                    type="text" 
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Mother's Full Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Guardian Phone Number <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      validationErrors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'
                    }`} 
                    placeholder="e.g. 03001234567" 
                  />
                  {validationErrors.phone && (
                    <p className="mt-1 text-[10px] text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {validationErrors.phone}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Emergency Contact Person & Phone</label>
                  <input 
                    type="text" 
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="e.g. Sajid Khan (Uncle) - 03219876543"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Admission Class <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.admissionClass}
                    onChange={(e) => setFormData({ ...formData, admissionClass: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {classes.length > 0 ? (
                      classes.map((cls) => (
                        <option key={cls.id} value={cls.id || cls.name}>{cls.name}</option>
                      ))
                    ) : (
                      ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'].map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Previous School (if any)</label>
                  <input 
                    type="text" 
                    value={formData.previousSchool}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="e.g. Beaconhouse, N/A"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Required Documents (Upload)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {docTypes.map((doc, i) => {
                    const isUploaded = !!documents[doc];
                    const uploadedName = documents[doc];
                    return (
                      <div key={i} className="flex flex-col p-3 border border-gray-200 rounded-xl bg-gray-50 transition-all hover:bg-white hover:shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center min-w-0">
                            <FileText className={`w-4 h-4 mr-2 flex-shrink-0 ${isUploaded ? 'text-emerald-500' : 'text-gray-400'}`} />
                            <span className="text-xs text-gray-600 truncate font-medium">{doc}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isUploaded ? (
                              <>
                                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  Done
                                </span>
                                <button 
                                  type="button"
                                  onClick={() => handleRemoveDocument(doc)}
                                  className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                                  title="Remove uploaded document"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <label className="text-indigo-600 text-xs font-bold hover:underline cursor-pointer select-none">
                                Upload
                                <input 
                                  type="file" 
                                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                  className="hidden" 
                                  onChange={(e) => handleDocumentUpload(doc, e)} 
                                />
                              </label>
                            )}
                          </div>
                        </div>
                        {isUploaded && (
                          <div className="mt-1.5 pl-6 text-[10px] text-gray-500 font-mono truncate">
                            File: {uploadedName}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <button 
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex space-x-3">
            <button 
              onClick={handleResetForm}
              className="px-5 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition-all"
            >
              Cancel
            </button>
            {step < 3 ? (
              <button 
                onClick={handleNextStep}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleCompleteAdmission}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Complete Admission
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
