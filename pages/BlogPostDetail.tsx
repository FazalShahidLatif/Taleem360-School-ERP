import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, User, ChevronRight, Tag, BookOpen, Clock, ArrowLeft, 
  MapPin, CheckSquare, Sparkles, Activity, ShieldCheck, HelpCircle, 
  Percent, FileText, ChevronDown, Award, Send
} from 'lucide-react';
import { RichBlogPost, BLOG_POSTS_DATA, TOPICAL_CLUSTERS } from '../lib/blogContent';
import api from '../lib/api';

export const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<RichBlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RichBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.get(`/blog/posts/${slug}`);
        if (res.data) {
          const fetchedPost = res.data as RichBlogPost;
          setPost(fetchedPost);
          
          // Seed related articles from the same cluster
          const allPosts = BLOG_POSTS_DATA;
          const related = allPosts
            .filter(p => p.category === fetchedPost.category && p.slug !== fetchedPost.slug)
            .slice(0, 3);
          setRelatedPosts(related);

          // --- SEO ENGINE: INJECT CANONICALS & SCHEMAS ---
          // Coordinate dynamic title and meta descriptions
          document.title = `${fetchedPost.title} | Taleem360 Knowledge Vault`;

          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute('content', fetchedPost.excerpt);

          let ogT = document.querySelector('meta[property="og:title"]');
          if (ogT) ogT.setAttribute('content', fetchedPost.title);

          let ogD = document.querySelector('meta[property="og:description"]');
          if (ogD) ogD.setAttribute('content', fetchedPost.excerpt);

          // 1. Dynamic Canonical
          let canonicalLink = document.querySelector('link[rel="canonical"]');
          if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalLink);
          }
          const formattedCanonical = fetchedPost.canonical.replace('https://taleem360.online', 'https://www.taleem360.online');
          canonicalLink.setAttribute('href', formattedCanonical);

          // 2. Dynamic JSON-LD (Web schemas: BlogPosting, Breadcrumb, FAQ)
          const schemaId = 'seo-blog-detail-schemas';
          let schemaScript = document.getElementById(schemaId);
          if (!schemaScript) {
            schemaScript = document.createElement('script');
            schemaScript.id = schemaId;
            schemaScript.setAttribute('type', 'application/ld+json');
            document.head.appendChild(schemaScript);
          }

          const blogPostingSchema = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": formattedCanonical
            },
            "headline": fetchedPost.title,
            "description": fetchedPost.excerpt,
            "image": [fetchedPost.image_url],
            "datePublished": fetchedPost.published_at,
            "dateModified": fetchedPost.published_at,
            "author": {
              "@type": "Person",
              "name": fetchedPost.author,
              "jobTitle": "Education Operations Specialist"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Taleem360",
              "logo": {
                "@type": "ImageObject",
                "url": "https://taleem360.online/logo.png"
              }
            }
          };

          const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Institutional Portal", "item": "https://taleem360.online/" },
              { "@type": "ListItem", "position": 2, "name": "Knowledge Vault", "item": "https://taleem360.online/blog" },
              { "@type": "ListItem", "position": 3, "name": fetchedPost.category, "item": `https://taleem360.online/blog` },
              { "@type": "ListItem", "position": 4, "name": fetchedPost.title, "item": fetchedPost.canonical }
            ]
          };

          const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": fetchedPost.faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          };

          // Product schema for Taleem360 ERP connected backlink
          const productSaasSchema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Taleem360 School Cloud ERP Suite",
            "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
            "description": "Unified cloud database suite automating K-12 attendance tracking, automated student fee collection networks, double-entry ledgers, and parent messaging portals.",
            "brand": {
              "@type": "Brand",
              "name": "Taleem360"
            },
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "49",
              "highPrice": "499",
              "priceCurrency": "USD"
            }
          };

          schemaScript.innerHTML = JSON.stringify([blogPostingSchema, breadcrumbSchema, faqSchema, productSaasSchema]);

        } else {
          setPost(null);
        }
      } catch (err) {
        console.error('Failed to load article details:', err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();

    // Clean up HEAD elements on leave to keep DOM pristine
    return () => {
      const schemaScript = document.getElementById('seo-blog-detail-schemas');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [slug]);

  // Scroll smoothly to individual sections
  const handleScrollToSection = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const submitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;
    alert(`Thank you, ${leadName}! A school operations engineer will call you shortly at ${leadPhone} to schedule your free audit.`);
    setLeadName('');
    setLeadPhone('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 bg-slate-50 min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-slate-500 font-semibold text-sm">Compiling semantic content nodes...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-slate-50 min-h-screen py-24 px-4 text-center flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-md">
          <HelpCircle className="w-16 h-16 text-indigo-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-black text-slate-800">Research Article Not Indexed</h2>
          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            The requested technical operational resource doesn't exist or hasn't completed audit validation under our semantic map schemas.
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="mt-6 inline-flex items-center px-5 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Knowledge Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="school-blog-detail" className="bg-slate-50 min-h-screen pb-24">
      {/* Article Navigation bar */}
      <div className="bg-white border-b border-slate-200 py-4 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/blog" className="inline-flex items-center text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Directory
          </Link>
          <div className="flex items-center space-x-3 text-xs text-slate-400 font-semibold">
            <span>READABILITY SCORE: <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">{post.readability_score}+</span></span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">WORD COUNT: <span className="text-indigo-600 font-bold">{post.word_count} WORDS</span></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          
          {/* LEFT COLUMN: TABLE OF CONTENTS (STAYS STUCK ON DESKTOP) */}
          <nav className="hidden lg:block space-y-6 sticky top-24">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 pb-2 border-b border-slate-100 flex items-center">
                <FileText className="w-4 h-4 text-indigo-500 mr-2" />
                Table of Contents
              </h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => handleScrollToSection('intro-node')}
                    className="text-xs text-left font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    ● Executive Introduction
                  </button>
                </li>
                {post.subSections.map((sec, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={() => handleScrollToSection(`sec-node-${idx}`)}
                      className="text-xs text-left font-medium text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer block line-clamp-2 pl-2"
                    >
                      {idx + 1}. {sec.title}
                    </button>
                  </li>
                ))}
                <li>
                  <button 
                    onClick={() => handleScrollToSection('case-node')}
                    className="text-xs text-left font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    ● Case Study Assessment
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleScrollToSection('faq-node')}
                    className="text-xs text-left font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    ● Schema FAQ Block
                  </button>
                </li>
              </ul>
            </div>

            {/* In-Article Promotion Widget (AdSense Display Native placeholder) */}
            <div className="bg-gradient-to-br from-indigo-950 to-indigo-900 text-white rounded-2xl p-5 border border-indigo-900 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl"></div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-500/30 text-indigo-300 uppercase tracking-widest mb-3">
                Sponsor Highlight
              </span>
              <h4 className="text-sm font-black mb-1.5 leading-snug">ERP Software Implementation</h4>
              <p className="text-[11px] text-slate-300 leading-normal mb-4">
                Deploy Taleem360 and claim up to $500 in onboarding credits. Unify attendance, invoicing, and reporting today.
              </p>
              <Link 
                to="/pricing" 
                className="inline-flex items-center text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded-lg transition-all"
              >
                Claim Credits
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
          </nav>

          {/* MIDDLE COLUMN: RESEARCH MATERIAL READER PORTAL (SPARED MD SPACE) */}
          <main className="lg:col-span-2 space-y-8">
            <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs relative overflow-hidden">
              {/* Category tag */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                  {post.category}
                </span>
                <span className="flex items-center text-xs text-slate-400 font-semibold bg-slate-50 px-2 py-1 rounded">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  {Math.round(post.word_count / 250)} Minute Read
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3.5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
                {post.title}
              </h1>

              {/* Meta bar */}
              <div className="flex flex-wrap items-center gap-4 py-5 border-y border-slate-100 mb-8 text-xs text-slate-500">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-2 text-xs">
                    {post.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">{post.author}</span>
                    <span className="text-[10px] text-slate-400">Chief Education Policy Audit Lead</span>
                  </div>
                </div>
                <div className="flex items-center bg-slate-50 px-2.5 py-1.5 rounded">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                  <span>Published: <strong className="text-slate-700">{new Date(post.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
                </div>
                <div className="flex items-center bg-slate-50 px-2.5 py-1.5 rounded">
                  <Award className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  <span>Flesch score: <strong className="text-emerald-700">{post.readability_score} (Accessible)</strong></span>
                </div>
              </div>

              {/* Main Image banner */}
              <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 mb-8 max-h-[380px] border border-slate-200">
                <img 
                  src={post.image_url} 
                  alt={post.alt_text} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <span className="text-xs text-slate-400 block -mt-6 mb-8 text-center bg-slate-50 py-1.5 rounded-b-xl border-x border-b border-slate-200">
                Figure 1.1: {post.alt_text}
              </span>

              {/* Introduction Segment */}
              <div id="intro-node" className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
                  1.0 Executive Introduction & Thesis Overview
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm antialiased text-justify">
                  {post.introduction}
                </p>
                <p className="text-slate-600 leading-relaxed text-sm antialiased text-justify font-normal pl-4 border-l-2 border-indigo-600 italic bg-indigo-50/20 py-1">
                  "Administrative complexity acts as an operational bottleneck. To unlock maximum focus, modern academics should unify their daily record matrices under a secure and centralized relational framework."
                </p>
              </div>

              {/* Content Sections */}
              <div className="space-y-10 mt-10">
                {post.subSections.map((section, idx) => (
                  <section id={`sec-node-${idx}`} key={idx} className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-base font-extrabold text-slate-800">
                      2.{idx + 1} {section.title}
                    </h3>
                    
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-slate-600 text-sm leading-relaxed antialiased text-justify">
                        {p}
                      </p>
                    ))}

                    {section.bullets && (
                      <ul className="space-y-2.5 bg-slate-50/70 p-5 rounded-xl border border-slate-100">
                        {section.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start text-xs text-slate-600">
                            <CheckSquare className="w-4 h-4 mr-2.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.callout && (
                      <div className="bg-amber-50/50 border-l-4 border-amber-500 rounded-r-xl p-4 text-xs text-amber-900 leading-relaxed">
                        <strong>Operational Insight:</strong> {section.callout}
                      </div>
                    )}

                    {/* INTERLINKS ROOT: Contextual cluster alignment */}
                    {section.interlinkTitle && section.interlinkSlug && (
                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between text-xs my-2">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4.5 h-4.5 text-indigo-600 flex-shrink-0" />
                          <span className="text-slate-700 font-semibold">{section.interlinkTitle}</span>
                        </div>
                        <Link 
                          to={`/blog/${section.interlinkSlug}`} 
                          className="text-indigo-600 font-bold hover:underline ml-3 flex-shrink-0 flex items-center"
                        >
                          Access Guide
                          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </Link>
                      </div>
                    )}

                    {/* Native Display Ad Injections inside paragraph streams (In-Article Unit) */}
                    {idx === 1 && (
                      <div className="my-6 p-5 bg-slate-50 border border-slate-200 rounded-xl text-center relative">
                        <span className="absolute top-1 right-2 text-[8px] tracking-widest text-slate-400 font-bold">NATIVE AD DESK</span>
                        <h4 className="text-slate-800 font-extrabold text-xs mb-1">Recommended SaaS: Taleem360 ERP</h4>
                        <p className="text-slate-500 text-[10px] max-w-sm mx-auto mb-3">
                          Automate your school fee schedules and protect database security with high-performance software. Rated 4.9/5 by global superintendents.
                        </p>
                        <Link 
                          to="/pricing" 
                          className="inline-flex items-center px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] rounded"
                        >
                          Book Demo Setup
                        </Link>
                      </div>
                    )}
                  </section>
                ))}
              </div>

              {/* Standard Case study Modules */}
              <section id="case-node" className="mt-12 pt-8 border-t border-slate-100 space-y-4">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 sm:p-8">
                  <span className="inline-flex items-center px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded mb-2">
                    Case Study Analysis
                  </span>
                  <h3 className="text-base font-bold text-slate-800 mb-2">
                    {post.caseStudy.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-4 text-justify">
                    {post.caseStudy.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {post.caseStudy.metrics.map((met, mIdx) => (
                      <div key={mIdx} className="bg-white p-3.5 rounded-xl border border-emerald-100 flex flex-col justify-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Metrics 0{mIdx+1}</span>
                        <span className="text-xs font-semibold text-emerald-800 leading-tight mt-1">{met}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Micro Schema FAQ Accordion widgets */}
              <section id="faq-node" className="mt-12 pt-8 border-t border-slate-100 space-y-4">
                <h3 className="text-base font-bold text-slate-800 flex items-center">
                  <HelpCircle className="w-5 h-5 text-indigo-500 mr-2" />
                  3.0 Educational Audit FAQ (Schema-Markup Validated)
                </h3>
                <div className="space-y-3">
                  {post.faqs.map((faq, fIdx) => (
                    <div 
                      key={fIdx} 
                      className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50"
                    >
                      <button
                        onClick={() => setActiveFaq(activeFaq === fIdx ? null : fIdx)}
                        className="w-full text-left p-4 font-bold text-xs text-slate-700 hover:text-indigo-600 transition-colors flex justify-between items-center cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${activeFaq === fIdx ? 'rotate-180' : ''}`} />
                      </button>
                      {activeFaq === fIdx && (
                        <div className="p-4 bg-white border-t border-slate-200 text-xs text-slate-600 leading-relaxed text-justify">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Monetization Slot: B2B Premium Lead Offer */}
              <section className="mt-12 pt-8 border-t border-slate-200">
                <div className="bg-indigo-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
                  <div className="relative z-10 space-y-3">
                    <span className="inline-block px-2.5 py-0.5 bg-indigo-500 text-white text-[9px] font-bold uppercase rounded-full">
                      {post.monetization.badge}
                    </span>
                    <h3 className="text-lg font-black leading-snug">{post.monetization.adTitle}</h3>
                    <p className="text-xs text-indigo-200 leading-relaxed max-w-md">
                      {post.monetization.adDescription}
                    </p>
                    <div className="pt-3 flex flex-wrap gap-4">
                      <Link 
                        to={post.monetization.ctaHref} 
                        className="inline-flex items-center px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-bold rounded-xl transition-all"
                      >
                        {post.monetization.ctaLabel}
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </Link>
                      <Link 
                        to="/pricing" 
                        className="inline-flex items-center text-xs text-white font-semibold hover:text-indigo-200 transition-colors"
                      >
                        View System Specs
                      </Link>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 -mt-20 -mr-20 w-48 h-48 bg-indigo-600 rounded-full blur-3xl opacity-30"></div>
                </div>
              </section>

              <div className="mt-12 pt-6 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-800">4.0 Definitive Conclusion</h3>
                <p className="text-slate-600 text-sm leading-relaxed antialiased text-justify">
                  {post.conclusion}
                </p>
              </div>

            </article>
          </main>

          {/* RIGHT COLUMN: SHARED SS (SHARED SIDEBARS & SECTIONS) */}
          <aside className="space-y-8 sticky top-24 lg:col-span-1">
            
            {/* Lead capture magnet card (Shared Sidebar) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase">
                <ShieldCheck className="w-4.5 h-4.5 text-indigo-600" />
                <span>Free ERP Workspace Audit</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Provide your details below to schedule a custom administrative diagnostic audit for your school franchise.
              </p>
              <form onSubmit={submitLead} className="space-y-3">
                <input 
                  type="text" 
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Administrator Name" 
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <input 
                  type="tel" 
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="Primary Phone Number" 
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button 
                  type="submit" 
                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Request Audit Phone Call
                </button>
              </form>
            </div>

            {/* Structured SS: Related Posts interlinks sidebar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase pb-2 border-b border-slate-100 flex items-center">
                <Sparkles className="w-4 h-4 text-indigo-600 mr-1.5" />
                Related Research
              </h3>
              <div className="space-y-4">
                {relatedPosts.length > 0 ? (
                  relatedPosts.map(p => (
                    <div key={p.id} className="space-y-1">
                      <Link 
                        to={`/blog/${p.slug}`} 
                        className="text-xs font-bold text-slate-800 hover:text-indigo-600 transition-colors leading-tight line-clamp-2 block"
                      >
                        {p.title}
                      </Link>
                      <span className="text-[10px] text-slate-400 block">
                        Category: {p.category}
                      </span>
                    </div>
                  ))
                ) : (
                  // fallback to random cross-cluster selections
                  BLOG_POSTS_DATA
                    .filter(p => p.slug !== post.slug)
                    .slice(0, 3)
                    .map(p => (
                      <div key={p.id} className="space-y-1">
                        <Link 
                          to={`/blog/${p.slug}`} 
                          className="text-xs font-bold text-slate-800 hover:text-indigo-600 transition-colors leading-tight line-clamp-2 block"
                        >
                          {p.title}
                        </Link>
                        <span className="text-[10px] text-slate-400 block">
                          Category: {p.category}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Corporate Specifications (E-Book Promo/Resource) */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 rounded-2xl p-5 border border-slate-700 shadow-sm">
              <span className="text-[8px] font-black bg-emerald-700 text-emerald-100 px-2 py-0.5 rounded tracking-widest uppercase mb-3 inline-block">
                Premium Guide
              </span>
              <h4 className="text-xs font-bold mb-1.5 text-white">The K-12 Compliance Handbook</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                Unlock statutory auditing secrets. Save and safeguard your school grants securely in compliance with FERPA rules.
              </p>
              <a 
                href="/pricing"
                className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center"
              >
                Secure Free E-Book Draft
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </a>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};
