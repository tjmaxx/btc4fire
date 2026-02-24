import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { ArrowLeft } from 'lucide-react';

const CATEGORIES = [
  { value: 'general', label: 'General Discussion' },
  { value: 'trading', label: 'Trading & Markets' },
  { value: 'fire', label: 'FIRE & Investing' },
  { value: 'beginners', label: 'Beginners' },
];

export default function NewThreadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setSubmitting(true);
    setError('');

    const { data, error: err } = await supabase
      .from('forum_threads')
      .insert({ title: title.trim(), content: content.trim(), category, author_id: user.id })
      .select('id')
      .single();

    if (err) {
      setError('Failed to create thread. Please try again.');
      setSubmitting(false);
    } else {
      navigate(`/forum/thread/${data.id}`);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Link to="/forum" className="inline-flex items-center gap-1 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Forum
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Start a New Discussion</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="thread-category" className="block text-gray-700 dark:text-slate-300 text-sm font-medium mb-2">Category</label>
            <select
              id="thread-category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
            >
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="thread-title" className="block text-gray-700 dark:text-slate-300 text-sm font-medium mb-2">Title</label>
            <input
              id="thread-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What's your question or topic?"
              maxLength={200}
              className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
            <p className="text-gray-400 dark:text-slate-600 text-xs mt-1 text-right">{title.length}/200</p>
          </div>

          <div>
            <label htmlFor="thread-content" className="block text-gray-700 dark:text-slate-300 text-sm font-medium mb-2">Content</label>
            <textarea
              id="thread-content"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Share your thoughts, questions, or insights..."
              rows={8}
              className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors"
            />
          </div>

          {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {submitting ? 'Posting...' : 'Post Thread'}
            </button>
            <Link
              to="/forum"
              className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
