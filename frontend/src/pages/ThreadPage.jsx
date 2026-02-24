import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { ArrowLeft, MessageSquare, Clock, Send, Eye } from 'lucide-react';

const CAT_BADGE = {
  general: 'bg-blue-500/20 text-blue-400',
  trading: 'bg-green-500/20 text-green-400',
  fire: 'bg-orange-500/20 text-orange-400',
  beginners: 'bg-purple-500/20 text-purple-400',
};

function Avatar({ username }) {
  return (
    <div className="w-9 h-9 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-sm font-bold flex-shrink-0">
      {username?.[0]?.toUpperCase() || '?'}
    </div>
  );
}

function PostCard({ post }) {
  return (
    <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
      <div className="flex items-center gap-2.5 mb-3">
        <Avatar username={post.profiles?.username} />
        <div>
          <div className="text-gray-900 dark:text-white text-sm font-medium">{post.profiles?.username || 'Anonymous'}</div>
          <div className="text-gray-400 dark:text-slate-500 text-xs">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </div>
        </div>
      </div>
      <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
    </div>
  );
}

export default function ThreadPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchThread = async () => {
      const [threadRes, postsRes] = await Promise.all([
        supabase.from('forum_threads').select('*, profiles(username)').eq('id', id).single(),
        supabase.from('forum_posts').select('*, profiles(username)').eq('thread_id', id).order('created_at', { ascending: true }),
      ]);
      setThread(threadRes.data || null);
      setPosts(postsRes.data || []);
      setLoading(false);

      if (threadRes.data) {
        supabase.from('forum_threads')
          .update({ view_count: (threadRes.data.view_count || 0) + 1 })
          .eq('id', id);
      }
    };
    fetchThread();
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !user) return;
    setSubmitting(true);
    setSubmitError('');

    const { data, error } = await supabase
      .from('forum_posts')
      .insert({ thread_id: id, content: reply.trim(), author_id: user.id })
      .select('*, profiles(username)')
      .single();

    if (error) {
      setSubmitError('Failed to post reply. Please try again.');
    } else {
      setPosts(prev => [...prev, data]);
      setReply('');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
          <div className="h-6 bg-gray-100 dark:bg-slate-800 rounded w-2/3" />
          <div className="h-32 bg-gray-100 dark:bg-slate-800 rounded" />
        </div>
      </Layout>
    );
  }

  if (!thread) {
    return (
      <Layout>
        <div className="text-center py-24">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Thread Not Found</h2>
          <Link to="/forum" className="text-orange-400 hover:underline">← Back to Forum</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Link to="/forum" className="inline-flex items-center gap-1 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Forum
        </Link>

        {/* Original post */}
        <div className="bg-gray-100 dark:bg-slate-800 border border-orange-500/30 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${CAT_BADGE[thread.category] || 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>
              {thread.category}
            </span>
            <span className="text-gray-400 dark:text-slate-500 text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(thread.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{thread.title}</h1>

          <div className="flex items-center gap-2.5 mb-4">
            <Avatar username={thread.profiles?.username} />
            <span className="text-gray-700 dark:text-slate-300 text-sm font-medium">{thread.profiles?.username || 'Anonymous'}</span>
          </div>

          <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{thread.content}</p>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 flex items-center gap-4 text-gray-400 dark:text-slate-500 text-xs">
            <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{thread.reply_count} replies</span>
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{thread.view_count} views</span>
          </div>
        </div>

        {/* Replies */}
        {posts.length > 0 && (
          <div className="space-y-3 mb-6">
            <p className="text-gray-400 dark:text-slate-500 text-sm font-medium uppercase tracking-wide">
              {posts.length} {posts.length === 1 ? 'Reply' : 'Replies'}
            </p>
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}

        {/* Reply form */}
        {!thread.locked ? (
          isAuthenticated ? (
            <form onSubmit={handleReply} className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <label htmlFor="reply-text" className="text-gray-900 dark:text-white font-medium mb-3 block">Add a Reply</label>
              <textarea
                id="reply-text"
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors"
              />
              {submitError && <p role="alert" className="text-red-400 text-sm mt-2">{submitError}</p>}
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={submitting || !reply.trim()}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 text-center">
              <p className="text-gray-700 dark:text-slate-300 mb-3">Sign in to join the discussion</p>
              <div className="flex justify-center gap-3">
                <Link to="/login" className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm transition-colors">Log In</Link>
                <Link to="/signup" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Sign Up</Link>
              </div>
            </div>
          )
        ) : (
          <div className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 text-center text-gray-400 dark:text-slate-500 text-sm">
            This thread is locked.
          </div>
        )}
      </div>
    </Layout>
  );
}
