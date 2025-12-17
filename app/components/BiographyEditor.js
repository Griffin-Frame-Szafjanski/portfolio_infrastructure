'use client'

import { useState, useEffect } from 'react';

export default function BiographyEditor() {
  const [biography, setBiography] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/photo', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, profile_photo_url: data.url }));
        setMessage({ type: 'success', text: 'Photo uploaded successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Upload failed' });
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      setMessage({ type: 'error', text: 'Failed to upload photo' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ 
          ...prev, 
          resume_url: data.url,
          resume_pdf_url: data.url 
        }));
        setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Upload failed' });
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      setMessage({ type: 'error', text: 'Failed to upload resume' });
    } finally {
      setUploadingResume(false);
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
            <label>Profile Photo</label>
            <div className="upload-group">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
                className="file-input"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="file-label">
                {uploadingPhoto ? 'Uploading...' : 'Choose Photo'}
              </label>
              {formData.profile_photo_url && (
                <div className="preview-container">
                  <img src={formData.profile_photo_url} alt="Preview" className="preview-image" />
                </div>
              )}
            </div>
            <small className="form-help">Upload an image (JPEG, PNG, WebP, GIF - max 5MB) or enter URL below</small>
            <input
              type="text"
              name="profile_photo_url"
              value={formData.profile_photo_url}
              onChange={handleChange}
              className="form-input"
              style={{ marginTop: '8px' }}
              placeholder="Or paste image URL here"
            />
          </div>

          <div className="form-group">
            <label>Resume PDF</label>
            <div className="upload-group">
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
                className="file-input"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="file-label">
                {uploadingResume ? 'Uploading...' : 'Choose PDF'}
              </label>
              {formData.resume_url && (
                <a href={formData.resume_url} target="_blank" rel="noopener noreferrer" className="file-link">
                  View Current Resume
                </a>
              )}
            </div>
            <small className="form-help">Upload a PDF file (max 10MB) or enter URL below</small>
            <input
              type="text"
              name="resume_url"
              value={formData.resume_url}
              onChange={handleChange}
              className="form-input"
              style={{ marginTop: '8px' }}
              placeholder="Or paste PDF URL here"
            />
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

        :global(.dark) .message-success {
          background-color: #1e4620;
          color: #84e1bc;
          border: 1px solid #2d5a2e;
        }

        .message-error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        :global(.dark) .message-error {
          background-color: #4a1c1c;
          color: #f5a5a8;
          border: 1px solid #6b2c2c;
        }

        .form-section {
          background: var(--color-bg-alt);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
        }

        :global(.dark) .form-section {
          background: rgb(55 65 81);
        }

        .form-section h3 {
          margin: 0 0 var(--spacing-lg) 0;
          color: var(--color-text);
          font-size: 1.25rem;
        }

        :global(.dark) .form-section h3 {
          color: rgb(243 244 246);
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

        :global(.dark) .form-group label {
          color: rgb(229 231 235);
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
          background-color: white;
          color: #333;
        }

        :global(.dark) .form-input,
        :global(.dark) .form-textarea {
          background-color: rgb(31 41 55);
          border-color: rgb(75 85 99);
          color: rgb(243 244 246);
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

        :global(.dark) .form-help {
          color: rgb(156 163 175);
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

        .upload-group {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xs);
        }

        .file-input {
          display: none;
        }

        .file-label {
          display: inline-block;
          padding: var(--spacing-sm) var(--spacing-lg);
          background-color: var(--color-primary);
          color: white;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-size: 0.9rem;
          transition: var(--transition);
        }

        .file-label:hover {
          background-color: var(--color-primary-dark);
          transform: translateY(-1px);
        }

        .file-link {
          padding: var(--spacing-sm) var(--spacing-md);
          background-color: #f0f0f0;
          color: var(--color-primary);
          border-radius: var(--radius-md);
          text-decoration: none;
          font-size: 0.9rem;
          transition: var(--transition);
        }

        :global(.dark) .file-link {
          background-color: rgb(55 65 81);
          color: rgb(96 165 250);
        }

        .file-link:hover {
          background-color: #e0e0e0;
        }

        :global(.dark) .file-link:hover {
          background-color: rgb(75 85 99);
        }

        .preview-container {
          margin-top: var(--spacing-md);
        }

        .preview-image {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: var(--radius-md);
          border: 2px solid #e0e0e0;
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
