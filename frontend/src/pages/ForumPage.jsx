import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { MessageSquare, Pin, Clock, Plus, TrendingUp } from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'general', label: 'General' },
  { value: 'trading', label: 'Trading' },
  { value: 'fire', label: 'FIRE' },
  { value: 'beginners', label: 'Beginners' },
];

const CAT_BADGE = {
  general: 'bg-blue-500/20 text-blue-400',
  trading: 'bg-green-500/20 text-green-400',
  fire: 'bg-orange-500/20 text-orange-400',
  beginners: 'bg-purple-500/20 text-purple-400',
};

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function ThreadCard({ thread }) {
  return (
    <Link
      to={`/forum/thread/${thread.id}`}
      className="flex items-center gap-4 bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 hover:border-orange-500/50 transition-all"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {thread.pinned && <Pin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${CAT_BADGE[thread.category] || 'bg-slate-700 text-slate-400'}`}>
            {thread.category}
          </span>
        </div>
        <h3 className="text-white font-medium truncate hover:text-orange-400 transition-colors">
          {thread.title}
        </h3>
        <p className="text-slate-500 text-xs mt-1 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(thread.created_at)}
          </span>
          {thread.profiles && <span>by {thread.profiles.username}</span>}
        </p>
      </div>
      <div className="text-center flex-shrink-0 min-w-[3rem]">
        <div className="flex items-center gap-1 text-slate-400 text-sm justify-center">
          <MessageSquare className="w-4 h-4" />
          {thread.reply_count}
        </div>
        <div className="text-slate-600 text-xs mt-0.5">replies</div>
      </div>
    </Link>
  );
}

export default function ForumPage() {
  const { isAuthenticated } = useAuth();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      let query = supabase
        .from('forum_threads')
        .select('id, title, category, pinned, reply_count, view_count, created_at, profiles(username)')
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (category !== 'all') query = query.eq('category', category);
      const { data } = await query;
      setThreads(data || []);
      setLoading(false);
    };
    fetchThreads();
  }, [category]);

  return (
    <Layout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <MessageSquare className="w-7 h-7 text-orange-400" />
            <h1 className="text-3xl font-bold text-white">Community Forum</h1>
          </div>
          <p className="text-slate-400 ml-10">Discuss Bitcoin, FIRE strategies, and connect with the community.</p>
        </div>
        {isAuthenticated && (
          <Link
            to="/forum/new"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> New Thread
          </Link>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
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

      {/* Auth prompt for guests */}
      {!isAuthenticated && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-slate-300 text-sm">Join the community to start discussions and reply to threads.</p>
          <Link
            to="/signup"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          >
            Sign Up Free
          </Link>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="bg-slate-800 rounded-xl h-20 animate-pulse" />)}
        </div>
      ) : threads.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          No threads found.{' '}
          {isAuthenticated && (
            <Link to="/forum/new" className="text-orange-400 hover:underline">Be the first to post!</Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {threads.map(thread => <ThreadCard key={thread.id} thread={thread} />)}
        </div>
      )}
    </Layout>
  );
}
