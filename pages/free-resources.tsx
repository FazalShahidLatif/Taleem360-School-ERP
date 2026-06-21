import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Download, 
  BookOpen, 
  Sparkles, 
  Printer, 
  Heart, 
  Search, 
  Grid, 
  Check, 
  Flame, 
  Maximize2, 
  Smile, 
  Layers, 
  Palette,
  FileDown,
  Trash2,
  Paintbrush,
  Trophy,
  Coins,
  Award,
  ShieldCheck,
  Globe,
  MapPin,
  Send,
  HelpCircle,
  Info
} from 'lucide-react';

import { CompetitionHub } from '../components/CompetitionHub';

export interface FreeResourceAsset {
  id: string;
  title: string;
  category: 'alphabet' | 'numbers' | 'fruits-veggies' | 'shapes' | 'vehicles' | 'scrapbook' | 'sketch-pages' | 'cartoons' | 'comic-characters' | 'sci-fi';
  itemsCount: number;
  path: string;
  ageRange: string;
  colorScheme: {
    bg: string;
    accent: string;
    border: string;
    text: string;
  };
  mockup: React.ReactNode;
}

const FREE_RESOURCE_ASSETS: FreeResourceAsset[] = [
  {
    id: 'pack-1',
    title: 'Alphabet Volume 1: Letters A-G',
    category: 'alphabet',
    itemsCount: 7,
    path: '/resources/packs/alphabet-v1.pdf',
    ageRange: 'Ages 3-5',
    colorScheme: {
      bg: 'bg-rose-50/70',
      accent: 'bg-rose-500',
      border: 'border-rose-100',
      text: 'text-rose-700'
    },
    mockup: (
      <div className="flex flex-col items-center justify-center h-full w-full relative">
        <span className="text-7xl font-extrabold tracking-tight text-slate-800">Aa</span>
        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-xs font-mono text-slate-400">
          <span>Trace: A - B - C - D</span>
          <span>Vol. 1</span>
        </div>
        <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] bg-rose-200 text-rose-800 rounded-md font-bold uppercase">A-G</div>
      </div>
    )
  },
  {
    id: 'pack-2',
    title: 'Alphabet Volume 2: Letters H-P',
    category: 'alphabet',
    itemsCount: 9,
    path: '/resources/packs/alphabet-v2.pdf',
    ageRange: 'Ages 3-5',
    colorScheme: {
      bg: 'bg-amber-50/70',
      accent: 'bg-amber-500',
      border: 'border-amber-100',
      text: 'text-amber-700'
    },
    mockup: (
      <div className="flex flex-col items-center justify-center h-full w-full relative">
        <span className="text-7xl font-extrabold tracking-tight text-slate-800">Mm</span>
        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-xs font-mono text-slate-400">
          <span>Trace: H - I - J - K - L</span>
          <span>Vol. 2</span>
        </div>
        <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] bg-amber-200 text-amber-800 rounded-md font-bold uppercase">H-P</div>
      </div>
    )
  },
  {
    id: 'pack-3',
    title: 'Alphabet Volume 3: Letters Q-Z',
    category: 'alphabet',
    itemsCount: 10,
    path: '/resources/packs/alphabet-v3.pdf',
    ageRange: 'Ages 3-5',
    colorScheme: {
      bg: 'bg-emerald-50/70',
      accent: 'bg-emerald-500',
      border: 'border-emerald-100',
      text: 'text-emerald-700'
    },
    mockup: (
      <div className="flex flex-col items-center justify-center h-full w-full relative">
        <span className="text-7xl font-extrabold tracking-tight text-slate-800">Zz</span>
        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-xs font-mono text-slate-400">
          <span>Trace: Q - R - S - T - U</span>
          <span>Vol. 3</span>
        </div>
        <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] bg-emerald-200 text-emerald-800 rounded-md font-bold uppercase">Q-Z</div>
      </div>
    )
  },
  {
    id: 'pack-4',
    title: 'Number Foundations: Counts 1-5',
    category: 'numbers',
    itemsCount: 5,
    path: '/resources/packs/numbers-v1.pdf',
    ageRange: 'Ages 2-4',
    colorScheme: {
      bg: 'bg-blue-50/70',
      accent: 'bg-blue-500',
      border: 'border-blue-100',
      text: 'text-blue-700'
    },
    mockup: (
      <div className="flex flex-col items-center justify-center h-full w-full relative">
        <div className="flex gap-1 items-end mb-2">
          <div className="text-5xl font-black text-slate-800">1</div>
          <div className="text-5xl font-black text-slate-300">2</div>
          <div className="text-5xl font-black text-slate-800">3</div>
        </div>
        <div className="flex gap-2 mb-4">
          <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse"></div>
          <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse"></div>
          <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse"></div>
        </div>
        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-xs font-mono text-slate-400">
          <span>Trace: One - Two - Three</span>
          <span>1-5</span>
        </div>
      </div>
    )
  },
  {
    id: 'pack-5',
    title: 'Counting Mastery: Counts 6-10',
    category: 'numbers',
    itemsCount: 5,
    path: '/resources/packs/numbers-v2.pdf',
    ageRange: 'Ages 3-5',
    colorScheme: {
      bg: 'bg-purple-50/70',
      accent: 'bg-purple-500',
      border: 'border-purple-100',
      text: 'text-purple-700'
    },
    mockup: (
      <div className="flex flex-col items-center justify-center h-full w-full relative">
        <div className="flex gap-1 items-end mb-1">
          <span className="text-6xl font-black text-slate-800">8</span>
          <span className="text-2xl font-bold text-slate-400">★</span>
        </div>
        <div className="grid grid-cols-4 gap-1 mb-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full border border-purple-400"></div>
          ))}
        </div>
        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-xs font-mono text-slate-400">
          <span>Trace: Six - Seven - Eight</span>
          <span>6-10</span>
        </div>
      </div>
    )
  },
  {
    id: 'pack-6',
    title: 'Advanced Double Digits: Counts 11-20',
    category: 'numbers',
    itemsCount: 10,
    path: '/resources/packs/numbers-v3.pdf',
    ageRange: 'Ages 4-6',
    colorScheme: {
      bg: 'bg-teal-50/70',
      accent: 'bg-teal-500',
      border: 'border-teal-100',
      text: 'text-teal-700'
    },
    mockup: (
      <div className="flex flex-col items-center justify-center h-full w-full relative">
        <span className="text-6xl font-black text-slate-800">15</span>
        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-xs font-mono text-slate-400">
          <span>Double-digit sequence count</span>
          <span>11-20</span>
        </div>
        <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] bg-teal-200 text-teal-800 rounded-md font-bold uppercase">10 Pages</div>
      </div>
    )
  },
  {
    id: 'pack-7',
    title: 'Orchard Collection: Common Fruits',
    category: 'fruits-veggies',
    itemsCount: 8,
    path: '/resources/packs/fruits-pack.pdf',
    ageRange: 'Ages 2-5',
    colorScheme: {
      bg: 'bg-pink-50/70',
      accent: 'bg-pink-500',
      border: 'border-pink-100',
      text: 'text-pink-700'
    },
    mockup: (
      <div className="flex flex-col items-center justify-center h-full w-full relative">
        <div className="text-6xl filter drop-shadow">🍎</div>
        <span className="text-sm font-bold text-slate-700 mt-2 uppercase tracking-wide">A-P-P-L-E</span>
        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-xs font-mono text-slate-400">
          <span>Apple • Banana • Orange</span>
          <span>Fruits</span>
        </div>
      </div>
    )
  },
  {
    id: 'pack-8',
    title: 'Garden Harvest: Fresh Vegetables',
    category: 'fruits-veggies',
    itemsCount: 8,
    path: '/resources/packs/vegetables-pack.pdf',
    ageRange: 'Ages 2-5',
    colorScheme: {
      bg: 'bg-lime-50/70',
      accent: 'bg-lime-600',
      border: 'border-lime-100',
      text: 'text-lime-700'
    },
    mockup: (
      <div className="flex flex-col items-center justify-center h-full w-full relative">
        <div className="text-6xl">🥕</div>
        <span className="text-sm font-bold text-slate-700 mt-2 uppercase tracking-wide">C-A-R-R-O-T</span>
        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-xs font-mono text-slate-400">
          <span>Carrot • Broccoli • Tomato</span>
          <span>Veggies</span>
        </div>
      </div>
    )
  },
  {
    id: 'pack-9',
    title: 'Basic Geometry: Shapes & Patterns',
    category: 'shapes',
    itemsCount: 6,
    path: '/resources/packs/shapes-pack.pdf',
    ageRange: 'Ages 2-4',
    colorScheme: {
      bg: 'bg-sky-50/70',
      accent: 'bg-sky-500',
      border: 'border-sky-100',
      text: 'text-sky-700'
    },
    mockup: (
      <div className="flex flex-col items-center justify-center h-full w-full relative">
        <div className="flex gap-3 justify-center items-center">
          <div className="w-12 h-12 rounded-full border-4 border-dashed border-slate-700"></div>
          <div className="w-12 h-12 border-4 border-dashed border-slate-700"></div>
        </div>
        <span className="text-xs font-bold text-slate-500 mt-3">CIRCLE • SQUARE • TRIANGLE</span>
        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-xs font-mono text-slate-400">
          <span>Dotted tracing structures</span>
          <span>Shapes</span>
        </div>
      </div>
    )
  },
  {
    id: 'pack-10',
    title: 'Early Transport: Vehicles & Logistics',
    category: 'vehicles',
    itemsCount: 8,
    path: '/resources/packs/vehicles-pack.pdf',
    ageRange: 'Ages 3-6',
    colorScheme: {
      bg: 'bg-violet-50/70',
      accent: 'bg-violet-500',
      border: 'border-violet-100',
      text: 'text-violet-700'
    },
    mockup: (
      <div className="flex flex-col items-center justify-center h-full w-full relative">
        <div className="text-6xl">🚌</div>
        <span className="text-sm font-bold text-slate-700 mt-2 uppercase tracking-wide">S-C-H-O-O-L  B-U-S</span>
        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-xs font-mono text-slate-400">
          <span>Bus • Airplane • Bicycle</span>
          <span>Vehicles</span>
        </div>
      </div>
    )
  },
  {
    id: 'pack-11',
    title: 'Creative Scrapbook & Memory Maker Pack',
    category: 'scrapbook',
    itemsCount: 15,
    path: '/resources/packs/scrapbook-pack.pdf',
    ageRange: 'All Ages',
    colorScheme: {
      bg: 'bg-amber-50/60',
      accent: 'bg-amber-500',
      border: 'border-amber-200',
      text: 'text-amber-800'
    },
    mockup: (
      <div className="flex flex-col items-center justify-center h-full w-full relative p-2">
        <div className="border border-dashed border-slate-400 p-2 bg-amber-50/30 rounded-lg flex flex-col items-center w-40">
          <div className="flex gap-1.5 mb-1.5">
            <span className="text-xl">📸</span>
            <span className="text-xl">🎀</span>
            <span className="text-xl">✨</span>
          </div>
          <span className="text-[10px] font-bold text-slate-700 tracking-wider">MY MEMORIES</span>
          <div className="w-full h-1 bg-slate-200 mt-2 rounded"></div>
          <div className="w-3/4 h-1 bg-slate-200 mt-1 rounded"></div>
        </div>
        <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] bg-amber-200 text-amber-900 rounded-md font-bold uppercase">Scrapbook</div>
      </div>
    )
  },
  {
    id: 'pack-12',
    title: 'Pro-Sketch Guides: Perspective & Nature Drawings',
    category: 'sketch-pages',
    itemsCount: 12,
    path: '/resources/packs/sketch-pack.pdf',
    ageRange: 'Ages 6-12',
    colorScheme: {
      bg: 'bg-stone-100',
      accent: 'bg-stone-600',
      border: 'border-stone-200',
      text: 'text-stone-700'
    },
    mockup: (
      <div className="flex flex-col items-center justify-center h-full w-full relative p-2">
        <div className="w-24 h-16 border-2 border-stone-400 rounded relative flex items-center justify-center bg-stone-50">
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <svg className="w-full h-full text-stone-500" viewBox="0 0 100 50">
              <path d="M 0,40 L 30,10 L 60,35 L 80,20 L 100,45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
            </svg>
          </div>
          <span className="text-[9px] font-mono font-bold text-stone-600 z-10 uppercase tracking-widest bg-stone-100/80 px-1 border border-stone-200">Sketch Guide</span>
        </div>
        <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] bg-stone-300 text-stone-800 rounded-md font-bold uppercase">Drawing</div>
      </div>
    )
  },
  {
    id: 'pack-13',
    title: 'Chibi Friends: Ultimate Cartoon Coloring Book',
    category: 'cartoons',
    itemsCount: 20,
    path: '/resources/packs/cartoons-pack.pdf',
    ageRange: 'Ages 3-8',
    colorScheme: {
      bg: 'bg-pink-50/70',
      accent: 'bg-pink-500',
      border: 'border-pink-100',
      text: 'text-pink-700'
    },
    mockup: (
      <div className="flex flex-col items-center justify-center h-full w-full relative p-2">
        <div className="text-5xl filter drop-shadow">🐼</div>
        <div className="text-[10px] font-bold text-pink-700 uppercase tracking-widest bg-pink-100/80 px-2 py-0.5 rounded border border-pink-200 mt-2">
          Cute Chibi Animals
        </div>
        <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] bg-pink-200 text-pink-800 rounded-md font-bold uppercase">Cartoons</div>
      </div>
    )
  },
  {
    id: 'pack-14',
    title: 'Action Superheroes & Comic Panel Frames',
    category: 'comic-characters',
    itemsCount: 16,
    path: '/resources/packs/comics-pack.pdf',
    ageRange: 'Ages 5-12',
    colorScheme: {
      bg: 'bg-red-50/70',
      accent: 'bg-red-500',
      border: 'border-red-100',
      text: 'text-red-700'
    },
    mockup: (
      <div className="flex flex-col items-center justify-center h-full w-full relative p-2">
        <div className="font-extrabold text-3xl text-red-600 uppercase tracking-tighter bg-amber-300 px-3 py-1 rounded-lg border-2 border-slate-900 rotate-[-4deg] shadow-xs">
          BOOM!
        </div>
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-2">Action Comic Panels</span>
        <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] bg-red-200 text-red-800 rounded-md font-bold uppercase">Comics</div>
      </div>
    )
  },
  {
    id: 'pack-15',
    title: 'Cosmic Odyssey: Advanced Space & Sci-Fi Coloring',
    category: 'sci-fi',
    itemsCount: 18,
    path: '/resources/packs/scifi-pack.pdf',
    ageRange: 'Ages 6-14',
    colorScheme: {
      bg: 'bg-indigo-50/70',
      accent: 'bg-indigo-500',
      border: 'border-indigo-100',
      text: 'text-indigo-700'
    },
    mockup: (
      <div className="flex flex-col items-center justify-center h-full w-full relative p-2">
        <div className="flex items-center gap-1">
          <span className="text-4xl text-slate-800">🚀</span>
          <span className="text-xl">🪐</span>
        </div>
        <span className="text-[10px] uppercase font-mono font-bold text-indigo-700 tracking-widest mt-2 bg-indigo-100/50 px-1.5 py-0.5 rounded border border-indigo-200">Cosmos Quest</span>
        <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] bg-indigo-200 text-indigo-800 rounded-md font-bold uppercase">Sci-Fi</div>
      </div>
    )
  }
];

export const FreeResources: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'resources' | 'competitions'>('resources');
  
  // Competition State Variables
  const [compSearch, setCompSearch] = useState('');
  const [compCategory, setCompCategory] = useState('all');
  const [compEntrantInput, setCompEntrantInput] = useState<number>(2450);
  const [compFeeChoice, setCompFeeChoice] = useState<number>(2); // default $2
  
  // Participant Form States
  const [studName, setStudName] = useState('');
  const [studEmail, setStudEmail] = useState('');
  const [studGrade, setStudGrade] = useState('Grade 5');
  const [studSchool, setStudSchool] = useState('');
  const [studCity, setStudCity] = useState('');
  const [studCountry, setStudCountry] = useState('Pakistan');
  const [compChoiceCategory, setCompChoiceCategory] = useState('art');
  const [compTitleInput, setCompTitleInput] = useState('');
  const [compPayload, setCompPayload] = useState('');
  const [compFormFee, setCompFormFee] = useState<number>(2);
  const [isSubmittingComp, setIsSubmittingComp] = useState(false);
  const [compSuccess, setCompSuccess] = useState(false);

  // Default entries to populate the talent gallery instantly
  const [compSubmissions, setCompSubmissions] = useState<Array<{
    id: string;
    studentName: string;
    grade: string;
    schoolName: string;
    city: string;
    country: string;
    category: 'writing' | 'art' | 'code';
    title: string;
    payloadSnippet: string;
    feePaid: number;
    txnHash: string;
    status: 'Evaluated' | 'Approved' | 'Winner';
    prizeDetails?: string;
  }>>([
    {
      id: 'sub-comp-01',
      studentName: 'Zainab Fatima',
      grade: 'Grade 5',
      schoolName: 'The City School Capital Campus',
      city: 'Islamabad',
      country: 'Pakistan',
      category: 'art',
      title: 'Water Colors of Margalla Hills sunrise',
      payloadSnippet: 'An active watercolor painting tracing solar rise gradients over Islamabad mountains utilizing geometric space perspectives with lovely violet tones.',
      feePaid: 2,
      txnHash: '0x3dfa...78a1',
      status: 'Winner',
      prizeDetails: 'Rank 1 ($271.50 Prize Pot distributed!)'
    },
    {
      id: 'sub-comp-02',
      studentName: 'Ayaan Ahmed',
      grade: 'Grade 10 / O Levels',
      schoolName: 'Roots Millennium School',
      city: 'Peshawar',
      country: 'Pakistan',
      category: 'code',
      title: 'Taleem Solar Tracker Python Simulator',
      payloadSnippet: 'A light-weight python algorithm simulating solar panel orbit alignment ratios using visual pandas & numpy coordinates for grade optimization.',
      feePaid: 2,
      txnHash: '0x6e31...88c2',
      status: 'Winner',
      prizeDetails: 'Rank 2 ($181.00 Prize Pot distributed!)'
    },
    {
      id: 'sub-comp-03',
      studentName: 'Sarah Jenkins',
      grade: 'Grade 8',
      schoolName: 'Central High School',
      city: 'London',
      country: 'United Kingdom',
      category: 'writing',
      title: 'The Future of Green Energy in Classrooms',
      payloadSnippet: 'A 600-word descriptive article mapping the carbon footprint optimizations achievable via standard kinetic desk rotations and energy metrics analysis.',
      feePaid: 1,
      txnHash: '0x99a2...91b0',
      status: 'Winner',
      prizeDetails: 'Rank 3 ($90.50 Prize Pot distributed!)'
    },
    {
      id: 'sub-comp-04',
      studentName: 'Haris Khan',
      grade: 'Grade 4',
      schoolName: 'Beaconhouse School System',
      city: 'Lahore',
      country: 'Pakistan',
      category: 'art',
      title: 'Futuristic Eco-Friendly School Bus Design',
      payloadSnippet: 'A digital sketch showcasing wind turbines on student double-decker electric transit, finished with bright yellow and solar paneled accents.',
      feePaid: 2,
      txnHash: '0xfa11...2392',
      status: 'Approved',
    },
    {
      id: 'sub-comp-05',
      studentName: 'Clara Oswald',
      grade: 'Grade 9',
      schoolName: 'Maplewood Prep',
      city: 'Toronto',
      country: 'Canada',
      category: 'writing',
      title: 'Why coding will save our oceans',
      payloadSnippet: 'A reflective essay studying drone mapping optimization metrics that track plastic trash currents globally using simple standard algorithms.',
      feePaid: 1,
      txnHash: '0xbb82...1049',
      status: 'Approved',
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadProgress, setDownloadProgress] = useState<Record<string, boolean>>({});

  // Interactive Coloring & Art Studio Sandbox states
  const [activeStudioCategory, setActiveStudioCategory] = useState<string>('cartoons');
  const [activeColor, setActiveColor] = useState<string>('#ec4899'); // default lovely pink
  const [activeSticker, setActiveSticker] = useState<string | null>(null);
  const [paintedElements, setPaintedElements] = useState<Record<string, string>>({});
  const [scrapbookCaption, setScrabookCaption] = useState<string>('My Adventure Book!');
  const [stickersList, setStickersList] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);

  useEffect(() => {
    // Standard non-blocking SEO setup
    document.title = 'Free Printable Coloring Pages & Tracing PDFs | Taleem360';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Access free printable alphabet, number, fruit, vegetable, custom scrapbook, and sci-fi cartoons coloring pages. Quality sequence sheets designed for children of all ages.');

    // Adding dynamic page analytics tags optionally or updating canonical links
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', 'https://taleem360.online/free-resources');
  }, []);

  // Filter Logic matching categories properly
  const filteredAssets = FREE_RESOURCE_ASSETS.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === 'shapes-vehicles') {
      return (asset.category === 'shapes' || asset.category === 'vehicles') && matchesSearch;
    }
    return asset.category === selectedCategory && matchesSearch;
  });

  // Simulated instant feedback download activation triggers
  const triggerDownloadIndicator = (id: string) => {
    setDownloadProgress(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setDownloadProgress(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Premium Hero Banner Card */}
      <section className="relative overflow-hidden rounded-3xl bg-indigo-600 px-6 py-16 sm:px-12 sm:py-24 shadow-xl border border-indigo-500/10">
        <div className="relative z-10 max-w-3xl">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-500/30 text-indigo-100 text-xs font-bold mb-6 backdrop-blur-sm border border-indigo-400/20"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Empowering Foundational Learning
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none mb-6"
          >
            Free Creative Resources <br />
            <span className="text-amber-300">for Early Learners</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-indigo-100 max-w-xl leading-relaxed mb-8"
          >
            Download high-contrast sequence coloring pages and foundational tracing books designed for preschool and kindergarten students. Providing free resource for students globaly.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 text-xs font-medium text-indigo-100"
          >
            <div className="flex items-center gap-1.5 bg-indigo-700/50 px-3 py-2 rounded-lg border border-indigo-500/25">
              <Printer className="w-3.5 h-3.5 text-indigo-200" />
              <span>Printer Friendly Design</span>
            </div>
            <div className="flex items-center gap-1.5 bg-indigo-700/50 px-3 py-2 rounded-lg border border-indigo-500/25">
              <BookOpen className="w-3.5 h-3.5 text-indigo-200" />
              <span>Full Worksheets Bundle</span>
            </div>
            <div className="flex items-center gap-1.5 bg-indigo-700/50 px-3 py-2 rounded-lg border border-indigo-500/25">
              <Heart className="w-3.5 h-3.5 text-pink-300" />
              <span>Completely Free</span>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Abstract Art Background */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-10 -mb-20 w-80 h-80 bg-pink-400 rounded-full blur-3xl opacity-20"></div>
      </section>

      {/* Platform Core Segment Navigation Switcher */}
      <div id="main-t360-hub-tabs" className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveMainTab('resources')}
          className={`flex-1 sm:flex-initial text-center px-6 py-4.5 text-sm font-bold border-b-2 transition-all ${
            activeMainTab === 'resources'
              ? 'border-indigo-600 text-indigo-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          🎨 Worksheets & Digital Art Sandbox
        </button>
        <button
          onClick={() => setActiveMainTab('competitions')}
          className={`flex-1 sm:flex-initial text-center px-6 py-4.5 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'competitions'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/20 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <span>🏆 Global Student Competition Hub</span>
          <span className="bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse uppercase tracking-wider">PRE-K to 12th</span>
        </button>
      </div>

      {activeMainTab === 'resources' ? (
        <>

      {/* Interactive Creative Art & Craft Studio Sandbox */}
      <section className="bg-gradient-to-br from-indigo-50/50 via-slate-50 to-pink-50/30 rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-xs space-y-8 no-print">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-black uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Interactive Arts & Craft Sandbox Studio
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Digital Art & Scrapbook Studio
          </h2>
          <p className="text-slate-500 text-sm mt-1 leading-relaxed">
            Choose from our brand new expanded categories below. Paint interactive sheets with our candy color palette, stamp collectible scrapbook stickers, and type custom Polaroid captions instantly in your web browser!
          </p>
        </div>

        {/* Studio Category Selection Tabs & Controller */}
        <div className="flex flex-wrap gap-2 pb-4 border-b border-indigo-50/60">
          {[
            { id: 'cartoons', label: 'Cute Cartoons', icon: '🐼' },
            { id: 'scrapbook', label: 'Creative Scrapbook', icon: '📸' },
            { id: 'sketch-pages', label: 'Nature Sketch', icon: '⛰️' },
            { id: 'comic-characters', label: 'Comic Superheroes', icon: '⚡️' },
            { id: 'sci-fi', label: 'Sci-Fi Cosmos', icon: '🚀' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveStudioCategory(tab.id);
                setPaintedElements({});
                setStickersList([]);
                setActiveSticker(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                activeStudioCategory === tab.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 scale-105 active:scale-95 font-extrabold'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 shadow-3xs active:scale-98'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Master Studio Workspace Panel */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Workspace Left controls - spans 5 cols */}
          <div className="xl:col-span-5 space-y-6 bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs">
            {/* Color Palette Header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <Paintbrush className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Coloring Palette</span>
                </h4>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Brush Active
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { name: 'Pink Blush', value: '#ec4899' },
                  { name: 'Tangerine', value: '#f97316' },
                  { name: 'Sunflower', value: '#eab308' },
                  { name: 'Emerald', value: '#10b981' },
                  { name: 'Sky Splash', value: '#0ea5e9' },
                  { name: 'Lilac', value: '#a855f7' },
                  { name: 'Deep Nebula', value: '#6366f1' },
                  { name: 'Candy Red', value: '#ef4444' },
                  { name: 'Charcoal', value: '#1e293b' },
                  { name: 'Vanilla White', value: '#ffffff' },
                ].map((color) => {
                  const isSelected = activeColor === color.value;
                  return (
                    <button
                      key={color.value}
                      onClick={() => {
                        setActiveColor(color.value);
                        setActiveSticker(null); // Turn off sticker mode
                      }}
                      title={color.name}
                      style={{ backgroundColor: color.value }}
                      className={`h-9 w-full rounded-lg transition-transform hover:scale-110 relative flex items-center justify-center ${
                        color.value === '#ffffff' ? 'bg-white border border-slate-200' : ''
                      } ${isSelected ? 'ring-2 ring-indigo-600 ring-offset-2 scale-105' : ''}`}
                    >
                      {isSelected && (
                        <div className={`w-2 h-2 rounded-full ${color.value === '#ffffff' ? 'bg-slate-800' : 'bg-white'}`}></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sticker Stamp Pad Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  <span>Stickers Stamp Box</span>
                </h4>
                <span className="text-[10px] bg-pink-50 text-pink-600 border border-pink-100 px-2 py-0.5 rounded font-black uppercase tracking-wide">
                  Stamps Mode
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal mb-3">
                Select a sticker below, then click inside the artwork box to stamp. Click a placed sticker to erase it.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {['🧸', '🎈', '🌟', '🐱', '🚀', '🌸', '⚡️', '❤️', '🛸', '🍩', '🍪', '🎨', '👑', '🌈'].map((emoji) => {
                  const isSelected = activeSticker === emoji;
                  return (
                    <button
                      key={emoji}
                      onClick={() => setActiveSticker(isSelected ? null : emoji)}
                      className={`text-2xl p-2 rounded-xl transition duration-150 hover:bg-slate-100 active:scale-95 border ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20 scale-105 font-bold' 
                          : 'border-slate-100 bg-slate-50'
                      }`}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
              {activeSticker && (
                <div className="mt-3 p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-800 font-medium">
                  🌟 <strong>Stamp tool ready:</strong> Click inside the artwork on the right to stamp <strong>{activeSticker}</strong>!
                </div>
              )}
            </div>

            {/* Conditional input controls for Scrapbook */}
            {activeStudioCategory === 'scrapbook' && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Customize Polaroid Caption:
                </h4>
                <input
                  type="text"
                  maxLength={24}
                  value={scrapbookCaption}
                  onChange={(e) => setScrabookCaption(e.target.value)}
                  placeholder="e.g. Happy Holidays!"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors font-semibold"
                />
              </div>
            )}

            {/* Utility control Actions */}
            <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setPaintedElements({});
                  setStickersList([]);
                  setActiveSticker(null);
                }}
                className="flex-1 py-2 px-3 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Canvas</span>
              </button>

              <button
                onClick={() => {
                  const svgElement = document.getElementById('studio-canvas-svg');
                  if (!svgElement) return;
                  const svgString = new XMLSerializer().serializeToString(svgElement);
                  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                  const svgUrl = URL.createObjectURL(svgBlob);
                  const downloadLink = document.createElement('a');
                  downloadLink.href = svgUrl;
                  downloadLink.download = `Taleem360_Masterpiece_${activeStudioCategory}.svg`;
                  document.body.appendChild(downloadLink);
                  downloadLink.click();
                  document.body.removeChild(downloadLink);
                }}
                className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5 shadow-3xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Artwork (.SVG)</span>
              </button>
            </div>
          </div>

          {/* Workspace Right preview - spans 7 cols */}
          <div className="xl:col-span-7 flex flex-col items-center">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 italic">
              Digital Canvas • Tap regions to paint with active brush
            </h4>

            {/* Actual dynamic SVG render matrix wrapper */}
            <div className="w-full max-w-[380px] sm:max-w-[420px] aspect-square bg-white border border-slate-200 rounded-3xl p-4 shadow-md relative group select-none">
              <svg
                id="studio-canvas-svg"
                viewBox="0 0 400 400"
                className="w-full h-full cursor-crosshair rounded-2xl overflow-hidden"
                onClick={(e) => {
                  // Compute click offset inside viewBox coordinate bounds for stickers
                  if (activeSticker) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 400;
                    const y = ((e.clientY - rect.top) / rect.height) * 400;
                    setStickersList(prev => [...prev, { id: Date.now(), emoji: activeSticker, x, y }]);
                  }
                }}
              >
                {/* 1. Cartoon Panda */}
                {activeStudioCategory === 'cartoons' && (
                  <>
                    {/* Sky Background */}
                    <rect 
                      width="400" 
                      height="400" 
                      fill={paintedElements['cartoon-bg'] || '#fefafe'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'cartoon-bg': activeColor}))}} 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    
                    {/* Sky clouds */}
                    <path 
                      d="M 60,60 Q 80,40 100,60 Q 120,40 140,60 Q 160,40 180,60 Q 190,80 170,95 L 70,95 Z" 
                      fill={paintedElements['cloud-l'] || '#ffffff'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'cloud-l': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="3.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    
                    {/* Left Bamboo stalk */}
                    <rect 
                      x="25" 
                      y="60" 
                      width="18" 
                      height="310" 
                      rx="3" 
                      fill={paintedElements['bamboo-stalk'] || '#e2e8f0'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'bamboo-stalk': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="3.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    <line x1="25" y1="120" x2="43" y2="120" stroke="#475569" strokeWidth="3" />
                    <line x1="25" y1="190" x2="43" y2="190" stroke="#475569" strokeWidth="3" />
                    <line x1="25" y1="260" x2="43" y2="260" stroke="#475569" strokeWidth="3" />

                    {/* Ears */}
                    <circle 
                      cx="140" 
                      cy="110" 
                      r="26" 
                      fill={paintedElements['ear-l'] || '#334155'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'ear-l': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="3.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    <circle 
                      cx="260" 
                      cy="110" 
                      r="26" 
                      fill={paintedElements['ear-r'] || '#334155'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'ear-r': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="3.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Face outline */}
                    <circle 
                      cx="200" 
                      cy="180" 
                      r="80" 
                      fill={paintedElements['panda-face'] || '#ffffff'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'panda-face': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="4" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Eye Patches */}
                    <ellipse 
                      cx="168" 
                      cy="175" 
                      rx="16" 
                      ry="22" 
                      fill={paintedElements['eye-patch-l'] || '#475569'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'eye-patch-l': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="3.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    <ellipse 
                      cx="232" 
                      cy="175" 
                      rx="16" 
                      ry="22" 
                      fill={paintedElements['eye-patch-r'] || '#475569'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'eye-patch-r': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="3.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* White Pupil Highlights */}
                    <circle cx="168" cy="170" r="6" fill="#ffffff" />
                    <circle cx="232" cy="170" r="6" fill="#ffffff" />

                    {/* Soft blushes */}
                    <circle 
                      cx="145" 
                      cy="210" 
                      r="10" 
                      fill={paintedElements['blush-l'] || '#ffe4e6'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'blush-l': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="2.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    <circle 
                      cx="255" 
                      cy="210" 
                      r="10" 
                      fill={paintedElements['blush-r'] || '#ffe4e6'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'blush-r': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="2.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Little cute nose */}
                    <ellipse 
                      cx="200" 
                      cy="192" 
                      rx="8" 
                      ry="5" 
                      fill={paintedElements['panda-nose'] || '#1e293b'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'panda-nose': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="2" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Cute smile path */}
                    <path 
                      d="M 194,204 Q 200,210 206,204" 
                      fill="none" 
                      stroke="#475569" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                    />

                    {/* Paws */}
                    <circle 
                      cx="146" 
                      cy="260" 
                      r="16" 
                      fill={paintedElements['paw-l'] || '#334155'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'paw-l': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="3.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    <circle 
                      cx="254" 
                      cy="260" 
                      r="16" 
                      fill={paintedElements['paw-r'] || '#334155'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'paw-r': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="3.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Boba Cup body */}
                    <path 
                      d="M 160,245 L 240,245 L 230,340 L 170,340 Z" 
                      fill={paintedElements['boba-cup-body'] || '#f1f5f9'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'boba-cup-body': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="4" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Boba tea tea-liquid height */}
                    <path 
                      d="M 163,270 L 237,270 L 230,340 L 170,340 Z" 
                      fill={paintedElements['boba-liquid'] || '#fed7aa'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'boba-liquid': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="3" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Drinking Straw */}
                    <rect 
                      x="193" 
                      y="210" 
                      width="14" 
                      height="65" 
                      transform="rotate(-15 200 240)" 
                      fill={paintedElements['boba-straw'] || '#fca5a5'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'boba-straw': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="2.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Boba pearls */}
                    <circle 
                      cx="185" 
                      cy="315" 
                      r="8" 
                      fill={paintedElements['pearl-1'] || '#1e293b'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'pearl-1': activeColor}))}} 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    <circle 
                      cx="202" 
                      cy="325" 
                      r="8" 
                      fill={paintedElements['pearl-2'] || '#1e293b'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'pearl-2': activeColor}))}} 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    <circle 
                      cx="218" 
                      cy="312" 
                      r="8" 
                      fill={paintedElements['pearl-3'] || '#1e293b'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'pearl-3': activeColor}))}} 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                  </>
                )}

                {/* 2. Scrapbook template */}
                {activeStudioCategory === 'scrapbook' && (
                  <>
                    {/* Binders Background */}
                    <rect 
                      width="400" 
                      height="400" 
                      fill={paintedElements['scrapbook-bg'] || '#fffef0'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'scrapbook-bg': activeColor}))}} 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Pretty scrapbook trim lines */}
                    <rect 
                      x="12" 
                      y="12" 
                      width="376" 
                      height="376" 
                      fill="none" 
                      stroke={paintedElements['scrapbook-stitch'] || '#cbd5e1'} 
                      strokeWidth="6" 
                      strokeDasharray="14, 8" 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'scrapbook-stitch': activeColor}))}}
                      style={{ cursor: 'pointer', transition: 'stroke 200ms' }}
                    />

                    {/* Polaroid Outer photo Card */}
                    <rect 
                      x="110" 
                      y="85" 
                      width="180" 
                      height="230" 
                      rx="6" 
                      fill={paintedElements['scrb-polaroid'] || '#ffffff'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'scrb-polaroid': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="4" 
                      transform="rotate(-3 200 200)"
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Inner Picture placeholder area */}
                    <rect 
                      x="125" 
                      y="100" 
                      width="150" 
                      height="150" 
                      fill={paintedElements['scrb-photo'] || '#f0f9ff'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'scrb-photo': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="3.5" 
                      transform="rotate(-3 200 200)"
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Washi masking tape */}
                    <polygon 
                      points="165,65 235,70 230,95 160,90" 
                      fill={paintedElements['scrb-tape'] || '#fed7aa'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'scrb-tape': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="3" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Star sticker ornament */}
                    <polygon 
                      points="65,80 70,95 86,95 73,103 78,118 65,108 52,118 57,103 44,95 60,95" 
                      fill={paintedElements['scrb-star-1'] || '#fef08a'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'scrb-star-1': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="2.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Heart sticker (left) */}
                    <path 
                      d="M 65,280 C 50,260 30,280 65,315 C 100,280 80,260 65,280 Z" 
                      fill={paintedElements['scrb-heart'] || '#fca5a5'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'scrb-heart': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="3" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Polaroid Custom Text block */}
                    <text 
                      x="200" 
                      y="295" 
                      textAnchor="middle" 
                      transform="rotate(-3 200 200)" 
                      className="font-serif font-black italic text-slate-800 text-sm tracking-wide select-none"
                    >
                      {scrapbookCaption || 'Memories!'}
                    </text>
                  </>
                )}

                {/* 3. Landscape Sketch Pages */}
                {activeStudioCategory === 'sketch-pages' && (
                  <>
                    {/* Skybg */}
                    <rect 
                      width="400" 
                      height="400" 
                      fill={paintedElements['sketch-sky'] || '#bae6fd'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'sketch-sky': activeColor}))}} 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Radiant sun disk */}
                    <circle 
                      cx="315" 
                      cy="85" 
                      r="32" 
                      fill={paintedElements['sketch-sun'] || '#fef08a'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'sketch-sun': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="3" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Left Mountain range */}
                    <polygon 
                      points="-10,310 130,130 260,310" 
                      fill={paintedElements['mtn-left'] || '#f1f5f9'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'mtn-left': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="4" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Right mountain range */}
                    <polygon 
                      points="110,310 260,105 410,310" 
                      fill={paintedElements['mtn-right'] || '#cbd5e1'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'mtn-right': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="4" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Meadow ground */}
                    <path 
                      d="M -10,310 Q 100,290 200,310 T 410,310 L 410,410 L -10,410 Z" 
                      fill={paintedElements['grass-meadow'] || '#bbf7d0'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'grass-meadow': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="4" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Sinuous snaky river */}
                    <path 
                      d="M 190,310 Q 205,340 180,365 T 215,410 L 255,410 Q 220,365 235,340 T 215,310 Z" 
                      fill={paintedElements['sketch-river'] || '#93c5fd'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'sketch-river': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="3.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Evergreen Pine Trees left */}
                    <polygon 
                      points="55,270 85,270 70,225" 
                      fill={paintedElements['pine-1-1'] || '#15803d'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'pine-1-1': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="2.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    <polygon 
                      points="60,230 80,230 70,195" 
                      fill={paintedElements['pine-1-2'] || '#14532d'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'pine-1-2': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="2.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Evergreen Pine Trees right */}
                    <polygon 
                      points="315,290 355,290 335,240" 
                      fill={paintedElements['pine-2-1'] || '#15803d'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'pine-2-1': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="2.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    <polygon 
                      points="320,250 350,250 335,210" 
                      fill={paintedElements['pine-2-2'] || '#166534'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'pine-2-2': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="2.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                  </>
                )}

                {/* 4. Comic Book Superheroes */}
                {activeStudioCategory === 'comic-characters' && (
                  <>
                    {/* Retro radial comic bg */}
                    <rect 
                      width="400" 
                      height="400" 
                      fill={paintedElements['comic-sky'] || '#fffebd'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'comic-sky': activeColor}))}} 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Sunburst action wedges */}
                    <polygon 
                      points="200,200 40,0 120,0" 
                      fill={paintedElements['ray-1'] || '#f97316'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'ray-1': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="2" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    <polygon 
                      points="200,200 270,0 350,0" 
                      fill={paintedElements['ray-2'] || '#f97316'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'ray-2': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="2" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    <polygon 
                      points="200,200 400,105 400,185" 
                      fill={paintedElements['ray-3'] || '#fc8181'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'ray-3': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="2" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    <polygon 
                      points="200,200 400,290 320,400" 
                      fill={paintedElements['ray-4'] || '#facc15'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'ray-4': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="2" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    <polygon 
                      points="200,200 80,400 0,320" 
                      fill={paintedElements['ray-5'] || '#ec4899'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'ray-5': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="2" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* City Silhouette */}
                    <rect 
                      x="25" 
                      y="230" 
                      width="75" 
                      height="170" 
                      rx="3" 
                      fill={paintedElements['bldg-l'] || '#334155'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'bldg-l': activeColor}))}} 
                      stroke="#1e293b" 
                      strokeWidth="3.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    <rect x="40" y="255" width="14" height="20" fill={paintedElements['window-l-1'] || '#ffffff'} onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'window-l-1': activeColor}))}} style={{ cursor: 'pointer' }} />
                    <rect x="65" y="255" width="14" height="20" fill={paintedElements['window-l-2'] || '#ffffff'} onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'window-l-2': activeColor}))}} style={{ cursor: 'pointer' }} />

                    <rect 
                      x="300" 
                      y="215" 
                      width="75" 
                      height="190" 
                      rx="3" 
                      fill={paintedElements['bldg-r'] || '#475569'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'bldg-r': activeColor}))}} 
                      stroke="#1e293b" 
                      strokeWidth="3.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    <rect x="315" y="240" width="14" height="20" fill={paintedElements['window-r-1'] || '#ffffff'} onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'window-r-1': activeColor}))}} style={{ cursor: 'pointer' }} />
                    <rect x="340" y="240" width="14" height="20" fill={paintedElements['window-r-2'] || '#ffffff'} onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'window-r-2': activeColor}))}} style={{ cursor: 'pointer' }} />

                    {/* Giant superhero shield */}
                    <polygon 
                      points="125,115 275,115 255,225 200,280 145,225" 
                      fill={paintedElements['super-shield'] || '#ef4444'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'super-shield': activeColor}))}} 
                      stroke="#1e293b" 
                      strokeWidth="4.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Lightning Symbol */}
                    <polygon 
                      points="185,130 225,130 205,185 225,185 180,255 195,195 180,195" 
                      fill={paintedElements['super-lightning'] || '#facc15'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'super-lightning': activeColor}))}} 
                      stroke="#1e293b" 
                      strokeWidth="3.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                  </>
                )}

                {/* 5. Sci-Fi Space Voyager */}
                {activeStudioCategory === 'sci-fi' && (
                  <>
                    {/* Stars Sky background */}
                    <rect 
                      width="400" 
                      height="400" 
                      fill={paintedElements['scifi-bg'] || '#0f172a'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'scifi-bg': activeColor}))}} 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Giant ringed planet Saturn */}
                    <circle 
                      cx="95" 
                      cy="105" 
                      r="48" 
                      fill={paintedElements['scifi-planet'] || '#ca8a04'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'scifi-planet': activeColor}))}} 
                      stroke="#e2e8f0" 
                      strokeWidth="3.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                    <ellipse 
                      cx="95" 
                      cy="105" 
                      rx="82" 
                      ry="14" 
                      fill="none" 
                      stroke={paintedElements['scifi-rings'] || '#fed7aa'} 
                      strokeWidth="9" 
                      transform="rotate(-15 95 105)" 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'scifi-rings': activeColor}))}}
                      style={{ cursor: 'pointer', transition: 'stroke 200ms' }}
                    />

                    {/* Fire thruster exhaust blast */}
                    <polygon 
                      points="260,225 355,205 260,185 290,205" 
                      fill={paintedElements['thrust-fire'] || '#f97316'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'thrust-fire': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="2.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Rocket Futurisitc ship cone fuselage */}
                    <path 
                      d="M 115,205 Q 155,170 245,185 L 255,225 Q 155,240 115,205 Z" 
                      fill={paintedElements['ship-fuselage'] || '#cbd5e1'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'ship-fuselage': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="4" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Ship cockpit dome window */}
                    <ellipse 
                      cx="150" 
                      cy="205" 
                      rx="16" 
                      ry="7.5" 
                      fill={paintedElements['cockpit-glass'] || '#38bdf8'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'cockpit-glass': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="2.5" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Wing delta stabilizer left */}
                    <polygon 
                      points="175,185 225,125 235,185" 
                      fill={paintedElements['wing-l'] || '#6366f1'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'wing-l': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="3" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />

                    {/* Wing delta stabilizer right */}
                    <polygon 
                      points="175,225 225,285 235,225" 
                      fill={paintedElements['wing-r'] || '#6366f1'} 
                      onClick={(e) => { e.stopPropagation(); setPaintedElements(p => ({...p, 'wing-r': activeColor}))}} 
                      stroke="#475569" 
                      strokeWidth="3" 
                      style={{ cursor: 'pointer', transition: 'fill 200ms' }}
                    />
                  </>
                )}

                {/* Placed Stamp Stickers Container layer */}
                {stickersList.map((stk) => (
                  <text
                    key={stk.id}
                    x={stk.x}
                    y={stk.y}
                    fontSize="32"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="cursor-pointer select-none filter drop-shadow-sm animate-fade-in hover:scale-125 transition"
                    onClick={(e) => {
                      e.stopPropagation(); // Stop parent click layer
                      // Click again to erase the selected sticker
                      setStickersList(prev => prev.filter(item => item.id !== stk.id));
                    }}
                  >
                    {stk.emoji}
                  </text>
                ))}
              </svg>
            </div>

            {/* Clear-Cut guidelines summary text */}
            <div className="mt-4 max-w-[380px] sm:max-w-[420px] p-3 text-center bg-slate-100 rounded-2xl border border-slate-200 text-slate-500 text-xs">
              💡 <strong>How to play:</strong> Select drawing tabs above. Click any solid palette bar to define active brush color, or choose stamps to decorate! Tap regions on the canvas to fill them. Select <strong>Save Artwork</strong> to download your vector SVG work.
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Navigation Tabs & Simple Filter Widget */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search early learning worksheets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 text-slate-500 text-xs font-mono">
            <Grid className="w-4 h-4 text-slate-400" />
            <span>Showing {filteredAssets.length} of {FREE_RESOURCE_ASSETS.length} available files</span>
          </div>
        </div>

        {/* Standard SEO Category Tabs */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'alphabet', label: 'Alphabet Packs' },
            { id: 'numbers', label: 'Number Grids' },
            { id: 'fruits-veggies', label: 'Fruits & Veggies' },
            { id: 'shapes-vehicles', label: 'Shapes & Vehicles' },
            { id: 'scrapbook', label: 'Scrapbook pages' },
            { id: 'sketch-pages', label: 'Sketch Pages' },
            { id: 'cartoons', label: 'Cute Cartoons' },
            { id: 'comic-characters', label: 'Comic Characters' },
            { id: 'sci-fi', label: 'Sci-Fi Cosmos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === tab.id 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100 scale-102' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Responsive Resource Asset Grid */}
      <section className="space-y-6">
        {filteredAssets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <Smile className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-900 font-bold mb-1">No worksheets matched your search</p>
            <p className="text-slate-400 text-sm">Try typing another category name or select "All Resources"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <motion.div
                key={asset.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
              >
                {/* Visual Canvas Mockup Cover */}
                <div className={`h-48 ${asset.colorScheme.bg} border-b border-dashed ${asset.colorScheme.border} flex items-center justify-center relative p-6 select-none group`}>
                  {asset.mockup}
                  
                  {/* Subtle hovering badge */}
                  <div className="absolute top-2 left-2 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-[11px] font-black text-slate-700 rounded-lg shadow-xs flex items-center gap-1">
                    <Layers className="w-3 h-3 text-indigo-500" />
                    <span>{asset.ageRange}</span>
                  </div>
                </div>

                {/* Card Information Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {asset.category.replace('-', ' & ')}
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {asset.itemsCount} Activities
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {asset.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <FileDown className="w-3.5 h-3.5 text-slate-400" />
                      PDF Format • Ready-to-Print
                    </span>
                    
                    {/* Native Anchor Download Trigger */}
                    <a
                      href={asset.path}
                      download={`Taleem360_Free_Printable_${asset.title.replace(/\s+/g, '_')}.pdf`}
                      onClick={() => triggerDownloadIndicator(asset.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${
                        downloadProgress[asset.id]
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {downloadProgress[asset.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Downloading</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Print Free</span>
                        </>
                      )}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Value Proposition Block */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-start gap-4 shadow-xs">
          <div className="bg-indigo-50 p-3 rounded-xl">
            <Printer className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Standard Scale Prints</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every card layout is mathematically designed to render correctly on both standard A4 and US Letter sizes.
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-start gap-4 shadow-xs">
          <div className="bg-emerald-50 p-3 rounded-xl">
            <Flame className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">High-Contrast Borders</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ultra-bold outlines designed specifically with strong boundaries to make learning tracing and visual logic painless for toddlers.
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-start gap-4 shadow-xs">
          <div className="bg-pink-50 p-3 rounded-xl">
            <Heart className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Universal Access Guarantee</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              No hidden cookies, subscription locks, or user tracking bounds. Print immediately for your classroom, homeschool, or tutoring sessions.
            </p>
          </div>
        </div>
      </section>
        </>
      ) : (
        <CompetitionHub />
      )}
      
    </div>
  );
};

export default FreeResources;
