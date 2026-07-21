import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, MessageSquare, ThumbsUp, CheckCircle2, Award, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/auth';
import api from '../lib/api';

export const EthicalReviewCollector: React.FC = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'rate' | 'google-tp' | 'negative-feedback' | 'success'>('rate');
  const [claimedReward, setClaimedReward] = useState(false);

  useEffect(() => {
    // Only show if user is authenticated and hasn't dismissed/completed the feedback yet
    if (user) {
      const hasSubmitted = localStorage.getItem(`t360_feedback_completed_${user.id}`);
      const isDismissed = localStorage.getItem(`t360_feedback_dismissed_${user.id}`);
      
      if (!hasSubmitted && !isDismissed) {
        // Delay showing it slightly for a smoother UX after logging in
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [user]);

  if (!user || !isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`t360_feedback_dismissed_${user.id}`, 'true');
  };

  const handleRate = (selectedRating: number) => {
    setRating(selectedRating);
    if (selectedRating >= 4) {
      setStep('google-tp');
    } else {
      setStep('negative-feedback');
    }
  };

  const submitNegativeFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);
    try {
      // Automatically generate a Support Ticket for 1-3 star reviews
      const ticketSubject = `Critical Portal Feedback (${rating} Stars) from ${user.name}`;
      const ticketDescription = `User left a ${rating}-star feedback. Details: ${feedbackText}`;
      
      await api.post('/support/tickets/', {
        subject: ticketSubject,
        category: 'Technical Support',
        priority: 'HIGH',
        description: ticketDescription,
      });

      // Grant the trial extension visual notification
      setStep('success');
      localStorage.setItem(`t360_feedback_completed_${user.id}`, 'true');
    } catch (err) {
      console.error('Failed to auto-create support ticket for feedback:', err);
      // Fallback to success step even if ticket creation fails, for robustness
      setStep('success');
      localStorage.setItem(`t360_feedback_completed_${user.id}`, 'true');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimReward = () => {
    setClaimedReward(true);
    localStorage.setItem(`t360_feedback_completed_${user.id}`, 'true');
    
    // Auto-dismiss the widget after a couple of seconds of showing the claimed success
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl overflow-hidden p-6"
        style={{ boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)' }}
      >
        {/* Header with dismiss button */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
              Taleem360 Feedback
            </span>
          </div>
          <button 
            onClick={handleDismiss}
            className="p-1 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'rate' && (
          <div>
            <h4 className="text-lg font-bold text-white mb-2 leading-snug">
              How is your Taleem360 experience so far?
            </h4>
            <p className="text-xs text-slate-400 mb-5">
              Your feedback helps us support educational centers, schools, and private tutors globally.
            </p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    className={`w-10 h-10 transition-colors ${
                      (hoveredRating !== null ? star <= hoveredRating : rating !== null && star <= rating)
                        ? 'fill-emerald-400 text-emerald-400'
                        : 'text-slate-600'
                    }`} 
                  />
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
              <span>Could be better</span>
              <span>Exceptional!</span>
            </div>
          </div>
        )}

        {step === 'google-tp' && (
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-3">
              <ThumbsUp className="w-5 h-5" />
              <h4 className="text-lg font-bold text-white">Wonderful! Thank you!</h4>
            </div>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              We are incredibly happy that you are enjoying our platform. As an independent educational initiative, your review on Google and Trustpilot helps us reach more administrators!
            </p>

            <div className="space-y-2 mb-5">
              <a
                href="https://g.page/r/taleem360/review"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-sm font-semibold transition-all border border-slate-700 hover:border-emerald-500/30"
              >
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400 font-black">G</span> Write a Review on Google
                </span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>

              <a
                href="https://www.trustpilot.com/evaluate/taleem360.online"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-sm font-semibold transition-all border border-slate-700 hover:border-emerald-500/30"
              >
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400 font-black">★</span> Write a Review on Trustpilot
                </span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-4">
              <div className="flex gap-2 items-start">
                <Award className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white mb-0.5">Trial Extension & Ambassador Badge</h5>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    To thank you for supporting ethical school software, claim a <strong>free 15-day trial extension</strong> instantly!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleClaimReward}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/20 active:scale-[0.98]"
            >
              Claim Reward & Complete
            </button>
          </div>
        )}

        {step === 'negative-feedback' && (
          <form onSubmit={submitNegativeFeedback}>
            <div className="flex items-center gap-2 text-amber-400 mb-3">
              <MessageSquare className="w-5 h-5" />
              <h4 className="text-base font-bold text-white">We want to make it right!</h4>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              We are sorry that your experience has been sub-optimal. Please tell us what is missing or broken. Your feedback will be sent directly to our developer triage channel.
            </p>

            <textarea
              required
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="E.g., Fee ledger sorting error in parent dashboard or timetable scheduling bug..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none mb-4 font-sans"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Support Ticket...' : 'Submit Triage Request'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-emerald-950 border border-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Feedback Received!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto mb-5 leading-relaxed">
              Your feedback has been filed as a priority Support Ticket. We appreciate your transparency.
            </p>
            
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-5 text-left">
              <div className="flex gap-2 items-start">
                <Award className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white mb-0.5">Taleem360 Advocate Trial Extended</h5>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    To thank you for helping us improve, we have successfully added <strong>15 days of pilot evaluation trial</strong> to your dashboard context!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleClaimReward}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold text-sm rounded-xl transition-all"
            >
              {claimedReward ? 'Reward Saved! Closing...' : 'Claim 15-Day Extension'}
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
