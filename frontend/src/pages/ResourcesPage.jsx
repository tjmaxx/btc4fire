import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { ExternalLink, BookOpen, Wrench, Video, Play, FileText, Plus, X } from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'book', label: 'Books' },
  { value: 'tool', label: 'Tools' },
  { value: 'course', label: 'Courses' },
  { value: 'video', label: 'Videos' },
  { value: 'article', label: 'Articles' },
];

const CAT_META = {
  book:    { icon: BookOpen, color: 'bg-purple-500/20 text-purple-400' },
  tool:    { icon: Wrench,   color: 'bg-blue-500/20 text-blue-400' },
  video:   { icon: Play,     color: 'bg-red-500/20 text-red-400' },
  course:  { icon: Video,    color: 'bg-green-500/20 text-green-400' },
  article: { icon: FileText, color: 'bg-orange-500/20 text-orange-400' },
};

function ResourceCard({ resource }) {
  const meta = CAT_META[resource.category] || { icon: FileText, color: 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400' };
  const Icon = meta.icon;

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 hover:border-orange-500/50 transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="w-4 h-4 text-gray-500 dark:text-slate-400 flex-shrink-0" />
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.color}`}>
              {resource.category}
            </span>
          </div>
          <h3 className="text-gray-900 dark:text-white font-semibold group-hover:text-orange-400 transition-colors mb-1">
            {resource.title}
          </h3>
          {resource.description && (
            <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">{resource.description}</p>
          )}
          {resource.tags?.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-2">
              {resource.tags.map(tag => (
                <span key={tag} className="bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400 text-xs px-1.5 py-0.5 rounded">{tag}</span>
              ))}
            </div>
          )}
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400 dark:text-slate-600 group-hover:text-orange-400 flex-shrink-0 mt-1 transition-colors" />
      </div>
    </a>
  );
}

const EMPTY_FORM = { title: '', description: '', url: '', category: 'tool', tags: '' };

export default function ResourcesPage() {
  const { isAuthenticated, user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      let query = supabase.from('resources').select('*').order('created_at', { ascending: false });
      if (category !== 'all') query = query.eq('category', category);
      const { data } = await query;
      setResources(data || []);
      setLoading(false);
    };
    fetchResources();
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      setFormError('Title and URL are required.');
      return;
    }
    setSubmitting(true);
    setFormError('');

    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const { data, error } = await supabase
      .from('resources')
      .insert({ ...form, tags, author_id: user.id })
      .select()
      .single();

    if (error) {
      setFormError('Failed to submit. Please try again.');
    } else {
      setResources(prev => [data, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    }
    setSubmitting(false);
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BookOpen className="w-7 h-7 text-orange-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resources</h1>
          </div>
          <p className="text-gray-500 dark:text-slate-400 ml-10">Curated tools, books, and resources for your Bitcoin & FIRE journey.</p>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors self-start sm:self-auto"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'Submit Resource'}
          </button>
        )}
      </div>

      {/* Submit form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 mb-6 space-y-3">
          <h3 className="text-gray-900 dark:text-white font-semibold mb-1">Submit a Resource</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Title *"
              aria-label="Resource title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              required
            />
            <input
              type="url"
              placeholder="URL *"
              aria-label="Resource URL"
              value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              required
            />
          </div>
          <textarea
            placeholder="Description"
            aria-label="Resource description"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={2}
            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={form.category}
              aria-label="Resource category"
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors"
            >
              {CATEGORIES.filter(c => c.value !== 'all').map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              aria-label="Tags"
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          {formError && <p role="alert" className="text-red-400 text-sm">{formError}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}

      {/* Category filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === cat.value ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="bg-gray-100 dark:bg-slate-800 rounded-xl h-28 animate-pulse" />)}
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-slate-500">No resources found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map(resource => <ResourceCard key={resource.id} resource={resource} />)}
        </div>
      )}
    </Layout>
  );
}
