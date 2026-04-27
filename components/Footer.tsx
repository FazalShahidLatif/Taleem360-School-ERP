import React from 'react';
import { Link } from 'react-router-dom';
import { 
  School as SchoolIcon,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center font-bold text-xl text-indigo-600 mb-4">
              <SchoolIcon className="w-8 h-8 mr-2" />
              Taleem360
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Empowering educational institutions with modern, AI-driven management tools.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/fazalsl/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="https://x.com/FazalShahid66" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="https://www.linkedin.com/in/fazal-shahid-b5981011b/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-500 hover:text-indigo-600 text-sm">About Us</Link></li>
              <li><Link to="/pricing" className="text-gray-500 hover:text-indigo-600 text-sm">Pricing</Link></li>
              <li><Link to="/blog" className="text-gray-500 hover:text-indigo-600 text-sm">Blog</Link></li>
              <li><Link to="/affiliate" className="text-gray-500 hover:text-indigo-600 text-sm">Affiliate Program</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/support" className="text-gray-500 hover:text-indigo-600 text-sm">Support Hub</Link></li>
              <li><Link to="/tickets" className="text-gray-500 hover:text-indigo-600 text-sm">Support Tickets</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-indigo-600 text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-indigo-600 text-sm">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-gray-500 hover:text-indigo-600 text-sm">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-500 text-sm">support@taleem360.online</li>
              <li className="text-gray-500 text-sm">+92 (332) 213 7898</li>
              <li className="text-gray-500 text-sm">Cantt Bazar Faisal, Karachi-75350</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p className="text-center md:text-left">
            &copy; 2026 Taleem360-School ERP. All rights reserved.
          </p>
          <p className="mt-4 md:mt-0">
            Powered by <a href="https://blueoceanhub.info" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-600 font-medium">BlueOceanHub</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
