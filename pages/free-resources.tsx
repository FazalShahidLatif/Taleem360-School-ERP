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
  FileDown
} from 'lucide-react';

export interface FreeResourceAsset {
  id: string;
  title: string;
  category: 'alphabet' | 'numbers' | 'fruits-veggies' | 'shapes' | 'vehicles';
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
    id: 'pack-aa-mega',
    title: 'Letter "Aa" Mega Bundle: 20 Creative Themes',
    category: 'alphabet',
    itemsCount: 20,
    path: '/resources/packs/alphabet-aa-mega-pack.pdf',
    ageRange: 'Ages 2-6',
    colorScheme: {
      bg: 'bg-gradient-to-br from-indigo-50 to-pink-50',
      accent: 'bg-indigo-600',
      border: 'border-indigo-100',
      text: 'text-indigo-800'
    },
    mockup: (
      <div className="flex flex-col items-center justify-center h-full w-full relative p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-6xl font-black tracking-tight text-slate-800 drop-shadow-xs">A a</span>
          <div className="grid grid-cols-4 gap-0.5 bg-slate-900/5 p-1 rounded-lg border border-slate-900/10 max-w-[90px]">
            {['🍎', '🐜', '✈️', '👨‍🚀', '🐊', '🌸', '🦖', '🏰'].map((emoji, idx) => (
              <span key={idx} className="text-[10px] filter drop-shadow-xs">{emoji}</span>
            ))}
          </div>
        </div>
        <div className="text-[10px] text-center font-bold text-indigo-900 uppercase tracking-wider bg-indigo-50/80 px-2.5 py-0.5 rounded border border-indigo-100">
          20 Page Theme Worksheets
        </div>
        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[10px] font-mono text-slate-400">
          <span>Apple • Ant • Cosmic • Dino</span>
          <span>Mega Pack</span>
        </div>
      </div>
    )
  },
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
  }
];

const AA_THEMES = [
  { name: 'Apple', icon: '🍎', label: 'Apple theme', color: 'bg-rose-50 text-rose-600 border-rose-100', text: 'Sweet red orchard apple with a single little leaf.' },
  { name: 'Ant', icon: '🐜', label: 'Ant theme', color: 'bg-amber-50 text-amber-700 border-amber-100', text: 'A busy little six-legged worker ant walking along.' },
  { name: 'Airplane', icon: '✈️', label: 'Airplane theme', color: 'bg-sky-50 text-sky-600 border-sky-100', text: 'Vapor trail lines trailing a wide-body jumbo jet liner.' },
  { name: 'Astronaut', icon: '👨‍🚀', label: 'Astronaut theme', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', text: 'A zero-gravity space explorer floating past celestial stars.' },
  { name: 'Alligator', icon: '🐊', label: 'Alligator theme', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', text: 'Friendly smiling alligator lounging near river marshes.' },
  { name: 'Bubble Letter', icon: '🫧', label: 'Bubble Letter', color: 'bg-cyan-50 text-cyan-600 border-cyan-100', text: 'Thick rounded margins ideal for messy watercolor play.' },
  { name: 'Tracing', icon: '🖋️', label: 'Tracing Guides', color: 'bg-slate-50 text-slate-700 border-slate-200', text: 'Sequence directional arrows showing accurate visual strokes.' },
  { name: 'Floral', icon: '🌸', label: 'Floral Border', color: 'bg-pink-50 text-pink-600 border-pink-100', text: 'Precious blooming petals creating a soft organic outline.' },
  { name: 'Kawaii', icon: '🎀', label: 'Kawaii Cute', color: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100', text: 'Darling pastel designs featuring soft blinking cartoon eyes.' },
  { name: 'Mandala', icon: '🌀', label: 'Mandala Focus', color: 'bg-teal-50 text-teal-700 border-teal-100', text: 'Concentration promoting concentric geometrical mandalas.' },
  { name: 'Cartoon Animal', icon: '🐱', label: 'Cartoon Pet', color: 'bg-orange-50 text-orange-600 border-orange-100', text: 'Adorable kitten whiskers making foundational practice friendly.' },
  { name: 'Farm', icon: '👩‍🌾', label: 'Farm Life', color: 'bg-amber-50 text-amber-850 border-amber-200', text: 'Barn outlines, country pitches, and standard silo tracks.' },
  { name: 'Jungle', icon: '🦁', label: 'Jungle Safari', color: 'bg-green-50 text-green-700 border-green-150', text: 'Thick tropical palms accompanied by friendly safari kittens.' },
  { name: 'Ocean', icon: '🐋', label: 'Ocean Depths', color: 'bg-blue-50 text-blue-600 border-blue-150', text: 'Majestic deep sea leviathans gliding near bubbly sea grass.' },
  { name: 'Space', icon: '🪐', label: 'Cosmic Orbit', color: 'bg-violet-50 text-violet-600 border-violet-150', text: 'Interstellar planetary rings and constellations to paint.' },
  { name: 'Dinosaur', icon: '🦖', label: 'Dino Kingdom', color: 'bg-lime-50 text-lime-700 border-lime-150', text: 'Gentle long-necked sauropods leaving little footprints.' },
  { name: 'Castle', icon: '🏰', label: 'Medieval Castle', color: 'bg-stone-100 text-stone-600 border-stone-200', text: 'Flags flying high over fortress ramparts and brick outlines.' },
  { name: 'Preschool', icon: '🏫', label: 'Preschool Grade', color: 'bg-red-50 text-red-650 border-red-150', text: 'Classroom desk layout outlines for absolute beginners.' },
  { name: 'Patterns', icon: '📐', label: 'Pattern Matrix', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', text: 'Abstract crossing lines that refine motor skill precision.' },
  { name: 'Block Letter', icon: '🧱', label: 'Block Font', color: 'bg-zinc-100 text-zinc-700 border-zinc-200', text: 'Isometric brick letters offering 3D spatial alignment coloring.' }
];

const THEME_ASSETS = [
  { id: 'apple', name: 'Apple', icon: '🍎', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'ant', name: 'Ant', icon: '🐜', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'airplane', name: 'Airplane', icon: '✈️', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'astronaut', name: 'Astronaut', icon: '👨‍🚀', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'alligator', name: 'Alligator', icon: '🐊', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'bubble-letter', name: 'Bubble Letter', icon: '🫧', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'tracing', name: 'Tracing', icon: '🖋️', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'floral', name: 'Floral', icon: '🌸', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'kawaii', name: 'Kawaii', icon: '🎀', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'mandala', name: 'Mandala', icon: '🌀', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'cartoon-animal', name: 'Cartoon Animal', icon: '🐱', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'farm', name: 'Farm', icon: '👩‍🌾', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'jungle', name: 'Jungle', icon: '🦁', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'ocean', name: 'Ocean', icon: '🐋', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'space', name: 'Space', icon: '🪐', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'dinosaur', name: 'Dinosaur', icon: '🦖', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'castle', name: 'Castle', icon: '🏰', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'preschool', name: 'Preschool', icon: '🏫', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'patterns', name: 'Patterns', icon: '📐', path: '/resources/packs/alphabet-v1.pdf' },
  { id: 'block-letter', name: 'Block Letter', icon: '🧱', path: '/resources/packs/alphabet-v1.pdf' }
];

export const FreeResources: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadProgress, setDownloadProgress] = useState<Record<string, boolean>>({});
  
  // Interactive Sandbox state for live customized Aa worksheets
  const [activeAaTheme, setActiveAaTheme] = useState<string>('Apple');
  const [studentName, setStudentName] = useState<string>('');
  const [customDate, setCustomDate] = useState<string>('');
  const [isSpooling, setIsSpooling] = useState<boolean>(false);

  useEffect(() => {
    // Standard non-blocking SEO setup
    document.title = 'Free Printable Coloring Pages & Tracing PDFs | Taleem360';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Access free printable alphabet, number, fruit, and vegetable coloring page packs. High-quality sequence worksheets designed for early learning development.');

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
    if (selectedCategory === 'alphabet') return asset.category === 'alphabet' && matchesSearch;
    if (selectedCategory === 'numbers') return asset.category === 'numbers' && matchesSearch;
    if (selectedCategory === 'fruits-veggies') return asset.category === 'fruits-veggies' && matchesSearch;
    if (selectedCategory === 'shapes-vehicles') {
      return (asset.category === 'shapes' || asset.category === 'vehicles') && matchesSearch;
    }
    return matchesSearch;
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
        <div className="absolute inset-y-0 right-0 hidden lg:flex items-center justify-center w-1/2 pr-12 z-0 opacity-15">
          <Palette className="w-80 h-80 text-white stroke-[1]" />
        </div>
      </section>

      {/* Dynamic Print Styles specifically to support full-page high-fidelity physical printable outputs */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background: none !important;
          }
          #printable-sheet-element, #printable-sheet-element * {
            visibility: visible;
          }
          #printable-sheet-element {
            position: absolute;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 100% !important;
            max-width: 650px !important;
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 2rem !important;
            background-color: white !important;
          }
        }
      `}</style>

      {/* Featured Interactive Release: The Alphabet 'Aa' 20-Scheme Universal Sandbox */}
      <section className="bg-gradient-to-br from-indigo-50/50 via-slate-50 to-pink-50/30 rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-xs space-y-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-black uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-650" />
            Interactive Sandbox Release
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Letter "Aa" Creative Worksheet Generator
          </h2>
          <p className="text-slate-500 text-sm mt-1 leading-relaxed">
            Parents and tutors can interactively preview, customize, and print all 20 unique high-contrast themes of our exclusive Alphabet "Aa" Colouring series. Enter custom dates or trace texts below to generate instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Left panel: Grid of 20 themes (occupies 7 columns on xl) */}
          <div className="xl:col-span-7 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 mb-3 flex items-center gap-1">
                <span>Select One of 20 Creative Themes</span>
                <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md font-mono font-black">20 in 1</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {AA_THEMES.map((theme) => {
                  const isActive = activeAaTheme === theme.name;
                  return (
                    <button
                      key={theme.name}
                      onClick={() => {
                        setActiveAaTheme(theme.name);
                      }}
                      aria-label={theme.label}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        isActive
                          ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/10 shadow-sm scale-102'
                          : 'bg-white/60 hover:bg-white hover:border-slate-300 border-slate-100/80 text-slate-700 shadow-3xs'
                      }`}
                    >
                      <span className="text-3xl mb-1 filter drop-shadow-sm">{theme.icon}</span>
                      <span className="text-[11px] font-black tracking-tight leading-none text-slate-850">
                        {theme.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Theme highlight description */}
              <div className="mt-4 p-4 bg-white/80 rounded-xl border border-slate-100 flex items-start gap-3">
                <span className="text-3xl">💡</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-0.5">
                    Active Theme: {activeAaTheme} Guide 
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {AA_THEMES.find(t => t.name === activeAaTheme)?.text} Formatted in ultra-crisp bold lines for easy childhood coloring.
                  </p>
                </div>
              </div>
            </div>

            {/* Customization Inputs */}
            <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs">
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-950">
                Personalize & Trace Engine
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Student Name (Simulates Dotted Guides)
                  </label>
                  <input
                    type="text"
                    maxLength={14}
                    placeholder="e.g. AMELIA"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Custom Sheet Date
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="e.g. JUN 18, 2026"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-50">
                <span className="text-[11px] text-slate-400 inline-flex items-center gap-1 font-medium">
                  <Printer className="w-3.5 h-3.5" />
                  Print configuration scales to fit common US-Letter/A4 formats.
                </span>
                
                <button
                  onClick={() => {
                    setIsSpooling(true);
                    setTimeout(() => {
                      setIsSpooling(false);
                      window.print();
                    }, 800);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl text-xs font-black self-end inline-flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  {isSpooling ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                      <span>Preparing Spool...</span>
                    </>
                  ) : (
                    <>
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Custom Sheet</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = THEME_ASSETS.find(t => t.name.toLowerCase() === activeAaTheme.toLowerCase())?.path || '/resources/packs/alphabet-v1.pdf';
                    link.download = `Taleem360_Alphabet_${activeAaTheme}_Theme_Worksheet.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-black self-end inline-flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Asset</span>
                </button>
              </div>
            </div>

            {/* Hybrid SaaS Strategy Offer Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-850">
              <div className="space-y-1 max-w-lg z-10">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/25 border border-emerald-400/20 text-emerald-300 text-[9px] font-black uppercase">
                  Hybrid Enterprise SaaS Feature
                </div>
                <h4 className="text-sm font-bold tracking-tight">Need custom worksheets for your school?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Taleem360's SaaS plan gives you a full AI Worksheet Architect. Generate custom templates, watermark tracing books with your academy brand, and automatically log assignments for students.
                </p>
              </div>
              <a
                href="/#pricing"
                className="px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 hover:scale-102 font-black text-xs rounded-xl self-start sm:self-center transition-all shadow-md mt-1 shrink-0 whitespace-nowrap z-10"
              >
                Access ERP Core
              </a>
              <div className="absolute top-1/2 right-10 -translate-y-1/2 text-8xl opacity-5 pointer-events-none z-0">🍎</div>
            </div>
          </div>

          {/* Right panel: Static high-fidelity worksheet mockup (occupies 5 columns on xl) */}
          <div className="xl:col-span-5 flex flex-col items-center justify-center">
            <h4 className="text-[11px] font-bold text-slate-450 uppercase tracking-widest mb-3">
              Live Printing Preview (Scrollable)
            </h4>
            
            {/* The Worksheet Canvas */}
            <div 
              id="printable-sheet-element"
              className="w-full max-w-[340px] aspect-[1/1.414] bg-white border border-slate-200 rounded-xl shadow-md flex flex-col justify-between p-6 sm:p-7 relative select-none text-slate-900"
            >
              <div className="space-y-4">
                {/* Top header values */}
                <div className="flex justify-between items-start text-xs font-bold text-slate-900">
                  <div className="space-y-1 border-b border-dashed border-slate-350 pb-1 pr-6 flex items-center">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 mr-1.5 select-none">Date:</span>
                    <span className="font-mono font-bold tracking-wide select-text">
                      {customDate || '_______________________'}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-black block tracking-tighter leading-none select-none">Aa</span>
                  </div>
                </div>

                {/* Subtitle / Theme descriptor and page heading */}
                <div className="pt-2 border-t border-slate-100">
                  <h3 className="text-sm font-black text-slate-905 tracking-wide uppercase select-none">
                    {activeAaTheme} Colouring Page
                  </h3>
                </div>

                {/* Huge letters tracing mock */}
                <div className="py-2 flex flex-col items-center justify-center relative">
                  <span className="text-8xl font-black font-serif tracking-tight select-none uppercase drop-shadow-3xs text-center leading-none select-all relative">
                    A a
                    {/* Inner dash tracing lines overlays for higher fidelity */}
                    <span className="absolute inset-0 flex items-center justify-center font-serif text-[115px] text-white opacity-25 font-bold pointer-events-none select-none">
                      A a
                    </span>
                  </span>
                </div>

                {/* Geometric Interactive shapes / overlapping structures matching the exact uploaded PDF layouts */}
                <div className="mt-2 py-4 flex items-center justify-center relative min-h-[90px] border-y border-dashed border-slate-150 rounded-lg bg-slate-50/20 group">
                  
                  {/* Overlapping geometries replicating the provided screenshots (Circle, Square, Intersecting Oval) */}
                  <div className="flex items-center justify-center gap-3 relative w-full h-[65px] select-none">
                    {/* Circle */}
                    <div className="w-[38px] h-[38px] rounded-full border-1.5 border-slate-800 flex items-center justify-center" />
                    
                    {/* Square overlapping with Oval */}
                    <div className="relative flex items-center">
                      <div className="w-[45px] h-[45px] border-1.5 border-slate-800 bg-white" />
                      <div className="w-[72px] h-[42px] rounded-full border-1.5 border-slate-800 bg-white/20 -ml-5 shadow-3xs" />
                    </div>
                  </div>

                  {/* Centered Large Theme Icon Backdrop */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 filter blur-[0.5px]">
                    <span className="text-6xl">{AA_THEMES.find(t => t.name === activeAaTheme)?.icon}</span>
                  </div>
                </div>

                {/* Customized Tracing Guides: Dotted User Name Option */}
                {studentName && (
                  <div className="py-2.5 px-3 bg-indigo-50/30 rounded-lg border border-dashed border-indigo-100 text-center select-text relative">
                    <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-bold block mb-1">Custom Tracer Name:</span>
                    <span className="text-lg font-mono font-black text-indigo-950 tracking-widest leading-none">
                      {studentName.split('').join(' • ')}
                    </span>
                    <div className="absolute top-1 right-2 text-[8px] uppercase tracking-widest text-indigo-550 font-black">Ready</div>
                  </div>
                )}
              </div>

              {/* PDF Footer Footnotes exact replica */}
              <div className="pt-3 border-t border-slate-200 mt-2 flex flex-col justify-end text-[9px] font-mono font-medium text-slate-450 space-y-0.5">
                <div className="flex justify-between">
                  <span>Taleem360 - Alphabet "Aa" Colouring Pages</span>
                  <span className="font-bold">Vol. 1 • Pack 0</span>
                </div>
                <div className="flex justify-between text-indigo-650/80">
                  <span>https://www.taleem360.online/free-resources</span>
                  <span className="underline font-bold">Free Printable License</span>
                </div>
              </div>
            </div>

            {/* Print Active Worksheet Now Button Group with direct download */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full justify-center">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>🖨️ Print Active Worksheet Now</span>
              </button>

              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = THEME_ASSETS.find(t => t.name.toLowerCase() === activeAaTheme.toLowerCase())?.path || '/resources/packs/alphabet-v1.pdf';
                  link.download = `Taleem360_Alphabet_${activeAaTheme}_Theme_Worksheet.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-lg shadow-md transition-all text-sm flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Asset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Direct Theme Downloads Matrix with Hybrid Branding */}
        <div className="pt-8 border-t border-indigo-150/60">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Download className="w-4 h-4 text-indigo-600 animate-bounce" />
            <span>Direct PDF Downloads : High-Contrast Series</span>
          </h3>
          <p className="text-slate-500 text-xs mb-6 max-w-2xl leading-relaxed">
            Instantly download high-resolution individual PDF worksheet templates featuring premium academic branding of Taleem360. Every downloaded file is configured for standard US-Letter structure with clear high-contrast lines.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {THEME_ASSETS.map((theme) => (
              <a 
                key={theme.id}
                href={theme.path}
                download={`Taleem360-Alphabet-${theme.name}.pdf`}
                className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200/80 rounded-xl hover:shadow-lg hover:border-indigo-500 transition cursor-pointer group hover:scale-102"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition duration-200">
                  {theme.icon}
                </div>
                <span className="text-xs font-semibold text-slate-700">{theme.name}</span>
                
                {/* Subtle, smart fallback helper for older user mobile view engines */}
                <span className="text-[10px] text-indigo-500 mt-1 opacity-0 group-hover:opacity-100 transition duration-150">
                  Download PDF ↓
                </span>
              </a>
            ))}
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
            { id: 'shapes-vehicles', label: 'Shapes & Vehicles' }
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
      
    </div>
  );
};

export default FreeResources;
