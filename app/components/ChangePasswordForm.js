'use client'

import { useState } from 'react';

export default function ChangePasswordForm() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newHash, setNewHash] = useState('');
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setNewHash('');

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    // Validate password strength
    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Password hash generated! Follow the instructions below to complete the change.' 
        });
        setNewHash(data.newPasswordHash);
        
        // Clear form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch (error) {
      console.error('Change password error:', error);
      setMessage({ type: 'error', text: 'An error occurred while changing password' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newHash);
    setMessage({ type: 'success', text: 'Hash copied to clipboard!' });
  };

  if (!showForm) {
    return (
      <div className="change-password-trigger">
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-secondary"
        >
          🔐 Change Password
        </button>

        <style jsx>{`
          .change-password-trigger {
            margin-top: var(--spacing-md);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="change-password-form">
      <div className="form-header">
        <h3>Change Admin Password</h3>
        <button onClick={() => setShowForm(false)} className="close-button">
          ✕
        </button>
      </div>

      {message.text && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      {!newHash ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password *</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="form-input"
              autoComplete="current-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password *</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength="8"
              className="form-input"
              autoComplete="new-password"
            />
            <small className="form-help">Must be at least 8 characters long</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="8"
              className="form-input"
              autoComplete="new-password"
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Generate New Password Hash'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowForm(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="hash-result">
          <div className="success-icon">✅</div>
          <h4>Password Hash Generated Successfully!</h4>
          
          <div className="instructions">
            <p><strong>Follow these steps to complete the password change:</strong></p>
            <ol>
              <li>Copy the hash below (click the copy button)</li>
              <li><strong>For Production (Vercel):</strong>
                <ul>
                  <li>Go to Vercel Dashboard → Your Project</li>
                  <li>Navigate to Settings → Environment Variables</li>
                  <li>Find ADMIN_PASSWORD and click Edit</li>
                  <li>Paste the new hash and save</li>
                  <li>Redeploy your application</li>
                </ul>
              </li>
              <li><strong>For Local Development:</strong>
                <ul>
                  <li>Open your <code>.env.local</code> file</li>
                  <li>Update: <code>ADMIN_PASSWORD=&lt;paste hash here&gt;</code></li>
                  <li>Save the file and restart your dev server</li>
                </ul>
              </li>
            </ol>
          </div>

          <div className="hash-box">
            <div className="hash-label">New Password Hash:</div>
            <div className="hash-value">{newHash}</div>
            <button 
              onClick={copyToClipboard}
              className="btn btn-primary btn-sm copy-button"
            >
              📋 Copy to Clipboard
            </button>
          </div>

          <div className="warning-box">
            <strong>⚠️ Important:</strong>
            <ul>
              <li>Save this hash securely</li>
              <li>Never share this hash publicly</li>
              <li>Your old password will stop working after you update the environment variable</li>
              <li>Make sure to update both production and local environments</li>
            </ul>
          </div>

          <button 
            onClick={() => {
              setShowForm(false);
              setNewHash('');
              setMessage({ type: '', text: '' });
            }}
            className="btn btn-secondary"
          >
            Done
          </button>
        </div>
      )}

      <style jsx>{`
        .change-password-form {
          background: white;
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          max-width: 600px;
          margin: var(--spacing-xl) 0;
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-md);
          border-bottom: 2px solid #e0e0e0;
        }

        .form-header h3 {
          margin: 0;
          font-size: 1.25rem;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .close-button:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .message {
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-lg);
        }

        .message-success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message-error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .form-group {
          margin-bottom: var(--spacing-lg);
        }

        .form-group label {
          display: block;
          margin-bottom: var(--spacing-xs);
          font-weight: 500;
          color: var(--color-text);
        }

        .form-input {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          border: 2px solid #e0e0e0;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-family: inherit;
          transition: var(--transition);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .form-help {
          display: block;
          margin-top: var(--spacing-xs);
          font-size: 0.875rem;
          color: var(--color-text-light);
        }

        .form-actions {
          display: flex;
          gap: var(--spacing-md);
          margin-top: var(--spacing-xl);
        }

        .hash-result {
          text-align: center;
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-md);
        }

        .hash-result h4 {
          margin: 0 0 var(--spacing-lg) 0;
          color: #155724;
        }

        .instructions {
          text-align: left;
          background: #f8f9fa;
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-lg);
        }

        .instructions p {
          margin: 0 0 var(--spacing-sm) 0;
        }

        .instructions ol {
          margin: var(--spacing-sm) 0;
          padding-left: var(--spacing-lg);
        }

        .instructions li {
          margin: var(--spacing-xs) 0;
        }

        .instructions ul {
          margin: var(--spacing-xs) 0;
          padding-left: var(--spacing-lg);
        }

        .instructions code {
          background: #e9ecef;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
        }

        .hash-box {
          background: #f8f9fa;
          border: 2px solid #e0e0e0;
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          margin: var(--spacing-lg) 0;
        }

        .hash-label {
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: #374151;
        }

        .hash-value {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: var(--radius-sm);
          padding: var(--spacing-md);
          font-family: 'Courier New', monospace;
          font-size: 0.75rem;
          word-break: break-all;
          margin-bottom: var(--spacing-md);
          color: #1f2937;
        }

        .copy-button {
          margin-top: var(--spacing-sm);
        }

        .warning-box {
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          margin: var(--spacing-lg) 0;
          text-align: left;
        }

        .warning-box strong {
          display: block;
          margin-bottom: var(--spacing-xs);
          color: #856404;
        }

        .warning-box ul {
          margin: var(--spacing-xs) 0 0 0;
          padding-left: var(--spacing-lg);
        }

        .warning-box li {
          margin: var(--spacing-xs) 0;
          color: #856404;
        }

        .btn-sm {
          padding: var(--spacing-xs) var(--spacing-md);
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .change-password-form {
            padding: var(--spacing-md);
          }

          .form-actions {
            flex-direction: column;
          }

          .form-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
