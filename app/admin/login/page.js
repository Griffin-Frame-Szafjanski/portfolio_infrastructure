'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to admin dashboard
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
        if (data.attemptsRemaining) {
          setError(`${data.error} (${data.attemptsRemaining} attempts remaining)`);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h1>Admin Login</h1>
          <p>Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="admin-error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>Default credentials: admin / admin123</p>
        </div>
      </div>

      <style jsx>{`
        .admin-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: var(--spacing-md);
        }

        .admin-login-box {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          padding: var(--spacing-2xl);
          max-width: 400px;
          width: 100%;
        }

        .admin-login-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .admin-login-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: var(--spacing-xs);
        }

        .admin-login-header p {
          color: var(--color-text-light);
          font-size: 0.95rem;
        }

        .admin-login-form {
          margin-bottom: var(--spacing-lg);
        }

        .form-group {
          margin-bottom: var(--spacing-md);
        }

        .form-group label {
          display: block;
          margin-bottom: var(--spacing-xs);
          font-weight: 500;
          color: var(--color-text);
        }

        .form-group input {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 1rem;
          transition: var(--transition);
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .form-group input:disabled {
          background-color: var(--color-bg-alt);
          cursor: not-allowed;
        }

        .admin-error-message {
          background-color: #fee;
          color: #c33;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-md);
          border: 1px solid #fcc;
        }

        .btn-block {
          width: 100%;
        }

        .admin-login-footer {
          text-align: center;
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--color-border);
        }

        .admin-login-footer p {
          color: var(--color-text-light);
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}
