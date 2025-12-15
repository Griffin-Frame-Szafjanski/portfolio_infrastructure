'use client'

import { useState, useEffect } from 'react';

export default function BiographyEditor() {
  const [biography, setBiography] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    full_name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    linkedin_url: '',
    github_url: '',
    resume_url: '',
    resume_pdf_url: '',
    profile_photo_url: ''
  });

  useEffect(() => {
    fetchBiography();
  }, []);

  const fetchBiography = async () => {
    try {
      const response = await fetch('/api/biography');
      const data = await response.json();
      
      if (data.success && data.data) {
        setBiography(data.data);
        setFormData({
          full_name: data.data.full_name || '',
          title: data.data.title || '',
          bio: data.data.bio || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          location: data.data.location || '',
          linkedin_url: data.data.linkedin_url || '',
          github_url: data.data.github_url || '',
          resume_url: data.data.resume_url || '',
          resume_pdf_url: data.data.resume_pdf_url || '',
          profile_photo_url: data.data.profile_photo_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching biography:', error);
      setMessage({ type: 'error', text: 'Failed to load biography data' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/biography/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Biography updated successfully!' });
        setBiography(data.data);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update biography' });
      }
    } catch (error) {
      console.error('Error updating biography:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading biography...</div>;
  }

  return (
    <div className="editor-container">
      <form onSubmit={handleSubmit} className="editor-form">
        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="form-section">
          <h3>Personal Information</h3>
          
          <div className="form-group">
            <label htmlFor="full_name">Full Name *</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Professional Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="e.g., Full-Stack Developer"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Biography *</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              rows="6"
              className="form-textarea"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              placeholder="City, Country"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Social Links</h3>
          
          <div className="form-group">
            <label htmlFor="linkedin_url">LinkedIn URL</label>
            <input
              type="text"
              id="linkedin_url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              className="form-input"
              placeholder="https://linkedin.com/in/yourprofile"
            />
            <small className="form-help">Enter your full LinkedIn profile URL</small>
          </div>

          <div className="form-group">
            <label htmlFor="github_url">GitHub URL</label>
            <input
              type="text"
              id="github_url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              className="form-input"
              placeholder="https://github.com/yourusername"
            />
            <small className="form-help">Enter your full GitHub profile URL</small>
          </div>
        </div>

        <div className="form-section">
          <h3>Media & Files</h3>
          
          <div className="form-group">
            <label htmlFor="profile_photo_url">Profile Photo URL</label>
            <input
              type="url"
              id="profile_photo_url"
              name="profile_photo_url"
              value={formData.profile_photo_url}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/photo.jpg"
            />
            <small className="form-help">Direct link to your profile photo</small>
          </div>

          <div className="form-group">
            <label htmlFor="resume_url">Resume Download URL</label>
            <input
              type="url"
              id="resume_url"
              name="resume_url"
              value={formData.resume_url}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/resume.pdf"
            />
            <small className="form-help">Direct link for resume download button</small>
          </div>

          <div className="form-group">
            <label htmlFor="resume_pdf_url">Resume PDF Viewer URL</label>
            <input
              type="url"
              id="resume_pdf_url"
              name="resume_pdf_url"
              value={formData.resume_pdf_url}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/resume.pdf"
            />
            <small className="form-help">Direct link to PDF for embedded viewer on biography page</small>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            onClick={fetchBiography}
            className="btn btn-secondary"
            disabled={saving}
          >
            Reset
          </button>
        </div>
      </form>

      <style jsx>{`
        .editor-container {
          max-width: 800px;
        }

        .editor-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }

        .message {
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-md);
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

        .form-section {
          background: var(--color-bg-alt);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
        }

        .form-section h3 {
          margin: 0 0 var(--spacing-lg) 0;
          color: var(--color-text);
          font-size: 1.25rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }

        .form-group {
          margin-bottom: var(--spacing-md);
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        .form-group label {
          display: block;
          margin-bottom: var(--spacing-xs);
          font-weight: 500;
          color: var(--color-text);
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          border: 2px solid #e0e0e0;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-family: inherit;
          transition: var(--transition);
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
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
          padding-top: var(--spacing-lg);
        }

        .btn-lg {
          padding: var(--spacing-md) var(--spacing-xl);
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
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
