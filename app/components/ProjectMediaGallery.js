'use client'

import { useState, useEffect } from 'react';
import { getYouTubeVideoId, isYouTubeUrl, getYouTubeEmbedUrl } from '@/lib/youtube';
import ResumePDFViewer from './ResumePDFViewer';

export default function ProjectMediaGallery({ projectId, projectTitle }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMediaId, setActiveMediaId] = useState(null);
  const [activeType, setActiveType] = useState('videos'); // 'videos' or 'pdfs'

  useEffect(() => {
    fetchMedia();
  }, [projectId]);

  const fetchMedia = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/media`);
      const data = await response.json();
      
      if (data.success) {
        const mediaItems = data.data || [];
        setMedia(mediaItems);
        
        // Set initial active media
        if (mediaItems.length > 0) {
          const videos = mediaItems.filter(m => m.media_type === 'video');
          const pdfs = mediaItems.filter(m => m.media_type === 'pdf');
          
          if (videos.length > 0) {
            setActiveType('videos');
            setActiveMediaId(videos[0].id);
          } else if (pdfs.length > 0) {
            setActiveType('pdfs');
            setActiveMediaId(pdfs[0].id);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const videos = media.filter(m => m.media_type === 'video');
  const pdfs = media.filter(m => m.media_type === 'pdf');
  
  // Don't render if no media
  if (loading || media.length === 0) {
    return null;
  }

  const activeMedia = media.find(m => m.id === activeMediaId);
  const activeList = activeType === 'videos' ? videos : pdfs;

  return (
    <div className="media-gallery">
      <div className="gallery-container">
        {/* Type Selector - only show if both types exist */}
        {videos.length > 0 && pdfs.length > 0 && (
          <div className="type-selector">
            <button
              className={`type-button ${activeType === 'videos' ? 'active' : ''}`}
              onClick={() => {
                setActiveType('videos');
                setActiveMediaId(videos[0].id);
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              <span>Videos ({videos.length})</span>
            </button>
            <button
              className={`type-button ${activeType === 'pdfs' ? 'active' : ''}`}
              onClick={() => {
                setActiveType('pdfs');
                setActiveMediaId(pdfs[0].id);
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <span>Documents ({pdfs.length})</span>
            </button>
          </div>
        )}

        {/* Main Display Area */}
        <div className="display-area">
          {activeMedia && (
            <>
              {/* Media Title and Description */}
              <div className="media-header">
                <h3>{activeMedia.title}</h3>
                {activeMedia.description && (
                  <p className="media-description">{activeMedia.description}</p>
                )}
              </div>

              {/* Media Content */}
              <div className="media-content">
                {activeMedia.media_type === 'video' && isYouTubeUrl(activeMedia.url) ? (
                  <div className="video-wrapper">
                    <iframe
                      width="100%"
                      height="100%"
                      src={getYouTubeEmbedUrl(getYouTubeVideoId(activeMedia.url))}
                      title={activeMedia.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="video-iframe"
                    ></iframe>
                  </div>
                ) : activeMedia.media_type === 'pdf' ? (
                  <div className="pdf-wrapper">
                    <ResumePDFViewer pdfUrl={activeMedia.url} />
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>

        {/* Navigation Sidebar - only show if multiple items of active type */}
        {activeList.length > 1 && (
          <div className="navigation-sidebar">
            <h4>
              {activeType === 'videos' ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  All Videos
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  All Documents
                </>
              )}
            </h4>
            <div className="nav-items">
              {activeList.map((item, index) => (
                <button
                  key={item.id}
                  className={`nav-item ${item.id === activeMediaId ? 'active' : ''}`}
                  onClick={() => setActiveMediaId(item.id)}
                >
                  <div className="nav-item-number">{index + 1}</div>
                  <div className="nav-item-info">
                    <div className="nav-item-title">{item.title}</div>
                    {item.description && (
                      <div className="nav-item-description">{item.description}</div>
                    )}
                  </div>
                  {item.id === activeMediaId && (
                    <svg className="nav-item-check" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .media-gallery {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        .gallery-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }

        .type-selector {
          display: flex;
          background: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
        }

        .type-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          font-size: 1rem;
          font-weight: 500;
          color: #6b7280;
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .type-button:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .type-button.active {
          color: var(--color-primary, #3b82f6);
          background: white;
          border-bottom-color: var(--color-primary, #3b82f6);
        }

        .display-area {
          padding: 2rem;
          background: white;
        }

        .media-header {
          margin-bottom: 1.5rem;
        }

        .media-header h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          color: #111827;
        }

        .media-description {
          margin: 0;
          color: #6b7280;
          font-size: 1rem;
          line-height: 1.6;
        }

        .media-content {
          width: 100%;
        }

        .video-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .video-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .pdf-wrapper {
          min-height: 600px;
          max-height: 800px;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .navigation-sidebar {
          background: #f9fafb;
          border-top: 2px solid #e5e7eb;
          padding: 1.5rem;
        }

        .navigation-sidebar h4 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 1rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .navigation-sidebar h4 svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        .nav-items {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          background: white;
          border: 2px solid transparent;
          border-radius: 0.5rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }

        .nav-item:hover {
          border-color: #e5e7eb;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .nav-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
        }

        .nav-item-number {
          flex-shrink: 0;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 0.375rem;
          font-weight: 700;
          font-size: 0.875rem;
        }

        .nav-item.active .nav-item-number {
          background: rgba(255, 255, 255, 0.2);
        }

        .nav-item-info {
          flex: 1;
        }

        .nav-item-title {
          font-weight: 600;
          font-size: 0.9375rem;
          margin-bottom: 0.25rem;
          color: inherit;
        }

        .nav-item-description {
          font-size: 0.8125rem;
          opacity: 0.8;
          line-height: 1.4;
        }

        .nav-item-check {
          flex-shrink: 0;
          width: 1.25rem;
          height: 1.25rem;
          opacity: 0.9;
        }

        @media (min-width: 1024px) {
          .gallery-container {
            grid-template-columns: 1fr 320px;
          }

          .type-selector {
            grid-column: 1 / -1;
          }

          .navigation-sidebar {
            border-top: none;
            border-left: 2px solid #e5e7eb;
            max-height: 800px;
            overflow-y: auto;
          }
        }

        @media (max-width: 768px) {
          .display-area {
            padding: 1rem;
          }

          .media-header h3 {
            font-size: 1.25rem;
          }

          .type-button {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
          }

          .type-button span {
            display: none;
          }

          .pdf-wrapper {
            min-height: 400px;
          }

          .nav-item {
            padding: 0.75rem;
          }

          .nav-item-number {
            width: 1.75rem;
            height: 1.75rem;
            font-size: 0.8125rem;
          }
        }
      `}</style>
    </div>
  );
}
