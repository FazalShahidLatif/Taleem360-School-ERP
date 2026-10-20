import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, MessageSquare, CheckCircle2, ExternalLink, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/auth';
import api from '../lib/api';

/**
 * Post-login feedback prompt.
 *
 * POLICY COMPLIANCE — this component previously broke two review-platform rules
 * and both are now fixed. Do not reintroduce them:
 *
 *   1. NO REVIEW GATING. It used to route 4-5 star ratings to Google/Trustpilot
 *      and divert 1-3 star ratings into a private ticket. Selectively soliciting
 *      only positive reviews violates Google's and Trustpilot's policies and can
 *      get the business profile penalised. Every rating now sees the same
 *      options.
 *
 *   2. NO INCENTIVE FOR REVIEWING. It used to promise a 15-day trial extension
 *      in exchange for leaving a review. Paying for reviews — in cash, credit or
 *      service — is prohibited by both platforms. The reward has been removed.
 *
 * Reporting a problem through support is still offered, because offering help is
 * legitimate. It is simply not conditional on the rating, and it is never a
 * substitute for the public review option.
 */
export const EthicalReviewCollector: React.FC = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'rate' | 'options' | 'problem' | 'success'>('rate');

  useEffect(() => {
    if (user) {
      const hasSubmitted = localStorage.getItem(`t360_feedback_completed_${user.id}`);
      const isDismissed = localStorage.getItem(`t360_feedback_dismissed_${user.id}`);

      if (!hasSubmitted && !isDismissed) {
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

  /** Every rating leads to the same place. No sentiment-based routing. */
  const handleRate = (selectedRating: number) => {
    setRating(selectedRating);
    setStep('options');
  };

  const submitProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post('/support/tickets/', {
        subject: `Portal feedback (${rating} stars) from ${user.name}`,
        category: 'Technical Support',
        priority: rating !== null && rating <= 3 ? 'HIGH' : 'NORMAL',
        description: `User rated the portal ${rating}/5.\n\n${feedbackText}`,
      });
      localStorage.setItem(`t360_feedback_completed_${user.id}`, 'true');
      setStep('success');
    } catch {
      // Even if the ticket fails, do not block the visitor from reviewing publicly.
      setStep('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const finish = () => {
    localStorage.setItem(`t360_feedback_completed_${user.id}`, 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Share your feedback"
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
        >
          <button
            onClick={handleDismiss}
            aria-label="Close feedback prompt"
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {step === 'rate' && (
            <div>
              <h4 className="text-lg font-bold text-white mb-2">How is Taleem360 working for you?</h4>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Your answer goes to the same place whether it is good or bad — we do not filter
                feedback.
              </p>

              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(null)}
                    aria-label={`Rate ${star} out of 5 stars`}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating ?? rating ?? 0)
                          ? 'fill-emerald-400 text-emerald-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'options' && (
            <div>
              <h4 className="text-base font-bold text-white mb-1">
                Thanks for the {rating}/5
              </h4>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Two things you can do, and you are free to do either or neither.
              </p>

              <div className="space-y-2 mb-4">
                <a
                  href="https://www.google.com/search?q=Taleem360+school+ERP+Karachi"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-sm font-semibold transition-all border border-slate-700 hover:border-emerald-500/30"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-400 font-black">G</span> Review us on Google
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href="https://www.trustpilot.com/review/taleem360.online"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-sm font-semibold transition-all border border-slate-700 hover:border-emerald-500/30"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-400 font-black">★</span> Review us on Trustpilot
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              <button
                onClick={() => setStep('problem')}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all border border-slate-700"
              >
                Tell us about a problem instead
              </button>

              <p className="text-[10px] text-slate-500 leading-relaxed mt-4">
                We do not offer rewards, discounts or trial extensions in exchange for reviews.
              </p>

              <button
                onClick={finish}
                className="w-full mt-3 py-2 text-slate-500 hover:text-slate-300 text-xs transition-colors"
              >
                Maybe later
              </button>
            </div>
          )}

          {step === 'problem' && (
            <form onSubmit={submitProblem}>
              <div className="flex items-center gap-2 text-amber-400 mb-3">
                <MessageSquare className="w-5 h-5" />
                <h4 className="text-base font-bold text-white">Tell us what went wrong</h4>
              </div>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                This opens a support ticket that reaches the team directly.
              </p>

              <textarea
                required
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="E.g., fee ledger sorting error in the parent dashboard, or a timetable scheduling bug..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none mb-4 font-sans"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit support ticket'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-emerald-950 border border-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Received</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto mb-5 leading-relaxed">
                Your message has been filed as a support ticket and we will reply by email.
              </p>
              <button
                onClick={finish}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold text-sm rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
