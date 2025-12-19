'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BiographyEditor from '@/app/components/BiographyEditor';
import ProjectsManager from '@/app/components/ProjectsManager';
import MessagesManager from '@/app/components/MessagesManager';
import ChangePasswordForm from '@/app/components/ChangePasswordForm';
import CategoriesManager from '@/app/components/CategoriesManager';
import SkillsManager from '@/app/components/SkillsManager';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalSkills: 0,
    unreadMessages: 0,
    readMessages: 0
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Fetch projects
      const projectsRes = await fetch('/api/projects');
      const projectsData = await projectsRes.json();
      
      // Fetch skills
      const skillsRes = await fetch('/api/skills');
      const skillsData = await skillsRes.json();
      
      // Fetch messages
      const messagesRes = await fetch('/api/admin/messages');
      const messagesData = await messagesRes.json();
      
      const totalMessages = messagesData.data?.length || 0;
      const unread = messagesData.unreadCount || 0;
      const read = totalMessages - unread;
      
      setStats({
        totalProjects: projectsData.data?.length || 0,
        totalSkills: Array.isArray(skillsData) ? skillsData.length : 0,
        unreadMessages: unread,
        readMessages: read
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

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
    <>
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
              className={`admin-nav-item ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Skills
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Categories
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
            <a
              href="/admin/audit-logs"
              className="admin-nav-item"
              style={{ textDecoration: 'none' }}
            >
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Audit Logs
            </a>
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
                  <p className="stat-number">{stats.totalProjects}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Skills</h3>
                  <p className="stat-number">{stats.totalSkills}</p>
                </div>
                <div className="stat-card">
                  <h3>Unread Messages</h3>
                  <p className="stat-number">{stats.unreadMessages}</p>
                </div>
                <div className="stat-card">
                  <h3>Read Messages</h3>
                  <p className="stat-number">{stats.readMessages}</p>
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
              
              <ChangePasswordForm />
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

          {activeTab === 'skills' && (
            <div className="admin-section">
              <h2>Skills Management</h2>
              <p>Add, edit, or remove skills and assign them to categories.</p>
              <SkillsManager />
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="admin-section">
              <h2>Categories Management</h2>
              <p>Manage skill categories to organize your technologies and tools.</p>
              <CategoriesManager />
            </div>
          )}
        </main>
      </div>
    </div>

      <style jsx>{`
        .admin-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s;
        }

        .admin-container {
          min-height: 100vh;
          background-color: #f5f5f5;
        }

        .admin-header {
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
          color: #667eea;
          margin: 0;
        }

        .admin-user-menu {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .admin-username {
          font-weight: 500;
          color: #6b7280;
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
          border-radius: 12px;
          padding: 1.5rem;
          height: fit-content;
          position: sticky;
          top: calc(64px + 1.5rem);
        }

        .admin-nav {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: none;
          background: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .admin-nav-item:hover {
          background-color: #f5f5f5;
          color: #1f2937;
        }

        .admin-nav-item.active {
          background-color: #667eea;
          color: white;
        }

        .admin-main {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          min-height: 500px;
        }

        .admin-section h2 {
          font-size: 2rem;
          margin-bottom: 0.75rem;
          color: #1f2937;
        }

        .admin-section > p {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .admin-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .stat-card {
          background: #f5f5f5;
          padding: 1.5rem;
          border-radius: 10px;
        }

        .stat-card h3 {
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #667eea;
          margin: 0;
        }

        .admin-welcome {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 12px;
        }

        .admin-welcome h3 {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .admin-welcome p {
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }

        .quick-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .admin-placeholder {
          background: #f5f5f5;
          padding: 2rem;
          border-radius: 10px;
          text-align: center;
          color: #6b7280;
        }

        .admin-placeholder p {
          margin-bottom: 0.75rem;
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
    </>
  );
}
