import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Layers, Filter, Check } from 'lucide-react';

export interface SidebarFilterProps {
  activeCategory?: string;
  activeSubject?: string;
  activeAgeGroup?: string;
  onFilterChange?: (filters: { category?: string; subject?: string; ageGroup?: string }) => void;
}

const CATEGORIES = [
  { id: 'mathematics', name: 'Mathematics', icon: BookOpen },
  { id: 'languages', name: 'Languages & Phonics', icon: GraduationCap },
  { id: 'sciences', name: 'Sciences & Physics', icon: Layers }
];

const SUBJECTS_BY_CAT: Record<string, Array<{ id: string; name: string }>> = {
  mathematics: [
    { id: 'all', name: 'All Topics' },
    { id: 'algebra', name: 'Algebra & Equations' },
    { id: 'geometry', name: 'Geometry & Theorems' },
    { id: 'fractions', name: 'Fractions & Decimals' },
    { id: 'trigonometry', name: 'Trigonometry & Bearings' }
  ],
  languages: [
    { id: 'all', name: 'All Topics' },
    { id: 'phonics', name: 'Phonics & Speech' },
    { id: 'literacy', name: 'Literacy & Tracing' }
  ],
  sciences: [
    { id: 'all', name: 'All Topics' },
    { id: 'physics', name: 'Physics & Kinetics' }
  ]
};

const AGE_GROUPS = [
  { id: 'all', name: 'All Age Groups / Grades' },
  { id: 'nursery', name: 'Early Years / Nursery' },
  { id: 'grade-2', name: 'Lower Primary (Grade 2)' },
  { id: 'grade-5', name: 'Upper Primary (Grade 5)' },
  { id: 'grade-8', name: 'Middle School (Grade 8)' },
  { id: 'grade-10', name: 'Secondary (Grade 10 / CAIE)' }
];

export const ResourceDirectorySidebar: React.FC<SidebarFilterProps> = ({
  activeCategory = 'mathematics',
  activeSubject = 'all',
  activeAgeGroup = 'all',
  onFilterChange
}) => {
  const navigate = useNavigate();

  const handleCategoryClick = (catId: string) => {
    if (onFilterChange) {
      onFilterChange({ category: catId, subject: 'all', ageGroup: 'all' });
    } else {
      navigate(`/free-resources/${catId}/all/all`);
    }
  };

  const handleSubjectClick = (subId: string) => {
    if (onFilterChange) {
      onFilterChange({ category: activeCategory, subject: subId, ageGroup: activeAgeGroup });
    } else {
      navigate(`/free-resources/${activeCategory}/${subId}/${activeAgeGroup}`);
    }
  };

  const handleAgeClick = (ageId: string) => {
    if (onFilterChange) {
      onFilterChange({ category: activeCategory, subject: activeSubject, ageGroup: ageId });
    } else {
      navigate(`/free-resources/${activeCategory}/${activeSubject}/${ageId}`);
    }
  };

  const currentSubjects = SUBJECTS_BY_CAT[activeCategory] || [{ id: 'all', name: 'All Topics' }];

  return (
    <aside className="w-full md:w-80 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl" id="resource-directory-sidebar">
      {/* Sidebar Header */}
      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-800">
        <Filter className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-bold tracking-tight text-white font-sans">Curriculum Hub</h2>
      </div>

      {/* 1. Category Hub Selection */}
      <div className="mb-6">
        <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase block mb-3">
          Educational Categories
        </span>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{cat.name}</span>
                </div>
                {isActive && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Subject/Topic Selector */}
      <div className="mb-6">
        <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase block mb-3">
          Topic / Core Skills
        </span>
        <div className="space-y-1">
          {currentSubjects.map((sub) => {
            const isActive = activeSubject === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => handleSubjectClick(sub.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-emerald-300 border-l-2 border-emerald-400 pl-3'
                    : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200 border-l-2 border-transparent'
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Age Groups / Standardized Levels */}
      <div>
        <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase block mb-3">
          Target Age Group & Grade
        </span>
        <div className="space-y-1">
          {AGE_GROUPS.map((age) => {
            const isActive = activeAgeGroup === age.id;
            return (
              <button
                key={age.id}
                onClick={() => handleAgeClick(age.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-emerald-300 border-l-2 border-emerald-400 pl-3'
                    : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200 border-l-2 border-transparent'
                }`}
              >
                {age.name}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
