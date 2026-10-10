import React from 'react';
import { Link } from 'react-router-dom';

export const CTA: React.FC = () => (
  <div className="fixed bottom-0 inset-x-0 bg-indigo-600 text-white py-3 px-4 flex items-center justify-between shadow-lg z-50">
    <span className="text-sm font-medium">Free 30‑day Pilot – Start now</span>
    <Link
      to="/pricing"
      className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-1 px-3 rounded"
    >
      Get Started
    </Link>
  </div>
);
