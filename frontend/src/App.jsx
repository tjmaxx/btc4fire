import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import BlogPage from './pages/BlogPage';
import ArticlePage from './pages/ArticlePage';
import ForumPage from './pages/ForumPage';
import ThreadPage from './pages/ThreadPage';
import NewThreadPage from './pages/NewThreadPage';
import ResourcesPage from './pages/ResourcesPage';
import ProfilePage from './pages/ProfilePage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-slate-400 text-lg">Loading...</div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/"                  element={<HomePage />} />
          <Route path="/login"             element={<LoginPage />} />
          <Route path="/signup"            element={<SignupPage />} />
          <Route path="/blog"              element={<BlogPage />} />
          <Route path="/blog/:slug"        element={<ArticlePage />} />
          <Route path="/forum"             element={<ForumPage />} />
          <Route path="/forum/thread/:id"  element={<ThreadPage />} />
          <Route path="/resources"         element={<ResourcesPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />

          {/* Protected */}
          <Route path="/forum/new" element={<ProtectedRoute><NewThreadPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
