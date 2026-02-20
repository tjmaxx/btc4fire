import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import Layout from '../components/Layout';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { ArrowLeft, Clock, Tag } from 'lucide-react';

const CATEGORY_COLORS = {
  news: 'bg-blue-500/20 text-blue-400',
  education: 'bg-purple-500/20 text-purple-400',
  guide: 'bg-green-500/20 text-green-400',
  fire: 'bg-orange-500/20 text-orange-400',
};

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data } = await supabase
        .from('articles')
        .select('*, profiles(username, display_name)')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      setArticle(data || null);
      setLoading(false);

      if (data) {
        supabase
          .from('articles')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', data.id);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
          <div className="h-8 bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-slate-800 rounded w-1/2" />
          <div className="h-64 bg-slate-800 rounded" />
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="text-center py-24">
          <h2 className="text-2xl font-bold text-white mb-3">Article Not Found</h2>
          <Link to="/blog" className="text-orange-400 hover:underline">← Back to Blog</Link>
        </div>
      </Layout>
    );
  }

  const author = article.profiles;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-1 text-slate-400 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[article.category] || 'bg-slate-700 text-slate-400'}`}>
              {article.category}
            </span>
            <span className="text-slate-500 text-sm flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">{article.title}</h1>

          {article.excerpt && (
            <p className="text-slate-400 text-lg leading-relaxed border-l-4 border-orange-500 pl-4">{article.excerpt}</p>
          )}

          {author && (
            <div className="flex items-center gap-2 mt-4 text-sm text-slate-400">
              By{' '}
              <Link to={`/profile/${author.username}`} className="text-orange-400 font-medium hover:underline">
                {author.display_name || author.username}
              </Link>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="border-t border-slate-700 pt-6">
          <MarkdownRenderer content={article.content} />
        </div>

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-700 flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-slate-500" />
            {article.tags.map(tag => (
              <span key={tag} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">{tag}</span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 p-5 bg-slate-800 rounded-xl border border-slate-700 text-center">
          <p className="text-slate-300 mb-3">Join the discussion in our community forum</p>
          <Link
            to="/forum"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Visit Forum
          </Link>
        </div>
      </div>
    </Layout>
  );
}
