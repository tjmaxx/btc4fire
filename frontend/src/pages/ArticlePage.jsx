import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { ArrowLeft, Clock, Tag, MessageSquare, Send } from 'lucide-react';

const CATEGORY_COLORS = {
  news: 'bg-blue-500/20 text-blue-400',
  education: 'bg-purple-500/20 text-purple-400',
  guide: 'bg-green-500/20 text-green-400',
  fire: 'bg-orange-500/20 text-orange-400',
};

export default function ArticlePage() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');

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
        supabase.from('articles').update({ view_count: (data.view_count || 0) + 1 }).eq('id', data.id);
        const { data: commentData } = await supabase
          .from('article_comments')
          .select('*, profiles(username)')
          .eq('article_id', data.id)
          .order('created_at', { ascending: true });
        setComments(commentData || []);
      }
    };
    fetchArticle();
  }, [slug]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    setCommentSubmitting(true);
    setCommentError('');
    const { data, error } = await supabase
      .from('article_comments')
      .insert({ article_id: article.id, author_id: user.id, content: commentText.trim() })
      .select('*, profiles(username)')
      .single();
    if (error) {
      setCommentError('Failed to post comment. Please try again.');
    } else {
      setComments(prev => [...prev, data]);
      setCommentText('');
    }
    setCommentSubmitting(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
          <div className="h-8 bg-gray-100 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-1/2" />
          <div className="h-64 bg-gray-100 dark:bg-slate-800 rounded" />
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="text-center py-24">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Article Not Found</h2>
          <Link to="/blog" className="text-orange-400 hover:underline">← Back to Blog</Link>
        </div>
      </Layout>
    );
  }

  const author = article.profiles;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-1 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[article.category] || 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>
              {article.category}
            </span>
            <span className="text-gray-400 dark:text-slate-500 text-sm flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{article.title}</h1>

          {article.excerpt && (
            <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed border-l-4 border-orange-500 pl-4">{article.excerpt}</p>
          )}

          {author && (
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 dark:text-slate-400">
              By{' '}
              <Link to={`/profile/${author.username}`} className="text-orange-400 font-medium hover:underline">
                {author.display_name || author.username}
              </Link>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
          <MarkdownRenderer content={article.content} />
        </div>

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700 flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-gray-400 dark:text-slate-500" />
            {article.tags.map(tag => (
              <span key={tag} className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs px-2 py-1 rounded">{tag}</span>
            ))}
          </div>
        )}

        {/* Comments */}
        <div className="mt-10 border-t border-gray-200 dark:border-slate-700 pt-8">
          <h2 className="text-gray-900 dark:text-white font-semibold mb-5 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-400" />
            Comments ({comments.length})
          </h2>

          {comments.length > 0 && (
            <div className="space-y-4 mb-6">
              {comments.map(c => (
                <div key={c.id} className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-xs font-bold flex-shrink-0">
                      {c.profiles?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-white text-sm font-medium">{c.profiles?.username || 'Anonymous'}</p>
                      <p className="text-gray-400 dark:text-slate-500 text-xs">
                        {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          {isAuthenticated ? (
            <form onSubmit={handleComment} className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Share your thoughts…"
                rows={3}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors"
              />
              {commentError && <p className="text-red-400 text-xs mt-2">{commentError}</p>}
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={commentSubmitting || !commentText.trim()}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {commentSubmitting ? 'Posting…' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 text-center">
              <p className="text-gray-700 dark:text-slate-300 mb-3">Sign in to leave a comment</p>
              <div className="flex justify-center gap-3">
                <Link to="/login" className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm transition-colors">Log In</Link>
                <Link to="/signup" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Sign Up</Link>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 p-5 bg-gray-100 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-center">
          <p className="text-gray-700 dark:text-slate-300 mb-3">Join the discussion in our community forum</p>
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
