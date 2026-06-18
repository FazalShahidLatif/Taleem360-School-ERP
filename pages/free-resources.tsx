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

export const FreeResources: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadProgress, setDownloadProgress] = useState<Record<string, boolean>>({});

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
