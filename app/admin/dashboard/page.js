'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BiographyEditor from '@/app/components/BiographyEditor';
import ProjectsManager from '@/app/components/ProjectsManager';
import MessagesManager from '@/app/components/MessagesManager';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/me');
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading">Loading admin dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="admin-container">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-logo">Portfolio Admin</h1>
          <div className="admin-user-menu">
            <span className="admin-username">{user.username}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-layout">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <button
              className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Overview
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'biography' ? 'active' : ''}`}
              onClick={() => setActiveTab('biography')}
            >
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Biography
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Projects
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Messages
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main">
          {activeTab === 'overview' && (
            <div className="admin-section">
              <h2>Dashboard Overview</h2>
              <div className="admin-stats">
                <div className="stat-card">
                  <h3>Total Projects</h3>
                  <p className="stat-number">3</p>
                </div>
                <div className="stat-card">
                  <h3>Profile Views</h3>
                  <p className="stat-number">-</p>
                </div>
                <div className="stat-card">
                  <h3>Last Updated</h3>
                  <p className="stat-number">Today</p>
                </div>
              </div>
              <div className="admin-welcome">
                <h3>Welcome back, {user.username}! 👋</h3>
                <p>Use the sidebar to manage your portfolio content.</p>
                <div className="quick-actions">
                  <button onClick={() => setActiveTab('biography')} className="btn btn-primary">
                    Edit Biography
                  </button>
                  <button onClick={() => setActiveTab('projects')} className="btn btn-primary">
                    Manage Projects
                  </button>
                  <a href="/" target="_blank" className="btn btn-secondary">
                    View Live Site
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'biography' && (
            <div className="admin-section">
              <h2>Biography Management</h2>
              <p>Edit your professional biography and contact information.</p>
              <BiographyEditor />
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="admin-section">
              <h2>Projects Management</h2>
              <p>Add, edit, or remove portfolio projects.</p>
              <ProjectsManager />
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="admin-section">
              <h2>Contact Messages</h2>
              <p>View and manage messages from the contact form.</p>
              <MessagesManager />
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .admin-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-container {
          min-height: 100vh;
          background-color: var(--color-bg-alt);
        }

        .admin-header {
          background: white;
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .admin-header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: var(--spacing-md) var(--spacing-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .admin-logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary);
          margin: 0;
        }

        .admin-user-menu {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .admin-username {
          font-weight: 500;
          color: var(--color-text-light);
        }

        .admin-layout {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: var(--spacing-lg);
          padding: var(--spacing-lg);
        }

        .admin-sidebar {
          background: white;
          border-radius: var(--radius-xl);
          padding: var(--spacing-lg);
          height: fit-content;
          position: sticky;
          top: calc(64px + var(--spacing-lg));
        }

        .admin-nav {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          border: none;
          background: none;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-weight: 500;
          color: var(--color-text-light);
          cursor: pointer;
          transition: var(--transition);
          text-align: left;
        }

        .admin-nav-item:hover {
          background-color: var(--color-bg-alt);
          color: var(--color-text);
        }

        .admin-nav-item.active {
          background-color: var(--color-primary);
          color: white;
        }

        .admin-main {
          background: white;
          border-radius: var(--radius-xl);
          padding: var(--spacing-2xl);
          min-height: 500px;
        }

        .admin-section h2 {
          font-size: 2rem;
          margin-bottom: var(--spacing-sm);
          color: var(--color-text);
        }

        .admin-section > p {
          color: var(--color-text-light);
          margin-bottom: var(--spacing-xl);
        }

        .admin-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .stat-card {
          background: var(--color-bg-alt);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
        }

        .stat-card h3 {
          font-size: 0.9rem;
          color: var(--color-text-light);
          margin-bottom: var(--spacing-xs);
          font-weight: 500;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-primary);
          margin: 0;
        }

        .admin-welcome {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: var(--spacing-xl);
          border-radius: var(--radius-xl);
        }

        .admin-welcome h3 {
          font-size: 1.5rem;
          margin-bottom: var(--spacing-sm);
        }

        .admin-welcome p {
          margin-bottom: var(--spacing-lg);
          opacity: 0.9;
        }

        .quick-actions {
          display: flex;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }

        .admin-placeholder {
          background: var(--color-bg-alt);
          padding: var(--spacing-2xl);
          border-radius: var(--radius-lg);
          text-align: center;
          color: var(--color-text-light);
        }

        .admin-placeholder p {
          margin-bottom: var(--spacing-sm);
        }

        @media (max-width: 768px) {
          .admin-layout {
            grid-template-columns: 1fr;
          }

          .admin-sidebar {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}
