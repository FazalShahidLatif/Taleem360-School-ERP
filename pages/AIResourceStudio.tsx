import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Cpu, 
  Code, 
  FileText, 
  CheckCircle2, 
  Play, 
  RefreshCw, 
  Layers, 
  ArrowRight, 
  Terminal, 
  Sliders, 
  Check, 
  GraduationCap, 
  AlertCircle, 
  Upload, 
  HelpCircle, 
  ChevronRight, 
  BookOpen, 
  FileCode, 
  Languages, 
  Copy, 
  CornerDownRight,
  Settings
} from 'lucide-react';
import { useAuth } from '../lib/auth';

interface PresetResource {
  id: string;
  name: string;
  board: string;
  grade: string;
  subject: string;
  text: string;
  extractedJson: any;
}

const PRESET_RESOURCES: PresetResource[] = [
  {
    id: 'chem-10',
    name: 'Chemistry Grade 10 Past Board Paper',
    board: 'BISE Punjab',
    grade: 'Grade 10',
    subject: 'Chemistry',
    text: `BOARD OF INTERMEDIATE AND SECONDARY EDUCATION, PUNJAB
GRADE 10 CHEMISTRY ANNUAL EXAMINATION (BISE)
Total Marks: 60 | Time Allowed: 2 Hours

SECTION-A (Objective - Compulsory) - Marks: 12
Q1. Choose the correct option:
i) Which of the following is a saturated hydrocarbon?
   a) Ethene  b) Ethyne  c) Methane  d) Benzene
ii) The pH of pure water is:
   a) 5  b) 7  c) 9  d) 14
iii) Which gas is main constituent of natural gas?
   a) Methane  b) Ethane  c) Carbon dioxide  d) Nitrogen
iv) Temporary hardness of water is due to:
   a) Calcium bicarbonate  b) Magnesium sulfate  c) Calcium chloride  d) Sodium carbonate

SECTION-B (Subjective) - Marks: 48
Q2. Write short answers to any FIVE of the following questions: (10 Marks)
i) State Law of Mass Action.
ii) Differentiate between reversible and irreversible reactions.
iii) Why are alkanes called paraffins?
iv) Define acid and base according to Bronsted-Lowry concept.
v) Explain why water is a polar molecule.
vi) What are lipids and list their main functions.`,
    extractedJson: {
      metadata: {
        source: "BISE Punjab Board Exam",
        grade: "10th Grade / Secondary",
        subject: "Chemistry",
        total_marks: 60,
        time_allowed_minutes: 120
      },
      assessment_structure: {
        total_sections: 2,
        section_a: {
          type: "objective",
          weight: 12,
          questions_count: 4,
          questions: [
            "Which of the following is a saturated hydrocarbon?",
            "The pH of pure water is:",
            "Which gas is main constituent of natural gas?",
            "Temporary hardness of water is due to:"
          ]
        },
        section_b: {
          type: "subjective",
          weight: 48,
          short_questions_to_attempt: 5,
          total_marks_for_short: 10,
          questions: [
            "State Law of Mass Action.",
            "Differentiate between reversible and irreversible reactions.",
            "Why are alkanes called paraffins?",
            "Define acid and base according to Bronsted-Lowry concept.",
            "Explain why water is a polar molecule.",
            "What are lipids and list their main functions."
          ]
        }
      }
    }
  },
  {
    id: 'phy-9',
    name: 'Physics Grade 9 Kinematics Textbook Chapter',
    board: 'Federal Board (FBISE)',
    grade: 'Grade 9',
    subject: 'Physics',
    text: `FEDERAL BOARD OF INTERMEDIATE AND SECONDARY EDUCATION, ISLAMABAD
NATIONAL CURRICULUM GRADE 9 PHYSICS - CHAPTER 2: KINEMATICS
Key Learning Objectives:
- Describe rest and motion.
- Understand scalar and vector quantities.
- Define speed, velocity, and acceleration.
- Solve equations of motion for uniformly accelerated bodies.

Core Concepts:
1. Rest and Motion: A body is said to be at rest if it does not change its position with respect to its surroundings. If it changes its position, it is in motion.
2. Speed is distance covered per unit time (v = d/t). Speed is a scalar.
3. Velocity is displacement per unit time. Velocity is a vector.
4. Acceleration is the rate of change of velocity (a = (vf - vi)/t).
5. Three Equations of Motion:
   i) vf = vi + at
   ii) s = vi*t + 0.5*a*t^2
   iii) 2*a*s = vf^2 - vi^2`,
    extractedJson: {
      metadata: {
        source: "Federal Board National Curriculum",
        grade: "9th Grade / Matric",
        subject: "Physics",
        chapter: "Chapter 2: Kinematics"
      },
      syllabus_guidelines: {
        learning_outcomes: [
          "Describe rest and motion.",
          "Understand scalar and vector quantities.",
          "Define speed, velocity, and acceleration.",
          "Solve equations of motion for uniformly accelerated bodies."
        ],
        core_theorems: [
          { name: "Rest & Motion Relativity", description: "State depends strictly on relative reference frames" },
          { name: "Speed vs Velocity", type: "Scalar vs Vector comparison" },
          { name: "Acceleration definition", formula: "a = delta v / t" },
          { name: "Equations of motion", formulas: ["vf = vi + at", "s = vi*t + 0.5*a*t^2", "2*a*s = vf^2 - vi^2"] }
        ]
      }
    }
  },
  {
    id: 'eng-12',
    name: 'English Compulsory Grammar & Comprehension',
    board: 'Sindh Board (BIEK)',
    grade: 'Grade 12',
    subject: 'English',
    text: `SINDH BOARD OF INTERMEDIATE & SECONDARY EDUCATION, KARACHI
ENGLISH COMPULSORY - GRADE 12 STUDY GUIDE
Topic: Active & Passive Voice, Direct & Indirect Narration, Vocabulary

Comprehension Passage:
"The rapid modernization of digital portals across institutions in Pakistan is transforming how students access quality education. Taleem360, as a central ERP and resource repository, provides student-centric learning resources, past papers, and digital worksheets. This multi-tenant architecture solves decentralized administrative errors and empowers teachers to design targeted classroom assessments with real-time feedback."

Practice Exercises:
1. Change the voice: "The teacher delivered an inspiring lecture on digital literacy."
2. Change into indirect speech: The principal said, "We must implement automated grading tools in our academy."
3. Find synonyms for the following words from the passage:
   i) Modernization
   ii) Transforming
   iii) Empowers`,
    extractedJson: {
      metadata: {
        source: "Sindh Board Grammar Study Guide",
        grade: "12th Grade / Intermediate",
        subject: "English Compulsory"
      },
      syllabus_guidelines: {
        topics_covered: ["Active & Passive Voice", "Direct & Indirect Speech", "Comprehension Analysis", "Vocabulary Context"],
        reading_passage_metadata: {
          word_count: 58,
          focal_subjects: ["Digital modernization in Pakistan", "Taleem360 ERP", "Teacher empowerment"]
        },
        exercises: [
          { type: "Active/Passive Voice", sentence: "The teacher delivered an inspiring lecture on digital literacy." },
          { type: "Indirect Narration", sentence: "The principal said, 'We must implement automated grading tools in our academy.'" },
          { type: "Vocabulary Mapping", words: ["Modernization", "Transforming", "Empowers"] }
        ]
      }
    }
  }
];

interface AIAssistantPreset {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  systemPrompt: string;
  expectedFormat: 'quiz' | 'flashcards' | 'bilingual';
}

const AI_STUDIO_PRESETS: AIAssistantPreset[] = [
  {
    id: 'quiz-gen',
    name: 'Classroom MCQ Quiz',
    icon: <HelpCircle className="w-5 h-5 text-indigo-500" />,
    description: 'Generates a fully interactive 3-question MCQ quiz based on textbook resources with instant feedback.',
    expectedFormat: 'quiz',
    systemPrompt: `You are an expert curriculum evaluator for school boards in Pakistan. Based on the provided raw textbook resource or past paper text, generate exactly 3 highly relevant and accurate Multiple Choice Questions (MCQs) for classroom assessments.
Return your output ONLY as a valid, stringified JSON object matching this schema. Do not add any markdown formatting, backticks (\`\`\`), or extra commentary.

{
  "title": "Interactive Study Quiz",
  "questions": [
    {
      "id": "q1",
      "question": "Clear, board-aligned MCQ question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Brief context on why this option is correct based on the text."
    },
    {
      "id": "q2",
      "question": "Second clear board-aligned MCQ question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B",
      "explanation": "Brief context on why this option is correct based on the text."
    },
    {
      "id": "q3",
      "question": "Third clear board-aligned MCQ question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option C",
      "explanation": "Brief context on why this option is correct based on the text."
    }
  ]
}`
  },
  {
    id: 'flash-cards',
    name: 'Smart Concept Flashcards',
    icon: <Layers className="w-5 h-5 text-emerald-500" />,
    description: 'Extracts critical terms, laws, or formulas and translates them into responsive, flipping flashcards.',
    expectedFormat: 'flashcards',
    systemPrompt: `You are an educational designer. Your goal is to synthesize the provided study material into exactly 3 key terminology flashcards.
Identify the 3 most crucial terms, formulas, or theorems, and define them deeply but clearly.
Return your output ONLY as a valid, stringified JSON object matching this schema. Do not add any markdown formatting, backticks (\`\`\`), or extra commentary.

{
  "title": "Core Revision Cards",
  "cards": [
    {
      "term": "Term Name / Scientific Law",
      "definition": "Explain this concept precisely. Write 2-3 sentences providing definition, relevance, and board exam importance."
    },
    {
      "term": "Second Term",
      "definition": "Clear description and context."
    },
    {
      "term": "Third Term",
      "definition": "Clear description and context."
    }
  ]
}`
  },
  {
    id: 'bilingual-tutor',
    name: 'Bilingual Roman-Urdu Tutor',
    icon: <Languages className="w-5 h-5 text-amber-500" />,
    description: 'Creates speech explanations in warm Roman-Urdu and English, with a quick check validation question.',
    expectedFormat: 'bilingual',
    systemPrompt: `You are a supportive, friendly private tutor from Pakistan. Explain the key core concepts of the provided material in a comforting mix of Roman Urdu (Urdu written in English letters) and pure English.
Focus on making complex concepts super easy to digest for matric or intermediate students.
Return your output ONLY as a valid, stringified JSON object matching this schema. Do not add any markdown formatting, backticks (\`\`\`), or extra commentary.

{
  "title": "Taleem360 Roman-Urdu Companion",
  "explanations": [
    {
      "concept": "Core Concept Name",
      "romanUrdu": "Asan Roman Urdu explanation (e.g., Alkanes single bonds banate hain, isiliye inki reactivity bohat kam hoti hai aur inhein paraffins kaha jata hai...)",
      "english": "English translation and real-world analogy to solidify the learning."
    },
    {
      "concept": "Secondary Concept",
      "romanUrdu": "Asan explanation in Roman Urdu.",
      "english": "English description."
    }
  ],
  "quiz": {
    "question": "A quick check MCQ question to test the student",
    "options": ["Option A", "Option B"],
    "correctAnswer": "Option A"
  }
}`
  }
];

export const AIResourceStudio: React.FC = () => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [pipelineState, setPipelineState] = useState({
    1: 'completed', // Selected a resource initially
    2: 'idle',
    3: 'idle',
    4: 'idle',
    5: 'idle'
  });

  const [selectedPresetId, setSelectedPresetId] = useState<string>('chem-10');
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [customFileText, setCustomFileText] = useState<string>('');
  
  // Simulated parsing terminals
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);

  // Cleaned data
  const [cleanedText, setCleanedText] = useState<string>(PRESET_RESOURCES[0].text);
  const [cleanedJson, setCleanedJson] = useState<any>(PRESET_RESOURCES[0].extractedJson);

  // System Prompt & Params
  const [selectedPromptPreset, setSelectedPromptPreset] = useState<string>('quiz-gen');
  const [systemPromptText, setSystemPromptText] = useState<string>(AI_STUDIO_PRESETS[0].systemPrompt);
  const [temperature, setTemperature] = useState<number>(0.5);
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  // Final Output
  const [structuredOutput, setStructuredOutput] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Interactive Output Elements
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [checkedAnswers, setCheckedAnswers] = useState<{ [key: string]: boolean }>({});
  const [activeFlashcard, setActiveFlashcard] = useState<number>(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState<boolean>(false);
  const [tutorQuizAnswer, setTutorQuizAnswer] = useState<string>('');
  const [tutorQuizChecked, setTutorQuizChecked] = useState<boolean>(false);

  // Reset interactive states when output changes
  useEffect(() => {
    setSelectedAnswers({});
    setCheckedAnswers({});
    setActiveFlashcard(0);
    setFlashcardFlipped(false);
    setTutorQuizAnswer('');
    setTutorQuizChecked(false);
  }, [structuredOutput]);

  // Synchronize preset text when selected preset changes
  const handleResourceChange = (id: string) => {
    setSelectedPresetId(id);
    const preset = PRESET_RESOURCES.find(r => r.id === id);
    if (preset) {
      setCleanedText(preset.text);
      setCleanedJson(preset.extractedJson);
      setCustomFile(null);
      setCustomFileText('');
      // Mark pipeline stages back to idle
      setPipelineState(prev => ({
        ...prev,
        1: 'completed',
        2: 'idle',
        3: 'idle',
        4: 'idle',
        5: 'idle'
      }));
      setActiveStep(1);
    }
  };

  const handlePromptPresetChange = (id: string) => {
    setSelectedPromptPreset(id);
    const preset = AI_STUDIO_PRESETS.find(p => p.id === id);
    if (preset) {
      setSystemPromptText(preset.systemPrompt);
    }
  };

  // Custom File drop logic
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomFile(file);
      setTerminalLogs([]);
      
      // Simulate reading textbook
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string || '';
        // Mock a processed school resource text
        const mockProcessedText = `DOCUMENT: ${file.name}
Uploaded on Taleem360 AI Gateway
File Size: ${(file.size / 1024).toFixed(1)} KB

[TALEEM360 METADATA EXTRACTION ENGINE]
--------------------------------------------------
${text.substring(0, 1500) || "CHAPTER 1: Introduction to Educational Digitization\nTaleem360 Cloud Suite enables schools to integrate custom student portals, exam papers, and BISE past worksheet databases.\n\nPractice Questions:\n1. Explain the role of dual-persistence mapping in school database caches.\n2. True or False: Subdomain routing enforces custom school brand assets automatically."}
--------------------------------------------------`;
        setCustomFileText(mockProcessedText);
      };
      reader.readAsText(file);

      // Advance step
      setPipelineState(prev => ({ ...prev, 1: 'completed' }));
      setActiveStep(2);
    }
  };

  // Trigger PyPDF/PDFplumber extraction pipeline
  const runExtractionPipeline = () => {
    setIsExtracting(true);
    setExtractionProgress(10);
    setActiveStep(2);
    setPipelineState(prev => ({ ...prev, 2: 'active' }));
    setTerminalLogs([
      '[Python CLI] $ python -m taleem360_extractor --input resource.pdf',
      '[PyPDF-Engine] Loading PyPDF PdfReader instances...',
      '[PyPDF-Engine] Successfully initialized coordinate character map matrices.'
    ]);

    const logs = [
      '[pdfplumber] Analyzing word bounding boxes on page 1...',
      '[pdfplumber] Merging overlapping characters into cohesive sentences...',
      '[taleem_cleaner] Stripping watermarks & redundant pagination footnotes...',
      '[taleem_cleaner] Normalizing Unicode typography & exam-board section prefixes...',
      '[JSON-Generator] Structure generated: 2 levels parsed successfully.',
      '[Pipeline] Extracted Cleaned Plain Text + Metadata JSON Payload!'
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setTerminalLogs(prev => [...prev, logs[currentLogIndex]]);
        setExtractionProgress(prev => Math.min(prev + 15, 95));
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setExtractionProgress(100);
        setIsExtracting(false);
        setPipelineState(prev => ({
          ...prev,
          2: 'completed',
          3: 'completed'
        }));
        
        // Populate actual content
        if (customFile) {
          setCleanedText(customFileText);
          setCleanedJson({
            metadata: {
              source: `Uploaded Document: ${customFile.name}`,
              file_size_kb: parseFloat((customFile.size / 1024).toFixed(1)),
              processed_timestamp: new Date().toISOString()
            },
            extracted_sections: [
              { title: "Introduction", content_length: customFileText.length },
              { topics_analyzed: ["Digital ERP Integration", "Automated Assessments", "Local Caching"] }
            ]
          });
        } else {
          const preset = PRESET_RESOURCES.find(r => r.id === selectedPresetId);
          if (preset) {
            setCleanedText(preset.text);
            setCleanedJson(preset.extractedJson);
          }
        }
        setActiveStep(3);
      }
    }, 400);
  };

  // Run Google AI Studio Prompt via Gemini API
  const runAIPromptEngine = async () => {
    setIsProcessingAI(true);
    setPipelineState(prev => ({ ...prev, 4: 'active', 5: 'idle' }));
    setActiveStep(4);
    setAiError(null);
    setStructuredOutput(null);

    const presetType = AI_STUDIO_PRESETS.find(p => p.id === selectedPromptPreset)?.expectedFormat || 'quiz';

    try {
      const response = await fetch('/api/ai/process-resource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cleanedText,
          systemInstruction: systemPromptText,
          temperature,
          responseMimeType: 'application/json'
        })
      });

      if (!response.ok) {
        throw new Error(`Model request failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Clean and parse JSON response from Gemini
      let parsedJson: any = null;
      try {
        // Strip markdown backticks if returned in text
        let cleanText = data.text.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.substring(7);
        }
        if (cleanText.endsWith('```')) {
          cleanText = cleanText.substring(0, cleanText.length - 3);
        }
        parsedJson = JSON.parse(cleanText.trim());
      } catch (parseErr) {
        console.warn("Gemini output was not valid JSON, forcing mock adaptation", parseErr);
        // Fallback structure in case of direct plain text
        parsedJson = {
          title: "Study Summary Explainer",
          summary: data.text,
          flashcards: [
            { term: "Key Topic", definition: data.text.substring(0, 120) + "..." }
          ]
        };
      }

      setStructuredOutput(parsedJson);
      setPipelineState(prev => ({
        ...prev,
        4: 'completed',
        5: 'completed'
      }));
      setActiveStep(5);

    } catch (err: any) {
      console.error("AI Studio Processing Error:", err);
      setAiError(err.message || "An unexpected issue occurred while querying Gemini.");
      setPipelineState(prev => ({ ...prev, 4: 'idle' }));
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleSelectQuizOption = (qId: string, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleCheckQuizAnswer = (qId: string) => {
    setCheckedAnswers(prev => ({ ...prev, [qId]: true }));
  };

  return (
    <div id="ai-resource-studio" className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-gray-50/50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8 border-b border-gray-200 pb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1 animate-pulse">
                <Sparkles className="w-3 h-3" /> Live Gemini Integrated
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full">
                Taleem360 Core Pipeline
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Taleem360 AI Prompt Studio</h1>
            <p className="mt-1 text-sm text-gray-500">
              Transform raw educational documents into playable, highly structured student learning applications.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setActiveStep(1);
                setPipelineState({ 1: 'completed', 2: 'idle', 3: 'idle', 4: 'idle', 5: 'idle' });
                setStructuredOutput(null);
                setTerminalLogs([]);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors active:scale-95 duration-150"
            >
              <RefreshCw className="w-4 h-4" /> Reset Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* 5-Node Interactive Flowchart Visualizer */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8 overflow-x-auto">
        <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-1.5 justify-center sm:justify-start">
          <Cpu className="w-4 h-4 text-indigo-500" /> Active Data Extraction & Processing Pipeline
        </h2>
        
        <div className="flex items-center justify-between min-w-[760px] max-w-full px-4 relative">
          
          {/* Node 1: Resource / PDF */}
          <div 
            onClick={() => setActiveStep(1)}
            className={`flex flex-col items-center cursor-pointer group transition-all duration-300 z-10 ${
              activeStep === 1 ? 'scale-105' : 'hover:scale-102'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${
              activeStep === 1 
                ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-100'
                : pipelineState[1] === 'completed'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}>
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold mt-2.5 text-slate-800">1. Raw Resource</span>
            <span className="text-[10px] font-mono text-gray-400">PDF / Book Input</span>
          </div>

          {/* Connection 1-2 */}
          <div className="flex-1 h-1 bg-gray-200 mx-2 relative overflow-hidden rounded-full">
            <div className={`absolute inset-0 bg-indigo-600 transition-all duration-700 ${
              pipelineState[2] !== 'idle' ? 'w-full' : 'w-0'
            }`} />
            {pipelineState[2] === 'active' && (
              <div className="absolute inset-0 bg-indigo-600 animate-pulse w-full" />
            )}
          </div>

          {/* Node 2: Extraction Engine */}
          <div 
            onClick={() => pipelineState[2] !== 'idle' && setActiveStep(2)}
            className={`flex flex-col items-center transition-all duration-300 z-10 ${
              pipelineState[2] === 'idle' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-102'
            } ${activeStep === 2 ? 'scale-105' : ''}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${
              activeStep === 2 
                ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-100'
                : pipelineState[2] === 'completed'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                  : pipelineState[2] === 'active'
                    ? 'bg-amber-500 border-amber-500 text-white animate-pulse'
                    : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}>
              <Terminal className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold mt-2.5 text-slate-800">2. PyPDF Extractor</span>
            <span className="text-[10px] font-mono text-gray-400">Python CLI Parse</span>
          </div>

          {/* Connection 2-3 */}
          <div className="flex-1 h-1 bg-gray-200 mx-2 relative overflow-hidden rounded-full">
            <div className={`absolute inset-0 bg-indigo-600 transition-all duration-700 ${
              pipelineState[3] !== 'idle' ? 'w-full' : 'w-0'
            }`} />
          </div>

          {/* Node 3: Cleaned Text/JSON */}
          <div 
            onClick={() => pipelineState[3] !== 'idle' && setActiveStep(3)}
            className={`flex flex-col items-center transition-all duration-300 z-10 ${
              pipelineState[3] === 'idle' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-102'
            } ${activeStep === 3 ? 'scale-105' : ''}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${
              activeStep === 3 
                ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-100'
                : pipelineState[3] === 'completed'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}>
              <FileCode className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold mt-2.5 text-slate-800">3. Cleaned Data</span>
            <span className="text-[10px] font-mono text-gray-400">Normalized JSON</span>
          </div>

          {/* Connection 3-4 */}
          <div className="flex-1 h-1 bg-gray-200 mx-2 relative overflow-hidden rounded-full">
            <div className={`absolute inset-0 bg-indigo-600 transition-all duration-700 ${
              pipelineState[4] !== 'idle' ? 'w-full' : 'w-0'
            }`} />
          </div>

          {/* Node 4: Google AI Studio Prompt */}
          <div 
            onClick={() => pipelineState[4] !== 'idle' && setActiveStep(4)}
            className={`flex flex-col items-center transition-all duration-300 z-10 ${
              pipelineState[4] === 'idle' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-102'
            } ${activeStep === 4 ? 'scale-105' : ''}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${
              activeStep === 4 
                ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-100'
                : pipelineState[4] === 'completed'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                  : pipelineState[4] === 'active'
                    ? 'bg-amber-500 border-amber-500 text-white animate-pulse'
                    : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}>
              <Settings className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold mt-2.5 text-slate-800">4. System Prompt</span>
            <span className="text-[10px] font-mono text-gray-400">AI Studio Playground</span>
          </div>

          {/* Connection 4-5 */}
          <div className="flex-1 h-1 bg-gray-200 mx-2 relative overflow-hidden rounded-full">
            <div className={`absolute inset-0 bg-indigo-600 transition-all duration-700 ${
              pipelineState[5] !== 'idle' ? 'w-full' : 'w-0'
            }`} />
          </div>

          {/* Node 5: Structured Student Experience */}
          <div 
            onClick={() => pipelineState[5] !== 'idle' && setActiveStep(5)}
            className={`flex flex-col items-center transition-all duration-300 z-10 ${
              pipelineState[5] === 'idle' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-102'
            } ${activeStep === 5 ? 'scale-105' : ''}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${
              activeStep === 5 
                ? 'bg-emerald-600 border-emerald-600 text-white ring-4 ring-emerald-100'
                : pipelineState[5] === 'completed'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}>
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold mt-2.5 text-slate-800">5. Student App</span>
            <span className="text-[10px] font-mono text-gray-400">Playable Experience</span>
          </div>

        </div>
      </div>

      {/* Main Grid: Control and Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Pipeline Inputs, Configuration & Prompts */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Step 1 Component Panel */}
          {activeStep === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Step 1: Choose Educational Resource</h3>
                  <p className="text-xs text-gray-400">Pick a board past-paper, textbook chapter, or upload your own.</p>
                </div>
              </div>

              {/* Preset Selector */}
              <div className="space-y-3 mb-6">
                <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider">Select Taleem360 Preset</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {PRESET_RESOURCES.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handleResourceChange(preset.id)}
                      className={`text-left p-4 rounded-xl border transition-all flex justify-between items-center ${
                        selectedPresetId === preset.id && !customFile
                          ? 'bg-indigo-50/40 border-indigo-600 ring-2 ring-indigo-50'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-gray-100 text-gray-600 rounded">
                            {preset.board}
                          </span>
                          <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 rounded">
                            {preset.grade}
                          </span>
                        </div>
                        <h4 className="font-black text-sm text-slate-800">{preset.name}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Subject: {preset.subject}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                        selectedPresetId === preset.id && !customFile ? 'translate-x-1 text-indigo-600' : ''
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Divider */}
              <div className="relative flex py-3 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-mono uppercase tracking-widest">or upload custom</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* PDF/Text Upload Container */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider mb-2">Upload PDF or Text Worksheet</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50/50 transition-colors relative cursor-pointer group">
                  <input 
                    type="file" 
                    accept=".pdf,.txt"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:scale-105 transition-transform" />
                  <span className="text-xs font-bold text-indigo-600 block">
                    {customFile ? customFile.name : "Drag & Drop or Click to Upload"}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-1">Supports PDF or Plain Text Files (Max 10MB)</span>
                </div>
                {customFile && (
                  <div className="mt-2.5 p-3 bg-emerald-50 rounded-lg flex items-center gap-2 border border-emerald-100">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs text-emerald-800 font-medium">Successfully processed {customFile.name}</span>
                  </div>
                )}
              </div>

              {/* Primary Action */}
              <button
                onClick={runExtractionPipeline}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 border border-transparent text-sm font-black rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md hover:shadow-lg"
              >
                Start Extraction Stage <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Step 2 Component Panel */}
          {activeStep === 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Step 2: PyPDF / PDFplumber Parser</h3>
                  <p className="text-xs text-gray-400">Simulate character and structure coordinate mapping execution.</p>
                </div>
              </div>

              <div className="mb-6 bg-slate-900 rounded-xl p-4 font-mono text-xs text-indigo-300 space-y-2 h-[300px] overflow-y-auto">
                {terminalLogs.length === 0 ? (
                  <div className="text-slate-500 italic text-center pt-24">Terminal ready. Click run below to begin Python subprocess.</div>
                ) : (
                  terminalLogs.map((log, index) => (
                    <div key={index} className="flex gap-2 leading-relaxed">
                      <span className="text-slate-500 select-none">&gt;</span>
                      <span className={log.startsWith('[System]') || log.startsWith('[Pipeline]') ? 'text-emerald-400 font-bold' : ''}>
                        {log}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {isExtracting ? (
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-mono text-gray-400">
                    <span>Extracting structure...</span>
                    <span>{extractionProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${extractionProgress}%` }} />
                  </div>
                </div>
              ) : null}

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveStep(1)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Back to Resource
                </button>
                <button
                  onClick={runExtractionPipeline}
                  disabled={isExtracting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent text-xs font-black rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 active:scale-[0.98] transition-all shadow-sm"
                >
                  <Play className="w-4 h-4" /> {terminalLogs.length > 0 ? "Re-Run Parser" : "Run Extraction"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3 Component Panel */}
          {activeStep === 3 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Step 3: Cleaned Text & JSON Payload</h3>
                  <p className="text-xs text-gray-400">Character map completed. Review parsed structures below.</p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-black text-emerald-900">Coord-Map Generation Complete</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Extracted text was successfully normalized to remove non-alphanumeric noise, footnotes, and school borders. Ready for prompt injection.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveStep(4)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 border border-transparent text-sm font-black rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md"
              >
                Configure System Prompt <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Step 4 Component Panel */}
          {activeStep === 4 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Step 4: Google AI Studio Prompt</h3>
                  <p className="text-xs text-gray-400">Configure system instructions and parameters for Gemini model.</p>
                </div>
              </div>

              {/* Prompt Presets */}
              <div className="mb-5">
                <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider mb-2">Preset AI Roles</label>
                <div className="grid grid-cols-1 gap-2">
                  {AI_STUDIO_PRESETS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handlePromptPresetChange(p.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all flex gap-3 items-start ${
                        selectedPromptPreset === p.id 
                          ? 'bg-indigo-50/40 border-indigo-600 ring-2 ring-indigo-50' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg mt-0.5">
                        {p.icon}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-slate-800">{p.name}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{p.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable System Prompt Container */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">System Instructions</label>
                  <span className="text-[10px] font-mono text-gray-400">Editable (Google AI Studio IDE Style)</span>
                </div>
                <textarea
                  value={systemPromptText}
                  onChange={(e) => setSystemPromptText(e.target.value)}
                  rows={8}
                  className="w-full text-xs font-mono p-3 bg-slate-950 text-slate-300 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              {/* Sliders */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                    <span>TEMPERATURE</span>
                    <span className="font-mono text-indigo-600">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="text-[10px] text-gray-400 block mt-1">Lower values generate deterministic structured JSON, higher yields creative output.</span>
                </div>
              </div>

              {/* Execution Action */}
              <button
                onClick={runAIPromptEngine}
                disabled={isProcessingAI}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 border border-transparent text-sm font-black rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md hover:shadow-lg disabled:bg-indigo-400"
              >
                {isProcessingAI ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Simulating Gemini Execution...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 animate-pulse" /> Deploy to Student Experience <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Step 5 Component Panel */}
          {activeStep === 5 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Step 5: Output Loaded</h3>
                  <p className="text-xs text-gray-400">Interactive Student UI Sandbox is currently compiled and ready.</p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3 mb-6">
                <Check className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-black text-emerald-900">Student App Ready</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    We converted raw parsed coordinates successfully into a responsive, playable, interactive web application module. Play with it on the right workspace panel!
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveStep(4)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Adjust Prompt
                </button>
                <button
                  onClick={() => {
                    setActiveStep(1);
                    setStructuredOutput(null);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent text-xs font-black rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm"
                >
                  New Document
                </button>
              </div>
            </motion.div>
          )}

          {/* Help Instructions Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-slate-300 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Cpu className="w-32 h-32 text-indigo-500" />
            </div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-2.5 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> Technical Blueprint
            </h4>
            <div className="text-xs space-y-3 leading-relaxed text-slate-400">
              <p>
                This module simulates a complete enterprise-grade pipeline for parsing board-level educational materials. 
              </p>
              <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[10px]">
                <div className="flex justify-between text-indigo-300">
                  <span>Engine:</span>
                  <span>pdfplumber 0.11.0</span>
                </div>
                <div className="flex justify-between text-indigo-300">
                  <span>Formatting:</span>
                  <span>Character coordinate maps</span>
                </div>
                <div className="flex justify-between text-indigo-300">
                  <span>LLM Provider:</span>
                  <span>Gemini 3.5 Flash (via Node SDK)</span>
                </div>
                <div className="flex justify-between text-indigo-300">
                  <span>Compliance:</span>
                  <span>BISE Punjab/Sindh/Federal</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Virtual Workspace (Extracted data visualization or fully interactive student experience) */}
        <div className="lg:col-span-7">
          
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            
            {/* Workspace Header Tab Controls */}
            <div className="bg-gray-50/50 border-b border-gray-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <h3 className="font-bold text-sm text-slate-800">Taleem360 Processing Sandbox</h3>
              </div>
              <div className="flex bg-gray-200/60 p-1 rounded-xl">
                <button 
                  onClick={() => pipelineState[1] === 'completed' && setActiveStep(1)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeStep === 1 ? 'bg-white text-slate-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Resource
                </button>
                <button 
                  onClick={() => pipelineState[3] === 'completed' && setActiveStep(3)}
                  disabled={pipelineState[3] === 'idle'}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    activeStep === 3 ? 'bg-white text-slate-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Clean Data
                </button>
                <button 
                  onClick={() => pipelineState[4] === 'completed' && setActiveStep(4)}
                  disabled={pipelineState[4] === 'idle'}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    activeStep === 4 ? 'bg-white text-slate-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  AI Studio
                </button>
                <button 
                  onClick={() => pipelineState[5] === 'completed' && setActiveStep(5)}
                  disabled={pipelineState[5] === 'idle'}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    activeStep === 5 ? 'bg-white text-slate-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Student Experience
                </button>
              </div>
            </div>

            {/* Tab Workspace Area */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              
              <AnimatePresence mode="wait">
                
                {/* Visualizer Step 1: Resource Raw Text */}
                {activeStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">RAW INPUT STUDY RESOURCE TEXT</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(cleanedText);
                        }}
                        className="p-1 px-2.5 rounded bg-gray-100 hover:bg-gray-200 text-slate-600 text-[10px] font-bold transition-all flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy Raw
                      </button>
                    </div>

                    <div className="p-5 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs font-mono h-[450px] overflow-y-auto leading-relaxed shadow-inner">
                      {customFile ? (
                        <div className="whitespace-pre-wrap">{customFileText}</div>
                      ) : (
                        <div className="whitespace-pre-wrap">{cleanedText}</div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Visualizer Step 2: Extracting CLI Logs */}
                {activeStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col justify-center items-center text-center py-16 space-y-6"
                  >
                    {isExtracting ? (
                      <div className="space-y-4 max-w-sm">
                        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                        <h4 className="font-black text-slate-800 text-lg">Executing Python Extraction Subprocess</h4>
                        <p className="text-xs text-gray-500">
                          PyPDF and PDFplumber are extracting key textbook coordinates and compiling character bounding boxes.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-w-sm">
                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-sm border border-emerald-200">
                          <Check className="w-8 h-8" />
                        </div>
                        <h4 className="font-black text-slate-800 text-lg">Coordinates successfully cached!</h4>
                        <p className="text-xs text-gray-500">
                          PyPDF successfully resolved 100% of character structures without watermark collision. Check Step 3 Clean Data.
                        </p>
                        <button
                          onClick={() => setActiveStep(3)}
                          className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 shadow-md hover:scale-102 transition-all inline-flex items-center gap-1"
                        >
                          View Extracted Data <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Visualizer Step 3: Cleaned JSON Content */}
                {activeStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">CLEANED PAYLOAD & PARSED METADATA (JSON)</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(cleanedJson, null, 2));
                        }}
                        className="p-1 px-2.5 rounded bg-gray-100 hover:bg-gray-200 text-slate-600 text-[10px] font-bold transition-all flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy JSON
                      </button>
                    </div>

                    <div className="p-5 bg-slate-900 border border-slate-800 text-emerald-400 rounded-xl text-xs font-mono h-[450px] overflow-y-auto leading-relaxed shadow-inner">
                      <pre>{JSON.stringify(cleanedJson, null, 2)}</pre>
                    </div>
                  </motion.div>
                )}

                {/* Visualizer Step 4: AI Prompt Playground */}
                {activeStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="border border-indigo-100 bg-indigo-50/30 p-5 rounded-2xl">
                      <div className="flex gap-3">
                        <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-black text-sm text-slate-800">Google AI Studio Simulation Console</h4>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            The Cleaned Text and JSON structures will be injected as the main payload, matching the exact prompt guidelines defined in the System Prompt.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-2">SYSTEM INSTRUCTION PAYLOAD</span>
                        <div className="text-xs font-mono text-slate-600 h-40 overflow-y-auto whitespace-pre-wrap p-2.5 bg-white border border-gray-200 rounded-lg">
                          {systemPromptText}
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-2">RESOURCE EXTRACTED (USER PAYLOAD)</span>
                        <div className="text-xs font-mono text-slate-600 h-40 overflow-y-auto whitespace-pre-wrap p-2.5 bg-white border border-gray-200 rounded-lg">
                          {cleanedText}
                        </div>
                      </div>
                    </div>

                    {isProcessingAI ? (
                      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center justify-center gap-3">
                        <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
                        <span className="text-xs text-indigo-800 font-bold">Querying Google Gemini model and compiling student views...</span>
                      </div>
                    ) : aiError ? (
                      <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3 text-rose-800">
                        <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                        <div>
                          <h5 className="font-bold text-xs">Gemini Model Error</h5>
                          <p className="text-[11px] mt-0.5">{aiError}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-xs text-gray-400">Click the "Deploy to Student Experience" button on the left panel to execute.</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Visualizer Step 5: Fully Playable Interactive Student Experience */}
                {activeStep === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    
                    {structuredOutput ? (
                      <div>
                        {/* Sub-application Container */}
                        <div className="border-2 border-emerald-500 rounded-2xl bg-white shadow-md overflow-hidden">
                          
                          {/* Mini Header */}
                          <div className="bg-emerald-600 px-5 py-3 text-white flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-5 h-5" />
                              <span className="font-black text-sm">{structuredOutput.title || "Taleem360 Practice Room"}</span>
                            </div>
                            <span className="px-2 py-0.5 bg-white/20 text-[10px] font-mono font-bold uppercase rounded-md">Compiled Student App</span>
                          </div>

                          {/* App Body */}
                          <div className="p-5">
                            
                            {/* Quiz Output Render */}
                            {structuredOutput.questions && (
                              <div className="space-y-6">
                                {structuredOutput.questions.map((q: any, qIdx: number) => (
                                  <div key={q.id || qIdx} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex gap-2.5 items-start">
                                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {qIdx + 1}
                                      </span>
                                      <h4 className="font-bold text-sm text-slate-800 leading-snug">{q.question}</h4>
                                    </div>

                                    {/* Options */}
                                    <div className="mt-3.5 ml-8.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {q.options.map((option: string) => {
                                        const isSelected = selectedAnswers[q.id || qIdx] === option;
                                        const isCorrect = q.correctAnswer === option;
                                        const hasChecked = checkedAnswers[q.id || qIdx];
                                        
                                        let btnClass = "border-gray-200 bg-white text-slate-700 hover:bg-gray-50";
                                        if (isSelected) {
                                          btnClass = "border-indigo-600 bg-indigo-50 text-indigo-900 font-medium";
                                        }
                                        if (hasChecked) {
                                          if (isCorrect) {
                                            btnClass = "border-emerald-600 bg-emerald-50 text-emerald-900 font-bold";
                                          } else if (isSelected) {
                                            btnClass = "border-rose-500 bg-rose-50/50 text-rose-900";
                                          }
                                        }

                                        return (
                                          <button
                                            key={option}
                                            disabled={hasChecked}
                                            onClick={() => handleSelectQuizOption(q.id || qIdx, option)}
                                            className={`text-left p-3 rounded-xl border text-xs transition-all flex justify-between items-center ${btnClass}`}
                                          >
                                            <span>{option}</span>
                                            {hasChecked && isCorrect && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {/* Action & Explanation */}
                                    <div className="mt-3 ml-8.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-gray-100 pt-3">
                                      {selectedAnswers[q.id || qIdx] && !checkedAnswers[q.id || qIdx] ? (
                                        <button
                                          onClick={() => handleCheckQuizAnswer(q.id || qIdx)}
                                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all active:scale-95 duration-100 inline-flex items-center gap-1.5"
                                        >
                                          Check Answer
                                        </button>
                                      ) : <div />}

                                      {checkedAnswers[q.id || qIdx] && (
                                        <div className="text-xs bg-gray-50 border border-gray-200 p-3 rounded-xl w-full">
                                          <span className="font-bold text-indigo-700 block mb-0.5">EXPLANATION:</span>
                                          <p className="text-slate-600 leading-relaxed">{q.explanation || "Correct answer verified based on resource textbooks."}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Flashcard Output Render */}
                            {structuredOutput.cards && (
                              <div className="flex flex-col items-center py-6">
                                <div className="w-full max-w-md h-64 perspective relative mb-6">
                                  <motion.div 
                                    onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                                    className={`w-full h-full relative preserve-3d cursor-pointer duration-500 rounded-2xl border-2 p-6 flex flex-col justify-between items-center transition-all ${
                                      flashcardFlipped 
                                        ? 'bg-indigo-50/50 border-indigo-400 rotate-y-180' 
                                        : 'bg-white border-indigo-600 hover:shadow-lg'
                                    }`}
                                  >
                                    {!flashcardFlipped ? (
                                      <>
                                        <span className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-bold">Concept Flashcard</span>
                                        <h3 className="text-2xl font-black text-slate-800 text-center px-4">
                                          {structuredOutput.cards[activeFlashcard]?.term}
                                        </h3>
                                        <span className="text-xs text-gray-400">Click card to flip and view explanation</span>
                                      </>
                                    ) : (
                                      <div className="flex flex-col justify-between h-full items-center text-center rotate-y-180 px-4">
                                        <span className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-bold">Definition & Context</span>
                                        <p className="text-sm text-slate-700 leading-relaxed font-medium mt-4">
                                          {structuredOutput.cards[activeFlashcard]?.definition}
                                        </p>
                                        <span className="text-xs text-gray-400">Click to flip card back</span>
                                      </div>
                                    )}
                                  </motion.div>
                                </div>

                                <div className="flex items-center gap-4">
                                  <button
                                    disabled={activeFlashcard === 0}
                                    onClick={() => {
                                      setActiveFlashcard(prev => prev - 1);
                                      setFlashcardFlipped(false);
                                    }}
                                    className="px-3.5 py-1.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
                                  >
                                    Previous
                                  </button>
                                  <span className="text-xs font-mono font-bold text-slate-600">
                                    Card {activeFlashcard + 1} of {structuredOutput.cards.length}
                                  </span>
                                  <button
                                    disabled={activeFlashcard === structuredOutput.cards.length - 1}
                                    onClick={() => {
                                      setActiveFlashcard(prev => prev + 1);
                                      setFlashcardFlipped(false);
                                    }}
                                    className="px-3.5 py-1.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
                                  >
                                    Next
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Bilingual Tutor Render */}
                            {structuredOutput.explanations && (
                              <div className="space-y-6">
                                <div className="space-y-4">
                                  {structuredOutput.explanations.map((exp: any, eIdx: number) => (
                                    <div key={eIdx} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm">
                                      <h4 className="font-black text-sm text-indigo-700 mb-2 flex items-center gap-1.5">
                                        <Cpu className="w-4 h-4" /> {exp.concept}
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                                          <div className="flex justify-between mb-1.5">
                                            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                                              <Languages className="w-3 h-3" /> ROMAN URDU COMPANION
                                            </span>
                                          </div>
                                          <p className="text-xs text-slate-700 italic leading-relaxed">
                                            "{exp.romanUrdu}"
                                          </p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                          <div className="flex justify-between mb-1.5">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                              ENGLISH TRANSLATION
                                            </span>
                                          </div>
                                          <p className="text-xs text-slate-600 leading-relaxed">
                                            {exp.english}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Bilingual check quiz */}
                                {structuredOutput.quiz && (
                                  <div className="border border-indigo-100 bg-indigo-50/10 rounded-2xl p-4">
                                    <h4 className="font-bold text-xs text-indigo-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                      <HelpCircle className="w-4 h-4" /> Quick Check Quiz
                                    </h4>
                                    <p className="text-xs text-slate-800 font-bold mb-3">{structuredOutput.quiz.question}</p>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {structuredOutput.quiz.options.map((option: string) => {
                                        const isSelected = tutorQuizAnswer === option;
                                        const isCorrect = structuredOutput.quiz.correctAnswer === option;
                                        
                                        let btnStyle = "border-gray-200 bg-white text-slate-700 hover:bg-gray-50";
                                        if (isSelected) {
                                          btnStyle = "border-indigo-600 bg-indigo-50 text-indigo-900 font-bold";
                                        }
                                        if (tutorQuizChecked) {
                                          if (isCorrect) {
                                            btnStyle = "border-emerald-600 bg-emerald-50 text-emerald-900 font-bold";
                                          } else if (isSelected) {
                                            btnStyle = "border-rose-500 bg-rose-50 text-rose-900";
                                          }
                                        }

                                        return (
                                          <button
                                            key={option}
                                            disabled={tutorQuizChecked}
                                            onClick={() => setTutorQuizAnswer(option)}
                                            className={`text-left p-3 rounded-xl border text-xs transition-all flex justify-between items-center ${btnStyle}`}
                                          >
                                            <span>{option}</span>
                                            {tutorQuizChecked && isCorrect && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {tutorQuizAnswer && !tutorQuizChecked && (
                                      <button
                                        onClick={() => setTutorQuizChecked(true)}
                                        className="mt-3 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm"
                                      >
                                        Check Answer
                                      </button>
                                    )}

                                    {tutorQuizChecked && (
                                      <div className="mt-3 text-xs p-2 rounded bg-emerald-50 text-emerald-800 font-bold">
                                        {tutorQuizAnswer === structuredOutput.quiz.correctAnswer ? "Shabash! Correct answer." : "Ghalat! The correct answer is: " + structuredOutput.quiz.correctAnswer}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-20 text-gray-400">
                        <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h4 className="font-bold text-slate-800">Ready to Compile Student Experience</h4>
                        <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1 leading-relaxed">
                          Set your system prompt on Step 4 and click deploy to generate the custom student learning sandbox.
                        </p>
                      </div>
                    )}

                  </motion.div>
                )}

              </AnimatePresence>

              {/* Back / Next Workspace controls */}
              <div className="flex justify-between items-center border-t border-gray-100 pt-5 mt-8">
                <button
                  disabled={activeStep === 1}
                  onClick={() => {
                    if (activeStep > 1) {
                      setActiveStep((activeStep - 1) as any);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-xl bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40"
                >
                  Previous Node
                </button>
                <button
                  disabled={
                    (activeStep === 1 && pipelineState[2] === 'idle') ||
                    (activeStep === 2 && pipelineState[3] === 'idle') ||
                    (activeStep === 3 && pipelineState[4] === 'idle') ||
                    (activeStep === 4 && pipelineState[5] === 'idle') ||
                    activeStep === 5
                  }
                  onClick={() => {
                    if (activeStep < 5) {
                      setActiveStep((activeStep + 1) as any);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-transparent rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:bg-gray-300 disabled:text-gray-500"
                >
                  Next Node <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
