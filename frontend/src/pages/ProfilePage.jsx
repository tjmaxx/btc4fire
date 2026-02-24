import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import Layout from '../components/Layout';
import { ArrowLeft, MessageSquare, BookOpen, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [threads, setThreads] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileData) {
        setProfile(profileData);
        const [threadsRes, articlesRes] = await Promise.all([
          supabase
            .from('forum_threads')
            .select('id, title, category, reply_count, created_at')
            .eq('author_id', profileData.id)
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('articles')
            .select('id, title, slug, category, created_at')
            .eq('author_id', profileData.id)
            .eq('published', true)
            .order('created_at', { ascending: false })
            .limit(5),
        ]);
        setThreads(threadsRes.data || []);
        setArticles(articlesRes.data || []);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse max-w-2xl mx-auto space-y-4">
          <div className="h-28 bg-gray-100 dark:bg-slate-800 rounded-2xl" />
          <div className="h-48 bg-gray-100 dark:bg-slate-800 rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="text-center py-24">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">User Not Found</h2>
          <Link to="/forum" className="text-orange-400 hover:underline">← Back to Forum</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Profile header */}
        <div className="bg-gradient-to-r from-orange-500/10 to-blue-500/10 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-2xl font-bold flex-shrink-0">
              {profile.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.display_name || profile.username}</h1>
              <p className="text-gray-500 dark:text-slate-400 text-sm">@{profile.username}</p>
              <div className="flex items-center gap-1 mt-1 text-gray-400 dark:text-slate-500 text-xs">
                <Calendar className="w-3 h-3" />
                Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
          {profile.bio && (
            <p className="text-gray-700 dark:text-slate-300 mt-4 leading-relaxed">{profile.bio}</p>
          )}
        </div>

        {/* Recent threads */}
        {threads.length > 0 && (
          <div className="mb-6">
            <h2 className="text-gray-900 dark:text-white font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-orange-400" /> Recent Forum Threads
            </h2>
            <div className="space-y-2">
              {threads.map(thread => (
                <Link
                  key={thread.id}
                  to={`/forum/thread/${thread.id}`}
                  className="flex items-center justify-between bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-3 hover:border-orange-500/50 transition-all"
                >
                  <span className="text-gray-700 dark:text-slate-300 text-sm truncate hover:text-gray-900 dark:hover:text-white">{thread.title}</span>
                  <span className="text-gray-400 dark:text-slate-500 text-xs ml-3 flex-shrink-0 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> {thread.reply_count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent articles */}
        {articles.length > 0 && (
          <div className="mb-6">
            <h2 className="text-gray-900 dark:text-white font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-orange-400" /> Published Articles
            </h2>
            <div className="space-y-2">
              {articles.map(article => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="flex items-center justify-between bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-3 hover:border-orange-500/50 transition-all"
                >
                  <span className="text-gray-700 dark:text-slate-300 text-sm truncate hover:text-gray-900 dark:hover:text-white">{article.title}</span>
                  <span className="text-gray-400 dark:text-slate-500 text-xs ml-3 flex-shrink-0">{article.category}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {threads.length === 0 && articles.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-slate-500">No activity yet.</div>
        )}
      </div>
    </Layout>
  );
}
