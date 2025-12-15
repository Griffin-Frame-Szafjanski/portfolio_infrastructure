'use client'

import { useState, useEffect } from 'react';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    long_description: '',
    technologies: '',
    project_url: '',
    github_url: '',
    image_url: '',
    video_url: '',
    pdf_url: '',
    pdf_file_key: '',
    display_order: 0,
    featured: false
  });
  const [uploadingPDF, setUploadingPDF] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setMessage({ type: 'error', text: 'Failed to load projects' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      long_description: '',
      technologies: '',
      project_url: '',
      github_url: '',
      image_url: '',
      video_url: '',
      pdf_url: '',
      pdf_file_key: '',
      display_order: 0,
      featured: false
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      long_description: project.long_description || '',
      technologies: project.technologies || project.tech_stack || '',
      project_url: project.project_url || '',
      github_url: project.github_url || '',
      image_url: project.image_url || '',
      video_url: project.video_url || '',
      pdf_url: project.pdf_url || '',
      pdf_file_key: project.pdf_file_key || '',
      display_order: project.display_order || 0,
      featured: project.featured || false
    });
    setShowForm(true);
    setMessage({ type: '', text: '' });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Please select a PDF file' });
      return;
    }

    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'PDF file must be less than 20MB' });
      return;
    }

    setUploadingPDF(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/project-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          pdf_url: data.url,
          pdf_file_key: data.fileKey
        }));
        setMessage({ type: 'success', text: 'PDF uploaded successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'PDF upload failed' });
      }
    } catch (error) {
      console.error('PDF upload error:', error);
      setMessage({ type: 'error', text: 'Failed to upload PDF' });
    } finally {
      setUploadingPDF(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const url = editingProject 
        ? `/api/projects/${editingProject.id}`
        : '/api/projects';
      
      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: editingProject ? 'Project updated successfully!' : 'Project created successfully!' 
        });
        await fetchProjects();
        resetForm();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save project' });
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    }
  };

  const handleDelete = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Project deleted successfully!' });
        await fetchProjects();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete project' });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setMessage({ type: 'error', text: 'An error occurred while deleting' });
    }
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="projects-manager">
      {message.text && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      {!showForm ? (
        <>
          <div className="manager-header">
            <div>
              <h3>Your Projects ({projects.length})</h3>
              <p>Manage your portfolio projects</p>
            </div>
            <button 
              onClick={() => setShowForm(true)} 
              className="btn btn-primary"
            >
              + Add New Project
            </button>
          </div>

          <div className="projects-list">
            {projects.length === 0 ? (
              <div className="empty-state">
                <p>No projects yet. Add your first project to get started!</p>
              </div>
            ) : (
              projects.map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-info">
                    <h4>{project.title}</h4>
                    <p>{project.description}</p>
                    <div className="project-meta">
                      <span className="tech-badge">{project.technologies || project.tech_stack}</span>
                      {project.featured && <span className="featured-badge">⭐ Featured</span>}
                    </div>
                  </div>
                  <div className="project-actions">
                    <button 
                      onClick={() => handleEdit(project)}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="project-form-container">
          <div className="form-header">
            <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
            <button onClick={resetForm} className="btn btn-secondary">
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="project-form">
            <div className="form-section">
              <h4>Basic Information</h4>
              
              <div className="form-group">
                <label htmlFor="title">Project Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Short Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="form-textarea"
                  placeholder="Brief overview of the project..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="long_description">Detailed Description</label>
                <textarea
                  id="long_description"
                  name="long_description"
                  value={formData.long_description}
                  onChange={handleChange}
                  rows="6"
                  className="form-textarea"
                  placeholder="Detailed project information..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="technologies">Technologies Used</label>
                <input
                  type="text"
                  id="technologies"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., React, Node.js, PostgreSQL"
                />
              </div>
            </div>

            <div className="form-section">
              <h4>Links & Media</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="project_url">Project URL</label>
                  <input
                    type="url"
                    id="project_url"
                    name="project_url"
                    value={formData.project_url}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="github_url">GitHub URL</label>
                  <input
                    type="url"
                    id="github_url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="image_url">Project Image URL</label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-group">
                <label htmlFor="video_url">Video Demo URL</label>
                <input
                  type="url"
                  id="video_url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="pdf_upload">Project PDF Documentation</label>
                <input
                  type="file"
                  id="pdf_upload"
                  accept="application/pdf"
                  onChange={handlePDFUpload}
                  disabled={uploadingPDF}
                  className="form-input"
                />
                <small className="form-help">
                  {uploadingPDF ? 'Uploading PDF...' : 'Upload a PDF file (max 20MB)'}
                </small>
                {formData.pdf_url && (
                  <div className="uploaded-file-info">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <span>PDF uploaded</span>
                    <a href={formData.pdf_url} target="_blank" rel="noopener noreferrer">View</a>
                  </div>
                )}
              </div>
            </div>

            <div className="form-section">
              <h4>Display Settings</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="display_order">Display Order</label>
                  <input
                    type="number"
                    id="display_order"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                  />
                  <small className="form-help">Lower numbers appear first</small>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                    />
                    <span>Featured Project</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-lg">
                {editingProject ? 'Update Project' : 'Create Project'}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        .projects-manager {
          max-width: 1000px;
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

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xl);
          padding-bottom: var(--spacing-lg);
          border-bottom: 2px solid var(--color-bg-alt);
        }

        .manager-header h3 {
          margin: 0 0 var(--spacing-xs) 0;
          font-size: 1.5rem;
        }

        .manager-header p {
          margin: 0;
          color: var(--color-text-light);
        }

        .projects-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .empty-state {
          text-align: center;
          padding: var(--spacing-2xl);
          background: var(--color-bg-alt);
          border-radius: var(--radius-lg);
          color: var(--color-text-light);
        }

        .project-card {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--spacing-lg);
          padding: var(--spacing-lg);
          background: var(--color-bg-alt);
          border-radius: var(--radius-lg);
          transition: var(--transition);
        }

        .project-card:hover {
          box-shadow: var(--shadow-md);
        }

        .project-info {
          flex: 1;
        }

        .project-info h4 {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--color-text);
        }

        .project-info p {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--color-text-light);
        }

        .project-meta {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .tech-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          background: white;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          color: var(--color-text-light);
        }

        .featured-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          background: #ffc107;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
          color: #000;
        }

        .project-actions {
          display: flex;
          gap: var(--spacing-sm);
          flex-shrink: 0;
        }

        .btn-sm {
          padding: var(--spacing-xs) var(--spacing-md);
          font-size: 0.9rem;
        }

        .btn-danger {
          background-color: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background-color: #c82333;
        }

        .project-form-container {
          background: var(--color-bg-alt);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xl);
          padding-bottom: var(--spacing-md);
          border-bottom: 2px solid #e0e0e0;
        }

        .form-header h3 {
          margin: 0;
          font-size: 1.5rem;
        }

        .project-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }

        .form-section {
          background: white;
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
        }

        .form-section h4 {
          margin: 0 0 var(--spacing-lg) 0;
          color: var(--color-text);
          font-size: 1.1rem;
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

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
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
          min-height: 80px;
        }

        .form-help {
          display: block;
          margin-top: var(--spacing-xs);
          font-size: 0.875rem;
          color: var(--color-text-light);
        }

        .uploaded-file-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          margin-top: var(--spacing-xs);
          padding: var(--spacing-sm);
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          color: #155724;
        }

        .uploaded-file-info svg {
          width: 16px;
          height: 16px;
        }

        .uploaded-file-info a {
          color: #155724;
          text-decoration: underline;
          margin-left: auto;
        }

        .uploaded-file-info a:hover {
          color: #0c3d1a;
        }

        .form-actions {
          display: flex;
          gap: var(--spacing-md);
          padding-top: var(--spacing-md);
        }

        .btn-lg {
          padding: var(--spacing-md) var(--spacing-xl);
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .manager-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }

          .project-card {
            flex-direction: column;
          }

          .project-actions {
            width: 100%;
          }

          .project-actions button {
            flex: 1;
          }

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
