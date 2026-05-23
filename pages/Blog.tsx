import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ChevronRight, Tag, BookOpen, Search, CheckCircle, Network, HelpCircle } from 'lucide-react';
import { TOPICAL_CLUSTERS, BLOG_POSTS_DATA, RichBlogPost } from '../lib/blogContent';
import api from '../lib/api';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<RichBlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<RichBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');

  useEffect(() => {
    document.title = 'Taleem360 - Educational ERP Knowledge Vault & Research Archive';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Explore our comprehensive, research-backed guides built to optimize K-12 operations, improve student success, automate fees, and simplify school payroll compliance with Taleem360 ERP.');

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', 'https://taleem360.online/blog');

    const fetchPosts = async () => {
      try {
        const res = await api.get('/blog/posts/');
        setPosts(res.data);
        setFilteredPosts(res.data);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    let result = posts;

    // Filter by topical cluster
    if (selectedCluster !== 'ALL') {
      result = result.filter(post => post.category === selectedCluster);
    }

    // Filter by search query
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query)
      );
    }

    setFilteredPosts(result);
  }, [searchTerm, selectedCluster, posts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 bg-slate-50 min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-slate-500 font-medium">Indexing semantic research archive...</p>
        </div>
      </div>
    );
  }

  const clustersList = ['ALL', ...Object.values(TOPICAL_CLUSTERS)];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Search Engine Optimized Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/40 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4 tracking-wide uppercase">
              Taleem360 Knowledge Vault
            </span>
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl tracking-tight leading-none bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">
              Topical Educational ERP Archive
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
              30 comprehensive, research-backed guides built to optimize operations, improve student success, simplify billing compliance, and streamline school logistics.
            </p>
          </div>

          {/* Search Box */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword, author, or research topic..."
              className="block w-full pl-12 pr-4 py-4 border border-slate-700 rounded-2xl bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base"
            />
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-600/10 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Topical Clusters Filter Bar */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 flex items-center">
            <Network className="w-4 h-4 mr-1.5 text-indigo-500" />
            Topical Semantic Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {clustersList.map((cluster) => (
              <button
                key={cluster}
                onClick={() => setSelectedCluster(cluster)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  (cluster === 'ALL' && selectedCluster === 'ALL') || selectedCluster === cluster
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 shadow-sm'
                }`}
              >
                {cluster === 'ALL' ? 'Show All Areas' : cluster}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="text-slate-800 font-bold">{filteredPosts.length}</span> of <span className="text-slate-800 font-bold">{posts.length}</span> optimized research articles
          </p>
          <div className="hidden sm:flex items-center space-x-1.5 text-xs text-indigo-600 bg-indigo-50 font-semibold px-2.5 py-1 rounded-md">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>SEO Checked & Ready</span>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article 
                key={post.id} 
                className="flex flex-col overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-lg hover:border-indigo-200 transition-all group"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={post.image_url} 
                    alt={post.alt_text}
                    referrerPolicy="no-referrer" 
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/10">
                    {post.category}
                  </div>
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 text-slate-500 text-xs mb-3">
                      <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded">
                        Readability {post.readability_score}+
                      </span>
                      <span className="flex items-center">
                        <BookOpen className="w-3.5 h-3.5 mr-1" />
                        {Math.round(post.word_count / 250)} min read
                      </span>
                    </div>

                    <Link to={`/blog/${post.slug}`} className="block focus:outline-none">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="mt-2.5 text-sm text-slate-500 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </Link>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs ring-2 ring-slate-50">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{post.author}</p>
                        <p className="text-[10px] text-slate-400">{new Date(post.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      Read Guide
                      <ChevronRight className="ml-1 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-slate-800">No guides matching your query</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm">
              We couldn't find any articles matching "{searchTerm}". Try clearing your filters or testing other academic keywords.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCluster('ALL'); }}
              className="mt-5 inline-flex items-center px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              Reset Search Parameters
            </button>
          </div>
        )}

        {/* Lead Magnet CTA - Direct Monetization Slot */}
        <div className="mt-16 bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl shadow-indigo-900/20 border border-indigo-600/30">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-4 leading-tight">
              Looking to Skyrocket Your School's Operational Efficiency?
            </h2>
            <p className="text-indigo-100 mb-8 text-base sm:text-lg opacity-90 leading-relaxed">
              Every study in our Knowledge Vault points to one fundamental core truth: unified cloud-native ERP databases build high-performing academies. Experience the power of the Taleem360 ERP system on your campus.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-bold rounded-xl text-indigo-700 bg-white hover:bg-indigo-50 hover:scale-102 hover:shadow-lg transition-all focus:outline-none"
              >
                Schedule Free ERP Audit
              </Link>
              <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Taleem360 Research updates!'); }} className="flex w-full sm:w-auto max-w-md">
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-transparent rounded-l-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Parent or Admin email address"
                />
                <button
                  type="submit"
                  className="px-5 py-3 border border-transparent text-sm font-bold rounded-r-xl text-white bg-indigo-600 hover:bg-indigo-500 transition-colors focus:outline-none cursor-pointer"
                >
                  Join List
                </button>
              </form>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-900 rounded-full opacity-25 blur-3xl"></div>
        </div>

        {/* Global HTML Sitemap Index Footer - Boost Indexability */}
        <div className="mt-20 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center border-b border-slate-100 pb-3">
            <Network className="w-5 h-5 text-indigo-600 mr-2" />
            Topical Map Sitemap Index (Total 30 Interlinked Articles)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(TOPICAL_CLUSTERS).map(([key, value]) => {
              const clusterPosts = posts.filter(p => p.category === value);
              return (
                <div key={key} className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">{value}</h4>
                  <ul className="space-y-1.5">
                    {clusterPosts.map(p => (
                      <li key={p.id}>
                        <Link 
                          to={`/blog/${p.slug}`} 
                          className="text-xs text-slate-500 hover:text-indigo-600 hover:underline transition-colors block line-clamp-1 py-0.5"
                          title={p.title}
                        >
                          ● {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
            <p>Taleem360 Enterprise ERP SEO Canonical Framework Edition</p>
            <div className="flex space-x-4">
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 hover:underline">XML Sitemap</a>
              <Link to="/about" className="hover:text-indigo-600 hover:underline">Authors Directory</Link>
              <Link to="/pricing" className="hover:text-indigo-600 hover:underline">Core Specifications</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
