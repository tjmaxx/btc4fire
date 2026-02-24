import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import Layout from '../components/Layout';
import { BookOpen, Clock, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'news', label: 'News' },
  { value: 'education', label: 'Education' },
  { value: 'guide', label: 'Guides' },
  { value: 'fire', label: 'FIRE' },
];

const CATEGORY_COLORS = {
  news: 'bg-blue-500/20 text-blue-400',
  education: 'bg-purple-500/20 text-purple-400',
  guide: 'bg-green-500/20 text-green-400',
  fire: 'bg-orange-500/20 text-orange-400',
};

function ArticleCard({ article }) {
  return (
    <Link
      to={`/blog/${article.slug}`}
      className="block bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 hover:border-orange-500/50 transition-all group"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[article.category] || 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>
          {article.category}
        </span>
        <span className="text-gray-400 dark:text-slate-500 text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
      <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>
      <div className="flex items-center gap-1 mt-4 text-orange-400 text-sm font-medium">
        Read more <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  );
}

const PAGE_SIZE = 12;

export default function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState(null);


  useEffect(() => {
    const fetchArticles = async () => {
      page === 0 ? setLoading(true) : setLoadingMore(true);

      let query = supabase
        .from('articles')
        .select('id, title, slug, excerpt, category, created_at, featured')
        .eq('published', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

      if (category !== 'all') query = query.eq('category', category);
      if (search) query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);

      const { data } = await query;
      const results = data || [];

      if (page === 0) {
        setArticles(results);
        setFeatured(results.find(a => a.featured) || null);
      } else {
        setArticles(prev => [...prev, ...results]);
      }

      setHasMore(results.length === PAGE_SIZE);
      setLoading(false);
      setLoadingMore(false);
    };
    fetchArticles();
  }, [category, search, page]);

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="w-7 h-7 text-orange-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog & News</h1>
        </div>
        <p className="text-gray-500 dark:text-slate-400 ml-10">Learn about Bitcoin, FIRE strategies, and financial independence.</p>
      </div>

      {/* Featured article */}
      {featured && category === 'all' && !search && page === 0 && (
        <Link
          to={`/blog/${featured.slug}`}
          className="block bg-gradient-to-r from-orange-500/10 to-blue-500/10 border border-orange-500/30 rounded-2xl p-6 mb-8 hover:border-orange-500/60 transition-all group"
        >
          <span className="text-xs bg-orange-500 text-white px-2.5 py-1 rounded-full font-medium">Featured</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-3 mb-2 group-hover:text-orange-400 transition-colors">
            {featured.title}
          </h2>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed">{featured.excerpt}</p>
          <div className="flex items-center gap-1 mt-4 text-orange-400 font-medium">
            Read article <ChevronRight className="w-4 h-4" />
          </div>
        </Link>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => { setCategory(cat.value); setSearch(''); setPage(0); setArticles([]); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); setArticles([]); }}
          className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 rounded-lg px-4 py-1.5 text-sm flex-1 focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <div key={i} className="bg-gray-100 dark:bg-slate-800 rounded-xl h-48 animate-pulse" />)}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-slate-500">No articles found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map(article => <ArticleCard key={article.id} article={article} />)}
          </div>
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={loadingMore}
                className="px-6 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {loadingMore ? 'Loading…' : 'Load more articles'}
              </button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
