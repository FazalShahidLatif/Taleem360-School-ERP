import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  HelpCircle, 
  Book, 
  Phone, 
  Mail, 
  Video, 
  FileText,
  ChevronRight,
  LifeBuoy
} from 'lucide-react';

export const Support: React.FC = () => {
  const supportCategories = [
    {
      title: 'Support Tickets',
      description: 'Open a new ticket or track existing ones.',
      icon: MessageSquare,
      link: '/tickets',
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      title: 'Knowledge Base',
      description: 'Browse articles and guides on how to use Taleem360.',
      icon: Book,
      link: '#',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step videos for quick onboarding.',
      icon: Video,
      link: '#',
      color: 'bg-rose-50 text-rose-600'
    },
    {
      title: 'FAQs',
      description: 'Quick answers to common questions.',
      icon: HelpCircle,
      link: '#',
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
          <LifeBuoy className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">How can we help you?</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Our support team is here to help you get the most out of Taleem360. 
          Choose a category below to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supportCategories.map((category, i) => (
          <Link 
            key={i} 
            to={category.link}
            className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-500 hover:shadow-md transition-all flex items-start space-x-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${category.color}`}>
              <category.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{category.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{category.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Direct Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex items-center text-indigo-600 font-bold mb-2">
              <Mail className="w-5 h-5 mr-2" />
              Email Support
            </div>
            <p className="text-sm text-gray-500">Response within 24 hours</p>
            <a href="mailto:support@taleem360.online" className="text-sm font-medium text-gray-900 hover:text-indigo-600">
              support@taleem360.online
            </a>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-emerald-600 font-bold mb-2">
              <Phone className="w-5 h-5 mr-2" />
              Phone Support
            </div>
            <p className="text-sm text-gray-500">Mon-Fri, 9am - 6pm</p>
            <a href="tel:+923322137898" className="text-sm font-medium text-gray-900 hover:text-indigo-600">
              +92 (332) 213 7898
            </a>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-rose-600 font-bold mb-2">
              <FileText className="w-5 h-5 mr-2" />
              Documentation
            </div>
            <p className="text-sm text-gray-500">Read our full documentation</p>
            <Link to="#" className="text-sm font-medium text-gray-900 hover:text-indigo-600">
              View Docs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
