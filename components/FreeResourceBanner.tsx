import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';

export default function FreeResourceBanner() {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide helper if user has closed the banner in this session before
  useEffect(() => {
    const isBannerDismissed = sessionStorage.getItem('t360_banner_dismissed');
    if (isBannerDismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const dismissBanner = () => {
    sessionStorage.setItem('t360_banner_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 py-2 text-center text-sm font-medium shadow-sm transition-all duration-300 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 pr-8">
        <span className="inline-flex items-center gap-1.5 font-bold">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
          </span>
          🎨 New Early Learning Library Added!
        </span>
        <p className="text-indigo-100 font-normal text-xs sm:text-sm">
          Download 10 custom sequences of high-contrast printable alphabet, numbering, and coloring packs.
        </p>
        <Link 
          to="/free-resources" 
          className="underline hover:text-white font-semibold whitespace-nowrap transition text-xs sm:text-sm inline-flex items-center gap-1"
        >
          Explore Free Resources &rarr;
        </Link>
      </div>
      
      {/* Absolute positioned close action button */}
      <button
        onClick={dismissBanner}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-indigo-200 hover:text-white rounded-md focus:outline-none transition"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
