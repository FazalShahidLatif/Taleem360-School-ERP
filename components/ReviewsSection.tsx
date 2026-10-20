import React, { useState } from 'react';
import { Star, ExternalLink, Award, PenTool, CheckCircle2, ShieldCheck } from 'lucide-react';

/**
 * Trust & Feedback section.
 *
 * HONESTY RULE (operating mandate §6): never display a rating, review count,
 * testimonial, or named institution that is not backed by a real, verifiable
 * review. A previous version hard-coded invented reviews attributed to real
 * named schools (Allied School System, Ayesha Siddiqua Girls High School,
 * Pinnacle STEM Academy) plus a fabricated 4.9 / 187-review aggregate. All of
 * that was removed. Do not reinstate placeholder reviews.
 *
 * When real reviews exist on an external platform, read them from that platform
 * and render the actual numbers — never invent them.
 */

interface ExternalPlatform {
  name: string;
  label: string;
  blurb: string;
  href: string;
  mark: string;
  markClass: string;
}

/** Only real, publicly reachable review destinations belong here. */
const EXTERNAL_PLATFORMS: ExternalPlatform[] = [
  {
    name: 'Google',
    label: 'Google Business Profile',
    blurb: 'Find Taleem360 on Google Maps and leave a rating',
    href: 'https://www.google.com/search?q=Taleem360+school+ERP+Karachi',
    mark: 'G',
    markClass: 'bg-white text-slate-900',
  },
  {
    name: 'Trustpilot',
    label: 'Trustpilot',
    blurb: 'Independent reviews of taleem360.online',
    href: 'https://www.trustpilot.com/review/taleem360.online',
    mark: '★',
    markClass: 'bg-emerald-500 text-white',
  },
];

export const ReviewsSection: React.FC = () => {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [formName, setFormName] = useState('');
  const [formInstitution, setFormInstitution] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formContent, setFormContent] = useState('');

  /**
   * Sends feedback to the support inbox by opening the visitor's mail client
   * with the message pre-filled. This keeps the promise the form makes: the
   * message actually reaches a human. It does NOT publish anything to the page,
   * so the copy never claims that it did.
   */
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formContent.trim()) return;

    const subject = `Taleem360 feedback — ${formRating}/5 from ${formName}`;
    const body = [
      `Name: ${formName}`,
      `Institution: ${formInstitution || 'Not provided'}`,
      `Rating: ${formRating}/5`,
      '',
      formContent,
    ].join('\n');

    window.location.href =
      `mailto:support@taleem360.online?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    setFeedbackSent(true);
    setFormName('');
    setFormInstitution('');
    setFormRating(5);
    setFormContent('');
  };

  return (
    <section id="reviews-feedback-section" className="py-24 bg-slate-900 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(79,70,229,0.05),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" />
            Trust &amp; Feedback
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Tell us how we are doing
          </h2>
          <p className="mt-4 text-lg text-slate-400 leading-relaxed">
            Taleem360 is a new platform, and we publish no rating until real schools have
            left real reviews on an independent site. If you use Taleem360, your review is
            the first honest signal a future school will see.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch mb-20">

          {/* Column 1: honesty card — replaces the fabricated aggregate score */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-8 rounded-3xl flex flex-col justify-between shadow-2xl">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                No invented ratings
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We do not display an aggregate score, a review count, or a testimonial until
                it exists on a platform you can check for yourself.
              </p>

              <div className="flex items-center gap-1 my-6" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 text-slate-700" />
                ))}
              </div>

              <p className="text-xs text-slate-400 font-semibold">
                Ratings appear here only when they are real and verifiable.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Published aggregate rating</span>
                <span className="text-slate-500 font-bold">Not yet available</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Verified subscriber reviews</span>
                <span className="text-slate-500 font-bold">0</span>
              </div>
            </div>
          </div>

          {/* Column 2: external review destinations */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-8 rounded-3xl flex flex-col justify-between shadow-2xl">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Review us independently</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                School administrators, teachers and parents can review Taleem360 on a public
                platform. Independent reviews carry more weight than anything we could write
                about ourselves.
              </p>

              <div className="space-y-4">
                {EXTERNAL_PLATFORMS.map((p) => (
                  <a
                    key={p.name}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all group min-h-[52px]"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${p.markClass}`}>
                        {p.mark}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white">{p.label}</p>
                        <p className="text-[10px] text-slate-400">{p.blurb}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed mt-6">
              External platforms are un-curated. We cannot edit or remove what is published there.
            </div>
          </div>

          {/* Column 3: feedback form */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-emerald-400" />
              Send private feedback
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Goes straight to our support inbox. We reply to every message.
            </p>

            {feedbackSent ? (
              <div className="flex items-start gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900 rounded-xl p-4">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Your mail client should have opened with your message ready to send. If it
                  did not, email{' '}
                  <a className="underline" href="mailto:support@taleem360.online">
                    support@taleem360.online
                  </a>{' '}
                  directly.
                </span>
              </div>
            ) : (
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
                    placeholder="School / Institution Name"
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
                        aria-label={`Rate ${star} out of 5 stars`}
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
                  Send feedback to support
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
