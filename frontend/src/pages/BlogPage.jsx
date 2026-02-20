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
      className="block bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-orange-500/50 transition-all group"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[article.category] || 'bg-slate-700 text-slate-400'}`}>
          {article.category}
        </span>
        <span className="text-slate-500 text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>
      <div className="flex items-center gap-1 mt-4 text-orange-400 text-sm font-medium">
        Read more <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      let query = supabase
        .from('articles')
        .select('id, title, slug, excerpt, category, created_at, featured')
        .eq('published', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (category !== 'all') query = query.eq('category', category);

      const { data } = await query;
      setArticles(data || []);
      setLoading(false);
    };
    fetchArticles();
  }, [category]);

  const featured = articles.find(a => a.featured);
  const filtered = articles.filter(a => {
    if (search) {
      const q = search.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="w-7 h-7 text-orange-400" />
          <h1 className="text-3xl font-bold text-white">Blog & News</h1>
        </div>
        <p className="text-slate-400 ml-10">Learn about Bitcoin, FIRE strategies, and financial independence.</p>
      </div>

      {/* Featured article */}
      {featured && category === 'all' && !search && (
        <Link
          to={`/blog/${featured.slug}`}
          className="block bg-gradient-to-r from-orange-500/10 to-blue-500/10 border border-orange-500/30 rounded-2xl p-6 mb-8 hover:border-orange-500/60 transition-all group"
        >
          <span className="text-xs bg-orange-500 text-white px-2.5 py-1 rounded-full font-medium">Featured</span>
          <h2 className="text-2xl font-bold text-white mt-3 mb-2 group-hover:text-orange-400 transition-colors">
            {featured.title}
          </h2>
          <p className="text-slate-300 leading-relaxed">{featured.excerpt}</p>
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
              onClick={() => { setCategory(cat.value); setSearch(''); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
          onChange={e => setSearch(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-1.5 text-sm flex-1 focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <div key={i} className="bg-slate-800 rounded-xl h-48 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No articles found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(article => <ArticleCard key={article.id} article={article} />)}
        </div>
      )}
    </Layout>
  );
}
