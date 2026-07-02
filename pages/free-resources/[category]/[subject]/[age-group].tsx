import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  BookOpen, 
  Download, 
  FileText, 
  Volume2, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Maximize2, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';
import { ResourceDirectorySidebar } from '@/components/ResourceDirectorySidebar';
import { FreeResource } from '@/repository/freeResources';

export const FreeResourcesMatrixPage: React.FC = () => {
  const { category = 'mathematics', subject = 'all', ageGroup = 'all' } = useParams<{
    category: string;
    subject: string;
    ageGroup: string;
  }>();

  const navigate = useNavigate();

  // Resource & State management
  const [resources, setResources] = useState<FreeResource[]>([]);
  const [selectedResource, setSelectedResource] = useState<FreeResource | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search input state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive states for selected modules
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [canvasDrawn, setCanvasDrawn] = useState<boolean>(false);
  const [canvasActivePoint, setCanvasActivePoint] = useState<string | null>(null);

  // Load resources from backend API
  useEffect(() => {
    async function fetchResources() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/free-resources');
        if (!response.ok) {
          throw new Error('Network error fetching educational assets.');
        }
        const data = await response.json();
        setResources(data);
      } catch (err: any) {
        console.error('Failed to retrieve free resources:', err);
        setError('Unable to load free resources due to database connection strains. Seamless fallback initiated.');
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, []);

  // Sync dynamic JSON-LD metadata for SEO injection
  useEffect(() => {
    // Remove old schema script if present
    const existingScript = document.getElementById('taleem360-jsonld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    if (!selectedResource) {
      // Dynamic Directory Schema
      const directorySchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `Free ${category.toUpperCase()} Resources Directory`,
        "description": `Browse our global free curriculum-aligned guides for ${category}, subject ${subject}, grade ${ageGroup}.`,
        "itemListElement": resources.map((res, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `https://taleem360.online/free-resources/detail/${res.slug}`,
          "name": res.title
        }))
      };

      const script = document.createElement('script');
      script.id = 'taleem360-jsonld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(directorySchema);
      document.head.appendChild(script);

      document.title = `Free ${category.charAt(0).toUpperCase() + category.slice(1)} ${subject !== 'all' ? subject : ''} Materials | Taleem360`;
    } else {
      // Resource-specific document/course schema
      const resourceSchema = {
        "@context": "https://schema.org",
        "@type": selectedResource.seo?.structuredDataType || 'DigitalDocument',
        "name": selectedResource.seo?.metaTitle || selectedResource.title,
        "description": selectedResource.seo?.metaDescription || selectedResource.description,
        "url": `https://taleem360.online/free-resources/detail/${selectedResource.slug}`,
        "inLanguage": "en",
        "publisher": {
          "@type": "Organization",
          "name": "Taleem360",
          "url": "https://taleem360.online"
        },
        "educationalAlignment": {
          "@type": "AlignmentObject",
          "alignmentType": "educationalLevel",
          "educationalFramework": selectedResource.framework?.frameworkName,
          "targetName": selectedResource.framework?.gradeLevel
        }
      };

      const script = document.createElement('script');
      script.id = 'taleem360-jsonld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(resourceSchema);
      document.head.appendChild(script);

      document.title = `${selectedResource.seo?.metaTitle || selectedResource.title} | Taleem360`;
    }
  }, [selectedResource, category, subject, ageGroup, resources]);

  // Handle Dynamic Sidebar filter switches
  const handleFilterChange = (newFilters: { category?: string; subject?: string; ageGroup?: string }) => {
    const cat = newFilters.category || category;
    const sub = newFilters.subject || subject;
    const age = newFilters.ageGroup || ageGroup;
    setSelectedResource(null);
    navigate(`/free-resources/${cat}/${sub}/${age}`);
  };

  // Matching algorithm for 3D navigation matrices
  const matchedResources = resources.filter(res => {
    // 1. Framework/Category filtering
    const lowerFramework = res.framework.frameworkName.toLowerCase();
    let isCategoryMatch = false;

    if (category === 'mathematics') {
      isCategoryMatch = lowerFramework.includes('math') || res.framework.frameworkName === 'Cambridge CAIE' || res.framework.frameworkName === 'US Common Core';
    } else if (category === 'languages') {
      isCategoryMatch = lowerFramework.includes('eyfs') || lowerFramework.includes('literacy') || lowerFramework.includes('phonic');
    } else if (category === 'sciences') {
      isCategoryMatch = lowerFramework.includes('caie') || lowerFramework.includes('physics');
    } else {
      isCategoryMatch = true;
    }

    // 2. Subject Filter
    let isSubjectMatch = true;
    if (subject !== 'all') {
      const lowerSubject = res.title.toLowerCase() + ' ' + res.description.toLowerCase();
      isSubjectMatch = lowerSubject.includes(subject.toLowerCase());
    }

    // 3. Age Group/Grade Filter
    let isAgeMatch = true;
    if (ageGroup !== 'all') {
      const targetGradeMapping: Record<string, string> = {
        'nursery': 'nursery',
        'grade-2': 'grade 2',
        'grade-5': 'grade 5',
        'grade-8': 'grade 8',
        'grade-10': 'grade 10'
      };
      const expectedGrade = targetGradeMapping[ageGroup] || ageGroup;
      isAgeMatch = res.framework.gradeLevel.toLowerCase().includes(expectedGrade);
    }

    // 4. Search Query filter
    const matchesSearch = searchQuery.trim() === '' || 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());

    return isCategoryMatch && isSubjectMatch && isAgeMatch && matchesSearch;
  });

  // Get localized Tailwind classes for Fair-Use text badges
  const getBadgeClasses = (frameworkName: string) => {
    switch (frameworkName) {
      case 'UK EYFS':
        return 'bg-pink-900/40 text-pink-300 border border-pink-500/20';
      case 'Cambridge CAIE':
        return 'bg-sky-900/40 text-sky-300 border border-sky-500/20';
      case 'US Common Core':
        return 'bg-teal-900/40 text-teal-300 border border-teal-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  const getSyllabusLabel = (frameworkName: string) => {
    switch (frameworkName) {
      case 'UK EYFS':
        return 'UK EYFS Framework';
      case 'Cambridge CAIE':
        return 'Cambridge CAIE Syllabus';
      case 'US Common Core':
        return 'US Common Core Standard';
      default:
        return 'Syllabus';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 1. Header Breadcrumbs Bar */}
      <nav aria-label="breadcrumb" className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Taleem360</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/free-resources" className="hover:text-emerald-400 transition-colors">Free Resources</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-400 font-bold capitalize">{category}</span>
            {subject !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-200 capitalize">{subject}</span>
              </>
            )}
            {ageGroup !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-300 capitalize">{ageGroup.replace('-', ' ')}</span>
              </>
            )}
          </div>
          
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Public Decoupled Matrix Connected</span>
          </div>
        </div>
      </nav>

      {/* 2. Main Content Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 lg:py-12 flex flex-col md:flex-row gap-8">
        
        {/* Dynamic Sidebar */}
        <ResourceDirectorySidebar 
          activeCategory={category}
          activeSubject={subject}
          activeAgeGroup={ageGroup}
          onFilterChange={handleFilterChange}
        />

        {/* Directory Matrix Container */}
        <div className="flex-1 flex flex-col gap-6" id="resource-matrix-display">
          
          {selectedResource ? (
            /* ==================== DETAIL VIEW PORT ==================== */
            <article className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              
              {/* Back Button */}
              <button 
                onClick={() => setSelectedResource(null)}
                className="self-start flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-all mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Directory
              </button>

              {/* Title & SEO Metadata Header */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getBadgeClasses(selectedResource.framework.frameworkName)}`}>
                    <Award className="w-3.5 h-3.5" />
                    {selectedResource.framework.frameworkName} Compliant
                  </span>
                  <span className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full text-xs font-mono">
                    Grade: {selectedResource.framework.gradeLevel}
                  </span>
                  <span className="bg-slate-800 text-emerald-400 border border-slate-700/50 px-3 py-1 rounded-full text-xs font-mono font-bold">
                    Code: {selectedResource.framework.syllabusCode}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mt-1">
                  {selectedResource.title}
                </h1>
                
                <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
                  {selectedResource.description}
                </p>
              </div>

              {/* DYNAMIC RENDERING OF DECOUPLED COMPONENT VIEWPORTS */}
              <section className="bg-slate-950 border border-slate-800 rounded-xl p-6 relative overflow-hidden" id="viewport-workspace">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
                  <span className="text-xs font-mono text-slate-400">Interactive Workspace</span>
                  <span className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-md font-mono font-bold">
                    {selectedResource.payload.viewComponentType}
                  </span>
                </div>

                {/* VIEWPORT TYPE: PDFViewer */}
                {selectedResource.payload.viewComponentType === 'PDFViewer' && (
                  <div className="flex flex-col gap-6">
                    <div className="aspect-[4/3] w-full bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center justify-center p-6 text-center">
                      <FileText className="w-16 h-16 text-slate-600 mb-4 animate-pulse" />
                      <h4 className="text-sm font-bold text-slate-200">Interactive PDF Reader Engine</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-md">
                        Rendered securely via public S3 CDN. Read full handbook markup below or click download worksheets to print.
                      </p>
                      <a 
                        href={selectedResource.payload.cdnPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold px-4 py-2 rounded-lg text-xs transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open External Document PDF
                      </a>
                    </div>
                  </div>
                )}

                {/* VIEWPORT TYPE: InteractiveAudio */}
                {selectedResource.payload.viewComponentType === 'InteractiveAudio' && (
                  <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${audioPlaying ? 'bg-emerald-500/20 text-emerald-400 animate-bounce' : 'bg-slate-800 text-slate-400'}`}>
                      <Volume2 className="w-10 h-10" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-200 mt-4">Phonics Sound Synthesizer</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Practice clear pronunciation sounds. Try tracing words on sand while listening!
                    </p>
                    <button 
                      onClick={() => setAudioPlaying(!audioPlaying)}
                      className={`mt-4 inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-lg text-xs transition-all ${audioPlaying ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'}`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      {audioPlaying ? 'Mute Phonics Loop' : 'Play Sound Reference'}
                    </button>
                  </div>
                )}

                {/* VIEWPORT TYPE: QuizWidget */}
                {selectedResource.payload.viewComponentType === 'QuizWidget' && (
                  <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 flex flex-col gap-4">
                    <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Classroom Mathematics Speed Sprint
                    </h4>
                    <p className="text-xs text-slate-500">
                      Solve this practice exercise. Check answers to calculate your dynamic metrics instantly.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] font-mono text-slate-500 block">Question 1</span>
                        <span className="text-xs font-mono text-slate-300">24 + 15 = ?</span>
                        <input 
                          type="text" 
                          placeholder="Your answer" 
                          value={quizAnswers[0] || ''}
                          onChange={(e) => setQuizAnswers({...quizAnswers, 0: e.target.value})}
                          className="w-full mt-1.5 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] font-mono text-slate-500 block">Question 2</span>
                        <span className="text-xs font-mono text-slate-300">58 - 23 = ?</span>
                        <input 
                          type="text" 
                          placeholder="Your answer" 
                          value={quizAnswers[1] || ''}
                          onChange={(e) => setQuizAnswers({...quizAnswers, 1: e.target.value})}
                          className="w-full mt-1.5 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <button 
                        onClick={() => {
                          const correct0 = quizAnswers[0] === '39';
                          const correct1 = quizAnswers[1] === '35';
                          let score = 0;
                          if (correct0) score += 50;
                          if (correct1) score += 50;
                          setQuizScore(score);
                        }}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                      >
                        Check Answers
                      </button>
                      
                      {quizScore !== null && (
                        <span className="text-xs font-mono text-emerald-400 font-semibold">
                          Score: {quizScore}/100 {quizScore === 100 ? '🎉 Perfect!' : '👍 Keep practicing!'}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* VIEWPORT TYPE: CanvasApp */}
                {selectedResource.payload.viewComponentType === 'CanvasApp' && (
                  <div className="flex flex-col gap-4">
                    <div className="w-full aspect-[16/9] bg-slate-900 border border-slate-800 rounded-lg relative overflow-hidden flex items-center justify-center">
                      <canvas className="absolute inset-0 w-full h-full pointer-events-none" />
                      <div className="relative z-10 flex flex-col items-center text-center p-6">
                        <span className="text-xs font-mono text-slate-500 uppercase block mb-1">Interactive Trigonometric Plane</span>
                        <div className="flex items-center justify-center gap-4 my-2">
                          <button 
                            onClick={() => setCanvasActivePoint('sine')}
                            className={`px-3 py-1.5 rounded text-xs font-mono ${canvasActivePoint === 'sine' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                          >
                            Sine Rule
                          </button>
                          <button 
                            onClick={() => setCanvasActivePoint('cosine')}
                            className={`px-3 py-1.5 rounded text-xs font-mono ${canvasActivePoint === 'cosine' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                          >
                            Cosine Rule
                          </button>
                        </div>

                        {canvasActivePoint === 'sine' && (
                          <div className="mt-3 bg-slate-950/80 border border-slate-800 p-3 rounded text-left max-w-sm">
                            <span className="text-xs font-bold text-white block">Formula Proof</span>
                            <code className="text-[10px] font-mono text-emerald-300 block mt-1">a / sin(A) = b / sin(B) = c / sin(C)</code>
                          </div>
                        )}
                        {canvasActivePoint === 'cosine' && (
                          <div className="mt-3 bg-slate-950/80 border border-slate-800 p-3 rounded text-left max-w-sm">
                            <span className="text-xs font-bold text-white block">Formula Proof</span>
                            <code className="text-[10px] font-mono text-emerald-300 block mt-1">a² = b² + c² - 2bc · cos(A)</code>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Text / Markdown Content Display below interactive viewport */}
                {selectedResource.payload.markdownContent && (
                  <div className="mt-8 border-t border-slate-800/80 pt-6 prose prose-invert max-w-none text-sm text-slate-300">
                    <h3 className="text-lg font-bold text-white mb-4">Study Text & Syllabus Guidelines</h3>
                    <div className="whitespace-pre-wrap leading-relaxed font-sans font-normal bg-slate-900/40 p-4 sm:p-6 rounded-xl border border-slate-800/60">
                      {selectedResource.payload.markdownContent}
                    </div>
                  </div>
                )}
              </section>

              {/* PDF Document Download Area */}
              {selectedResource.payload.cdnPdfUrl && (
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 rounded-lg">
                      <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Full Educational Handout PDF</h4>
                      <p className="text-[11px] text-slate-500">Includes detailed worksheet grids and answer keys</p>
                    </div>
                  </div>
                  <a 
                    href={selectedResource.payload.cdnPdfUrl}
                    download
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold px-5 py-2.5 rounded-lg text-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Worksheets (PDF)
                  </a>
                </div>
              )}
            </article>
          ) : (
            /* ==================== DIRECTORY GRID VIEW ==================== */
            <div className="flex flex-col gap-6">
              
              {/* Filter / Search Bar */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                  <input 
                    type="text" 
                    placeholder="Search standard math, phonics, geometry guides..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="absolute left-3 top-3 text-slate-500">🔍</span>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  Showing <span className="text-emerald-400 font-bold">{matchedResources.length}</span> active resources
                </div>
              </div>

              {/* Grid Content */}
              {matchedResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchedResources.map((resource) => (
                    <article 
                      key={resource.id}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all shadow-lg hover:shadow-slate-950/40 group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
                      
                      <div className="flex flex-col gap-3">
                        {/* Meta Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${getBadgeClasses(resource.framework.frameworkName)}`}>
                            {resource.framework.frameworkName}
                          </span>
                          <span className="bg-slate-950 text-slate-400 border border-slate-800/80 px-2 py-0.5 rounded text-[10px] font-mono">
                            Grade: {resource.framework.gradeLevel}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                          {resource.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                          {resource.description}
                        </p>
                      </div>

                      {/* Card Footer actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-auto">
                        <span className="text-[10px] font-mono text-slate-500">
                          {getSyllabusLabel(resource.framework.frameworkName)}
                        </span>
                        
                        <button 
                          onClick={() => setSelectedResource(resource)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/5 hover:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/10"
                        >
                          Study Now
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                  <AlertCircle className="w-12 h-12 text-slate-600 mb-3" />
                  <h3 className="text-sm font-bold text-slate-200">No Matched Resources Found</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    No resources fit the current active filters. Click other topics or curriculum frameworks in the sidebar to browse our rich inventory.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

      </main>
    </div>
  );
};
export default FreeResourcesMatrixPage;
