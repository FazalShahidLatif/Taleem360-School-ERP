import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap,
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
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-600 p-2 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">Taleem360</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Empowering educational institutions with modern, AI-driven management tools.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/fazalsl/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-indigo-600 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="https://x.com/FazalShahid66" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-indigo-600 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="https://www.linkedin.com/in/fazal-shahid-b5981011b/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-indigo-600 transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-500 hover:text-indigo-600 text-sm">About Us</Link></li>
              <li><Link to="/pricing" className="text-gray-500 hover:text-indigo-600 text-sm">Pricing</Link></li>
              <li><Link to="/free-resources" className="text-gray-500 hover:text-indigo-600 text-sm">Free Resources</Link></li>
              <li><Link to="/blog" className="text-gray-500 hover:text-indigo-600 text-sm">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-indigo-600 text-sm">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/support" className="text-gray-500 hover:text-indigo-600 text-sm">Support Hub</Link></li>
              <li><Link to="/faq" className="text-gray-500 hover:text-indigo-600 text-sm">FAQs</Link></li>
              <li><Link to="/tickets" className="text-gray-500 hover:text-indigo-600 text-sm">Support Tickets</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-indigo-600 text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-indigo-600 text-sm">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="text-gray-500 hover:text-indigo-600 text-sm">Refund &amp; Cancellation</Link></li>
              <li><Link to="/cookies" className="text-gray-500 hover:text-indigo-600 text-sm">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-500 text-sm font-medium">Taleem360</li>
              <li className="text-gray-500 text-xs">26/792 Cantt Bazar, Drigh Road, Karaci -75350</li>
              <li className="text-gray-500 text-sm">support@taleem360.online</li>
              <li className="text-gray-500 text-sm">+92 (332) 213 7898</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100 text-[11px] text-gray-400">
          <p className="leading-relaxed">
            * Our order checkout process and subscription renewals are managed securely by our official online Merchant of Record, <strong>Paddle.com</strong>. Paddle is responsible for handling payment operations, managing tax compliance, and resolving customer billing requests on behalf of Taleem360.
          </p>
        </div>
        <div className="pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p className="text-center md:text-left">
            &copy; 2026 Taleem360-School ERP. Open, collaborative, and built with transparency as a core guiding principal. No proprietary registered trademark claims.
          </p>
          <p className="mt-4 md:mt-0">
            Powered by <a href="https://saasskul.com" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-600 font-medium">SaaSSkul</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
