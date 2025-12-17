'use client'

import { useState, useEffect } from 'react';
import { getYouTubeVideoId, isYouTubeUrl, getYouTubeEmbedUrl } from '@/lib/youtube';
import ResumePDFViewer from './ResumePDFViewer';

export default function ProjectMediaGallery({ projectId, projectTitle }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
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
            setCurrentIndex(0);
          } else if (pdfs.length > 0) {
            setActiveType('pdfs');
            setCurrentIndex(0);
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

  const activeList = activeType === 'videos' ? videos : pdfs;
  const activeMedia = activeList[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : activeList.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < activeList.length - 1 ? prev + 1 : 0));
  };

  const showNavigation = activeList.length > 1;

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
                setCurrentIndex(0);
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
                setCurrentIndex(0);
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
              {/* Navigation Header with Arrows */}
              <div className="media-header">
                <div className="header-content">
                  <h3>{activeMedia.title}</h3>
                  {activeMedia.description && (
                    <p className="media-description">{activeMedia.description}</p>
                  )}
                </div>
                
                {/* Arrow Navigation - only show if multiple items */}
                {showNavigation && (
                  <div className="arrow-navigation">
                    <button 
                      onClick={handlePrevious}
                      className="arrow-button"
                      title="Previous"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="navigation-counter">
                      {currentIndex + 1} / {activeList.length}
                    </span>
                    <button 
                      onClick={handleNext}
                      className="arrow-button"
                      title="Next"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
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
                  <ResumePDFViewer 
                    pdfUrl={activeMedia.url}
                    title=""
                    showHeader={false}
                  />
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .media-gallery {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        :global(.dark) .media-gallery {
          background: rgb(31 41 55);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4);
        }

        .gallery-container {
          display: flex;
          flex-direction: column;
        }

        .type-selector {
          display: flex;
          background: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
        }

        :global(.dark) .type-selector {
          background: rgb(55 65 81);
          border-bottom-color: rgb(75 85 99);
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

        :global(.dark) .type-button {
          color: rgb(209 213 219);
        }

        :global(.dark) .type-button:hover {
          background: rgb(55 65 81);
          color: rgb(243 244 246);
        }

        :global(.dark) .type-button.active {
          background: rgb(31 41 55);
          color: var(--color-primary, #3b82f6);
        }

        .display-area {
          padding: 2rem;
          background: white;
        }

        :global(.dark) .display-area {
          background: rgb(31 41 55);
        }

        .media-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .header-content {
          flex: 1;
        }

        .media-header h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          color: #111827;
        }

        :global(.dark) .media-header h3 {
          color: rgb(243 244 246);
        }

        .media-description {
          margin: 0;
          color: #6b7280;
          font-size: 1rem;
          line-height: 1.6;
        }

        :global(.dark) .media-description {
          color: rgb(209 213 219);
        }

        .arrow-navigation {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .arrow-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
        }

        .arrow-button:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
        }

        .arrow-button:active {
          transform: scale(0.95);
        }

        .navigation-counter {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          min-width: 3rem;
          text-align: center;
        }

        :global(.dark) .navigation-counter {
          color: rgb(209 213 219);
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


        @media (max-width: 768px) {
          .display-area {
            padding: 1rem;
          }

          .media-header {
            flex-direction: column;
            gap: 1rem;
          }

          .media-header h3 {
            font-size: 1.25rem;
          }

          .arrow-navigation {
            width: 100%;
            justify-content: center;
          }

          .type-button {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
          }

          .type-button span {
            display: none;
          }


          .arrow-button {
            width: 2.25rem;
            height: 2.25rem;
          }
        }
      `}</style>
    </div>
  );
}
