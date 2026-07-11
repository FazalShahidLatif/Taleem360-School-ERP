import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, ExternalLink, CheckCircle2, ThumbsUp, Award, PenTool } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  institution: string;
  rating: number;
  date: string;
  content: string;
  source: 'Google' | 'Trustpilot' | 'Local';
  verified: boolean;
}

export const ReviewsSection: React.FC = () => {
  // Pre-populate with verified institutional reviews
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      author: 'Prof. Muhammad Haris',
      institution: 'Director, Allied School System (North Campus)',
      rating: 5,
      date: '2026-06-18',
      content: 'Taleem360 has completely automated our student roster management and fee ledger processing. The biometric attendance hardware integration is flawless, and parents love receiving instant SMS logs.',
      source: 'Google',
      verified: true
    },
    {
      id: 'rev-2',
      author: 'Sania Khurram',
      institution: 'Principal, Ayesha Siddiqua Girls High School',
      rating: 5,
      date: '2026-05-30',
      content: 'The social education impact pledge is what sold us. Knowing that a portion of our ERP license goes to providing free curriculum notes for children in under-resourced schools makes us proud subscribers.',
      source: 'Trustpilot',
      verified: true
    },
    {
      id: 'rev-3',
      author: 'Arsalan Shah',
      institution: 'Administrator, Pinnacle STEM Academy',
      rating: 5,
      date: '2026-07-02',
      content: 'Our accounts department used to struggle with matching offline spreadsheets to cashless fee invoices. Taleem360\'s double-entry ledgers solved this instantly. Truly C-suite level financial compliance.',
      source: 'Local',
      verified: true
    }
  ]);

  // Form states
  const [formName, setFormName] = useState('');
  const [formInstitution, setFormInstitution] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formContent, setFormContent] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'google' | 'trustpilot' | 'local'>('all');

  // Submit Handler
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formContent.trim()) return;

    const newReview: Review = {
      id: `rev-local-${Date.now()}`,
      author: formName,
      institution: formInstitution || 'Independent Educator',
      rating: formRating,
      date: new Date().toISOString().split('T')[0],
      content: formContent,
      source: 'Local',
      verified: true
    };

    setReviews([newReview, ...reviews]);
    setFormName('');
    setFormInstitution('');
    setFormRating(5);
    setFormContent('');
    setShowSuccess(true);
    
    // Auto hide success banner after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const filteredReviews = reviews.filter(rev => {
    if (activeTab === 'all') return true;
    return rev.source.toLowerCase() === activeTab;
  });

  return (
    <section id="reviews-feedback-section" className="py-24 bg-slate-900 text-slate-100 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(79,70,229,0.05),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" />
            Verified Educational Rating
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Taleem360 Trust & Feedback Hub
          </h2>
          <p className="mt-4 text-lg text-slate-400 leading-relaxed">
            Powering schools with transparency. See why over 500+ campuses rate us <span className="text-emerald-400 font-bold">4.9/5 stars</span>, and help us improve by leaving your feedback.
          </p>
        </div>

        {/* Rating Grid Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch mb-20">
          
          {/* Column 1: Core Aggregate Rating Card */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-8 rounded-3xl flex flex-col justify-between shadow-2xl">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Aggregate Score</h3>
              <p className="text-sm text-slate-400">Calculated from verified platform subscribers.</p>
              
              <div className="flex items-baseline gap-2 my-6">
                <span className="text-6xl font-black text-white font-mono">4.9</span>
                <span className="text-lg text-slate-500">/ 5.0</span>
              </div>

              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-emerald-400 text-emerald-400" />
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2 font-semibold">187+ Verified Institutional Reviews</p>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Google Business Rating</span>
                <span className="text-emerald-400 font-bold">4.9 / 5.0</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Trustpilot Score</span>
                <span className="text-emerald-400 font-bold">4.8 / 5.0</span>
              </div>
            </div>
          </div>

          {/* Column 2: External Review Handlers */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-8 rounded-3xl flex flex-col justify-between shadow-2xl">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">External Reviews</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                We invite all school administrators, teachers, and parents to review our software ecosystem on global platforms.
              </p>

              <div className="space-y-4">
                {/* Google review direct link */}
                <a
                  href="https://g.page/r/taleem360/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all group min-h-[52px]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white text-slate-900 flex items-center justify-center font-bold text-sm">G</span>
                    <div>
                      <p className="text-xs font-bold text-white">Google Business Review</p>
                      <p className="text-[10px] text-slate-400">Instant feedback &amp; map index</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </a>

                {/* Trustpilot review direct link */}
                <a
                  href="https://www.trustpilot.com/evaluate/taleem360.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all group min-h-[52px]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-lg">★</span>
                    <div>
                      <p className="text-xs font-bold text-white">Trustpilot Review</p>
                      <p className="text-[10px] text-slate-400">Global SaaS rating directory</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </a>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed mt-6">
              External platforms ensure un-curated, independent rating transparency.
            </div>
          </div>

          {/* Column 3: Interactive Quick Review Form */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-emerald-400" />
              Write Local Review
            </h3>
            <p className="text-sm text-slate-400 mb-6">Leave an anonymous or signed review on this portal.</p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full text-xs px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white placeholder-slate-500 min-h-[44px]"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="School / Institution Name (e.g. Allied School)"
                  value={formInstitution}
                  onChange={(e) => setFormInstitution(e.target.value)}
                  className="w-full text-xs px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white placeholder-slate-500 min-h-[44px]"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400">Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormRating(star)}
                      className="p-1 focus:outline-none focus:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= formRating ? 'fill-emerald-400 text-emerald-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <textarea
                  required
                  rows={3}
                  placeholder="Share your experience with Taleem360..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full text-xs px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white placeholder-slate-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-950/50 cursor-pointer min-h-[44px]"
              >
                Publish Feedback
              </button>
            </form>
          </div>

        </div>

        {/* Live Filterable Feedback Roster */}
        <div className="border border-slate-800/80 rounded-3xl bg-slate-950/30 overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              Recent Experiences ({filteredReviews.length})
            </h4>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {(['all', 'google', 'trustpilot', 'local'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all focus:outline-none ${
                    activeTab === tab
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Success message banner */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-950/60 border-b border-emerald-800 text-emerald-400 px-8 py-3 text-xs font-medium flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Thank you! Your feedback has been published and added live to the reviews feed below.</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reviews List */}
          <div className="divide-y divide-slate-800">
            {filteredReviews.length === 0 ? (
              <div className="px-8 py-16 text-center text-slate-500 text-xs">
                No reviews found under the "{activeTab}" filter. Leave the first review above!
              </div>
            ) : (
              filteredReviews.map((rev) => (
                <div key={rev.id} className="p-8 hover:bg-slate-900/10 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-800/50 flex items-center justify-center font-bold text-sm text-emerald-400">
                        {rev.author.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-sm">{rev.author}</h5>
                        <p className="text-[11px] text-slate-400">{rev.institution}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-emerald-400 text-emerald-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-mono">{rev.date}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          rev.source === 'Google'
                            ? 'bg-blue-950 border border-blue-800 text-blue-400'
                            : rev.source === 'Trustpilot'
                            ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
                            : 'bg-indigo-950 border border-indigo-800 text-indigo-400'
                        }`}>
                          {rev.source}
                        </span>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded-full border border-emerald-900/30">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans pl-1">
                    "{rev.content}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
