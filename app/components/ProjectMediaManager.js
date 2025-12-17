'use client'

import { useState, useEffect } from 'react';

export default function ProjectMediaManager({ projectId, onClose }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const [uploadingPDF, setUploadingPDF] = useState(false);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  const [formData, setFormData] = useState({
    media_type: 'video',
    title: '',
    description: '',
    url: '',
    file_key: '',
    display_order: 0
  });

  useEffect(() => {
    fetchMedia();
  }, [projectId]);

  const fetchMedia = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/media`);
      const data = await response.json();
      
      if (data.success) {
        setMedia(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
      setMessage({ type: 'error', text: 'Failed to load media' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      media_type: 'video',
      title: '',
      description: '',
      url: '',
      file_key: '',
      display_order: 0
    });
    setShowAddForm(false);
    setEditingMedia(null);
    setHasOrderChanges(false);
  };

  const handleEdit = (item) => {
    if (hasOrderChanges) {
      if (!confirm('You have unsaved order changes. Do you want to discard them?')) {
        return;
      }
      setHasOrderChanges(false);
    }
    setEditingMedia(item);
    setFormData({
      media_type: item.media_type,
      title: item.title,
      description: item.description || '',
      url: item.url,
      file_key: item.file_key || '',
      display_order: item.display_order || 0
    });
    setShowAddForm(true);
    setMessage({ type: '', text: '' });
  };

  const moveItem = (index, direction, mediaType) => {
    const items = mediaType === 'video' ? videos : pdfs;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= items.length) return;

    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    
    // Update the full media array
    const updatedMedia = [...media];
    const itemsWithType = updatedMedia.filter(m => m.media_type === mediaType);
    const otherItems = updatedMedia.filter(m => m.media_type !== mediaType);
    
    // Replace the items of this type with the reordered ones
    const finalMedia = [...otherItems, ...newItems];
    
    setMedia(finalMedia);
    setHasOrderChanges(true);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    setMessage({ type: '', text: '' });

    try {
      // Update display_order for all items based on their position
      const updates = media.map((item, index) => ({
        media_id: item.id,
        display_order: index
      }));

      // Send updates to API
      const promises = updates.map(update =>
        fetch(`/api/projects/${projectId}/media`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(update)
        })
      );

      await Promise.all(promises);

      setMessage({ type: 'success', text: 'Media order saved successfully!' });
      setHasOrderChanges(false);
      await fetchMedia();
    } catch (error) {
      console.error('Error saving order:', error);
      setMessage({ type: 'error', text: 'Failed to save order' });
    } finally {
      setSavingOrder(false);
    }
  };

  const cancelOrderChanges = async () => {
    setHasOrderChanges(false);
    await fetchMedia();
    setMessage({ type: '', text: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Please select a PDF file' });
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'PDF file must be less than 20MB' });
      return;
    }

    setUploadingPDF(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload/project-pdf', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          url: data.url,
          file_key: data.fileKey
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
      const method = editingMedia ? 'PUT' : 'POST';
      const bodyData = editingMedia 
        ? { ...formData, media_id: editingMedia.id }
        : formData;

      const response = await fetch(`/api/projects/${projectId}/media`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: editingMedia ? 'Media updated successfully!' : 'Media added successfully!' 
        });
        await fetchMedia();
        resetForm();
      } else {
        setMessage({ type: 'error', text: data.error || `Failed to ${editingMedia ? 'update' : 'add'} media` });
      }
    } catch (error) {
      console.error(`Error ${editingMedia ? 'updating' : 'adding'} media:`, error);
      setMessage({ type: 'error', text: `An error occurred while ${editingMedia ? 'updating' : 'adding'} media` });
    }
  };

  const handleDelete = async (mediaId) => {
    if (!confirm('Are you sure you want to delete this media? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/media?media_id=${mediaId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Media deleted successfully!' });
        await fetchMedia();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete media' });
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      setMessage({ type: 'error', text: 'An error occurred while deleting' });
    }
  };

  const videos = media.filter(m => m.media_type === 'video');
  const pdfs = media.filter(m => m.media_type === 'pdf');

  if (loading) {
    return <div className="loading">Loading media...</div>;
  }

  return (
    <div className="media-manager">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Manage Project Media</h3>
            <button onClick={onClose} className="close-button">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {message.text && (
            <div className={`message message-${message.type}`}>
              {message.text}
            </div>
          )}

          {!showAddForm ? (
            <>
              <div className="media-summary">
                <div className="summary-card">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  <span className="count">{videos.length}</span>
                  <span className="label">Videos</span>
                </div>
                <div className="summary-card">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <span className="count">{pdfs.length}</span>
                  <span className="label">PDFs</span>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  onClick={() => setShowAddForm(true)} 
                  className="btn btn-primary"
                  disabled={hasOrderChanges}
                >
                  + Add Media
                </button>
                {hasOrderChanges && (
                  <>
                    <button 
                      onClick={saveOrder}
                      className="btn btn-success"
                      disabled={savingOrder}
                    >
                      {savingOrder ? 'Saving...' : 'Save Order'}
                    </button>
                    <button 
                      onClick={cancelOrderChanges}
                      className="btn btn-secondary"
                      disabled={savingOrder}
                    >
                      Cancel Changes
                    </button>
                  </>
                )}
              </div>

              {/* Videos Section */}
              {videos.length > 0 && (
                <div className="media-section">
                  <h4>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    Videos ({videos.length})
                  </h4>
                  <div className="media-list">
                    {videos.map((item, index) => (
                      <div key={item.id} className="media-item">
                        <div className="order-controls">
                          <button
                            onClick={() => moveItem(index, 'up', 'video')}
                            disabled={index === 0}
                            className="order-btn"
                            title="Move up"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => moveItem(index, 'down', 'video')}
                            disabled={index === videos.length - 1}
                            className="order-btn"
                            title="Move down"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        <div className="media-info">
                          <h5>{item.title}</h5>
                          {item.description && <p>{item.description}</p>}
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="media-link">
                            View Video →
                          </a>
                        </div>
                        <div className="media-actions">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="btn btn-sm btn-secondary"
                            disabled={hasOrderChanges}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="btn btn-sm btn-danger"
                            disabled={hasOrderChanges}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PDFs Section */}
              {pdfs.length > 0 && (
                <div className="media-section">
                  <h4>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    PDFs ({pdfs.length})
                  </h4>
                  <div className="media-list">
                    {pdfs.map((item, index) => (
                      <div key={item.id} className="media-item">
                        <div className="order-controls">
                          <button
                            onClick={() => moveItem(index, 'up', 'pdf')}
                            disabled={index === 0}
                            className="order-btn"
                            title="Move up"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => moveItem(index, 'down', 'pdf')}
                            disabled={index === pdfs.length - 1}
                            className="order-btn"
                            title="Move down"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        <div className="media-info">
                          <h5>{item.title}</h5>
                          {item.description && <p>{item.description}</p>}
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="media-link">
                            View PDF →
                          </a>
                        </div>
                        <div className="media-actions">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="btn btn-sm btn-secondary"
                            disabled={hasOrderChanges}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="btn btn-sm btn-danger"
                            disabled={hasOrderChanges}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {media.length === 0 && (
                <div className="empty-state">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p>No media added yet</p>
                  <p className="sub-text">Add videos and PDFs to showcase your project</p>
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleSubmit} className="media-form">
              <h4 className="form-title">{editingMedia ? 'Edit Media' : 'Add New Media'}</h4>
              
              <div className="form-group">
                <label htmlFor="media_type">Media Type *</label>
                <select
                  id="media_type"
                  name="media_type"
                  value={formData.media_type}
                  onChange={handleChange}
                  className="form-input"
                  required
                  disabled={!!editingMedia}
                >
                  <option value="video">Video (YouTube)</option>
                  <option value="pdf">PDF Document</option>
                </select>
                {editingMedia && <small className="form-help">Media type cannot be changed when editing</small>}
              </div>

              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., Product Demo, Technical Documentation"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description (optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="3"
                  placeholder="Brief description of this media..."
                />
              </div>

              {formData.media_type === 'video' ? (
                <div className="form-group">
                  <label htmlFor="url">YouTube URL *</label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://youtube.com/watch?v=..."
                    required={!editingMedia}
                  />
                  {editingMedia && <small className="form-help">Leave blank to keep existing URL</small>}
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="pdf_upload">Upload PDF *</label>
                  <input
                    type="file"
                    id="pdf_upload"
                    accept="application/pdf"
                    onChange={handlePDFUpload}
                    disabled={uploadingPDF}
                    className="form-input"
                    required={!formData.url && !editingMedia}
                  />
                  <small className="form-help">
                    {uploadingPDF ? 'Uploading PDF...' : editingMedia ? 'Upload a new PDF to replace the existing one (optional)' : 'Upload a PDF file (max 20MB)'}
                  </small>
                  {formData.url && (
                    <div className="uploaded-file-info">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      <span>PDF uploaded</span>
                      <a href={formData.url} target="_blank" rel="noopener noreferrer">View</a>
                    </div>
                  )}
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={uploadingPDF}>
                  {editingMedia ? 'Update Media' : 'Add Media'}
                </button>
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 1rem;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 2rem;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e0e0e0;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.5rem;
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          color: #6b7280;
          transition: color 0.2s;
        }

        .close-button:hover {
          color: #374151;
        }

        .message {
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
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

        .media-summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .summary-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 0.75rem;
          gap: 0.5rem;
        }

        .summary-card svg {
          width: 2rem;
          height: 2rem;
        }

        .summary-card .count {
          font-size: 2rem;
          font-weight: bold;
        }

        .summary-card .label {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .action-buttons {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .action-buttons .btn {
          flex: 1;
          min-width: 150px;
        }

        .media-section {
          margin-bottom: 2rem;
        }

        .media-section h4 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          color: #374151;
        }

        .media-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .media-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }

        .order-controls {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex-shrink: 0;
        }

        .order-btn {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.25rem;
          cursor: pointer;
          transition: all 0.2s;
          color: #6b7280;
        }

        .order-btn:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #9ca3af;
          color: #374151;
        }

        .order-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .media-item:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .media-info {
          flex: 1;
        }

        .media-info h5 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          color: #111827;
        }

        .media-info p {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .media-link {
          display: inline-block;
          font-size: 0.875rem;
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }

        .media-actions {
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .media-link:hover {
          text-decoration: underline;
        }

        .form-title {
          margin: 0 0 1.5rem 0;
          font-size: 1.25rem;
          color: #111827;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: #6b7280;
        }

        .empty-state svg {
          margin: 0 auto 1rem;
          color: #d1d5db;
        }

        .empty-state p {
          margin: 0.5rem 0;
          font-size: 1.125rem;
        }

        .empty-state .sub-text {
          font-size: 0.875rem;
          color: #9ca3af;
        }

        .media-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 0;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .form-textarea {
          resize: vertical;
        }

        .form-help {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .uploaded-file-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          padding: 0.75rem;
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #155724;
        }

        .uploaded-file-info svg {
          width: 1rem;
          height: 1rem;
        }

        .uploaded-file-info a {
          color: #155724;
          text-decoration: underline;
          margin-left: auto;
        }

        .form-actions {
          display: flex;
          gap: 0.75rem;
          padding-top: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background-color: #3b82f6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background-color: #e5e7eb;
          color: #374151;
        }

        .btn-secondary:hover {
          background-color: #d1d5db;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .btn-danger {
          background-color: #dc3545;
          color: white;
        }

        .btn-success {
          background-color: #28a745;
          color: white;
        }

        .btn-success:hover:not(:disabled) {
          background-color: #218838;
        }

        .btn-danger:hover {
          background-color: #c82333;
        }

        @media (max-width: 768px) {
          .modal-content {
            padding: 1.5rem;
          }

          .media-summary {
            grid-template-columns: 1fr;
          }

          .media-item {
            flex-direction: column;
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
