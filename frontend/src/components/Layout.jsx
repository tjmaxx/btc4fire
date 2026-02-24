import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-gray-200 dark:border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-gray-400 dark:text-slate-500 text-sm">© 2025 BTC4Fire — Not financial advice. Always DYOR.</div>
          <div className="flex gap-6 text-gray-400 dark:text-slate-600 text-sm">
            <a href="/blog" className="hover:text-gray-600 dark:hover:text-slate-400 transition-colors">Blog</a>
            <a href="/forum" className="hover:text-gray-600 dark:hover:text-slate-400 transition-colors">Forum</a>
            <a href="/resources" className="hover:text-gray-600 dark:hover:text-slate-400 transition-colors">Resources</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
