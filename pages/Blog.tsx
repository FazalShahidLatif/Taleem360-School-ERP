import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ChevronRight, Tag } from 'lucide-react';
import { BlogPost } from '../types';
import api from '../lib/api';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/blog/posts/');
        setPosts(res.data);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  return (
    <div className="space-y-12">
      <div className="text-center mb-16">
        <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Taleem360 Blog</h2>
        <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
          Insights for Modern Educators
        </p>
        <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
          Stay updated with the latest trends in school management, educational technology, and student success.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-x-8">
          {posts.map((post) => (
            <div key={post.id} className="flex flex-col overflow-hidden rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <img className="h-48 w-full object-cover" src={post.image_url} alt={post.title} referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 text-sm text-indigo-600 font-medium mb-3">
                    <Tag className="w-4 h-4" />
                    <span>{post.category}</span>
                  </div>
                  <Link to={`/blog/${post.slug}`} className="block mt-2">
                    <p className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">{post.title}</p>
                    <p className="mt-3 text-base text-gray-500 line-clamp-3">{post.excerpt}</p>
                  </Link>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <User className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{post.author}</p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <time dateTime={post.published_at}>{new Date(post.published_at).toLocaleDateString()}</time>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-500"
                  >
                    Read full story
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-indigo-700 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Subscribe to our newsletter</h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Get the latest articles, product updates, and educational resources delivered straight to your inbox.
            </p>
            <form className="sm:flex justify-center max-w-md mx-auto">
              <input
                type="email"
                required
                className="w-full px-5 py-3 border border-transparent rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-xl text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white"
              >
                Subscribe
              </button>
            </form>
          </div>
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-indigo-800 rounded-full opacity-20 blur-3xl"></div>
        </div>
    </div>
  );
};
