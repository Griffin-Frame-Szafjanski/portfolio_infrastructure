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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="username" className="block mb-2 font-medium text-gray-900">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-gray-900"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 font-medium text-gray-900">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-gray-900"
            />
          </div>

          <button 
            type="submit" 
            className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm">Default credentials: admin / admin123</p>
        </div>
      </div>
    </div>
  );
}
