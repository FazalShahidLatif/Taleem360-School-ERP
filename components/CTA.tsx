import React from 'react';
import { Link } from 'react-router-dom';

export const CTA: React.FC = () => (
  <div id="cta-placeholder" className="fixed bottom-0 inset-x-0 bg-indigo-600 text-white py-3 px-4 flex items-center justify-between shadow-lg z-50 min-h-[60px]">
    <span className="text-sm font-medium">Free 30‑day Pilot – Start now</span>
    <Link
      to="/pricing"
      className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-1 px-3 rounded"
      onClick={() => {
        if (window.gtag) {
          window.gtag('event', 'cta_click', {
            event_category: 'CTA',
            event_label: 'FreePilot'
          });
        }
      }}
    >
      Get Started
    </Link>
  </div>
);
