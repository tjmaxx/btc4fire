import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Shield, FileText, MessageSquare, BookOpen, Trash2, Eye, EyeOff, Pin } from 'lucide-react';

const TABS = [
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'threads', label: 'Forum', icon: MessageSquare },
  { id: 'resources', label: 'Resources', icon: BookOpen },
];

// ── Articles tab ──────────────────────────────────────────────────────────────
function ArticlesTab() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('articles')
      .select('id, title, slug, published, created_at, profiles(username)')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setArticles(data || []); setLoading(false); });
  }, []);

  const togglePublish = async (id, current) => {
    await supabase.from('articles').update({ published: !current }).eq('id', id);
    setArticles(prev => prev.map(a => a.id === id ? { ...a, published: !current } : a));
  };

  const deleteArticle = async (id) => {
    if (!confirm('Delete this article? This cannot be undone.')) return;
    await supabase.from('articles').delete().eq('id', id);
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  if (loading) return <div className="h-32 bg-slate-700 rounded animate-pulse" />;

  return (
    <div className="space-y-2">
      {articles.length === 0 && <p className="text-slate-500 text-sm">No articles.</p>}
      {articles.map(a => (
        <div key={a.id} className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{a.title}</p>
            <p className="text-slate-500 text-xs mt-0.5">
              by {a.profiles?.username || '—'} ·{' '}
              {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${a.published ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
            {a.published ? 'Published' : 'Draft'}
          </span>
          <button
            onClick={() => togglePublish(a.id, a.published)}
            title={a.published ? 'Unpublish' : 'Publish'}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            {a.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => deleteArticle(a.id)}
            title="Delete"
            className="text-slate-500 hover:text-red-400 transition-colors p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Forum tab ─────────────────────────────────────────────────────────────────
function ThreadsTab() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('forum_threads')
      .select('id, title, is_pinned, is_locked, created_at, profiles(username)')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }) => { setThreads(data || []); setLoading(false); });
  }, []);

  const togglePin = async (id, current) => {
    await supabase.from('forum_threads').update({ is_pinned: !current }).eq('id', id);
    setThreads(prev => prev.map(t => t.id === id ? { ...t, is_pinned: !current } : t));
  };

  const toggleLock = async (id, current) => {
    await supabase.from('forum_threads').update({ is_locked: !current }).eq('id', id);
    setThreads(prev => prev.map(t => t.id === id ? { ...t, is_locked: !current } : t));
  };

  const deleteThread = async (id) => {
    if (!confirm('Delete this thread? This cannot be undone.')) return;
    await supabase.from('forum_threads').delete().eq('id', id);
    setThreads(prev => prev.filter(t => t.id !== id));
  };

  if (loading) return <div className="h-32 bg-slate-700 rounded animate-pulse" />;

  return (
    <div className="space-y-2">
      {threads.length === 0 && <p className="text-slate-500 text-sm">No threads.</p>}
      {threads.map(t => (
        <div key={t.id} className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate flex items-center gap-2">
              {t.is_pinned && <Pin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />}
              {t.title}
            </p>
            <p className="text-slate-500 text-xs mt-0.5">
              by {t.profiles?.username || '—'} ·{' '}
              {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {t.is_locked && <span className="ml-2 text-red-400">Locked</span>}
            </p>
          </div>
          <button
            onClick={() => togglePin(t.id, t.is_pinned)}
            title={t.is_pinned ? 'Unpin' : 'Pin'}
            className={`transition-colors p-1 ${t.is_pinned ? 'text-orange-400' : 'text-slate-500 hover:text-orange-400'}`}
          >
            <Pin className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleLock(t.id, t.is_locked)}
            title={t.is_locked ? 'Unlock' : 'Lock'}
            className={`transition-colors p-1 text-xs font-medium px-2 py-1 rounded ${t.is_locked ? 'bg-red-500/20 text-red-400' : 'text-slate-500 hover:text-red-400'}`}
          >
            {t.is_locked ? 'Unlock' : 'Lock'}
          </button>
          <button
            onClick={() => deleteThread(t.id)}
            title="Delete"
            className="text-slate-500 hover:text-red-400 transition-colors p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Resources tab ─────────────────────────────────────────────────────────────
function ResourcesTab() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('resources')
      .select('id, title, url, approved, created_at, profiles(username)')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setResources(data || []); setLoading(false); });
  }, []);

  const toggleApprove = async (id, current) => {
    await supabase.from('resources').update({ approved: !current }).eq('id', id);
    setResources(prev => prev.map(r => r.id === id ? { ...r, approved: !current } : r));
  };

  const deleteResource = async (id) => {
    if (!confirm('Delete this resource?')) return;
    await supabase.from('resources').delete().eq('id', id);
    setResources(prev => prev.filter(r => r.id !== id));
  };

  if (loading) return <div className="h-32 bg-slate-700 rounded animate-pulse" />;

  return (
    <div className="space-y-2">
      {resources.length === 0 && <p className="text-slate-500 text-sm">No resources.</p>}
      {resources.map(r => (
        <div key={r.id} className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{r.title}</p>
            <p className="text-slate-500 text-xs mt-0.5 truncate">
              {r.url} · by {r.profiles?.username || '—'}
            </p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${r.approved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            {r.approved ? 'Approved' : 'Pending'}
          </span>
          <button
            onClick={() => toggleApprove(r.id, r.approved)}
            title={r.approved ? 'Revoke' : 'Approve'}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            {r.approved ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => deleteResource(r.id)}
            title="Delete"
            className="text-slate-500 hover:text-red-400 transition-colors p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Main admin page ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const { profile, loading } = useAuth();
  const [tab, setTab] = useState('articles');

  if (loading) {
    return (
      <Layout>
        <div className="h-32 bg-slate-800 rounded animate-pulse" />
      </Layout>
    );
  }

  if (!profile?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="mb-6 flex items-center gap-3">
        <Shield className="w-6 h-6 text-orange-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage content and community</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1 mb-6 w-fit">
        {TABS.map(({ id, label, icon }) => {
          const TabIcon = icon;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === id ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {tab === 'articles'  && <ArticlesTab />}
      {tab === 'threads'   && <ThreadsTab />}
      {tab === 'resources' && <ResourcesTab />}
    </Layout>
  );
}
